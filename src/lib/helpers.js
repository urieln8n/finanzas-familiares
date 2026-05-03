export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function getStoredFamilyCode() {
  return localStorage.getItem("family_code_v2") || "FAMILIA-RENDON";
}

export function getWeekRange(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay() || 7;
  const monday = new Date(current);
  monday.setDate(current.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

export function dateInRange(dateString, start, end) {
  const value = new Date(`${dateString}T12:00:00`);
  return value >= start && value <= end;
}

export function percentage(value, total) {
  if (!total || total <= 0) return 0;
  return Math.min(Math.max((value / total) * 100, 0), 100);
}

export function classNames(...items) {
  return items.filter(Boolean).join(" ");
}
