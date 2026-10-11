export const formatDate = (value, options = { month: "short", day: "numeric", year: "numeric" }) => {
    if (!value) return "Not set";
    return new Intl.DateTimeFormat("en-US", options).format(new Date(value + "T12:00:00"));
};

export const daysUntil = (value) => {
    const target = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / 86400000);
};

export const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export const nextRecordId = (prefix, records) => {
    const highest = records.reduce((current, item) => {
        const value = Number(item.id.replace(prefix + "-", ""));
        return Number.isFinite(value) ? Math.max(current, value) : current;
    }, 0);
    return prefix + "-" + String(highest + 1).padStart(3, "0");
};
