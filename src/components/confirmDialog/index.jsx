import { FiAlertTriangle } from "react-icons/fi";
import Dialog from "../dialog";
import styles from "./styles.module.css";

const ConfirmDialog = ({ open, title, description, onClose, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "danger" }) => (
    <Dialog description={description} onClose={onClose} open={open} size="narrow" title={title}>
        <div className={styles.content}>
            <span className={`${styles.icon} ${tone === "primary" ? styles.primary : ""}`}><FiAlertTriangle aria-hidden="true" /></span>
            <p>{description}</p>
            <div className={styles.actions}>
                <button className={styles.cancel} data-initial-focus onClick={onClose} type="button">{cancelLabel}</button>
                <button className={tone === "primary" ? styles.confirmPrimary : styles.confirmDanger} onClick={onConfirm} type="button">{confirmLabel}</button>
            </div>
        </div>
    </Dialog>
);

export default ConfirmDialog;