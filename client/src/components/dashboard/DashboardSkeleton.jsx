import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-gray-100 border border-gray-200 rounded-lg p-4 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                                <div className="h-6 bg-gray-300 rounded w-12"></div>
                                <div className="h-3 bg-gray-300 rounded w-24"></div>
                            </div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transactions Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg animate-pulse">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-16 ml-auto"></div>
                                    <div className="h-3 bg-gray-200 rounded w-20 ml-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RFID Skeleton */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                    <div className="space-y-3">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg animate-pulse">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="bg-white rounded-lg border-gray-300 shadow-md border p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center animate-pulse">
                            <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Summary Skeleton */}
            <div className="bg-gray-50 border-gray-300 shadow-md rounded-lg p-4 border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    {[...Array(3)].map((_, index) => (
                        <div key={index}>
                            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
