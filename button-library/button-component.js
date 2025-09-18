/**
 * AeroGrid Button Component Library
 * 재사용 가능한 공통버튼 컴포넌트
 */

class ButtonComponent {
  constructor(options = {}) {
    // 기본 설정
    this.config = {
      container: options.container || document.body,
      type: options.type || 'primary', // 'primary' | 'secondary'
      text: options.text || 'Button',
      href: options.href || null,
      onClick: options.onClick || null,
      className: options.className || '',
      disabled: options.disabled || false,
      size: options.size || 'medium', // 'small' | 'medium' | 'large'
      variant: options.variant || 'default', // 'default' | 'outline' | 'ghost'
      icon: options.icon || 'arrow-right',
      iconPosition: options.iconPosition || 'right', // 'left' | 'right'
      ...options
    };

    this.element = null;
    this.init();
  }

  /**
   * 컴포넌트 초기화
   */
  init() {
    this.createElement();
    this.bindEvents();
    this.appendToContainer();
  }

  /**
   * HTML 요소 생성
   */
  createElement() {
    const buttonClass = this.getButtonClass();
    const iconHtml = this.getIconHtml();
    const textHtml = this.getTextHtml();

    const buttonHtml = `
      <button class="${buttonClass}" ${this.config.disabled ? 'disabled' : ''}>
        ${this.config.iconPosition === 'left' ? iconHtml : ''}
        ${textHtml}
        ${this.config.iconPosition === 'right' ? iconHtml : ''}
      </button>
    `;

    // 임시 div로 HTML 파싱
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = buttonHtml.trim();
    this.element = tempDiv.firstElementChild;
  }

  /**
   * 버튼 클래스 결정
   */
  getButtonClass() {
    const baseClass = 'aerogrid-btn';
    const typeClass = `aerogrid-btn--${this.config.type}`;
    const sizeClass = `aerogrid-btn--${this.config.size}`;
    const variantClass = `aerogrid-btn--${this.config.variant}`;
    const customClass = this.config.className;

    return [baseClass, typeClass, sizeClass, variantClass, customClass]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * 아이콘 HTML 생성
   */
  getIconHtml() {
    if (!this.config.icon) return '';

    const iconClass = `aerogrid-btn__icon aerogrid-btn__icon--${this.config.iconPosition}`;
    
    return `
      <div class="${iconClass}">
        <img src="./img/arrow-right.svg" alt="arrow right" width="20" height="20">
      </div>
    `;
  }

  /**
   * 텍스트 HTML 생성
   */
  getTextHtml() {
    return `<span class="aerogrid-btn__text">${this.config.text}</span>`;
  }

  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    if (this.config.onClick) {
      this.element.addEventListener('click', (e) => {
        if (this.config.disabled) {
          e.preventDefault();
          return;
        }
        this.config.onClick(e);
      });
    }

    // 호버 애니메이션을 위한 이벤트
    this.element.addEventListener('mouseenter', () => {
      this.element.classList.add('aerogrid-btn--hover');
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.classList.remove('aerogrid-btn--hover');
    });
  }

  /**
   * 컨테이너에 추가
   */
  appendToContainer() {
    if (typeof this.config.container === 'string') {
      const container = document.querySelector(this.config.container);
      if (container) {
        container.appendChild(this.element);
      }
    } else if (this.config.container && this.config.container.appendChild) {
      this.config.container.appendChild(this.element);
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

  /**
   * 텍스트 변경
   */
  setText(text) {
    this.config.text = text;
    const textElement = this.element.querySelector('.aerogrid-btn__text');
    if (textElement) {
      textElement.textContent = text;
    }
  }

  /**
   * 활성화/비활성화
   */
  setDisabled(disabled) {
    this.config.disabled = disabled;
    if (disabled) {
      this.element.setAttribute('disabled', '');
      this.element.classList.add('aerogrid-btn--disabled');
    } else {
      this.element.removeAttribute('disabled');
      this.element.classList.remove('aerogrid-btn--disabled');
    }
  }

  /**
   * 컴포넌트 제거
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  /**
   * DOM 요소 반환
   */
  getElement() {
    return this.element;
  }
}

// 버튼 팩토리 함수
class ButtonFactory {
  static create(options) {
    return new ButtonComponent(options);
  }

  static createPrimary(options) {
    return new ButtonComponent({ ...options, type: 'primary' });
  }

  static createSecondary(options) {
    return new ButtonComponent({ ...options, type: 'secondary' });
  }

  static createMultiple(buttons) {
    return buttons.map(button => new ButtonComponent(button));
  }
}

// 전역으로 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ButtonComponent, ButtonFactory };
} else if (typeof window !== 'undefined') {
  window.ButtonComponent = ButtonComponent;
  window.ButtonFactory = ButtonFactory;
}


