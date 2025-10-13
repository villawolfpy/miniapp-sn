import Link from "next/link";

import { ALLOWED_TERRITORIES, DEFAULT_TERRITORY } from "@/lib/constants";

const FRAME_ENDPOINT = "/frames/sn";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-6 py-16 text-slate-100" style={{ background: "radial-gradient(circle at top, #0f172a, #020617)" }}>
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold">Mini-app de Stacker News Frames</h1>
        <p className="text-lg text-slate-300">
          Esta mini-app genera un Frame v2 que muestra los últimos posts de un territorio de Stacker News usando su RSS oficial.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6">
        <h2 className="text-2xl font-medium text-slate-100">Cómo probar</h2>
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>
            Copia el endpoint del frame: <code className="rounded bg-slate-800 px-2 py-1 text-sm text-slate-100">{FRAME_ENDPOINT}</code>
          </li>
          <li>
            Desde Warpcaster u otro cliente compatible, crea un cast con el enlace completo: <code className="rounded bg-slate-800 px-2 py-1 text-sm text-slate-100">{`https://tu-dominio${FRAME_ENDPOINT}`}</code>.
          </li>
          <li>
            Interactúa con los botones para navegar posts, abrirlos en Stacker News y cambiar de territorio.
          </li>
        </ol>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6">
        <h2 className="text-2xl font-medium">Territorio por defecto</h2>
        <p className="text-slate-300">
          Si no se indica otro valor, el frame consulta <strong>{DEFAULT_TERRITORY}</strong>. Puedes pasar el parámetro <code className="rounded bg-slate-800 px-2 py-1 text-sm text-slate-100">territory</code> en la URL o seleccionar uno de la lista disponible dentro del propio frame.
        </p>
        <p className="text-slate-400">Sugerencias rápidas: {ALLOWED_TERRITORIES.join(", ")}</p>
      </section>

      <section className="space-y-2 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6">
        <h2 className="text-2xl font-medium">Recursos útiles</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <Link href="https://stacker.news/" className="text-indigo-300 hover:underline">Stacker News</Link>
          </li>
          <li>
            <Link href="https://docs.farcaster.xyz/reference/frames/spec" className="text-indigo-300 hover:underline">Especificación de Frames v2</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
