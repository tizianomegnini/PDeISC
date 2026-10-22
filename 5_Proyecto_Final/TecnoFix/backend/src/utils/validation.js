export const emailOk = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const requiredText = (value, max=2000) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
export function httpError(status, message) { const e = new Error(message); e.status = status; return e; }
