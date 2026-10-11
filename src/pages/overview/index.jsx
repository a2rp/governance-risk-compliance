import { FiArrowRight, FiArrowUpRight, FiCalendar, FiClipboard, FiPlus, FiShield, FiTarget } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/format";
import styles from "./styles.module.css";

const severityRows = ["Critical", "High", "Medium", "Low"];
const likelihoodColumns = ["Likely", "Possible", "Unlikely"];
const riskTones = ["critical", "high", "moderate"];

const OverviewPage = ({ controls, audits, issues }) => {
    const activeIssues = issues.filter((item) => item.status !== "Closed");
    const effectiveControls = controls.filter((item) => item.status === "Effective").length;
    const coverage = controls.length ? Math.round((effectiveControls / controls.length) * 100) : 0;
    const activeAudits = audits.filter((item) => item.status !== "Complete");
    const currentAudit = [...activeAudits].sort((first, second) => first.dueDate.localeCompare(second.dueDate))[0];
    const focusIssues = [...activeIssues].sort((first, second) => {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[first.severity] - order[second.severity] || first.dueDate.localeCompare(second.dueDate);
    }).slice(0, 3);
    const domains = [...new Set(controls.map((item) => item.domain))].slice(0, 4);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div>
                    <p className={styles.period}>Q4 2026 <span /> Control cycle</p>
                    <h1>Compliance room</h1>
                    <p className={styles.subtitle}>A clear view of assurance work, control health, and the risks that need a decision.</p>
                </div>
                <Link className={styles.primaryAction} to="/issues?new=1"><FiPlus aria-hidden="true" /> Log a finding</Link>
            </div>

            <section aria-label="Governance summary" className={styles.metrics}>
                <article className={styles.metricCard}>
                    <span className={styles.metricIcon}><FiShield aria-hidden="true" /></span>
                    <div><p>Controls in scope</p><strong>{controls.length}</strong><small>{effectiveControls} operating effectively</small></div>
                    <span className={styles.metricAccent}>{coverage}%</span>
                </article>
                <article className={styles.metricCard}>
                    <span className={`${styles.metricIcon} ${styles.amber}`}><FiTarget aria-hidden="true" /></span>
                    <div><p>Evidence gaps</p><strong>{controls.filter((item) => item.status !== "Effective").length}</strong><small>Needs attention this cycle</small></div>
                    <span className={styles.metricAccent}>Q4</span>
                </article>
                <article className={styles.metricCard}>
                    <span className={`${styles.metricIcon} ${styles.green}`}><FiClipboard aria-hidden="true" /></span>
                    <div><p>Active audits</p><strong>{activeAudits.length}</strong><small>{audits.filter((item) => item.status === "Scheduled").length} scheduled next</small></div>
                    <span className={styles.metricAccent}>↗</span>
                </article>
                <article className={styles.metricCard}>
                    <span className={`${styles.metricIcon} ${styles.red}`}><FiCalendar aria-hidden="true" /></span>
                    <div><p>Open findings</p><strong>{activeIssues.length}</strong><small>{activeIssues.filter((item) => item.severity === "Critical" || item.severity === "High").length} high priority</small></div>
                    <span className={styles.metricAccent}>!</span>
                </article>
            </section>

            <div className={styles.mainGrid}>
                <section aria-label="Risk exposure matrix" className={styles.riskPanel}>
                    <div className={styles.sectionHeading}>
                        <div><h2>Risk exposure</h2><p>Findings by impact and likelihood</p></div>
                        <Link className={styles.textLink} to="/issues">Open register <FiArrowUpRight aria-hidden="true" /></Link>
                    </div>
                    <div className={styles.matrixWrap}>
                        <div aria-hidden="true" className={styles.axisLabel}>IMPACT</div>
                        <div className={styles.matrix}>
                            <div className={styles.matrixHeader}><span />{likelihoodColumns.map((item) => <span key={item}>{item}</span>)}</div>
                            {severityRows.map((severity, rowIndex) => (
                                <div className={styles.matrixRow} key={severity}>
                                    <span className={styles.rowLabel}>{severity}</span>
                                    {likelihoodColumns.map((likelihood, columnIndex) => {
                                        const count = activeIssues.filter((issue) => issue.severity === severity && (issue.likelihood || "Possible") === likelihood).length;
                                        const tone = riskTones[Math.min(rowIndex + (columnIndex === 0 ? 0 : columnIndex), 2)];
                                        return (
                                            <Link aria-label={`${count} ${severity.toLowerCase()} findings, ${likelihood.toLowerCase()} likelihood`} className={`${styles.matrixCell} ${styles[tone]}`} key={likelihood} to={`/issues?severity=${encodeURIComponent(severity)}&likelihood=${encodeURIComponent(likelihood)}`}>
                                                <strong>{count}</strong><span>{count === 1 ? "finding" : "findings"}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.matrixLegend}><span><i className={styles.dotLow} /> Lower exposure</span><span><i className={styles.dotHigh} /> Elevated exposure</span><span><i className={styles.dotCritical} /> Critical exposure</span></div>
                </section>

                <section aria-label="Priority findings" className={styles.attentionPanel}>
                    <div className={styles.sectionHeading}>
                        <div><h2>Needs attention</h2><p>Owners and next steps</p></div>
                        <span className={styles.countPill}>{focusIssues.length} priorities</span>
                    </div>
                    <div className={styles.issueList}>
                        {focusIssues.map((issue) => (
                            <Link className={styles.issueItem} key={issue.id} to={`/issues?finding=${encodeURIComponent(issue.id)}`}>
                                <span className={`${styles.severityMark} ${styles[issue.severity.toLowerCase()]}`} />
                                <span className={styles.issueCopy}><strong>{issue.title}</strong><small>{issue.id} <i /> {issue.owner}</small></span>
                                <span className={styles.issueDue}>{formatDate(issue.dueDate, { month: "short", day: "numeric" })}</span>
                            </Link>
                        ))}
                        {!focusIssues.length && <p className={styles.emptyText}>No active findings need attention.</p>}
                    </div>
                    <Link className={styles.panelLink} to="/issues">View remediation queue <FiArrowRight aria-hidden="true" /></Link>
                </section>
            </div>

            <div className={styles.lowerGrid}>
                <section aria-label="Audit focus" className={styles.auditPanel}>
                    <div className={styles.sectionHeading}>
                        <div><h2>Audit focus</h2><p>Nearest open assurance window</p></div>
                        <Link className={styles.iconLink} aria-label="View audit plans" to="/audits"><FiArrowUpRight aria-hidden="true" /></Link>
                    </div>
                    {currentAudit ? (
                        <div className={styles.auditFocus}>
                            <div className={styles.auditTop}><span className={styles.framework}>{currentAudit.framework}</span><span>{currentAudit.status}</span></div>
                            <h3>{currentAudit.name}</h3>
                            <p>Lead: {currentAudit.lead} <i /> Due {formatDate(currentAudit.dueDate, { month: "short", day: "numeric" })}</p>
                            <div aria-label={`${currentAudit.progress}% complete`} className={styles.progress} role="progressbar" aria-valuenow={currentAudit.progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${currentAudit.progress}%` }} /></div>
                            <div className={styles.progressLabels}><span>Evidence review</span><strong>{currentAudit.progress}%</strong></div>
                        </div>
                    ) : <p className={styles.emptyText}>No open audit plans.</p>}
                </section>

                <section aria-label="Control health by domain" className={styles.domainPanel}>
                    <div className={styles.sectionHeading}><div><h2>Control health</h2><p>Operating coverage by domain</p></div><Link className={styles.textLink} to="/controls">Control library <FiArrowUpRight aria-hidden="true" /></Link></div>
                    <div className={styles.domainList}>
                        {domains.map((domain) => {
                            const group = controls.filter((item) => item.domain === domain);
                            const ready = group.filter((item) => item.status === "Effective").length;
                            const percent = group.length ? Math.round((ready / group.length) * 100) : 0;
                            return <div className={styles.domainRow} key={domain}><div><strong>{domain}</strong><span>{ready} of {group.length} effective</span></div><div aria-label={`${percent}% effective`} className={styles.domainTrack} role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }} /></div></div>;
                        })}
                    </div>
                </section>

                <section aria-label="Quarterly review note" className={styles.reviewPanel}>
                    <img alt="Two colleagues reviewing a document together" src={import.meta.env.BASE_URL + "audit-review.jpg"} />
                    <div className={styles.reviewCopy}><span>Q4 ASSURANCE</span><h2>Evidence is moving.</h2><p>Teams are reviewing access, key rotation, and recovery evidence before the quarter closes.</p><Link to="/audits">See the audit calendar <FiArrowUpRight aria-hidden="true" /></Link></div>
                </section>
            </div>
        </div>
    );
};

export default OverviewPage;