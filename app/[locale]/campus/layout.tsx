import { createServerSupabase } from '@bze/db/server';
import { Header, BottomNav } from '@/components/shell';

export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let fortschritt = 0;
  if (user) {
    const { count: fertig } = await supabase.from('fragen_mastery')
      .select('*', { count: 'exact', head: true }).eq('status', 'abgeschlossen');
    const { count: gesamt } = await supabase.from('fragen_mastery')
      .select('*', { count: 'exact', head: true });
    if (gesamt && gesamt > 0) fortschritt = Math.round(((fertig ?? 0) / gesamt) * 100);
  }

  return (
    <div className="min-h-screen pb-20">
      <Header value={fortschritt} />
      {children}
      <BottomNav berichtsheftAktiv={false} />
    </div>
  );
}
