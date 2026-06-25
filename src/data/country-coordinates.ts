/** Approximate country centroids [longitude, latitude] for map markers */
export const countryNames: Record<string, string> = {
    US: "United States", IN: "India", GB: "United Kingdom", DE: "Germany",
    FR: "France", CA: "Canada", AU: "Australia", BR: "Brazil", JP: "Japan",
    CN: "China", RU: "Russia", MX: "Mexico", ES: "Spain", IT: "Italy",
    NL: "Netherlands", SE: "Sweden", NO: "Norway", PL: "Poland", TR: "Turkey",
    AE: "UAE", SG: "Singapore", KR: "South Korea", ID: "Indonesia", PH: "Philippines",
    PK: "Pakistan", BD: "Bangladesh", NG: "Nigeria", ZA: "South Africa", EG: "Egypt",
    AR: "Argentina", CO: "Colombia", XX: "Unknown",
};

export const countryCoordinates: Record<string, [number, number]> = {
    US: [-98, 39],
    IN: [78, 22],
    GB: [-2, 54],
    DE: [10, 51],
    FR: [2, 46],
    CA: [-106, 56],
    AU: [133, -25],
    BR: [-55, -10],
    JP: [138, 36],
    CN: [104, 35],
    RU: [100, 60],
    MX: [-102, 23],
    ES: [-4, 40],
    IT: [12, 42],
    NL: [5, 52],
    SE: [15, 62],
    NO: [10, 62],
    PL: [19, 52],
    TR: [35, 39],
    AE: [54, 24],
    SG: [103, 1],
    KR: [128, 36],
    ID: [113, -2],
    PH: [122, 12],
    PK: [69, 30],
    BD: [90, 24],
    NG: [8, 10],
    ZA: [25, -29],
    EG: [30, 27],
    AR: [-64, -34],
    CO: [-74, 4],
    XX: [0, 20],
};

export function getCountryCoords(code: string): [number, number] {
    return countryCoordinates[code.toUpperCase()] ?? countryCoordinates.XX;
}
