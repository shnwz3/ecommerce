import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#FCF3ED] py-8 sm:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-[#7B3D14]/10 rounded" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 sm:w-20">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-[#7B3D14]/10" />
              ))}
            </div>
            <div className="flex-1 pt-[125%] rounded-3xl bg-[#7B3D14]/15 shadow-sm" />
          </div>

          {/* Buy Box Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 w-32 bg-[#7B3D14]/15 rounded" />
            <div className="h-10 w-4/5 bg-[#7B3D14]/20 rounded-lg" />
            <div className="h-16 bg-white rounded-2xl border border-[#7B3D14]/10" />
            <div className="h-12 bg-[#7B3D14]/10 rounded-xl" />
            <div className="h-12 bg-[#7B3D14]/20 rounded-xl" />
            <div className="h-32 bg-white rounded-2xl border border-[#7B3D14]/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
