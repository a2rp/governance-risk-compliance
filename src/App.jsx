import { useCallback, useState } from "react";
import AppRoutes from "./AppRoutes";
import styles from "./App.module.css";
import Footer from "./components/footer";
import Header from "./components/header";
import Toast from "./components/toast";
import useGrcState from "./hooks/useGrcState";

const App = () => {
    const [toast, setToast] = useState(null);
    const notify = useCallback((message, type = "success") => {
        setToast({ id: Date.now(), message, type });
    }, []);
    const dismissToast = useCallback(() => setToast(null), []);
    const workspace = useGrcState(notify);

    return (
        <div className={styles.app}>
            <a className={styles.skipLink} href="#main-content">Skip to main content</a>
            <Header />
            <main className={styles.main} id="main-content">
                <AppRoutes notify={notify} workspace={workspace} />
            </main>
            <Footer />
            <Toast key={toast?.id || "empty"} message={toast?.message} onDismiss={dismissToast} type={toast?.type} />
        </div>
    );
};

export default App;
