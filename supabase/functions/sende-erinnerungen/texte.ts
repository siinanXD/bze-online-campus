// @ts-nocheck — Deno-Laufzeit (Supabase Edge Function).
//
// Push-Texte in den sechs Sprachen der Plattform.
//
// Bewusste, dokumentierte Duplikation der `push.*`-Zweige aus `messages/*.json`:
// die Edge Function wird isoliert deployt und soll ohne Zugriff auf das
// Next.js-Projekt auskommen. Es sind reine Texte, keine Logik — die
// Entscheidung, *ob* gesendet wird, liegt weiterhin allein in
// `packages/core/benachrichtigung` und wird von hier nur aufgerufen.
//
// Die Schlüssel entsprechen `titelKey`/`textKey` aus `nutzlast.ts`, aber ohne
// das führende `push.` — die Function bekommt aus der Domain z. B.
// `push.serie_gefaehrdet.titel` und schlägt hier `serie_gefaehrdet.titel` nach.

type Sprache = 'de' | 'en' | 'fr' | 'ar' | 'uk' | 'tr';

const STANDARD_SPRACHE: Sprache = 'de';

// Reihenfolge der Sprachen in den Tupeln.
const SPRACHEN: Sprache[] = ['de', 'en', 'fr', 'ar', 'uk', 'tr'];

// Schlüssel -> [de, en, fr, ar, uk, tr]
const TEXTE: Record<string, [string, string, string, string, string, string]> = {
  'faellige_wiederholung.titel': [
    '{anzahl} Fragen sind fällig',
    '{anzahl} questions are due',
    '{anzahl} questions à réviser',
    '{anzahl} أسئلة مستحقة',
    'Час повторити {anzahl} запитань',
    '{anzahl} sorunun zamanı geldi',
  ],
  'faellige_wiederholung.text': [
    'Ein paar Minuten reichen, um sie zu wiederholen.',
    'A few minutes are enough to go through them.',
    'Quelques minutes suffisent pour les revoir.',
    'بضع دقائق تكفي لمراجعتها.',
    'Кількох хвилин достатньо, щоб їх пройти.',
    'Onları gözden geçirmek için birkaç dakika yeter.',
  ],
  'faellige_wiederholung_fehler.titel': [
    '{fehler} Fragen von letztem Mal warten',
    '{fehler} questions from last time are waiting',
    '{fehler} questions de la dernière fois vous attendent',
    '{fehler} أسئلة من المرة السابقة تنتظرك',
    '{fehler} запитань з минулого разу чекають',
    'Geçen seferden {fehler} soru bekliyor',
  ],
  'faellige_wiederholung_fehler.text': [
    'Fehler sitzen am schnellsten, wenn du sie gleich noch einmal ansiehst.',
    'Mistakes stick fastest when you look at them again right away.',
    'Les erreurs s’ancrent le plus vite lorsqu’on les revoit tout de suite.',
    'الأخطاء تترسّخ بسرعة عندما تراجعها فوراً.',
    'Помилки засвоюються найшвидше, коли переглянути їх одразу.',
    'Hatalar hemen yeniden bakıldığında en hızlı yerleşir.',
  ],
  'serie_gefaehrdet.titel': [
    'Deine Serie steht bei {tage} Tagen',
    'Your streak stands at {tage} days',
    'Votre série est à {tage} jours',
    'سلسلتك بلغت {tage} أيام',
    'Ваша серія — {tage} днів',
    'Serin {tage} günde',
  ],
  'serie_gefaehrdet.text': [
    'Eine Frage heute genügt, damit sie weiterläuft.',
    'One question today is enough to keep it going.',
    'Une seule question aujourd’hui suffit à la maintenir.',
    'سؤال واحد اليوم يكفي لاستمرارها.',
    'Одного запитання сьогодні достатньо, щоб її продовжити.',
    'Bugün bir soru onu sürdürmeye yeter.',
  ],
  'tagesziel_offen.titel': [
    'Noch {offen} Fragen bis zum Tagesziel',
    '{offen} questions left to your daily goal',
    'Encore {offen} questions avant votre objectif quotidien',
    'بقيت {offen} أسئلة حتى الهدف اليومي',
    'Залишилось {offen} запитань до денної мети',
    'Günlük hedefine {offen} soru kaldı',
  ],
  'tagesziel_offen.text': [
    'Das schaffst du vor dem Feierabend.',
    'You can manage that before the day is done.',
    'Vous y arriverez avant la fin de la journée.',
    'يمكنك إنجاز ذلك قبل نهاية اليوم.',
    'Ви впораєтеся до кінця дня.',
    'Bunu gün bitmeden başarırsın.',
  ],
  'wochenpruefung_offen.titel': [
    'Die Wochenprüfung steht noch aus',
    'The weekly exam is still open',
    'L’examen hebdomadaire reste à passer',
    'الاختبار الأسبوعي ما زال معلّقاً',
    'Тижневий іспит ще не складено',
    'Haftalık sınav hâlâ bekliyor',
  ],
  'wochenpruefung_offen.text': [
    'Sie läuft im Originalformat der Kammerprüfung.',
    'It runs in the original format of the chamber exam.',
    'Il se déroule au format original de l’examen de la chambre.',
    'يجري بالصيغة الأصلية لاختبار الغرفة.',
    'Він проходить в оригінальному форматі екзамену палати.',
    'Oda sınavının özgün biçiminde yapılır.',
  ],
  'nachweis_luecke.titel': [
    '{anzahl} Wochen im Ausbildungsnachweis fehlen',
    '{anzahl} weeks are missing in your training record',
    '{anzahl} semaines manquent dans votre justificatif de formation',
    '{anzahl} أسابيع ناقصة في سجل التدريب',
    'У записі навчання не вистачає {anzahl} тижнів',
    'Eğitim kaydında {anzahl} hafta eksik',
  ],
  'nachweis_luecke.text': [
    'Nachtragen geht schneller, solange du dich noch erinnerst.',
    'Filling them in is quicker while you still remember.',
    'Les compléter est plus rapide tant que vous vous en souvenez.',
    'استدراكها أسرع ما دمت تتذكّر.',
    'Заповнити їх швидше, поки ви ще пам’ятаєте.',
    'Hatırladığın sürece tamamlamak daha hızlıdır.',
  ],
  'nachweis_entschieden.titel': [
    'Dein Ausbilder hat entschieden',
    'Your instructor has decided',
    'Votre formateur a tranché',
    'اتخذ مدرّبك قراراً',
    'Ваш інструктор ухвалив рішення',
    'Eğitmenin karar verdi',
  ],
  'nachweis_entschieden.text': [
    'Sieh im Berichtsheft nach, was zu tun ist.',
    'Check the report book to see what to do.',
    'Consultez le carnet de formation pour savoir quoi faire.',
    'راجع دفتر التقارير لمعرفة ما يجب فعله.',
    'Перегляньте щоденник навчання, щоб дізнатися, що робити.',
    'Ne yapılacağını görmek için eğitim defterine bak.',
  ],
  'wochenbericht_bereit.titel': [
    'Dein Wochenbericht ist da',
    'Your weekly report has arrived',
    'Votre rapport hebdomadaire est arrivé',
    'تقريرك الأسبوعي جاهز',
    'Ваш тижневий звіт готовий',
    'Haftalık raporun geldi',
  ],
  'wochenbericht_bereit.text': [
    'Mit den Merksätzen aus dieser Woche.',
    'With this week’s key points.',
    'Avec les points clés de cette semaine.',
    'مع النقاط الأساسية لهذا الأسبوع.',
    'З ключовими тезами цього тижня.',
    'Bu haftanın önemli notlarıyla.',
  ],
};

/** Rechtsläufige Sprachen — nur Arabisch im aktuellen Sprachsatz. */
const RTL_SPRACHEN: Sprache[] = ['ar'];

/** Ist die Sprache rechtsläufig? Bestimmt die `dir`-Angabe der Meldung. */
export function istRtl(sprache: string): boolean {
  return RTL_SPRACHEN.includes(sprache as Sprache);
}

/** Bringt eine beliebige Spracheingabe auf eine bekannte Sprache. */
export function normalisiereSprache(sprache: string | null | undefined): Sprache {
  const kurz = (sprache ?? '').slice(0, 2).toLowerCase();
  return SPRACHEN.includes(kurz as Sprache) ? (kurz as Sprache) : STANDARD_SPRACHE;
}

/**
 * Setzt Platzhalter der Form `{name}` aus den Werten ein.
 *
 * Ein fehlender Wert bleibt als leerer String stehen, statt `{name}` sichtbar
 * zu lassen — eine halbe Meldung ist besser als eine mit sichtbarem Platzhalter.
 */
function fuelleWerte(vorlage: string, werte: Record<string, number | string>): string {
  return vorlage.replace(/\{(\w+)\}/g, (_treffer, name) => {
    const wert = werte[name];
    return wert === undefined || wert === null ? '' : String(wert);
  });
}

/**
 * Löst einen Übersetzungsschlüssel in der Zielsprache auf und füllt die Werte.
 *
 * `schluessel` kommt aus der Domain mit führendem `push.` — das wird hier
 * entfernt. Fehlt ein Schlüssel (etwa nach einer Textumbenennung), fällt die
 * Function auf Deutsch zurück und, wenn auch das fehlt, auf den Rohschlüssel;
 * so verschwindet eine Meldung nie ganz.
 */
export function loeseText(
  schluessel: string,
  sprache: Sprache,
  werte: Record<string, number | string>,
): string {
  const ohnePraefix = schluessel.replace(/^push\./, '');
  const zeile = TEXTE[ohnePraefix];
  if (!zeile) return ohnePraefix;
  const index = SPRACHEN.indexOf(sprache);
  const vorlage = zeile[index] || zeile[0];
  return fuelleWerte(vorlage, werte);
}
