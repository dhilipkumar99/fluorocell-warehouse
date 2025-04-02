'use client';

import React from 'react';

export default function SubmissionsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="mt-1 h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Table header skeleton */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-6 text-left">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                  <th className="py-3 px-6 text-left">
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                  <th className="py-3 px-6 text-left">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                  <th className="py-3 px-6 text-left">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Table rows skeleton */}
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-6">
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="px-3 py-1 rounded-full h-6 w-20 bg-gray-200 animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-36 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}