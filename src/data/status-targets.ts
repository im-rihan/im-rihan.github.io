export interface StatusTarget {
    name: string;
    url: string;
    type: "internal" | "external";
}

export const statusTargets: StatusTarget[] = [
    {
        name: "Portfolio",
        url: "https://im-rihan.github.io/",
        type: "internal",
    },
    {
        name: "Resume PDF",
        url: "https://im-rihan.github.io/resume.pdf",
        type: "internal",
    },
    {
        name: "GitHub Profile",
        url: "https://github.com/im-rihan",
        type: "external",
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com/in/im-rihan",
        type: "external",
    },
];
