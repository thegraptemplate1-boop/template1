/**
 * AeroGrid Button Component - React Version
 * React/Next.js에서 사용할 수 있는 공통버튼 컴포넌트
 */

import React, { useState, useCallback } from 'react';
import './button-styles.css';

const Button = ({
  type = 'primary',
  size = 'medium',
  variant = 'default',
  text = 'Button',
  href = null,
  onClick = null,
  disabled = false,
  loading = false,
  className = '',
  icon = 'arrow-right',
  iconPosition = 'right',
  children,
  ...props
}) => {
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
        <img 
          src="./img/arrow-right.svg" 
          alt="arrow right" 
          width="20" 
          height="20"
        />
      </div>
    );
  }, [icon, iconPosition]);

  // 클릭 핸들러
  const handleClick = useCallback((e) => {
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

  // 링크 버튼인 경우
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={buttonClass}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {buttonContent}
      </a>
    );
  }

  // 일반 버튼
  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

// 버튼 타입별 프리셋 컴포넌트
export const PrimaryButton = (props) => (
  <Button type="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <Button type="secondary" {...props} />
);

// 버튼 그룹 컴포넌트
export const ButtonGroup = ({ 
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
export const useButton = (initialState = {}) => {
  const [state, setState] = useState({
    disabled: false,
    loading: false,
    ...initialState
  });

  const setDisabled = useCallback((disabled) => {
    setState(prev => ({ ...prev, disabled }));
  }, []);

  const setLoading = useCallback((loading) => {
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

export default Button;


