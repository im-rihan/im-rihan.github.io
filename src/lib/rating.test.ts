import { describe, expect, it } from "vitest";
import { rateHigherIsBetter, rateLowerIsBetter, worstRating } from "./rating";

describe("rateLowerIsBetter", () => {
    it("rates at or below the good threshold as good", () => {
        expect(rateLowerIsBetter(50, 100, 200)).toBe("good");
        expect(rateLowerIsBetter(100, 100, 200)).toBe("good");
    });

    it("rates between thresholds as ok", () => {
        expect(rateLowerIsBetter(150, 100, 200)).toBe("ok");
    });

    it("rates above the ok threshold as poor", () => {
        expect(rateLowerIsBetter(250, 100, 200)).toBe("poor");
    });
});

describe("rateHigherIsBetter", () => {
    it("rates at or above the good threshold as good", () => {
        expect(rateHigherIsBetter(60, 50, 30)).toBe("good");
    });

    it("rates between thresholds as ok", () => {
        expect(rateHigherIsBetter(40, 50, 30)).toBe("ok");
    });

    it("rates below the ok threshold as poor", () => {
        expect(rateHigherIsBetter(10, 50, 30)).toBe("poor");
    });
});

describe("worstRating", () => {
    it("returns null for an empty list", () => {
        expect(worstRating([])).toBeNull();
    });

    it("returns poor if any rating is poor", () => {
        expect(worstRating(["good", "poor", "ok"])).toBe("poor");
    });

    it("returns ok if the worst rating is ok", () => {
        expect(worstRating(["good", "ok"])).toBe("ok");
    });

    it("returns good when everything is good", () => {
        expect(worstRating(["good", "good"])).toBe("good");
    });
});
