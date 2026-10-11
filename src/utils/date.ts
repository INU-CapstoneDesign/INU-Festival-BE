// Date → "2024-05-07 09:00:00" (한국 시간). 2024 버전 응답 형식과 같다
export function formatKst(date: Date): string {
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
}
