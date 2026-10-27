"use client";

import { useState, type CSSProperties } from "react";
import { DEFAULT_RANKS, type RankId, type RankStep } from "@/config/ranks";
import frames from "@/config/rank-frames.json";
import { TEAMS, type TeamId } from "@/config/teams";
import { initialsOf } from "@/domain/names";
import { getRank, rankLabel } from "@/domain/ranks";
import styles from "./RankAvatar.module.css";

type FrameGeometry = (typeof frames.ranks)[number];

const SPARK_POINTS: [number, number][] = [
  [18, 18],
  [81, 24],
  [82, 72],
  [20, 81],
  [50, 12],
  [67, 86],
];

export type RankAvatarProps = {
  name: string;
  /** ใช้ score หาแรงค์จาก config ข้อ 5.3 หรือระบุ rank ตรงๆ */
  score?: number;
  rank?: RankId;
  ranks?: RankStep[];
  photoUrl?: string | null;
  team?: TeamId;
  /** ขนาดเป็น px · Profile 160–210 · Home 56/40 · Dashboard 40–48 */
  size: number;
  /** ดาวและแสงกรอบ — ปิดอัตโนมัติเมื่อ < 96px หรือ prefers-reduced-motion */
  motion?: boolean;
};

function pickFile(size: number): number {
  const wanted = size * 2;
  return frames.sizes.find((s) => s >= wanted) ?? frames.sizes[frames.sizes.length - 1];
}

/** รูปโปรไฟล์ในกรอบแรงค์ — สี่เหลี่ยมเสมอ ห้ามครอปเป็นวงกลม (ข้อ 9.1) */
export function RankAvatar({
  name,
  score = 0,
  rank,
  ranks = DEFAULT_RANKS,
  photoUrl,
  team,
  size,
  motion = false,
}: RankAvatarProps) {
  const [broken, setBroken] = useState(false);
  const rankId = rank ?? getRank(score, ranks).rank;
  const geo = (frames.ranks.find((f) => f.rank === rankId) ?? frames.ranks[0]) as FrameGeometry;
  const animated = motion && geo.animate && size >= 96;
  const showPhoto = Boolean(photoUrl) && !broken;

  return (
    <span
      role="img"
      aria-label={`${name} · ${rankLabel(rankId)}`}
      className={`${styles.root} ${animated && ["S", "SSS", "Legendary"].includes(rankId) ? styles.shine : ""}`}
      style={{ width: size, ["--accent" as string]: geo.accent } as CSSProperties}
    >
      <span
        className={styles.photo}
        style={{
          left: `${geo.photo.left}%`,
          top: `${geo.photo.top}%`,
          width: `${geo.photo.width}%`,
          height: `${geo.photo.height}%`,
          clipPath: geo.photo.clipPath,
        }}
      >
        <span
          className={styles.fallback}
          style={{
            background: team ? TEAMS[team].bg : "var(--sky-light)",
            fontSize: Math.max(10, size * 0.2),
          }}
        >
          {initialsOf(name)}
        </span>
        {showPhoto && (
          // eslint-disable-next-line @next/next/no-img-element -- รูป Slack ภายนอก ไม่ผ่าน image optimizer
          <img src={photoUrl!} alt="" decoding="async" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
        )}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- กรอบเป็น WebP ที่ย่อไว้แล้ว */}
      <img
        className={styles.frame}
        src={`/rank-frames/${pickFile(size)}/${geo.file}.webp`}
        alt=""
        draggable={false}
        decoding="async"
      />
      {animated &&
        SPARK_POINTS.slice(0, geo.sparkles).map(([x, y], i) => (
          <span
            key={i}
            aria-hidden="true"
            className={styles.spark}
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                "--delay": `${-i * 0.71}s`,
                "--star-size": `${i % 2 ? 4 : 6}%`,
              } as CSSProperties
            }
          />
        ))}
    </span>
  );
}
