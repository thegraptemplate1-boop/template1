// 관리자 페이지 JavaScript
class AdminCMS {
    constructor() {
        this.content = null;
        this.isAuthenticated = false;
        this.currentTab = 'hero';
        
        this.init();
    }
    
    async init() {
        // 인증 상태 확인
        this.checkAuth();
        
        // 이벤트 리스너 등록
        this.setupEventListeners();
        
        // 콘텐츠 로드
        await this.loadContent();
        
        // 폼 바인딩
        this.bindFormData();
        
        // 시간 표시 시작
        this.startTimeDisplay();
    }
    
    // 인증 상태 확인
    checkAuth() {
        const token = localStorage.getItem('admin_token');
        if (token && this.isValidToken(token)) {
            this.isAuthenticated = true;
            this.showAdminInterface();
        } else {
            this.showLoginModal();
        }
    }
    
    // 토큰 유효성 검사
    isValidToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }
    
    // 로그인 모달 표시
    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('adminInterface').style.display = 'none';
    }
    
    // 관리자 인터페이스 표시
    showAdminInterface() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminInterface').style.display = 'block';
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 로그인 폼
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // 로그아웃
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // 탭 전환
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // 저장 버튼
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveContent();
        });
        
        // 미리보기 버튼
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.previewContent();
        });
        
        // 이미지 업로드
        this.setupImageUpload();
        
        // 동적 아이템 추가
        this.setupDynamicItems();
        
        // 기존 업로드 존들 초기화
        this.setupDragAndDropForNewZones();
        
        // Earth 배경 이미지 특별 처리
        this.setupEarthImageUpload();
    }
    
    // Earth 배경 이미지 업로드 특별 설정
    setupEarthImageUpload() {
        // DOM이 완전히 로드될 때까지 대기
        setTimeout(() => {
            const earthUploadZone = document.querySelector('[data-dropzone="vision-earth"]');
            const earthInput = document.getElementById('visionEarthUpload');
            
            console.log('Earth 배경 이미지 요소 검색 결과:', {
                earthUploadZone: !!earthUploadZone,
                earthInput: !!earthInput,
                earthUploadZoneElement: earthUploadZone,
                earthInputElement: earthInput
            });
            
            if (!earthUploadZone || !earthInput) {
                console.error('Earth 배경 이미지 업로드 요소를 찾을 수 없습니다');
                console.error('earthUploadZone:', earthUploadZone);
                console.error('earthInput:', earthInput);
                return;
            }
            
            // 이미 설정되었는지 확인
            if (earthUploadZone.hasAttribute('data-earth-setup')) {
                console.log('Earth 배경 이미지 업로드가 이미 설정되어 있습니다');
                return;
            }
            
            console.log('Earth 배경 이미지 업로드 설정 시작');
            
            // 설정 완료 표시
            earthUploadZone.setAttribute('data-earth-setup', 'true');
            
            // 강력한 클릭 이벤트 (여러 방식으로 추가)
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Earth zone 클릭됨 - 이벤트:', e);
                console.log('Earth input 요소:', earthInput);
                
                try {
                    earthInput.click();
                    console.log('Earth input.click() 실행 성공');
                } catch (error) {
                    console.error('Earth input.click() 실행 실패:', error);
                }
            };
            
            // zone 전체에 클릭 이벤트
            earthUploadZone.addEventListener('click', handleClick, true);
            
            // placeholder에도 클릭 이벤트
            const placeholder = earthUploadZone.querySelector('.upload-placeholder');
            if (placeholder) {
                placeholder.addEventListener('click', handleClick, true);
                console.log('Earth placeholder 클릭 이벤트 추가됨');
            }
            
            // input 변경 이벤트
            earthInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    console.log('Earth 배경 이미지 파일 선택됨:', file.name);
                    this.handleFileUpload(file, 'visionEarthPreview', 'vision.backgroundImage');
                }
            });
            
            // 드래그 앤 드롭 이벤트
            earthUploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                earthUploadZone.classList.add('dragover');
            });
            
            earthUploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                if (!earthUploadZone.contains(e.relatedTarget)) {
                    earthUploadZone.classList.remove('dragover');
                }
            });
            
            earthUploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                earthUploadZone.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log('Earth 배경 이미지 드롭됨:', files[0].name);
                    this.handleFileUpload(files[0], 'visionEarthPreview', 'vision.backgroundImage');
                }
            });
            
            // 테스트용 직접 클릭 함수 (전역에서 접근 가능)
            window.testEarthUpload = () => {
                console.log('테스트: Earth 업로드 직접 실행');
                earthInput.click();
            };
            
            console.log('Earth 배경 이미지 업로드 설정 완료');
            console.log('테스트: 브라우저 콘솔에서 testEarthUpload() 실행해보세요');
        }, 1000); // 1초 후 실행
    }
    
    // 로그인 처리
    async handleLogin() {
        const password = document.getElementById('password').value;
        
        try {
            this.showLoading();
            
            const response = await fetch('/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                localStorage.setItem('admin_token', result.token);
                this.isAuthenticated = true;
                this.showAdminInterface();
                this.showToast('로그인 성공', 'success');
            } else {
                this.showToast('비밀번호가 올바르지 않습니다', 'error');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            this.showToast('로그인 중 오류가 발생했습니다', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // 로그아웃
    logout() {
        localStorage.removeItem('admin_token');
        this.isAuthenticated = false;
        this.showLoginModal();
        this.showToast('로그아웃되었습니다', 'success');
    }
    
    // 탭 전환
    switchTab(tabName) {
        // 모든 탭 비활성화
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 선택된 탭 활성화
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
    }
    
    // 콘텐츠 로드
    async loadContent() {
        try {
            const response = await fetch('/content.json');
            this.content = await response.json();
            console.log('콘텐츠 로드 완료:', this.content);
        } catch (error) {
            console.error('콘텐츠 로드 실패:', error);
            this.showToast('콘텐츠 로드에 실패했습니다', 'error');
        }
    }
    
    // 폼 데이터 바인딩
    bindFormData() {
        if (!this.content) return;
        
        // Hero 섹션
        if (this.content.hero) {
            this.renderHeroSlides();
        }
        
        // Vision 섹션
        if (this.content.vision) {
            document.getElementById('visionTitle').value = this.content.vision.title || '';
            document.getElementById('visionSubtitle').value = this.content.vision.subtitle || '';
            this.renderVisionRollingItems();
            this.renderImagePreview('visionEarthPreview', this.content.vision.backgroundImage);
        }
        
        // Business 섹션
        if (this.content.business) {
            document.getElementById('businessSubtitle').value = this.content.business.subtitleHtml || '';
            document.getElementById('businessMoreButton').value = this.content.business.moreButtonText || '';
            this.renderBusinessCards();
        }
        
        // Media 섹션
        if (this.content.media) {
            const mediaIntro = document.getElementById('mediaIntro');
            if (mediaIntro && this.content.media.richTextIntroHtml) {
                mediaIntro.innerHTML = this.content.media.richTextIntroHtml;
            }
            this.renderMediaItems();
        }
        
        // Career 섹션
        if (this.content.career) {
            document.getElementById('careerCategories').value = (this.content.career.categories || []).join(', ');
            this.renderCareerPosts();
        }
        
        // Footer 섹션
        if (this.content.footer) {
            document.getElementById('footerTitle').value = this.content.footer.title || '';
            document.getElementById('footerButtonText').value = this.content.footer.buttonText || '';
            this.renderImagePreview('footerLogoPreview', this.content.footer.logo);
            
            if (this.content.footer.sns) {
                document.getElementById('instagramLink').value = this.content.footer.sns.instagram || '';
                document.getElementById('linkedinLink').value = this.content.footer.sns.linkedin || '';
                document.getElementById('youtubeLink').value = this.content.footer.sns.youtube || '';
            }
        }
        
        // SEO 섹션
        if (this.content.seo) {
            document.getElementById('seoTitle').value = this.content.seo.title || '';
            document.getElementById('seoDescription').value = this.content.seo.description || '';
            document.getElementById('seoKeywords').value = (this.content.seo.keywords || []).join(', ');
            this.renderImagePreview('ogImagePreview', this.content.seo.ogImage);
        }
    }
    
    // 이미지 업로드 설정
    setupImageUpload() {
        // 전역 드래그 이벤트 방지 (브라우저 기본 동작 차단)
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        // 초기 드래그 앤 드롭 설정
        this.setupDragAndDropForNewZones();
    }
    
    // 파일 업로드 처리
    async handleFileUpload(files, dropzone) {
        if (!files.length) return;
        
        // 파일 타입 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validFiles = Array.from(files).filter(file => {
            if (!allowedTypes.includes(file.type)) {
                this.showToast(`${file.name}: 지원하지 않는 파일 형식입니다`, 'error');
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB 제한
                this.showToast(`${file.name}: 파일 크기가 너무 큽니다 (최대 10MB)`, 'error');
                return false;
            }
            return true;
        });
        
        if (validFiles.length === 0) return;
        
        try {
            this.showLoading();
            
            for (const file of validFiles) {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    this.addImageToList(dropzone, result.url);
                    
                    // 콘텐츠 데이터 자동 업데이트
                    this.updateContentDataFromUI();
                    
                    this.showToast(`${file.name} 업로드 성공`, 'success');
                } else {
                    this.showToast(`${file.name} 업로드 실패: ${result.message || '알 수 없는 오류'}`, 'error');
                }
            }
        } catch (error) {
            console.error('업로드 오류:', error);
            this.showToast('업로드 중 오류가 발생했습니다: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // 이미지를 리스트에 추가
    addImageToList(dropzone, url) {
        const listId = this.getListIdFromDropzone(dropzone);
        const list = document.getElementById(listId);
        
        if (list) {
            const imageItem = this.createImageItem(url);
            list.appendChild(imageItem);
        } else {
            // 단일 이미지 미리보기
            const previewId = this.getPreviewIdFromDropzone(dropzone);
            this.renderImagePreview(previewId, url);
        }
        
        // 새로 생성된 업로드 존에 드래그 앤 드롭 설정 적용
        this.setupDragAndDropForNewZones();
    }
    
    // 새로 생성된 업로드 존에 드래그 앤 드롭 설정
    setupDragAndDropForNewZones() {
        // 이미 설정된 존은 제외하고 새로 생성된 존만 설정 (Earth 배경 이미지 제외)
        document.querySelectorAll('.image-upload-zone:not([data-drag-setup]):not([data-dropzone="vision-earth"])').forEach(zone => {
            const input = zone.querySelector('input[type="file"]');
            if (!input) {
                console.log('업로드 존에서 input을 찾을 수 없습니다:', zone);
                return;
            }
            
            // 이미 설정되었음을 표시
            zone.setAttribute('data-drag-setup', 'true');
            console.log('업로드 존 설정 완료:', zone.dataset.dropzone);
            
            // 클릭 이벤트 (여러 방식으로 추가)
            zone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('업로드 존 클릭됨:', zone.dataset.dropzone);
                console.log('input 요소:', input);
                if (input) {
                    input.click();
                    console.log('input.click() 실행됨');
                } else {
                    console.error('input 요소를 찾을 수 없습니다');
                }
            });
            
            // 추가 클릭 이벤트 (mousedown도 추가)
            zone.addEventListener('mousedown', (e) => {
                e.preventDefault();
                console.log('업로드 존 mousedown:', zone.dataset.dropzone);
            });
            
            // placeholder 클릭 이벤트도 추가
            const placeholder = zone.querySelector('.upload-placeholder');
            if (placeholder) {
                placeholder.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('placeholder 클릭됨:', zone.dataset.dropzone);
                    if (input) {
                        input.click();
                        console.log('placeholder에서 input.click() 실행됨');
                    }
                });
            }
            
            
            // 드래그 시작
            zone.addEventListener('dragenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.add('dragover');
                zone.style.borderColor = '#007bff';
                zone.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            });
            
            // 드래그 오버
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.add('dragover');
            });
            
            // 드래그 리브
            zone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!zone.contains(e.relatedTarget)) {
                    zone.classList.remove('dragover');
                    zone.style.borderColor = '';
                    zone.style.backgroundColor = '';
                }
            });
            
            // 드롭
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.remove('dragover');
                zone.style.borderColor = '';
                zone.style.backgroundColor = '';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileUpload(files, zone.dataset.dropzone);
                }
            });
            
            // 파일 선택
            input.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    this.handleFileUpload(files, zone.dataset.dropzone);
                }
            });
        });
    }
    
    // 드롭존에서 리스트 ID 가져오기
    getListIdFromDropzone(dropzone) {
        const mapping = {
            'hero-bg': 'heroBgList',
            'vision-rolling': 'visionRollingList'
        };
        return mapping[dropzone] || '';
    }
    
    // 드롭존에서 미리보기 ID 가져오기
    getPreviewIdFromDropzone(dropzone) {
        const mapping = {
            'vision-earth': 'visionEarthPreview',
            'footer-logo': 'footerLogoPreview',
            'og-image': 'ogImagePreview'
        };
        return mapping[dropzone] || '';
    }
    
    // 이미지 아이템 생성
    createImageItem(url) {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.innerHTML = `
            <img src="${url}" alt="Uploaded image">
            <div class="image-actions">
                <button onclick="this.parentElement.parentElement.remove()" title="삭제">×</button>
            </div>
        `;
        return item;
    }
    
    // 이미지 리스트 렌더링
    renderImageList(listId, images) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        list.innerHTML = '';
        images.forEach(url => {
            if (url) {
                const item = this.createImageItem(url);
                list.appendChild(item);
            }
        });
    }
    
    // 이미지 미리보기 렌더링
    renderImagePreview(previewId, url) {
        const preview = document.getElementById(previewId);
        if (!preview || !url) return;
        
        preview.innerHTML = `
            <img src="${url}" alt="Preview">
            <button class="btn btn-sm btn-danger" onclick="this.parentElement.innerHTML=''">삭제</button>
        `;
    }
    
    // 히어로 슬라이드 렌더링
    renderHeroSlides() {
        const list = document.getElementById('heroSlidesList');
        if (!list) return;
        
        list.innerHTML = '';
        
        // 새로운 슬라이드 구조 처리
        if (this.content.hero?.slides) {
            this.content.hero.slides
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .forEach((slide, index) => {
                    const slideElement = this.createHeroSlide(slide, index);
                    list.appendChild(slideElement);
                });
        }
        // 기존 구조 호환성
        else if (this.content.hero?.backgrounds) {
            this.content.hero.backgrounds.forEach((background, index) => {
                const slide = {
                    id: `hero-${index + 1}`,
                    title: index === 0 ? (this.content.hero.title || '') : '',
                    subtitle: index === 0 ? (this.content.hero.subtitle || '') : '',
                    background: background,
                    active: true,
                    order: index + 1
                };
                const slideElement = this.createHeroSlide(slide, index);
                list.appendChild(slideElement);
            });
        }
        this.updateHeroSlideButtons();
    }
    
    // 히어로 슬라이드 생성
    createHeroSlide(slide, index) {
        const slideElement = document.createElement('div');
        slideElement.className = 'slide-item';
        
        // 최소 1개 유지를 위한 삭제 버튼 비활성화 체크
        // DOM에 실제 렌더링된 슬라이드 수를 기준으로 판단
        const list = document.getElementById('heroSlidesList');
        const totalSlides = list.children.length;
        const canDelete = totalSlides > 1;
        
        slideElement.innerHTML = `
            <div class="item-header">
                <h4 class="item-title">슬라이드 ${index + 1}</h4>
                <div class="item-actions">
                    <label class="active-toggle">
                        <input type="checkbox" ${slide.active ? 'checked' : ''} onchange="this.dataset.changed='true'">
                        활성
                    </label>
                    <button class="btn btn-sm btn-outline" onclick="adminCMS.moveSlideUp(this.closest('.slide-item'))">↑</button>
                    <button class="btn btn-sm btn-outline" onclick="adminCMS.moveSlideDown(this.closest('.slide-item'))">↓</button>
                    <button class="btn btn-sm btn-danger ${!canDelete ? 'disabled' : ''}" 
                            onclick="${canDelete ? 'adminCMS.deleteHeroSlide(this.closest(\'.slide-item\'))' : 'return false'}" 
                            ${!canDelete ? 'disabled' : ''}>${canDelete ? '삭제' : '삭제 불가'}</button>
                </div>
            </div>
            <div class="form-group">
                <label>순서</label>
                <input type="number" class="order-input" value="${slide.order || index + 1}" min="1" max="5" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>배경 이미지</label>
                <div class="image-upload-zone" data-dropzone="hero-slide-${index}">
                    <div class="upload-placeholder">
                        <p>배경 이미지를 드래그하거나 클릭하여 업로드</p>
                        <input type="file" accept="image/*" hidden>
                    </div>
                </div>
                <div class="image-preview">
                    ${slide.background ? `<img src="${slide.background}" alt="Slide ${index + 1}">` : ''}
                </div>
            </div>
            <div class="form-group">
                <label>타이틀</label>
                <input type="text" value="${slide.title || ''}" placeholder="슬라이드 타이틀" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>서브타이틀</label>
                <textarea rows="2" placeholder="슬라이드 서브타이틀" onchange="this.dataset.changed='true'">${slide.subtitle || ''}</textarea>
            </div>
        `;
        
        // 이미지 업로드 이벤트 설정
        const uploadZone = slideElement.querySelector('.image-upload-zone');
        const input = uploadZone.querySelector('input[type="file"]');
        const preview = slideElement.querySelector('.image-preview');
        
        uploadZone.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => {
            this.handleSlideImageUpload(e.target.files[0], preview);
        });
        
        return slideElement;
    }
    
    // 슬라이드 이미지 업로드 처리
    async handleSlideImageUpload(file, previewElement) {
        if (!file) return;
        
        try {
            this.showLoading();
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                previewElement.innerHTML = `
                    <img src="${result.url}" alt="Slide image">
                `;
                
                // 콘텐츠 데이터 자동 업데이트
                this.updateContentDataFromUI();
                
                this.showToast('이미지 업로드 성공', 'success');
            } else {
                this.showToast('이미지 업로드 실패', 'error');
            }
        } catch (error) {
            console.error('업로드 오류:', error);
            this.showToast('업로드 중 오류가 발생했습니다', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // 슬라이드 위로 이동
    moveSlideUp(slideElement) {
        const list = document.getElementById('heroSlidesList');
        const slides = Array.from(list.children);
        const currentIndex = slides.indexOf(slideElement);
        
        if (currentIndex > 0) {
            // DOM에서 위치 변경
            list.insertBefore(slideElement, slides[currentIndex - 1]);
            
            // 모든 슬라이드의 순서 재설정
            this.updateSlideOrders();
        }
    }
    
    // 슬라이드 아래로 이동
    moveSlideDown(slideElement) {
        const list = document.getElementById('heroSlidesList');
        const slides = Array.from(list.children);
        const currentIndex = slides.indexOf(slideElement);
        
        if (currentIndex < slides.length - 1) {
            // DOM에서 위치 변경
            if (currentIndex < slides.length - 2) {
                list.insertBefore(slideElement, slides[currentIndex + 2]);
            } else {
                list.appendChild(slideElement);
            }
            
            // 모든 슬라이드의 순서 재설정
            this.updateSlideOrders();
        }
    }
    
    // 히어로 슬라이드 삭제
    deleteHeroSlide(slideElement) {
        const list = document.getElementById('heroSlidesList');
        const totalSlides = list.children.length;
        
        if (totalSlides <= 1) {
            this.showToast('최소 1개의 히어로 슬라이드는 유지해야 합니다', 'warning');
            return;
        }
        
        slideElement.remove();
        this.updateSlideOrders();
        this.updateHeroSlideButtons();
    }
    
    // 히어로 슬라이드 버튼 상태 업데이트
    updateHeroSlideButtons() {
        const list = document.getElementById('heroSlidesList');
        const addButton = document.getElementById('addHeroSlide');
        // DOM에 실제 렌더링된 슬라이드 수를 기준으로 판단
        const totalSlides = list.children.length;
        
        // 추가 버튼 비활성화 (5개일 때)
        if (totalSlides >= 5) {
            addButton.disabled = true;
            addButton.classList.add('disabled');
            addButton.textContent = '최대 5개 (추가 불가)';
        } else {
            addButton.disabled = false;
            addButton.classList.remove('disabled');
            addButton.textContent = '슬라이드 추가';
        }
        
        // 삭제 버튼 상태 업데이트
        const deleteButtons = list.querySelectorAll('.btn-danger');
        deleteButtons.forEach((button, index) => {
            const canDelete = totalSlides > 1;
            if (canDelete) {
                button.disabled = false;
                button.classList.remove('disabled');
                button.textContent = '삭제';
                button.onclick = () => this.deleteHeroSlide(button.closest('.slide-item'));
            } else {
                button.disabled = true;
                button.classList.add('disabled');
                button.textContent = '삭제 불가';
                button.onclick = () => false;
            }
        });
    }
    
    // 슬라이드 순서 업데이트
    updateSlideOrders() {
        const list = document.getElementById('heroSlidesList');
        const slides = Array.from(list.children);
        
        slides.forEach((slide, index) => {
            const orderInput = slide.querySelector('.order-input');
            const titleElement = slide.querySelector('.item-title');
            
            if (orderInput) {
                orderInput.value = index + 1;
            }
            
            if (titleElement) {
                titleElement.textContent = `슬라이드 ${index + 1}`;
            }
        });
    }

    // 비전 롤링 이미지 렌더링
    renderVisionRollingItems() {
        const list = document.getElementById('visionRollingItemsList');
        if (!list) return;
        
        list.innerHTML = '';
        
        if (this.content.vision?.rollingImages) {
            this.content.vision.rollingImages.forEach((imageUrl, index) => {
                const itemElement = this.createVisionRollingItem(imageUrl, index);
                list.appendChild(itemElement);
            });
        }
        this.updateVisionRollingButtons();
    }
    
    // 비전 롤링 이미지 아이템 생성
    createVisionRollingItem(imageUrl, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'media-item';
        itemElement.innerHTML = `
            <div class="item-header">
                <h4 class="item-title">롤링 이미지 ${index + 1}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline" onclick="adminCMS.moveVisionRollingUp(this.closest('.media-item'))">↑</button>
                    <button class="btn btn-sm btn-outline" onclick="adminCMS.moveVisionRollingDown(this.closest('.media-item'))">↓</button>
                    <button class="btn btn-sm btn-danger" onclick="this.closest('.media-item').remove()">삭제</button>
                </div>
            </div>
            <div class="form-group">
                <label>이미지</label>
                <div class="image-upload-zone" data-dropzone="vision-rolling-${index}">
                    <div class="upload-placeholder">
                        <p>이미지를 드래그하거나 클릭하여 업로드</p>
                        <input type="file" accept="image/*" hidden>
                    </div>
                </div>
                <div class="image-preview">
                    ${imageUrl ? `<img src="${imageUrl}" alt="Vision Rolling ${index + 1}">` : ''}
                </div>
            </div>
        `;
        
        // 이미지 업로드 이벤트 설정
        const uploadZone = itemElement.querySelector('.image-upload-zone');
        const input = uploadZone.querySelector('input[type="file"]');
        const preview = itemElement.querySelector('.image-preview');
        
        uploadZone.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => {
            this.handleVisionRollingImageUpload(e.target.files[0], preview);
        });
        
        return itemElement;
    }
    
    // 비전 롤링 이미지 업로드 처리
    async handleVisionRollingImageUpload(file, previewElement) {
        if (!file) return;
        
        try {
            this.showLoading();
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                previewElement.innerHTML = `
                    <img src="${result.url}" alt="Vision Rolling image">
                    <button class="btn btn-sm btn-danger" onclick="this.parentElement.innerHTML=''">삭제</button>
                `;
                
                // 콘텐츠 데이터 자동 업데이트
                this.updateContentDataFromUI();
                
                this.showToast('이미지 업로드 성공', 'success');
            } else {
                this.showToast('이미지 업로드 실패', 'error');
            }
        } catch (error) {
            console.error('업로드 오류:', error);
            this.showToast('업로드 중 오류가 발생했습니다', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // 비전 롤링 이미지 위로 이동
    moveVisionRollingUp(itemElement) {
        const list = document.getElementById('visionRollingItemsList');
        const items = Array.from(list.children);
        const currentIndex = items.indexOf(itemElement);
        
        if (currentIndex > 0) {
            list.insertBefore(itemElement, items[currentIndex - 1]);
            this.updateVisionRollingOrders();
        }
    }
    
    // 비전 롤링 이미지 아래로 이동
    moveVisionRollingDown(itemElement) {
        const list = document.getElementById('visionRollingItemsList');
        const items = Array.from(list.children);
        const currentIndex = items.indexOf(itemElement);
        
        if (currentIndex < items.length - 1) {
            if (currentIndex < items.length - 2) {
                list.insertBefore(itemElement, items[currentIndex + 2]);
            } else {
                list.appendChild(itemElement);
            }
            this.updateVisionRollingOrders();
        }
    }
    
    // 비전 롤링 이미지 순서 업데이트
    updateVisionRollingOrders() {
        const list = document.getElementById('visionRollingItemsList');
        const items = Array.from(list.children);
        
        items.forEach((item, index) => {
            const titleElement = item.querySelector('.item-title');
            if (titleElement) {
                titleElement.textContent = `롤링 이미지 ${index + 1}`;
            }
        });
    }

    // 비즈니스 카드 렌더링
    renderBusinessCards() {
        const list = document.getElementById('businessCardsList');
        if (!list || !this.content.business?.cards) return;
        
        list.innerHTML = '';
        this.content.business.cards.forEach((card, index) => {
            const cardElement = this.createBusinessCard(card, index);
            list.appendChild(cardElement);
        });
        this.updateBusinessCardButtons();
    }
    
    // 비즈니스 카드 생성
    createBusinessCard(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-item';
        
        // 최소 1개 유지를 위한 삭제 버튼 비활성화 체크
        // DOM에 실제 렌더링된 카드 수를 기준으로 판단
        const list = document.getElementById('businessCardsList');
        const totalCards = list.children.length;
        const canDelete = totalCards > 1;
        
        cardElement.innerHTML = `
            <div class="item-header">
                <h4 class="item-title">비즈니스 카드 ${index + 1}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline" onclick="adminCMS.moveBusinessCardUp(this.closest('.card-item'))">↑</button>
                    <button class="btn btn-sm btn-outline" onclick="adminCMS.moveBusinessCardDown(this.closest('.card-item'))">↓</button>
                    <button class="btn btn-sm btn-danger ${!canDelete ? 'disabled' : ''}" 
                            onclick="${canDelete ? 'adminCMS.deleteBusinessCard(this.closest(\'.card-item\'))' : 'return false'}" 
                            ${!canDelete ? 'disabled' : ''}>${canDelete ? '삭제' : '삭제 불가'}</button>
                </div>
            </div>
            <div class="form-group">
                <label>이미지</label>
                <div class="image-upload-zone" data-dropzone="business-card-${index}">
                    <div class="upload-placeholder">
                        <p>이미지를 드래그하거나 클릭하여 업로드</p>
                        <input type="file" accept="image/*" hidden>
                    </div>
                </div>
                <div class="image-preview">
                    ${card.image ? `<img src="${card.image}" alt="Business Card ${index + 1}">` : ''}
                </div>
            </div>
            <div class="form-group">
                <label>제목</label>
                <input type="text" value="${card.title || ''}" placeholder="카드 제목" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>설명</label>
                <textarea rows="3" placeholder="카드 설명" onchange="this.dataset.changed='true'">${card.desc || ''}</textarea>
            </div>
            <div class="form-group">
                <label>링크</label>
                <input type="url" value="${card.link || ''}" placeholder="링크 URL" onchange="this.dataset.changed='true'">
            </div>
        `;
        
        // 이미지 업로드 이벤트 설정
        const uploadZone = cardElement.querySelector('.image-upload-zone');
        const input = uploadZone.querySelector('input[type="file"]');
        const preview = cardElement.querySelector('.image-preview');
        
        uploadZone.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => {
            this.handleBusinessCardImageUpload(e.target.files[0], preview);
        });
        
        return cardElement;
    }
    
    // 비즈니스 카드 이미지 업로드 처리
    async handleBusinessCardImageUpload(file, previewElement) {
        if (!file) return;
        
        try {
            this.showLoading();
            
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                previewElement.innerHTML = `
                    <img src="${result.url}" alt="Business Card image">
                `;
                
                // 콘텐츠 데이터 자동 업데이트
                this.updateContentDataFromUI();
                
                this.showToast('이미지 업로드 성공', 'success');
            } else {
                this.showToast('이미지 업로드 실패', 'error');
            }
        } catch (error) {
            console.error('업로드 오류:', error);
            this.showToast('업로드 중 오류가 발생했습니다', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // 비즈니스 카드 위로 이동
    moveBusinessCardUp(cardElement) {
        const list = document.getElementById('businessCardsList');
        const cards = Array.from(list.children);
        const currentIndex = cards.indexOf(cardElement);
        
        if (currentIndex > 0) {
            list.insertBefore(cardElement, cards[currentIndex - 1]);
            this.updateBusinessCardOrders();
        }
    }
    
    // 비즈니스 카드 아래로 이동
    moveBusinessCardDown(cardElement) {
        const list = document.getElementById('businessCardsList');
        const cards = Array.from(list.children);
        const currentIndex = cards.indexOf(cardElement);
        
        if (currentIndex < cards.length - 1) {
            if (currentIndex < cards.length - 2) {
                list.insertBefore(cardElement, cards[currentIndex + 2]);
            } else {
                list.appendChild(cardElement);
            }
            this.updateBusinessCardOrders();
        }
    }
    
    // 비즈니스 카드 삭제
    deleteBusinessCard(cardElement) {
        const list = document.getElementById('businessCardsList');
        const totalCards = list.children.length;
        
        if (totalCards <= 1) {
            this.showToast('최소 1개의 비즈니스 카드는 유지해야 합니다', 'warning');
            return;
        }
        
        cardElement.remove();
        this.updateBusinessCardOrders();
        this.updateBusinessCardButtons();
    }
    
    // 비즈니스 카드 버튼 상태 업데이트
    updateBusinessCardButtons() {
        const list = document.getElementById('businessCardsList');
        const addButton = document.getElementById('addBusinessCard');
        // DOM에 실제 렌더링된 카드 수를 기준으로 판단
        const totalCards = list.children.length;
        
        // 추가 버튼 비활성화 (5개일 때)
        if (totalCards >= 5) {
            addButton.disabled = true;
            addButton.classList.add('disabled');
            addButton.textContent = '최대 5개 (추가 불가)';
        } else {
            addButton.disabled = false;
            addButton.classList.remove('disabled');
            addButton.textContent = '카드 추가';
        }
        
        // 삭제 버튼 상태 업데이트
        const deleteButtons = list.querySelectorAll('.btn-danger');
        deleteButtons.forEach((button, index) => {
            const canDelete = totalCards > 1;
            if (canDelete) {
                button.disabled = false;
                button.classList.remove('disabled');
                button.textContent = '삭제';
                button.onclick = () => this.deleteBusinessCard(button.closest('.card-item'));
            } else {
                button.disabled = true;
                button.classList.add('disabled');
                button.textContent = '삭제 불가';
                button.onclick = () => false;
            }
        });
    }
    
    // 비전 롤링 이미지 버튼 상태 업데이트
    updateVisionRollingButtons() {
        const list = document.getElementById('visionRollingItemsList');
        const addButton = document.getElementById('addVisionRollingItem');
        // DOM에 실제 렌더링된 이미지 수를 기준으로 판단
        const totalImages = list.children.length;
        
        // 추가 버튼 비활성화 (5개일 때)
        if (totalImages >= 5) {
            addButton.disabled = true;
            addButton.classList.add('disabled');
            addButton.textContent = '최대 5개 (추가 불가)';
        } else {
            addButton.disabled = false;
            addButton.classList.remove('disabled');
            addButton.textContent = '이미지 추가';
        }
    }
    
    // 비즈니스 카드 순서 업데이트
    updateBusinessCardOrders() {
        const list = document.getElementById('businessCardsList');
        const cards = Array.from(list.children);
        
        cards.forEach((card, index) => {
            const titleElement = card.querySelector('.item-title');
            if (titleElement) {
                titleElement.textContent = `비즈니스 카드 ${index + 1}`;
            }
        });
    }
    
    // 미디어 아이템 렌더링
    renderMediaItems() {
        const list = document.getElementById('mediaItemsList');
        if (!list || !this.content.media?.items) return;
        
        list.innerHTML = '';
        this.content.media.items.forEach((item, index) => {
            const itemElement = this.createMediaItem(item, index);
            list.appendChild(itemElement);
        });
    }
    
    // 미디어 아이템 생성
    createMediaItem(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'media-item';
        itemElement.innerHTML = `
            <div class="item-header">
                <h4 class="item-title">미디어 아이템 ${index + 1}</h4>
                <div class="item-actions">
                    <button class="btn btn-sm btn-danger" onclick="this.closest('.media-item').remove()">삭제</button>
                </div>
            </div>
            <div class="form-group">
                <label>이미지</label>
                <input type="url" value="${item.image || ''}" placeholder="이미지 URL" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>카테고리</label>
                <input type="text" value="${item.category || ''}" placeholder="카테고리" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>제목</label>
                <input type="text" value="${item.title || ''}" placeholder="제목" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>날짜</label>
                <input type="text" value="${item.date || ''}" placeholder="2025.01.01" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>순서</label>
                <input type="number" value="${item.order || index}" placeholder="순서" onchange="this.dataset.changed='true'">
            </div>
        `;
        return itemElement;
    }
    
    // 채용 공고 렌더링
    renderCareerPosts() {
        const list = document.getElementById('careerPostsList');
        if (!list || !this.content.career?.posts) return;
        
        list.innerHTML = '';
        this.content.career.posts.forEach((post, index) => {
            const postElement = this.createCareerPost(post, index);
            list.appendChild(postElement);
        });
    }
    
    // 채용 공고 생성
    createCareerPost(post, index) {
        const postElement = document.createElement('div');
        postElement.className = 'career-item';
        postElement.innerHTML = `
            <div class="item-header">
                <h4 class="item-title">채용 공고 ${index + 1}</h4>
                <div class="item-actions">
                    <label>
                        <input type="checkbox" ${post.active ? 'checked' : ''} onchange="this.dataset.changed='true'">
                        활성
                    </label>
                    <button class="btn btn-sm btn-danger" onclick="this.closest('.career-item').remove()">삭제</button>
                </div>
            </div>
            <div class="form-group">
                <label>제목</label>
                <input type="text" value="${post.title || ''}" placeholder="채용 공고 제목" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>카테고리</label>
                <select onchange="this.dataset.changed='true'">
                    <option value="">카테고리 선택</option>
                    ${(this.content.career?.categories || []).map(cat => 
                        `<option value="${cat}" ${post.category === cat ? 'selected' : ''}>${cat}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>본문 (HTML 허용)</label>
                <div class="rich-editor" contenteditable="true" onchange="this.dataset.changed='true'">${post.bodyHtml || ''}</div>
            </div>
            <div class="form-group">
                <label>시작일</label>
                <input type="date" value="${post.period?.start || ''}" onchange="this.dataset.changed='true'">
            </div>
            <div class="form-group">
                <label>종료일</label>
                <input type="date" value="${post.period?.end || ''}" onchange="this.dataset.changed='true'">
            </div>
        `;
        return postElement;
    }
    
    // 동적 아이템 추가 설정
    setupDynamicItems() {
        // 히어로 슬라이드 추가
        document.getElementById('addHeroSlide').addEventListener('click', () => {
            const list = document.getElementById('heroSlidesList');
            if (list.children.length >= 5) {
                this.showToast('최대 5개의 슬라이드만 추가할 수 있습니다', 'warning');
                return;
            }
            const newSlide = this.createHeroSlide({
                id: `hero-${Date.now()}`,
                title: '',
                subtitle: '',
                background: '',
                active: true,
                order: list.children.length + 1
            }, list.children.length);
            list.appendChild(newSlide);
            this.updateHeroSlideButtons();
        });
        
        // 비즈니스 카드 추가
        document.getElementById('addBusinessCard').addEventListener('click', () => {
            const list = document.getElementById('businessCardsList');
            if (list.children.length >= 5) {
                this.showToast('최대 5개의 비즈니스 카드만 추가할 수 있습니다', 'warning');
                return;
            }
            const newCard = this.createBusinessCard({}, list.children.length);
            list.appendChild(newCard);
            this.updateBusinessCardButtons();
        });
        
        // 비전 롤링 이미지 추가
        document.getElementById('addVisionRollingItem').addEventListener('click', () => {
            const list = document.getElementById('visionRollingItemsList');
            if (list.children.length >= 5) {
                this.showToast('최대 5개의 롤링 이미지만 추가할 수 있습니다', 'warning');
                return;
            }
            const newItem = this.createVisionRollingItem('', list.children.length);
            list.appendChild(newItem);
            this.updateVisionRollingButtons();
        });
        
        // 미디어 아이템 추가
        document.getElementById('addMediaItem').addEventListener('click', () => {
            const list = document.getElementById('mediaItemsList');
            const newItem = this.createMediaItem({}, list.children.length);
            list.appendChild(newItem);
        });
        
        // 채용 공고 추가
        document.getElementById('addCareerPost').addEventListener('click', () => {
            const list = document.getElementById('careerPostsList');
            const newPost = this.createCareerPost({}, list.children.length);
            list.appendChild(newPost);
        });
    }
    
    // 콘텐츠 저장
    async saveContent() {
        try {
            this.showLoading();
            
            // 폼 데이터 수집
            const updatedContent = this.collectFormData();
            
            // 서버에 저장
            const response = await fetch('/api/save-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify(updatedContent)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.content = updatedContent;
                this.updateLastSavedTime();
                this.showToast('저장되었습니다', 'success');
            } else {
                this.showToast('저장에 실패했습니다', 'error');
            }
        } catch (error) {
            console.error('저장 오류:', error);
            this.showToast('저장 중 오류가 발생했습니다', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // 폼 데이터 수집
    collectFormData() {
        const content = JSON.parse(JSON.stringify(this.content)); // 깊은 복사
        
        // Hero 섹션
        content.hero = {
            slides: this.getHeroSlides()
        };
        
        // Vision 섹션
        content.vision = {
            title: document.getElementById('visionTitle').value,
            subtitle: document.getElementById('visionSubtitle').value,
            rollingImages: this.getVisionRollingImages(),
            backgroundImage: this.getImagePreview('visionEarthPreview')
        };
        
        // Business 섹션
        content.business = {
            subtitleHtml: document.getElementById('businessSubtitle').value,
            moreButtonText: document.getElementById('businessMoreButton').value,
            cards: this.getBusinessCards()
        };
        
        // Media 섹션
        content.media = {
            richTextIntroHtml: document.getElementById('mediaIntro').innerHTML,
            items: this.getMediaItems()
        };
        
        // Career 섹션
        content.career = {
            categories: document.getElementById('careerCategories').value.split(',').map(s => s.trim()).filter(s => s),
            posts: this.getCareerPosts()
        };
        
        // Footer 섹션
        content.footer = {
            title: document.getElementById('footerTitle').value,
            buttonText: document.getElementById('footerButtonText').value,
            logo: this.getImagePreview('footerLogoPreview'),
            sns: {
                instagram: document.getElementById('instagramLink').value,
                linkedin: document.getElementById('linkedinLink').value,
                youtube: document.getElementById('youtubeLink').value
            }
        };
        
        // SEO 섹션
        content.seo = {
            title: document.getElementById('seoTitle').value,
            description: document.getElementById('seoDescription').value,
            keywords: document.getElementById('seoKeywords').value.split(',').map(s => s.trim()).filter(s => s),
            ogImage: this.getImagePreview('ogImagePreview')
        };
        
        // 메타데이터 업데이트
        content.meta = {
            ...content.meta,
            lastModified: new Date().toISOString(),
            modifiedBy: 'admin'
        };
        
        return content;
    }
    
    // 히어로 슬라이드 데이터 가져오기
    getHeroSlides() {
        const slides = [];
        document.querySelectorAll('#heroSlidesList .slide-item').forEach((slide, index) => {
            const checkbox = slide.querySelector('input[type="checkbox"]');
            const orderInput = slide.querySelector('.order-input');
            const imagePreview = slide.querySelector('.image-preview img');
            
            // 각 슬라이드의 입력 필드들을 정확하게 선택
            const formGroups = slide.querySelectorAll('.form-group');
            let titleInput = null;
            let subtitleInput = null;
            
            // 순서대로 입력 필드 찾기
            formGroups.forEach((group, groupIndex) => {
                const input = group.querySelector('input[type="text"]');
                const textarea = group.querySelector('textarea');
                
                if (input && !input.classList.contains('order-input')) {
                    // 첫 번째 텍스트 입력은 타이틀
                    if (!titleInput) {
                        titleInput = input;
                    }
                }
                
                if (textarea) {
                    // 첫 번째 텍스트 영역은 서브타이틀
                    if (!subtitleInput) {
                        subtitleInput = textarea;
                    }
                }
            });
            
            const slideData = {
                id: `hero-${index + 1}`,
                title: titleInput?.value || '',
                subtitle: subtitleInput?.value || '',
                background: imagePreview ? imagePreview.src : '',
                active: checkbox ? checkbox.checked : true,
                order: orderInput ? parseInt(orderInput.value) || (index + 1) : (index + 1)
            };
            
            console.log(`히어로 슬라이드 ${index + 1} 데이터:`, slideData);
            slides.push(slideData);
        });
        return slides;
    }
    
    // 비전 롤링 이미지 데이터 가져오기
    getVisionRollingImages() {
        const images = [];
        document.querySelectorAll('#visionRollingItemsList .media-item').forEach((item) => {
            const imagePreview = item.querySelector('.image-preview img');
            if (imagePreview && imagePreview.src) {
                images.push(imagePreview.src);
            }
        });
        return images;
    }
    
    // 이미지 리스트 가져오기
    getImageList(listId) {
        const list = document.getElementById(listId);
        if (!list) return [];
        
        return Array.from(list.querySelectorAll('.image-item img')).map(img => img.src);
    }
    
    // 이미지 미리보기 가져오기
    getImagePreview(previewId) {
        const preview = document.getElementById(previewId);
        if (!preview) return '';
        
        const img = preview.querySelector('img');
        return img ? img.src : '';
    }
    
    // 비즈니스 카드 데이터 가져오기
    getBusinessCards() {
        const cards = [];
        document.querySelectorAll('#businessCardsList .card-item').forEach((card, index) => {
            const imagePreview = card.querySelector('.image-preview img');
            const descTextarea = card.querySelector('textarea');
            const linkInput = card.querySelector('input[type="url"]');
            
            // 제목 입력 필드를 정확하게 찾기
            const formGroups = card.querySelectorAll('.form-group');
            let titleInput = null;
            
            formGroups.forEach((group) => {
                const input = group.querySelector('input[type="text"]');
                const label = group.querySelector('label');
                
                // 라벨이 "제목"인 입력 필드 찾기
                if (input && label && label.textContent.includes('제목')) {
                    titleInput = input;
                }
            });
            
            const cardData = {
                image: imagePreview ? imagePreview.src : '',
                title: titleInput ? titleInput.value : '',
                desc: descTextarea ? descTextarea.value : '',
                link: linkInput ? linkInput.value : ''
            };
            
            console.log(`비즈니스 카드 ${index + 1} 데이터:`, cardData);
            cards.push(cardData);
        });
        return cards;
    }
    
    // 미디어 아이템 데이터 가져오기
    getMediaItems() {
        const items = [];
        document.querySelectorAll('#mediaItemsList .media-item').forEach((item, index) => {
            const formGroups = item.querySelectorAll('.form-group');
            let imageInput = null;
            let categoryInput = null;
            let titleInput = null;
            let dateInput = null;
            let orderInput = null;
            
            // 각 입력 필드를 라벨로 정확하게 찾기
            formGroups.forEach((group) => {
                const input = group.querySelector('input');
                const label = group.querySelector('label');
                
                if (input && label) {
                    const labelText = label.textContent;
                    if (labelText.includes('이미지')) {
                        imageInput = input;
                    } else if (labelText.includes('카테고리')) {
                        categoryInput = input;
                    } else if (labelText.includes('제목')) {
                        titleInput = input;
                    } else if (labelText.includes('날짜')) {
                        dateInput = input;
                    } else if (labelText.includes('순서')) {
                        orderInput = input;
                    }
                }
            });
            
            items.push({
                id: `media-${index + 1}`,
                image: imageInput?.value || '',
                category: categoryInput?.value || '',
                title: titleInput?.value || '',
                date: dateInput?.value || '',
                order: orderInput ? parseInt(orderInput.value) || index : index
            });
        });
        return items;
    }
    
    // 채용 공고 데이터 가져오기
    getCareerPosts() {
        const posts = [];
        document.querySelectorAll('#careerPostsList .career-item').forEach((post, index) => {
            const editor = post.querySelector('.rich-editor');
            const checkbox = post.querySelector('input[type="checkbox"]');
            
            const formGroups = post.querySelectorAll('.form-group');
            let titleInput = null;
            let categorySelect = null;
            let startDateInput = null;
            let endDateInput = null;
            
            // 각 입력 필드를 라벨로 정확하게 찾기
            formGroups.forEach((group) => {
                const input = group.querySelector('input');
                const select = group.querySelector('select');
                const label = group.querySelector('label');
                
                if (label) {
                    const labelText = label.textContent;
                    if (labelText.includes('제목') && input) {
                        titleInput = input;
                    } else if (labelText.includes('카테고리') && select) {
                        categorySelect = select;
                    } else if (labelText.includes('시작일') && input) {
                        startDateInput = input;
                    } else if (labelText.includes('종료일') && input) {
                        endDateInput = input;
                    }
                }
            });
            
            posts.push({
                id: `career-${index + 1}`,
                title: titleInput?.value || '',
                category: categorySelect?.value || '',
                bodyHtml: editor?.innerHTML || '',
                period: {
                    start: startDateInput?.value || '',
                    end: endDateInput?.value || ''
                },
                active: checkbox ? checkbox.checked : false
            });
        });
        return posts;
    }
    
    // 미리보기
    previewContent() {
        // 먼저 UI에서 콘텐츠 데이터 업데이트
        this.updateContentDataFromUI();
        
        // 폼 데이터 수집
        const updatedContent = this.collectFormData();
        
        // 새 창에서 미리보기
        const previewWindow = window.open('../index.html', '_blank');
        
        // 콘텐츠를 새 창에 전달 (postMessage 사용)
        previewWindow.addEventListener('load', () => {
            // 약간의 지연을 두어 페이지가 완전히 로드된 후 메시지 전송
            setTimeout(() => {
                previewWindow.postMessage({
                    type: 'PREVIEW_CONTENT',
                    content: updatedContent
                }, '*');
            }, 1000); // 지연 시간을 늘려서 이미지 로딩 시간 확보
        });
        
        this.showToast('미리보기 창이 열렸습니다', 'success');
    }
    
    // 로딩 표시
    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    // 로딩 숨김
    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    // 토스트 알림
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // 시간 표시 시작
    startTimeDisplay() {
        this.updateCurrentTime();
        this.updateLastSavedTime();
        
        // 1분마다 현재 시간 업데이트
        setInterval(() => {
            this.updateCurrentTime();
        }, 60000);
    }
    
    // 현재 시간 업데이트
    updateCurrentTime() {
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            currentTimeElement.textContent = `현재: ${timeString}`;
        }
    }
    
    // 마지막 저장 시간 업데이트
    updateLastSavedTime() {
        const lastSavedElement = document.getElementById('lastSaved');
        if (lastSavedElement && this.content?.meta?.lastModified) {
            const lastModified = new Date(this.content.meta.lastModified);
            const timeString = lastModified.toLocaleString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            lastSavedElement.textContent = `저장: ${timeString}`;
        } else if (lastSavedElement) {
            lastSavedElement.textContent = '저장: 없음';
        }
    }
    
    // UI에서 콘텐츠 데이터 업데이트 (이미지 업로드 후 자동 호출)
    updateContentDataFromUI() {
        if (!this.content) return;
        
        try {
            // Hero 섹션 업데이트
            if (this.content.hero?.slides) {
                const heroSlides = this.getHeroSlides();
                this.content.hero.slides = heroSlides;
            }
            
            // Vision 섹션 업데이트
            if (this.content.vision) {
                this.content.vision.rollingImages = this.getVisionRollingImages();
                
                // Earth 배경 이미지 업데이트
                const earthPreview = this.getImagePreview('visionEarthPreview');
                if (earthPreview) {
                    this.content.vision.backgroundImage = earthPreview;
                }
            }
            
            // Business 섹션 업데이트
            if (this.content.business) {
                this.content.business.cards = this.getBusinessCards();
            }
            
            // Footer 섹션 업데이트
            if (this.content.footer) {
                const logoPreview = this.getImagePreview('footerLogoPreview');
                if (logoPreview) {
                    this.content.footer.logo = logoPreview;
                }
            }
            
            // SEO 섹션 업데이트
            if (this.content.seo) {
                const ogImagePreview = this.getImagePreview('ogImagePreview');
                if (ogImagePreview) {
                    this.content.seo.ogImage = ogImagePreview;
                }
            }
            
            console.log('콘텐츠 데이터가 UI에서 업데이트되었습니다:', this.content);
        } catch (error) {
            console.error('콘텐츠 데이터 업데이트 오류:', error);
        }
    }
}

// 페이지 로드 시 관리자 CMS 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.adminCMS = new AdminCMS();
});

// 미리보기 메시지 수신 (메인 페이지에서)
window.addEventListener('message', (event) => {
    if (event.data.type === 'PREVIEW_CONTENT') {
        // 전역 변수에 미리보기 콘텐츠 저장
        window.previewContent = event.data.content;
        
        // 콘텐츠 적용
        if (typeof applyContent === 'function') {
            applyContent(event.data.content);
        }
    }
});
