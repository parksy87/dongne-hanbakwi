"use client";

import { useState, useEffect } from "react";
import { getTodayDateString } from "@/lib/utils";
import {
  DAILY_QUOTE_BACKGROUNDS,
  getDailyIndex,
} from "@/lib/dailyQuoteBackgrounds";

export function useDailyQuoteBackground() {
  const [background, setBackground] = useState<string>(
    DAILY_QUOTE_BACKGROUNDS[0]
  );

  useEffect(() => {
    const today = getTodayDateString();
    const index = getDailyIndex(today, DAILY_QUOTE_BACKGROUNDS.length);
    setBackground(DAILY_QUOTE_BACKGROUNDS[index]);
  }, []);

  return background;
}
