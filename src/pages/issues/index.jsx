import { useMemo, useState } from "react";
import { FiArrowUpRight, FiDownload, FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import { controlDomains, issueStatuses } from "../../data/seed";
import { downloadCsv } from "../../utils/downloadCsv";
import { formatDate } from "../../utils/format";
import styles from "./styles.module.css";

const severities = ["Critical", "High", "Medium", "Low"];
const likelihoods = ["Likely", "Possible", "Unlikely"];
const blankIssue = { title: "", severity: "Medium", likelihood: "Possible", domain: controlDomains[0], owner: "", dueDate: "2026-10-31", status: "Open", controlId: "", description: "" };

const IssuesPage = ({ issues, controls, saveIssue, updateIssue, deleteIssue }) => {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const [severityFilter, setSeverityFilter] = useState(searchParams.get("severity") || "All severities");
    const [likelihoodFilter, setLikelihoodFilter] = useState(searchParams.get("likelihood") || "All likelihoods");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [domainFilter, setDomainFilter] = useState("All domains");
    const [sortBy, setSortBy] = useState("Risk priority");
    const [formOpen, setFormOpen] = useState(searchParams.get("new") === "1");
    const [form, setForm] = useState(blankIssue);
    const [formError, setFormError] = useState("");
    const [activeIssue, setActiveIssue] = useState(() => issues.find((item) => item.id === searchParams.get("finding")) || null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredIssues = useMemo(() => issues
        .filter((item) => !query.trim() || [item.title, item.id, item.owner, item.description].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())))
        .filter((item) => severityFilter === "All severities" || item.severity === severityFilter)
        .filter((item) => likelihoodFilter === "All likelihoods" || (item.likelihood || "Possible") === likelihoodFilter)
        .filter((item) => statusFilter === "All statuses" || item.status === statusFilter)
        .filter((item) => domainFilter === "All domains" || item.domain === domainFilter)
        .sort((first, second) => {
            if (sortBy === "Due date") return first.dueDate.localeCompare(second.dueDate);
            const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
            return rank[first.severity] - rank[second.severity] || first.dueDate.localeCompare(second.dueDate);
        }), [domainFilter, issues, likelihoodFilter, query, severityFilter, sortBy, statusFilter]);

    const openNew = () => { setForm({ ...blankIssue }); setFormError(""); setFormOpen(true); };
    const openEdit = (issue) => { setActiveIssue(null); setForm({ ...issue, likelihood: issue.likelihood || "Possible" }); setFormError(""); setFormOpen(true); };
    const save = (event) => {
        event.preventDefault();
        if (!form.title.trim() || !form.owner.trim() || !form.dueDate || !form.description.trim()) { setFormError("Add a finding, owner, due date, and remediation note."); return; }
        saveIssue({ ...form, title: form.title.trim(), owner: form.owner.trim(), description: form.description.trim() });
        setFormOpen(false);
    };
    const changeStatus = (issue, status) => {
        updateIssue(issue.id, { status });
        if (activeIssue?.id === issue.id) setActiveIssue({ ...issue, status });
    };
    const clearFilters = () => { setQuery(""); setSeverityFilter("All severities"); setLikelihoodFilter("All likelihoods"); setStatusFilter("All statuses"); setDomainFilter("All domains"); setSortBy("Risk priority"); };
    const exportIssues = () => downloadCsv("candor-findings.csv", ["ID", "Finding", "Severity", "Likelihood", "Domain", "Owner", "Due date", "Status", "Control", "Remediation note"], filteredIssues.map((item) => [item.id, item.title, item.severity, item.likelihood, item.domain, item.owner, item.dueDate, item.status, controls.find((control) => control.id === item.controlId)?.name, item.description]));
    const openCount = issues.filter((item) => item.status !== "Closed").length;
    const today = new Date().toISOString().slice(0, 10);
    const overdueCount = issues.filter((item) => item.status !== "Closed" && item.dueDate < today).length;

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div><p className={styles.sectionLabel}>REMEDIATION WORKSPACE</p><h1>Findings and actions</h1><p className={styles.subtitle}>Keep each issue owned, dated, and moving toward a documented resolution.</p></div>
                <div className={styles.headingActions}><button className={styles.exportButton} onClick={exportIssues} type="button"><FiDownload aria-hidden="true" /> Export CSV</button><button className={styles.createButton} onClick={openNew} type="button"><FiPlus aria-hidden="true" /> New finding</button></div>
            </div>

            <section aria-label="Finding summary" className={styles.summary}>
                <div><span>Active findings</span><strong>{openCount}</strong><small>Open, review, or remediation</small></div>
                <div><span>Critical exposure</span><strong className={styles.criticalText}>{issues.filter((item) => item.status !== "Closed" && item.severity === "Critical").length}</strong><small>Requires an owner and plan</small></div>
                <div><span>Past due</span><strong>{overdueCount}</strong><small>Needs a date or update</small></div>
                <div><span>Closed this cycle</span><strong>{issues.filter((item) => item.status === "Closed").length}</strong><small>Recorded in this workspace</small></div>
            </section>

            <section aria-label="Finding filters" className={styles.filters}>
                <label className={styles.search}><FiSearch aria-hidden="true" /><input aria-label="Search findings" onChange={(event) => setQuery(event.target.value)} placeholder="Search finding, owner, or ID" type="search" value={query} /></label>
                <label><span>Impact</span><select onChange={(event) => setSeverityFilter(event.target.value)} value={severityFilter}><option>All severities</option>{severities.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Likelihood</span><select onChange={(event) => setLikelihoodFilter(event.target.value)} value={likelihoodFilter}><option>All likelihoods</option>{likelihoods.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Status</span><select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>All statuses</option>{issueStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Domain</span><select onChange={(event) => setDomainFilter(event.target.value)} value={domainFilter}><option>All domains</option>{controlDomains.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>Sort</span><select onChange={(event) => setSortBy(event.target.value)} value={sortBy}><option>Risk priority</option><option>Due date</option></select></label>
                <button className={styles.clearButton} onClick={clearFilters} type="button">Clear filters</button>
            </section>

            <section aria-label="Remediation findings" className={styles.listPanel}>
                <div className={styles.listHeading}><div><h2>Remediation queue</h2><p>Every item has an impact, a likely path, and an accountable owner.</p></div><span>{filteredIssues.length} findings</span></div>
                <div className={styles.findings}>
                    {filteredIssues.map((issue) => (
                        <article className={styles.finding} key={issue.id}>
                            <div className={styles.findingIdentity}>
                                <span className={`${styles.impact} ${styles[issue.severity.toLowerCase()]}`}><i />{issue.severity}</span>
                                <span className={styles.findingId}>{issue.id}</span>
                                <button className={styles.titleButton} onClick={() => setActiveIssue(issue)} type="button">{issue.title}</button>
                                <p>{issue.domain} <i /> Likelihood: {issue.likelihood || "Possible"}</p>
                            </div>
                            <div className={styles.ownerBlock}><span>OWNER</span><strong>{issue.owner}</strong><small>Due {formatDate(issue.dueDate, { month: "short", day: "numeric" })}</small></div>
                            <label className={styles.statusControl}><span>STATUS</span><select aria-label={`Update status for ${issue.title}`} onChange={(event) => changeStatus(issue, event.target.value)} value={issue.status}>{issueStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                            <div className={styles.rowActions}><button aria-label={`Edit ${issue.title}`} onClick={() => openEdit(issue)} type="button"><FiEdit2 aria-hidden="true" /></button><button aria-label={`Delete ${issue.title}`} onClick={() => setDeleteTarget(issue)} type="button"><FiTrash2 aria-hidden="true" /></button><button aria-label={`Open ${issue.title}`} onClick={() => setActiveIssue(issue)} type="button"><FiArrowUpRight aria-hidden="true" /></button></div>
                        </article>
                    ))}
                    {!filteredIssues.length && <div className={styles.emptyState}><FiSearch aria-hidden="true" /><strong>No findings match these filters.</strong><button onClick={clearFilters} type="button">Clear filters</button></div>}
                </div>
            </section>

            <Dialog description="Add the context, impact, owner, and target date for a corrective action." onClose={() => setFormOpen(false)} open={formOpen} size="wide" title={form.id ? "Edit finding" : "New finding"}>
                <form className={styles.form} onSubmit={save} noValidate>
                    <label className={styles.fullField}><span>Finding title</span><input maxLength="100" onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Describe the control gap" value={form.title} /></label>
                    <label><span>Severity</span><select onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value }))} value={form.severity}>{severities.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Likelihood</span><select onChange={(event) => setForm((current) => ({ ...current, likelihood: event.target.value }))} value={form.likelihood}>{likelihoods.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Domain</span><select onChange={(event) => setForm((current) => ({ ...current, domain: event.target.value }))} value={form.domain}>{controlDomains.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Finding owner</span><input maxLength="48" onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} placeholder="Name" value={form.owner} /></label>
                    <label><span>Target date</span><input onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} type="date" value={form.dueDate} /></label>
                    <label><span>Linked control</span><select onChange={(event) => setForm((current) => ({ ...current, controlId: event.target.value }))} value={form.controlId}><option value="">No linked control</option>{controls.map((control) => <option key={control.id} value={control.id}>{control.id} / {control.name}</option>)}</select></label>
                    {form.id && <label><span>Workflow status</span><select onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}>{issueStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>}
                    <label className={styles.fullField}><span>Remediation note</span><textarea maxLength="300" onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What needs to change, and what proof will confirm it?" rows="3" value={form.description} /></label>
                    {formError && <p className={styles.formError} role="alert">{formError}</p>}
                    <div className={styles.formActions}><button className={styles.cancelButton} data-initial-focus onClick={() => setFormOpen(false)} type="button">Cancel</button><button className={styles.saveButton} type="submit">{form.id ? "Save finding" : "Add finding"}</button></div>
                </form>
            </Dialog>

            <Dialog description={activeIssue ? `${activeIssue.id} / ${activeIssue.domain} / ${activeIssue.severity} impact` : ""} onClose={() => setActiveIssue(null)} open={Boolean(activeIssue)} size="narrow" title={activeIssue?.title || "Finding details"}>
                {activeIssue && <div className={styles.detail}><p className={styles.detailNote}>{activeIssue.description}</p><dl><div><dt>Owner</dt><dd>{activeIssue.owner}</dd></div><div><dt>Target date</dt><dd>{formatDate(activeIssue.dueDate)}</dd></div><div><dt>Likelihood</dt><dd>{activeIssue.likelihood || "Possible"}</dd></div><div><dt>Linked control</dt><dd>{controls.find((item) => item.id === activeIssue.controlId)?.name || "No linked control"}</dd></div></dl><label className={styles.detailStatus}><span>Workflow status</span><select onChange={(event) => changeStatus(activeIssue, event.target.value)} value={activeIssue.status}>{issueStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><div className={styles.detailActions}><button className={styles.cancelButton} data-initial-focus onClick={() => setActiveIssue(null)} type="button">Close</button><button className={styles.saveButton} onClick={() => openEdit(activeIssue)} type="button">Edit finding</button></div></div>}
            </Dialog>

            <ConfirmDialog description={deleteTarget ? `Remove ${deleteTarget.title} (${deleteTarget.id}) from this sample workspace?` : ""} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteIssue(deleteTarget.id); setDeleteTarget(null); }} open={Boolean(deleteTarget)} title="Delete finding?" confirmLabel="Delete finding" />
        </div>
    );
};

export default IssuesPage;