type Row = Record<string, any>;

export function generateInsights(rows: Row[]) {
  if (!rows?.length) return ["Sin datos para analizar."];
  const cols = Object.keys(rows[0]);
  const count = rows.length;
  const numericCols = cols.filter((c) => rows.every((r) => typeof r[c] === "number"));

  const out: string[] = [`Filas: ${count}. Columnas: ${cols.join(", ")}.`];
  for (const c of numericCols) {
    const vals = rows.map((r) => Number(r[c]));
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    out.push(`Promedio de "${c}": ${avg.toFixed(2)}.`);
  }
  return out;
}

export const basicInsights = generateInsights;
