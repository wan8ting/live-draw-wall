import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string | null;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 2800); // A bit shorter than App's timeout to allow fade-out
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, message]);


  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-3 px-6 rounded-lg border-4 border-black shadow-brutalist z-50 transition-all duration-300 ease-out
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`}
      style={{ pointerEvents: 'none' }}
    >
      {message}
    </div>
  );
};
