export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getSchemaDescription } from '@/lib/schema-introspection';

export async function GET() {
  try {
    const schema = await getSchemaDescription();
    return NextResponse.json({ ok: true, schema });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'error' }, { status: 500 });
  }
}
