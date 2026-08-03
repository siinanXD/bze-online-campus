import { createServerSupabase } from '@bze/db/server';
import { CampusRahmen } from '@/components/shell/campus-rahmen';
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
    <CampusRahmen fortschritt={fortschritt} berichtsheftAktiv={true}>
      {children}
    </CampusRahmen>
  );
}
