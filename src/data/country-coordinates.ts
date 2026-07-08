/** Approximate country centroids [longitude, latitude] for map markers */
export const countryNames: Record<string, string> = {
    AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AO: "Angola", AR: "Argentina",
    AM: "Armenia", AU: "Australia", AT: "Austria", AZ: "Azerbaijan",
    BD: "Bangladesh", BY: "Belarus", BE: "Belgium", BO: "Bolivia", BA: "Bosnia and Herzegovina",
    BR: "Brazil", BG: "Bulgaria",
    KH: "Cambodia", CM: "Cameroon", CA: "Canada", CL: "Chile", CN: "China",
    CO: "Colombia", CR: "Costa Rica", HR: "Croatia", CZ: "Czech Republic",
    DK: "Denmark", DO: "Dominican Republic",
    EC: "Ecuador", EG: "Egypt", ET: "Ethiopia",
    FI: "Finland", FR: "France",
    GE: "Georgia", DE: "Germany", GH: "Ghana", GR: "Greece", GT: "Guatemala",
    HN: "Honduras", HK: "Hong Kong", HU: "Hungary",
    IN: "India", ID: "Indonesia", IQ: "Iraq", IE: "Ireland", IL: "Israel", IT: "Italy",
    JP: "Japan", JO: "Jordan",
    KZ: "Kazakhstan", KE: "Kenya", KW: "Kuwait", KR: "South Korea",
    LB: "Lebanon", LY: "Libya", LT: "Lithuania",
    MY: "Malaysia", MX: "Mexico", MA: "Morocco",
    NP: "Nepal", NL: "Netherlands", NZ: "New Zealand", NG: "Nigeria", NO: "Norway",
    OM: "Oman",
    PK: "Pakistan", PA: "Panama", PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal",
    QA: "Qatar",
    RO: "Romania", RU: "Russia",
    SA: "Saudi Arabia", RS: "Serbia", SG: "Singapore", ZA: "South Africa",
    ES: "Spain", LK: "Sri Lanka", SE: "Sweden", CH: "Switzerland", SY: "Syria",
    TW: "Taiwan", TZ: "Tanzania", TH: "Thailand", TN: "Tunisia", TR: "Turkey",
    UA: "Ukraine", AE: "UAE", GB: "United Kingdom", US: "United States", UY: "Uruguay", UZ: "Uzbekistan",
    VE: "Venezuela", VN: "Vietnam",
    YE: "Yemen",
    ZM: "Zambia", ZW: "Zimbabwe",
    XX: "Unknown",
};

export const countryCoordinates: Record<string, [number, number]> = {
    AF: [67, 33],    AL: [20, 41],    DZ: [3, 28],     AO: [18, -12],   AR: [-64, -34],
    AM: [45, 40],    AU: [133, -25],  AT: [14, 47],    AZ: [47, 40],
    BD: [90, 24],    BY: [28, 53],    BE: [4, 50],     BO: [-65, -17],  BA: [17, 44],
    BR: [-55, -10],  BG: [25, 43],
    KH: [105, 12],   CM: [12, 6],     CA: [-106, 56],  CL: [-71, -30],  CN: [104, 35],
    CO: [-74, 4],    CR: [-84, 10],   HR: [15, 45],    CZ: [15, 50],
    DK: [10, 56],    DO: [-70, 19],
    EC: [-78, -2],   EG: [30, 27],    ET: [40, 9],
    FI: [26, 64],    FR: [2, 46],
    GE: [43, 42],    DE: [10, 51],    GH: [-2, 8],     GR: [22, 39],    GT: [-90, 15],
    HN: [-86, 15],   HK: [114, 22],   HU: [19, 47],
    IN: [78, 22],    ID: [113, -2],   IQ: [44, 33],    IE: [-8, 53],    IL: [35, 31],   IT: [12, 42],
    JP: [138, 36],   JO: [36, 31],
    KZ: [68, 48],    KE: [38, -1],    KW: [47, 29],    KR: [128, 36],
    LB: [35, 34],    LY: [17, 27],    LT: [24, 56],
    MY: [110, 4],    MX: [-102, 23],  MA: [-7, 32],
    NP: [84, 28],    NL: [5, 52],     NZ: [174, -41],  NG: [8, 10],     NO: [10, 62],
    OM: [57, 22],
    PK: [69, 30],    PA: [-80, 9],    PE: [-76, -10],  PH: [122, 12],   PL: [19, 52],   PT: [-8, 39],
    QA: [51, 25],
    RO: [25, 46],    RU: [100, 60],
    SA: [45, 24],    RS: [21, 44],    SG: [103, 1],    ZA: [25, -29],
    ES: [-4, 40],    LK: [81, 8],     SE: [15, 62],    CH: [8, 47],     SY: [38, 35],
    TW: [121, 24],   TZ: [35, -6],    TH: [101, 15],   TN: [9, 34],     TR: [35, 39],
    UA: [32, 49],    AE: [54, 24],    GB: [-2, 54],    US: [-98, 39],   UY: [-56, -33], UZ: [63, 41],
    VE: [-66, 8],    VN: [108, 14],
    YE: [48, 15],
    ZM: [28, -14],   ZW: [30, -20],
    XX: [0, 20],
};

export function hasCountryCoords(code: string): boolean {
    const c = code.toUpperCase();
    return c !== "XX" && c.length === 2 && c in countryCoordinates;
}

export function getCountryCoords(code: string): [number, number] {
    const c = code.toUpperCase();
    return countryCoordinates[c] ?? countryCoordinates.XX;
}
