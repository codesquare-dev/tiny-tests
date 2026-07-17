import { describe, expect, it } from "vitest";
import { lookupPercentile, peopleBelow, perCapita, toIntlDollars } from "./percentile";

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
});
