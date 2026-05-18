import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountClient from './AccountClient';

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user as { id: string; name?: string | null; email?: string | null; role?: string };
  const isAdmin = user.role === 'ADMIN';

  return (
    <AccountClient
      userId={user.id}
      initialName={user.name ?? ''}
      email={user.email ?? ''}
      role={user.role ?? 'VIEWER'}
      isAdmin={isAdmin}
    />
  );
}

export { signOut };
