import type { User } from 'firebase/auth';
import { signOutUser } from '../../lib/firebase/authService';

interface Props {
  user: User;
}

export default function UserMenu({ user }: Props) {
  return (
    <div className="user-menu">
      {user.photoURL && (
        <img
          className="user-avatar"
          src={user.photoURL}
          alt={user.displayName ?? 'User'}
          referrerPolicy="no-referrer"
        />
      )}
      <button className="user-signout" onClick={signOutUser}>
        Sign out
      </button>
    </div>
  );
}
