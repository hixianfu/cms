import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1><p className="mt-4 text-slate-600">The page you requested does not exist or is no longer published.</p><Link className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700" href="/zh">Back to home</Link></main>;
}
