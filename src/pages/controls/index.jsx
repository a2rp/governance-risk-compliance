import { useMemo, useState } from "react";
import { FiCalendar, FiDownload, FiEdit2, FiPlus, FiSearch, FiShield, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import { controlDomains, controlStatuses, frameworks } from "../../data/seed";
import { downloadCsv } from "../../utils/downloadCsv";
import { formatDate } from "../../utils/format";
import styles from "./styles.module.css";

const blankControl = { name: "", domain: controlDomains[0], framework: frameworks[0], owner: "", status: "Needs evidence", frequency: "Quarterly", nextReview: "2026-11-01", risk: "Medium", evidence: "0" };

const ControlsPage = ({ controls, saveControl, deleteControl }) => {
    const [query, setQuery] = useState("");
    const [frameworkFilter, setFrameworkFilter] = useState("All frameworks");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [domainFilter, setDomainFilter] = useState("All domains");
    const [sortBy, setSortBy] = useState("Next review");
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState(blankControl);
    const [formError, setFormError] = useState("");
    const [activeControl, setActiveControl] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredControls = useMemo(() => controls
        .filter((control) => !query.trim() || [control.name, control.id, control.owner].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())))
        .filter((control) => frameworkFilter === "All frameworks" || control.framework === frameworkFilter)
        .filter((control) => statusFilter === "All statuses" || control.status === statusFilter)
        .filter((control) => domainFilter === "All domains" || control.domain === domainFilter)
        .sort((first, second) => sortBy === "Name" ? first.name.localeCompare(second.name) : first.nextReview.localeCompare(second.nextReview)),
    [controls, domainFilter, frameworkFilter, query, sortBy, statusFilter]);

    const startNew = () => { setForm({ ...blankControl }); setFormError(""); setFormOpen(true); };
    const startEdit = (control) => { setActiveControl(null); setForm({ ...control, evidence: String(control.evidence) }); setFormError(""); setFormOpen(true); };
    const save = (event) => {
        event.preventDefault();
        if (!form.name.trim() || !form.owner.trim() || !form.nextReview) { setFormError("Add a control name, owner, and next review date."); return; }
        saveControl({ ...form, name: form.name.trim(), owner: form.owner.trim(), evidence: Number(form.evidence || 0) });
        setFormOpen(false);
    };
    const exportControls = () => downloadCsv("candor-controls.csv", ["ID", "Control", "Domain", "Framework", "Owner", "Status", "Frequency", "Next review", "Risk", "Evidence items"], filteredControls.map((item) => [item.id, item.name, item.domain, item.framework, item.owner, item.status, item.frequency, item.nextReview, item.risk, item.evidence]));
    const clearFilters = () => { setQuery(""); setFrameworkFilter("All frameworks"); setStatusFilter("All statuses"); setDomainFilter("All domains"); setSortBy("Next review"); };
    const gaps = controls.filter((item) => item.status !== "Effective").length;

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div><p className={styles.sectionLabel}>CONTROL ASSURANCE</p><h1>Control library</h1><p className={styles.subtitle}>A working register of the safeguards that protect the business.</p></div>
                <div className={styles.headingActions}>
                    <button className={styles.secondaryButton} onClick={exportControls} type="button"><FiDownload aria-hidden="true" /> Export CSV</button>
                    <button className={styles.primaryButton} onClick={startNew} type="button"><FiPlus aria-hidden="true" /> New control</button>
                </div>
            </div>

            <section aria-label="Control summary" className={styles.summary}>
                <div><span>Controls in scope</span><strong>{controls.length}</strong><small>Across {new Set(controls.map((item) => item.domain)).size} domains</small></div>
                <div><span>Effective</span><strong>{controls.filter((item) => item.status === "Effective").length}</strong><small>Operating as expected</small></div>
                <div><span>Evidence gaps</span><strong className={styles.gapNumber}>{gaps}</strong><small>Needs a follow-up this cycle</small></div>
                <div><span>Reviews due soon</span><strong>{controls.filter((item) => new Date(item.nextReview + "T00:00:00") <= new Date("2026-10-31T23:59:59")).length}</strong><small>Scheduled in October</small></div>
            </section>

            <section aria-label="Find and filter controls" className={styles.filterPanel}>
                <label className={styles.searchField}><FiSearch aria-hidden="true" /><input aria-label="Search controls" onChange={(event) => setQuery(event.target.value)} placeholder="Search controls, owners, or IDs" type="search" value={query} /></label>
                <label className={styles.selectField}><span>Framework</span><select onChange={(event) => setFrameworkFilter(event.target.value)} value={frameworkFilter}><option>All frameworks</option>{frameworks.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className={styles.selectField}><span>Status</span><select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>All statuses</option>{controlStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className={styles.selectField}><span>Domain</span><select onChange={(event) => setDomainFilter(event.target.value)} value={domainFilter}><option>All domains</option>{controlDomains.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className={styles.sortField}><span>Sort</span><select onChange={(event) => setSortBy(event.target.value)} value={sortBy}><option>Next review</option><option>Name</option></select></label>
                <button className={styles.clearButton} onClick={clearFilters} type="button">Clear</button>
            </section>

            <section aria-label="Control register" className={styles.register}>
                <div className={styles.registerHeading}><div><h2>Control register</h2><p>Current assurance coverage and next review dates.</p></div><span>{filteredControls.length} of {controls.length} controls</span></div>
                <div className={styles.columnHeading}><span>CONTROL</span><span>FRAMEWORK</span><span>OWNER</span><span>NEXT REVIEW</span><span>STATUS</span><span> </span></div>
                <div className={styles.rows}>
                    {filteredControls.map((control) => (
                        <article className={styles.row} key={control.id}>
                            <button className={styles.controlName} onClick={() => setActiveControl(control)} type="button">
                                <span className={styles.controlMark}><FiShield aria-hidden="true" /></span>
                                <span><strong>{control.name}</strong><small>{control.id} <i /> {control.domain}</small></span>
                            </button>
                            <span className={styles.framework}>{control.framework}</span>
                            <span className={styles.owner}>{control.owner}</span>
                            <span className={styles.reviewDate}><FiCalendar aria-hidden="true" /> {formatDate(control.nextReview, { month: "short", day: "numeric" })}</span>
                            <span className={`${styles.status} ${styles[control.status.toLowerCase().replaceAll(" ", "")]}`}><i />{control.status}</span>
                            <div className={styles.rowActions}>
                                <button aria-label={`Edit ${control.name}`} onClick={() => startEdit(control)} type="button"><FiEdit2 aria-hidden="true" /></button>
                                <button aria-label={`Delete ${control.name}`} onClick={() => setDeleteTarget(control)} type="button"><FiTrash2 aria-hidden="true" /></button>
                            </div>
                        </article>
                    ))}
                    {!filteredControls.length && <div className={styles.emptyState}><FiSearch aria-hidden="true" /><strong>No controls match those filters.</strong><button onClick={clearFilters} type="button">Clear filters</button></div>}
                </div>
            </section>

            <Dialog description={form.id ? "Update the owner, cadence, and assurance record for this control." : "Add a safeguard to the current control register."} onClose={() => setFormOpen(false)} open={formOpen} size="wide" title={form.id ? "Edit control" : "New control"}>
                <form className={styles.form} onSubmit={save} noValidate>
                    <label className={styles.fieldWide}><span>Control name</span><input maxLength="90" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Privileged access review" value={form.name} /></label>
                    <label><span>Domain</span><select onChange={(event) => setForm((current) => ({ ...current, domain: event.target.value }))} value={form.domain}>{controlDomains.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Framework</span><select onChange={(event) => setForm((current) => ({ ...current, framework: event.target.value }))} value={form.framework}>{frameworks.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Control owner</span><input maxLength="50" onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} placeholder="Name" value={form.owner} /></label>
                    <label><span>Review frequency</span><select onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))} value={form.frequency}>{["Monthly", "Quarterly", "Annual", "Per change"].map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Next review</span><input onChange={(event) => setForm((current) => ({ ...current, nextReview: event.target.value }))} type="date" value={form.nextReview} /></label>
                    <label><span>Inherent risk</span><select onChange={(event) => setForm((current) => ({ ...current, risk: event.target.value }))} value={form.risk}>{["Critical", "High", "Medium", "Low"].map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Evidence items on file</span><input min="0" onChange={(event) => setForm((current) => ({ ...current, evidence: event.target.value }))} type="number" value={form.evidence} /></label>
                    <label><span>Assurance status</span><select onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}>{controlStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                    {formError && <p className={styles.formError} role="alert">{formError}</p>}
                    <div className={styles.formActions}><button className={styles.cancelButton} data-initial-focus onClick={() => setFormOpen(false)} type="button">Cancel</button><button className={styles.saveButton} type="submit">{form.id ? "Save control" : "Add control"}</button></div>
                </form>
            </Dialog>

            <Dialog description={activeControl ? `${activeControl.framework} / ${activeControl.domain}` : ""} onClose={() => setActiveControl(null)} open={Boolean(activeControl)} size="narrow" title={activeControl?.name || "Control details"}>
                {activeControl && <div className={styles.detailContent}><p>{activeControl.id} <span /> {activeControl.frequency} review</p><dl><div><dt>Owner</dt><dd>{activeControl.owner}</dd></div><div><dt>Next review</dt><dd>{formatDate(activeControl.nextReview)}</dd></div><div><dt>Evidence items</dt><dd>{activeControl.evidence}</dd></div><div><dt>Inherent risk</dt><dd>{activeControl.risk}</dd></div><div><dt>Status</dt><dd>{activeControl.status}</dd></div></dl><div className={styles.detailActions}><button className={styles.cancelButton} data-initial-focus onClick={() => setActiveControl(null)} type="button">Close</button><button className={styles.saveButton} onClick={() => startEdit(activeControl)} type="button">Edit control</button></div></div>}
            </Dialog>

            <ConfirmDialog description={deleteTarget ? `Remove ${deleteTarget.name} (${deleteTarget.id}) from the registry? Linked audit scope and finding references will be cleared.` : ""} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteControl(deleteTarget.id); setDeleteTarget(null); }} open={Boolean(deleteTarget)} title="Delete control?" confirmLabel="Delete control" />
        </div>
    );
};

export default ControlsPage;