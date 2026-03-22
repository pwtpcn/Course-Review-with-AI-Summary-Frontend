import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="relative z-100">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 md:bottom-12 md:right-12 bg-black border-2 border-[#1BE1F3] text-[#1BE1F3] p-3 md:p-4 rounded-full shadow-[0_0_15px_rgba(27,225,243,0.5)] hover:bg-[#1BE1F3] hover:text-black hover:shadow-[0_0_25px_rgba(27,225,243,0.8)] transition-all duration-300 transform hover:-translate-y-2 group"
          title="Go to top"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6 stroke-[3px]" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
