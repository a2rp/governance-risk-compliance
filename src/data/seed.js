export const frameworks = ["SOC 2", "ISO 27001", "PCI DSS", "Privacy"];

export const controlDomains = [
    "Access management",
    "Data protection",
    "Resilience",
    "Vendor oversight",
    "People and policy",
    "Change management",
];

export const controlStatuses = ["Effective", "Needs evidence", "At risk"];

export const issueStatuses = ["Open", "In review", "Remediating", "Closed"];

export const seedControls = [
    { id: "CTL-104", name: "Quarterly access recertification", domain: "Access management", framework: "SOC 2", owner: "Marcus Lee", status: "Effective", frequency: "Quarterly", nextReview: "2026-10-18", risk: "High", evidence: 4 },
    { id: "CTL-118", name: "Encryption key rotation", domain: "Data protection", framework: "ISO 27001", owner: "Priya Nair", status: "Needs evidence", frequency: "Quarterly", nextReview: "2026-10-14", risk: "Critical", evidence: 2 },
    { id: "CTL-126", name: "Production backup recovery test", domain: "Resilience", framework: "SOC 2", owner: "Daniel Wu", status: "At risk", frequency: "Monthly", nextReview: "2026-10-12", risk: "Critical", evidence: 1 },
    { id: "CTL-143", name: "Subprocessor security review", domain: "Vendor oversight", framework: "Privacy", owner: "Elena Garcia", status: "Needs evidence", frequency: "Annual", nextReview: "2026-10-22", risk: "High", evidence: 3 },
    { id: "CTL-151", name: "Security awareness completion", domain: "People and policy", framework: "ISO 27001", owner: "Mina Patel", status: "Effective", frequency: "Annual", nextReview: "2026-11-03", risk: "Medium", evidence: 5 },
    { id: "CTL-166", name: "Change approval and release log", domain: "Change management", framework: "SOC 2", owner: "Jonah Reed", status: "Effective", frequency: "Per change", nextReview: "2026-10-25", risk: "Medium", evidence: 4 },
    { id: "CTL-179", name: "Cardholder data access review", domain: "Access management", framework: "PCI DSS", owner: "Marcus Lee", status: "At risk", frequency: "Quarterly", nextReview: "2026-10-16", risk: "High", evidence: 2 },
    { id: "CTL-184", name: "Customer data retention schedule", domain: "Data protection", framework: "Privacy", owner: "Elena Garcia", status: "Effective", frequency: "Annual", nextReview: "2026-11-08", risk: "Medium", evidence: 3 },
];

export const seedAudits = [
    { id: "AUD-026", name: "SOC 2 operating effectiveness", framework: "SOC 2", lead: "Nora Bennett", status: "In progress", startDate: "2026-09-21", dueDate: "2026-10-20", controls: ["CTL-104", "CTL-118", "CTL-126", "CTL-166"], progress: 68 },
    { id: "AUD-031", name: "PCI DSS quarterly review", framework: "PCI DSS", lead: "Theo Martin", status: "Scheduled", startDate: "2026-10-15", dueDate: "2026-10-29", controls: ["CTL-179", "CTL-104"], progress: 0 },
    { id: "AUD-019", name: "Subprocessor privacy assessment", framework: "Privacy", lead: "Amara Okafor", status: "In progress", startDate: "2026-10-01", dueDate: "2026-10-24", controls: ["CTL-143", "CTL-184"], progress: 42 },
    { id: "AUD-014", name: "ISO 27001 internal audit", framework: "ISO 27001", lead: "Nora Bennett", status: "Complete", startDate: "2026-08-08", dueDate: "2026-09-18", controls: ["CTL-151", "CTL-118"], progress: 100 },
];

export const seedIssues = [
    { id: "FND-284", title: "Recovery evidence missing from latest failover test", severity: "Critical", domain: "Resilience", owner: "Daniel Wu", dueDate: "2026-10-13", status: "Remediating", controlId: "CTL-126", description: "The recovery runbook was not attached to the latest production restore exercise." },
    { id: "FND-279", title: "Key rotation approval trail incomplete", severity: "High", domain: "Data protection", owner: "Priya Nair", dueDate: "2026-10-16", status: "In review", controlId: "CTL-118", description: "The previous rotation is complete, but the approval record is missing from the evidence set." },
    { id: "FND-271", title: "Two dormant administrator accounts remain active", severity: "High", domain: "Access management", owner: "Marcus Lee", dueDate: "2026-10-18", status: "Open", controlId: "CTL-179", description: "The quarterly review flagged accounts that have not been used in more than 90 days." },
    { id: "FND-263", title: "Subprocessor review needs updated DPA", severity: "Medium", domain: "Vendor oversight", owner: "Elena Garcia", dueDate: "2026-10-25", status: "Open", controlId: "CTL-143", description: "One vendor has not returned the current data processing addendum." },
    { id: "FND-251", title: "Release ticket missing rollback confirmation", severity: "Medium", domain: "Change management", owner: "Jonah Reed", dueDate: "2026-10-28", status: "In review", controlId: "CTL-166", description: "The release record has approval but does not document a rollback check." },
    { id: "FND-244", title: "Annual awareness evidence not linked to roster", severity: "Low", domain: "People and policy", owner: "Mina Patel", dueDate: "2026-11-02", status: "Closed", controlId: "CTL-151", description: "Training completion is confirmed and now linked to the active employee roster." },
];
