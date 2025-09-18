/**
 * AeroGrid Hero Section Library
 * 재사용 가능한 히어로 섹션 컴포넌트
 */

class HeroSection {
  constructor(options = {}) {
    // 기본 설정
    this.config = {
      container: options.container || '.hero',
      images: options.images || [],
      texts: options.texts || [],
      autoplay: options.autoplay !== false,
      autoplayInterval: options.autoplayInterval || 4000,
      showPagination: options.showPagination !== false,
      showPlayPause: options.showPlayPause !== false,
      animationDuration: options.animationDuration || 600,
      ...options
    };

    this.currentSlide = 0;
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.isPaused = false;

    this.init();
  }

  /**
   * 컴포넌트 초기화
   */
  init() {
    this.createHTML();
    this.bindEvents();
    this.startAutoplay();
    this.animateText();
  }

  /**
   * HTML 구조 생성
   */
  createHTML() {
    const container = document.querySelector(this.config.container);
    if (!container) {
      console.error('Hero container not found:', this.config.container);
      return;
    }

    // 기존 내용 제거
    container.innerHTML = '';

    // HTML 구조 생성
    container.innerHTML = `
      <div class="hero-background">
        ${this.config.images.map((img, index) => 
          `<img src="${img.src}" alt="${img.alt || ''}" class="hero-bg-image ${index === 0 ? 'active' : ''}">`
        ).join('')}
        <div class="hero-overlay"></div>
      </div>
      
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <img src="${this.config.logo || './img/logo.svg'}" alt="Logo" class="logo-img">
          </div>
          <nav class="nav">
            ${this.config.navigation ? this.config.navigation.map(link => 
              `<a href="${link.href}" class="nav-link">${link.text}</a>`
            ).join('') : ''}
            ${this.config.languageSelector ? `
              <div class="nav-divider"></div>
              <div class="language-selector">
                <span class="language-text">${this.config.languageSelector.text || 'KR'}</span>
                <img src="${this.config.languageSelector.arrow || './img/arrow_down.svg'}" alt="Arrow Down" class="language-arrow">
              </div>
            ` : ''}
            ${this.config.menuIcon ? `
              <div class="menu-icon">
                <img src="${this.config.menuIcon.src || './img/menu.svg'}" alt="Menu" class="menu-img">
              </div>
            ` : ''}
          </nav>
        </div>
      </header>

      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="text-content" data-slide="0">
              ${this.config.texts[0]?.title || '제목을 입력하세요'}
            </span>
          </h1>
          <p class="hero-subtitle">
            <span class="text-content" data-slide="0">
              ${this.config.texts[0]?.subtitle || '부제목을 입력하세요'}
            </span>
          </p>
        </div>
      </div>

      ${this.config.showPagination ? `
        <div class="hero-pagination">
          ${this.config.showPlayPause ? `
            <div class="play-pause-btn">
              <img src="./img/pause.svg" alt="Pause" class="pause-icon active">
              <img src="./img/play.svg" alt="Play" class="play-icon">
            </div>
          ` : ''}
          <div class="pagination-dots">
            ${this.config.images.map((_, index) => `
              <span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}">
                <svg class="progress-ring" width="28" height="28">
                  <circle class="progress-ring-circle" cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.7"/>
                </svg>
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    const container = document.querySelector(this.config.container);
    
    // 페이지네이션 클릭
    container.addEventListener('click', (e) => {
      const dot = e.target.closest('.dot');
      if (dot) {
        const slideIndex = parseInt(dot.dataset.slide);
        this.goToSlide(slideIndex);
      }
    });

    // 플레이/일시정지 버튼
    const playPauseBtn = container.querySelector('.play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.toggleAutoplay();
      });
    }

    // 마우스 호버 시 일시정지
    if (this.config.pauseOnHover !== false) {
      container.addEventListener('mouseenter', () => this.pauseAutoplay());
      container.addEventListener('mouseleave', () => this.resumeAutoplay());
    }
  }

  /**
   * 슬라이드 전환
   */
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;

    this.isTransitioning = true;
    const images = document.querySelectorAll('.hero-bg-image');
    const dots = document.querySelectorAll('.dot');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    // 1단계: 기존 텍스트 아래로 사라짐
    heroTitle.classList.add('exit');
    heroSubtitle.classList.add('exit');

    // 2단계: 이미지 전환
    setTimeout(() => {
      images[this.currentSlide].classList.remove('active');
      images[index].classList.add('active');
      
      dots[this.currentSlide].classList.remove('active');
      dots[index].classList.add('active');

      // 텍스트 업데이트
      const titleContent = heroTitle.querySelector('.text-content');
      const subtitleContent = heroSubtitle.querySelector('.text-content');
      
      const titleText = this.config.texts[index]?.title || '';
      const subtitleText = this.config.texts[index]?.subtitle || '';

      // 줄바꿈 처리
      if (titleText.includes('<br>')) {
        const lines = titleText.split('<br>');
        titleContent.innerHTML = lines.map((line, i) => 
          `<div class="title-line" data-line="${i + 1}"><span class="line-text">${line}</span></div>`
        ).join('');
      } else {
        titleContent.innerHTML = titleText;
      }
      
      subtitleContent.innerHTML = subtitleText;

      // 3단계: 새 텍스트 나타남
      heroTitle.classList.remove('exit');
      heroSubtitle.classList.remove('exit');
      heroTitle.classList.add('enter');
      heroSubtitle.classList.add('enter');

      setTimeout(() => {
        heroTitle.classList.remove('enter');
        heroTitle.classList.add('animate');
      }, 100);

      setTimeout(() => {
        heroSubtitle.classList.remove('enter');
        heroSubtitle.classList.add('animate');
      }, 250);

      this.currentSlide = index;
      this.isTransitioning = false;
    }, 400);
  }

  /**
   * 자동 재생 시작
   */
  startAutoplay() {
    if (!this.config.autoplay) return;
    
    this.autoplayTimer = setInterval(() => {
      if (!this.isPaused) {
        const nextSlide = (this.currentSlide + 1) % this.config.images.length;
        this.goToSlide(nextSlide);
      }
    }, this.config.autoplayInterval);
  }

  /**
   * 자동 재생 일시정지/재개
   */
  toggleAutoplay() {
    this.isPaused = !this.isPaused;
    const pauseIcon = document.querySelector('.pause-icon');
    const playIcon = document.querySelector('.play-icon');
    
    if (this.isPaused) {
      pauseIcon.classList.remove('active');
      playIcon.classList.add('active');
    } else {
      pauseIcon.classList.add('active');
      playIcon.classList.remove('active');
    }
  }

  pauseAutoplay() {
    this.isPaused = true;
  }

  resumeAutoplay() {
    this.isPaused = false;
  }

  /**
   * 텍스트 애니메이션 시작
   */
  animateText() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    setTimeout(() => {
      heroTitle.classList.add('animate');
      heroSubtitle.classList.add('animate');
    }, 200);
  }

  /**
   * 컴포넌트 제거
   */
  destroy() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    const container = document.querySelector(this.config.container);
    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * 설정 업데이트
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.destroy();
    this.init();
  }
}

// 전역으로 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroSection;
} else if (typeof window !== 'undefined') {
  window.HeroSection = HeroSection;
}

