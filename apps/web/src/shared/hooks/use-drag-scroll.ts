import { useEffect, useRef } from 'react';

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 1.3;
      if (Math.abs(walk) > 4) {
        hasMoved = true;
      }
      element.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (hasMoved) {
        e.stopPropagation();
        e.preventDefault();
        hasMoved = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && element.scrollWidth > element.clientWidth) {
        element.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('click', onClickCapture, true);
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('click', onClickCapture, true);
      element.removeEventListener('wheel', onWheel);
    };
  }, []);

  return ref;
}
