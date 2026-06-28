export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    company: string;
}

export const testimonials: Testimonial[] = [
    {
        quote: "Rihan consistently ships production-ready features across our NestJS API and React frontends — from loan calculators to CRM integrations — with strong ownership and clear communication.",
        name: "Engineering Lead",
        role: "Technical leadership",
        company: "HomeAbroad Inc.",
    },
    {
        quote: "He architected our Next.js platform with SSE streaming search, dual-brand deployment, and analytics instrumentation — delivering fast, maintainable code under tight product deadlines.",
        name: "Product Engineering",
        role: "Platform team",
        company: "Ziffy.ai",
    },
    {
        quote: "Reliable full-stack engineer who handles webhooks, data pipelines, and cloud migrations end-to-end. Proactive debugger and strong collaborator in a fully remote setup.",
        name: "Cross-functional partner",
        role: "Operations & integrations",
        company: "Remote fintech team",
    },
];
