import React, { useState, useEffect } from 'react';

const UserAvatar = ({ user, className = "h-8 w-8", textSize = "text-sm", showBorder = true, padding = "", borderWidth = "border-2" }) => {
    const [imgError, setImgError] = useState(false);

    // Reset error state if user changes
    useEffect(() => {
        setImgError(false);
    }, [user?.avatar]);

    // Check if we should fallback to initials
    // 1. No avatar URL
    // 2. Avatar URL is a legacy ui-avatars link (we want to replace these with our styled div)
    // 3. Image failed to load
    const shouldShowInitials = !user?.avatar ||
        user.avatar.includes('ui-avatars.com') ||
        imgError;

    const InnerContent = ({ isWrapped }) => {
        const sizeClass = isWrapped ? "w-full h-full" : className;

        if (shouldShowInitials) {
            return (
                <div
                    className={`${sizeClass} rounded-full bg-[#1e293b] flex items-center justify-center text-[#fbbf24] font-serif font-bold uppercase select-none ${textSize} ${!isWrapped && showBorder ? 'border border-[#fbbf24]' : ''}`}
                    title={user?.name || 'User'}
                >
                    {user?.name?.charAt(0) || 'U'}
                </div>
            );
        }

        return (
            <img
                src={user.avatar}
                alt={user?.name || 'User'}
                className={`${sizeClass} rounded-full object-cover ${!isWrapped && showBorder ? 'border border-[#fbbf24]' : ''}`}
                onError={() => setImgError(true)}
                loading="lazy"
            />
        );
    };

    if (showBorder) {
        return (
            <div className={`${className} rounded-full ${borderWidth} border-[#fbbf24] ${padding}`}>
                <div className="h-full w-full rounded-full overflow-hidden">
                    <InnerContent isWrapped={true} />
                </div>
            </div>
        );
    }

    return <InnerContent isWrapped={false} />;
};

export default UserAvatar;
