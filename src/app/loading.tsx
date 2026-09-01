import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FCF3ED] py-8 sm:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Skeleton */}
        <div className="w-full h-[400px] sm:h-[520px] rounded-3xl bg-[#7B3D14]/10 shadow-sm" />

        {/* Categories Row Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-[#7B3D14]/10 rounded-full mx-auto" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#7B3D14]/10" />
                <div className="h-3 w-16 bg-[#7B3D14]/10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-64 bg-[#7B3D14]/10 rounded-full mx-auto" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-3 border border-[#7B3D14]/10 space-y-3">
                <div className="w-full pt-[133%] rounded-xl bg-[#7B3D14]/10" />
                <div className="h-4 w-3/4 bg-[#7B3D14]/10 rounded" />
                <div className="h-4 w-1/2 bg-[#7B3D14]/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
