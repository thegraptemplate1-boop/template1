/**
 * AeroGrid Hero Section Library - Configuration
 * 히어로 섹션 설정 파일
 */

// 기본 설정 예제
const defaultHeroConfig = {
  // 컨테이너 선택자
  container: '.hero',
  
  // 배경 이미지 설정
  images: [
    {
      src: './img/hero_Image-1.jpg',
      alt: 'AEROGRID Hero Background 1'
    },
    {
      src: './img/hero_Image-2.jpg',
      alt: 'AEROGRID Hero Background 2'
    },
    {
      src: './img/hero_Image-3.jpg',
      alt: 'AEROGRID Hero Background 3'
    },
    {
      src: './img/hero_Image-4.jpg',
      alt: 'AEROGRID Hero Background 4'
    }
  ],
  
  // 텍스트 설정
  texts: [
    {
      title: '하늘을 설계하다',
      subtitle: '산업용 자율비행 드론부터 관제·AI 비전까지'
    },
    {
      title: '혁신적인 드론 솔루션',
      subtitle: '최첨단 기술로 미래를 만들어갑니다'
    },
    {
      title: '스마트한 자율비행',
      subtitle: 'AI와 함께하는 새로운 비행의 경험'
    },
    {
      title: '안전하고 효율적인',
      subtitle: '드론 기반 인프라 관리 솔루션'
    }
  ],
  
  // 로고 설정
  logo: './img/logo.svg',
  
  // 네비게이션 설정
  navigation: [
    { text: '회사소개', href: '#about' },
    { text: '사업영역', href: '#business' },
    { text: '미디어센터', href: '#media' },
    { text: '채용', href: '#career' },
    { text: '문의하기', href: '#contact' }
  ],
  
  // 언어 선택기 설정
  languageSelector: {
    text: 'KR',
    arrow: './img/arrow_down.svg'
  },
  
  // 메뉴 아이콘 설정
  menuIcon: {
    src: './img/menu.svg'
  },
  
  // 자동 재생 설정
  autoplay: true,
  autoplayInterval: 4000,
  
  // UI 요소 표시 설정
  showPagination: true,
  showPlayPause: true,
  
  // 애니메이션 설정
  animationDuration: 600,
  pauseOnHover: true
};

// 간단한 설정 예제
const simpleHeroConfig = {
  container: '.hero',
  images: [
    { src: './img/hero1.jpg', alt: 'Hero 1' },
    { src: './img/hero2.jpg', alt: 'Hero 2' }
  ],
  texts: [
    { title: 'Welcome', subtitle: 'Your subtitle here' },
    { title: 'About Us', subtitle: 'Learn more about our company' }
  ],
  autoplay: true,
  showPagination: true,
  showPlayPause: false
};

// 커스텀 설정 예제
const customHeroConfig = {
  container: '#my-hero',
  images: [
    { src: './assets/bg1.jpg', alt: 'Background 1' },
    { src: './assets/bg2.jpg', alt: 'Background 2' },
    { src: './assets/bg3.jpg', alt: 'Background 3' }
  ],
  texts: [
    { title: '첫 번째 슬라이드', subtitle: '첫 번째 슬라이드 설명' },
    { title: '두 번째 슬라이드', subtitle: '두 번째 슬라이드 설명' },
    { title: '세 번째 슬라이드', subtitle: '세 번째 슬라이드 설명' }
  ],
  logo: './assets/logo.png',
  navigation: [
    { text: '홈', href: '/' },
    { text: '서비스', href: '/services' },
    { text: '포트폴리오', href: '/portfolio' },
    { text: '연락처', href: '/contact' }
  ],
  languageSelector: {
    text: 'EN',
    arrow: './assets/arrow.svg'
  },
  menuIcon: {
    src: './assets/menu.svg'
  },
  autoplay: true,
  autoplayInterval: 5000,
  showPagination: true,
  showPlayPause: true,
  animationDuration: 800,
  pauseOnHover: false
};

// 설정 팩토리 함수
function createHeroConfig(options = {}) {
  return {
    ...defaultHeroConfig,
    ...options
  };
}

// 설정 검증 함수
function validateHeroConfig(config) {
  const required = ['container', 'images', 'texts'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(', ')}`);
  }
  
  if (!Array.isArray(config.images) || config.images.length === 0) {
    throw new Error('Images must be a non-empty array');
  }
  
  if (!Array.isArray(config.texts) || config.texts.length === 0) {
    throw new Error('Texts must be a non-empty array');
  }
  
  if (config.images.length !== config.texts.length) {
    console.warn('Images and texts arrays have different lengths');
  }
  
  return true;
}

// 전역으로 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    defaultHeroConfig,
    simpleHeroConfig,
    customHeroConfig,
    createHeroConfig,
    validateHeroConfig
  };
} else if (typeof window !== 'undefined') {
  window.HeroConfig = {
    default: defaultHeroConfig,
    simple: simpleHeroConfig,
    custom: customHeroConfig,
    create: createHeroConfig,
    validate: validateHeroConfig
  };
}

