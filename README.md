# AEROGRID CMS

AEROGRID 웹사이트를 위한 가벼운 커스텀 CMS 시스템입니다.

## 🚀 주요 기능

### 콘텐츠 관리
- **히어로 섹션**: 배경 이미지 교체, 타이틀 및 서브 문구 수정
- **비전 섹션**: 롤링 카드 이미지(최대 5개), Earth 배경 이미지, 텍스트 관리
- **비즈니스 섹션**: 카드 이미지 교체, 타이틀 및 버튼 문구 수정
- **미디어 섹션**: 에디터를 활용한 갤러리 게시판 관리
- **채용 섹션**: 카테고리 관리, 공고 작성(에디터), 기간 설정
- **푸터**: 타이틀, 버튼 문구, 로고, SNS 링크 관리
- **SEO**: 메타데이터, Open Graph 설정

### 기술적 특징
- JSON 기반 콘텐츠 스키마
- 실시간 미리보기
- 이미지 자동 최적화 및 썸네일 생성
- JWT 기반 인증
- 자동 백업 시스템
- 반응형 관리자 인터페이스

## 📁 프로젝트 구조

```
aerogrid/
├── index.html              # 메인 페이지
├── styles.css              # 메인 스타일
├── script.js               # 메인 스크립트 (CMS 로더 포함)
├── content.json            # 콘텐츠 데이터
├── server.js               # Express 서버
├── package.json            # 의존성 관리
├── admin/                  # 관리자 페이지
│   ├── admin.html          # 관리자 인터페이스
│   ├── admin.css           # 관리자 스타일
│   └── admin.js            # 관리자 스크립트
├── uploads/                # 업로드된 파일
│   ├── optimized/          # 최적화된 이미지
│   └── thumbnails/         # 썸네일 이미지
└── backups/                # 자동 백업 파일
```

## 🛠 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 설정
서버 실행 전 다음 환경 변수를 설정하세요:

```bash
# 기본 설정 (선택사항)
export PORT=3000
export NODE_ENV=development
export JWT_SECRET=your-super-secret-jwt-key-here
export ADMIN_PASSWORD=your-admin-password-here
```

### 3. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 4. 관리자 페이지 접속
브라우저에서 `http://localhost:3000/admin/admin.html`로 접속

## 🔐 기본 인증 정보

- **관리자 비밀번호**: `aerogrid2025!` (환경 변수로 변경 가능)
- **JWT 시크릿**: `aerogrid-cms-secret-key-2025` (환경 변수로 변경 가능)

## 📝 사용법

### 1. 로그인
관리자 페이지에서 기본 비밀번호로 로그인

### 2. 콘텐츠 편집
- 상단 탭을 클릭하여 원하는 섹션 선택
- 텍스트 입력, 이미지 업로드, 설정 변경
- 실시간으로 변경사항 확인

### 3. 이미지 업로드
- 드래그 앤 드롭 또는 클릭하여 이미지 업로드
- 자동으로 최적화 및 썸네일 생성
- JPEG, PNG, WebP, GIF 형식 지원

### 4. 저장 및 미리보기
- **미리보기**: 새 창에서 변경사항 확인
- **저장**: 실제 사이트에 변경사항 적용

## 🔧 API 엔드포인트

### 인증
- `POST /auth/verify` - 관리자 로그인

### 파일 관리
- `POST /api/upload` - 단일 파일 업로드
- `POST /api/upload-multiple` - 다중 파일 업로드
- `DELETE /api/file/:filename` - 파일 삭제

### 콘텐츠 관리
- `GET /api/content` - 콘텐츠 조회
- `POST /api/save-content` - 콘텐츠 저장

### 백업 관리
- `GET /api/backups` - 백업 목록 조회
- `POST /api/restore-backup` - 백업 복원

### 시스템
- `GET /api/health` - 서버 상태 확인

## 🛡 보안 기능

- JWT 토큰 기반 인증
- Rate limiting (15분당 100 요청)
- 파일 타입 검증
- 파일 크기 제한 (10MB)
- CORS 설정
- Helmet.js 보안 헤더

## 📱 반응형 지원

관리자 인터페이스는 모든 디바이스에서 최적화되어 있습니다:
- 데스크톱 (1200px+)
- 태블릿 (768px - 1199px)
- 모바일 (767px 이하)

## 🔄 백업 시스템

- 콘텐츠 저장 시 자동 백업 생성
- 30일간 백업 파일 보관 (설정 가능)
- 수동 백업 복원 기능

## 🚀 배포 가이드

### 1. 프로덕션 환경 설정
```bash
export NODE_ENV=production
export PORT=80
export JWT_SECRET=your-production-secret
export ADMIN_PASSWORD=your-production-password
```

### 2. Nginx 설정 예시
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. PM2로 프로세스 관리
```bash
npm install -g pm2
pm2 start server.js --name "aerogrid-cms"
pm2 startup
pm2 save
```

## 🐛 문제 해결

### 일반적인 문제들

1. **이미지 업로드 실패**
   - 파일 크기 확인 (최대 10MB)
   - 파일 형식 확인 (JPEG, PNG, WebP, GIF만 지원)

2. **로그인 실패**
   - 기본 비밀번호 확인: `aerogrid2025!`
   - 환경 변수 `ADMIN_PASSWORD` 설정 확인

3. **콘텐츠 저장 실패**
   - 서버 권한 확인
   - 디스크 공간 확인

### 로그 확인
```bash
# 서버 로그 확인
pm2 logs aerogrid-cms

# 실시간 로그 모니터링
pm2 logs aerogrid-cms --lines 100
```

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 이슈를 등록해 주세요.

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.