# AeroGrid Hero Section Library

재사용 가능한 히어로 섹션 컴포넌트 라이브러리입니다. 다른 웹사이트 구축 시 동일한 구조와 기능을 쉽게 적용할 수 있습니다.

## 🚀 주요 기능

- **자동 슬라이드쇼**: 배경 이미지와 텍스트가 자동으로 전환됩니다
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험을 제공합니다
- **커스터마이징**: 이미지, 텍스트, 네비게이션 등을 자유롭게 설정할 수 있습니다
- **애니메이션**: 부드러운 텍스트 전환 애니메이션을 지원합니다
- **접근성**: 키보드 네비게이션과 스크린 리더를 지원합니다

## 📁 파일 구조

```
hero-library/
├── hero-component.js          # 메인 컴포넌트 클래스
├── hero-styles.css           # 히어로 전용 스타일
├── hero-config.js            # 설정 파일 및 예제
├── examples/                 # 사용 예제
│   ├── basic-usage.html      # 기본 사용법
│   └── advanced-usage.html   # 고급 사용법
└── README.md                 # 이 파일
```

## 🛠️ 설치 및 사용법

### 1. 파일 포함

HTML 파일에 다음 파일들을 포함하세요:

```html
<!-- 폰트 로드 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.2/packages/wanted-sans/documentation/webfonts/wanted-sans.css">
<link href="https://fonts.googleapis.com/css2?family=Fahkwang:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- 히어로 라이브러리 스타일 -->
<link rel="stylesheet" href="hero-styles.css">

<!-- 히어로 라이브러리 스크립트 -->
<script src="hero-config.js"></script>
<script src="hero-component.js"></script>
```

### 2. HTML 구조

```html
<!-- 히어로 섹션 컨테이너 -->
<section class="hero"></section>
```

### 3. JavaScript 초기화

```javascript
// 기본 설정으로 초기화
const hero = new HeroSection(HeroConfig.default);

// 또는 커스텀 설정으로 초기화
const hero = new HeroSection({
  container: '.hero',
  images: [
    { src: './img/hero1.jpg', alt: 'Hero 1' },
    { src: './img/hero2.jpg', alt: 'Hero 2' }
  ],
  texts: [
    { title: '첫 번째 슬라이드', subtitle: '첫 번째 슬라이드 설명' },
    { title: '두 번째 슬라이드', subtitle: '두 번째 슬라이드 설명' }
  ],
  autoplay: true,
  autoplayInterval: 4000
});
```

## ⚙️ 설정 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `container` | string | `.hero` | 히어로 섹션 컨테이너 선택자 |
| `images` | array | `[]` | 배경 이미지 배열 |
| `texts` | array | `[]` | 텍스트 배열 (title, subtitle) |
| `logo` | string | `./img/logo.svg` | 로고 이미지 경로 |
| `navigation` | array | `[]` | 네비게이션 메뉴 배열 |
| `autoplay` | boolean | `true` | 자동 재생 여부 |
| `autoplayInterval` | number | `4000` | 자동 재생 간격 (ms) |
| `showPagination` | boolean | `true` | 페이지네이션 표시 여부 |
| `showPlayPause` | boolean | `true` | 플레이/일시정지 버튼 표시 여부 |
| `animationDuration` | number | `600` | 애니메이션 지속 시간 (ms) |
| `pauseOnHover` | boolean | `true` | 마우스 호버 시 일시정지 여부 |

## 📝 사용 예제

### 기본 사용법

```javascript
const hero = new HeroSection(HeroConfig.default);
```

### 간단한 설정

```javascript
const hero = new HeroSection({
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
});
```

### 고급 설정

```javascript
const hero = new HeroSection({
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
});
```

## 🎮 API 메서드

### `goToSlide(index)`
특정 슬라이드로 이동합니다.

```javascript
hero.goToSlide(2); // 3번째 슬라이드로 이동
```

### `updateConfig(newConfig)`
설정을 업데이트합니다.

```javascript
hero.updateConfig({
  autoplay: false,
  autoplayInterval: 6000
});
```

### `destroy()`
컴포넌트를 제거합니다.

```javascript
hero.destroy();
```

## 🎨 커스터마이징

### CSS 변수 사용

```css
:root {
  --hero-title-font-size: 80px;
  --hero-subtitle-font-size: 24px;
  --hero-overlay-opacity: 0.4;
}

.hero-title {
  font-size: var(--hero-title-font-size);
}

.hero-subtitle {
  font-size: var(--hero-subtitle-font-size);
}

.hero-overlay {
  background: linear-gradient(135deg, rgba(0, 0, 0, var(--hero-overlay-opacity)) 0%, rgba(0, 0, 0, 0.2) 100%);
}
```

### 스타일 오버라이드

```css
/* 커스텀 스타일 */
.hero-title {
  font-size: 100px;
  color: #ff6b6b;
}

.hero-subtitle {
  font-size: 28px;
  color: #4ecdc4;
}
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

**AeroGrid Hero Section Library** - 재사용 가능한 히어로 섹션 컴포넌트


