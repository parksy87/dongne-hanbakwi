"use client";

import { useDailyQuote } from "@/hooks/useDailyQuote";
import { useDailyQuoteBackground } from "@/hooks/useDailyQuoteBackground";
import { useDailyQuotesPool } from "@/hooks/useAppSettings";
import { cn } from "@/lib/utils";

export default function DailyQuoteCard() {
  const quotesPool = useDailyQuotesPool();
  const { quote } = useDailyQuote(quotesPool);
  const background = useDailyQuoteBackground();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-card min-h-[200px]",
        "bg-cover bg-center"
      )}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 py-8 min-h-[200px]">
        <h3 className="text-sm font-bold text-white/90 tracking-wide mb-4">
          오늘의 한마디
        </h3>
        <p className="text-white text-lg font-semibold leading-relaxed drop-shadow-md max-w-sm">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
}
