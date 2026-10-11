import { Link } from "react-router-dom";
import { FiArrowLeft, FiCompass } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFoundPage = () => (
    <section aria-labelledby="not-found-title" className={styles.page}>
        <div className={styles.art} aria-hidden="true"><span>404</span><FiCompass /></div>
        <div className={styles.copy}>
            <p className={styles.label}>PAGE NOT FOUND</p>
            <h1 id="not-found-title">This page is outside the register.</h1>
            <p className={styles.description}>The address may have changed, or this workspace does not include that page.</p>
            <Link className={styles.homeLink} to="/"><FiArrowLeft aria-hidden="true" /> Return to compliance overview</Link>
        </div>
    </section>
);

export default NotFoundPage;
