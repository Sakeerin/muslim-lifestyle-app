"use client";

import { useEffect, useMemo } from "react";
import { X, Sunrise, Sunset } from "lucide-react";
import { useWeatherDetail } from "@/hooks/use-weather-detail";
import { describeWeather } from "@/hooks/use-weather";
import { useI18n } from "@/i18n/i18n-context";
import styles from "./weather-detail.module.css";

const TH_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const EN_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayLabel(dateStr: string, locale: string): string {
  const date = new Date(dateStr + "T12:00");
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  if (dateStr === todayStr) return locale === "th" ? "วันนี้" : "Today";
  const d = date.getDay();
  return locale === "th" ? (TH_DAYS[d] ?? "") : (EN_DAYS[d] ?? "");
}

function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Returns 0–1 progress of the sun between sunrise and sunset. null if not daytime. */
function getSunProgress(sunrise: string | null, sunset: string | null): number | null {
  if (!sunrise || !sunset) return null;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const riseMins = timeToMins(sunrise);
  const setMins = timeToMins(sunset);
  if (nowMins < riseMins || nowMins > setMins) return null;
  return (nowMins - riseMins) / (setMins - riseMins);
}

/** Point on quadratic bezier: P0=(5,50), P1=(50,8), P2=(95,50) */
function bezierPoint(t: number): { x: number; y: number } {
  const x = (1 - t) ** 2 * 5 + 2 * t * (1 - t) * 50 + t ** 2 * 95;
  const y = (1 - t) ** 2 * 50 + 2 * t * (1 - t) * 8 + t ** 2 * 50;
  return { x, y };
}

type Props = {
  open: boolean;
  onClose: () => void;
  temperature: number | null;
  weatherCode: number | null;
  humidity: number | null;
  lat: number;
  lng: number;
  locationName: string;
};

export function WeatherDetailModal({
  open,
  onClose,
  temperature,
  weatherCode,
  humidity,
  lat,
  lng,
  locationName,
}: Props) {
  const { locale } = useI18n();
  const detail = useWeatherDetail(lat, lng, open);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Week-wide min/max for temperature range bars
  const { weekMin, weekMax } = useMemo(() => {
    if (!detail.daily.length) return { weekMin: 0, weekMax: 40 };
    return {
      weekMin: Math.min(...detail.daily.map((d) => d.min)),
      weekMax: Math.max(...detail.daily.map((d) => d.max)),
    };
  }, [detail.daily]);

  // Sun dot position on the arc
  const sunDotPos = useMemo(() => {
    const progress = getSunProgress(detail.sunrise, detail.sunset);
    if (progress === null) return null;
    return bezierPoint(progress);
  }, [detail.sunrise, detail.sunset]);

  if (!open) return null;

  const weatherInfo = weatherCode !== null ? describeWeather(weatherCode) : null;
  const isTh = locale === "th";
  const range = weekMax - weekMin || 1;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className={styles.handle} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.locationRow}>
            <span className={styles.locationDot}>📍</span>
            <span className={styles.locationName}>{locationName}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Current conditions */}
        <div className={styles.currentSection} style={{ animationDelay: "0.05s" }}>
          <div className={styles.currentLeft}>
            <p className={styles.bigTemp}>{temperature !== null ? `${temperature}°` : "--"}</p>
            <p className={styles.weatherLabel}>
              {weatherInfo ? (isTh ? weatherInfo.labelTh : weatherInfo.labelEn) : "--"}
            </p>
            <div className={styles.metaRow}>
              {detail.feelsLike !== null && (
                <span className={styles.metaChip}>
                  {isTh ? `รู้สึก ${detail.feelsLike}°` : `Feels ${detail.feelsLike}°`}
                </span>
              )}
              {detail.todayMax !== null && detail.todayMin !== null && (
                <span className={styles.metaChip}>
                  ↑{detail.todayMax}° ↓{detail.todayMin}°
                </span>
              )}
              {humidity !== null && <span className={styles.metaChip}>💧 {humidity}%</span>}
            </div>
          </div>
          <span className={styles.currentBigIcon}>{weatherInfo?.icon ?? "🌡️"}</span>
        </div>

        {/* Hourly forecast */}
        {(detail.loading || detail.hourly.length > 0) && (
          <div className={styles.section} style={{ animationDelay: "0.1s" }}>
            <p className={styles.sectionTitle}>{isTh ? "พยากรณ์รายชั่วโมง" : "Hourly Forecast"}</p>
            {detail.loading && detail.hourly.length === 0 ? (
              <div className={styles.skeletonRow}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={styles.skeletonHour} />
                ))}
              </div>
            ) : (
              <div className={styles.hourlyWrapper}>
                <div className={styles.hourlyScroll}>
                  {detail.hourly.map((h, i) => (
                    <div
                      key={i}
                      className={`${styles.hourlyItem} ${i === 0 ? styles.hourlyNow : ""}`}
                    >
                      <span className={styles.hourlyTime}>
                        {i === 0 ? (isTh ? "ตอนนี้" : "Now") : h.time}
                      </span>
                      <span className={styles.hourlyIcon}>{describeWeather(h.code).icon}</span>
                      <span className={styles.hourlyTemp}>{h.temp}°</span>
                      <span className={styles.hourlyRain}>{h.rain > 0 ? `💧${h.rain}%` : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily forecast */}
        {(detail.loading || detail.daily.length > 0) && (
          <div className={styles.section} style={{ animationDelay: "0.16s" }}>
            <p className={styles.sectionTitle}>{isTh ? "พยากรณ์ 7 วัน" : "7-Day Forecast"}</p>
            {detail.loading && detail.daily.length === 0 ? (
              <div className={styles.skeletonList}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.skeletonDay} />
                ))}
              </div>
            ) : (
              detail.daily.map((d, i) => {
                const label = getDayLabel(d.date, locale);
                const w = describeWeather(d.code);
                const barLeft = ((d.min - weekMin) / range) * 100;
                const barWidth = Math.max(((d.max - d.min) / range) * 100, 6);
                return (
                  <div key={i} className={`${styles.dailyRow} ${i === 0 ? styles.todayRow : ""}`}>
                    <span className={styles.dailyDay}>{label}</span>
                    <span className={styles.dailyRain}>{d.rain > 0 ? `💧${d.rain}%` : ""}</span>
                    <span className={styles.dailyIcon}>{w.icon}</span>
                    <div className={styles.dailyTempBar}>
                      <div
                        className={styles.dailyTempBarFill}
                        style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                      />
                    </div>
                    <div className={styles.dailyTemps}>
                      <span className={styles.dailyMin}>{d.min}°</span>
                      <span className={styles.dailyMax}>{d.max}°</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Sunrise / Sunset */}
        {(detail.sunrise ?? detail.sunset) && (
          <div className={styles.section} style={{ animationDelay: "0.22s" }}>
            <p className={styles.sectionTitle}>{isTh ? "ดวงอาทิตย์" : "Sun"}</p>
            <div className={styles.sunRow}>
              <div className={styles.sunItem}>
                <div className={styles.sunIconWrap}>
                  <Sunrise size={22} />
                </div>
                <p className={styles.sunLabel}>{isTh ? "พระอาทิตย์ขึ้น" : "Sunrise"}</p>
                <p className={styles.sunTime}>{detail.sunrise ?? "--:--"}</p>
              </div>

              <div className={styles.sunArc}>
                <svg viewBox="0 0 100 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Dashed arc track */}
                  <path
                    d="M5 50 Q50 8 95 50"
                    stroke="rgba(221,184,102,0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  {/* Solid arc progress when sun is up */}
                  {sunDotPos !== null && (
                    <path
                      d="M5 50 Q50 8 95 50"
                      stroke="rgba(221,184,102,0.55)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  )}
                  {/* Horizon line */}
                  <line
                    x1="2"
                    y1="52"
                    x2="98"
                    y2="52"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                  {/* Endpoint dots */}
                  <circle cx="5" cy="50" r="2" fill="rgba(221,184,102,0.4)" />
                  <circle cx="95" cy="50" r="2" fill="rgba(221,184,102,0.4)" />
                  {/* Sun dot */}
                  {sunDotPos !== null && (
                    <>
                      <circle
                        cx={sunDotPos.x}
                        cy={sunDotPos.y}
                        r="5.5"
                        fill="rgba(221,184,102,0.2)"
                      />
                      <circle cx={sunDotPos.x} cy={sunDotPos.y} r="3" fill="rgba(251,191,36,1)" />
                    </>
                  )}
                </svg>
              </div>

              <div className={styles.sunItem}>
                <div className={styles.sunIconWrap}>
                  <Sunset size={22} />
                </div>
                <p className={styles.sunLabel}>{isTh ? "พระอาทิตย์ตก" : "Sunset"}</p>
                <p className={styles.sunTime}>{detail.sunset ?? "--:--"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
