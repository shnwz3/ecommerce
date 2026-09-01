import React from "react";

export default function CollectionLoading() {
  return (
    <div className="min-h-screen bg-[#FCF3ED] py-8 sm:py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-40 bg-[#7B3D14]/10 rounded" />

        {/* Collection Hero Header Skeleton */}
        <div className="bg-white rounded-3xl p-8 border border-[#7B3D14]/15 shadow-sm space-y-3">
          <div className="h-4 w-32 bg-[#7B3D14]/15 rounded" />
          <div className="h-10 w-64 bg-[#7B3D14]/20 rounded-lg" />
          <div className="h-4 w-96 bg-[#7B3D14]/10 rounded" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="h-14 bg-white rounded-2xl border border-[#7B3D14]/15 shadow-sm" />

        {/* 4-column Product Grid Skeleton */}
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
  );
}
