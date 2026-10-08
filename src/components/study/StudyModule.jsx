import React from "react";
import { ExternalLink } from "lucide-react";
import { topicUrl } from "@/lib/studyTopicIds";

export default function StudyModule({ number, title, subs }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-heading text-lg text-[hsl(var(--accent))]">{number}</span>
        <h3 className="font-heading text-base sm:text-lg text-foreground leading-snug">{title}</h3>
      </div>
      <div className="space-y-4">
        {subs.map(([subTitle, topics]) => (
          <div key={subTitle}>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
              {subTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((name) => (
                <a
                  key={name}
                  href={topicUrl(name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[2.5rem] px-3 rounded-full border border-[hsl(var(--accent))]/50 text-xs sm:text-sm text-foreground hover:bg-[hsl(var(--accent))]/10 transition-colors"
                >
                  {name}
                  <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}