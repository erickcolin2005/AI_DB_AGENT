import prisma from "./db";

export async function getSchemaOverview() {
  const tables = await prisma.$queryRawUnsafe<any[]>(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  const columns = await prisma.$queryRawUnsafe<any[]>(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `);

  const byTable: Record<string, { columns: { name: string; type: string }[] }> = {};
  for (const t of tables) byTable[t.table_name] = { columns: [] };
  for (const c of columns) {
    (byTable[c.table_name] ??= { columns: [] }).columns.push({
      name: c.column_name,
      type: c.data_type,
    });
  }
  return byTable;
}

/**
 * Devuelve un string “descriptivo” del esquema para guiar al LLM.
 */
export async function getSchemaDescription() {
  const schema = await getSchemaOverview();
  const lines: string[] = [];
  for (const [table, meta] of Object.entries(schema)) {
    const cols = meta.columns.map((c) => `${c.name}:${c.type}`).join(", ");
    lines.push(`- ${table}(${cols})`);
  }
  return lines.join("\n");
}

