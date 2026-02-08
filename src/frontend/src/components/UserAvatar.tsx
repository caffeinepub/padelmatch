import { ExternalBlob } from '../backend';
import { User } from 'lucide-react';

interface UserAvatarProps {
  photo?: ExternalBlob;
  name: string;
  className?: string;
}

export default function UserAvatar({ photo, name, className = '' }: UserAvatarProps) {
  if (photo) {
    return (
      <img
        src={photo.getDirectURL()}
        alt={name}
        className={className || 'h-full w-full object-cover'}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-emerald-200 to-blue-200 dark:from-emerald-800 dark:to-blue-800 ${className || 'h-full w-full'}`}>
      <User className="h-1/3 w-1/3 text-emerald-600 dark:text-emerald-300" />
    </div>
  );
}
