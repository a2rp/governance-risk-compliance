import { useState } from "react";
import { nextRecordId } from "../utils/format";
import { seedAudits, seedControls, seedIssues } from "../data/seed";

const useGrcState = (notify) => {
    const [controls, setControls] = useState(seedControls);
    const [audits, setAudits] = useState(seedAudits);
    const [issues, setIssues] = useState(seedIssues);

    const saveControl = (record) => {
        if (record.id) {
            setControls((current) => current.map((item) => item.id === record.id ? { ...item, ...record } : item));
            notify("Control details updated.");
            return;
        }
        const created = { ...record, id: nextRecordId("CTL", controls), evidence: Number(record.evidence || 0) };
        setControls((current) => [created, ...current]);
        notify("Control added to the registry.");
    };

    const deleteControl = (id) => {
        const control = controls.find((item) => item.id === id);
        setControls((current) => current.filter((item) => item.id !== id));
        setAudits((current) => current.map((audit) => ({ ...audit, controls: audit.controls.filter((controlId) => controlId !== id) })));
        setIssues((current) => current.map((issue) => issue.controlId === id ? { ...issue, controlId: "" } : issue));
        notify((control?.name || "Control") + " removed from the sample registry.");
    };

    const saveAudit = (record) => {
        if (record.id) {
            setAudits((current) => current.map((item) => item.id === record.id ? { ...item, ...record } : item));
            notify("Audit plan updated.");
            return;
        }
        const created = { ...record, id: nextRecordId("AUD", audits), progress: 0 };
        setAudits((current) => [created, ...current]);
        notify("Audit plan added to the calendar.");
    };

    const updateAudit = (id, changes) => {
        setAudits((current) => current.map((item) => {
            if (item.id !== id) return item;
            const next = { ...item, ...changes };
            if (next.status === "Complete") next.progress = 100;
            if (next.status === "In progress" && next.progress === 0) next.progress = 12;
            return next;
        }));
        notify("Audit plan status updated.");
    };

    const deleteAudit = (id) => {
        setAudits((current) => current.filter((item) => item.id !== id));
        notify("Audit plan removed.");
    };

    const saveIssue = (record) => {
        if (record.id) {
            setIssues((current) => current.map((item) => item.id === record.id ? { ...item, ...record } : item));
            notify("Finding details updated.");
            return;
        }
        const created = { ...record, id: nextRecordId("FND", issues), status: "Open" };
        setIssues((current) => [created, ...current]);
        notify("Finding added to the remediation queue.");
    };

    const updateIssue = (id, changes) => {
        setIssues((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
        notify("Finding status updated.");
    };

    const deleteIssue = (id) => {
        setIssues((current) => current.filter((item) => item.id !== id));
        notify("Finding removed from the sample workspace.");
    };

    return { controls, audits, issues, saveControl, deleteControl, saveAudit, updateAudit, deleteAudit, saveIssue, updateIssue, deleteIssue };
};

export default useGrcState;