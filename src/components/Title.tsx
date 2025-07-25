import type { ReactNode } from "react";

export default function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mb-8">
      {children}
    </h1>
  );
}
