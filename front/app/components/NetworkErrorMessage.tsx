import React from "react";
import { useState, useEffect } from "react";

type NetworkErrorMessageProps = {
  message: string;
  dismiss: React.MouseEventHandler<HTMLButtonElement>;
};

const NetworkErrorMessage: React.FC<NetworkErrorMessageProps> = ({
  message,
  dismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10); // Немного задержки для плавного эффекта
  }, []);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out 
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
    >
      <div className="bg-red-600 text-white text-center py-2 px-4 rounded shadow-lg">
        {message}
        <button className="ml-4 text-lg font-bold" onClick={dismiss}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default NetworkErrorMessage;
