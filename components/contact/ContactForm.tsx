"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/contact-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, sourcePage: `/${locale}/contact` }) });
      if (!response.ok) throw new Error("submit failed");
      formElement.reset();
      setState("success");
      setMessage(locale === "zh" ? "留言已提交，我们会尽快联系你。" : "Your message has been submitted. We will be in touch soon.");
    } catch {
      setState("error");
      setMessage(locale === "zh" ? "提交失败，请稍后重试。" : "Submission failed. Please try again later.");
    }
  }
  return <form className="mt-8 space-y-5" onSubmit={submit}>{["name", "email"].map((field) => <label key={field} className="block text-sm font-medium text-slate-700">{field === "name" ? (locale === "zh" ? "姓名" : "Name") : "Email"}<input name={field} type={field === "email" ? "email" : "text"} required className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2" /></label>)}<label className="block text-sm font-medium text-slate-700">{locale === "zh" ? "留言" : "Message"}<textarea name="message" required rows={5} className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2" /></label><button type="submit" disabled={state === "submitting"} className="rounded-md bg-blue-700 px-5 py-3 font-semibold text-white disabled:cursor-wait disabled:opacity-60">{state === "submitting" ? (locale === "zh" ? "提交中…" : "Sending…") : locale === "zh" ? "发送留言" : "Send message"}</button>{message ? <p role="status" className={state === "error" ? "text-sm text-red-700" : "text-sm text-emerald-700"}>{message}</p> : null}</form>;
}
