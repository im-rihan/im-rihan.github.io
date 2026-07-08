import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  // eslint-config-next only wires up a handful of jsx-a11y rules; the full
  // "recommended" ruleset catches far more (label association, keyboard
  // handlers on interactive elements, redundant/invalid ARIA, etc.) and is
  // the closest thing to an automated axe-core pass available at lint time.
  // Only the rules are merged in (not `plugins`) since `next` already
  // registers the jsx-a11y plugin instance.
  {
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // eslint-config-next's core-web-vitals preset now enables
    // eslint-plugin-react-hooks v7's React Compiler-readiness rules as
    // errors. This project doesn't use the React Compiler, and these rules
    // flag a large number of intentional, idiomatic patterns that predate
    // them — data fetching via useEffect + setState, mutating three.js
    // scene/ref state inside R3F's useFrame, and reading a ref during render
    // to gate a conditional mount. Downgraded to warnings so they surface in
    // editors/CI logs without failing the build for code that isn't broken.
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // The 3D scene modules are built entirely on react-three-fiber, whose
    // core rendering model *requires* the exact patterns the React Compiler
    // rules forbid: mutating the mutable three.js scene graph and refs inside
    // useFrame, reading refs during render to mount pooled meshes, and seeding
    // geometry with randomness. These are correct-by-design for r3f and cannot
    // be rewritten to satisfy the compiler rules, so they're disabled here
    // rather than scattering dozens of inline disables across the files.
    files: ["src/components/effects/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
