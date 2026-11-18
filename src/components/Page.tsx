import { ViewTransition, type ReactNode } from "react";

/** Every page fades and rises in when navigating; the header stays put. */
export default function Page({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
