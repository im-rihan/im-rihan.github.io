export type CertIssuer = "udemy" | "fcc" | "institute";

export interface Certification {
    title: string;
    issuer: CertIssuer;
    issuerLabel: string;
    date: string;
    dateLabel: string;
    url?: string;
}

export const certifications: Certification[] = [
    {
        title: "Web Development Masterclass — Online Certification Course",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2026-06",
        dateLabel: "Jun 2026",
        url: "https://www.udemy.com/certificate/UC-8533cbd5-6435-4be7-a9bc-cfd3012fc79e",
    },
    {
        title: "Practical Database Course for Beginners: 6 courses in 1",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2022-05",
        dateLabel: "May 2022",
        url: "https://www.udemy.com/certificate/UC-da0e2766-ade6-4cb1-bcec-c4c5bd43f8d2",
    },
    {
        title: "Build an Amazon Affiliate E-Commerce Store from Scratch",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2022-05",
        dateLabel: "May 2022",
        url: "https://www.udemy.com/certificate/UC-ba7fccd0-136f-45e1-87e2-39633d2dfb6b",
    },
    {
        title: "Practical MongoDB + PHP: For Absolute Beginners",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2022-05",
        dateLabel: "May 2022",
        url: "https://www.udemy.com/certificate/UC-cef5a378-4e31-4b4c-8bdf-77d9e0e50b65",
    },
    {
        title: "Complete NodeJS course with express, socket io and MongoDB",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2022-05",
        dateLabel: "May 2022",
        url: "https://www.udemy.com/certificate/UC-527dcd6c-6385-4c7d-aeef-410ba2ba4c6f",
    },
    {
        title: "React — The Complete Guide with React Hook Redux in 4hr",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2021-12",
        dateLabel: "Dec 2021",
        url: "https://www.udemy.com/certificate/UC-2b018502-800e-410d-a826-a97f080aa88b",
    },
    {
        title: "Python 3 Ultimate Guide",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2021-11",
        dateLabel: "Nov 2021",
        url: "https://www.udemy.com/certificate/UC-b2ca7ac9-93b9-43c0-8a08-4f60bebdbf8c",
    },
    {
        title: "JavaScript, Bootstrap & PHP",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2021-09",
        dateLabel: "Sep 2021",
        url: "https://www.udemy.com/certificate/UC-352075eb-9b2b-4d95-b553-f8c3e68eeb55",
    },
    {
        title: "Javascript & Jquary",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2021-08",
        dateLabel: "Aug 2021",
        url: "https://www.udemy.com/certificate/UC-f3d6434c-c648-419a-b412-36f9be1e0f3e",
    },
    {
        title: "Adobe Photoshop CC 2015",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2021-07",
        dateLabel: "Jul 2021",
        url: "https://www.udemy.com/certificate/UC-927d0367-3a42-46a3-b274-8fad2f4de612",
    },
    {
        title: "Introduction to Programming Using HTML and CSS",
        issuer: "udemy",
        issuerLabel: "Udemy",
        date: "2021-07",
        dateLabel: "Jul 2021",
        url: "https://www.udemy.com/certificate/UC-690f8445-4e48-4b40-a156-c44868f4529e",
    },
    {
        title: "JavaScript Algorithms and Data Structures",
        issuer: "fcc",
        issuerLabel: "freeCodeCamp",
        date: "2021-07",
        dateLabel: "Jul 2021",
        url: "https://www.freecodecamp.org/certification/rihanmohammed26/javascript-algorithms-and-data-structures",
    },
    {
        title: "Responsive Web Design",
        issuer: "fcc",
        issuerLabel: "freeCodeCamp",
        date: "2021-07",
        dateLabel: "Jul 2021",
        url: "https://www.freecodecamp.org/certification/rihanmohammed26/responsive-web-design",
    },
    {
        title: "Post Graduate Diploma In Computer Application",
        issuer: "institute",
        issuerLabel: "Survey Institute",
        date: "2020-10",
        dateLabel: "Oct 2020",
    },
];

export const certFilterCounts = {
    all: certifications.length,
    udemy: certifications.filter((c) => c.issuer === "udemy").length,
    fcc: certifications.filter((c) => c.issuer === "fcc").length,
    institute: certifications.filter((c) => c.issuer === "institute").length,
};
