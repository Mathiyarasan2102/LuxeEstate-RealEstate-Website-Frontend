
import React from 'react';
import { Skeleton } from './Skeleton';

export { Skeleton };

export const PropertyCardSkeleton = () => {
    return (
        <div className="bg-navy-800 rounded-xl overflow-hidden shadow-lg border border-navy-700 h-full flex flex-col">
            {/* Image Skeleton */}
            <Skeleton className="w-full h-64" />

            <div className="p-6 flex flex-col flex-grow space-y-4">
                {/* Title and Price */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2 w-2/3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>

                {/* Location */}
                <Skeleton className="h-4 w-full" />

                {/* Stats Row */}
                <div className="flex justify-between pt-4 border-t border-navy-700 mt-auto">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
};

export const PropertyDetailSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Hero Image Skeleton */}
            <div className="relative h-[40vh] sm:h-[50vh] bg-navy-800 w-full mb-8">
                <div className="absolute inset-0 bg-navy-900/50" />
                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto space-y-4">
                    <Skeleton className="h-10 w-1/2 sm:w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 bg-navy-800 p-6 rounded-lg border border-navy-700">
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
        </div>
    )
}

export const AboutSkeleton = () => {
    return (
        <div className="min-h-screen bg-navy-900">
            {/* Hero Skeleton */}
            <div className="h-[400px] w-full bg-navy-800 relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                    <Skeleton className="h-16 w-3/4 max-w-2xl bg-navy-700" />
                    <Skeleton className="h-6 w-1/2 max-w-lg bg-navy-700" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 space-y-20">
                {/* Story Section */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-48 mb-6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <Skeleton className="h-12 w-12 rounded-full mb-2" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const NotificationSkeleton = () => {
    return (
        <div className="divide-y divide-navy-700">
            {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-3">
                    <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-navy-700" />
                            <Skeleton className="h-3 w-1/3 bg-navy-700" />
                        </div>
                        <Skeleton className="h-2 w-2 rounded-full mt-1.5" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const AuthSkeleton = ({ isRegister = false }) => {
    return (
        <div className="w-full max-w-md bg-navy-800 p-8 rounded-lg shadow-xl border border-navy-700 space-y-6">
            <div className="flex justify-center mb-6">
                <Skeleton className="h-10 w-3/4" />
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" /> {/* Label */}
                    <Skeleton className="h-12 w-full rounded-md" /> {/* Input */}
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>

                {isRegister && (
                    <>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-12 w-full rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-12 w-full rounded-md" />
                        </div>
                    </>
                )}

                <Skeleton className="h-12 w-full rounded-md mt-6" /> {/* Button */}
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex items-center justify-center space-x-2">
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-4 w-8 rounded-full" />
                    <Skeleton className="h-px w-full" />
                </div>
                <Skeleton className="h-12 w-full rounded-md" /> {/* Google Button */}
                <div className="flex justify-center mt-4">
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
};
