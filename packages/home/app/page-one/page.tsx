"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

export default function Home() {
  return (
    <ViewTransition
      name="page"
      onEnter={(instance, types) => {
        console.log("test test onEnter", instance, types);
      }}
      onExit={(instance, types) => {
        console.log("test test onExit", instance, types);
      }}
      onShare={(instance, types) => {
        console.log("test test onShare", instance, types);
      }}
      onUpdate={(instance, types) => {
        console.log("test test onUpdate", instance, types);
      }}
    >
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-amber-700">
        page one
      </div>
    </ViewTransition>
  );
}
