import { gatherBadgeStats } from "./badgeService";
import { calculateCompositeLevel } from "@/lib/level";
import { updateUserStats } from "./userService";

export async function syncUserLevel(userId: string): Promise<number> {
  const stats = await gatherBadgeStats(userId);
  const level = calculateCompositeLevel(stats);
  await updateUserStats(userId, { level });
  return level;
}
