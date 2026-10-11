import { useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiCheckCircle, FiClipboard, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../../components/confirmDialog";
import Dialog from "../../components/dialog";
import { frameworks } from "../../data/seed";
import { formatDate } from "../../utils/format";
import styles from "./styles.module.css";

const blankAudit = { name: "", framework: frameworks[0], lead: "", status: "Scheduled", startDate: "2026-10-15", dueDate: "2026-10-31", controls: [], checkedControls: [] };

const AuditsPage = ({ audits, controls, saveAudit, updateAudit, deleteAudit }) => {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [frameworkFilter, setFrameworkFilter] = useState("All frameworks");
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState(blankAudit);
    const [formError, setFormError] = useState("");
    const [activeAudit, setActiveAudit] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filteredAudits = useMemo(() => audits
        .filter((item) => !query.trim() || [item.name, item.id, item.lead].some((value) => value.toLowerCase().includes(query.trim().toLowerCase())))
        .filter((item) => statusFilter === "All statuses" || item.status === statusFilter)
        .filter((item) => frameworkFilter === "All frameworks" || item.framework === frameworkFilter)
        .sort((first, second) => first.dueDate.localeCompare(second.dueDate)), [audits, frameworkFilter, query, statusFilter]);

    const startNew = () => { setForm({ ...blankAudit }); setFormError(""); setFormOpen(true); };
    const startEdit = (audit) => { setActiveAudit(null); setForm({ ...audit, controls: [...audit.controls], checkedControls: [...(audit.checkedControls || [])] }); setFormError(""); setFormOpen(true); };
    const save = (event) => {
        event.preventDefault();
        if (!form.name.trim() || !form.lead.trim() || !form.dueDate) { setFormError("Add an audit name, lead, and due date."); return; }
        if (form.dueDate < form.startDate) { setFormError("The due date must be after the start date."); return; }
        if (!form.controls.length) { setFormError("Add at least one control to the audit scope."); return; }
        const checkedControls = form.id ? form.checkedControls : [];
        const progress = form.id ? form.progress : 0;
        saveAudit({ ...form, name: form.name.trim(), lead: form.lead.trim(), checkedControls, progress });
        setFormOpen(false);
    };
    const toggleScope = (controlId) => setForm((current) => ({ ...current, controls: current.controls.includes(controlId) ? current.controls.filter((item) => item !== controlId) : [...current.controls, controlId] }));
    const toggleEvidence = (audit, controlId) => {
        const previous = audit.checkedControls || [];
        const next = previous.includes(controlId) ? previous.filter((item) => item !== controlId) : [...previous, controlId];
        const progress = audit.controls.length ? Math.round((next.length / audit.controls.length) * 100) : 0;
        setActiveAudit({ ...audit, checkedControls: next, progress });
        updateAudit(audit.id, { checkedControls: next, progress });
    };
    const advance = (audit) => {
        if (audit.status === "Scheduled") updateAudit(audit.id, { status: "In progress" });
        else if (audit.progress === 100) { updateAudit(audit.id, { status: "Complete", progress: 100 }); setActiveAudit(null); }
    };
    const clearFilters = () => { setQuery(""); setStatusFilter("All statuses"); setFrameworkFilter("All frameworks"); };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeading}>
                <div><p className={styles.sectionLabel}>ASSURANCE CALENDAR</p><h1>Audit plans</h1><p className={styles.subtitle}>Plan the review window, assign a lead, and work through evidence by control.</p></div>
                <button className={styles.createButton} onClick={startNew} type="button"><FiPlus aria-hidden="true" /> New audit plan</button>
            </div>

            <section aria-label="Audit plan summary" className={styles.summary}>
                <div><span>Open plans</span><strong>{audits.filter((item) => item.status !== "Complete").length}</strong><small>In progress or scheduled</small></div>
                <div><span>Evidence reviewed</span><strong>{audits.filter((item) => item.status !== "Complete").length ? Math.round(audits.filter((item) => item.status !== "Complete").reduce((sum, item) => sum + item.progress, 0) / audits.filter((item) => item.status !== "Complete").length) : 0}%</strong><small>Average across open plans</small></div>
                <div><span>Controls sampled</span><strong>{new Set(audits.flatMap((item) => item.controls)).size}</strong><small>In an active audit scope</small></div>
                <div><span>Completed</span><strong>{audits.filter((item) => item.status === "Complete").length}</strong><small>Closed this cycle</small></div>
            </section>

            <section aria-label="Filter audit plans" className={styles.filters}>
                <label className={styles.searchField}><span>Search</span><input aria-label="Search audit plans" onChange={(event) => setQuery(event.target.value)} placeholder="Search plans, leads, or IDs" type="search" value={query} /></label>
                <label className={styles.selectField}><span>Plan status</span><select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>All statuses</option>{["Scheduled", "In progress", "Complete"].map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className={styles.selectField}><span>Framework</span><select onChange={(event) => setFrameworkFilter(event.target.value)} value={frameworkFilter}><option>All frameworks</option>{frameworks.map((item) => <option key={item}>{item}</option>)}</select></label>
                <button className={styles.clearButton} onClick={clearFilters} type="button">Clear filters</button>
                <span className={styles.resultCount}>{filteredAudits.length} plans</span>
            </section>

            <section aria-label="Audit plan schedule" className={styles.planList}>
                {filteredAudits.map((audit) => (
                    <article className={styles.planCard} key={audit.id}>
                        <div className={styles.planMain}>
                            <div className={styles.planMeta}><span className={styles.framework}>{audit.framework}</span><span className={`${styles.status} ${styles[audit.status.toLowerCase().replaceAll(" ", "")]}`}><i />{audit.status}</span><small>{audit.id}</small></div>
                            <button className={styles.planTitle} onClick={() => setActiveAudit(audit)} type="button">{audit.name}</button>
                            <p className={styles.planLead}>Lead: <strong>{audit.lead}</strong> <i /> {audit.controls.length} controls in scope</p>
                        </div>
                        <div className={styles.planDates}><span><FiCalendar aria-hidden="true" /> {formatDate(audit.startDate, { month: "short", day: "numeric" })}</span><FiArrowRight aria-hidden="true" /><span>Due {formatDate(audit.dueDate, { month: "short", day: "numeric" })}</span></div>
                        <div className={styles.planProgress}><div className={styles.progressTop}><span>{audit.status === "Scheduled" ? "Ready to begin" : "Evidence reviewed"}</span><strong>{audit.progress}%</strong></div><div aria-label={`${audit.progress}% evidence reviewed`} className={styles.progressTrack} role="progressbar" aria-valuenow={audit.progress} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${audit.progress}%` }} /></div></div>
                        <div className={styles.cardActions}>
                            <button aria-label={`Edit ${audit.name}`} onClick={() => startEdit(audit)} type="button"><FiEdit2 aria-hidden="true" /></button>
                            <button aria-label={`Delete ${audit.name}`} onClick={() => setDeleteTarget(audit)} type="button"><FiTrash2 aria-hidden="true" /></button>
                            <button className={styles.openButton} onClick={() => setActiveAudit(audit)} type="button">Open plan <FiArrowRight aria-hidden="true" /></button>
                        </div>
                    </article>
                ))}
                {!filteredAudits.length && <div className={styles.emptyState}><FiClipboard aria-hidden="true" /><strong>No audit plans match those filters.</strong><button onClick={clearFilters} type="button">Clear filters</button></div>}
            </section>

            <Dialog description="Update the audit window, lead, framework, and control sample." onClose={() => setFormOpen(false)} open={formOpen} size="wide" title={form.id ? "Edit audit plan" : "New audit plan"}>
                <form className={styles.form} onSubmit={save} noValidate>
                    <label className={styles.fullField}><span>Audit plan name</span><input maxLength="90" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Annual access control review" value={form.name} /></label>
                    <label><span>Framework</span><select onChange={(event) => setForm((current) => ({ ...current, framework: event.target.value }))} value={form.framework}>{frameworks.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label><span>Audit lead</span><input maxLength="48" onChange={(event) => setForm((current) => ({ ...current, lead: event.target.value }))} placeholder="Name" value={form.lead} /></label>
                    <label><span>Start date</span><input onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} type="date" value={form.startDate} /></label>
                    <label><span>Due date</span><input onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} type="date" value={form.dueDate} /></label>
                    <fieldset className={styles.scopeField}><legend>Control sample <span>{form.controls.length} selected</span></legend><div className={styles.scopeList}>{controls.map((control) => <label key={control.id}><input checked={form.controls.includes(control.id)} onChange={() => toggleScope(control.id)} type="checkbox" /><span><strong>{control.name}</strong><small>{control.id} / {control.framework}</small></span></label>)}</div></fieldset>
                    {formError && <p className={styles.formError} role="alert">{formError}</p>}
                    <div className={styles.formActions}><button className={styles.cancelButton} data-initial-focus onClick={() => setFormOpen(false)} type="button">Cancel</button><button className={styles.saveButton} type="submit">{form.id ? "Save plan" : "Create plan"}</button></div>
                </form>
            </Dialog>

            <Dialog description={activeAudit ? `${activeAudit.framework} / Led by ${activeAudit.lead}` : ""} onClose={() => setActiveAudit(null)} open={Boolean(activeAudit)} size="wide" title={activeAudit?.name || "Audit plan"}>
                {activeAudit && <div className={styles.detail}>
                    <div className={styles.detailSummary}><span className={styles.framework}>{activeAudit.framework}</span><span className={`${styles.status} ${styles[activeAudit.status.toLowerCase().replaceAll(" ", "")]}`}><i />{activeAudit.status}</span><p>Review window: {formatDate(activeAudit.startDate)} to {formatDate(activeAudit.dueDate)}</p></div>
                    <div className={styles.evidenceHeading}><div><h3>Control evidence review</h3><p>Check each sample when its evidence has been reviewed. Files are not uploaded in this demo.</p></div><strong>{activeAudit.progress}%</strong></div>
                    <div className={styles.evidenceList}>{activeAudit.controls.map((controlId) => { const control = controls.find((item) => item.id === controlId); if (!control) return null; const checked = (activeAudit.checkedControls || []).includes(controlId); return <label className={styles.evidenceRow} key={controlId}><input checked={checked} onChange={() => toggleEvidence(activeAudit, controlId)} type="checkbox" /><span className={checked ? styles.checkedIcon : styles.uncheckedIcon}>{checked && <FiCheckCircle aria-hidden="true" />}</span><span><strong>{control.name}</strong><small>{control.id} / {control.status} / {control.evidence} sample items on file</small></span><span className={`${styles.evidenceStatus} ${checked ? styles.reviewed : ""}`}>{checked ? "Reviewed" : "Needs review"}</span></label>; })}</div>
                    <div className={styles.detailActions}><button className={styles.cancelButton} data-initial-focus onClick={() => setActiveAudit(null)} type="button">Close</button>{activeAudit.status === "Scheduled" && <button className={styles.saveButton} onClick={() => { advance(activeAudit); setActiveAudit({ ...activeAudit, status: "In progress" }); }} type="button">Start audit</button>}{activeAudit.status === "In progress" && <button className={styles.saveButton} disabled={activeAudit.progress < 100} onClick={() => advance(activeAudit)} type="button">Complete audit</button>}</div>
                    {activeAudit.status === "In progress" && activeAudit.progress < 100 && <p className={styles.completeNote}>Review the remaining control evidence before completing this plan.</p>}
                </div>}
            </Dialog>

            <ConfirmDialog description={deleteTarget ? `Remove ${deleteTarget.name} (${deleteTarget.id}) from the audit calendar? This sample plan and its review checklist will be removed.` : ""} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteAudit(deleteTarget.id); setDeleteTarget(null); }} open={Boolean(deleteTarget)} title="Delete audit plan?" confirmLabel="Delete plan" />
        </div>
    );
};

export default AuditsPage;