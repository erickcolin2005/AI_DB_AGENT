'use client'
import { useMemo, useRef, useState } from 'react'

export default function Home() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [sql, setSql] = useState<string>('')
  const [rows, setRows] = useState<any[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [raw, setRaw] = useState<string>('')

  const columns = useMemo(() => (rows?.[0] ? Object.keys(rows[0]) : []), [rows])
  const resultRef = useRef<HTMLDivElement | null>(null)

  async function onAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!q) return
    setLoading(true); setError(''); setSql(''); setRows([]); setInsights([]); setRaw('')
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Error')
      setSql(data.sql)
      setRows(data.rows || [])
      setInsights(data.insights || [])
      setRaw(data.raw || '')
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="app">
      <div className="hero">
        <div className="hero__glow" />
        <h1>AI DB Agent</h1>
        <p>Haz preguntas en español. Genera <b>SQL de solo lectura</b>, ejecuta y te da <b>insights</b>.</p>
      </div>

      <section className="card">
        <form onSubmit={onAsk} className="ask">
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="¿Ventas por producto en agosto?"
            rows={3}
          />
          <div className="ask__actions">
            <button disabled={loading || !q} className="btn">
              {loading ? 'Consultando…' : 'Consultar'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert--error">{error}</div>}

        {sql && (
          <div className="block" ref={resultRef}>
            <div className="block__header">
              <span>SQL generado</span>
              <div className="block__actions">
                <button className="btn btn--ghost" onClick={() => copy(sql)}>Copiar</button>
              </div>
            </div>
            <pre className="code"><code>{sql}</code></pre>
          </div>
        )}

        {!!rows.length && (
          <div className="block">
            <div className="block__header">
              <span>Resultados</span>
              <span className="muted">{rows.length} filas</span>
            </div>
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {columns.map((c) => <td key={c}>{String(r[c])}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!!insights.length && (
          <div className="block">
            <div className="block__header"><span>Insights</span></div>
            <ul className="insights">
              {insights.map((x, i) => <li key={i}>⚡ {x}</li>)}
            </ul>
          </div>
        )}

        {raw && (
          <details className="block">
            <summary className="block__header">Trazas del modelo</summary>
            <pre className="code code--dim"><code>{raw}</code></pre>
          </details>
        )}
      </section>

      <footer className="foot">Hecho con Next.js + Prisma + Postgres · {new Date().getFullYear()}</footer>
    </main>
  )
}