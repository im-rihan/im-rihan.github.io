import { domMax } from "framer-motion";

/**
 * Loaded via dynamic import() from `LazyMotion` (see Providers.tsx), so the
 * animation engine ships as its own async chunk instead of bundling eagerly
 * into every page's first-load JS. `domMax` (not the smaller `domAnimation`)
 * is required because Education.tsx uses layout animations (`layout` prop +
 * `LayoutGroup`), which only `domMax` supports.
 */
export default domMax;
