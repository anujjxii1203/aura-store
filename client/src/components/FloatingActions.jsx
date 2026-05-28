import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const FloatingActions = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="floating-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {isVisible && (
        <button 
          className="floating-btn btn-scroll-top" 
          onClick={scrollToTop} 
          aria-label="Scroll to top"
          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', animation: 'popIn 0.3s ease' }}
        >
          <ChevronUp size={22} />
        </button>
      )}
    </div>
  );
};

export default FloatingActions;
