import { describe, expect, it } from "vitest";
import type { CountryData, GlobalData } from "./types";
import globalData from "../../data/global.json";
import countries from "../../data/countries.json";

const global = globalData as GlobalData;
const countryList = countries as CountryData[];

describe("소득 분포 데이터 파이프라인 산출물", () => {
  it("global_json의_백분위_배열은_99개이고_연도를_포함한다", () => {
    expect(global.percentiles).toHaveLength(99);
    expect(global.year).toBe(2021);
  });

  it("global_백분위는_오름차순으로_단조증가한다", () => {
    for (let i = 1; i < global.percentiles.length; i++) {
      expect(global.percentiles[i]).toBeGreaterThanOrEqual(global.percentiles[i - 1]);
    }
  });

  it("global_p99는_연_6만_intl달러_안팎이다", () => {
    // brief 훅: "연 $60K = 글로벌 상위 1%". World Bank PIP 172개국 인구가중 풀링 결과
    // p99 ≈ $55,374로 해당 범위에 부합.
    const p99 = global.percentiles[98];
    expect(p99).toBeGreaterThan(40_000);
    expect(p99).toBeLessThan(80_000);
  });

  it("국가_데이터는_100개국_이상을_포함하고_각각_고유한_ISO3_코드를_가진다", () => {
    expect(countryList.length).toBeGreaterThanOrEqual(100);
    const codes = new Set(countryList.map((c) => c.code));
    expect(codes.size).toBe(countryList.length);
  });

  it.each(["USA", "KOR", "IND", "NGA"])(
    "%s_국가_데이터는_스키마를_만족한다 (백분위 99개, 양수 pppFactor, 단조증가)",
    (code) => {
      const country = countryList.find((c) => c.code === code);
      expect(country, `${code} not found in countries.json`).toBeDefined();
      expect(country!.percentiles).toHaveLength(99);
      expect(country!.pppFactor).toBeGreaterThan(0);
      expect(country!.name.length).toBeGreaterThan(0);
      expect(country!.currency).toMatch(/^[A-Z]{3}$/);
      for (let i = 1; i < country!.percentiles.length; i++) {
        expect(country!.percentiles[i]).toBeGreaterThanOrEqual(country!.percentiles[i - 1]);
      }
    },
  );

  it("USA_p50은_1인당_소득_기준으로_2만5천에서_3만_intl달러_사이다", () => {
    // World Bank PIP는 "1인당(per-capita)" 후생 수준을 쓴다 — 가구소득을 가구원 수로
    // 단순 나눈 값으로, OECD 균등화(성인/아동 가중치)를 적용한 가구소득 중위값보다 낮다.
    // (task-2-report.md 참고: 브리핑의 "$40k-60k" 기대치는 균등화 가구소득 기준으로 보이며,
    // 이 파이프라인의 원천인 PIP 1인당 소득 기준과는 스케일이 다르다.)
    const usa = countryList.find((c) => c.code === "USA")!;
    const p50 = usa.percentiles[49];
    expect(p50).toBeGreaterThan(25_000);
    expect(p50).toBeLessThan(30_000);
  });
});
