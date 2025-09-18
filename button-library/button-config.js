/**
 * AeroGrid Button Component Library - Configuration
 * 공통버튼 컴포넌트 설정 파일
 */

// 기본 설정 예제
const defaultButtonConfig = {
  // 버튼 타입
  type: 'primary', // 'primary' | 'secondary'
  
  // 버튼 크기
  size: 'medium', // 'small' | 'medium' | 'large'
  
  // 버튼 변형
  variant: 'default', // 'default' | 'outline' | 'ghost'
  
  // 텍스트
  text: 'Button',
  
  // 링크 (선택사항)
  href: null,
  
  // 클릭 핸들러
  onClick: null,
  
  // 추가 클래스명
  className: '',
  
  // 비활성화 상태
  disabled: false,
  
  // 로딩 상태
  loading: false,
  
  // 아이콘
  icon: 'arrow-right',
  
  // 아이콘 위치
  iconPosition: 'right', // 'left' | 'right'
  
  // 접근성
  'aria-label': null,
  'data-testid': null
};

// 프리셋 설정들
const buttonPresets = {
  // 기본 버튼들
  primary: {
    type: 'primary',
    text: 'Primary Button',
    icon: 'arrow-right',
    iconPosition: 'right'
  },
  
  secondary: {
    type: 'secondary',
    text: 'Secondary Button',
    icon: 'arrow-right',
    iconPosition: 'right'
  },
  
  // 크기별 프리셋
  small: {
    size: 'small',
    text: 'Small Button'
  },
  
  medium: {
    size: 'medium',
    text: 'Medium Button'
  },
  
  large: {
    size: 'large',
    text: 'Large Button'
  },
  
  // 변형별 프리셋
  outline: {
    variant: 'outline',
    text: 'Outline Button'
  },
  
  ghost: {
    variant: 'ghost',
    text: 'Ghost Button'
  },
  
  // 특수 버튼들
  link: {
    href: '#',
    text: 'Link Button',
    icon: 'arrow-right',
    iconPosition: 'right'
  },
  
  disabled: {
    disabled: true,
    text: 'Disabled Button'
  },
  
  loading: {
    loading: true,
    text: 'Loading Button'
  },
  
  // 아이콘 위치별
  iconLeft: {
    iconPosition: 'left',
    text: 'Icon Left Button'
  },
  
  iconRight: {
    iconPosition: 'right',
    text: 'Icon Right Button'
  },
  
  noIcon: {
    icon: null,
    text: 'No Icon Button'
  }
};

// 사용 사례별 설정
const useCaseConfigs = {
  // 사업분야 더보기 버튼
  businessMore: {
    type: 'primary',
    text: '사업분야 더보기',
    icon: 'arrow-right',
    iconPosition: 'right',
    className: 'business-more-btn'
  },
  
  // 미디어 더보기 버튼
  mediaMore: {
    type: 'secondary',
    text: '더 많은 소식 보기',
    icon: 'arrow-right',
    iconPosition: 'right',
    className: 'media-more-btn'
  },
  
  // 채용 더보기 버튼
  careerMore: {
    type: 'secondary',
    text: '더 많은 공고 보기',
    icon: 'arrow-right',
    iconPosition: 'right',
    className: 'career-more-btn'
  },
  
  // 푸터 문의하기 버튼
  footerContact: {
    type: 'primary',
    text: '문의하기',
    icon: 'arrow-right',
    iconPosition: 'right',
    className: 'footer-contact-btn'
  },
  
  // CTA 버튼
  cta: {
    type: 'primary',
    size: 'large',
    text: '지금 시작하기',
    icon: 'arrow-right',
    iconPosition: 'right',
    className: 'cta-btn'
  },
  
  // 폼 제출 버튼
  submit: {
    type: 'primary',
    text: '제출하기',
    icon: null,
    className: 'submit-btn'
  },
  
  // 취소 버튼
  cancel: {
    type: 'secondary',
    text: '취소',
    icon: null,
    className: 'cancel-btn'
  }
};

// 설정 팩토리 함수
function createButtonConfig(options = {}) {
  return {
    ...defaultButtonConfig,
    ...options
  };
}

// 프리셋 기반 설정 생성
function createButtonFromPreset(presetName, options = {}) {
  const preset = buttonPresets[presetName];
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}`);
  }
  
  return {
    ...defaultButtonConfig,
    ...preset,
    ...options
  };
}

// 사용 사례 기반 설정 생성
function createButtonFromUseCase(useCase, options = {}) {
  const useCaseConfig = useCaseConfigs[useCase];
  if (!useCaseConfig) {
    throw new Error(`Unknown use case: ${useCase}`);
  }
  
  return {
    ...defaultButtonConfig,
    ...useCaseConfig,
    ...options
  };
}

// 설정 검증 함수
function validateButtonConfig(config) {
  const required = ['text'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(', ')}`);
  }
  
  // 타입 검증
  const validTypes = ['primary', 'secondary'];
  if (config.type && !validTypes.includes(config.type)) {
    throw new Error(`Invalid type: ${config.type}. Must be one of: ${validTypes.join(', ')}`);
  }
  
  const validSizes = ['small', 'medium', 'large'];
  if (config.size && !validSizes.includes(config.size)) {
    throw new Error(`Invalid size: ${config.size}. Must be one of: ${validSizes.join(', ')}`);
  }
  
  const validVariants = ['default', 'outline', 'ghost'];
  if (config.variant && !validVariants.includes(config.variant)) {
    throw new Error(`Invalid variant: ${config.variant}. Must be one of: ${validVariants.join(', ')}`);
  }
  
  const validIconPositions = ['left', 'right'];
  if (config.iconPosition && !validIconPositions.includes(config.iconPosition)) {
    throw new Error(`Invalid iconPosition: ${config.iconPosition}. Must be one of: ${validIconPositions.join(', ')}`);
  }
  
  return true;
}

// 버튼 그룹 설정
const buttonGroupConfigs = {
  default: {
    direction: 'horizontal',
    spacing: 'medium'
  },
  
  vertical: {
    direction: 'vertical',
    spacing: 'medium'
  },
  
  compact: {
    direction: 'horizontal',
    spacing: 'small'
  },
  
  spaced: {
    direction: 'horizontal',
    spacing: 'large'
  }
};

// 전역으로 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    defaultButtonConfig,
    buttonPresets,
    useCaseConfigs,
    buttonGroupConfigs,
    createButtonConfig,
    createButtonFromPreset,
    createButtonFromUseCase,
    validateButtonConfig
  };
} else if (typeof window !== 'undefined') {
  window.ButtonConfig = {
    default: defaultButtonConfig,
    presets: buttonPresets,
    useCases: useCaseConfigs,
    groups: buttonGroupConfigs,
    create: createButtonConfig,
    fromPreset: createButtonFromPreset,
    fromUseCase: createButtonFromUseCase,
    validate: validateButtonConfig
  };
}


