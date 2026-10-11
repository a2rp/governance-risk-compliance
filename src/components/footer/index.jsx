import { FaCodepen, FaFacebookF, FaGithub, FaLinkedinIn, FaPatreon, FaYoutube } from "react-icons/fa";
import { FiCoffee, FiGlobe, FiLifeBuoy, FiMail } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.css";

const currentYear = new Date().getFullYear();`r`n`r`nconst links = [
    { label: "Portfolio", detail: "ashishranjan.net", href: "https://www.ashishranjan.net", icon: <FiGlobe aria-hidden="true" /> },
    { label: "GitHub", detail: "github.com/a2rp", href: "https://github.com/a2rp", icon: <FaGithub aria-hidden="true" /> },
    { label: "CodePen", detail: "codepen.io/ash1198", href: "https://codepen.io/ash1198", icon: <FaCodepen aria-hidden="true" /> },
    { label: "LinkedIn", detail: "linkedin.com/in/aashishranjan", href: "https://www.linkedin.com/in/aashishranjan", icon: <FaLinkedinIn aria-hidden="true" /> },
    { label: "Facebook", detail: "facebook.com/theash.ashish", href: "https://www.facebook.com/theash.ashish/", icon: <FaFacebookF aria-hidden="true" /> },
    { label: "YouTube", detail: "youtube.com/@ashishranjan-ashz", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: <FaYoutube aria-hidden="true" /> },
    { label: "Email", detail: "ash.ranjan09@gmail.com", href: "mailto:ash.ranjan09@gmail.com", icon: <FiMail aria-hidden="true" /> },
    { label: "Support", detail: "a2rp-donation-page.netlify.app", href: "https://a2rp-donation-page.netlify.app/", icon: <FiLifeBuoy aria-hidden="true" /> },
    { label: "Buy Me a Coffee", detail: "buymeacoffee.com/ashishranjan", href: "https://buymeacoffee.com/ashishranjan", icon: <FiCoffee aria-hidden="true" /> },
    { label: "Patreon", detail: "patreon.com/ashishranjan", href: "https://www.patreon.com/ashishranjan", icon: <FaPatreon aria-hidden="true" /> },
];

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.inner}>
            <div className={styles.brandBlock}>
                <a className={styles.brand} href="https://www.ashishranjan.net" rel="noreferrer" target="_blank">
                    <img alt="" src={import.meta.env.BASE_URL + "logo.png"} />
                    <span>Candor</span>
                </a>
                <p>Sample workspace. No live compliance system connected.</p>
                <small>&copy; {currentYear} <a href="https://www.ashishranjan.net" rel="noreferrer" target="_blank">Ashish Ranjan</a>. All rights reserved.</small>
            </div>
            <nav aria-label="Footer links" className={styles.links}>
                {links.map((item) => (
                    <a aria-label={item.label} data-tooltip-detail={item.detail} data-tooltip-id="candor-footer-links" data-tooltip-label={item.label} href={item.href} key={item.label} rel={item.href.startsWith("http") ? "noreferrer" : undefined} target={item.href.startsWith("http") ? "_blank" : undefined}>
                        {item.icon}
                    </a>
                ))}
                <Tooltip
                    arrowSize={7}
                    className={styles.tooltip}
                    classNameArrow={styles.tooltipArrow}
                    id="candor-footer-links"
                    offset={8}
                    place="top"
                    render={({ activeAnchor }) => (
                        <div className={styles.tooltipContent}>
                            <strong>{activeAnchor?.getAttribute("data-tooltip-label")}</strong>
                            <span>{activeAnchor?.getAttribute("data-tooltip-detail")}</span>
                        </div>
                    )}
                />
            </nav>
        </div>
    </footer>
);

export default Footer;