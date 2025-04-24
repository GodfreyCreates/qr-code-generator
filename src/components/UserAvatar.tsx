import React, { useState } from 'react';

interface UserAvatarProps {
  userId: string;
  avatarUrl?: string | null;
  fullName?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  avatarUrl,
  fullName,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Get user initials from full name
  const getUserInitials = (name?: string | null) => {
    if (!name) return '?';
    
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  // Generate a consistent color based on user ID
  const getInitialsColor = (id: string) => {
    if (!id) return 'bg-primary-500';
    
    // Generate a deterministic color from userId
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const colors = [
      'bg-primary-500',
      'bg-secondary-500',
      'bg-accent-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-rose-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Size mapping
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-32 h-32 text-3xl',
  };
  
  const sizeClass = typeof size === 'string' ? sizeClasses[size] : `w-${size} h-${size}`;
  
  // Only render image if avatarUrl is valid and no error occurred during load
  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={fullName || 'User avatar'}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }
  
  // Fallback to initials
  return (
    <div className={`rounded-full flex items-center justify-center font-medium text-white ${sizeClass} ${getInitialsColor(userId)} ${className}`}>
      {getUserInitials(fullName)}
    </div>
  );
};

export default UserAvatar; 