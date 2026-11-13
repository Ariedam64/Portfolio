"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, RotateCcw, Square, X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/app/lib/chat/catalog";
import { LIMITS } from "@/app/lib/chat/protocol";
import { ContactLinks, Markdown, MetricTiles, ProjectCards, Suggestions } from "./ChatParts";
import { useChatSession, type DisplayMessage } from "./useChatSession";

import AVATAR from "@/public/img/avatar.png";

export default function ChatWidget() {
  const { t, i18n } = useTranslation("common");
  const locale: Locale = i18n.language?.startsWith("en") ? "en" : "fr";
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, streaming, limitReached, send, stop, reset, retry } = useChatSession();

  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);

  const refocusLauncher = useRef(false);

  const close = useCallback(() => {
    refocusLauncher.current = true;
    setOpen(false);
  }, []);

  // Échap ferme le panneau.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Sur mobile, la bulle recouvre le bas du contenu (boutons, texte) pendant la
  // lecture : on la range quand le visiteur descend, et elle revient dès qu'il
  // remonte, ou en bas de page où il n'y a plus rien à cacher.
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (!mobile.matches || y < 120 || nearBottom) setTucked(false);
      else if (y > lastY + 6) setTucked(true);
      else if (y < lastY - 6) setTucked(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // À l'ouverture, focus sur la saisie ; à la fermeture, retour sur le bouton.
  useEffect(() => {
    if (open) input.current?.focus();
    else if (refocusLauncher.current) {
      refocusLauncher.current = false;
      launcher.current?.focus();
    }
  }, [open]);

  // Suit le bas de la conversation, sauf si le visiteur a remonté pour relire.
  // On ne descend jamais plus bas que la dernière question : une réponse plus
  // haute que la fenêtre se lit depuis son début, sans avoir à remonter.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || !stickToBottom.current) return;
    const bottom = el.scrollHeight - el.clientHeight;
    const anchor = el.querySelector<HTMLElement>("[data-anchor]");
    el.scrollTop = anchor ? Math.min(bottom, anchor.offsetTop - 16) : bottom;
  }, [messages, open]);

  const onScroll = () => {
    const el = scroller.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  // La zone de saisie grandit avec le texte, jusqu'à 5 lignes environ.
  useLayoutEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft, open]);

  const submit = (text: string) => {
    if (!text.trim() || streaming || limitReached) return;
    stickToBottom.current = true;
    setDraft("");
    void send(text);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(draft);
    }
  };

  const starters = (t("chat.starters", { returnObjects: true }) as string[]) ?? [];
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const lastUserId = [...messages].reverse().find((m) => m.role === "user")?.id;
  const cardLabels = { viewProject: t("chat.viewProject"), github: t("chat.github"), site: t("chat.site") };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcher}
            key="launcher"
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("chat.open")}
            aria-expanded={false}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={tucked ? { opacity: 0, y: reduceMotion ? 0 : 80 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            tabIndex={tucked ? -1 : undefined}
            aria-hidden={tucked || undefined}
            style={{ pointerEvents: tucked ? "none" : undefined }}
            className="fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-full border border-[#3a2f4c] bg-[#121016]/90 p-1.5 pr-1.5 text-[#ece9f1] shadow-[0_12px_40px_-12px_rgba(139,92,246,0.55)] backdrop-blur-md transition-colors hover:border-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] cursor-pointer sm:pr-4"
          >
            <span className="relative">
              <Image src={AVATAR} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#121016] bg-emerald-400" />
            </span>
            <span className="hidden font-[family-name:var(--font-comfortaa)] text-sm font-bold sm:inline">{t("chat.launcher")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label={t("chat.title")}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#121016] font-sans text-[#ece9f1] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(660px,calc(100dvh-2.5rem))] sm:w-[420px] sm:rounded-2xl sm:border sm:border-[#3a2f4c] sm:shadow-[0_24px_80px_-20px_rgba(139,92,246,0.45)]"
          >
            <header className="flex items-center gap-3 border-b border-[#2a2335] px-4 py-3">
              <Image src={AVATAR} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className="font-[family-name:var(--font-comfortaa)] text-[15px] font-bold leading-tight text-white">{t("chat.title")}</h2>
                <p className="truncate text-xs text-[#a49fb0]">{t("chat.subtitle")}</p>
              </div>
              {messages.length > 0 && (
                <IconButton label={t("chat.reset")} onClick={reset}>
                  <RotateCcw className="size-4" />
                </IconButton>
              )}
              <IconButton label={t("chat.close")} onClick={close}>
                <X className="size-5" />
              </IconButton>
            </header>

            <div
              ref={scroller}
              onScroll={onScroll}
              className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:#3a2f4c_transparent] [scrollbar-width:thin]"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <div className="flex min-h-full flex-col justify-end">
                  <p className="text-[15px] leading-relaxed text-[#ece9f1]">{t("chat.greeting")}</p>
                  <Suggestions questions={starters} onPick={submit} />
                </div>
              ) : (
                <ol className="space-y-5">
                  {messages.map((m) => (
                    <li key={m.id} data-anchor={m.id === lastUserId ? "" : undefined}>
                      {m.role === "user" ? (
                        <UserBubble message={m} />
                      ) : (
                        <AssistantMessage
                          message={m}
                          locale={locale}
                          isLast={m.id === lastAssistantId}
                          busy={streaming}
                          cardLabels={cardLabels}
                          onPick={submit}
                          onRetry={() => retry(m.id)}
                          t={t}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <footer className="border-t border-[#2a2335] px-3 pb-3 pt-2.5">
              {limitReached ? (
                <button
                  type="button"
                  onClick={reset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7c4ef0] cursor-pointer"
                >
                  <RotateCcw className="size-4" />
                  {t("chat.reset")}
                </button>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="flex items-end gap-2 rounded-xl border border-[#3a2f4c] bg-[#1c1824] p-1.5 pl-3 transition-colors focus-within:border-[#8b5cf6]"
                >
                  <textarea
                    ref={input}
                    rows={1}
                    value={draft}
                    maxLength={LIMITS.messageChars}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={t("chat.placeholder")}
                    aria-label={t("chat.placeholder")}
                    className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-base leading-6 sm:text-[15px] text-[#ece9f1] outline-none placeholder:text-[#7d778a]"
                  />
                  {streaming ? (
                    <SendButton label={t("chat.stop")} onClick={stop} type="button">
                      <Square className="size-3.5 fill-current" />
                    </SendButton>
                  ) : (
                    <SendButton label={t("chat.send")} type="submit" disabled={!draft.trim()}>
                      <ArrowUp className="size-4" />
                    </SendButton>
                  )}
                </form>
              )}
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-lg text-[#a49fb0] transition-colors hover:bg-[#2a2335] hover:text-white focus-visible:outline-2 focus-visible:outline-[#8b5cf6] cursor-pointer"
    >
      {children}
    </button>
  );
}

function SendButton({
  label,
  children,
  ...props
}: { label: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#8b5cf6] text-white transition-colors hover:bg-[#7c4ef0] disabled:bg-[#2a2335] disabled:text-[#7d778a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] cursor-pointer disabled:cursor-default"
    >
      {children}
    </button>
  );
}

function UserBubble({ message }: { message: DisplayMessage }) {
  const text = message.parts[0]?.kind === "text" ? message.parts[0].text : "";
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-[#8b5cf6] px-3.5 py-2 text-[15px] leading-relaxed text-white">
        {text}
      </p>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-pulse rounded-full bg-[#a49fb0]"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

function AssistantMessage({
  message,
  locale,
  isLast,
  busy,
  cardLabels,
  onPick,
  onRetry,
  t,
}: {
  message: DisplayMessage;
  locale: Locale;
  isLast: boolean;
  busy: boolean;
  cardLabels: { viewProject: string; github: string; site: string };
  onPick: (q: string) => void;
  onRetry: () => void;
  t: (key: string) => string;
}) {
  // Le modèle appelle ses outils avant d'écrire sa réponse. Les cartes et les
  // relances attendent donc la fin du texte, puis s'affichent dessous : le
  // texte ne les repousse pas pendant qu'il s'écrit.
  const rank = { text: 0, projects: 1, metrics: 2, contact: 3, suggestions: 4 } as const;
  const parts = [...message.parts]
    .filter((p) => !message.pending || p.kind === "text")
    .sort((a, b) => rank[a.kind] - rank[b.kind]);
  const waiting = message.pending && parts.length === 0;
  return (
    <div className="max-w-full text-[15px] leading-relaxed text-[#e4e0ea]">
      {waiting && <TypingDots />}
      {parts.map((part, i) => {
        switch (part.kind) {
          case "text":
            return <Markdown key={i} text={part.text} />;
          case "projects":
            return <ProjectCards key={i} ids={part.ids} locale={locale} labels={cardLabels} />;
          case "metrics":
            return <MetricTiles key={i} ids={part.ids} locale={locale} />;
          case "contact":
            return <ContactLinks key={i} locale={locale} />;
          case "suggestions":
            // Les relances ne restent cliquables que sous la dernière réponse.
            return isLast && !message.pending ? (
              <Suggestions key={i} questions={part.questions} onPick={onPick} disabled={busy} />
            ) : null;
        }
      })}
      {message.interrupted && <p className="mt-2 text-xs text-[#7d778a]">{t("chat.interrupted")}</p>}
      {message.error && (
        <div className="mt-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
          <p>{t(`chat.errors.${message.error}`)}</p>
          {message.retryText && isLast && !["conversation_limit", "message_too_long", "refused"].includes(message.error) && (
            <button
              type="button"
              onClick={onRetry}
              disabled={busy}
              className="mt-1.5 text-sm font-medium text-white underline underline-offset-2 hover:text-rose-200 disabled:opacity-50 cursor-pointer"
            >
              {t("chat.retry")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
