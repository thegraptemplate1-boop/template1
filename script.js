// ========== CUSTOM CURSOR ==========
(() => {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  // 상태 변수
  let x = 0, y = 0; // 현재 위치
  let tx = 0, ty = 0; // 목표 위치
  let angle = 0; // 현재 각도
  let targetAngle = 0; // 목표 각도
  let lastX = 0; // 이전 X 위치

  // 상수
  const followEase = 0.18; // 따라가는 속도
  const rotateEase = 0.12; // 회전 속도
  const maxAngle = 30; // 최대 회전 각도

  // 옵션 B: 정확한 흑/백 전환 함수 (필요시 사용)
  function setBlackOrWhiteByBackground(px, py, targetCursor = null) {
    const element = document.elementFromPoint(px, py);
    if (!element) return;

    let currentElement = element;
    let backgroundColor = null;

    // 부모를 타고 올라가며 transparent가 아닌 배경색 찾기
    while (currentElement && currentElement !== document.body) {
      const computedStyle = window.getComputedStyle(currentElement);
      const bgColor = computedStyle.backgroundColor;
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        backgroundColor = bgColor;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    if (!backgroundColor) {
      backgroundColor = 'rgb(255, 255, 255)';
    }

    // RGB 값 추출
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return;

    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    // sRGB → 선형 변환 후 루미넌스 계산
    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const rLinear = toLinear(r / 255);
    const gLinear = toLinear(g / 255);
    const bLinear = toLinear(b / 255);
    
    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

    // 대상 커서 결정 (기본값: 메인 커서)
    const targetElement = targetCursor || cursor;

    // 0.5 초과면 밝은 배경, 아니면 어두운 배경
    if (luminance > 0.5) {
      targetElement.classList.remove('is-dark');
      targetElement.classList.add('is-light');
    } else {
      targetElement.classList.remove('is-light');
      targetElement.classList.add('is-dark');
    }
  }

  // pointermove 이벤트 핸들러
  function handlePointerMove(e) {
    tx = e.clientX;
    ty = e.clientY;

    // 수평 속도 계산
    const dx = e.clientX - lastX;
    const dir = Math.sign(dx);
    const speed = Math.min(Math.abs(dx) / 24, 1); // 속도를 0-1로 정규화
    targetAngle = dir * maxAngle * speed;

    lastX = e.clientX;
  }

  // requestAnimationFrame 루프
  function tick() {
    // LERP로 부드럽게 이동
    x += (tx - x) * followEase;
    y += (ty - y) * followEase;
    angle += (targetAngle - angle) * rotateEase;

    // 커서가 화면 경계를 벗어나지 않도록 제한 (더 넉넉하게)
    const cursorSize = 30; // 커서 크기의 절반 + 여유분
    x = Math.max(cursorSize, Math.min(window.innerWidth - cursorSize, x));
    y = Math.max(cursorSize, Math.min(window.innerHeight - cursorSize, y));

    // 커서 업데이트 (모든 섹션에서 동일하게)
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    requestAnimationFrame(tick);
  }

  // 커서가 항상 최상위에 있도록 보장
function ensureCursorOnTop() {
  cursor.style.zIndex = '99999999';
}

  // 이벤트 리스너 등록
  document.addEventListener('pointermove', handlePointerMove, { passive: true });

  // 주기적으로 커서 위치 확인 및 보장 (더 자주 실행)
  setInterval(ensureCursorOnTop, 50);
  
  // 추가 보장: 스크롤 이벤트에서도 커서 상태 확인
  window.addEventListener('scroll', ensureCursorOnTop, { passive: true });
  
  // 단일 커서 사용 - 모든 섹션에서 동일하게 작동
  
  // 단일 커서로 모든 섹션에서 동일하게 작동

  // 초기 커서 표시 강제 (CSS에서 이미 설정됨)
  // cursor.style.display = 'block';     // CSS: display: block !important
  // cursor.style.opacity = '1';         // CSS: opacity: 1 !important  
  // cursor.style.visibility = 'visible'; // CSS: visibility: visible !important


  // 루프 시작
  tick();
})();

// Header scroll effect
let lastScrollY = 0;
let isScrollingDown = false;
let scrollTimeout = null;

window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  const currentScrollY = window.scrollY;
  
  // 기존 타이머 클리어
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  
  // 스크롤 방향 감지
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // 아래로 스크롤 - GNB 숨김
    isScrollingDown = true;
    header.classList.add('hidden');
  } else if (currentScrollY < lastScrollY) {
    // 위로 스크롤 - GNB 표시
    isScrollingDown = false;
    header.classList.remove('hidden');
  }
  
  // 스크롤 상태에 따른 배경 변경
  if (currentScrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // 2초 후 자동으로 GNB 노출
  scrollTimeout = setTimeout(() => {
    if (currentScrollY > 100) { // 100px 이상 스크롤된 상태에서만
      header.classList.remove('hidden');
    }
  }, 2000);
  
  lastScrollY = currentScrollY;
});

// Hero image slider
document.addEventListener('DOMContentLoaded', function() {
  let images = Array.from(document.querySelectorAll('.hero-bg-image')); // ← let으로
  const dots = document.querySelectorAll('.pagination-dots .dot');
  let currentSlide = 0;
  let isTransitioning = false;
  
  // 슬라이드별 텍스트 데이터
  const slideTexts = [
    {
      title: "하늘을 설계하다",
      subtitle: "산업용 자율비행 드론부터 관제·AI 비전까지"
    },
    {
      title: "효율적으로<br>설계하고 계획하다",
      subtitle: "매핑, 모델링, 워크플로 자동화"
    },
    {
      title: "최대한의 안전을<br>확보하다",
      subtitle: "신속한 상황 인식으로 효율적인 공공 안전 확보"
    },
    {
      title: "정밀하고 간소한<br>데이터 처리",
      subtitle: "지리·환경·농업등 다양한 분야의 데이터를 제공"
    }
  ];
  
  // 초기 텍스트 상태 설정 (즉시 실행)
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  
  // 첫 진입 시에도 줄바꿈 처리를 위해 텍스트 내용 설정
  const titleContent = heroTitle.querySelector('.text-content');
  const titleText = slideTexts[0].title; // 첫 번째 슬라이드 텍스트
  
  if (titleText.includes('<br>')) {
    const lines = titleText.split('<br>');
    titleContent.innerHTML = lines.map((line, i) => 
      `<div class="title-line" data-line="${i}"><span class="line-text">${line.trim()}</span></div>`
    ).join('');
  } else {
    titleContent.innerHTML = `<div class="title-line" data-line="0"><span class="line-text">${titleText}</span></div>`;
  }
  
  // 기존 클래스 완전히 제거하여 기본 상태로 시작
  heroTitle.classList.remove('animate', 'exit', 'enter');
  heroSubtitle.classList.remove('animate', 'exit', 'enter');
  
  // 첫 진입 시에는 기본 상태로 시작 (텍스트가 보이는 상태)
  // 200ms 후 바로 animate 클래스로 변경하여 모션 시작
  setTimeout(() => {
    // 타이틀과 서브타이틀을 동시에 animate 클래스로 변경
    heroTitle.classList.add('animate');
    heroSubtitle.classList.add('animate');
  }, 200);
  
  // 초기 프로그레스 바 애니메이션 시작 (페이지 로드 후 4초 타이머와 동기화)
  setTimeout(() => {
    startProgressAnimation();
  }, 100); // 약간의 지연으로 초기 전환 방지

  function showSlide(index, isManualClick = false) {
    if (isTransitioning || index === currentSlide) return;
    
    isTransitioning = true;
    
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    // 1단계: 기존 텍스트 아래로 사라짐 (exit)
    heroTitle.classList.add('exit');
    heroSubtitle.classList.add('exit');
    
    // 2단계: 이미지 전환
    setTimeout(() => {
      // 현재 활성 이미지/비디오 비활성화
      if (images[currentSlide]) {
        images[currentSlide].classList.remove('active');
        images[currentSlide].style.opacity = '0';
        images[currentSlide].style.visibility = 'hidden';
        
        // 비디오인 경우 일시정지
        if (images[currentSlide].tagName === 'VIDEO') {
          images[currentSlide].pause();
        }
      }
      if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
      }
      
      // 이전 슬라이드의 프로그레스 바 즉시 초기화
      const prevDot = dots[currentSlide];
      if (prevDot) {
        const prevProgressCircle = prevDot.querySelector('.progress-ring-circle');
        if (prevProgressCircle) {
          const radius = 12;
          const circumference = 2 * Math.PI * radius;
          prevProgressCircle.style.strokeDashoffset = circumference; // 0% 상태로 즉시 초기화
        }
      }
      
      // 새로운 이미지/비디오 활성화
      if (images[index]) {
        images[index].classList.add('active');
        images[index].style.opacity = '1';
        images[index].style.visibility = 'visible';
        
        // 비디오인 경우 재생 시작
        if (images[index].tagName === 'VIDEO') {
          const video = images[index];
          video.currentTime = 0; // 처음부터 재생
          video.play().catch(error => {
            console.log('비디오 자동 재생 실패 (정상):', error);
          });
        }
      }
      if (dots[index]) {
        dots[index].classList.add('active');
      }
      
      currentSlide = index;
      
      // 텍스트 내용 변경 - 동적 콘텐츠 사용
      const titleContent = heroTitle.querySelector('.text-content');
      const subtitleContent = heroSubtitle.querySelector('.text-content');
      
      // 동적 콘텐츠에서 슬라이드 텍스트 가져오기
      let titleText = '하늘을 설계하다';
      let subtitleText = '산업용 자율비행 드론부터 관제·AI 비전까지';
      
      if (window.contentData && window.contentData.hero && window.contentData.hero.slides) {
        const activeSlides = window.contentData.hero.slides.filter(slide => slide.active);
        if (activeSlides[index]) {
          titleText = activeSlides[index].title || titleText;
          subtitleText = activeSlides[index].subtitle || subtitleText;
        }
      } else if (slideTexts[index]) {
        // 폴백: 정적 데이터 사용
        titleText = slideTexts[index].title;
        subtitleText = slideTexts[index].subtitle;
      }
      
      // 타이틀과 서브타이틀을 애니메이션 구조로 업데이트
      if (titleText.includes('<br>')) {
        const lines = titleText.split('<br>');
        heroTitle.innerHTML = `<span class="text-content">${lines.map((line, i) => 
          `<div class="title-line" data-line="${i}"><span class="line-text">${line.trim()}</span></div>`
        ).join('')}</span>`;
      } else {
        heroTitle.innerHTML = `<span class="text-content"><div class="title-line" data-line="0"><span class="line-text">${titleText}</span></div></span>`;
      }
      
      heroSubtitle.innerHTML = `<span class="text-content">${subtitleText}</span>`;
      
      // exit 클래스 제거하고 enter 클래스 추가
      heroTitle.classList.remove('exit');
      heroSubtitle.classList.remove('exit');
      heroTitle.classList.add('enter');
      heroSubtitle.classList.add('enter');
      
      // 3단계: 새 텍스트 아래에서 위로 나타남
      setTimeout(() => {
        heroTitle.classList.remove('enter');
        heroTitle.classList.add('animate');
      }, 100);
      
      // 서브 텍스트는 0.25초 후에 나타남
      setTimeout(() => {
        heroSubtitle.classList.remove('enter');
        heroSubtitle.classList.add('animate');
      }, 250);
      
    }, 400);
    
    // 전환 완료 후 플래그 리셋 및 프로그레스 바 시작
    setTimeout(() => {
      isTransitioning = false;
      // 프로그레스 바 시작 (자동 전환인 경우)
      if (isPlaying) {
        startProgressAnimation();
      }
    }, 800);
  }

  // 플레이/일시정지 버튼 클릭 이벤트
  const playPauseBtn = document.querySelector('.play-pause-btn');
  playPauseBtn.addEventListener('click', togglePlayPause);
  
  // 점 클릭 이벤트
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      // 수동 클릭 시 즉시 슬라이드 전환
      showSlide(index, true);
      // 클릭 시 자동 슬라이드 재시작
      restartAutoSlide();
    });
  });

  // 현재 슬라이드의 미디어 타입 확인
  function getCurrentSlideMediaType() {
    if (images[currentSlide]) {
      return images[currentSlide].tagName === 'VIDEO' ? 'video' : 'image';
    }
    return 'image';
  }
  
  // 현재 슬라이드의 전환 시간 계산
  function getCurrentSlideDuration() {
    const mediaType = getCurrentSlideMediaType();
    
    if (mediaType === 'video' && images[currentSlide]) {
      const video = images[currentSlide];
      // 비디오 재생 시간이 있으면 그 시간을 사용, 없으면 기본 8초
      return video.duration ? Math.max(video.duration * 1000, 3000) : 8000;
    }
    
    // 이미지의 경우 기본 4초
    return 4000;
  }
  
  // 자동 슬라이드 함수 (프로그레스 바 완료 시점에만 전환)
  function startAutoSlide() {
    // 프로그레스 바가 완료되면 자동으로 다음 슬라이드로 전환
    // 실제 전환은 startProgressAnimation 함수에서 처리
    return setInterval(() => {
      // 이 함수는 더 이상 직접 슬라이드를 전환하지 않음
      // 프로그레스 바 완료 시점에 showSlide가 호출됨
    }, getCurrentSlideDuration());
  }
  
  // 자동 슬라이드 시작
  let autoSlideInterval = startAutoSlide();
  let isPlaying = true;
  
  // 자동 슬라이드 재시작 함수
  function restartAutoSlide() {
    if (isPlaying) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = startAutoSlide();
    }
  }
  
  // 프로그레스 바 애니메이션
  let currentProgressInterval = null;
  let savedProgress = 0; // 일시정지 시점의 진행률 저장
  let progressStartTime = 0; // 프로그레스 시작 시간 저장
  
  function startProgressAnimation(resumeFromSaved = false) {
    // 기존 프로그레스 바 애니메이션 정리
    if (currentProgressInterval) {
      clearInterval(currentProgressInterval);
      currentProgressInterval = null;
    }
    
    const activeDot = document.querySelector('.dot.active');
    if (!activeDot) return;
    
    const progressCircle = activeDot.querySelector('.progress-ring-circle');
    if (!progressCircle) return;
    
    // 원의 둘레 계산 (2 * π * r)
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    
    if (!resumeFromSaved) {
      // 새로운 슬라이드 시작 시 모든 프로그레스 바를 0%로 리셋
      document.querySelectorAll('.progress-ring-circle').forEach(circle => {
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
      });
      savedProgress = 0;
      progressStartTime = Date.now();
    }
    
    // stroke-dasharray와 stroke-dashoffset 설정
    progressCircle.style.strokeDasharray = circumference;
    
    if (resumeFromSaved) {
      // 일시정지 시점부터 재개
      const offset = circumference - (savedProgress / 40) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    } else {
      progressCircle.style.strokeDashoffset = circumference;
    }
    
    // 현재 슬라이드의 전환 시간에 맞춰 프로그레스 바 애니메이션
    const slideDuration = getCurrentSlideDuration();
    const totalSteps = slideDuration / 50; // 50ms 간격으로 계산
    let progress = resumeFromSaved ? savedProgress : 0;
    const startProgress = progress;
    
    currentProgressInterval = setInterval(() => {
      if (!isPlaying || !activeDot.classList.contains('active')) {
        clearInterval(currentProgressInterval);
        currentProgressInterval = null;
        return;
      }
      
      progress += 100 / totalSteps; // 동적 시간에 맞춰 진행률 계산
      savedProgress = progress; // 현재 진행률 저장
      const offset = circumference - (progress / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
      
      if (progress >= 100) {
        clearInterval(currentProgressInterval);
        currentProgressInterval = null;
        savedProgress = 0; // 완료 시 저장된 진행률 리셋
        // 프로그레스 바 완료 시점에 즉시 슬라이드 전환
        if (isPlaying && !isTransitioning) {
          const nextSlide = (currentSlide + 1) % images.length;
          showSlide(nextSlide);
        }
      }
    }, 50); // 50ms 간격으로 더 부드럽게
  }
  
  // 플레이/일시정지 토글
  function togglePlayPause() {
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    if (isPlaying) {
      // 일시정지
      clearInterval(autoSlideInterval);
      if (currentProgressInterval) {
        clearInterval(currentProgressInterval);
        currentProgressInterval = null;
      }
      pauseIcon.classList.remove('active');
      playIcon.classList.add('active');
      isPlaying = false;
    } else {
      // 재생
      autoSlideInterval = startAutoSlide();
      playIcon.classList.remove('active');
      pauseIcon.classList.add('active');
      isPlaying = true;
      startProgressAnimation(true); // 저장된 진행률부터 재개
    }
  }

  // 새로 추가: 미디어 갱신 시 슬라이더 리셋
  function refreshHeroMedia() {
    images = Array.from(document.querySelectorAll('.hero-bg-image'));
    currentSlide = 0;

    // 모든 미디어 기본상태로, 첫 슬라이드만 표시
    images.forEach((el,i)=>{
      el.classList.toggle('active', i===0);
      el.style.opacity    = (i===0)?'1':'0';
      el.style.visibility = (i===0)?'visible':'hidden';
      if (i===0 && el.tagName==='VIDEO') {
        el.currentTime = 0;
        el.play().catch(()=>{});
      } else if (el.tagName==='VIDEO') {
        el.pause();
      }
    });

    // 도트/프로그레스 리셋
    dots.forEach((d,i)=> d.classList.toggle('active', i===0 && i<images.length));
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    if (currentProgressInterval) { clearInterval(currentProgressInterval); currentProgressInterval = null; savedProgress = 0; }
    // 자동 슬라이드/프로그레스 다시 시작
    autoSlideInterval = startAutoSlide();
    isPlaying = true;
    startProgressAnimation(false);
  }

  // 커스텀 이벤트 연결
  document.addEventListener('HERO_MEDIA_UPDATED', refreshHeroMedia);

  // 초기 1회 실행(정적 콘텐츠만 있을 때도 동작)
  refreshHeroMedia();
});

// Rolling Images 자동 전환 및 스크롤 애니메이션

// 페이지 로드 완료 로그
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== DOM 로드 완료 ===');
});

window.addEventListener('load', function() {
  console.log('=== 페이지 로드 완료 ===');
});


/* ==== WHAT WE WANT TO DO 타임라인 ==== */
(() => {
  const section   = document.querySelector('.vision-section');
  if (!section) return;

  // 화면 크기에 따라 translateY 값을 동적으로 계산하는 함수
  function updateTextLineTransform() {
    const lines = document.querySelectorAll('.text-line');
    const screenWidth = window.innerWidth;
    
    lines.forEach(line => {
      let translateY = '100%'; // 기본값
      
      if (screenWidth <= 400) {
        // 400px 이하에서 세 줄로 떨어지는 경우를 고려한 계산
        const textContent = line.textContent;
        
        if (textContent === 'WHAT WE') {
          translateY = '120%';
        } else if (textContent === 'WANT TO') {
          // 'WANT TO' 부분
          translateY = '120%';
        } else if (textContent === 'DO') {
          // 'DO' 부분 - 세 번째 줄로 떨어질 때를 고려
          translateY = '120%';
        }
      } else if (screenWidth <= 768) {
        // 768px 이하에서 일반적인 모바일 처리 (401px 이상에서는 두 줄로 처리)
        const textContent = line.textContent;
        
        if (textContent === 'WHAT WE') {
          translateY = '130%';
        } else if (textContent === 'WANT TO') {
          translateY = '150%';
        } else if (textContent === 'DO') {
          translateY = '150%';
        } else if (textContent === 'WANT TO DO') {
          // 768px ~ 401px 해상도에서 'WANT TO DO' 마스크 위치 조정
          translateY = '150%';
        }
      } else if (screenWidth <= 1200) {
        translateY = '180%'; // 태블릿에서 중간 이동
      } else if (screenWidth <= 1400) {
        translateY = '140%'; // 작은 데스크톱에서 약간 이동
      }
      
      // transition이 적용되지 않은 상태에서만 transform 설정
      if (!line.style.transition) {
        line.style.transform = `translateY(${translateY})`;
      }
    });
  }

  // 화면 크기에 따라 HTML 구조를 동적으로 변경하는 함수
  function updateTextStructure() {
    const screenWidth = window.innerWidth;
    const visionTitle = document.querySelector('.vision-title');
    
    if (!visionTitle) return;
    
    if (screenWidth <= 400) {
      // 400px 이하: 세 줄로 분리
      const currentStructure = visionTitle.innerHTML;
      if (!currentStructure.includes('data-text="WANT TO"')) {
        visionTitle.innerHTML = `
          <div class="headline-line">
            <span class="text-line" data-text="WHAT WE">WHAT WE</span>
          </div>
          <div class="headline-line">
            <span class="text-line" data-text="WANT TO">WANT TO</span>
          </div>
          <div class="headline-line">
            <span class="text-line" data-text="DO">DO</span>
          </div>
        `;
      }
    } else {
      // 401px 이상: 두 줄로 합치기
      const currentStructure = visionTitle.innerHTML;
      if (currentStructure.includes('data-text="WANT TO"')) {
        visionTitle.innerHTML = `
          <div class="headline-line">
            <span class="text-line" data-text="WHAT WE">WHAT WE</span>
          </div>
          <div class="headline-line">
            <span class="text-line" data-text="WANT TO DO">WANT TO DO</span>
          </div>
        `;
      }
    }
  }

  // 초기 설정 및 리사이즈 이벤트 리스너
  updateTextStructure();
  updateTextLineTransform();
  window.addEventListener('resize', () => {
    updateTextStructure();
    updateTextLineTransform();
  });

               const stage     = section.querySelector('.vision-container');
  const header    = section.querySelector('.vision-text');
         const headlineLines = section.querySelectorAll('.headline-line');
  const lines     = section.querySelectorAll('.text-line');
  const card      = section.querySelector('.vision-card');
         const cardImages = section.querySelectorAll('.card-image');
         const earthBackground = section.querySelector('.earth-background');
         const earthOverlay = section.querySelector('.earth-overlay');
         const cardOverlay = section.querySelector('.card-overlay');
         const earthMaskRect = document.getElementById('earth-mask-rect');
         const earthTitle = section.querySelector('.earth-title');
         const earthSubtitle = section.querySelector('.earth-subtitle');

         // 헤드라인 애니메이션 상태 관리
         let headlineAnimated = false;

  let ticking = false;
  const clamp01 = v => Math.max(0, Math.min(1, v));

  // 초기 상태 설정 - 모든 구간에서 difference 모드로 지속
  const customCursor = document.getElementById('custom-cursor');
  
  if (customCursor) {
    // 초기에는 difference 모드로 설정
    customCursor.style.mixBlendMode = 'difference';
    customCursor.style.webkitMixBlendMode = 'difference';
  }

  function onScroll(){
    if (!ticking){ requestAnimationFrame(update); ticking = true; }
  }
  function update(){
    ticking = false;

    const r = section.getBoundingClientRect();
    const total = Math.max(1, r.height - window.innerHeight);  // 섹션 내 스크롤 길이
    const y = Math.min(Math.max(-r.top, 0), total);
               const p = y / total;                                       // 0..1
           const vh = window.innerHeight; // px 기반 계산

           // 100vh 구간 감지 (비전 섹션 시작부터 100vh까지)
           const isIn100vhZone = p >= 0 && p <= 0.1; // 0% ~ 10% (100vh 구간)
           
           // 모든 구간에서 difference 모드로 지속 (변수 없이)
           if (customCursor) {
             // 모든 구간에서 difference 모드 유지
             customCursor.style.mixBlendMode = 'difference';
             customCursor.style.webkitMixBlendMode = 'difference';
           }

           // JavaScript로 sticky 효과 구현
           if (r.top <= 0) {
             // 섹션이 화면 상단에 도달하면 fixed로 고정
             stage.style.position = 'fixed';
             stage.style.top = '0px';
    } else {
             // 섹션이 아직 위에 있으면 absolute로 복원
             stage.style.position = 'absolute';
             stage.style.top = '0px';
           }

    // 구간( WHAT WE WANT TO DO 애니메이션 타임라인 - 1000vh 기준)
    const fillStart = 0.08;  // 텍스트 채우기 시작 (8% = 80vh)
    const fillEnd   = 0.30;  // 텍스트 채우기 끝 (30% = 300vh)
    const imgStart  = 0.33;  // 카드 등장 시작 (33% = 330vh)
    const imgLock   = 0.45;  // 카드 중앙 도달 (45% = 450vh)
    const earthMaskStart = 0.53;  // earth 마스크 등장 (53% = 530vh)
    const earthMaskExpand = 0.58; // earth 마스크 확장 시작 (58% = 580vh)
    const zoomEnd   = 0.70;  // earth 마스크 최대 확장 (70% = 700vh)
    const textStart = 0.75;  // 텍스트 등장 시작 (75% = 750vh)

             /* 1) 헤드라인: 섹션 진입 시 자동 애니메이션 */
         if (r.top <= 200 && !headlineAnimated) { // 200px 더 일찍 시작
           // 섹션이 뷰포트에 진입하기 전에 헤드라인 애니메이션 시작
           headlineAnimated = true;
           
           headlineLines.forEach((line, index) => {
             const textLine = line.querySelector('.text-line');
             if (textLine) {
               // 모든 줄이 동시에 나타남 (시간차 0)
               textLine.style.transform = `translateY(0%)`;
             }
           });
         } else if (r.top > 200 && headlineAnimated) {
           // 백스크롤 시 초기화 (등장과 같은 속도로 사라짐)
           headlineAnimated = false;
           headlineLines.forEach((line) => {
             const textLine = line.querySelector('.text-line');
             if (textLine) {
               // 화면 크기에 따른 동적 translateY 값으로 사라짐
               const screenWidth = window.innerWidth;
               let translateY = '100%';
               
               if (screenWidth <= 400) {
                 // 400px 이하에서 세 줄로 떨어지는 경우를 고려한 계산
                 const textContent = textLine.textContent;
                 
                 if (textContent === 'WHAT WE') {
                   translateY = '120%';
                 } else if (textContent === 'WANT TO') {
                   // 'WANT TO' 부분
                   translateY = '120%';
                 } else if (textContent === 'DO') {
                   // 'DO' 부분 - 세 번째 줄로 떨어질 때를 고려
                   translateY = '120%';
                 }
               } else if (screenWidth <= 768) {
                 // 768px 이하에서 일반적인 모바일 처리 (401px 이상에서는 두 줄로 처리)
                 const textContent = textLine.textContent;
                 
                 if (textContent === 'WHAT WE') {
                   translateY = '130%';
                 } else if (textContent === 'WANT TO') {
                   translateY = '150%';
                 } else if (textContent === 'DO') {
                   translateY = '150%';
                 } else if (textContent === 'WANT TO DO') {
                   // 768px ~ 401px 해상도에서 'WANT TO DO' 마스크 위치 조정
                   translateY = '150%';
                 }
               } else if (screenWidth <= 1200) {
                 translateY = '180%';
               } else if (screenWidth <= 1400) {
                 translateY = '140%';
               }
               
               textLine.style.transform = `translateY(${translateY})`;
             }
           });
         }
         
         // 헤드라인은 항상 보이도록 설정 (CSS에서 이미 설정됨)
         // header.style.opacity = 1; // CSS에서 이미 opacity: 1로 설정됨

             /* 2) 텍스트 채우기 (8% ~ 30% = 80vh ~ 300vh) */
         if (p >= fillStart && p <= fillEnd) {
           const tFill = (p - fillStart) / (fillEnd - fillStart); // 0~1
           const screenWidth = window.innerWidth;
           
           // "WHAT WE" 줄: 8% ~ 19%에서 채워짐 (0% ~ 50% 구간)
           // "WANT TO DO" 줄: 19% ~ 30%에서 채워짐 (50% ~ 100% 구간)
           lines.forEach((el, index) => {
             const textContent = el.textContent;
             
             // 400px 이하에서 'DO'를 별도 처리
             if (screenWidth <= 400 && textContent === 'DO') {
               // 'DO'는 세 번째 줄로 처리 (인덱스 2)
               const lineStart = 2 * 0.33; // 0.66
               const lineEnd = 3 * 0.33; // 0.99
               
               if (tFill <= lineStart) {
                 el.style.setProperty('--p', '0%');
               } else if (tFill >= lineEnd) {
                 el.style.setProperty('--p', '100%');
               } else {
                 const lineProgress = (tFill - lineStart) / 0.33;
                 const percentage = Math.max(0, Math.min(100, lineProgress * 100));
                 el.style.setProperty('--p', `${percentage}%`);
               }
             } else if (screenWidth <= 400 && textContent === 'WANT TO') {
               // 400px 이하에서 'WANT TO'는 두 번째 줄로 처리 (인덱스 1)
               const lineStart = 1 * 0.33; // 0.33
               const lineEnd = 2 * 0.33; // 0.66
               
               if (tFill <= lineStart) {
                 el.style.setProperty('--p', '0%');
               } else if (tFill >= lineEnd) {
                 el.style.setProperty('--p', '100%');
               } else {
                 const lineProgress = (tFill - lineStart) / 0.33;
                 const percentage = Math.max(0, Math.min(100, lineProgress * 100));
                 el.style.setProperty('--p', `${percentage}%`);
               }
             } else {
               // 일반적인 처리 (두 줄 또는 400px 초과)
               const lineStart = index * 0.5; // 각 줄의 시작 비율 (0, 0.5)
               const lineEnd = (index + 1) * 0.5; // 각 줄의 끝 비율 (0.5, 1.0)

               if (tFill <= lineStart) {
                 // 아직 이 줄이 시작되지 않음
                 el.style.setProperty('--p', '0%');
               } else if (tFill >= lineEnd) {
                 // 이 줄이 완전히 채워짐
                 el.style.setProperty('--p', '100%');
               } else {
                 // 이 줄이 진행 중 - 스크롤과 정확히 1:1 매칭
                 const lineProgress = (tFill - lineStart) / 0.5;
                 const percentage = Math.max(0, Math.min(100, lineProgress * 100));
                 el.style.setProperty('--p', `${percentage}%`);
               }
             }
           });
         } else if (p < fillStart) {
           // 채우기 시작 전 - 모든 줄 0%
           lines.forEach((el) => {
             el.style.setProperty('--p', '0%');
           });
         } else if (p > fillEnd) {
           // 채우기 완료 후 - 모든 줄 100%
           lines.forEach((el) => {
             el.style.setProperty('--p', '100%');
           });
         }

           /* 3) Earth 배경 레이어: 마스크로 제어 (53% ~ 70% = 530vh ~ 700vh) */
         if (earthBackground) {
           // earthBackground.style.opacity = '1'; // CSS에서 이미 opacity: 1로 설정됨
           
             if (p >= earthMaskStart) {
               // 53%: 카드와 동일한 사이즈로 마스크 구멍 생성 (카드에 가려서 보이지 않음)
               if (p >= earthMaskStart && p < earthMaskExpand) {
                 // 카드와 동일한 크기 (라운딩 사각형 마스크)
                 const viewportWidth = window.innerWidth;
                 const viewportHeight = window.innerHeight;
                 
                 // 카드 크기를 뷰포트 기준으로 계산 (반응형 고려)
                 let cardWidth, cardHeight;
                 if (viewportWidth <= 900) {
                   // 900px 이하에서는 작은 카드 크기 사용
                   cardWidth = 320;
                   cardHeight = 426;
                 } else {
                   // 900px 초과에서는 기본 카드 크기 사용
                   cardWidth = 480;
                   cardHeight = 640;
                 }
                 
                 const cardWidthPercent = (cardWidth / viewportWidth) * 100;
                 const cardHeightPercent = (cardHeight / viewportHeight) * 100;
                 
                 earthBackground.style.setProperty('--earth-mask-width', `${cardWidthPercent}%`);
                 earthBackground.style.setProperty('--earth-mask-height', `${cardHeightPercent}%`);
                 earthBackground.style.setProperty('--earth-mask-radius', '0px');
               }
               // 58%: earth 마스크 확장 및 카드 사라짐
               else if (p >= earthMaskExpand) {
                 const tExpand = Math.max(0, Math.min(1, (p - earthMaskExpand) / (zoomEnd - earthMaskExpand)));
               
               // 58% 시점의 지구 마스크 크기로 마스크 시작 (반응형 고려)
               const viewportWidth = window.innerWidth;
               const viewportHeight = window.innerHeight;
               
               // 58% 시점의 실제 마스크 크기 (반응형 + 1.2배 확대 적용)
               let baseCardWidth, baseCardHeight;
               if (viewportWidth <= 900) {
                 // 900px 이하에서는 작은 카드 크기 사용
                 baseCardWidth = 320;
                 baseCardHeight = 426;
               } else {
                 // 900px 초과에서는 기본 카드 크기 사용
                 baseCardWidth = 480;
                 baseCardHeight = 640;
               }
               
               // 58% 시점에서 카드가 1.2배 확대된 상태의 크기
               const cardWidth = baseCardWidth * 1.2;
               const cardHeight = baseCardHeight * 1.2;
               
               const cardWidthPercent = (cardWidth / viewportWidth) * 100;
               const cardHeightPercent = (cardHeight / viewportHeight) * 100;
               
               // 카드 크기에서 화면 전체 크기로 확장 (GNB 높이 포함)
               const expandWidth = cardWidthPercent + (100 - cardWidthPercent) * tExpand;
               const expandHeight = cardHeightPercent + (100 - cardHeightPercent) * tExpand;
               
                 // radius가 19.2에서 0으로 점차 변경
                 const startRadius = 19.2;
                 const endRadius = 0;
                 const currentRadius = startRadius - (startRadius - endRadius) * tExpand;
               
               earthBackground.style.setProperty('--earth-mask-width', `${expandWidth}%`);
               earthBackground.style.setProperty('--earth-mask-height', `${expandHeight}%`);
               earthBackground.style.setProperty('--earth-mask-radius', `${currentRadius}px`);
               
               // 디버깅용 로그
               if (p > 0.58) {
                 console.log('Earth 마스크 확장:', {
                   progress: p.toFixed(3),
                   expandProgress: tExpand.toFixed(3),
                   width: expandWidth.toFixed(1) + '%',
                   height: expandHeight.toFixed(1) + '%',
                   radius: currentRadius.toFixed(1) + 'px'
                 });
               }
      }
      } else {
               // 53% 이전까지는 마스크 크기 0% (완전히 가려짐)
               earthBackground.style.setProperty('--earth-mask-width', '0%');
               earthBackground.style.setProperty('--earth-mask-height', '0%');
               earthBackground.style.setProperty('--earth-mask-radius', '0px');
             }
         }
         
         if (earthOverlay) {
           if (p >= earthMaskStart) {
             earthOverlay.classList.add('active');
    } else {
             earthOverlay.classList.remove('active');
           }
         }

         /* 5) Earth 텍스트 애니메이션 (75% ~ 100% = 750vh ~ 1000vh) */
         if (p >= textStart) {
           // 타이틀과 서브타이틀 순차 등장 (0.2초 차이)
           if (earthTitle) {
             earthTitle.style.transform = `translateY(0%)`;
           }
           
           // 0.2초 후 서브타이틀 등장
           setTimeout(() => {
             if (earthSubtitle) {
               earthSubtitle.style.transform = `translateY(0%)`;
             }
           }, 200);
         } else {
           // 75% 이전에는 텍스트 숨김
           if (earthTitle) {
             earthTitle.style.transform = `translateY(100%)`;
           }
           if (earthSubtitle) {
             earthSubtitle.style.transform = `translateY(100%)`;
           }
         }

           /* 4) 카드 이미지: 화면 아래에서 위로 등장 (33% ~ 58% = 330vh ~ 580vh) */
           const tImg = Math.max(0, Math.min(1,(p - imgStart) / (imgLock - imgStart)));
           const startY = 125;  // 125vh 아래에서 시작 (화면에 완전히 숨김)
           const endY = 0;      // 0% (컨테이너 중앙)에서 끝
           const yOffset = startY + (endY - startY) * tImg;  // 125vh → 0%
           
           // 디버깅용 로그
           if (p >= imgStart && p <= imgLock) {
             console.log('카드 위치:', {
               progress: p.toFixed(3),
               tImg: tImg.toFixed(3),
               yOffset: yOffset.toFixed(1),
               isCenter: Math.abs(yOffset) < 0.1,
               transform: Math.abs(yOffset) < 0.1 ? 
                 'translate(-50%, -50%)' : 
                 `translate(-50%, calc(-50% + ${yOffset}vh))`
             });
           }

         if (card) {
           // 33% 이전에는 완전히 숨김 (330vh 이전)
           if (p < imgStart) {
             card.style.opacity = '0';
             card.style.transform = `translate(-50%, calc(-50% + 125vh)) scale(1)`;
           }
           // 58% 지점에서 카드 사라짐 (580vh)
           else if (p >= earthMaskExpand) {
             card.style.opacity = '0';
           } else {
             card.style.opacity = '1'; // 비전카드는 동적으로 opacity 제어 필요
             if (Math.abs(yOffset) < 0.1) {
               // 45%에서 정확히 중앙에 도달할 때 (450vh, 부동소수점 오차 고려)
               card.style.transform = `translate(-50%, -50%) scale(1)`;
             } else {
               card.style.transform = `translate(-50%, calc(-50% + ${yOffset}vh)) scale(1)`;
             }
           }
         }

         // 텍스트와 중앙정렬될 때까지 사이즈 고정, 그 이후에만 줌 (58% = 580vh 이전까지만)
         if (p >= imgStart && p < earthMaskExpand) {
           const tZoom = Math.max(0, Math.min(1,(p - imgLock) / (earthMaskExpand - imgLock)));
           const zoom  = 1 + 0.2 * tZoom; // 1.0 → 1.2 (20% 확대)
           
           // 라운딩값이 1.0 → 1.2 확대되면서 16px → 0px로 점차 변경
           const startRadius = 16;
           const endRadius = 0;
           const currentRadius = startRadius - (startRadius - endRadius) * tZoom;
           
           if (card && p >= imgLock) {
             // 스케일과 translate를 함께 적용하여 정중앙 기준으로 확대
             if (Math.abs(yOffset) < 0.1) {
               // 45%에서 정확히 중앙에 도달할 때 (450vh, 부동소수점 오차 고려)
               card.style.transform = `translate(-50%, -50%) scale(${zoom})`;
        } else {
               card.style.transform = `translate(-50%, calc(-50% + ${yOffset}vh)) scale(${zoom})`;
             }
             
             // 라운딩값 동적 변경
             card.style.borderRadius = `${currentRadius}px`;
           }
         }
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  
  // 카드 이미지 자동 전환 (0.8초 간격) - 겹침 없는 전환
  let currentImageIndex = 0;
  let isEarthMode = false;
  
  function switchCardImage() {
    // 동적으로 현재 카드 이미지들을 다시 가져오기
    const currentCardImages = document.querySelectorAll('.card-image');
    if (currentCardImages.length === 0) return;

    // 다음 이미지 인덱스 계산
    const nextImageIndex = (currentImageIndex + 1) % currentCardImages.length;
    const currentActive = currentCardImages[currentImageIndex];
    const nextImage = currentCardImages[nextImageIndex];

    console.log('카드 이미지 전환:', {
      currentIndex: currentImageIndex,
      nextIndex: nextImageIndex,
      totalImages: currentCardImages.length,
      currentActive: !!currentActive,
      nextImage: !!nextImage
    });

    // 자연스러운 페이드 전환을 위한 단계별 처리
    if (nextImage && currentActive) {
      // 1단계: 다음 이미지를 준비 (투명하게 설정)
      nextImage.style.opacity = '0';
      nextImage.style.visibility = 'visible';
      nextImage.classList.add('active');
      
      // 2단계: 다음 이미지 페이드 인 (0.3초)
      setTimeout(() => {
        nextImage.style.transition = 'opacity 0.3s ease-in-out';
        nextImage.style.opacity = '1';
      }, 50);
      
      // 3단계: 현재 이미지 페이드 아웃 (0.3초)
      currentActive.style.transition = 'opacity 0.3s ease-in-out';
      currentActive.style.opacity = '0';
      
      // 4단계: 페이드 아웃 완료 후 현재 이미지 숨김
      setTimeout(() => {
        currentActive.style.visibility = 'hidden';
        currentActive.classList.remove('active');
        currentActive.style.transition = ''; // transition 초기화
      }, 350);
      
      // 5단계: 다음 이미지 transition 초기화
      setTimeout(() => {
        nextImage.style.transition = ''; // transition 초기화
      }, 400);
    }

    // 현재 인덱스 업데이트
    currentImageIndex = nextImageIndex;
  }

  // 0.8초 간격으로 이미지 전환
  const imageInterval = setInterval(switchCardImage, 800);

  // 초기화 확인 로그
  console.log('WHAT WE WANT TO DO 섹션 초기화 완료:', {
    section: !!section,
    stage: !!stage,
    header: !!header,
    lines: lines.length,
    card: !!card,
    cardImages: cardImages.length
  });

  update();
})();

/* ==== BUSINESS SECTION 애니메이션 ==== */
(() => {
  const section = document.querySelector('.business-section');
  if (!section) return;

  const container = section.querySelector('.business-container');
  const businessText = section.querySelector('.business-text');
  const businessSubtitle = section.querySelector('.business-subtitle');
  const businessMoreBtn = section.querySelector('.business-more-btn');
  const businessCards = section.querySelectorAll('.business-card');

  let ticking = false;
  let textAnimated = false;

  // 초기 카드 위치 설정 (새로고침 시 움직임 방지)
  function initializeCards() {
    const cardHeight = 600;
    const cardGap = 180;
    const totalCardSpace = cardHeight + cardGap;
    const startY = window.innerHeight / 2 - cardHeight / 2;
    
    businessCards.forEach((card, index) => {
      const cardRelativeY = index * totalCardSpace;
      const cardY = startY + cardRelativeY;
      card.style.transform = `translateY(${cardY}px)`;
      // card.style.opacity = '1'; // CSS에서 이미 opacity: 1로 설정됨
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    ticking = false;

    const r = section.getBoundingClientRect();
    
    // 비즈니스 섹션에 접근했을 때만 애니메이션 활성화
    const isInView = r.top <= window.innerHeight && r.bottom >= 0;
    
    if (!isInView) {
      // 섹션 밖에 있을 때는 애니메이션 비활성화
      return;
    }

    const total = Math.max(1, r.height - window.innerHeight);
    const y = Math.min(Math.max(-r.top, 0), total);
    const p = y / total; // 0..1

    // 비즈니스 섹션 sticky 동작 제어
    if (r.top <= 0) {
      // 섹션이 화면 상단에 도달했을 때 sticky 유지
      section.classList.add('sticky');
      container.style.position = 'fixed';
      container.style.top = '0px';
    } else {
      // 섹션이 아직 화면 상단에 도달하지 않았을 때
      section.classList.remove('sticky');
      container.style.position = 'absolute';
      container.style.top = '0px';
    }

    // Section in view 모션 - 텍스트 등장
    if (r.top <= 200 && !textAnimated) {
      textAnimated = true;
      
      // 타이틀 등장
      if (businessSubtitle) {
        businessSubtitle.style.transform = 'translateY(0)';
        businessSubtitle.style.opacity = '1';
      }
      
      // 버튼 등장 (0.2초 후)
      setTimeout(() => {
        if (businessMoreBtn) {
          businessMoreBtn.style.transform = 'translateY(0)';
          businessMoreBtn.style.opacity = '1';
        }
      }, 200);
    } else if (r.top > 200 && textAnimated) {
      textAnimated = false;
      
      // 텍스트 숨김
      if (businessSubtitle) {
        businessSubtitle.style.transform = 'translateY(100px)';
        businessSubtitle.style.opacity = '0';
      }
      if (businessMoreBtn) {
        businessMoreBtn.style.transform = 'translateY(100px)';
        businessMoreBtn.style.opacity = '0';
      }
    }

    // 카드 애니메이션 - 지그재그 패턴을 유지하면서 하나의 덩어리로 스크롤
    const cardHeight = 600; // 카드 높이 (px)
    const cardGap = 180; // 카드 간 상하 갭 (px)
    const totalCardSpace = cardHeight + cardGap; // 카드 + 갭의 총 공간 (780px)
    
    // 첫 번째 카드가 화면 중앙에 오는 시작 위치
    const startY = window.innerHeight / 2 - cardHeight / 2;
    
    // 마지막 카드가 화면 중앙에 오기 위한 정확한 스크롤 거리 계산
    const lastCardIndex = businessCards.length - 1; // 마지막 카드 인덱스 (4)
    const distanceToLastCard = lastCardIndex * totalCardSpace; // 첫 번째 카드에서 마지막 카드까지의 거리
    
    // 추가 여유 구간 (앞쪽과 뒤쪽 모두)
    const additionalScrollDistance = window.innerHeight * 0.5; // 화면 높이의 50%만큼 추가 여유
    const maxScrollDistance = distanceToLastCard + (additionalScrollDistance * 2); // 앞쪽 + 뒤쪽 여유 구간
    
    // 스크롤 진행률에 따른 스크롤 오프셋 계산
    let scrollOffset;
    if (p <= 0.1) {
      // 0~10%: 첫 번째 카드 고정 유지 (백스크롤 여유 구간)
      scrollOffset = 0;
    } else if (p <= 0.9) {
      // 10~90%: 카드들이 순차적으로 중앙에 도달
      const adjustedP = (p - 0.1) / 0.8; // 0~1 범위로 정규화
      scrollOffset = adjustedP * distanceToLastCard;
    } else {
      // 90~100%: 마지막 카드 고정 유지 (앞스크롤 여유 구간)
      scrollOffset = distanceToLastCard;
    }
    
    businessCards.forEach((card, index) => {
      // 각 카드의 상대적 위치 계산 (첫 번째 카드 기준)
      const cardRelativeY = index * totalCardSpace;
      
      // 전체 그룹이 스크롤되면서 각 카드의 절대 위치
      const cardY = startY + cardRelativeY - scrollOffset;
      
      // 투명도는 항상 1로 유지 (페이드 효과 없음) - CSS에서 이미 설정됨
      // card.style.opacity = '1'; // CSS에서 이미 opacity: 1로 설정됨
      
      // 카드 위치 설정 (지그재그 패턴은 CSS에서 처리)
      card.style.transform = `translateY(${cardY}px)`;
    });
  }

  // 초기 카드 위치 설정
  initializeCards();
  
  // 윈도우 리사이즈 시에도 카드 위치 재설정
  window.addEventListener('resize', initializeCards);
  
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 푸터 애니메이션 제어
(function() {
  const footerTitle = document.querySelector('.footer-title');
  const footerContactBtn = document.querySelector('.footer-contact-btn');
  const footerSection = document.querySelector('.footer-section');
  
  let hasAnimated = false; // 애니메이션 실행 여부 추적
  
  function animateFooter() {
    if (hasAnimated) return; // 이미 애니메이션이 실행되었으면 중복 실행 방지
    
    if (footerTitle) {
      footerTitle.classList.add('animate');
    }
    if (footerContactBtn) {
      footerContactBtn.classList.add('animate');
    }
    
    hasAnimated = true; // 애니메이션 실행 완료 표시
  }
  
  // 스크롤 시 푸터 섹션 진입 감지
  if (footerSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateFooter();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(footerSection);
  }
})();

// 캐러셀 드래그 기능
(function() {
  const mediaScrollContainer = document.querySelector('.media-scroll-container');
  const mediaGrid = document.querySelector('.media-grid');
  
  if (!mediaScrollContainer || !mediaGrid) return;
  
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  
  // 마우스 이벤트
  mediaScrollContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    mediaScrollContainer.style.cursor = 'grabbing';
    startX = e.pageX - mediaScrollContainer.offsetLeft;
    scrollLeft = mediaScrollContainer.scrollLeft;
  });
  
  mediaScrollContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    mediaScrollContainer.style.cursor = 'grab';
  });
  
  mediaScrollContainer.addEventListener('mouseup', () => {
    isDragging = false;
    mediaScrollContainer.style.cursor = 'grab';
  });
  
  mediaScrollContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - mediaScrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    mediaScrollContainer.scrollLeft = scrollLeft - walk;
  });
  
  // 터치 이벤트 (모바일)
  mediaScrollContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - mediaScrollContainer.offsetLeft;
    scrollLeft = mediaScrollContainer.scrollLeft;
  });
  
  mediaScrollContainer.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  mediaScrollContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - mediaScrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    mediaScrollContainer.scrollLeft = scrollLeft - walk;
  });
  
  // 기본 커서 스타일 설정
  mediaScrollContainer.style.cursor = 'grab';
  
  // 캐러셀 영역에서 커스텀 커서 적용
  const customCursor = document.getElementById('custom-cursor');
  
  mediaScrollContainer.addEventListener('mouseenter', () => {
    // 커서는 CSS에서 항상 표시되므로 display 제어 불필요
    document.body.style.cursor = 'none';
  });

  mediaScrollContainer.addEventListener('mouseleave', () => {
    // 커서는 CSS에서 항상 표시되므로 display 제어 불필요
    document.body.style.cursor = 'url("./img/cursor.svg"), auto';
  });
})();

// Career Card Border Animation - CodePen 스타일2 방식 (CSS-only)
// JavaScript 불필요 - CSS :hover 선택자로 모든 애니메이션 처리

// ========== 동적 콘텐츠 로딩 시스템 ==========
(() => {
  let contentData = null; // 전역 콘텐츠 데이터
  
  // 콘텐츠 로드 함수
  async function loadContent() {
    try {
      const response = await fetch('/content.json');
      if (!response.ok) {
        throw new Error('콘텐츠를 불러올 수 없습니다');
      }
      contentData = await response.json();
      window.contentData = contentData; // 전역 변수로 저장
      console.log('콘텐츠 로드 완료:', contentData);
      console.log('채용 데이터:', contentData.career);
      
      // 이미지 URL 테스트
      if (contentData.hero && contentData.hero.slides && contentData.hero.slides[0]) {
        const testUrl = contentData.hero.slides[0].background;
        console.log('첫 번째 히어로 이미지 URL 테스트:', testUrl);
        
        // 이미지 로드 테스트
        const testImg = new Image();
        testImg.onload = () => {
          console.log('이미지 로드 테스트 성공:', testUrl);
        };
        testImg.onerror = () => {
          console.error('이미지 로드 테스트 실패:', testUrl);
        };
        testImg.src = testUrl;
      }
      
      applyContent(contentData);
    } catch (error) {
      console.error('콘텐츠 로드 실패:', error);
      // 기본 콘텐츠 사용 (HTML에 이미 있는 내용)
    }
  }
  
  // 콘텐츠 적용 함수
  function applyContent(content) {
    if (!content) return;
    
    // Hero 섹션 업데이트
    updateHeroSection(content.hero);
    
    // Vision 섹션 업데이트
    updateVisionSection(content.vision);
    
    // Business 섹션 업데이트
    updateBusinessSection(content.business);
    
    // Media 섹션 업데이트
    updateMediaSection(content.media);
    
    // Career 섹션 업데이트
    updateCareerSection(content.career);
    
    // Footer 섹션 업데이트
    updateFooterSection(content.footer);
    
      // SEO 메타데이터 업데이트
      updateSEOMeta(content.seo);
      
      // GNB 메뉴 활성/비활성 상태 업데이트
      updateGNBMenu(content);
    }
  
  // GNB 메뉴 활성/비활성 상태 업데이트
  function updateGNBMenu(content) {
    // 미디어 메뉴 제어
    const mediaMenuLink = document.querySelector('a[href="media.html"]');
    if (mediaMenuLink) {
      const isMediaActive = content.media?.active !== false; // 기본값 true
      mediaMenuLink.style.display = isMediaActive ? 'block' : 'none';
    }
    
    // 채용 메뉴 제어
    const careerMenuLink = document.querySelector('a[href="career.html"]');
    if (careerMenuLink) {
      const isCareerActive = content.career?.active !== false; // 기본값 true
      careerMenuLink.style.display = isCareerActive ? 'block' : 'none';
    }
    
    console.log('GNB 메뉴 상태 업데이트:', {
      media: content.media?.active !== false,
      career: content.career?.active !== false
    });
  }

  // URL을 절대 경로로 변환하는 헬퍼 함수
  function convertToAbsoluteUrl(url) {
    if (!url) return url;
    
    // 이미 절대 URL인 경우 그대로 반환
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // 상대 경로인 경우 절대 경로로 변환
    if (url.startsWith('/')) {
      return window.location.origin + url;
    }
    
    // 상대 경로인 경우 현재 도메인 추가
    return window.location.origin + '/' + url.replace(/^\.\//, '');
  }
  
  // 파일이 비디오인지 확인하는 헬퍼 함수
  function isVideoFile(url) {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const lowerUrl = url.toLowerCase();
    const isVideo = videoExtensions.some(ext => lowerUrl.includes(ext));
    console.log('비디오 파일 확인:', url, '→', isVideo);
    return isVideo;
  }
  
  // 미디어 요소 생성 헬퍼 함수 (이미지 또는 비디오)
  function createMediaElement(url, alt = '', className = '') {
    const absoluteUrl = convertToAbsoluteUrl(url);
    console.log('미디어 요소 생성:', absoluteUrl, 'alt:', alt, 'className:', className);
    
    if (isVideoFile(absoluteUrl)) {
      console.log('비디오 요소 생성 중...');
      const video = document.createElement('video');
      video.src = absoluteUrl;
      video.alt = alt;
      video.className = className;
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      // crossOrigin 제거 - 같은 도메인이므로 불필요
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.display = 'block';
      
      // 비디오 로딩 완료 로그
      video.onloadeddata = () => {
        console.log('비디오 로딩 완료:', absoluteUrl);
      };
      
      video.onerror = (error) => {
        console.error('비디오 로딩 실패:', absoluteUrl, error);
      };
      
      return video;
    } else {
      console.log('이미지 요소 생성 중...');
      const img = document.createElement('img');
      img.src = absoluteUrl;
      img.alt = alt;
      img.className = className;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      
      img.onload = () => {
        console.log('이미지 로딩 완료:', absoluteUrl);
      };
      
      img.onerror = () => {
        console.error('이미지 로딩 실패:', absoluteUrl);
      };
      
      return img;
    }
  }
  
  // Hero 섹션 업데이트
  function updateHeroSection(heroData) {
    if (!heroData?.slides) return;

    const heroBackground = document.querySelector('.hero-background');
    const overlay = heroBackground.querySelector('.hero-overlay');
    const heroTitle = document.querySelector('.hero-title .text-content');
    const heroSubtitle = document.querySelector('.hero-subtitle .text-content');
    const dots = document.querySelectorAll('.pagination-dots .dot');

    // 1) 기존 미디어 싹 제거 (오버레이 제외)
    heroBackground.querySelectorAll('.hero-bg-image').forEach(el => el.remove());

    // 2) 활성 슬라이드만 재생성
    const activeSlides = heroData.slides.filter(s => s.active).slice(0, 5);
    const frag = document.createDocumentFragment();

    activeSlides.forEach((s, i) => {
        const url = convertToAbsoluteUrl(s.background);
        const el = createMediaElement(url, `AEROGRID Hero Background ${i+1}`, 'hero-bg-image');
        el.style.opacity   = (i === 0) ? '1' : '0';
        el.style.visibility= (i === 0) ? 'visible' : 'hidden';
        if (el.tagName === 'VIDEO') {
            el.addEventListener('loadedmetadata', () => { if (i === 0) el.play().catch(()=>{}); });
        }
        frag.appendChild(el);
    });

    // 오버레이 위계 보존을 위해 오버레이 앞에 삽입
    heroBackground.insertBefore(frag, overlay);

    // 3) 텍스트/도트 세팅(기존 로직 유지)
    if (activeSlides[0]) {
        heroTitle.innerHTML = activeSlides[0].title?.includes('<br>')
            ? activeSlides[0].title.split('<br>').map((t,i)=>`<div class="title-line" data-line="${i}"><span class="line-text">${t.trim()}</span></div>`).join('')
            : `<div class="title-line" data-line="0"><span class="line-text">${activeSlides[0].title || '하늘을 설계하다'}</span></div>`;
        heroSubtitle.innerHTML = activeSlides[0].subtitle
            ? activeSlides[0].subtitle : '산업용 자율비행 드론부터 관제·AI 비전까지';
    }
    dots.forEach((d,i)=> { d.style.display = (i < activeSlides.length) ? 'block' : 'none'; d.classList.toggle('active', i===0); });

    // 4) 슬라이더에게 "미디어가 갱신됐다" 알리기
    document.dispatchEvent(new Event('HERO_MEDIA_UPDATED'));
  }
  
  // Vision 섹션 업데이트
  function updateVisionSection(visionData) {
    if (!visionData) return;
    
    const earthTitle = document.querySelector('.earth-title');
    const earthSubtitle = document.querySelector('.earth-subtitle');
    const earthImage = document.querySelector('.earth-image');
    const cardImages = document.querySelectorAll('.card-image');
    
    // Earth 텍스트 업데이트
    if (earthTitle && visionData.title) {
      earthTitle.textContent = visionData.title;
      earthTitle.setAttribute('data-text', visionData.title);
    }
    
    if (earthSubtitle && visionData.subtitle) {
      earthSubtitle.textContent = visionData.subtitle;
      earthSubtitle.setAttribute('data-text', visionData.subtitle);
    }
    
    // Earth 배경 이미지 업데이트
    if (earthImage && visionData.backgroundImage) {
      const mediaUrl = convertToAbsoluteUrl(visionData.backgroundImage);
      console.log('비전 Earth 배경 미디어 URL:', mediaUrl);
      
      const isVideo = isVideoFile(mediaUrl);
      const currentIsVideo = earthImage.tagName === 'VIDEO';
      
      // 미디어 타입이 다르면 요소를 교체
      if (isVideo !== currentIsVideo) {
        // 기존 요소 제거
        earthImage.remove();
        
        // 새로운 미디어 요소 생성
        const newMediaElement = createMediaElement(mediaUrl, 'Earth Background', 'earth-image');
        
        // Earth 이미지 컨테이너에 추가
        const earthContainer = document.querySelector('.earth-container');
        if (earthContainer) {
          earthContainer.appendChild(newMediaElement);
        }
      } else {
        // 같은 타입이면 src만 업데이트
        earthImage.src = '';
        earthImage.src = mediaUrl;
        
        if (earthImage.tagName === 'IMG') {
          earthImage.onload = () => {
            console.log('비전 Earth 배경 이미지 로드 성공:', mediaUrl);
            earthImage.style.opacity = '1';
            earthImage.style.visibility = 'visible';
          };
          earthImage.onerror = () => {
            console.error('비전 Earth 배경 이미지 로드 실패:', mediaUrl);
          };
        } else if (earthImage.tagName === 'VIDEO') {
          earthImage.onloadeddata = () => {
            console.log('비전 Earth 배경 비디오 로드 성공:', mediaUrl);
            earthImage.style.opacity = '1';
            earthImage.style.visibility = 'visible';
          };
          earthImage.onerror = () => {
            console.error('비전 Earth 배경 비디오 로드 실패:', mediaUrl);
          };
        }
      }
    }
    
    // 롤링 이미지 업데이트
    if (visionData.rollingImages && cardImages.length > 0) {
      console.log('비전 롤링 이미지들:', visionData.rollingImages);
      console.log('비전 카드 이미지 요소들:', cardImages);
      
      cardImages.forEach((mediaElement, index) => {
        if (visionData.rollingImages[index]) {
          const mediaUrl = convertToAbsoluteUrl(visionData.rollingImages[index]);
          console.log(`비전 롤링 미디어 ${index + 1} URL:`, mediaUrl);
          
          // 기존 요소 제거
          mediaElement.remove();
          
          // 새로운 미디어 요소 생성 (이미지 또는 비디오)
          const newMediaElement = createMediaElement(
            mediaUrl, 
            `Vision Rolling ${index + 1}`, 
            'card-image'
          );
          
          // 모든 미디어를 로드하되 스크롤 애니메이션 로직에 맡김
          newMediaElement.style.display = 'block';
          
          // 스크롤 애니메이션의 자동 전환 로직이 작동하도록 초기 상태만 설정
          if (index === 0) {
            newMediaElement.classList.add('active');
            newMediaElement.style.opacity = '1';
            newMediaElement.style.visibility = 'visible';
          } else {
            newMediaElement.classList.remove('active');
            newMediaElement.style.opacity = '0';
            newMediaElement.style.visibility = 'hidden';
          }
          
          // 로드 완료 이벤트 처리
          if (newMediaElement.tagName === 'VIDEO') {
            newMediaElement.onloadeddata = () => {
              console.log(`비전 롤링 비디오 ${index + 1} 로드 성공:`, mediaUrl);
              // 로드 성공 후 스크롤 애니메이션 로직이 제어하도록 함
            };
          } else {
            newMediaElement.onload = () => {
              console.log(`비전 롤링 이미지 ${index + 1} 로드 성공:`, mediaUrl);
              // 로드 성공 후 스크롤 애니메이션 로직이 제어하도록 함
            };
          }
          
          newMediaElement.onerror = () => {
            console.error(`비전 롤링 미디어 ${index + 1} 로드 실패:`, mediaUrl);
          };
          
          // 부모 요소에 새 요소 추가
          const visionCard = document.querySelector('.vision-card');
          if (visionCard) {
            visionCard.appendChild(newMediaElement);
          }
        } else {
          mediaElement.style.display = 'none';
          mediaElement.classList.remove('active');
        }
      });
    }
  }
  
  // Business 섹션 업데이트
  function updateBusinessSection(businessData) {
    if (!businessData) return;
    
    const businessSubtitle = document.querySelector('.business-subtitle');
    const businessMoreBtn = document.querySelector('.business-more-btn .common-btn-text');
    const businessCards = document.querySelectorAll('.business-card');
    
    // 서브타이틀 업데이트
    if (businessSubtitle && businessData.subtitleHtml) {
      businessSubtitle.innerHTML = businessData.subtitleHtml;
    }
    
    // 더보기 버튼 텍스트 업데이트
    if (businessMoreBtn && businessData.moreButtonText) {
      businessMoreBtn.textContent = businessData.moreButtonText;
    }
    
    // 비즈니스 카드 업데이트 및 표시/숨김 처리
    if (businessData.cards && businessCards.length > 0) {
      const availableCards = businessData.cards.length;
      
      businessCards.forEach((card, index) => {
        if (index < availableCards && businessData.cards[index]) {
          // 어드민에서 관리하는 카드만 표시
          card.style.display = 'block';
          
          const cardData = businessData.cards[index];
          const cardImage = card.querySelector('.business-card-image');
          const cardTitle = card.querySelector('.business-card-title');
          const cardDescription = card.querySelector('.business-card-description');
          
          if (cardImage && cardData.image) {
            const mediaUrl = convertToAbsoluteUrl(cardData.image);
            console.log(`비즈니스 카드 ${index + 1} 미디어 URL:`, mediaUrl);
            
            // 기존 요소 제거
            cardImage.remove();
            
            // 새로운 미디어 요소 생성 (이미지 또는 비디오)
            const newMediaElement = createMediaElement(
              mediaUrl, 
              cardData.title || `Business Area ${index + 1}`, 
              'business-card-image'
            );
            
            // 로드 완료 이벤트 처리
            if (newMediaElement.tagName === 'VIDEO') {
              newMediaElement.onloadeddata = () => {
                console.log(`비즈니스 카드 ${index + 1} 비디오 로드 성공:`, mediaUrl);
                newMediaElement.style.opacity = '1';
                newMediaElement.style.visibility = 'visible';
              };
            } else {
              newMediaElement.onload = () => {
                console.log(`비즈니스 카드 ${index + 1} 이미지 로드 성공:`, mediaUrl);
                newMediaElement.style.opacity = '1';
                newMediaElement.style.visibility = 'visible';
              };
            }
            
            newMediaElement.onerror = () => {
              console.error(`비즈니스 카드 ${index + 1} 미디어 로드 실패:`, mediaUrl);
            };
            
            // 부모 요소에 새 요소 추가
            card.appendChild(newMediaElement);
          }
          
          if (cardTitle && cardData.title) {
            cardTitle.textContent = cardData.title;
          }
          
          if (cardDescription && cardData.desc) {
            cardDescription.textContent = cardData.desc;
          }
        } else {
          // 어드민에서 관리하지 않는 카드는 숨김
          card.style.display = 'none';
        }
      });
    }
  }
  
  // Media 섹션 업데이트
  function updateMediaSection(mediaData) {
    console.log('updateMediaSection 호출됨:', mediaData);
    if (!mediaData) return;
    
    // 섹션이 비활성화된 경우 섹션 숨기기
    const mediaSection = document.querySelector('.media-section');
    if (mediaSection) {
      const isActive = mediaData.active !== false; // 기본값 true
      mediaSection.style.display = isActive ? 'block' : 'none';
      
      if (!isActive) {
        console.log('미디어 섹션이 비활성화되어 숨김 처리됨');
        return;
      }
    }
    
    const mediaIntro = document.querySelector('.media-header p');
    
    // 소개 텍스트 업데이트 (HTML 허용)
    if (mediaIntro && mediaData.richTextIntroHtml) {
      mediaIntro.innerHTML = mediaData.richTextIntroHtml;
    }
    
    // 미디어 아이템 업데이트 - 동적으로 요소 재수집
    if (mediaData.items) {
      // 모든 미디어 아이템을 최대 8개로 제한
      const itemsToShow = mediaData.items.slice(0, 8);
      
      // 매번 최신 DOM 요소들을 동적으로 가져오기
      const mediaItems = Array.from(document.querySelectorAll('.media-item'));
      console.log('미디어 아이템 개수:', mediaItems.length, '표시할 아이템 개수:', itemsToShow.length);
      
      mediaItems.forEach((item, index) => {
        if (itemsToShow[index]) {
          const itemData = itemsToShow[index];
          const mediaContainer = item.querySelector('.media-image');
          const itemCategory = item.querySelector('.media-category');
          const itemTitle = item.querySelector('.media-item-title');
          const itemDate = item.querySelector('.media-date');
          
          if (mediaContainer && itemData.image) {
            const mediaUrl = convertToAbsoluteUrl(itemData.image);
            const isVideo = isVideoFile(mediaUrl);
            console.log(`미디어 아이템 ${index + 1} 업데이트:`, mediaUrl, '비디오:', isVideo);
            
            // 기존 미디어 요소 제거
            const existingMedia = mediaContainer.querySelector('img, video');
            if (existingMedia) {
              existingMedia.remove();
            }
            
            // 새로운 미디어 요소 생성
            const mediaElement = createMediaElement(mediaUrl, itemData.title || `Media Item ${index + 1}`, 'media-img');
            
            if (isVideo) {
              // 비디오인 경우 썸네일과 호버 재생 기능 추가
              const container = document.createElement('div');
              container.className = 'video-container';
              
              const thumbnail = document.createElement('img');
              thumbnail.alt = '비디오 썸네일';
              thumbnail.style.width = '100%';
              thumbnail.style.height = '100%';
              thumbnail.style.objectFit = 'cover';
              
              // 썸네일 생성
              mediaElement.addEventListener('loadeddata', () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = mediaElement.videoWidth;
                canvas.height = mediaElement.videoHeight;
                ctx.drawImage(mediaElement, 0, 0, canvas.width, canvas.height);
                thumbnail.src = canvas.toDataURL('image/jpeg');
              });
              
              // 호버 이벤트
              container.addEventListener('mouseenter', () => {
                thumbnail.style.display = 'none';
                mediaElement.style.display = 'block';
                mediaElement.currentTime = 0;
                mediaElement.play().catch(error => {
                  console.log('비디오 자동 재생 실패 (정상):', error);
                });
              });
              
              container.addEventListener('mouseleave', () => {
                mediaElement.pause();
                mediaElement.currentTime = 0;
                mediaElement.style.display = 'none';
                thumbnail.style.display = 'block';
              });
              
              // 초기 상태 설정
              mediaElement.style.display = 'none';
              container.appendChild(thumbnail);
              container.appendChild(mediaElement);
              
              // 기존 요소를 컨테이너로 교체
              mediaContainer.innerHTML = '';
              mediaContainer.appendChild(container);
            } else {
              // 이미지인 경우에만 추가
              mediaContainer.appendChild(mediaElement);
            }
          }
          
          if (itemCategory && itemData.category) {
            itemCategory.textContent = itemData.category;
          }
          
          if (itemTitle && itemData.title) {
            itemTitle.textContent = itemData.title;
          }
          
          if (itemDate && itemData.date) {
            itemDate.textContent = itemData.date;
          }
        }
      });
    }
  }
  
  // Career 섹션 업데이트
  function updateCareerSection(careerData) {
    console.log('updateCareerSection 호출됨:', careerData);
    if (!careerData?.posts) return;
    
    // 섹션이 비활성화된 경우 섹션 숨기기
    const careerSection = document.querySelector('.career-section');
    if (careerSection) {
      const isActive = careerData.active !== false; // 기본값 true
      careerSection.style.display = isActive ? 'block' : 'none';
      
      if (!isActive) {
        console.log('채용 섹션이 비활성화되어 숨김 처리됨');
        return;
      }
    }
    
    const careerItems = document.querySelectorAll('.career-item');
    
    // 모든 채용 공고를 날짜순으로 정렬하고 최신 2개만 표시
    const sortedPosts = careerData.posts
      .filter(post => post.title && post.title !== 'on') // 유효한 제목이 있는 포스트만
      .sort((a, b) => {
        // 날짜 기준으로 정렬 (최신순)
        const dateA = new Date(a.period?.start || a.period?.end || '1900-01-01');
        const dateB = new Date(b.period?.start || b.period?.end || '1900-01-01');
        return dateB - dateA;
      })
      .slice(0, 2); // 최신 2개만
    
    console.log('메인 화면 표시할 채용 공고 개수:', sortedPosts.length, '전체 공고:', careerData.posts.length);
    
    // 정렬된 포스트가 없으면 기본 공고 사용
    const postsToShow = sortedPosts.length > 0 ? sortedPosts : [
      {
        title: '경력직 PM/PO 채용',
        period: { start: '2025.08.01', end: '2025.08.15' }
      },
      {
        title: '2025년 R&D 인재 상시채용',
        period: { start: '2025.01.01', end: '2025.12.31' }
      }
    ];
    
    careerItems.forEach((item, index) => {
      if (postsToShow[index]) {
        const postData = postsToShow[index];
        const itemTitle = item.querySelector('.career-item-title');
        const itemPeriod = item.querySelector('.career-period');
        const statusElement = item.querySelector('.career-status');
        
        if (itemTitle && postData.title) {
          itemTitle.textContent = postData.title;
        }
        
        if (itemPeriod && postData.period) {
          const startDate = postData.period.start ? new Date(postData.period.start).toLocaleDateString('ko-KR') : '';
          const endDate = postData.period.end ? new Date(postData.period.end).toLocaleDateString('ko-KR') : '';
          itemPeriod.textContent = `${startDate} ~ ${endDate}`;
        }
        
        if (statusElement) {
          statusElement.textContent = '채용 중';
        }
        
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  // Footer 섹션 업데이트
  function updateFooterSection(footerData) {
    if (!footerData) return;
    
    const footerTitle = document.querySelector('.footer-title .line-text');
    const footerButton = document.querySelector('.footer-contact-btn .common-btn-text');
    const footerLogo = document.querySelector('.footer-logo-img');
    const socialLinks = document.querySelectorAll('.social-link');
    
    // 푸터 타이틀 업데이트
    if (footerTitle && footerData.title) {
      footerTitle.textContent = footerData.title;
    }
    
    // 문의하기 버튼 텍스트 업데이트
    if (footerButton && footerData.buttonText) {
      footerButton.textContent = footerData.buttonText;
    }
    
    // 로고 이미지 업데이트
    if (footerLogo && footerData.logo) {
      const imageUrl = convertToAbsoluteUrl(footerData.logo);
      footerLogo.src = imageUrl;
    }
    
    // SNS 링크 업데이트
    if (footerData.sns && socialLinks.length > 0) {
      const snsMapping = {
        'Instagram': footerData.sns.instagram,
        'LinkedIn': footerData.sns.linkedin,
        'Youtube': footerData.sns.youtube
      };
      
      socialLinks.forEach(link => {
        const linkText = link.textContent.trim();
        if (snsMapping[linkText]) {
          link.href = snsMapping[linkText];
        }
      });
    }
  }
  
  // SEO 메타데이터 업데이트
  function updateSEOMeta(seoData) {
    if (!seoData) return;
    
    // 페이지 타이틀 업데이트
    if (seoData.title) {
      document.title = seoData.title;
    }
    
    // 메타 설명 업데이트
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    if (seoData.description) {
      metaDescription.content = seoData.description;
    }
    
    // 메타 키워드 업데이트
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    if (seoData.keywords && Array.isArray(seoData.keywords)) {
      metaKeywords.content = seoData.keywords.join(', ');
    }
    
    // Open Graph 이미지 업데이트
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    if (seoData.ogImage) {
      ogImage.content = seoData.ogImage;
    }
  }
  
  // 미리보기 메시지 수신 (어드민 페이지에서)
  window.addEventListener('message', (event) => {
    if (event.data.type === 'PREVIEW_CONTENT') {
      console.log('미리보기 콘텐츠 수신:', event.data.content);
      applyContent(event.data.content);
    }
  });
  
  // 페이지 로드 시 콘텐츠 로드
  document.addEventListener('DOMContentLoaded', () => {
    loadContent();
  });
  
  // 전역 함수로 내보내기 (어드민 페이지에서 사용)
  window.applyContent = applyContent;
  window.loadContent = loadContent;
})();
