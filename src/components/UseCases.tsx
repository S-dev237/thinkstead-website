import { useEffect, useState } from "react";
import { ArrowRight, Check, Copy } from "lucide-react";
import type { copy, Locale } from "../data/content";
import { useCases } from "../data/useCases";
import { useCopy } from "../hooks";
import { Tabs } from "./Tabs";

type T = (typeof copy)[Locale];

/** One profession at a time: a promise, two prompts to copy as they are, and what comes back. */
export function UseCases({ t, locale }: { t: T; locale: Locale }) {
  const list = useCases[locale];
  const [active, setActive] = useState(list[0].id);
  const [copied, copyText] = useCopy();
  useEffect(() => {
    if (!list.some((u) => u.id === active)) setActive(list[0].id);
  }, [list, active]);
  const current = list.find((u) => u.id === active) ?? list[0];

  return (
    <section className="section uses" id="uses" aria-labelledby="uses-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="kicker">{t.uses.kicker}</p>
          <h2 id="uses-title">{t.uses.title}</h2>
          <p className="lede">{t.uses.lead}</p>
        </header>
        <div className="uses-body" data-reveal>
          <Tabs
            label={t.uses.kicker}
            idPrefix="uses"
            className="uses-tabs"
            items={list.map((u) => ({ key: u.id, label: u.label }))}
            value={current.id}
            onChange={setActive}
          />
          <div className="uses-panel" role="tabpanel" id="uses-panel" aria-labelledby={`uses-tab-${current.id}`} tabIndex={0}>
            <p className="uses-headline">{current.headline}</p>
            <p className="uses-label">{t.uses.youType}</p>
            <ul className="uses-prompts">
              {current.prompts.map((prompt, i) => {
                const key = `${current.id}-${i}`;
                return (
                  <li key={key}>
                    <span className="uses-prompt">“{prompt}”</span>
                    <button
                      type="button"
                      className="copy-button"
                      onClick={() => copyText(key, prompt)}
                      aria-label={`${copied === key ? t.uses.copied : t.uses.copy}: ${prompt}`}
                    >
                      {copied === key ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                      <span aria-hidden="true">{copied === key ? t.uses.copied : t.uses.copy}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="uses-label">{t.uses.youGet}</p>
            <p className="uses-outcome">
              <ArrowRight size={16} aria-hidden="true" />
              {current.outcome}
            </p>
          </div>
        </div>
        <p className="visually-hidden" role="status" aria-live="polite">
          {copied ? t.uses.copied : ""}
        </p>
      </div>
    </section>
  );
}
