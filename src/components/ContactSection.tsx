"use client";

import React, { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { motion } from "motion/react";
import Magnet from "@/components/reactbits/Magnet";
import {
  EnvelopeSimple,
  WhatsappLogo,
  Copy,
  Check,
  ArrowUpRight,
  PaperPlaneTilt,
  WarningCircle,
  DownloadSimple,
} from "@phosphor-icons/react";
import { PERSONAL_INFO } from "@/data/portfolioData";

type Status = "idle" | "sending" | "sent" | "error";

// Web3Forms delivers submissions to syafikbarda60@gmail.com. The key is public
// by design: it is scoped to that one destination, so it ships in the bundle.
const ACCESS_KEY = "3d600fb3-437a-46a1-8d64-0ba705b61300";

export function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked. The address is visible and selectable beside the
      // button, so nothing is lost.
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio enquiry from ${name}`,
          from_name: name,
          email,
          message,
          botcheck: "",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
    dialogRef.current?.showModal();
  };

  const fieldClass =
    "w-full border-0 border-b border-line-strong bg-transparent px-0 py-4 text-base text-fg placeholder-fg-3 transition-colors duration-300 focus:border-accent focus:outline-none";

  return (
    <section id="contact" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal distance={48}>
          <h2 className="type-display max-w-[14ch] text-[clamp(2.6rem,6.5vw,5.25rem)] text-fg">
            Get in touch
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12">
          <Reveal distance={36} className="lg:col-span-5">
            <div>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="group flex items-center justify-between gap-4 border-t border-line py-6"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <EnvelopeSimple
                    size={20}
                    weight="light"
                    className="shrink-0 text-fg-3 transition-colors group-hover:text-accent-text"
                  />
                  <span className="truncate text-[15px] text-fg">
                    {PERSONAL_INFO.email}
                  </span>
                </span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="pill -mt-2 mb-6 inline-flex min-h-11 cursor-pointer items-center gap-2 border border-line px-4 text-[13px] text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
              >
                {copied ? (
                  <>
                    <Check size={14} weight="bold" className="text-accent-text" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} weight="light" />
                    Copy address
                  </>
                )}
              </button>

              <a
                href={PERSONAL_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 border-y border-line py-6"
              >
                <span className="flex items-center gap-4">
                  <WhatsappLogo
                    size={20}
                    weight="light"
                    className="shrink-0 text-fg-3 transition-colors group-hover:text-accent-text"
                  />
                  <span className="text-[15px] text-fg">{PERSONAL_INFO.phone}</span>
                </span>
                <ArrowUpRight
                  size={18}
                  weight="light"
                  className="text-fg-3 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-text"
                />
              </a>

              <a
                href="/Syafik_Barda_CV.pdf"
                download="Syafik_Barda_CV.pdf"
                className="group flex items-center justify-between gap-4 border-b border-line py-6"
              >
                <span className="flex items-center gap-4">
                  <DownloadSimple
                    size={20}
                    weight="light"
                    className="shrink-0 text-fg-3 transition-colors group-hover:text-accent-text"
                  />
                  <span className="text-[15px] text-fg">Download CV (PDF)</span>
                </span>
                <ArrowUpRight
                  size={18}
                  weight="light"
                  className="text-fg-3 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-text"
                />
              </a>

              <p className="mt-8 max-w-sm text-sm leading-relaxed text-fg-2">
                Based in Semarang, Central Java. Open to internships, remote or on
                site. I reply within a day.
              </p>
            </div>
          </Reveal>

          <Reveal distance={36} delay={0.08} className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="grid gap-10">
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1 block text-[13px] font-medium text-fg-2"
                >
                  Your name or organisation
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="Your name, and where you work"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1 block text-[13px] font-medium text-fg-2"
                >
                  Your email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1 block text-[13px] font-medium text-fg-2"
                >
                  What are you building
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="The role, the systems involved, or the problem you want solved."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Magnet padding={70} magnetStrength={5}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={status === "sending"}
                    className="pill group inline-flex min-h-11 cursor-pointer items-center gap-2.5 bg-fg px-8 py-4 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending" : "Send message"}
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </motion.button>
                </Magnet>

                <p
                  role="status"
                  aria-live="polite"
                  className="max-w-[24ch] text-[13px] leading-relaxed text-fg-3"
                >
                  {status === "sent"
                    ? "Message sent. Thank you."
                    : status === "error"
                      ? "That did not go through. Email or WhatsApp me directly instead."
                      : "Goes straight to my inbox."}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>

      {/* Clicking the backdrop lands on the dialog element itself, which is how
          this closes on outside click without a listener on the document. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[min(30rem,calc(100vw-2rem))] border border-line bg-surface p-0 text-fg"
      >
        <div className="flex flex-col items-start gap-5 p-8 sm:p-10">
          {status === "sent" ? (
            <PaperPlaneTilt size={30} weight="light" className="text-accent-text" />
          ) : (
            <WarningCircle size={30} weight="light" className="text-accent-text" />
          )}

          <h3 id="contact-dialog-title" className="type-display text-3xl text-fg">
            {status === "sent" ? "Message sent" : "That did not send"}
          </h3>

          <p className="max-w-[38ch] text-sm leading-relaxed text-fg-2">
            {status === "sent"
              ? "It landed in my inbox. Expect a reply within a day."
              : "Something broke on the way. Email or WhatsApp me directly instead."}
          </p>

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="pill mt-2 inline-flex min-h-11 cursor-pointer items-center bg-fg px-7 py-3 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
          >
            Close
          </button>
        </div>
      </dialog>
    </section>
  );
}
