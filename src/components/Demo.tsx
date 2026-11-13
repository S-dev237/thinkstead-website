import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CircleCheck, FileText, Hand, LoaderCircle, RotateCcw } from "lucide-react";
import type { copy, Locale } from "../data/content";
import { scenarios } from "../data/demo";
import { usePrefersReducedMotion } from "../hooks";

type T = (typeof copy)[Locale];
type Phase = "idle" | "running" | "approval" | "done" | "declined";

/**
 * The simulation: an instruction, its plan worked through step by step, then a
 * stop at the approval. Focus moves to the decision when it is needed and to
 * the result once it exists, and every change is announced, so it works the
 * same with a keyboard or a screen reader as with a mouse.
 */
export function Demo({ t, locale }: { t: T; locale: Locale }) {
  const list = scenarios[locale];
  const [id, setId] = useState(list[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [completed, setCompleted] = useState(0);
  const run = useRef(0);
  const approveRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const scenario = list.find((s) => s.id === id) ?? list[0];

  const reset = () => {
    run.current += 1;
    setPhase("idle");
    setCompleted(0);
  };

  // A language switch keeps the chosen scenario but restarts it in the new language.
  useEffect(reset, [locale]);

  const choose = (next: string) => {
    setId(next);
    reset();
  };

  const start = async () => {
    const token = ++run.current;
    setPhase("running");
    setCompleted(0);
    const pace = reduced ? 120 : 750;
    for (let i = 0; i < scenario.steps.length; i++) {
      await new Promise((r) => setTimeout(r, pace));
      if (token !== run.current) return;
      setCompleted(i + 1);
    }
    await new Promise((r) => setTimeout(r, reduced ? 60 : 350));
    if (token !== run.current) return;
    setPhase("approval");
  };

  useEffect(() => {
    if (phase === "approval") approveRef.current?.focus();
    if (phase === "done" || phase === "declined") resultRef.current?.focus();
  }, [phase]);

  const status =
    phase === "idle"
      ? t.demo.ready
      : phase === "running"
        ? t.demo.running
        : phase === "approval"
          ? `${t.demo.waiting}: ${scenario.approval.action}`
          : phase === "done"
            ? `${t.demo.doneLabel}: ${scenario.done.title}`
            : t.demo.declined;

  return (
    <section className="demo" id="demo" aria-labelledby="demo-title">
      <div className="container demo-layout">
        <div className="demo-intro" data-reveal>
          <p className="kicker">{t.demo.kicker}</p>
          <h2 id="demo-title">{t.demo.title}</h2>
          <p className="lede">{t.demo.lead}</p>
          <fieldset className="demo-choices">
            <legend>{t.demo.choose}</legend>
            {list.map((s) => (
              <label key={s.id} className={`demo-choice${s.id === id ? " is-active" : ""}`}>
                <input type="radio" name="demo-scenario" value={s.id} checked={s.id === id} onChange={() => choose(s.id)} />
                <span>{s.label}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </label>
            ))}
          </fieldset>
          <p className="demo-note">{t.demo.note}</p>
        </div>

        <div className="demo-panel" data-reveal>
          <div className="demo-head">
            <span className="demo-badge">{t.demo.sim}</span>
            <span className="demo-agent">
              {t.demo.agent} <strong>{scenario.agent}</strong>
            </span>
          </div>
          <p className="demo-caption">{t.demo.request}</p>
          <p className="demo-prompt">{scenario.prompt}</p>

          <p className="demo-caption">{t.demo.plan}</p>
          <ol className="demo-steps">
            {scenario.steps.map((label, i) => {
              const state = i < completed ? "done" : phase === "running" && i === completed ? "active" : "todo";
              return (
                <li key={label} className={`demo-step is-${state}`}>
                  <span className="demo-step-mark" aria-hidden="true">
                    {state === "done" ? <Check size={14} /> : state === "active" ? <LoaderCircle size={14} className="spin" /> : i + 1}
                  </span>
                  <span>{label}</span>
                </li>
              );
            })}
          </ol>

          {phase === "approval" && (
            <div className="demo-approval" role="group" aria-labelledby="demo-approval-title">
              <Hand size={18} aria-hidden="true" />
              <div>
                <p className="demo-approval-title" id="demo-approval-title">
                  {scenario.approval.action}
                </p>
                <p className="demo-approval-detail">{scenario.approval.detail}</p>
              </div>
              <div className="demo-approval-actions">
                <button className="button button-light button-small" type="button" onClick={() => setPhase("declined")}>
                  {t.demo.decline}
                </button>
                <button className="button button-accent button-small" type="button" ref={approveRef} onClick={() => setPhase("done")}>
                  <Check size={15} aria-hidden="true" />
                  {t.demo.approve}
                </button>
              </div>
            </div>
          )}

          {(phase === "done" || phase === "declined") && (
            <div className={`demo-result is-${phase}`} ref={resultRef} tabIndex={-1}>
              {phase === "done" ? (
                <>
                  <p className="demo-result-title">
                    <CircleCheck size={18} aria-hidden="true" />
                    {scenario.done.title}
                  </p>
                  <ul>
                    {scenario.done.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {scenario.done.file && (
                    <span className="demo-file">
                      <FileText size={15} aria-hidden="true" />
                      {scenario.done.file}
                    </span>
                  )}
                </>
              ) : (
                <p className="demo-result-title">{t.demo.declined}</p>
              )}
            </div>
          )}

          <div className="demo-foot">
            <p className="demo-status" role="status" aria-live="polite">
              {status}
            </p>
            {phase === "idle" || phase === "running" ? (
              <button className="button button-accent" type="button" onClick={start} disabled={phase === "running"}>
                {phase === "running" ? <LoaderCircle size={16} className="spin" aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
                {phase === "running" ? t.demo.running : t.demo.run}
              </button>
            ) : phase === "approval" ? null : (
              <button className="button button-light" type="button" onClick={start}>
                <RotateCcw size={16} aria-hidden="true" />
                {t.demo.again}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
