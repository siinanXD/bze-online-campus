import { createServerSupabase } from '@bze/db/server';
import { Header, BottomNav } from '@/components/shell';
import { ladeFragenFortschrittProzent } from './lernen/_lib/fragen';

export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let fortschritt = 0;
  if (user) {
    try {
      fortschritt = await ladeFragenFortschrittProzent(user.id);
    } catch (error) {
      console.error('Header-Fortschritt konnte nicht geladen werden.', error);
      fortschritt = 0;
    }
  }

  return (
    <div className="flex h-dvh min-h-dvh flex-col overflow-hidden bg-bg pb-20">
      <Header value={fortschritt} />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
      <BottomNav berichtsheftAktiv={true} />
    </div>
  );
}
