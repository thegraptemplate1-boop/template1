# AeroGrid Button Component Library

재사용 가능한 공통버튼 컴포넌트 라이브러리입니다. 바닐라 JavaScript, React, Next.js 등 다양한 환경에서 사용할 수 있습니다.

## 🚀 주요 기능

- **다양한 타입**: Primary, Secondary 버튼 지원
- **크기 옵션**: Small, Medium, Large 크기 지원
- **변형 스타일**: Default, Outline, Ghost 변형 지원
- **아이콘 지원**: 좌측/우측 아이콘 위치 설정 가능
- **애니메이션**: 부드러운 호버 애니메이션과 화살표 전환 효과
- **반응형**: 모든 디바이스에서 최적화된 경험
- **접근성**: 키보드 네비게이션과 스크린 리더 지원
- **다중 프레임워크**: Vanilla JS, React, Next.js 지원

## 📁 파일 구조

```
button-library/
├── button-component.js          # 바닐라 JavaScript 컴포넌트
├── button-styles.css           # 버튼 전용 스타일
├── button-config.js            # 설정 파일 및 예제
├── Button.jsx                  # React 컴포넌트
├── Button.tsx                  # Next.js/TypeScript 컴포넌트
├── examples/                   # 사용 예제
│   ├── vanilla-usage.html      # 바닐라 JS 사용법
│   └── react-usage.jsx         # React 사용법
└── README.md                   # 이 파일
```

## 🛠️ 설치 및 사용법

### 1. 바닐라 JavaScript 사용법

#### HTML에 파일 포함
```html
<!-- 폰트 로드 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.2/packages/wanted-sans/documentation/webfonts/wanted-sans.css">

<!-- 버튼 라이브러리 스타일 -->
<link rel="stylesheet" href="button-styles.css">

<!-- 버튼 라이브러리 스크립트 -->
<script src="button-config.js"></script>
<script src="button-component.js"></script>
```

#### JavaScript 초기화
```javascript
// 기본 사용
const button = new ButtonComponent({
  type: 'primary',
  text: 'Primary Button'
});

// 팩토리 메서드 사용
const primaryButton = ButtonFactory.createPrimary({
  text: 'Primary Button',
  onClick: () => alert('클릭됨!')
});

// 프리셋 사용
const businessButton = ButtonFactory.create(
  ButtonConfig.fromUseCase('businessMore')
);
```

### 2. React 사용법

#### 컴포넌트 임포트
```jsx
import Button, { 
  PrimaryButton, 
  SecondaryButton, 
  ButtonGroup, 
  useButton 
} from './Button';
```

#### 기본 사용
```jsx
function MyComponent() {
  return (
    <div>
      <PrimaryButton text="Primary Button" />
      <SecondaryButton text="Secondary Button" />
    </div>
  );
}
```

#### 이벤트 핸들링
```jsx
function MyComponent() {
  const handleClick = () => {
    console.log('버튼 클릭됨!');
  };

  return (
    <Button 
      type="primary" 
      text="클릭하세요"
      onClick={handleClick}
    />
  );
}
```

### 3. Next.js/TypeScript 사용법

#### 컴포넌트 임포트
```tsx
import Button, { 
  PrimaryButton, 
  SecondaryButton, 
  ButtonGroup, 
  useButton,
  type ButtonProps 
} from './Button';
```

#### 타입 안전성
```tsx
function MyComponent() {
  const buttonProps: ButtonProps = {
    type: 'primary',
    size: 'medium',
    text: 'TypeScript Button',
    onClick: (e) => {
      console.log('클릭됨:', e);
    }
  };

  return <Button {...buttonProps} />;
}
```

## ⚙️ 설정 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | string | `'primary'` | 버튼 타입 (`'primary'` \| `'secondary'`) |
| `size` | string | `'medium'` | 버튼 크기 (`'small'` \| `'medium'` \| `'large'`) |
| `variant` | string | `'default'` | 버튼 변형 (`'default'` \| `'outline'` \| `'ghost'`) |
| `text` | string | `'Button'` | 버튼 텍스트 |
| `href` | string | `null` | 링크 URL (링크 버튼인 경우) |
| `onClick` | function | `null` | 클릭 이벤트 핸들러 |
| `disabled` | boolean | `false` | 비활성화 상태 |
| `loading` | boolean | `false` | 로딩 상태 |
| `className` | string | `''` | 추가 CSS 클래스 |
| `icon` | string | `'arrow-right'` | 아이콘 타입 |
| `iconPosition` | string | `'right'` | 아이콘 위치 (`'left'` \| `'right'`) |

## 📝 사용 예제

### 기본 버튼들
```javascript
// Primary 버튼
const primaryBtn = new ButtonComponent({
  type: 'primary',
  text: 'Primary Button'
});

// Secondary 버튼
const secondaryBtn = new ButtonComponent({
  type: 'secondary',
  text: 'Secondary Button'
});
```

### 크기별 버튼
```javascript
const smallBtn = new ButtonComponent({
  type: 'primary',
  size: 'small',
  text: 'Small Button'
});

const largeBtn = new ButtonComponent({
  type: 'primary',
  size: 'large',
  text: 'Large Button'
});
```

### 링크 버튼
```javascript
const linkBtn = new ButtonComponent({
  type: 'primary',
  text: '외부 링크',
  href: 'https://example.com',
  target: '_blank'
});
```

### 이벤트 핸들링
```javascript
const eventBtn = new ButtonComponent({
  type: 'primary',
  text: '클릭하세요',
  onClick: (e) => {
    console.log('버튼 클릭됨!', e);
    alert('Hello World!');
  }
});
```

### React에서 사용
```jsx
function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button 
        type="primary" 
        text={`클릭 횟수: ${count}`}
        onClick={() => setCount(count + 1)}
      />
      
      <ButtonGroup direction="horizontal" spacing="medium">
        <PrimaryButton text="저장" />
        <SecondaryButton text="취소" />
      </ButtonGroup>
    </div>
  );
}
```

## 🎨 커스터마이징

### CSS 변수 사용
```css
:root {
  --btn-primary-color: #0201AD;
  --btn-secondary-color: #191919;
  --btn-border-radius: 40px;
  --btn-transition: all 0.3s ease;
}

.aerogrid-btn--primary {
  border-color: var(--btn-primary-color);
}

.aerogrid-btn--primary:hover {
  background: var(--btn-primary-color);
}
```

### 스타일 오버라이드
```css
/* 커스텀 스타일 */
.my-custom-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
}

.my-custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

## 🔧 프리셋 및 사용 사례

### 프리셋 사용
```javascript
// 프리셋 기반 생성
const primaryBtn = ButtonFactory.create(
  ButtonConfig.fromPreset('primary')
);

const smallBtn = ButtonFactory.create(
  ButtonConfig.fromPreset('small')
);
```

### 사용 사례별 생성
```javascript
// 사업분야 더보기 버튼
const businessBtn = ButtonFactory.create(
  ButtonConfig.fromUseCase('businessMore')
);

// 푸터 문의하기 버튼
const contactBtn = ButtonFactory.create(
  ButtonConfig.fromUseCase('footerContact')
);
```

## 📱 반응형 지원

라이브러리는 다음과 같은 브레이크포인트를 지원합니다:

- **Desktop**: 1200px 이상
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: 480px 미만

## 🔧 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 React/Next.js 호환성

### React 16.8+ 지원
- Hooks 지원 (`useButton`)
- 함수형 컴포넌트 최적화
- Context API 지원

### Next.js 12+ 지원
- TypeScript 완전 지원
- SSR/SSG 호환
- Image 최적화 지원
- Link 컴포넌트 통합

### 성능 최적화
- `React.memo` 적용
- `useCallback` 최적화
- 불필요한 리렌더링 방지

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해주세요.

---

**AeroGrid Button Component Library** - 재사용 가능한 공통버튼 컴포넌트


