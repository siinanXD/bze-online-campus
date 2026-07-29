import { createServerSupabase } from '@bze/db/server';
import { Header, BottomNav } from '@/components/shell';
import { ladeBerufFortschrittProzent } from './fortschritt/_lib/queries';

export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let fortschritt = 0;
  if (user) {
    try {
      fortschritt = await ladeBerufFortschrittProzent(user.id);
    } catch {
      fortschritt = 0;
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <Header value={fortschritt} />
      {children}
      <BottomNav berichtsheftAktiv={true} />
    </div>
  );
}
