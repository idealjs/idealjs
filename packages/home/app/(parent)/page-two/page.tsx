"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { unstable_ViewTransition as ViewTransition, useState } from "react";

import { layoutProxy, usePageName } from "../../components/LayoutProvider";

export default function Home() {
  const router = useRouter();
  const pageName = usePageName();

  return (
    <ViewTransition
      name={pageName}
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
      <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-amber-400">
        {/* <Link href="/page-three">prev</Link> */}
        <button
          onClick={() => {
            layoutProxy.pageName = "pageprev";
            router.push("/page-one");
          }}
        >
          prev
        </button>
        page two
        <button
          onClick={() => {
            layoutProxy.pageName = "page";
            router.push("/page-three");
          }}
        >
          next
        </button>
      </div>
    </ViewTransition>
  );
}
