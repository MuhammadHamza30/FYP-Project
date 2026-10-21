export function readSession(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
}
export function roleOf(user) {
  return (
    ["Player", "Trainer", "Doctor"]
      .find((role) => user?.occupation === role)
      ?.toLowerCase() || null
  );
}
export function dashboardFor(user) {
  return roleOf(user) ? `/${roleOf(user)}/dashboard` : "/login";
}
export function publicUser(record) {
  if (!record) return null;
  const { password, confirmPassword, ...profile } = record;
  return profile;
}
export function ageFromDate(value, today = new Date()) {
  const birthday = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(birthday.getTime()) || birthday > today) return "";
  let age = today.getFullYear() - birthday.getFullYear();
  if (
    today.getMonth() < birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() < birthday.getDate())
  )
    age--;
  return String(age);
}
