import type { User } from 'firebase/auth';
import UserMenu from '../UserMenu';

interface Props {
  user: User | null;
}

export default function AppHeader({ user }: Props) {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">Yep<em>!</em></div>
        <div className="tagline">stop overthinking — just go</div>
      </div>
      {user && <UserMenu user={user} />}
    </div>
  );
}
