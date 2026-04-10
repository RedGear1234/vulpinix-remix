import { useLocation, useOutlet } from "react-router";
import { AnimatePresence } from "motion/react";

export function AnimatedRoutes() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        {outlet}
      </div>
    </AnimatePresence>
  );
}
