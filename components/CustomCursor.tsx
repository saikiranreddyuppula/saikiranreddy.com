import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // gsap.quickTo is optimized for high-frequency updates (no tween creation per call)
    const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const followerX = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
    const followerY = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

    const onMouseMove = (e: MouseEvent) => {
      cursorX(e.clientX);
      cursorY(e.clientY);
      followerX(e.clientX);
      followerY(e.clientY);
    };

    document.addEventListener('mousemove', onMouseMove);

    // Use event delegation instead of MutationObserver + querySelectorAll
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, .interactive');
      if (target) setHovered(true);
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, .interactive');
      if (target) setHovered(false);
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (hovered) {
      gsap.to(cursor, { 
        scale: 0, 
        duration: 0.25,
        ease: 'power2.out',
      });
      gsap.to(follower, { 
        scale: 2.5, 
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        duration: 0.35,
        ease: 'power2.out',
      });
    } else {
      gsap.to(cursor, { 
        scale: 1, 
        duration: 0.25,
        ease: 'power2.out',
      });
      gsap.to(follower, { 
        scale: 1, 
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'transparent',
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }, [hovered]);

  return (
    <>
      <div ref={followerRef} className="cursor-follower" />
      <div ref={cursorRef} className="cursor-dot" />
      
      <style jsx global>{`
        @media (pointer: fine) {
          body {
            cursor: none;
          }

          a, button, .interactive {
            cursor: none;
          }
        }

        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 99999;
          mix-blend-mode: difference;
        }

        .cursor-follower {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 99998;
          transition: background-color 0.3s, border-color 0.3s;
        }

        @media (pointer: coarse) {
          .cursor-dot,
          .cursor-follower {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
