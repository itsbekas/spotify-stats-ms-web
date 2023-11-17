import { AuthToken } from '@/lib/auth/token';

export default function Home() {
  return (
    <div>
      {AuthToken.isLoggedIn() ? 'Logged in' : 'Not logged in'}
    </div>
  )
}
