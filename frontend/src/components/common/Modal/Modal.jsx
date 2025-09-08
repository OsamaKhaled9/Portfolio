import React, { useEffect, useRef } from 'react';

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
  boxSizing: 'border-box'
};

const dialogStyle = {
  backgroundColor: 'rgba(17, 24, 39, 0.95)',
  border: '1px solid rgba(6,182,212,0.3)',
  borderRadius: '12px',
  maxWidth: '720px',
  width: '100%',
  maxHeight: '80vh',
  overflow: 'auto',
  padding: '24px',
  boxSizing: 'border-box',
  color: '#d1d5db',
  position: 'relative'
};

const closeBtnStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'transparent',
  color: '#9ca3af',
  border: '1px solid #4b5563',
  borderRadius: '8px',
  padding: '6px 10px',
  cursor: 'pointer'
};

export default function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  const firstFocusable = useRef(null);
  const lastFocusable = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Find focusable elements
    const focusables = dialog.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length) {
      firstFocusable.current = focusables;
      lastFocusable.current = focusables[focusables.length - 1];
      firstFocusable.current.focus();
    } else {
      dialog.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === 'Tab' && focusables.length) {
        if (e.shiftKey && document.activeElement === firstFocusable.current) {
          e.preventDefault();
          lastFocusable.current.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable.current) {
          e.preventDefault();
          firstFocusable.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div role="presentation" style={overlayStyle} onMouseDown={handleOverlayClick}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        ref={dialogRef}
        tabIndex={-1}
        style={dialogStyle}
      >
        <button type="button" style={closeBtnStyle} onClick={onClose} aria-label="Close">
          Close
        </button>
        {title && <h2 style={{ color: '#06b6d4', fontSize: 22, marginBottom: 12 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
