import styles from 'styles/Toast.module.css';

const Toast = ({ toast, onDismiss }) => {
    if (!toast) return null;
    const cls = toast.type === "error" ? styles.error : styles.success;
    return (
        <div className={`${styles.toast} ${cls}`} role={toast.type === "error" ? "alert" : "status"}>
            <span className={styles.message}>{toast.text}</span>
            <button className={styles.close} onClick={onDismiss}>&times;</button>
        </div>
    );
};
export default Toast;
