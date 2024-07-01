"use client";
import { reuleaux } from "ldrs";

reuleaux.register();

export default function Loading() {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <l-reuleaux
        size="37"
        stroke="5"
        stroke-length="0.15"
        bg-opacity="0.4"
        speed="1.2"
        color="#ffcc01"
      ></l-reuleaux>
    </div>
  );
}
