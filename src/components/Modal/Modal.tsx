import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  panelClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  titleWrapperClassName?: string;
};

const DEFAULT_OVERLAY_CLASS = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50';
const DEFAULT_PANEL_CLASS = 'bg-white p-6 rounded-lg shadow-md max-w-sm w-full';
const DEFAULT_TITLE_CLASS = 'text-lg font-semibold';
const DEFAULT_DESCRIPTION_CLASS = 'mb-4 text-gray-700';
const DEFAULT_TITLE_WRAPPER_CLASS = 'mb-4';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  panelClassName = DEFAULT_PANEL_CLASS,
  titleClassName = DEFAULT_TITLE_CLASS,
  descriptionClassName = DEFAULT_DESCRIPTION_CLASS,
  titleWrapperClassName = DEFAULT_TITLE_WRAPPER_CLASS,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    if (!panel) return;

    panel.focus?.();

    const onDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onDocumentKeyDown, { capture: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onDocumentKeyDown, { capture: true });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={DEFAULT_OVERLAY_CLASS}>
      <div
        ref={panelRef}
        className={panelClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className={titleWrapperClassName}>
          <h2 id={titleId} className={titleClassName}>
            {title}
          </h2>
          {description ? (
            <div id={descriptionId} className={descriptionClassName}>
              {description}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
