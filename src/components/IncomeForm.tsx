"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import countries from "../../data/countries.json";
import global from "../../data/global.json";
import { detectCountry } from "@/lib/locale";
import { reformatIncomeInput } from "@/lib/incomeFormat";
import { lookupPercentile, perCapita, toIntlDollars } from "@/lib/percentile";
import type { CountryData, GlobalData } from "@/lib/types";
import { ResultCard } from "./ResultCard";

const countryList = countries as CountryData[];
const globalData = global as GlobalData;
const validCountryCodes = new Set(countryList.map((c) => c.code));

export type Verdict = {
  globalPercentile: number;
  countryPercentile: number;
  countryCode: string;
  countryName: string;
  /** Per-capita yearly income in international dollars — the value both curves are read against. */
  intlIncome: number;
  /** The raw household income as entered, in local currency before tax. */
  rawIncome: number;
  householdSize: number;
};

export function IncomeForm() {
  const [code, setCode] = useState("USA");
  const [incomeDigits, setIncomeDigits] = useState("");
  const [incomeDisplay, setIncomeDisplay] = useState("");
  const [household, setHousehold] = useState(1);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const userPickedCountry = useRef(false);
  const incomeInputRef = useRef<HTMLInputElement>(null);
  const pendingCursorPos = useRef<number | null>(null);

  // Detect country from the browser locale after mount only — the initial
  // render must stay "USA" on both server and client to avoid a hydration
  // mismatch, and must not override a country the user already picked.
  useEffect(() => {
    if (userPickedCountry.current) return;
    setCode(detectCountry(navigator.languages ?? [navigator.language], validCountryCodes));
  }, []);

  useLayoutEffect(() => {
    if (pendingCursorPos.current === null || !incomeInputRef.current) return;
    incomeInputRef.current.setSelectionRange(pendingCursorPos.current, pendingCursorPos.current);
    pendingCursorPos.current = null;
  }, [incomeDisplay]);

  const country = countryList.find((c) => c.code === code)!;

  function handleIncomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const { digits, formatted, cursorPos } = reformatIncomeInput(
      input.value,
      input.selectionStart ?? input.value.length,
    );
    setIncomeDigits(digits);
    setIncomeDisplay(formatted);
    pendingCursorPos.current = cursorPos;
  }

  function calculate(e: React.SubmitEvent) {
    e.preventDefault();
    const amount = Number(incomeDigits);
    if (!Number.isFinite(amount) || amount <= 0) return;
    const intl = toIntlDollars(perCapita(amount, household), country.pppFactor);
    setVerdict({
      globalPercentile: lookupPercentile(intl, globalData.percentiles),
      countryPercentile: lookupPercentile(intl, country.percentiles),
      countryCode: country.code,
      countryName: country.name,
      intlIncome: intl,
      rawIncome: amount,
      householdSize: household,
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
              onChange={(e) => {
                userPickedCountry.current = true;
                setCode(e.target.value);
              }}
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
            <span className="text-xs font-normal text-ink-muted">
              People this income supports — we split it evenly between them.
            </span>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
            Yearly income (before tax)
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-ink-muted tabular-nums"
              >
                {country.currency}
              </span>
              <input
                ref={incomeInputRef}
                inputMode="numeric"
                value={incomeDisplay}
                onChange={handleIncomeChange}
                placeholder="e.g. 60,000"
                className="field pl-16"
                aria-label={`Yearly income in ${country.currency}, before tax`}
              />
            </div>
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
