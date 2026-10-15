import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  const confirmBtnStyles = {
    danger: 'bg-[#B93838] hover:bg-[#991B1B] text-white',
    warning: 'bg-[#A96116] hover:bg-[#854D0E] text-white',
    primary: 'bg-[#315CEB] hover:bg-[#2447C5] text-white',
  }[variant];

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="sm">
      <div className="flex items-start gap-3 py-1">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            variant === 'danger'
              ? 'bg-[#FEF2F2] text-[#B93838]'
              : 'bg-[#FFFBEB] text-[#A96116]'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-[#475467] leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3E5E8] mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#475467] hover:bg-[#F3F4F6] rounded-xl border border-[#E3E5E8] transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onCancel();
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-xs transition-colors ${confirmBtnStyles}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
