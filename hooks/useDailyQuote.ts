"use client";

import { useState, useEffect } from "react";
import { getTodayDateString } from "@/lib/utils";
import { DAILY_QUOTES } from "@/lib/constants";

const QUOTE_KEY = "daily_quote";

export function useDailyQuote(quotes?: string[]) {
  const pool = quotes?.length ? quotes : DAILY_QUOTES;
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const today = getTodayDateString();
    const stored = localStorage.getItem(QUOTE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setQuote(parsed.text);
        return;
      }
    }
    const randomQuote = pool[Math.floor(Math.random() * pool.length)];
    localStorage.setItem(
      QUOTE_KEY,
      JSON.stringify({ date: today, text: randomQuote })
    );
    setQuote(randomQuote);
  }, [pool.join("|")]);

  const saveQuote = (text: string) => {
    const today = getTodayDateString();
    localStorage.setItem(QUOTE_KEY, JSON.stringify({ date: today, text }));
    setQuote(text);
  };

  return { quote, saveQuote };
}
