import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";

const Projects = dynamic(() =>
    import("@/components/sections/Projects").then((m) => ({ default: m.Projects })),
);
const Testimonials = dynamic(() =>
    import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Education = dynamic(() =>
    import("@/components/sections/Education").then((m) => ({ default: m.Education })),
);
const Contact = dynamic(() =>
    import("@/components/sections/Contact").then((m) => ({ default: m.Contact })),
);

export default function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Testimonials />
            <Education />
            <Contact />
        </>
    );
}
