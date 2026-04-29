import { useState, useEffect } from 'react';

export function useEasterEggs() {
  const [logoClicks, setLogoClicks] = useState(0);
  const [langClicks, setLangClicks] = useState(0);
  const [partyMode, setPartyMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSeq = [...prev, e.key].slice(-10);
        if (newSeq.join("") === KONAMI_CODE.join("")) {
          setPartyMode(true);
        }
        return newSeq;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { logoClicks, setLogoClicks, langClicks, setLangClicks, partyMode };
}
