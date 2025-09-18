/**
 * AeroGrid Button Component - Next.js/TypeScript Version
 * Next.js와 TypeScript에서 사용할 수 있는 공통버튼 컴포넌트
 */

import React, { useState, useCallback, forwardRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './button-styles.css';

// 타입 정의
export interface ButtonProps {
  type?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outline' | 'ghost';
  text?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'small' | 'medium' | 'large';
  className?: string;
}

// 메인 버튼 컴포넌트
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  type = 'primary',
  size = 'medium',
  variant = 'default',
  text = 'Button',
  href = undefined,
  onClick = null,
  disabled = false,
  loading = false,
  className = '',
  icon = 'arrow-right',
  iconPosition = 'right',
  children,
  target,
  rel,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  // 클래스명 생성
  const buttonClass = [
    'aerogrid-btn',
    `aerogrid-btn--${type}`,
    `aerogrid-btn--${size}`,
    `aerogrid-btn--${variant}`,
    isHovered && 'aerogrid-btn--hover',
    disabled && 'aerogrid-btn--disabled',
    loading && 'aerogrid-btn--loading',
    className
  ].filter(Boolean).join(' ');

  // 아이콘 컴포넌트
  const IconComponent = useCallback(() => {
    if (!icon) return null;

    return (
      <div className={`aerogrid-btn__icon aerogrid-btn__icon--${iconPosition}`}>
        <Image 
          src="/img/arrow-right.svg" 
          alt="arrow right" 
          width={20} 
          height={20}
          priority
        />
      </div>
    );
  }, [icon, iconPosition]);

  // 클릭 핸들러
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  }, [onClick, disabled, loading]);

  // 마우스 이벤트 핸들러
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // 버튼 내용
  const buttonContent = (
    <>
      {iconPosition === 'left' && <IconComponent />}
      <span className="aerogrid-btn__text">
        {children || text}
      </span>
      {iconPosition === 'right' && <IconComponent />}
    </>
  );

  // 공통 속성
  const commonProps = {
    className: buttonClass,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    disabled: disabled || loading,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
    ...props
  };

  // 링크 버튼인 경우
  if (href && !disabled) {
    // 외부 링크인지 확인
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          {...commonProps}
        >
          {buttonContent}
        </a>
      );
    }

    // Next.js Link 사용
    return (
      <Link href={href} passHref>
        <a
          target={target}
          rel={rel}
          {...commonProps}
        >
          {buttonContent}
        </a>
      </Link>
    );
  }

  // 일반 버튼
  return (
    <button
      ref={ref}
      type="button"
      {...commonProps}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = 'Button';

// 버튼 타입별 프리셋 컴포넌트
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'type'>>((props, ref) => (
  <Button ref={ref} type="primary" {...props} />
));

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'type'>>((props, ref) => (
  <Button ref={ref} type="secondary" {...props} />
));

PrimaryButton.displayName = 'PrimaryButton';
SecondaryButton.displayName = 'SecondaryButton';

// 버튼 그룹 컴포넌트
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ 
  children, 
  direction = 'horizontal',
  spacing = 'medium',
  className = '',
  ...props 
}) => {
  const groupClass = [
    'aerogrid-btn-group',
    `aerogrid-btn-group--${direction}`,
    `aerogrid-btn-group--${spacing}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClass} {...props}>
      {children}
    </div>
  );
};

// 버튼 훅 (상태 관리용)
export const useButton = (initialState: Partial<ButtonProps> = {}) => {
  const [state, setState] = useState({
    disabled: false,
    loading: false,
    ...initialState
  });

  const setDisabled = useCallback((disabled: boolean) => {
    setState(prev => ({ ...prev, disabled }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return {
    ...state,
    setDisabled,
    setLoading,
    reset
  };
};

// 버튼 컨텍스트 (테마 관리용)
export const ButtonContext = React.createContext<{
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
}>({});

export const ButtonProvider: React.FC<{
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
}> = ({ children, theme, size }) => {
  return (
    <ButtonContext.Provider value={{ theme, size }}>
      {children}
    </ButtonContext.Provider>
  );
};

export default Button;


