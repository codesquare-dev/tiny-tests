import { describe, expect, it } from "vitest";
import { formatMs, MEDIAN_MS, percentileFromMs } from "./reaction";

describe("반응속도 백분위 근사", () => {
  it("중앙값에서_50번째_백분위를_반환한다", () => {
    // Human Benchmark 공개 중앙값(273ms) = 분포의 한가운데.
    expect(percentileFromMs(MEDIAN_MS)).toBe(50);
  });

  it("느려질수록_백분위가_단조_감소한다", () => {
    let previous = 100;
    for (let ms = 120; ms <= 600; ms += 5) {
      const percentile = percentileFromMs(ms);
      expect(percentile).toBeLessThanOrEqual(previous);
      previous = percentile;
    }
  });

  it("빠른_쪽_경계에서_상위_10퍼센트_부근에_놓인다", () => {
    // 200ms는 사람이 낼 수 있는 빠른 축 — 상위 10% 언저리로 읽혀야 한다.
    const percentile = percentileFromMs(200);
    expect(percentile).toBeGreaterThanOrEqual(80);
    expect(percentile).toBeLessThanOrEqual(92);
  });

  it("느린_쪽_경계에서_하위_25퍼센트_부근에_놓인다", () => {
    // 350ms는 눈에 띄게 느린 축 — 하위 25% 언저리로 읽혀야 한다.
    const percentile = percentileFromMs(350);
    expect(percentile).toBeGreaterThanOrEqual(14);
    expect(percentile).toBeLessThanOrEqual(28);
  });

  it("극단값을_1과_99_사이로_고정한다", () => {
    // 0%·100%는 "아무도 없다"는 거짓말이 되므로 양끝을 잘라낸다.
    expect(percentileFromMs(1)).toBe(99);
    expect(percentileFromMs(50)).toBe(99);
    expect(percentileFromMs(2000)).toBe(1);
    expect(percentileFromMs(60_000)).toBe(1);
  });

  it("모든_구간에서_1과_99_범위를_벗어나지_않는다", () => {
    for (let ms = 1; ms <= 3000; ms += 7) {
      const percentile = percentileFromMs(ms);
      expect(percentile).toBeGreaterThanOrEqual(1);
      expect(percentile).toBeLessThanOrEqual(99);
    }
  });

  it("0이나_음수는_가장_빠른_쪽으로_고정한다", () => {
    // 로그 정규 근사는 ln(ms)를 쓰므로 0 이하 입력이 NaN이 되어선 안 된다.
    expect(percentileFromMs(0)).toBe(99);
    expect(percentileFromMs(-10)).toBe(99);
  });
});

describe("밀리초 표기", () => {
  it("정수_밀리초로_반올림해_표기한다", () => {
    expect(formatMs(273.4)).toBe("273 ms");
    expect(formatMs(273.6)).toBe("274 ms");
  });

  it("정수_입력도_그대로_표기한다", () => {
    expect(formatMs(300)).toBe("300 ms");
  });
});
