import { useEffect, useRef, useState } from "react";
import { FiExternalLink, FiHelpCircle } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import Dialog from "../dialog";
import styles from "./styles.module.css";

const navItems = [
    { label: "Overview", to: "/", end: true },
    { label: "Controls", to: "/controls" },
    { label: "Audit plans", to: "/audits" },
    { label: "Findings", to: "/issues" },
];

const Header = () => {
    const [hidden, setHidden] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const lastScroll = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const current = window.scrollY;
            if (current < 24) setHidden(false);
            else if (current > lastScroll.current + 3) setHidden(true);
            else if (current < lastScroll.current - 3) setHidden(false);
            lastScroll.current = current;
        };
        lastScroll.current = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <header className={styles.header} data-hidden={hidden}>
                <div className={styles.topRow}>
                    <NavLink aria-label="Candor overview" className={styles.brand} to="/">
                        <img alt="" src={import.meta.env.BASE_URL + "candor-mark.svg"} />
                        <span>candor<span className={styles.brandDot}>.</span></span>
                    </NavLink>
                    <span className={styles.context}>Governance workspace <i /> Q4 2026</span>
                    <div className={styles.actions}>
                        <span className={styles.demoBadge}><span /> Sample workspace</span>
                        <a className={styles.repository} href="https://github.com/a2rp/governance-risk-compliance" rel="noreferrer" target="_blank">
                            Repository <FiExternalLink aria-hidden="true" />
                        </a>
                        <button aria-label="About this governance demo" className={styles.helpButton} onClick={() => setHelpOpen(true)} type="button">
                            <FiHelpCircle aria-hidden="true" /><span>Demo guide</span>
                        </button>
                    </div>
                </div>
                <div className={styles.navRow}>
                    <nav aria-label="Governance navigation" className={styles.navInner}>
                        <span className={styles.navLabel}>WORKSPACE</span>
                        {navItems.map(({ label, to, end }) => (
                            <NavLink aria-label={label} className={({ isActive }) => isActive ? styles.activeLink : styles.link} end={end} key={to} to={to}>
                                {label}
                            </NavLink>
                        ))}
                        <span className={styles.navNote}>RISK &amp; ASSURANCE</span>
                    </nav>
                </div>
            </header>
            <Dialog
                description="A working frontend preview for governance teams. All records are sample data and reset when this page is refreshed."
                onClose={() => setHelpOpen(false)}
                open={helpOpen}
                size="narrow"
                title="Candor demo guide"
            >
                <div className={styles.helpContent}>
                    <p>Review the risk snapshot, update control ownership and evidence status, move audit plans through their stages, and track findings to closure.</p>
                    <p>No external system is connected. Evidence is represented with sample records, and no files are uploaded.</p>
                    <button data-initial-focus onClick={() => setHelpOpen(false)} type="button">Got it</button>
                </div>
            </Dialog>
        </>
    );
};

export default Header;