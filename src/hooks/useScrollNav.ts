import { useState, useEffect, useRef, useCallback } from 'react';

export function useScrollNav() {
  const [activeNav, setActiveNavState] = useState("home");
  const activeNavRef = useRef("home");
  const isManualScrollRef = useRef(false);

  const setActiveNav = useCallback((val: string) => {
    setActiveNavState(val);
    activeNavRef.current = val;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrollRef.current) return;
      
      const sections = ['home', 'events', 'council'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeNavRef.current !== section) {
              setActiveNav(section);
            }
            return; // Found the active section, stop checking
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to sync with current position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveNav]); // Only depend on stable setter

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      isManualScrollRef.current = true;
      setActiveNav(id); // Set active nav immediately on click
      
      const targetScroll = el.offsetTop - 100;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
      
      // Use a slightly longer timeout or check for scroll completion
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 1000);
    }
  };

  return { activeNav, setActiveNav, scrollTo };
}
