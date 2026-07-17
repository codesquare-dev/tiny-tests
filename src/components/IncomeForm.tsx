"use client";
import { useState } from "react";
import countries from "../../data/countries.json";
import global from "../../data/global.json";
import { lookupPercentile, perCapita, toIntlDollars } from "@/lib/percentile";
import type { CountryData, GlobalData } from "@/lib/types";
import { ResultCard } from "./ResultCard";

const countryList = countries as CountryData[];
const globalData = global as GlobalData;

export type Verdict = {
  globalPercentile: number;
  countryPercentile: number;
  countryName: string;
};

export function IncomeForm() {
  const [code, setCode] = useState("USA");
  const [income, setIncome] = useState("");
  const [household, setHousehold] = useState(1);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const country = countryList.find((c) => c.code === code)!;

  function calculate(e: React.SubmitEvent) {
    e.preventDefault();
    const amount = Number(income.replaceAll(",", ""));
    if (!Number.isFinite(amount) || amount <= 0) return;
    const intl = toIntlDollars(perCapita(amount, household), country.pppFactor);
    setVerdict({
      globalPercentile: lookupPercentile(intl, globalData.percentiles),
      countryPercentile: lookupPercentile(intl, country.percentiles),
      countryName: country.name,
    });
  }

  return (
    <div>
      <form
        onSubmit={calculate}
        className="mt-8 rounded-sm border border-rule bg-paper-raised p-5 sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Country
            <select
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="field"
            >
              {countryList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Household size
            <select
              value={household}
              onChange={(e) => setHousehold(Number(e.target.value))}
              className="field"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
            Yearly income ({country.currency}, before tax)
            <input
              inputMode="numeric"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 60,000"
              className="field"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-sm bg-accent px-5 py-3 font-medium text-paper hover:bg-accent-deep sm:w-auto"
        >
          Show my percentile
        </button>
      </form>
      {verdict && <ResultCard verdict={verdict} />}
    </div>
  );
}
