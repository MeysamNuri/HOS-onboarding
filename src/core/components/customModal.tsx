import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./styles/customModal.scss";
import type { BottomModalProps } from "../types/models";
import { Row } from "antd";

export const getBottomModalPopupContainer = (triggerNode?: HTMLElement) =>
  triggerNode?.closest<HTMLElement>(".bottom-modal__backdrop") ?? document.body;

const BottomModal: React.FC<BottomModalProps> = ({
  open,
  onClose,
  height,
  fitContent = false,
  children,
  width,
  showHandler = true,
  modalTitle
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);
  const currentTranslateY = useRef(0);
  const dragThreshold = 20;

  useEffect(() => {
    if (open) {
      setTranslateY(0);
      currentTranslateY.current = 0;
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 992);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    const onPointerDown = (e: PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      isDragging.current = true;
      dragStartY.current = e.clientY;
      currentTranslateY.current = translateY;
      handle.setPointerCapture(e.pointerId);
modalRef.current!.style.transition = "none";
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.current || !modalRef.current) return;

  e.preventDefault();

  const delta = Math.max(0, e.clientY - dragStartY.current);

  currentTranslateY.current = delta;

  // Move the modal with the finger
  modalRef.current.style.transform = `translateY(${delta}px)`;
};

const onPointerUp = () => {
  if (!isDragging.current || !modalRef.current) return;

  isDragging.current = false;

  if (currentTranslateY.current > dragThreshold) {
    onClose();
  } else {
    modalRef.current.style.transition = "transform .25s ease";
    modalRef.current.style.transform = "translateY(0)";
  }

  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
};

    handle.addEventListener("pointerdown", onPointerDown);
    handle.style.touchAction = "none";

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      handle.style.touchAction = "";
    };
  }, [translateY, onClose]);

  if (!open) return null;

  // Determine if the modal uses full screen (100vh)
  const isFullScreen = isMobile && height;

  return createPortal(
    <div
      className="bottom-modal__backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
        <div
          ref={modalRef}
          className={`bottom-modal${fitContent ? " bottom-modal--fit-content" : ""}`}
          style={{
            height: isFullScreen ? "100vh" : "auto",
            width: width && !isMobile ? width : "100%",
            maxWidth: width && !isMobile ? width : undefined,
            borderRadius:
              isMobile && height
                ? "0"
                : isMobile && !height
                  ? "16px 16px 0 0"
                  : "16px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isFullScreen || !showHandler || !isMobile ? (
            <Row style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                className="close-modal-button"
                onClick={onClose}
                aria-label="بستن"
              >
                ×
              </button>
              <span style={{ fontSize: "16px", fontWeight: "700" }}>{modalTitle}</span>
            </Row>
          ) : null}

          {showHandler && isMobile && (
            <div
              ref={handleRef}
              className="drag-handle-wrapper"
              style={{ cursor: "grab", touchAction: "none" }}
            >
              <div className="drag-handle" />
            </div>
          )}
          <div className="bottom-modal__content">{children}</div>
        </div>
      </div>,
    document.body,
  );
};

export default BottomModal;
