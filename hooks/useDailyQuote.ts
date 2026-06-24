"use client";

import { useState, useEffect } from "react";
import { getTodayDateString } from "@/lib/utils";
import { DAILY_QUOTES } from "@/lib/constants";
import { getDailyIndex } from "@/lib/dailyQuoteBackgrounds";

export function useDailyQuote(quotes?: string[]) {
  const pool = quotes?.length ? quotes : DAILY_QUOTES;
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const today = getTodayDateString();
    const index = getDailyIndex(today, pool.length, 17);
    setQuote(pool[index] ?? pool[0]);
  }, [pool.join("|")]);

  return { quote };
}
