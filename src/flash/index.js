import React, { createContext, useContext, useState } from 'react';

const FlashContext = createContext();

export const useFlash = () => {
  return useContext(FlashContext);
};

export const FlashProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  

  const showFlash = (message) => {
    setMessage(message);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setMessage(null);
    }, 3000);
  };

    
  return (
    <FlashContext.Provider value={{ showFlash, message, isVisible }}>
      {children}
    </FlashContext.Provider>
  );
};
