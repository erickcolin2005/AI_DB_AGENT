export function isSafeSql(sql: string) {
  const s = (sql || "").toLowerCase();
  const banned = ["drop ", "truncate ", "alter ", "insert ", "update ", "delete ", "grant ", "revoke ", "create "];
  if (banned.some((k) => s.includes(k))) return false;
  if (s.split(";").length > 2) return false; // evita múltiples statements
  return true;
}

export function validateReadOnlySQL(sql: string) {
  const ok = isSafeSql(sql);
  return ok
    ? { ok: true as const }
    : { ok: false as const, reason: "Solo se permiten consultas de lectura (bloqueados DDL/DML y múltiples statements)." };
}
