import { describe, expect, it } from "vitest";
import {
  formatMultiple,
  fromIntlDollars,
  incomeForPercentile,
  lookupPercentile,
  median,
  perCapita,
  rarityOutOf100,
  toIntlDollars,
  zoomWindow,
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

  it("중위값으로_50번째_백분위_임계값을_반환한다", () => {
    expect(median(thresholds)).toBe(50_000); // thresholds[49] = p50
  });

  it("중위값은_99개가_아닌_임계값_배열을_거부한다", () => {
    // 데이터 계약(99개)이 깨지면 조용한 오답 대신 즉시 실패해야 한다.
    expect(() => median([1, 2, 3])).toThrow(/99/);
  });
});

describe("목표 백분위 도달에 필요한 소득 (역산)", () => {
  const thresholds = Array.from({ length: 99 }, (_, i) => (i + 1) * 1000); // p1=1000 ... p99=99000

  it("목표_백분위_인덱스의_임계값을_반환한다", () => {
    expect(incomeForPercentile(50, thresholds)).toBe(thresholds[49]);
    expect(incomeForPercentile(90, thresholds)).toBe(thresholds[89]);
  });

  it("1_미만은_1로_clamp한다", () => {
    expect(incomeForPercentile(0, thresholds)).toBe(thresholds[0]);
    expect(incomeForPercentile(-10, thresholds)).toBe(thresholds[0]);
  });

  it("99_초과는_99로_clamp한다", () => {
    expect(incomeForPercentile(100, thresholds)).toBe(thresholds[98]);
    expect(incomeForPercentile(150, thresholds)).toBe(thresholds[98]);
  });

  it("1에서_99까지_lookupPercentile과_왕복하면_원래_백분위로_돌아온다", () => {
    // thresholds가 중복 없이 증가하는 한 >= 비교가 정확히 자기 자신 인덱스에서 멈춘다.
    for (let p = 1; p <= 99; p++) {
      expect(lookupPercentile(incomeForPercentile(p, thresholds), thresholds)).toBe(p);
    }
  });

  it("범위_밖_입력은_clamp로_인해_왕복해도_원래_입력으로_돌아오지_않는다", () => {
    // clamp는 손실이 있는 변환이라 완전한 역함수가 아니다 — 1과 99로 수렴한다.
    expect(lookupPercentile(incomeForPercentile(0, thresholds), thresholds)).toBe(1);
    expect(lookupPercentile(incomeForPercentile(200, thresholds), thresholds)).toBe(99);
  });
});

describe("국제달러를 현지통화로 역환산", () => {
  it("PPP_환산계수를_곱해_현지통화로_되돌린다", () => {
    expect(fromIntlDollars(1, 1300)).toBe(1300);
  });

  it("toIntlDollars와_왕복하면_원래_금액으로_돌아온다", () => {
    const amount = 45000;
    const pppFactor = 1300;
    expect(fromIntlDollars(toIntlDollars(amount, pppFactor), pppFactor)).toBeCloseTo(amount);
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

describe("차트 확대 범위 (중심 백분위 ± 폭)", () => {
  it("범위_안쪽_중심은_대칭으로_좌우_동일폭을_잡는다", () => {
    expect(zoomWindow(50, 17)).toEqual({ from: 33, to: 67 });
  });

  it("중심이_상단_경계에_가까우면_창_전체를_안쪽으로_밀어_폭을_유지한다", () => {
    // center=99, halfWidth=17이면 [82,116]인데 99를 넘으니 왼쪽으로 밀어 [65,99]가 된다.
    expect(zoomWindow(99, 17)).toEqual({ from: 65, to: 99 });
  });

  it("중심이_하단_경계에_가까우면_창_전체를_안쪽으로_밀어_폭을_유지한다", () => {
    expect(zoomWindow(1, 17)).toEqual({ from: 1, to: 35 });
  });

  it("중심_백분위는_1_99로_clamp한다", () => {
    expect(zoomWindow(150, 17)).toEqual(zoomWindow(99, 17));
    expect(zoomWindow(-5, 17)).toEqual(zoomWindow(1, 17));
  });

  it("기본_폭은_17이다", () => {
    expect(zoomWindow(50)).toEqual({ from: 33, to: 67 });
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
