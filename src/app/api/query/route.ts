export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/db';
import { getSchemaDescription } from '@/lib/schema-introspection';
import { validateReadOnlySQL } from '@/lib/sql-guard';
import { basicInsights } from '@/lib/insights';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractSQL(text: string) {
  // busca ```sql ... ```
  const fence = /```sql\s*([\s\S]*?)```/i.exec(text);
  if (fence?.[1]) return fence[1].trim();
  // o una línea simple
  const inline = text.match(/select[\s\S]*?;?/i);
  return inline ? inline[0].trim() : '';
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ ok: false, error: 'Falta "question"' }, { status: 400 });
    }

    const schema = await getSchemaDescription();

    const prompt = [
      `Eres un analista SQL para PostgreSQL. Responde SOLO con una consulta SQL de lectura.`,
      `Prohibido: INSERT/UPDATE/DELETE/ALTER/DROP/CREATE, múltiples statements o ; encadenados.`,
      `Esquema:\n${schema}`,
      `Pregunta: ${question}`,
      `Devuelve la consulta dentro de un bloque:`,
      `\`\`\`sql\n-- razón breve arriba si ayuda\nSELECT ...\n\`\`\``
    ].join('\n');

    const resp = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      temperature: 0.2,
    });

    const text = resp.output_text ?? '';
    const sql = extractSQL(text);

    if (!sql) {
      return NextResponse.json({ ok: false, error: 'No se pudo extraer SQL del modelo.' }, { status: 400 });
    }

    const guard = validateReadOnlySQL(sql);
    if (!guard.ok) {
      return NextResponse.json({ ok: false, error: guard.reason }, { status: 400 });
    }

    // Ejecuta consulta
    const rows = await prisma.$queryRawUnsafe<any[]>(sql);
    const insights = basicInsights(rows);

    // Evita error "Do not know how to serialize a BigInt"
const safeRows = JSON.parse(
  JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
);

return NextResponse.json({ ok: true, sql, rows: safeRows, insights, raw: text });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'error' }, { status: 500 });
  }
}
