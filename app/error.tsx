"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center"><h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1><p className="mt-4 text-slate-600">Please try again. If the problem continues, contact us.</p><button className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700" onClick={() => reset()}>Try again</button></main>;
}
