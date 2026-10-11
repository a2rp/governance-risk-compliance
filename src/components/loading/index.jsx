import styles from "./styles.module.css";

const Loading = () => (
    <div aria-label="Loading" className={styles.loader} role="status">
        <span aria-hidden="true" />
    </div>
);

export default Loading;