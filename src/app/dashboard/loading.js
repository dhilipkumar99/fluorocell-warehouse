'use client';

import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="mt-1 h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Upload form skeleton */}
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
              
              <div className="space-y-4">
                <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-32 border-2 border-dashed rounded-lg border-gray-200 flex items-center justify-center">
                  <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
              
              {/* Recent submissions skeleton */}
              <div className="mt-4 space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-4"></div>
              
              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-gray-100 p-4 animate-pulse">
                  <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
                
                <div className="rounded-md bg-gray-100 p-4 animate-pulse">
                  <div className="h-5 w-36 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}