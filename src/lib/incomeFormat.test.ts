import { describe, expect, it } from "vitest";
import { reformatIncomeInput } from "./incomeFormat";

describe("소득 입력 콤마 포맷팅 (커서 위치 보존)", () => {
  it("빈_문자열은_빈_상태를_유지한다", () => {
    expect(reformatIncomeInput("", 0)).toEqual({ digits: "", formatted: "", cursorPos: 0 });
  });

  it("숫자만_입력하면_천단위_콤마를_붙인다", () => {
    expect(reformatIncomeInput("60000", 5)).toEqual({
      digits: "60000",
      formatted: "60,000",
      cursorPos: 6, // 콤마 뒤로 커서 이동 (5자리 숫자 모두 커서 왼쪽)
    });
  });

  it("숫자가_아닌_문자는_제거한다", () => {
    expect(reformatIncomeInput("60abc000", 8)).toEqual({
      digits: "60000",
      formatted: "60,000",
      cursorPos: 6,
    });
  });

  it("중간에_숫자를_삽입해도_커서가_같은_자리수_뒤에_유지된다", () => {
    // "6,000"에서 커서가 "6" 뒤(index 1)일 때 "5"를 입력 → 브라우저가 만든 원시값은 "56,000", 커서는 index 2
    expect(reformatIncomeInput("56,000", 2)).toEqual({
      digits: "56000",
      formatted: "56,000",
      cursorPos: 2,
    });
  });

  it("맨_앞에_숫자를_삽입해도_커서가_그_숫자_뒤에_유지된다", () => {
    expect(reformatIncomeInput("160,000", 1)).toEqual({
      digits: "160000",
      formatted: "160,000",
      cursorPos: 1,
    });
  });

  it("커서가_맨_앞이면_포맷_후에도_맨_앞을_유지한다", () => {
    expect(reformatIncomeInput("60,000", 0)).toEqual({
      digits: "60000",
      formatted: "60,000",
      cursorPos: 0,
    });
  });

  it("전체_삭제_시_빈_상태로_돌아간다", () => {
    expect(reformatIncomeInput("", 0)).toEqual({ digits: "", formatted: "", cursorPos: 0 });
  });

  it("큰_숫자도_콤마_구간마다_올바르게_포맷한다", () => {
    expect(reformatIncomeInput("1234567", 7)).toEqual({
      digits: "1234567",
      formatted: "1,234,567",
      cursorPos: 9,
    });
  });
});
