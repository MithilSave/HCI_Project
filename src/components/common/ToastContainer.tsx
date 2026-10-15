import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#20845A] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#B93838] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#A96116] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#315CEB] shrink-0" />,
        };

        const borders = {
          success: 'border-[#BBF7D0] bg-[#F0FDF4]',
          error: 'border-[#FECACA] bg-[#FEF2F2]',
          warning: 'border-[#FDE68A] bg-[#FFFBEB]',
          info: 'border-[#C7D2FE] bg-white',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#17243A] leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-[#475467] mt-0.5 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9CA3AF] hover:text-[#475467] p-0.5 rounded transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
