/**
 * Button Component Library - React Usage Example
 * React/Next.js에서 버튼 컴포넌트 사용 예제
 */

import React, { useState } from 'react';
import Button, { 
  PrimaryButton, 
  SecondaryButton, 
  ButtonGroup, 
  useButton 
} from '../Button';

// 기본 사용법 예제
export const BasicUsageExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>기본 사용법</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <PrimaryButton text="Primary Button" />
        <SecondaryButton text="Secondary Button" />
      </div>
    </div>
  );
};

// 크기별 버튼 예제
export const SizeExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>크기별 버튼</h2>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button type="primary" size="small" text="Small Button" />
        <Button type="primary" size="medium" text="Medium Button" />
        <Button type="primary" size="large" text="Large Button" />
      </div>
    </div>
  );
};

// 변형별 버튼 예제
export const VariantExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>변형별 버튼</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" variant="default" text="Default Button" />
        <Button type="primary" variant="outline" text="Outline Button" />
        <Button type="primary" variant="ghost" text="Ghost Button" />
      </div>
    </div>
  );
};

// 아이콘 위치 예제
export const IconPositionExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>아이콘 위치</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button 
          type="primary" 
          text="Icon Left" 
          iconPosition="left" 
        />
        <Button 
          type="primary" 
          text="Icon Right" 
          iconPosition="right" 
        />
        <Button 
          type="primary" 
          text="No Icon" 
          icon={null} 
        />
      </div>
    </div>
  );
};

// 링크 버튼 예제
export const LinkButtonExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>링크 버튼</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button 
          type="primary" 
          text="External Link" 
          href="https://example.com"
          target="_blank"
        />
        <Button 
          type="secondary" 
          text="Internal Link" 
          href="/about"
        />
      </div>
    </div>
  );
};

// 상태별 버튼 예제
export const StateExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>상태별 버튼</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button type="primary" text="Normal Button" />
        <Button type="primary" text="Disabled Button" disabled />
        <Button type="primary" text="Loading Button" loading />
      </div>
    </div>
  );
};

// 버튼 그룹 예제
export const ButtonGroupExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>버튼 그룹</h2>
      
      <h3>수평 그룹</h3>
      <ButtonGroup direction="horizontal" spacing="medium">
        <PrimaryButton text="저장" />
        <SecondaryButton text="취소" />
        <Button type="primary" text="미리보기" variant="outline" />
      </ButtonGroup>
      
      <h3>수직 그룹</h3>
      <ButtonGroup direction="vertical" spacing="small">
        <PrimaryButton text="상단 버튼" />
        <SecondaryButton text="중간 버튼" />
        <Button type="primary" text="하단 버튼" variant="ghost" />
      </ButtonGroup>
    </div>
  );
};

// 이벤트 핸들링 예제
export const EventHandlingExample = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setCount(count + 1);
    setMessage(`버튼이 ${count + 1}번 클릭되었습니다!`);
  };

  const handleReset = () => {
    setCount(0);
    setMessage('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>이벤트 핸들링</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <Button 
          type="primary" 
          text={`클릭 횟수: ${count}`}
          onClick={handleClick}
        />
        <Button 
          type="secondary" 
          text="리셋"
          onClick={handleReset}
        />
      </div>
      {message && (
        <p style={{ color: '#0201AD', fontWeight: 'bold' }}>{message}</p>
      )}
    </div>
  );
};

// useButton 훅 예제
export const UseButtonHookExample = () => {
  const buttonState = useButton({
    disabled: false,
    loading: false
  });

  const handleAsyncAction = async () => {
    buttonState.setLoading(true);
    
    // 비동기 작업 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    buttonState.setLoading(false);
    alert('작업이 완료되었습니다!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>useButton 훅 사용</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <Button 
          type="primary" 
          text="비동기 작업 실행"
          onClick={handleAsyncAction}
          disabled={buttonState.disabled}
          loading={buttonState.loading}
        />
        <Button 
          type="secondary" 
          text={buttonState.disabled ? '활성화' : '비활성화'}
          onClick={() => buttonState.setDisabled(!buttonState.disabled)}
        />
        <Button 
          type="primary" 
          text="리셋"
          onClick={buttonState.reset}
          variant="outline"
        />
      </div>
      <p>상태: {buttonState.loading ? '로딩 중...' : buttonState.disabled ? '비활성화' : '활성화'}</p>
    </div>
  );
};

// 사용 사례별 버튼 예제
export const UseCaseExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>사용 사례별 버튼</h2>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button 
          type="primary" 
          text="사업분야 더보기"
          className="business-more-btn"
        />
        <Button 
          type="secondary" 
          text="더 많은 소식 보기"
          className="media-more-btn"
        />
        <Button 
          type="secondary" 
          text="더 많은 공고 보기"
          className="career-more-btn"
        />
        <Button 
          type="primary" 
          text="문의하기"
          className="footer-contact-btn"
        />
      </div>
    </div>
  );
};

// 메인 예제 컴포넌트
export const ButtonLibraryExample = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Button Component Library - React 사용법</h1>
      
      <BasicUsageExample />
      <SizeExample />
      <VariantExample />
      <IconPositionExample />
      <LinkButtonExample />
      <StateExample />
      <ButtonGroupExample />
      <EventHandlingExample />
      <UseButtonHookExample />
      <UseCaseExample />
    </div>
  );
};

export default ButtonLibraryExample;


