import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the Toast context
interface ToastContextType {
  successToast: (message: string) => void;
  errorToast: (message: string) => void;
  warnToast:(message:string) => void;
}

// Define the props for Toast components
interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

// Create the Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ✅ Success Toast
const SuccessToast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: calc(100% - 2rem);
          max-width: 420px;
          min-width: 280px;
        }

        @media (max-width: 250px) {
          .toast-container {
            width: calc(100% - 0.75rem);
            max-width: none;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        @media (min-width: 251px) and (max-width: 640px) {
          .toast-container {
            width: 240px;
            max-width: 240px;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .toast-container {
            width: calc(100% - 4rem);
            max-width: 400px;
          }
        }

        @media (min-width: 1025px) {
          .toast-container {
            width: auto;
            max-width: 420px;
            min-width: 320px;
          }
        }

        .toast-base {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 25px -10px rgba(0, 0, 0, 0.1);
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
          position: relative;
          backdrop-filter: blur(10px);
          overflow: hidden;
          animation: toastFloating 4s ease-in-out infinite;
        }

        @keyframes toastFloating {
          0%, 100% {
            transform: scale(1) translateY(0px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 25px -10px rgba(0, 0, 0, 0.1);
          }
          25% {
            transform: scale(1.008) translateY(-1px);
            box-shadow: 0 28px 55px -12px rgba(0, 0, 0, 0.3), 0 12px 30px -10px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: scale(1.015) translateY(-2px);
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.35), 0 15px 35px -10px rgba(0, 0, 0, 0.2);
          }
          75% {
            transform: scale(1.008) translateY(-1px);
            box-shadow: 0 28px 55px -12px rgba(0, 0, 0, 0.3), 0 12px 30px -10px rgba(0, 0, 0, 0.15);
          }
        }

        @media (max-width: 480px) {
          .toast-base {
            padding: 0.875rem 1rem;
            font-size: 0.8125rem;
            gap: 0.625rem;
          }
        }

        @media (min-width: 481px) and (max-width: 640px) {
          .toast-base {
            padding: 0.9375rem 1.125rem;
            font-size: 0.8125rem;
            gap: 0.6875rem;
          }
        }

        @media (min-width: 641px) {
          .toast-base {
            padding: 1rem 1.25rem;
            font-size: 0.875rem;
          }
        }

        @media (min-width: 769px) {
          .toast-base {
            font-size: 0.9375rem;
            padding: 1.125rem 1.375rem;
          }
        }

        .toast-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
          animation: successPulse 3s ease-in-out infinite;
        }

        .toast-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: 1px solid rgba(239, 68, 68, 0.3);
          animation: errorPulse 3s ease-in-out infinite;
        }

        @keyframes successPulse {
          0%, 100% {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-color: rgba(16, 185, 129, 0.3);
          }
          50% {
            background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
            border-color: rgba(16, 185, 129, 0.5);
          }
        }

        @keyframes errorPulse {
          0%, 100% {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border-color: rgba(239, 68, 68, 0.3);
          }
          50% {
            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
            border-color: rgba(239, 68, 68, 0.5);
          }
        }

        .toast-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          animation: iconBounce 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes iconBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: scale(1) rotate(0deg);
          }
          10% {
            transform: scale(1.15) rotate(5deg);
          }
          30% {
            transform: scale(1.1) rotate(-3deg);
          }
          60% {
            transform: scale(1.08) rotate(2deg);
          }
          90% {
            transform: scale(1.05) rotate(-1deg);
          }
        }

        @media (max-width: 480px) {
          .toast-icon {
            width: 1.125rem;
            height: 1.125rem;
          }
        }

        @media (min-width: 769px) {
          .toast-icon {
            width: 1.375rem;
            height: 1.375rem;
          }
        }

        .toast-message {
          flex: 1;
          min-width: 0;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          animation: textBounce 2.5s ease-in-out infinite;
          filter: brightness(1.1) contrast(1.1);
        }

        @keyframes textBounce {
          0%, 70%, 100% {
            transform: translateY(0px) scale(1);
          }
          15% {
            transform: translateY(-1px) scale(1.02);
          }
          35% {
            transform: translateY(0.5px) scale(1.01);
          }
          50% {
            transform: translateY(-0.5px) scale(1.015);
          }
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 0 0 0.75rem 0.75rem;
        }

        @media (max-width: 480px) {
          .toast-progress {
            height: 2px;
          }
        }

        /* Shimmer effect for toast background */
        .toast-base::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          50% {
            left: 100%;
            opacity: 0.4;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        /* Additional glow effect for icons */
        .toast-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: iconGlow 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes iconGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      <AnimatePresence>
        {isVisible && (
          <div className="toast-container">
            <motion.div
              initial={{ opacity: 0, y: -150, scale: 0.8, rotateX: -90 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                rotateX: 0,
                transition: {
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 80,
                  damping: 20
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -80, 
                scale: 0.9,
                rotateX: -30,
                transition: {
                  duration: 0.8,
                  ease: [0.4, 0, 0.6, 1]
                }
              }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { duration: 0.3 }
              }}
              className="toast-base toast-success"
            >
              <svg
                className="toast-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="toast-message">{message}</span>
              <motion.div
                className="toast-progress"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// ✅ Error Toast
const ErrorToast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: calc(100% - 2rem);
          max-width: 420px;
          min-width: 280px;
        }

        @media (max-width: 640px) {
          .toast-container {
            width: calc(100% - 1rem);
            max-width: none;
            min-width: auto;
            left: 0.5rem;
            right: 0.5rem;
            transform: none;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .toast-container {
            width: calc(100% - 3rem);
            max-width: 380px;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .toast-container {
            width: calc(100% - 4rem);
            max-width: 400px;
          }
        }

        @media (min-width: 1025px) {
          .toast-container {
            width: auto;
            max-width: 420px;
            min-width: 320px;
          }
        }

        .toast-base {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 25px -10px rgba(0, 0, 0, 0.1);
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
          position: relative;
          backdrop-filter: blur(10px);
        }

        @media (max-width: 480px) {
          .toast-base {
            padding: 0.875rem 1rem;
            font-size: 0.8125rem;
            gap: 0.625rem;
          }
        }

        @media (min-width: 481px) and (max-width: 640px) {
          .toast-base {
            padding: 0.9375rem 1.125rem;
            font-size: 0.8125rem;
            gap: 0.6875rem;
          }
        }

        @media (min-width: 641px) {
          .toast-base {
            padding: 1rem 1.25rem;
            font-size: 0.875rem;
          }
        }

        @media (min-width: 769px) {
          .toast-base {
            font-size: 0.9375rem;
            padding: 1.125rem 1.375rem;
          }
        }

        .toast-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .toast-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .toast-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .toast-icon {
            width: 1.125rem;
            height: 1.125rem;
          }
        }

        @media (min-width: 769px) {
          .toast-icon {
            width: 1.375rem;
            height: 1.375rem;
          }
        }

        .toast-message {
          flex: 1;
          min-width: 0;
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 0 0 0.75rem 0.75rem;
        }

        @media (max-width: 480px) {
          .toast-progress {
            height: 2px;
          }
        }
      `}</style>
      
      <AnimatePresence>
        {isVisible && (
          <div className="toast-container">
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.9, rotateX: -90 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                rotateX: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -50, 
                scale: 0.95,
                rotateX: -45,
                transition: {
                  duration: 0.4,
                  ease: [0.4, 0, 0.6, 1]
                }
              }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
              className="toast-base toast-error"
            >
              <svg
                className="toast-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="toast-message">{message}</span>
              <motion.div
                className="toast-progress"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const WarnToast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <>
      <style>{`
        .toast-container {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          width: calc(100% - 2rem);
          max-width: 420px;
          min-width: 280px;
        }

        @media (max-width: 640px) {
          .toast-container {
            width: calc(100% - 1rem);
            max-width: none;
            min-width: auto;
            left: 0.5rem;
            right: 0.5rem;
            transform: none;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .toast-container {
            width: calc(100% - 3rem);
            max-width: 380px;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .toast-container {
            width: calc(100% - 4rem);
            max-width: 400px;
          }
        }

        @media (min-width: 1025px) {
          .toast-container {
            width: auto;
            max-width: 420px;
            min-width: 320px;
          }
        }

        .toast-base {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 25px -10px rgba(0, 0, 0, 0.1);
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
          position: relative;
          backdrop-filter: blur(10px);
        }

        @media (max-width: 480px) {
          .toast-base {
            padding: 0.875rem 1rem;
            font-size: 0.8125rem;
            gap: 0.625rem;
          }
        }

        @media (min-width: 481px) and (max-width: 640px) {
          .toast-base {
            padding: 0.9375rem 1.125rem;
            font-size: 0.8125rem;
            gap: 0.6875rem;
          }
        }

        @media (min-width: 641px) {
          .toast-base {
            padding: 1rem 1.25rem;
            font-size: 0.875rem;
          }
        }

        @media (min-width: 769px) {
          .toast-base {
            font-size: 0.9375rem;
            padding: 1.125rem 1.375rem;
          }
        }

        .toast-warn {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: 1px solid rgba(251, 191, 36, 0.3);
          animation: warnPulse 3s ease-in-out infinite;
        }

        @keyframes warnPulse {
          0%, 100% {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            border-color: rgba(251, 191, 36, 0.3);
          }
          50% {
            background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
            border-color: rgba(251, 191, 36, 0.5);
          }
        }

        .toast-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          animation: iconBounce 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes iconBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: scale(1) rotate(0deg);
          }
          10% {
            transform: scale(1.15) rotate(5deg);
          }
          30% {
            transform: scale(1.1) rotate(-3deg);
          }
          60% {
            transform: scale(1.08) rotate(2deg);
          }
          90% {
            transform: scale(1.05) rotate(-1deg);
          }
        }

        @media (max-width: 480px) {
          .toast-icon {
            width: 1.125rem;
            height: 1.125rem;
          }
        }

        @media (min-width: 769px) {
          .toast-icon {
            width: 1.375rem;
            height: 1.375rem;
          }
        }

        .toast-message {
          flex: 1;
          min-width: 0;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          animation: textBounce 2.5s ease-in-out infinite;
          filter: brightness(1.1) contrast(1.1);
        }

        @keyframes textBounce {
          0%, 70%, 100% {
            transform: translateY(0px) scale(1);
          }
          15% {
            transform: translateY(-1px) scale(1.02);
          }
          35% {
            transform: translateY(0.5px) scale(1.01);
          }
          50% {
            transform: translateY(-0.5px) scale(1.015);
          }
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 0 0 0.75rem 0.75rem;
        }

        @media (max-width: 480px) {
          .toast-progress {
            height: 2px;
          }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <div className="toast-container">
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.9, rotateX: -90 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                },
              }}
              exit={{
                opacity: 0,
                y: -50,
                scale: 0.95,
                rotateX: -45,
                transition: {
                  duration: 0.4,
                  ease: [0.4, 0, 0.6, 1],
                },
              }}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 },
              }}
              className="toast-base toast-warn"
            >
              <svg
                className="toast-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="toast-message">{message}</span>
              <motion.div
                className="toast-progress"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ type: string; message: string; isVisible: boolean }>({
    type: '',
    message: '',
    isVisible: false,
  });

  const successToast = (message: string) => {
    setToast({ type: 'success', message, isVisible: true });
  };

  const warnToast = (message: string) => {
  setToast({ type: 'warn', message, isVisible: true });
};

  const errorToast = (message: string) => {
    setToast({ type: 'error', message, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ successToast, errorToast, warnToast }}>
      {children}
      <SuccessToast
        message={toast.message}
        isVisible={toast.type === 'success' && toast.isVisible}
        onClose={hideToast}
      />
      <ErrorToast
        message={toast.message}
        isVisible={toast.type === 'error' && toast.isVisible}
        onClose={hideToast}
      />
        <WarnToast
        message={toast.message}
        isVisible={toast.type === 'warn' && toast.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use the Toast Context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};