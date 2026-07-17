import { describe, expect, it } from "vitest";
import {
  formatMultiple,
  lookupPercentile,
  median,
  peopleBelow,
  perCapita,
  rarityOutOf100,
  toIntlDollars,
} from "./percentile";

describe("소득 백분위 계산 코어", () => {
  const thresholds = Array.from({ length: 99 }, (_, i) => (i + 1) * 1000); // p1=1000 ... p99=99000

  it("PPP_환산계수로_현지통화를_국제달러로_나눈다", () => {
    expect(toIntlDollars(1300, 1300)).toBe(1); // 1300 LCU, factor 1300 → 1 intl$
  });

  it("가구원수로_소득을_1인당으로_나눈다", () => {
    expect(perCapita(40000, 4)).toBe(10000);
    expect(perCapita(40000, 1)).toBe(40000);
  });

  it("소득을_초과하지_않는_가장_높은_임계값의_백분위를_반환한다", () => {
    expect(lookupPercentile(50500, thresholds)).toBe(50);
  });

  it("첫_임계값보다_낮으면_백분위_1로_고정한다", () => {
    expect(lookupPercentile(10, thresholds)).toBe(1);
  });

  it("마지막_임계값보다_높으면_백분위_99로_고정한다", () => {
    expect(lookupPercentile(1_000_000, thresholds)).toBe(99);
  });

  it("백분위로부터_그보다_적게_버는_세계_인구수를_계산한다", () => {
    expect(peopleBelow(91)).toBe(Math.round(8_100_000_000 * 0.91));
  });

  it("중위값으로_50번째_백분위_임계값을_반환한다", () => {
    expect(median(thresholds)).toBe(50_000); // thresholds[49] = p50
  });

  it("중위값은_99개가_아닌_임계값_배열을_거부한다", () => {
    // 데이터 계약(99개)이 깨지면 조용한 오답 대신 즉시 실패해야 한다.
    expect(() => median([1, 2, 3])).toThrow(/99/);
  });
});

describe("중위 대비 배수 표기", () => {
  it("소수점_한자리로_배수를_표기한다", () => {
    expect(formatMultiple(2.14)).toBe("2.1×");
    expect(formatMultiple(18.29)).toBe("18.3×");
  });

  it("정수_배수도_소수점_한자리를_유지한다", () => {
    expect(formatMultiple(3)).toBe("3.0×");
  });

  it("0_1배_미만은_0_0배_대신_미만으로_표기한다", () => {
    // 반올림하면 "0.0×"가 되어 소득이 0인 것처럼 읽힌다.
    expect(formatMultiple(0.04)).toBe("<0.1×");
  });
});

describe("희소성 문구 (n/100 프레이밍)", () => {
  it("상위권에서는_더_많이_버는_쪽의_적은_수를_보고한다", () => {
    // p99에서 "80억명이 나보다 적게 번다"는 세계 인구 전체와 같아 터무니없게 읽힌다.
    expect(rarityOutOf100(99)).toEqual({ side: "above", outOf100: 1 });
  });

  it("하위권에서는_더_적게_버는_쪽의_적은_수를_보고한다", () => {
    expect(rarityOutOf100(1)).toEqual({ side: "below", outOf100: 1 });
    expect(rarityOutOf100(20)).toEqual({ side: "below", outOf100: 20 });
  });

  it("항상_100명중_50명_이하의_작은_쪽을_보고해_포화되지_않는다", () => {
    for (let p = 1; p <= 99; p++) {
      expect(rarityOutOf100(p).outOf100).toBeLessThanOrEqual(50);
    }
  });
});
