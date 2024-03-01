import React from "react";

const Avatar = ({ username, className = ''}) => {
    // Get the first letter of the username
    const initial = username ? username.charAt(0).toUpperCase() : '';

    return (
        <div>
            {username && username.avatar ? (
                <img
                    src={username.avatar}
                    alt={`${username}'s avatar`}
                    className={`rounded-full ${className}`}
                />
            ) : (
                <div className={`flex items-center justify-center bg-gray-300 text-gray-700 rounded-full ${className}`}>
                    {initial}
                </div>
            )}
        </div>
    );
};

export default Avatar;
