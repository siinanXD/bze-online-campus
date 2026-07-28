import { getTranslations } from 'next-intl/server';
import { Card } from '@bze/ui';
import { ladeAdminSitzung } from '../../_lib/auth';
import type { Kohorte } from '../../_lib/types';
import { NeuFormular } from './neu-formular';

export const dynamic = 'force-dynamic';

export default async function NutzerAnlegenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('admin');
  const sitzung = await ladeAdminSitzung();
  if (!sitzung) return null;

  const { data } = await sitzung.supabase
    .from('kohorten')
    .select('id, traeger_id, beruf_id, bezeichnung, start_datum, end_datum, beitrittscode')
    .eq('traeger_id', sitzung.profil.traeger_id)
    .order('start_datum', { ascending: false });
  const kohorten = (data ?? []) as Kohorte[];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{t('nutzer.anlegen')}</h2>
      <Card>
        <NeuFormular
          locale={locale}
          kohorten={kohorten.map((k) => ({ id: k.id, bezeichnung: k.bezeichnung }))}
          erlaubteRollen={sitzung.profil.rolle === 'admin' ? ['teilnehmer', 'ausbilder', 'verwaltung', 'admin'] : ['teilnehmer', 'ausbilder']}
        />
      </Card>
    </div>
  );
}
