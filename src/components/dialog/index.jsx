import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const focusable = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex='-1'])";

const Dialog = ({ open, title, description, children, onClose, size = "medium" }) => {
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef(null);
    const closeRef = useRef(onClose);

    useEffect(() => { closeRef.current = onClose; }, [onClose]);
    useEffect(() => {
        if (!open) return undefined;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const target = panelRef.current?.querySelector("[data-initial-focus]") || panelRef.current?.querySelector(focusable);
        target?.focus();
        const onKeyDown = (event) => {
            if (event.key === "Escape") { event.preventDefault(); closeRef.current?.(); return; }
            if (event.key !== "Tab" || !panelRef.current) return;
            const items = [...panelRef.current.querySelectorAll(focusable)];
            if (!items.length) return;
            if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
            else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [open]);

    if (!open) return null;
    return (
        <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
            <section aria-describedby={description ? descriptionId : undefined} aria-labelledby={titleId} aria-modal="true" className={`${styles.dialog} ${styles[size] || ""}`} ref={panelRef} role="dialog">
                <header className={styles.header}>
                    <div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div>
                    <button aria-label="Close dialog" className={styles.close} onClick={onClose} type="button"><FiX aria-hidden="true" /></button>
                </header>
                <div className={styles.body}>{children}</div>
            </section>
        </div>
    );
};

export default Dialog;