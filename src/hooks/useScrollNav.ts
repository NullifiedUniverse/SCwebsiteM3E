import { useState, useEffect } from 'react';

export function useScrollNav() {
  const [activeNav, setActiveNav] = useState("home");
  const [isManualScroll, setIsManualScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll) return;
      const sections = ['home', 'events', 'council'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeNav !== section) setActiveNav(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeNav, isManualScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setIsManualScroll(true);
      window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
      setTimeout(() => setIsManualScroll(false), 800);
    }
  };

  return { activeNav, setActiveNav, scrollTo };
}
