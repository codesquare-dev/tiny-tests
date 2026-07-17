import { describe, expect, it } from "vitest";
import { detectCountry } from "./locale";

describe("로케일 기반 국가 자동 감지", () => {
  const validCodes = new Set(["USA", "KOR", "CHE", "GBR", "FRA", "DEU", "CHN"]);

  it("지역_서브태그가_있으면_ISO3로_변환한다", () => {
    expect(detectCountry(["en-US"], validCodes)).toBe("USA");
    expect(detectCountry(["ko-KR"], validCodes)).toBe("KOR");
    expect(detectCountry(["de-CH"], validCodes)).toBe("CHE");
  });

  it("지역_서브태그가_없으면_USA로_대체한다", () => {
    expect(detectCountry(["fr"], validCodes)).toBe("USA");
  });

  it("validCodes에_없는_지역이면_다음_로케일을_시도한다", () => {
    // zh-CN → CHN이 validCodes에 없다고 가정한 세트로 대체 검증
    const withoutChina = new Set(["USA", "GBR"]);
    expect(detectCountry(["zh-CN", "en-GB"], withoutChina)).toBe("GBR");
  });

  it("모든_로케일이_실패하면_USA로_대체한다", () => {
    expect(detectCountry(["zh-CN"], new Set(["USA", "GBR"]))).toBe("USA");
  });

  it("빈_로케일_목록이면_USA로_대체한다", () => {
    expect(detectCountry([], validCodes)).toBe("USA");
  });

  it("언더스코어_형식의_로케일도_처리한다", () => {
    expect(detectCountry(["en_US"], validCodes)).toBe("USA");
  });

  it("소문자_지역_서브태그도_처리한다", () => {
    expect(detectCountry(["en-us"], validCodes)).toBe("USA");
  });

  it("스크립트_서브태그가_있어도_지역을_올바르게_추출한다", () => {
    // zh-Hans-CN: 4글자 스크립트(Hans)를 건너뛰고 2글자 지역(CN)을 찾는다
    expect(detectCountry(["zh-Hans-CN"], validCodes)).toBe("CHN");
  });

  it("ISO2_ISO3_매핑에_없는_지역_코드는_무시한다", () => {
    expect(detectCountry(["xx-ZZ"], validCodes)).toBe("USA");
  });

  it("여러_로케일_중_validCodes에_있는_첫_번째_매치를_반환한다", () => {
    expect(detectCountry(["ko-KR", "en-US"], validCodes)).toBe("KOR");
  });
});
