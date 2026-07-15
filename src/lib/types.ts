export type GlobalData = { year: number; percentiles: number[] };

export type CountryData = {
  code: string; // ISO3, e.g. "USA"
  name: string; // "United States"
  currency: string; // "USD"
  pppFactor: number; // 현지통화 → intl$ 환산 제수 (LCU per intl$)
  percentiles: number[]; // 자국 내 백분위 임계값 (intl$, 길이 99)
};
