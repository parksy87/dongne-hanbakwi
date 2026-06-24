export const DAILY_QUOTE_BACKGROUNDS = [
  "/daily-quote-bg/01.jpg",
  "/daily-quote-bg/02.jpg",
  "/daily-quote-bg/03.jpg",
  "/daily-quote-bg/04.jpg",
  "/daily-quote-bg/05.jpg",
  "/daily-quote-bg/06.jpg",
  "/daily-quote-bg/07.jpg",
  "/daily-quote-bg/08.jpg",
  "/daily-quote-bg/09.jpg",
  "/daily-quote-bg/10.jpg",
] as const;

export function getDailyIndex(date: string, count: number, salt = 0): number {
  if (count <= 0) return 0;
  let hash = salt;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
