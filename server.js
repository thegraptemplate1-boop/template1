const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 환경 변수
const JWT_SECRET = process.env.JWT_SECRET || 'aerogrid-cms-secret-key-2025';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aerogrid2025!';
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const CONTENT_FILE = path.join(__dirname, 'content.json');

// 업로드 디렉토리 생성
fs.ensureDirSync(UPLOAD_DIR);
fs.ensureDirSync(path.join(UPLOAD_DIR, 'thumbnails'));

// 미들웨어 설정
app.use(helmet({
    contentSecurityPolicy: false, // 개발 환경에서 CSP 비활성화
    crossOriginEmbedderPolicy: false
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서빙
app.use(express.static(__dirname));

// 업로드 파일 서빙 (CORS 헤더 추가)
app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}, express.static(UPLOAD_DIR));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100 요청
    message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext;
        cb(null, name);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('지원하지 않는 파일 형식입니다. JPEG, PNG, WebP, GIF, MP4만 허용됩니다.'));
        }
    }
});

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: '토큰이 필요합니다' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: '유효하지 않은 토큰입니다' });
        }
        req.user = user;
        next();
    });
};

// 이미지 최적화 함수
async function optimizeImage(inputPath, outputPath, options = {}) {
    const { width = 1920, height = 1080, quality = 85 } = options;
    
    try {
        // 파일 확장자 확인
        const ext = path.extname(inputPath).toLowerCase();
        
        // SVG 파일이나 비디오 파일은 그대로 복사
        if (ext === '.svg' || ['.mp4', '.webm', '.ogg', '.mov', '.avi'].includes(ext)) {
            await fs.copy(inputPath, outputPath);
            return true;
        }
        
        // Sharp로 이미지 처리 시도
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // 지원하지 않는 형식은 복사
        if (!metadata.format || !['jpeg', 'png', 'gif', 'webp'].includes(metadata.format)) {
            await fs.copy(inputPath, outputPath);
            return true;
        }
        
        // 이미지 최적화
        await image
            .resize(width, height, { 
                fit: 'inside',
                withoutEnlargement: true 
            })
            .jpeg({ quality })
            .toFile(outputPath);
        return true;
    } catch (error) {
        console.error('이미지 최적화 실패:', error);
        // 최적화 실패 시 원본 파일 복사
        try {
            await fs.copy(inputPath, outputPath);
            return true;
        } catch (copyError) {
            console.error('파일 복사 실패:', copyError);
            return false;
        }
    }
}

// 썸네일 생성 함수
async function createThumbnail(inputPath, outputPath, size = 300) {
    try {
        // 파일 확장자 확인
        const ext = path.extname(inputPath).toLowerCase();
        
        // SVG 파일이나 비디오 파일은 썸네일 생성하지 않음
        if (ext === '.svg' || ['.mp4', '.webm', '.ogg', '.mov', '.avi'].includes(ext)) {
            return false;
        }
        
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // 지원하지 않는 형식은 썸네일 생성하지 않음
        if (!metadata.format || !['jpeg', 'png', 'gif', 'webp'].includes(metadata.format)) {
            return false;
        }
        
        await image
            .resize(size, size, { 
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 })
            .toFile(outputPath);
        return true;
    } catch (error) {
        console.error('썸네일 생성 실패:', error);
        return false;
    }
}

// API 라우트

// 인증
app.post('/auth/verify', async (req, res) => {
    try {
        const { password } = req.body;
        
        if (password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                { 
                    user: 'admin',
                    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24시간
                },
                JWT_SECRET
            );
            
            res.json({ 
                success: true, 
                token,
                message: '로그인 성공'
            });
        } else {
            res.status(401).json({ 
                success: false, 
                error: '비밀번호가 올바르지 않습니다' 
            });
        }
    } catch (error) {
        console.error('인증 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '서버 오류가 발생했습니다' 
        });
    }
});

// 파일 업로드
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: '파일이 선택되지 않았습니다' 
            });
        }

        const originalPath = req.file.path;
        const filename = req.file.filename;
        const optimizedPath = path.join(UPLOAD_DIR, 'optimized', filename);
        const thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', filename);

        // 최적화된 디렉토리 생성
        await fs.ensureDir(path.dirname(optimizedPath));

        // 이미지 최적화
        const optimized = await optimizeImage(originalPath, optimizedPath);
        
        // 썸네일 생성
        const thumbnail = await createThumbnail(originalPath, thumbnailPath);

        // 원본 파일 삭제 (최적화된 버전 사용)
        if (optimized) {
            await fs.remove(originalPath);
        }

        const url = `/uploads/optimized/${filename}`;
        const thumbnailUrl = thumbnail ? `/uploads/thumbnails/${filename}` : url;

        res.json({
            success: true,
            url: url,
            thumbnail: thumbnailUrl,
            filename: filename,
            size: req.file.size,
            message: '업로드 성공'
        });

    } catch (error) {
        console.error('업로드 오류:', error);
        
        // 업로드된 파일 정리
        if (req.file) {
            await fs.remove(req.file.path).catch(() => {});
        }
        
        res.status(500).json({ 
            success: false, 
            error: error.message || '업로드 중 오류가 발생했습니다' 
        });
    }
});

// 다중 파일 업로드
app.post('/api/upload-multiple', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: '파일이 선택되지 않았습니다' 
            });
        }

        const results = [];
        
        for (const file of req.files) {
            try {
                const originalPath = file.path;
                const filename = file.filename;
                const optimizedPath = path.join(UPLOAD_DIR, 'optimized', filename);
                const thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', filename);

                // 최적화된 디렉토리 생성
                await fs.ensureDir(path.dirname(optimizedPath));

                // 이미지 최적화
                const optimized = await optimizeImage(originalPath, optimizedPath);
                
                // 썸네일 생성
                const thumbnail = await createThumbnail(originalPath, thumbnailPath);

                // 원본 파일 삭제
                if (optimized) {
                    await fs.remove(originalPath);
                }

                results.push({
                    success: true,
                    url: `/uploads/optimized/${filename}`,
                    thumbnail: thumbnail ? `/uploads/thumbnails/${filename}` : `/uploads/optimized/${filename}`,
                    filename: filename,
                    size: file.size
                });
            } catch (fileError) {
                console.error(`파일 ${file.filename} 처리 오류:`, fileError);
                results.push({
                    success: false,
                    filename: file.filename,
                    error: fileError.message
                });
            }
        }

        res.json({
            success: true,
            results: results,
            message: `${results.filter(r => r.success).length}개 파일 업로드 완료`
        });

    } catch (error) {
        console.error('다중 업로드 오류:', error);
        
        // 업로드된 파일들 정리
        if (req.files) {
            for (const file of req.files) {
                await fs.remove(file.path).catch(() => {});
            }
        }
        
        res.status(500).json({ 
            success: false, 
            error: '업로드 중 오류가 발생했습니다' 
        });
    }
});

// 콘텐츠 저장
app.post('/api/save-content', authenticateToken, async (req, res) => {
    try {
        const content = req.body;
        
        // 콘텐츠 유효성 검사
        if (!content || typeof content !== 'object') {
            return res.status(400).json({ 
                success: false, 
                error: '유효하지 않은 콘텐츠입니다' 
            });
        }

        // 백업 생성
        if (await fs.pathExists(CONTENT_FILE)) {
            const backupPath = path.join(__dirname, 'backups', `content-${Date.now()}.json`);
            await fs.ensureDir(path.dirname(backupPath));
            await fs.copy(CONTENT_FILE, backupPath);
        }

        // 콘텐츠 저장
        await fs.writeJson(CONTENT_FILE, content, { spaces: 2 });

        res.json({
            success: true,
            message: '콘텐츠가 저장되었습니다',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('콘텐츠 저장 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '콘텐츠 저장 중 오류가 발생했습니다' 
        });
    }
});

// 콘텐츠 조회
app.get('/api/content', async (req, res) => {
    try {
        if (await fs.pathExists(CONTENT_FILE)) {
            const content = await fs.readJson(CONTENT_FILE);
            res.json(content);
        } else {
            res.status(404).json({ 
                success: false, 
                error: '콘텐츠 파일을 찾을 수 없습니다' 
            });
        }
    } catch (error) {
        console.error('콘텐츠 조회 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '콘텐츠 조회 중 오류가 발생했습니다' 
        });
    }
});

// 백업 목록 조회
app.get('/api/backups', authenticateToken, async (req, res) => {
    try {
        const backupsDir = path.join(__dirname, 'backups');
        await fs.ensureDir(backupsDir);
        
        const files = await fs.readdir(backupsDir);
        const backups = files
            .filter(file => file.startsWith('content-') && file.endsWith('.json'))
            .map(file => {
                const stats = fs.statSync(path.join(backupsDir, file));
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            })
            .sort((a, b) => b.created - a.created);

        res.json({
            success: true,
            backups: backups
        });
    } catch (error) {
        console.error('백업 목록 조회 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '백업 목록 조회 중 오류가 발생했습니다' 
        });
    }
});

// 백업 복원
app.post('/api/restore-backup', authenticateToken, async (req, res) => {
    try {
        const { filename } = req.body;
        
        if (!filename) {
            return res.status(400).json({ 
                success: false, 
                error: '백업 파일명이 필요합니다' 
            });
        }

        const backupPath = path.join(__dirname, 'backups', filename);
        
        if (!await fs.pathExists(backupPath)) {
            return res.status(404).json({ 
                success: false, 
                error: '백업 파일을 찾을 수 없습니다' 
            });
        }

        // 현재 콘텐츠 백업
        if (await fs.pathExists(CONTENT_FILE)) {
            const currentBackupPath = path.join(__dirname, 'backups', `content-before-restore-${Date.now()}.json`);
            await fs.copy(CONTENT_FILE, currentBackupPath);
        }

        // 백업 복원
        await fs.copy(backupPath, CONTENT_FILE);

        res.json({
            success: true,
            message: '백업이 복원되었습니다'
        });

    } catch (error) {
        console.error('백업 복원 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '백업 복원 중 오류가 발생했습니다' 
        });
    }
});

// 파일 삭제
app.delete('/api/file/:filename', authenticateToken, async (req, res) => {
    try {
        const { filename } = req.params;
        
        if (!filename) {
            return res.status(400).json({ 
                success: false, 
                error: '파일명이 필요합니다' 
            });
        }

        const filePath = path.join(UPLOAD_DIR, filename);
        const optimizedPath = path.join(UPLOAD_DIR, 'optimized', filename);
        const thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', filename);

        // 파일들 삭제
        await Promise.all([
            fs.remove(filePath).catch(() => {}),
            fs.remove(optimizedPath).catch(() => {}),
            fs.remove(thumbnailPath).catch(() => {})
        ]);

        res.json({
            success: true,
            message: '파일이 삭제되었습니다'
        });

    } catch (error) {
        console.error('파일 삭제 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '파일 삭제 중 오류가 발생했습니다' 
        });
    }
});

// 헬스 체크
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 핸들러
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        error: '요청한 리소스를 찾을 수 없습니다' 
    });
});

// 에러 핸들러
app.use((error, req, res, next) => {
    console.error('서버 오류:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                error: '파일 크기가 너무 큽니다 (최대 10MB)' 
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                success: false, 
                error: '파일 개수가 너무 많습니다 (최대 10개)' 
            });
        }
    }
    
    res.status(500).json({ 
        success: false, 
        error: '서버 내부 오류가 발생했습니다' 
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 AEROGRID CMS 서버가 포트 ${PORT}에서 실행 중입니다`);
    console.log(`📁 업로드 디렉토리: ${UPLOAD_DIR}`);
    console.log(`📄 콘텐츠 파일: ${CONTENT_FILE}`);
    console.log(`🔐 관리자 비밀번호: ${ADMIN_PASSWORD}`);
    console.log(`🌐 관리자 페이지: http://localhost:${PORT}/admin/admin.html`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
    process.exit(0);
});
