import "server-only";
import { DEFAULT_RANKS } from "@/config/ranks";
import { DEFAULT_SCHEDULE } from "@/config/schedule";
import { rankPlayers } from "@/domain/leaderboard";
import { demoAnnouncements, demoPlayerList, demoTeams, demoViewer, DEMO_NOW } from "./demo";

/**
 * จุดเดียวที่หน้าจอดึงข้อมูล
 * ตอนนี้ใช้ค่าตั้งต้น + ข้อมูลตัวอย่าง · โมดูล 3 (Slack) และ 6 (Firestore) จะเปลี่ยนเฉพาะไฟล์นี้
 */
const demo = process.env.DEMO_MODE === "1";

export function getNow(): Date {
  return demo ? DEMO_NOW : new Date();
}

export async function getConfig() {
  return { schedule: DEFAULT_SCHEDULE, ranks: DEFAULT_RANKS };
}

/** ผู้ใช้ที่ล็อกอินอยู่ · null = ยังไม่ล็อกอิน */
export async function getViewer() {
  return demo ? demoViewer : null;
}

/** อ่านจาก leaderboard/current เอกสารเดียวเสมอ (ข้อ 10) */
export async function getLeaderboard() {
  if (!demo) return { players: [], teams: [] };
  return { players: rankPlayers(demoPlayerList), teams: [...demoTeams].sort((a, b) => b.score - a.score) };
}

export async function getAnnouncements() {
  return demo ? demoAnnouncements : [];
}

export function isSlackConfigured(): boolean {
  return Boolean(process.env.AUTH_SLACK_ID && process.env.AUTH_SLACK_SECRET);
}
