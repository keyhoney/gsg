/**
 * 콘텐츠 보호를 위한 유틸리티 함수들
 */

// 우클릭 차단
export const disableRightClick = (element: HTMLElement) => {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  element.addEventListener("contextmenu", handleContextMenu);
  return () => element.removeEventListener("contextmenu", handleContextMenu);
};

// 텍스트 선택 차단
export const disableTextSelection = (element: HTMLElement) => {
  const handleSelectStart = (e: Event) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
    return false;
  };

  element.addEventListener("selectstart", handleSelectStart);
  element.addEventListener("dragstart", handleDragStart);
  
  // CSS로도 차단
  element.style.userSelect = "none";
  (element.style as any).webkitUserSelect = "none";
  (element.style as any).mozUserSelect = "none";
  (element.style as any).msUserSelect = "none";

  return () => {
    element.removeEventListener("selectstart", handleSelectStart);
    element.removeEventListener("dragstart", handleDragStart);
  };
};

// 키보드 단축키 차단
export const disableKeyboardShortcuts = (element: HTMLElement) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 복사, 붙여넣기, 잘라내기, 전체 선택, 인쇄 등 차단
    if (
      (e.ctrlKey || e.metaKey) && (
        e.key === "c" || // 복사
        e.key === "v" || // 붙여넣기
        e.key === "x" || // 잘라내기
        e.key === "a" || // 전체 선택
        e.key === "p" || // 인쇄
        e.key === "s" || // 저장
        e.key === "u" || // 소스 보기
        e.key === "i" || // 개발자 도구
        e.key === "j" || // 개발자 도구
        e.key === "f12" || // 개발자 도구
        e.key === "F12"
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // F12, Ctrl+Shift+I 등 개발자 도구 단축키
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  element.addEventListener("keydown", handleKeyDown);
  return () => element.removeEventListener("keydown", handleKeyDown);
};

// 개발자 도구 감지
export const detectDevTools = (callback: (isOpen: boolean) => void) => {
  let devtools = false;
  
  const checkDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    const isOpen = widthThreshold || heightThreshold;
    
    if (isOpen !== devtools) {
      devtools = isOpen;
      callback(devtools);
    }
  };

  // 주기적 체크
  const interval = setInterval(checkDevTools, 500);
  
  // 리사이즈 이벤트
  const handleResize = () => checkDevTools();
  window.addEventListener("resize", handleResize);
  
  // 포커스 이벤트
  const handleFocus = () => checkDevTools();
  window.addEventListener("focus", handleFocus);

  return () => {
    clearInterval(interval);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("focus", handleFocus);
  };
};

// 스크린샷 방지 (가능한 범위 내)
export const preventScreenshot = (element: HTMLElement) => {
  // CSS로 스크린샷 방지
  (element.style as any).webkitUserSelect = "none";
  element.style.userSelect = "none";
  (element.style as any).webkitTouchCallout = "none";
  (element.style as any).webkitUserDrag = "none";
  (element.style as any).khtmlUserSelect = "none";
  (element.style as any).mozUserSelect = "none";
  (element.style as any).msUserSelect = "none";
  
  // 드래그 방지
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
    return false;
  };
  
  element.addEventListener("dragstart", handleDragStart);
  return () => element.removeEventListener("dragstart", handleDragStart);
};

// 콘텐츠 복사 방지
export const preventContentCopy = (element: HTMLElement) => {
  const handleCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleCut = (e: ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  element.addEventListener("copy", handleCopy);
  element.addEventListener("cut", handleCut);
  element.addEventListener("paste", handlePaste);

  return () => {
    element.removeEventListener("copy", handleCopy);
    element.removeEventListener("cut", handleCut);
    element.removeEventListener("paste", handlePaste);
  };
};

// 마우스 우클릭 메뉴 차단
export const disableContextMenu = (element: HTMLElement) => {
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  element.addEventListener("contextmenu", handleContextMenu);
  return () => element.removeEventListener("contextmenu", handleContextMenu);
};

// 인쇄 방지
export const preventPrint = (element: HTMLElement) => {
  const handleBeforePrint = (e: Event) => {
    e.preventDefault();
    return false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      return false;
    }
  };

  element.addEventListener("beforeprint", handleBeforePrint);
  element.addEventListener("keydown", handleKeyDown);

  return () => {
    element.removeEventListener("beforeprint", handleBeforePrint);
    element.removeEventListener("keydown", handleKeyDown);
  };
};

// 전체 보호 시스템 적용
export const applyContentProtection = (element: HTMLElement) => {
  const cleanupFunctions: (() => void)[] = [];

  cleanupFunctions.push(disableRightClick(element));
  cleanupFunctions.push(disableTextSelection(element));
  cleanupFunctions.push(disableKeyboardShortcuts(element));
  cleanupFunctions.push(preventScreenshot(element));
  cleanupFunctions.push(preventContentCopy(element));
  cleanupFunctions.push(disableContextMenu(element));
  cleanupFunctions.push(preventPrint(element));

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};
