import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AbfallwegTrainer,
  AnsichtenSchema,
  AnsichtenTrainer,
  AluminiumSchema,
  AluminiumTrainer,
  ArbeitsplanSchema,
  ArbeitsplanTrainer,
  AussenmessungSchema,
  AussenmessungTrainer,
  BemassungSchema,
  BemassungTrainer,
  BetriebsstoffeSchema,
  BetriebsstoffZuordnungTrainer,
  BuegelmessschraubeSchema,
  BuegelmessschraubeTrainer,
  DichteSchema,
  DichteTrainer,
  EisenStahlSchema,
  EisenStahlTrainer,
  EinzugQuetschstellenSchema,
  GefahrbereichTrainer,
  GefahrstoffEtikettSchema,
  GefahrstoffEtikettTrainer,
  GefahrstellenTrainer,
  GefahrenstellenBild,
  FlaechenSchema,
  FlaechenTrainer,
  GeschwindigkeitSchema,
  GeschwindigkeitTrainer,
  GusseisenSchema,
  GusseisenTrainer,
  InnenTiefenmessungSchema,
  InnenTiefenmessungTrainer,
  InteraktiveBegriffListe,
  InteraktiverMessschieber,
  InteraktivesToleranzfeld,
  KalibrierenJustierenEichenSchema,
  KalibrierenJustierenEichenTrainer,
  KuehlschmierstoffSchema,
  KuehlschmierstoffTrainer,
  KunststoffAbfallSchema,
  KunststoffAbfallTrainer,
  KupferSchema,
  KupferTrainer,
  AdditiveMasterbatchSchema,
  AdditiveMasterbatchTrainer,
  LaengenUmrechnungSchema,
  LaengenUmrechnungTrainer,
  DuroplastSchema,
  DuroplastTrainer,
  ElastomerSchema,
  ElastomerTrainer,
  GranulatChargeRezyklatSchema,
  GranulatChargeRezyklatTrainer,
  HaerteSchema,
  HaerteTrainer,
  LehrenSchema,
  LehrenTrainer,
  LinienartenSchema,
  LinienartenTrainer,
  MassstabSchema,
  MassstabTrainer,
  FestigkeitSchema,
  FestigkeitTrainer,
  ZaehigkeitSproedigkeitSchema,
  ZaehigkeitSproedigkeitTrainer,
  ElastischPlastischSchema,
  ElastischPlastischTrainer,
  DichteVergleichSchema,
  DichteVergleichTrainer,
  WaermeausdehnungSchema,
  WaermeausdehnungTrainer,
  KorrosionSchema,
  KorrosionTrainer,
  WerkstoffauswahlSchema,
  WerkstoffauswahlTrainer,
  WelleAchseSchema,
  WelleAchseTrainer,
  LagerartenSchema,
  LagerartenTrainer,
  GleitlagerSchema,
  GleitlagerTrainer,
  WaelzlagerSchema,
  WaelzlagerTrainer,
  KupplungSchema,
  KupplungTrainer,
  ZahnradgetriebeSchema,
  ZahnradgetriebeTrainer,
  RiemenantriebSchema,
  RiemenantriebTrainer,
  KettenantriebSchema,
  KettenantriebTrainer,
  SchraubenMutternSchema,
  SchraubenMutternTrainer,
  FedernDaempferSchema,
  FedernDaempferTrainer,
  FertigungHauptgruppenSchema,
  FertigungHauptgruppenTrainer,
  SpanendSpanlosSchema,
  SpanendSpanlosTrainer,
  SchnittVorschubSchema,
  SchnittVorschubTrainer,
  SchnittgeschwindigkeitSchema,
  SchnittgeschwindigkeitTrainer,
  DrehzahlBerechnenSchema,
  DrehzahlBerechnenTrainer,
  VorschubZustellungSchema,
  VorschubZustellungTrainer,
  WerkzeugverschleissSchema,
  WerkzeugverschleissTrainer,
  KuehlschmierstoffFertigungSchema,
  KuehlschmierstoffFertigungTrainer,
  WerkzeugdatenSchema,
  WerkzeugdatenTrainer,
  BearbeitungszeitSchema,
  BearbeitungszeitTrainer,
  SaegeSchema,
  SaegeTrainer,
  BohrenSchema,
  BohrenTrainer,
  SenkenReibenSchema,
  SenkenReibenTrainer,
  GewindeschneidenSchema,
  GewindeschneidenTrainer,
  DrehenGrundlagenSchema,
  DrehenGrundlagenTrainer,
  LaengsPlanDrehenSchema,
  LaengsPlanDrehenTrainer,
  FraesenGrundlagenSchema,
  FraesenGrundlagenTrainer,
  UmfangStirnFraesenSchema,
  UmfangStirnFraesenTrainer,
  SchleifenSchema,
  SchleifenTrainer,
  StanzenSchneidenSchema,
  StanzenSchneidenTrainer,
  BiegenSchema,
  BiegenTrainer,
  WalzenSchema,
  WalzenTrainer,
  TiefziehenSchema,
  TiefziehenTrainer,
  PressenSchema,
  PressenTrainer,
  SchmiedenSchema,
  SchmiedenTrainer,
  GiessenSchema,
  GiessenTrainer,
  SchweissenSchema,
  SchweissenTrainer,
  LoetenSchema,
  LoetenTrainer,
  KlebenSchema,
  KlebenTrainer,
  SchraubenNietenSchema,
  SchraubenNietenTrainer,
  SpritzgiessmaschineSchema,
  SpritzgiessmaschineTrainer,
  MaterialtrichterTrocknungSchema,
  MaterialtrichterTrocknungTrainer,
  SchneckeZylinderSchema,
  SchneckeZylinderTrainer,
  EinzugszoneSchema,
  EinzugszoneTrainer,
  KompressionszoneSchema,
  KompressionszoneTrainer,
  MeteringzoneSchema,
  MeteringzoneTrainer,
  RueckstromsperreDueseSchema,
  RueckstromsperreDueseTrainer,
  WerkzeugKavitaetSchema,
  WerkzeugKavitaetTrainer,
  AngussEntlueftungSchema,
  AngussEntlueftungTrainer,
  AuswerferEntformenSchema,
  AuswerferEntformenTrainer,
  WerkzeugtemperierungSchema,
  WerkzeugtemperierungTrainer,
  PlastifizierenDosierenSchema,
  PlastifizierenDosierenTrainer,
  EinspritzenUmschaltpunktSchema,
  EinspritzenUmschaltpunktTrainer,
  NachdruckSchema,
  NachdruckTrainer,
  KuehlzeitRestkuehlzeitSchema,
  KuehlzeitRestkuehlzeitTrainer,
  SchliesskraftSchema,
  SchliesskraftTrainer,
  SpritzgiessParameterSchema,
  SpritzgiessParameterTrainer,
  SpritzgiesszyklusSchema,
  SpritzgiesszyklusTrainer,
  ExtruderAufbauSchema,
  ExtruderAufbauTrainer,
  ExtrusionsprodukteSchema,
  ExtrusionsprodukteTrainer,
  BlasformenSchema,
  BlasformenTrainer,
  ThermoformenSchema,
  ThermoformenTrainer,
  SchwindungVerzugSchema,
  SchwindungVerzugTrainer,
  MolekuelorientierungSchema,
  MolekuelorientierungTrainer,
  FarbMaterialwechselSchema,
  FarbMaterialwechselTrainer,
  AuftragZeichnungAbgleichSchema,
  AuftragZeichnungAbgleichTrainer,
  MaterialChargePruefenSchema,
  MaterialChargePruefenTrainer,
  WerkzeugVorbereitenSchema,
  WerkzeugVorbereitenTrainer,
  MaschineRuestenSchema,
  MaschineRuestenTrainer,
  ParameterUebernehmenSchema,
  ParameterUebernehmenTrainer,
  ErstteilHerstellenSchema,
  ErstteilHerstellenTrainer,
  ErstteilPruefenSchema,
  ErstteilPruefenTrainer,
  ProduktionsfreigabeSchema,
  ProduktionsfreigabeTrainer,
  WerkzeugwechselVorbereitungSchema,
  WerkzeugwechselVorbereitungTrainer,
  AnfahrenAbfahrenSchema,
  AnfahrenAbfahrenTrainer,
  SchichtuebergabeSchema,
  SchichtuebergabeTrainer,
  ProduktionsdatenQualitaetSchema,
  ProduktionsdatenQualitaetTrainer,
  QualitaetBetriebSchema,
  QualitaetBetriebTrainer,
  SollIstNennmassSchema,
  SollIstNennmassTrainer,
  GrenzmasseToleranzSchema,
  GrenzmasseToleranzTrainer,
  PruefplanLesenSchema,
  PruefplanLesenTrainer,
  PruefhaeufigkeitSchema,
  PruefhaeufigkeitTrainer,
  PruefartenSchema,
  PruefartenTrainer,
  SichtMassFunktionspruefungSchema,
  SichtMassFunktionspruefungTrainer,
  StichprobeVollpruefungSchema,
  StichprobeVollpruefungTrainer,
  GutteilNacharbeitAusschussSchema,
  GutteilNacharbeitAusschussTrainer,
  FehlerquoteBerechnenSchema,
  FehlerquoteBerechnenTrainer,
  MittelwertSpannweiteSchema,
  MittelwertSpannweiteTrainer,
  TrendProzessstreuungSchema,
  TrendProzessstreuungTrainer,
  NormalverteilungSchema,
  NormalverteilungTrainer,
  RegelkarteLesenSchema,
  RegelkarteLesenTrainer,
  ProzessfaehigkeitSchema,
  ProzessfaehigkeitTrainer,
  MessunsicherheitQsSchema,
  MessunsicherheitQsTrainer,
  RueckverfolgbarkeitChargeSchema,
  RueckverfolgbarkeitChargeTrainer,
  PruefprotokollSchreibenSchema,
  PruefprotokollSchreibenTrainer,
  SperrungFreigabeSchema,
  SperrungFreigabeTrainer,
  GratMetallSchema,
  GratMetallTrainer,
  MassabweichungMetallSchema,
  MassabweichungMetallTrainer,
  RattermarkenSchema,
  RattermarkenTrainer,
  SchlechterRundlaufSchema,
  SchlechterRundlaufTrainer,
  WerkzeugbruchSchema,
  WerkzeugbruchTrainer,
  WerkzeugverschleissMetallSchema,
  WerkzeugverschleissMetallTrainer,
  VerformungRissSchema,
  VerformungRissTrainer,
  SchlechteOberflaecheSchema,
  SchlechteOberflaecheTrainer,
  HaertefehlerSchema,
  HaertefehlerTrainer,
  KorrosionBauteilSchema,
  KorrosionBauteilTrainer,
  EinfallstellenSchema,
  EinfallstellenTrainer,
  LunkerSchema,
  LunkerTrainer,
  GratUeberspritzungSchema,
  GratUeberspritzungTrainer,
  UnterfuellungSchema,
  UnterfuellungTrainer,
  FliessnaehteBindenaehteSchema,
  FliessnaehteBindenaehteTrainer,
  SchlierenFeuchtigkeitSchema,
  SchlierenFeuchtigkeitTrainer,
  VerbrennungDieseleffektSchema,
  VerbrennungDieseleffektTrainer,
  VerzugKunststoffSchema,
  VerzugKunststoffTrainer,
  DelaminationSchema,
  DelaminationTrainer,
  SchwarzePunkteSchema,
  SchwarzePunkteTrainer,
  FarbabweichungSchema,
  FarbabweichungTrainer,
  AngussAuswerfermarkenSchema,
  AngussAuswerfermarkenTrainer,
  MassabweichungKunststoffSchema,
  MassabweichungKunststoffTrainer,
  Fehlerdiagnose5MSchema,
  Fehlerdiagnose5MTrainer,
  SensorAktorSteuerungSchema,
  SensorAktorSteuerungTrainer,
  SteuerungRegelungSchema,
  SteuerungRegelungTrainer,
  SollIstStellgroesseSchema,
  SollIstStellgroesseTrainer,
  SpsGrundlagenSchema,
  SpsGrundlagenTrainer,
  EingangAusgangSchema,
  EingangAusgangTrainer,
  UndOderVerriegelungSchema,
  UndOderVerriegelungTrainer,
  EndschalterLichtschrankeSchema,
  EndschalterLichtschrankeTrainer,
  InduktivKapazitivSensorSchema,
  InduktivKapazitivSensorTrainer,
  TemperaturDrucksensorenSchema,
  TemperaturDrucksensorenTrainer,
  ElektromotorFrequenzumrichterSchema,
  ElektromotorFrequenzumrichterTrainer,
  DruckluftanlageSchema,
  DruckluftanlageTrainer,
  WartungseinheitSchema,
  WartungseinheitTrainer,
  VentileDrosselnSchema,
  VentileDrosselnTrainer,
  EinfachwirkenderZylinderSchema,
  EinfachwirkenderZylinderTrainer,
  DoppeltwirkenderZylinderSchema,
  DoppeltwirkenderZylinderTrainer,
  HydraulikGrundlagenSchema,
  HydraulikGrundlagenTrainer,
  WartungInspektionInstandsetzungSchema,
  WartungInspektionInstandsetzungTrainer,
  VorbeugendeInstandhaltungSchema,
  VorbeugendeInstandhaltungTrainer,
  SchmierungSchmierplanSchema,
  SchmierungSchmierplanTrainer,
  VerschleissReibungSchema,
  VerschleissReibungTrainer,
  TemperaturSchwingungGeraeuschSchema,
  TemperaturSchwingungGeraeuschTrainer,
  LeckageErkennenSchema,
  LeckageErkennenTrainer,
  LagerfehlerSchema,
  LagerfehlerTrainer,
  UnwuchtFehlausrichtungSchema,
  UnwuchtFehlausrichtungTrainer,
  StoerungFehlerUrsacheWirkungSchema,
  StoerungFehlerUrsacheWirkungTrainer,
  FiveWhySchema,
  FiveWhyTrainer,
  IshikawaDiagrammSchema,
  IshikawaDiagrammTrainer,
  StoerungDokumentierenSchema,
  StoerungDokumentierenTrainer,
  SichereFehlersucheSchema,
  SichereFehlersucheTrainer,
  VerbesserungNachStoerungSchema,
  VerbesserungNachStoerungTrainer,
  FertigungsauftragSchema,
  FertigungsauftragTrainer,
  ArbeitsfolgePlanenSchema,
  ArbeitsfolgePlanenTrainer,
  StuecklisteMaterialbedarfSchema,
  StuecklisteMaterialbedarfTrainer,
  PersonalMaschinenbedarfSchema,
  PersonalMaschinenbedarfTrainer,
  MaschinenbelegungKapazitaetSchema,
  MaschinenbelegungKapazitaetTrainer,
  TaktzeitZykluszeitSchema,
  TaktzeitZykluszeitTrainer,
  DurchlaufzeitSchema,
  DurchlaufzeitTrainer,
  RuestzeitBearbeitungszeitSchema,
  RuestzeitBearbeitungszeitTrainer,
  StillstandszeitSchema,
  StillstandszeitTrainer,
  LieferterminLosgroesseSchema,
  LieferterminLosgroesseTrainer,
  BestandMindestbestandSchema,
  BestandMindestbestandTrainer,
  MeldebestandSicherheitsbestandSchema,
  MeldebestandSicherheitsbestandTrainer,
  FifoSchema,
  FifoTrainer,
  KanbanGrundprinzipSchema,
  KanbanGrundprinzipTrainer,
  WertschoepfungVerschwendungSchema,
  WertschoepfungVerschwendungTrainer,
  FuenfSWiederholenSchema,
  FuenfSWiederholenTrainer,
  KvpImTeamSchema,
  ProduktionsauftragLesenSchema,
  ProduktionsablaufVerstehenSchema,
  SchichtbeginnVorbereitenSchema,
  OrdnungAmArbeitsplatzSchema,
  ProduktionsdatenNotierenSchema,
  OeeUeberblickenSchema,
  VerfuegbarkeitBerechnenSchema,
  LeistungsgradBerechnenSchema,
  QualitaetsrateBerechnenSchema,
  OeeVerbessernSchema,
  RechenwegInPruefungenSchema,
  GrundrechenartenSicherSchema,
  DreisatzSchema,
  ProzentrechnungSchema,
  EinheitenInAufgabenSchema,
  UmfangFlaecheRechteckSchema,
  KreisumfangKreisflaecheSchema,
  VolumenQuaderZylinderSchema,
  MasseAusDichteSchema,
  GeschwindigkeitUndZeitSchema,
  DrehzahlSchnittgeschwindigkeitSchema,
  VorschubBerechnenSchema,
  KraftUndDruckSchema,
  HydraulischerDruckSchema,
  LeistungArbeitWirkungsgradSchema,
  UebersetzungsverhaeltnisSchema,
  DrehmomentSchema,
  GutmengeAusschussquoteSchema,
  ProduktionsleistungSchema,
  ProzentualeAbweichungSchema,
  WaermeausdehnungPruefungsnahSchema,
  ToleranzberechnungSchema,
  FormelUmstellenSchema,
  PlausibilitaetVonErgebnissenSchema,
  AusbildungsvertragSchema,
  RechteUndPflichtenSchema,
  ProbezeitUndKuendigungSchema,
  ArbeitsvertragTarifvertragSchema,
  TarifautonomieBetriebsratSchema,
  JugendAuszubildendenvertretungSchema,
  SozialversicherungSchema,
  ArbeitszeitUndUrlaubSchema,
  EntgeltabrechnungSchema,
  NachhaltigkeitUmweltschutzSchema,
  WirtschaftlichkeitProduktivitaetSchema,
  OekonomischesPrinzipSchema,
  AufgabenstellungRichtigLesenSchema,
  GegebenUndGesuchtSchema,
  PassendeFormelFindenSchema,
  EinheitenKontrollierenSchema,
  TabellenbuchNutzenSchema,
  MultipleChoiceAusschlussSchema,
  UnbekannteBegriffeSchema,
  ZeitmanagementSchema,
  PruefungsangstReduzierenSchema,
  TypischePruefungsfallenSchema,
  MiniPruefungProduktionstechnikSchema,
  MiniPruefungProduktionsplanungSchema,
  MiniPruefungWisoSchema,
  WiederholungsmodusSchema,
  PersoenlicheSchwachstellenSchema,
  PruefungssimulationAbschlussSchema,
  KvpImTeamTrainer,
  ProduktionsauftragLesenTrainer,
  ProduktionsablaufVerstehenTrainer,
  SchichtbeginnVorbereitenTrainer,
  OrdnungAmArbeitsplatzTrainer,
  ProduktionsdatenNotierenTrainer,
  OeeUeberblickenTrainer,
  VerfuegbarkeitBerechnenTrainer,
  LeistungsgradBerechnenTrainer,
  QualitaetsrateBerechnenTrainer,
  OeeVerbessernTrainer,
  RechenwegInPruefungenTrainer,
  GrundrechenartenSicherTrainer,
  DreisatzTrainer,
  ProzentrechnungTrainer,
  EinheitenInAufgabenTrainer,
  UmfangFlaecheRechteckTrainer,
  KreisumfangKreisflaecheTrainer,
  VolumenQuaderZylinderTrainer,
  MasseAusDichteTrainer,
  GeschwindigkeitUndZeitTrainer,
  DrehzahlSchnittgeschwindigkeitTrainer,
  VorschubBerechnenTrainer,
  KraftUndDruckTrainer,
  HydraulischerDruckTrainer,
  LeistungArbeitWirkungsgradTrainer,
  UebersetzungsverhaeltnisTrainer,
  DrehmomentTrainer,
  GutmengeAusschussquoteTrainer,
  ProduktionsleistungTrainer,
  ProzentualeAbweichungTrainer,
  WaermeausdehnungPruefungsnahTrainer,
  ToleranzberechnungTrainer,
  FormelUmstellenTrainer,
  PlausibilitaetVonErgebnissenTrainer,
  AusbildungsvertragTrainer,
  RechteUndPflichtenTrainer,
  ProbezeitUndKuendigungTrainer,
  ArbeitsvertragTarifvertragTrainer,
  TarifautonomieBetriebsratTrainer,
  JugendAuszubildendenvertretungTrainer,
  SozialversicherungTrainer,
  ArbeitszeitUndUrlaubTrainer,
  EntgeltabrechnungTrainer,
  NachhaltigkeitUmweltschutzTrainer,
  WirtschaftlichkeitProduktivitaetTrainer,
  OekonomischesPrinzipTrainer,
  AufgabenstellungRichtigLesenTrainer,
  GegebenUndGesuchtTrainer,
  PassendeFormelFindenTrainer,
  EinheitenKontrollierenTrainer,
  TabellenbuchNutzenTrainer,
  MultipleChoiceAusschlussTrainer,
  UnbekannteBegriffeTrainer,
  ZeitmanagementTrainer,
  PruefungsangstReduzierenTrainer,
  TypischePruefungsfallenTrainer,
  MiniPruefungProduktionstechnikTrainer,
  MiniPruefungProduktionsplanungTrainer,
  MiniPruefungWisoTrainer,
  WiederholungsmodusTrainer,
  PersoenlicheSchwachstellenTrainer,
  PruefungssimulationAbschlussTrainer,
  MeldewegAblauf,
  MeldewegTrainer,
  MessuhrSchema,
  MessuhrTrainer,
  MessunsicherheitSchema,
  MessunsicherheitTrainer,
  MessschieberSchema,
  MessschieberTeileTrainer,
  MesswertAblesenSchema,
  MesswertAblesenTrainer,
  MiniWissenscheck,
  NichteisenmetalleSchema,
  NichteisenmetalleTrainer,
  NotHaltSchema,
  NotHaltSzenarioTrainer,
  OberflaechenangabenSchema,
  OberflaechenangabenTrainer,
  PassungSchema,
  PassungTrainer,
  Produktionskarte,
  ProduktionsStartcheck,
  PruefenMessenLehrenSchema,
  PruefenMessenLehrenTrainer,
  PruefmittelpflegeSchema,
  PruefmittelpflegeTrainer,
  PsaSet,
  PsaZuordnung,
  Rollenrad,
  RollenEntscheider,
  SchutzeinrichtungSchema,
  SchutzeinrichtungTrainer,
  SchriftfeldSchema,
  SchriftfeldTrainer,
  SchnittdarstellungSchema,
  SchnittdarstellungTrainer,
  SicherheitsdatenblattSchema,
  SicherheitsdatenblattTrainer,
  SicherheitszeichenSet,
  SicherheitszeichenTrainer,
  SicherheitsregelnSchema,
  SicherheitsregelnTrainer,
  SiEinheitenSchema,
  SiEinheitenTrainer,
  StuecklisteSchema,
  StuecklisteTrainer,
  TemperaturBeimMessenTrainer,
  TemperaturMessenSchema,
  TemperaturSchema,
  TemperaturTrainer,
  ThermoplastSchema,
  ThermoplastTrainer,
  ToleranzangabenSchema,
  ToleranzangabenTrainer,
  UnfallMeldeTrainer,
  UnfallMeldeketteSchema,
  UmweltStoffstromSchema,
  VolumenSchema,
  VolumenTrainer,
  WerkzeugwechselSchema,
  WerkzeugwechselTrainer,
  WerkstoffgruppenSchema,
  WerkstoffgruppenTrainer,
  WiedereinschaltenSchema,
  WiedereinschaltenTrainer,
  ZeichnungGrundlagenSchema,
  ZeichnungZweckTrainer,
} from '@bze/ui';

describe('InteraktiverMessschieber', () => {
  it('rendert eine bedienbare Messwertkontrolle mit Live-Ergebnis', () => {
    const html = renderToStaticMarkup(
      React.createElement(InteraktiverMessschieber, {
        startwertMm: 20,
        nennmassMm: 20,
        oberesAbmassMm: 0.1,
        unteresAbmassMm: -0.05,
      }),
    );

    assert.match(html, /type="range"/);
    assert.match(html, /aria-label="Messwert in Millimeter einstellen"/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /min-h-touch/);
    assert.match(html, /Im Toleranzfeld/);
    assert.match(html, /20,00 mm/);
  });

  it('bricht bei ungueltiger Messbereichskonfiguration explizit ab', () => {
    assert.throws(
      () =>
        renderToStaticMarkup(
          React.createElement(InteraktiverMessschieber, {
            minMm: 10,
            maxMm: 5,
          }),
        ),
      /maxMm groesser als minMm/,
    );
  });
});

describe('InteraktivesToleranzfeld', () => {
  it('rendert Grenzmasse, Istmass-Slider und Entscheidungsoptionen', () => {
    const html = renderToStaticMarkup(
      React.createElement(InteraktivesToleranzfeld, {
        nennmassMm: 20,
        oberesAbmassMm: 0.1,
        unteresAbmassMm: -0.05,
        startIstmassMm: 20.04,
      }),
    );

    assert.match(html, /Istmass in Millimeter einstellen/);
    assert.match(html, /Unteres Grenzmass/);
    assert.match(html, /Oberes Grenzmass/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /min-h-touch/);
    assert.match(html, /Gutteil/);
  });

  it('bricht bei vertauschtem Grenzmass explizit ab', () => {
    assert.throws(
      () =>
        renderToStaticMarkup(
          React.createElement(InteraktivesToleranzfeld, {
            unteresAbmassMm: 0.2,
            oberesAbmassMm: -0.1,
          }),
        ),
      /unteres Grenzmass/,
    );
  });
});

describe('InteraktiveBegriffListe', () => {
  it('rendert Fachbegriffe als Dialog-Buttons', () => {
    const html = renderToStaticMarkup(
      React.createElement(InteraktiveBegriffListe, {
        begriffe: ['Messschieber', 'Nonius'],
      }),
    );

    assert.match(html, /Fachbegriffe/);
    assert.match(html, /aria-haspopup="dialog"/);
    assert.match(html, /Messschieber/);
    assert.match(html, /Nonius/);
  });
});

describe('MiniWissenscheck', () => {
  it('rendert eine mastery-faehige MC-Frage mit Pruefbutton', () => {
    const html = renderToStaticMarkup(
      React.createElement(MiniWissenscheck, {
        id: 'FK-1-MES-005::check',
        fragen: [
          {
            id: 'messart-aussen',
            masterySchluessel: 'FK-1-MES-005::messart-aussen',
            aufgabenstellung: 'Welche Messart nutzt du fuer den Aussendurchmesser eines Bolzens?',
            optionen: [
              {
                id: 'aussenmessung',
                text: 'Aussenmessung',
                istKorrekt: true,
                erklaerung: 'Die grossen Messschenkel liegen aussen an.',
              },
              {
                id: 'innenmessung',
                text: 'Innenmessung',
                istKorrekt: false,
                erklaerung: 'Innenmessung ist fuer Bohrungen gedacht.',
              },
            ],
          },
        ],
      }),
    );

    assert.match(html, /Mini-Wissenscheck/);
    assert.match(html, /FK-1-MES-005::messart-aussen/);
    assert.match(html, /Antwort pruefen/);
    assert.match(html, /Mastery-ready/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /motion-safe:transition/);
  });

  it('bricht bei mehreren richtigen Optionen explizit ab', () => {
    assert.throws(
      () =>
        renderToStaticMarkup(
          React.createElement(MiniWissenscheck, {
            id: 'FK-1-MES-005::check',
            fragen: [
              {
                id: 'kaputt',
                masterySchluessel: 'FK-1-MES-005::kaputt',
                aufgabenstellung: 'Welche Antwort ist richtig?',
                optionen: [
                  { id: 'a', text: 'A', istKorrekt: true, erklaerung: 'A' },
                  { id: 'b', text: 'B', istKorrekt: true, erklaerung: 'B' },
                ],
              },
            ],
          }),
        ),
      /genau eine richtige Antwortoption/,
    );
  });
});

describe('Fachkunde Berufsrollen-Visuals', () => {
  it('rendert Produktionskarte, Rollenrad und Meldeweg als zugängliche SVG-Visuals', () => {
    const produktionskarte = renderToStaticMarkup(React.createElement(Produktionskarte));
    const rollenrad = renderToStaticMarkup(React.createElement(Rollenrad));
    const meldeweg = renderToStaticMarkup(React.createElement(MeldewegAblauf));

    assert.match(produktionskarte, /Produktionskarte mit fuenf Stationen/);
    assert.match(produktionskarte, /Auftrag/);
    assert.match(produktionskarte, /Rueckmeldung/);
    assert.match(rollenrad, /Rollenrad Maschinenfuehrer/);
    assert.match(rollenrad, /Verantwortung/);
    assert.match(meldeweg, /Meldeweg bei Stoerungen/);
    assert.match(meldeweg, /Dokumentieren/);
  });
});

describe('Fachkunde Berufsrollen-Interaktionen', () => {
  it('rendert Startcheck, Rollenentscheidung und Meldeweg-Trainer bedienbar mit Live-Feedback', () => {
    const startcheck = renderToStaticMarkup(React.createElement(ProduktionsStartcheck));
    const rollen = renderToStaticMarkup(React.createElement(RollenEntscheider));
    const meldeweg = renderToStaticMarkup(React.createElement(MeldewegTrainer));

    assert.match(startcheck, /Startcheck Produktion/);
    assert.match(startcheck, /Auftrag gelesen/);
    assert.match(startcheck, /aria-live="polite"/);
    assert.match(startcheck, /min-h-touch/);
    assert.match(rollen, /Rollenentscheidung trainieren/);
    assert.match(rollen, /Materialkennzeichnung/);
    assert.match(rollen, /aria-pressed/);
    assert.match(meldeweg, /Meldeweg-Reihenfolge trainieren/);
    assert.match(meldeweg, /Naechster sicherer Schritt/);
    assert.match(meldeweg, /Zuruecksetzen/);
  });
});

describe('Fachkunde Sicherheits-Visuals', () => {
  it('rendert Gefahrstellen, PSA und Sicherheitszeichen als zugängliche SVG-Visuals', () => {
    const gefahren = renderToStaticMarkup(React.createElement(GefahrenstellenBild));
    const psa = renderToStaticMarkup(React.createElement(PsaSet));
    const zeichen = renderToStaticMarkup(React.createElement(SicherheitszeichenSet));

    assert.match(gefahren, /Werkhalle mit markierten Gefahrstellen/);
    assert.match(gefahren, /Einzug/);
    assert.match(psa, /Persoenliche Schutzausruestung als Set/);
    assert.match(psa, /Schutzbrille/);
    assert.match(zeichen, /Sicherheitszeichen Gebot Verbot Warnung/);
    assert.match(zeichen, /Warnung/);
  });
});

describe('Fachkunde Sicherheits-Interaktionen', () => {
  it('rendert Gefahrstellen-, PSA- und Sicherheitszeichen-Trainer mit Live-Feedback', () => {
    const gefahren = renderToStaticMarkup(React.createElement(GefahrstellenTrainer));
    const psa = renderToStaticMarkup(React.createElement(PsaZuordnung));
    const zeichen = renderToStaticMarkup(React.createElement(SicherheitszeichenTrainer));

    assert.match(gefahren, /Gefahrstellen markieren/);
    assert.match(gefahren, /aria-live="polite"/);
    assert.match(gefahren, /Quetschen/);
    assert.match(psa, /PSA passend zuordnen/);
    assert.match(psa, /Spaene koennen/);
    assert.match(psa, /aria-pressed/);
    assert.match(zeichen, /Sicherheitszeichen unterscheiden/);
    assert.match(zeichen, /Gebot/);
    assert.match(zeichen, /Naechstes Zeichen/);
  });
});

describe('Fachkunde Sicherheitsvertiefung-Visuals', () => {
  it('rendert Not-Halt, Schutzeinrichtungen und Einzugs-/Quetschstellen als zugaengliche SVG-Visuals', () => {
    const notHalt = renderToStaticMarkup(React.createElement(NotHaltSchema));
    const schutz = renderToStaticMarkup(React.createElement(SchutzeinrichtungSchema));
    const einzug = renderToStaticMarkup(React.createElement(EinzugQuetschstellenSchema));

    assert.match(notHalt, /Not-Halt als sichere Grundfolge/);
    assert.match(notHalt, /Reset nur nach Freigabe/);
    assert.match(schutz, /Schutzeinrichtungen an einer Maschine/);
    assert.match(schutz, /Lichtschranke/);
    assert.match(einzug, /Einzugsstellen und Quetschstellen/);
    assert.match(einzug, /sicherer Abstand/);
  });
});

describe('Fachkunde Sicherheitsvertiefung-Interaktionen', () => {
  it('rendert Not-Halt-, Schutzeinrichtungs- und Gefahrbereich-Trainer mit Live-Feedback', () => {
    const notHalt = renderToStaticMarkup(React.createElement(NotHaltSzenarioTrainer));
    const schutz = renderToStaticMarkup(React.createElement(SchutzeinrichtungTrainer));
    const gefahrbereich = renderToStaticMarkup(React.createElement(GefahrbereichTrainer));

    assert.match(notHalt, /Not-Halt-Szenarien trainieren/);
    assert.match(notHalt, /Not-Halt betaetigen/);
    assert.match(notHalt, /aria-live="polite"/);
    assert.match(schutz, /Schutzeinrichtungen beurteilen/);
    assert.match(schutz, /Nicht ueberbruecken/);
    assert.match(schutz, /aria-pressed/);
    assert.match(gefahrbereich, /Gefahrbereich sicher einschaetzen/);
    assert.match(gefahrbereich, /Schnell herausziehen/);
    assert.match(gefahrbereich, /Naechste Gefahr/);
  });
});

describe('Fachkunde Sicherheitsabschluss-Visuals', () => {
  it('rendert Wiedereinschalten, Sicherheitsregeln, Werkzeugwechsel und Unfallmeldung als zugaengliche SVG-Visuals', () => {
    const wiedereinschalten = renderToStaticMarkup(React.createElement(WiedereinschaltenSchema));
    const regeln = renderToStaticMarkup(React.createElement(SicherheitsregelnSchema));
    const werkzeugwechsel = renderToStaticMarkup(React.createElement(WerkzeugwechselSchema));
    const unfall = renderToStaticMarkup(React.createElement(UnfallMeldeketteSchema));

    assert.match(wiedereinschalten, /Sicher gegen Wiedereinschalten/);
    assert.match(wiedereinschalten, /Kennzeichnen/);
    assert.match(regeln, /Fuenf Sicherheitsregeln als Lernkarten/);
    assert.match(regeln, /Freischalten/);
    assert.match(werkzeugwechsel, /Sicherer Werkzeugwechsel als Ablauf/);
    assert.match(werkzeugwechsel, /Probeteil/);
    assert.match(unfall, /Meldekette bei Unfall und Beinaheunfall/);
    assert.match(unfall, /Dokumentieren/);
  });
});

describe('Fachkunde Sicherheitsabschluss-Interaktionen', () => {
  it('rendert Wiedereinschalten-, Sicherheitsregeln-, Werkzeugwechsel- und Unfall-Trainer mit Live-Feedback', () => {
    const wiedereinschalten = renderToStaticMarkup(React.createElement(WiedereinschaltenTrainer));
    const regeln = renderToStaticMarkup(React.createElement(SicherheitsregelnTrainer));
    const werkzeugwechsel = renderToStaticMarkup(React.createElement(WerkzeugwechselTrainer));
    const unfall = renderToStaticMarkup(React.createElement(UnfallMeldeTrainer));

    assert.match(wiedereinschalten, /Sicherungsfolge trainieren/);
    assert.match(wiedereinschalten, /Freigabe abwarten/);
    assert.match(wiedereinschalten, /aria-live="polite"/);
    assert.match(regeln, /Fuenf Sicherheitsregeln sortieren/);
    assert.match(regeln, /Spannungsfreiheit feststellen/);
    assert.match(regeln, /Zuruecksetzen/);
    assert.match(werkzeugwechsel, /Werkzeugwechsel sicher entscheiden/);
    assert.match(werkzeugwechsel, /Sofort Serienlauf starten/);
    assert.match(werkzeugwechsel, /aria-pressed/);
    assert.match(unfall, /Unfallmeldung trainieren/);
    assert.match(unfall, /Beinaheunfall melden/);
    assert.match(unfall, /Naechste Situation/);
  });
});

describe('Fachkunde Umwelt-Visuals', () => {
  it('rendert Umwelt-, Betriebsstoff-, Gefahrstoff-, SDB-, KSS- und Kunststoffabfall-Visuals zugaenglich', () => {
    const umwelt = renderToStaticMarkup(React.createElement(UmweltStoffstromSchema));
    const betriebsstoffe = renderToStaticMarkup(React.createElement(BetriebsstoffeSchema));
    const etikett = renderToStaticMarkup(React.createElement(GefahrstoffEtikettSchema));
    const sdb = renderToStaticMarkup(React.createElement(SicherheitsdatenblattSchema));
    const kss = renderToStaticMarkup(React.createElement(KuehlschmierstoffSchema));
    const kunststoff = renderToStaticMarkup(React.createElement(KunststoffAbfallSchema));

    assert.match(umwelt, /Stoffstrom im Betrieb/);
    assert.match(umwelt, /Verwerten/);
    assert.match(betriebsstoffe, /Betriebsstoffe unterscheiden/);
    assert.match(betriebsstoffe, /KSS/);
    assert.match(etikett, /Gefahrstoffetikett mit Lernbereichen/);
    assert.match(etikett, /Piktogramm/);
    assert.match(sdb, /Sicherheitsdatenblatt als Abschnittskarte/);
    assert.match(sdb, /Entsorgung/);
    assert.match(kss, /Kuehlschmierstoff-Kreislauf/);
    assert.match(kss, /Ruecklauf/);
    assert.match(kunststoff, /Kunststoffabfaelle sortieren/);
    assert.match(kunststoff, /Fremdstoff/);
  });
});

describe('Fachkunde Umwelt-Interaktionen', () => {
  it('rendert Umwelt-, Betriebsstoff-, Gefahrstoff-, SDB-, KSS- und Kunststoffabfall-Trainer mit Live-Feedback', () => {
    const abfall = renderToStaticMarkup(React.createElement(AbfallwegTrainer));
    const betriebsstoff = renderToStaticMarkup(React.createElement(BetriebsstoffZuordnungTrainer));
    const etikett = renderToStaticMarkup(React.createElement(GefahrstoffEtikettTrainer));
    const sdb = renderToStaticMarkup(React.createElement(SicherheitsdatenblattTrainer));
    const kss = renderToStaticMarkup(React.createElement(KuehlschmierstoffTrainer));
    const kunststoff = renderToStaticMarkup(React.createElement(KunststoffAbfallTrainer));

    assert.match(abfall, /Abfallweg sortieren/);
    assert.match(abfall, /Entsorgen nach Vorgabe/);
    assert.match(abfall, /aria-live="polite"/);
    assert.match(betriebsstoff, /Betriebsstoff zuordnen/);
    assert.match(betriebsstoff, /Kuehlschmierstoff/);
    assert.match(betriebsstoff, /aria-pressed/);
    assert.match(etikett, /Gefahrstoffetikett lesen/);
    assert.match(etikett, /H-\/P-Saetze/);
    assert.match(sdb, /SDB-Abschnitt finden/);
    assert.match(sdb, /Erste Hilfe/);
    assert.match(kss, /KSS-Situation entscheiden/);
    assert.match(kss, /Mit Druckluft wegblasen/);
    assert.match(kunststoff, /Kunststoffabfall sortieren/);
    assert.match(kunststoff, /Alles zusammenwerfen/);
  });
});

describe('Fachkunde Zeichnung-Visuals', () => {
  it('rendert Zeichnungsgrundlagen, Schriftfeld, Ansichten, Linienarten, Massstab und Bemassung zugaenglich', () => {
    const zeichnung = renderToStaticMarkup(React.createElement(ZeichnungGrundlagenSchema));
    const schriftfeld = renderToStaticMarkup(React.createElement(SchriftfeldSchema));
    const ansichten = renderToStaticMarkup(React.createElement(AnsichtenSchema));
    const linien = renderToStaticMarkup(React.createElement(LinienartenSchema));
    const massstab = renderToStaticMarkup(React.createElement(MassstabSchema));
    const bemassung = renderToStaticMarkup(React.createElement(BemassungSchema));

    assert.match(zeichnung, /Technische Zeichnung als Fertigungsgrundlage/);
    assert.match(zeichnung, /Schriftfeld/);
    assert.match(schriftfeld, /Schriftfeld einer technischen Zeichnung/);
    assert.match(schriftfeld, /Zeichnungsnummer/);
    assert.match(ansichten, /Technische Ansichten eines Bauteils/);
    assert.match(ansichten, /Draufsicht/);
    assert.match(linien, /Linienarten in technischen Zeichnungen/);
    assert.match(linien, /Strichpunktlinie/);
    assert.match(massstab, /Massstab in technischen Zeichnungen/);
    assert.match(massstab, /2:1/);
    assert.match(bemassung, /Bemassung an einem einfachen Bauteil/);
    assert.match(bemassung, /Masszahl/);
  });
});

describe('Fachkunde Zeichnung-Interaktionen', () => {
  it('rendert Zeichnungs-, Schriftfeld-, Ansichten-, Linien-, Massstab- und Bemassungs-Trainer mit Live-Feedback', () => {
    const zeichnung = renderToStaticMarkup(React.createElement(ZeichnungZweckTrainer));
    const schriftfeld = renderToStaticMarkup(React.createElement(SchriftfeldTrainer));
    const ansichten = renderToStaticMarkup(React.createElement(AnsichtenTrainer));
    const linien = renderToStaticMarkup(React.createElement(LinienartenTrainer));
    const massstab = renderToStaticMarkup(React.createElement(MassstabTrainer));
    const bemassung = renderToStaticMarkup(React.createElement(BemassungTrainer));

    assert.match(zeichnung, /Zeichnung sicher nutzen/);
    assert.match(zeichnung, /Nach Augenmass schaetzen/);
    assert.match(zeichnung, /aria-live="polite"/);
    assert.match(schriftfeld, /Schriftfeld-Information finden/);
    assert.match(schriftfeld, /Zeichnungsnummer/);
    assert.match(schriftfeld, /aria-pressed/);
    assert.match(ansichten, /Ansicht richtig zuordnen/);
    assert.match(ansichten, /Seitenansicht/);
    assert.match(linien, /Linienart erkennen/);
    assert.match(linien, /Strichlinie/);
    assert.match(massstab, /Massstab einordnen/);
    assert.match(massstab, /Bauteilmass verdoppeln/);
    assert.match(bemassung, /Bemassungsteile zuordnen/);
    assert.match(bemassung, /Schraffur/);
  });
});

describe('Fachkunde Zeichnungsvertiefung-Visuals', () => {
  it('rendert Toleranz, Passung, Schnitt, Oberflaeche, Stueckliste und Arbeitsplan zugaenglich', () => {
    const toleranz = renderToStaticMarkup(React.createElement(ToleranzangabenSchema));
    const passung = renderToStaticMarkup(React.createElement(PassungSchema));
    const schnitt = renderToStaticMarkup(React.createElement(SchnittdarstellungSchema));
    const oberflaeche = renderToStaticMarkup(React.createElement(OberflaechenangabenSchema));
    const stueckliste = renderToStaticMarkup(React.createElement(StuecklisteSchema));
    const arbeitsplan = renderToStaticMarkup(React.createElement(ArbeitsplanSchema));

    assert.match(toleranz, /Toleranzangaben an einem Zeichnungsmass/);
    assert.match(toleranz, /Toleranzfeld/);
    assert.match(passung, /Passung zwischen Welle und Bohrung/);
    assert.match(passung, /Uebermass/);
    assert.match(schnitt, /Schnittdarstellung eines Bauteils/);
    assert.match(schnitt, /Schraffur/);
    assert.match(oberflaeche, /Oberflaechenangaben an einem Bauteil/);
    assert.match(oberflaeche, /Ra/);
    assert.match(stueckliste, /Stueckliste einer Baugruppe/);
    assert.match(stueckliste, /Grundplatte/);
    assert.match(arbeitsplan, /Arbeitsplan als geordnete Arbeitsfolge/);
    assert.match(arbeitsplan, /Rueckmelden/);
  });
});

describe('Fachkunde Zeichnungsvertiefung-Interaktionen', () => {
  it('rendert Toleranz-, Passungs-, Schnitt-, Oberflaechen-, Stuecklisten- und Arbeitsplan-Trainer mit Live-Feedback', () => {
    const toleranz = renderToStaticMarkup(React.createElement(ToleranzangabenTrainer));
    const passung = renderToStaticMarkup(React.createElement(PassungTrainer));
    const schnitt = renderToStaticMarkup(React.createElement(SchnittdarstellungTrainer));
    const oberflaeche = renderToStaticMarkup(React.createElement(OberflaechenangabenTrainer));
    const stueckliste = renderToStaticMarkup(React.createElement(StuecklisteTrainer));
    const arbeitsplan = renderToStaticMarkup(React.createElement(ArbeitsplanTrainer));

    assert.match(toleranz, /Toleranzangaben lesen/);
    assert.match(toleranz, /Schaetzwert/);
    assert.match(toleranz, /aria-live="polite"/);
    assert.match(passung, /Passung einordnen/);
    assert.match(passung, /Oberflaeche/);
    assert.match(passung, /aria-pressed/);
    assert.match(schnitt, /Schnittdarstellung deuten/);
    assert.match(schnitt, /Hohlraum/);
    assert.match(oberflaeche, /Oberflaechenangaben erkennen/);
    assert.match(oberflaeche, /Farbe des Papiers/);
    assert.match(stueckliste, /Stueckliste lesen/);
    assert.match(stueckliste, /Schraffur/);
    assert.match(arbeitsplan, /Arbeitsplan richtig nutzen/);
    assert.match(arbeitsplan, /Reihenfolge raten/);
  });
});

describe('Fachkunde Einheiten-Visuals', () => {
  it('rendert SI, Laenge, Flaeche, Volumen, Dichte, Geschwindigkeit und Temperatur zugaenglich', () => {
    const si = renderToStaticMarkup(React.createElement(SiEinheitenSchema));
    const laenge = renderToStaticMarkup(React.createElement(LaengenUmrechnungSchema));
    const flaeche = renderToStaticMarkup(React.createElement(FlaechenSchema));
    const volumen = renderToStaticMarkup(React.createElement(VolumenSchema));
    const dichte = renderToStaticMarkup(React.createElement(DichteSchema));
    const geschwindigkeit = renderToStaticMarkup(React.createElement(GeschwindigkeitSchema));
    const temperatur = renderToStaticMarkup(React.createElement(TemperaturSchema));

    assert.match(si, /SI-Basiseinheiten im Betrieb/);
    assert.match(si, /Kilogramm/);
    assert.match(laenge, /Laengen umrechnen/);
    assert.match(laenge, /100/);
    assert.match(flaeche, /Flaeche berechnen/);
    assert.match(flaeche, /A = Laenge x Breite/);
    assert.match(volumen, /Volumen berechnen/);
    assert.match(volumen, /V = L x B x H/);
    assert.match(dichte, /Masse und Dichte/);
    assert.match(dichte, /Dichte = Masse \/ Volumen/);
    assert.match(geschwindigkeit, /Zeit und Geschwindigkeit/);
    assert.match(geschwindigkeit, /v = Weg \/ Zeit/);
    assert.match(temperatur, /Temperatur im Prozess/);
    assert.match(temperatur, /Delta T/);
  });
});

describe('Fachkunde Einheiten-Interaktionen', () => {
  it('rendert Einheiten-, Umrechnungs-, Formel- und Prozesswert-Trainer mit Live-Feedback', () => {
    const si = renderToStaticMarkup(React.createElement(SiEinheitenTrainer));
    const laenge = renderToStaticMarkup(React.createElement(LaengenUmrechnungTrainer));
    const flaeche = renderToStaticMarkup(React.createElement(FlaechenTrainer));
    const volumen = renderToStaticMarkup(React.createElement(VolumenTrainer));
    const dichte = renderToStaticMarkup(React.createElement(DichteTrainer));
    const geschwindigkeit = renderToStaticMarkup(React.createElement(GeschwindigkeitTrainer));
    const temperatur = renderToStaticMarkup(React.createElement(TemperaturTrainer));

    assert.match(si, /SI-Einheiten zuordnen/);
    assert.match(si, /Liter/);
    assert.match(si, /aria-live="polite"/);
    assert.match(laenge, /Laengen umrechnen/);
    assert.match(laenge, /1000 mm/);
    assert.match(laenge, /aria-pressed/);
    assert.match(flaeche, /Flaeche berechnen/);
    assert.match(flaeche, /Kilogramm/);
    assert.match(volumen, /Volumen einordnen/);
    assert.match(volumen, /Sekunde/);
    assert.match(dichte, /Masse und Dichte verstehen/);
    assert.match(dichte, /Zeit stoppen/);
    assert.match(geschwindigkeit, /Zeit und Geschwindigkeit/);
    assert.match(geschwindigkeit, /Sie wird kleiner/);
    assert.match(temperatur, /Temperatur im Prozess/);
    assert.match(temperatur, /Stueckliste sortieren/);
  });
});

describe('Fachkunde Messblock-Visuals', () => {
  it('rendert Messgrundlagen, Messschieber und Buegelmessschraube zugaenglich', () => {
    const grundlagen = renderToStaticMarkup(React.createElement(PruefenMessenLehrenSchema));
    const messschieber = renderToStaticMarkup(React.createElement(MessschieberSchema));
    const aussen = renderToStaticMarkup(React.createElement(AussenmessungSchema));
    const innenTiefe = renderToStaticMarkup(React.createElement(InnenTiefenmessungSchema));
    const ablesen = renderToStaticMarkup(React.createElement(MesswertAblesenSchema));
    const buegelmess = renderToStaticMarkup(React.createElement(BuegelmessschraubeSchema));

    assert.match(grundlagen, /Pruefen Messen und Lehren unterscheiden/);
    assert.match(grundlagen, /Lehren/);
    assert.match(messschieber, /Vereinfachter Messschieber/);
    assert.match(messschieber, /Nonius/);
    assert.match(aussen, /Aussenmessung mit Messschieber/);
    assert.match(aussen, /Aussenmass/);
    assert.match(innenTiefe, /Innen- und Tiefenmessung mit Messschieber/);
    assert.match(innenTiefe, /Tiefenstange/);
    assert.match(ablesen, /Messwert am Nonius ablesen/);
    assert.match(ablesen, /Hauptskala/);
    assert.match(buegelmess, /Buegelmessschraube mit Spindel und Ratsche/);
    assert.match(buegelmess, /gleichmaessigen Messdruck/);
  });
});

describe('Fachkunde Messblock-Interaktionen', () => {
  it('rendert Messgrundlagen-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const grundlagen = renderToStaticMarkup(React.createElement(PruefenMessenLehrenTrainer));
    const teile = renderToStaticMarkup(React.createElement(MessschieberTeileTrainer));
    const aussen = renderToStaticMarkup(React.createElement(AussenmessungTrainer));
    const innenTiefe = renderToStaticMarkup(React.createElement(InnenTiefenmessungTrainer));
    const ablesen = renderToStaticMarkup(React.createElement(MesswertAblesenTrainer));
    const buegelmess = renderToStaticMarkup(React.createElement(BuegelmessschraubeTrainer));

    assert.match(grundlagen, /Pruefen, Messen, Lehren unterscheiden/);
    assert.match(grundlagen, /Ruesten/);
    assert.match(grundlagen, /aria-live="polite"/);
    assert.match(teile, /Messschieberteile benennen/);
    assert.match(teile, /Ratsche/);
    assert.match(teile, /aria-pressed/);
    assert.match(aussen, /Aussenmessung sicher ausfuehren/);
    assert.match(aussen, /Mit Kraft zudruecken/);
    assert.match(innenTiefe, /Innen- und Tiefenmessung waehlen/);
    assert.match(innenTiefe, /Aussenmessung/);
    assert.match(ablesen, /Messwert richtig ablesen/);
    assert.match(ablesen, /Schaetzwert/);
    assert.match(buegelmess, /Buegelmessschraube verwenden/);
    assert.match(buegelmess, /Mit Gewalt schliessen/);
  });
});

describe('Fachkunde Messblock-Vertiefung-Visuals', () => {
  it('rendert Messuhr, Lehren, Pflege, KJE, Unsicherheit und Temperatur zugaenglich', () => {
    const messuhr = renderToStaticMarkup(React.createElement(MessuhrSchema));
    const lehren = renderToStaticMarkup(React.createElement(LehrenSchema));
    const pflege = renderToStaticMarkup(React.createElement(PruefmittelpflegeSchema));
    const kje = renderToStaticMarkup(React.createElement(KalibrierenJustierenEichenSchema));
    const unsicherheit = renderToStaticMarkup(React.createElement(MessunsicherheitSchema));
    const temperatur = renderToStaticMarkup(React.createElement(TemperaturMessenSchema));

    assert.match(messuhr, /Messuhr fuer Rundlauf und Abweichung/);
    assert.match(messuhr, /Werkstueck drehen/);
    assert.match(lehren, /Grenzlehrdorn und Rachenlehre fuer Gut Ausschuss/);
    assert.match(lehren, /Rachenlehre/);
    assert.match(pflege, /Pruefmittel schonend behandeln/);
    assert.match(pflege, /Reinigen/);
    assert.match(kje, /Kalibrieren Justieren und Eichen unterscheiden/);
    assert.match(kje, /amtlich bestaetigen/);
    assert.match(unsicherheit, /Messunsicherheit als Streubereich/);
    assert.match(unsicherheit, /Streuung beachten/);
    assert.match(temperatur, /Temperatur beim Messen beachten/);
    assert.match(temperatur, /Referenztemperatur beachten/);
  });
});

describe('Fachkunde Messblock-Vertiefung-Interaktionen', () => {
  it('rendert Pruefmittel-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const messuhr = renderToStaticMarkup(React.createElement(MessuhrTrainer));
    const lehren = renderToStaticMarkup(React.createElement(LehrenTrainer));
    const pflege = renderToStaticMarkup(React.createElement(PruefmittelpflegeTrainer));
    const kje = renderToStaticMarkup(React.createElement(KalibrierenJustierenEichenTrainer));
    const unsicherheit = renderToStaticMarkup(React.createElement(MessunsicherheitTrainer));
    const temperatur = renderToStaticMarkup(React.createElement(TemperaturBeimMessenTrainer));

    assert.match(messuhr, /Messuhr einsetzen/);
    assert.match(messuhr, /Zeiger verbiegen/);
    assert.match(messuhr, /aria-live="polite"/);
    assert.match(lehren, /Lehren benutzen/);
    assert.match(lehren, /Messwert schaetzen/);
    assert.match(lehren, /aria-pressed/);
    assert.match(pflege, /Pruefmittel schonend behandeln/);
    assert.match(pflege, /In die Spankiste legen/);
    assert.match(kje, /Kalibrieren, Justieren, Eichen unterscheiden/);
    assert.match(kje, /Polieren/);
    assert.match(unsicherheit, /Messunsicherheit einfach verstehen/);
    assert.match(unsicherheit, /Wert schoenrechnen/);
    assert.match(temperatur, /Temperatur beim Messen beachten/);
    assert.match(temperatur, /Heiss schneller messen/);
  });
});

describe('Fachkunde Werkstoff-Visuals', () => {
  it('rendert Werkstoffgruppen, Stahl, Gusseisen, NE-Metalle, Aluminium und Kupfer zugaenglich', () => {
    const gruppen = renderToStaticMarkup(React.createElement(WerkstoffgruppenSchema));
    const stahl = renderToStaticMarkup(React.createElement(EisenStahlSchema));
    const guss = renderToStaticMarkup(React.createElement(GusseisenSchema));
    const ne = renderToStaticMarkup(React.createElement(NichteisenmetalleSchema));
    const alu = renderToStaticMarkup(React.createElement(AluminiumSchema));
    const kupfer = renderToStaticMarkup(React.createElement(KupferSchema));

    assert.match(gruppen, /Werkstoffgruppen als Materialbaum/);
    assert.match(gruppen, /Kunststoffe/);
    assert.match(stahl, /Eisenwerkstoffe und Stahl als Legierung/);
    assert.match(stahl, /Legieren veraendert Eigenschaften/);
    assert.match(guss, /Gusseisen mit Graphit und Bruchbild/);
    assert.match(guss, /Graphit beeinflusst das Verhalten/);
    assert.match(ne, /Nichteisenmetalle als Materialkarten/);
    assert.match(ne, /Messing/);
    assert.match(alu, /Aluminium in der Produktion mit Oxidschicht/);
    assert.match(alu, /Oberflaeche beachten/);
    assert.match(kupfer, /Kupfer und Leitfaehigkeit/);
    assert.match(kupfer, /leitet Waerme und Strom gut/);
  });
});

describe('Fachkunde Werkstoff-Interaktionen', () => {
  it('rendert Werkstoff-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const gruppen = renderToStaticMarkup(React.createElement(WerkstoffgruppenTrainer));
    const stahl = renderToStaticMarkup(React.createElement(EisenStahlTrainer));
    const guss = renderToStaticMarkup(React.createElement(GusseisenTrainer));
    const ne = renderToStaticMarkup(React.createElement(NichteisenmetalleTrainer));
    const alu = renderToStaticMarkup(React.createElement(AluminiumTrainer));
    const kupfer = renderToStaticMarkup(React.createElement(KupferTrainer));

    assert.match(gruppen, /Werkstoffgruppen ueberblicken/);
    assert.match(gruppen, /Farbe raten/);
    assert.match(gruppen, /aria-live="polite"/);
    assert.match(stahl, /Eisenwerkstoffe und Stahl/);
    assert.match(stahl, /Augenmass/);
    assert.match(stahl, /aria-pressed/);
    assert.match(guss, /Gusseisen verstehen/);
    assert.match(guss, /Kupferdraht/);
    assert.match(ne, /Nichteisenmetalle einordnen/);
    assert.match(ne, /Immer magnetisch/);
    assert.match(alu, /Aluminium in der Produktion/);
    assert.match(alu, /Mit Stahl gleichsetzen/);
    assert.match(kupfer, /Kupfer und Leitfaehigkeit/);
    assert.match(kupfer, /Als Kunststoff behandeln/);
  });
});

describe('Fachkunde Werkstoff-Kunststoff-Visuals', () => {
  it('rendert Kunststoffarten, Additive und Materialverfolgung zugaenglich', () => {
    const thermoplast = renderToStaticMarkup(React.createElement(ThermoplastSchema));
    const duroplast = renderToStaticMarkup(React.createElement(DuroplastSchema));
    const elastomer = renderToStaticMarkup(React.createElement(ElastomerSchema));
    const additive = renderToStaticMarkup(React.createElement(AdditiveMasterbatchSchema));
    const granulat = renderToStaticMarkup(React.createElement(GranulatChargeRezyklatSchema));

    assert.match(thermoplast, /Thermoplast Verhalten bei Waerme/);
    assert.match(duroplast, /Duroplast als vernetztes Strukturmodell/);
    assert.match(elastomer, /Elastomer mit Rueckstellung/);
    assert.match(additive, /Additive und Masterbatch als Granulatmix/);
    assert.match(granulat, /Granulat Charge und Rezyklat rueckverfolgen/);
  });
});

describe('Fachkunde Werkstoff-Kunststoff-Interaktionen', () => {
  it('rendert Kunststoff-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const thermoplast = renderToStaticMarkup(React.createElement(ThermoplastTrainer));
    const duroplast = renderToStaticMarkup(React.createElement(DuroplastTrainer));
    const elastomer = renderToStaticMarkup(React.createElement(ElastomerTrainer));
    const additive = renderToStaticMarkup(React.createElement(AdditiveMasterbatchTrainer));
    const granulat = renderToStaticMarkup(React.createElement(GranulatChargeRezyklatTrainer));

    assert.match(thermoplast, /Thermoplaste verstehen/);
    assert.match(thermoplast, /Immer vernetzen/);
    assert.match(thermoplast, /aria-live="polite"/);
    assert.match(duroplast, /Duroplaste abgrenzen/);
    assert.match(duroplast, /Schmelze einstellen/);
    assert.match(duroplast, /aria-pressed/);
    assert.match(elastomer, /Elastomere verstehen/);
    assert.match(elastomer, /Stahlhaerte/);
    assert.match(additive, /Additive und Masterbatch einordnen/);
    assert.match(additive, /Handvoll zugeben/);
    assert.match(granulat, /Granulat, Charge und Rezyklat verfolgen/);
    assert.match(granulat, /Etikett wegwerfen/);
  });
});

describe('Fachkunde Werkstoffeigenschaften-Visuals', () => {
  it('rendert Eigenschaften-Visuals zugaenglich', () => {
    const haerte = renderToStaticMarkup(React.createElement(HaerteSchema));
    const festigkeit = renderToStaticMarkup(React.createElement(FestigkeitSchema));
    const zaehigkeit = renderToStaticMarkup(React.createElement(ZaehigkeitSproedigkeitSchema));
    const verformung = renderToStaticMarkup(React.createElement(ElastischPlastischSchema));
    const dichte = renderToStaticMarkup(React.createElement(DichteVergleichSchema));
    const waerme = renderToStaticMarkup(React.createElement(WaermeausdehnungSchema));
    const korrosion = renderToStaticMarkup(React.createElement(KorrosionSchema));
    const auswahl = renderToStaticMarkup(React.createElement(WerkstoffauswahlSchema));

    assert.match(haerte, /Haerte als Widerstand gegen Eindringen/);
    assert.match(festigkeit, /Festigkeit bei Belastung/);
    assert.match(zaehigkeit, /Zaehigkeit und Sproedigkeit im Bruchvergleich/);
    assert.match(verformung, /Elastische und plastische Verformung/);
    assert.match(dichte, /Dichte im Werkstoffvergleich/);
    assert.match(waerme, /Waermeausdehnung bei Temperaturanstieg/);
    assert.match(korrosion, /Korrosion und Schutz am Bauteil/);
    assert.match(auswahl, /Werkstoffauswahl nach Aufgabe/);
  });
});

describe('Fachkunde Werkstoffeigenschaften-Interaktionen', () => {
  it('rendert Eigenschaften-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const haerte = renderToStaticMarkup(React.createElement(HaerteTrainer));
    const festigkeit = renderToStaticMarkup(React.createElement(FestigkeitTrainer));
    const zaehigkeit = renderToStaticMarkup(React.createElement(ZaehigkeitSproedigkeitTrainer));
    const verformung = renderToStaticMarkup(React.createElement(ElastischPlastischTrainer));
    const dichte = renderToStaticMarkup(React.createElement(DichteVergleichTrainer));
    const waerme = renderToStaticMarkup(React.createElement(WaermeausdehnungTrainer));
    const korrosion = renderToStaticMarkup(React.createElement(KorrosionTrainer));
    const auswahl = renderToStaticMarkup(React.createElement(WerkstoffauswahlTrainer));

    assert.match(haerte, /Haerte verstehen/);
    assert.match(haerte, /Farbe beurteilen/);
    assert.match(haerte, /aria-live="polite"/);
    assert.match(festigkeit, /Festigkeit verstehen/);
    assert.match(festigkeit, /Gewicht erraten/);
    assert.match(festigkeit, /aria-pressed/);
    assert.match(zaehigkeit, /Zaehigkeit und Sproedigkeit/);
    assert.match(zaehigkeit, /Immer gleich behandeln/);
    assert.match(verformung, /Elastizitaet und plastische Verformung/);
    assert.match(verformung, /Wert ignorieren/);
    assert.match(dichte, /Dichte im Werkstoffvergleich/);
    assert.match(dichte, /Farbe vergleichen/);
    assert.match(waerme, /Waermeausdehnung einfach/);
    assert.match(waerme, /Kaltmass ignorieren/);
    assert.match(korrosion, /Korrosion erkennen/);
    assert.match(korrosion, /Rost ueberstreichen/);
    assert.match(auswahl, /Werkstoffauswahl nach Aufgabe/);
    assert.match(auswahl, /Material frei tauschen/);
  });
});

describe('Fachkunde Maschinenelemente-Visuals', () => {
  it('rendert Maschinenelemente-Visuals zugaenglich', () => {
    const welle = renderToStaticMarkup(React.createElement(WelleAchseSchema));
    const lager = renderToStaticMarkup(React.createElement(LagerartenSchema));
    const gleitlager = renderToStaticMarkup(React.createElement(GleitlagerSchema));
    const waelzlager = renderToStaticMarkup(React.createElement(WaelzlagerSchema));
    const kupplung = renderToStaticMarkup(React.createElement(KupplungSchema));
    const zahnrad = renderToStaticMarkup(React.createElement(ZahnradgetriebeSchema));
    const riemen = renderToStaticMarkup(React.createElement(RiemenantriebSchema));
    const kette = renderToStaticMarkup(React.createElement(KettenantriebSchema));
    const schrauben = renderToStaticMarkup(React.createElement(SchraubenMutternSchema));
    const federn = renderToStaticMarkup(React.createElement(FedernDaempferSchema));

    assert.match(welle, /Welle und Achse im Funktionsvergleich/);
    assert.match(lager, /Lagerarten als Grundueberblick/);
    assert.match(gleitlager, /Gleitlager mit Schmierfilm/);
    assert.match(waelzlager, /Waelzlager mit Waelzkoerpern/);
    assert.match(kupplung, /Kupplung uebertraegt Drehmoment/);
    assert.match(zahnrad, /Zahnradgetriebe mit Uebersetzung/);
    assert.match(riemen, /Riemenantrieb mit Kraftschluss/);
    assert.match(kette, /Kettenantrieb mit Formschluss/);
    assert.match(schrauben, /Schrauben und Muttern als loesbare Verbindung/);
    assert.match(federn, /Federn und Daempfer im Funktionsvergleich/);
  });
});

describe('Fachkunde Maschinenelemente-Interaktionen', () => {
  it('rendert Maschinenelemente-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const welle = renderToStaticMarkup(React.createElement(WelleAchseTrainer));
    const lager = renderToStaticMarkup(React.createElement(LagerartenTrainer));
    const gleitlager = renderToStaticMarkup(React.createElement(GleitlagerTrainer));
    const waelzlager = renderToStaticMarkup(React.createElement(WaelzlagerTrainer));
    const kupplung = renderToStaticMarkup(React.createElement(KupplungTrainer));
    const zahnrad = renderToStaticMarkup(React.createElement(ZahnradgetriebeTrainer));
    const riemen = renderToStaticMarkup(React.createElement(RiemenantriebTrainer));
    const kette = renderToStaticMarkup(React.createElement(KettenantriebTrainer));
    const schrauben = renderToStaticMarkup(React.createElement(SchraubenMutternTrainer));
    const federn = renderToStaticMarkup(React.createElement(FedernDaempferTrainer));

    assert.match(welle, /Wellen und Achsen unterscheiden/);
    assert.match(welle, /Farbe vergleichen/);
    assert.match(welle, /aria-live="polite"/);
    assert.match(lager, /Lagerarten ueberblicken/);
    assert.match(lager, /Lager werfen/);
    assert.match(lager, /aria-pressed/);
    assert.match(gleitlager, /Gleitlager verstehen/);
    assert.match(gleitlager, /Trocken weiterfahren/);
    assert.match(waelzlager, /Waelzlager verstehen/);
    assert.match(waelzlager, /Mit Hammer eintreiben/);
    assert.match(kupplung, /Kupplungen/);
    assert.match(kupplung, /Offen greifen/);
    assert.match(zahnrad, /Zahnradgetriebe/);
    assert.match(zahnrad, /Zaehne abschaetzen/);
    assert.match(riemen, /Riemenantrieb/);
    assert.match(riemen, /Riemen anfassen/);
    assert.match(kette, /Kettenantrieb/);
    assert.match(kette, /Kette im Lauf richten/);
    assert.match(schrauben, /Schrauben und Muttern/);
    assert.match(schrauben, /Nach Gefuehl anziehen/);
    assert.match(federn, /Federn und Daempfer/);
    assert.match(federn, /Daempfer ausbauen/);
  });
});

describe('Fachkunde Fertigungsgrundlagen-Visuals', () => {
  it('rendert Fertigungsgrundlagen-Visuals zugaenglich', () => {
    const hauptgruppen = renderToStaticMarkup(React.createElement(FertigungHauptgruppenSchema));
    const span = renderToStaticMarkup(React.createElement(SpanendSpanlosSchema));
    const bewegung = renderToStaticMarkup(React.createElement(SchnittVorschubSchema));
    const vc = renderToStaticMarkup(React.createElement(SchnittgeschwindigkeitSchema));
    const n = renderToStaticMarkup(React.createElement(DrehzahlBerechnenSchema));
    const vf = renderToStaticMarkup(React.createElement(VorschubZustellungSchema));
    const verschleiss = renderToStaticMarkup(React.createElement(WerkzeugverschleissSchema));
    const kss = renderToStaticMarkup(React.createElement(KuehlschmierstoffFertigungSchema));
    const daten = renderToStaticMarkup(React.createElement(WerkzeugdatenSchema));
    const zeit = renderToStaticMarkup(React.createElement(BearbeitungszeitSchema));

    assert.match(hauptgruppen, /Sechs Hauptgruppen der Fertigung/);
    assert.match(span, /Spanend und spanlos unterscheiden/);
    assert.match(bewegung, /Schnittbewegung Vorschub und Zustellung/);
    assert.match(vc, /Schnittgeschwindigkeit am Werkstueckumfang/);
    assert.match(n, /Drehzahl aus Schnittgeschwindigkeit berechnen/);
    assert.match(vf, /Vorschub und Zustellung beeinflussen den Span/);
    assert.match(verschleiss, /Werkzeugverschleiss an der Schneide/);
    assert.match(kss, /Kuehlschmierstoff an der Schnittzone/);
    assert.match(daten, /Werkzeugdaten sicher uebernehmen/);
    assert.match(zeit, /Bearbeitungszeit grob planen/);
  });
});

describe('Fachkunde Fertigungsgrundlagen-Interaktionen', () => {
  it('rendert Fertigungsgrundlagen-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const hauptgruppen = renderToStaticMarkup(React.createElement(FertigungHauptgruppenTrainer));
    const span = renderToStaticMarkup(React.createElement(SpanendSpanlosTrainer));
    const bewegung = renderToStaticMarkup(React.createElement(SchnittVorschubTrainer));
    const vc = renderToStaticMarkup(React.createElement(SchnittgeschwindigkeitTrainer));
    const n = renderToStaticMarkup(React.createElement(DrehzahlBerechnenTrainer));
    const vf = renderToStaticMarkup(React.createElement(VorschubZustellungTrainer));
    const verschleiss = renderToStaticMarkup(React.createElement(WerkzeugverschleissTrainer));
    const kss = renderToStaticMarkup(React.createElement(KuehlschmierstoffFertigungTrainer));
    const daten = renderToStaticMarkup(React.createElement(WerkzeugdatenTrainer));
    const zeit = renderToStaticMarkup(React.createElement(BearbeitungszeitTrainer));

    assert.match(hauptgruppen, /Fertigungshauptgruppen/);
    assert.match(hauptgruppen, /Nach Farbe sortieren/);
    assert.match(hauptgruppen, /aria-live="polite"/);
    assert.match(span, /Spanend und spanlos unterscheiden/);
    assert.match(span, /Spaene ignorieren/);
    assert.match(span, /aria-pressed/);
    assert.match(bewegung, /Schnittbewegung und Vorschub/);
    assert.match(bewegung, /Werkzeugfarbe waehlen/);
    assert.match(vc, /Schnittgeschwindigkeit/);
    assert.match(vc, /Wert raten/);
    assert.match(n, /Drehzahl berechnen/);
    assert.match(n, /Maximal stellen/);
    assert.match(vf, /Vorschub und Zustellung/);
    assert.match(vf, /Hebel festhalten/);
    assert.match(verschleiss, /Standzeit und Werkzeugverschleiss/);
    assert.match(verschleiss, /Weiterdruecken/);
    assert.match(kss, /Kuehlschmierstoffe/);
    assert.match(kss, /Mit Hand pruefen/);
    assert.match(daten, /Werkzeugdaten sicher uebernehmen/);
    assert.match(daten, /Aus Erinnerung nehmen/);
    assert.match(zeit, /Bearbeitungszeit grob planen/);
    assert.match(zeit, /Pause einrechnen/);
  });
});

describe('Fachkunde Metallbearbeitung-Visuals', () => {
  it('rendert Metallbearbeitungs-Visuals zugaenglich', () => {
    const saege = renderToStaticMarkup(React.createElement(SaegeSchema));
    const bohren = renderToStaticMarkup(React.createElement(BohrenSchema));
    const senken = renderToStaticMarkup(React.createElement(SenkenReibenSchema));
    const gewinde = renderToStaticMarkup(React.createElement(GewindeschneidenSchema));
    const drehen = renderToStaticMarkup(React.createElement(DrehenGrundlagenSchema));
    const dreharten = renderToStaticMarkup(React.createElement(LaengsPlanDrehenSchema));
    const fraesen = renderToStaticMarkup(React.createElement(FraesenGrundlagenSchema));
    const fraesarten = renderToStaticMarkup(React.createElement(UmfangStirnFraesenSchema));
    const schleifen = renderToStaticMarkup(React.createElement(SchleifenSchema));
    const stanzen = renderToStaticMarkup(React.createElement(StanzenSchneidenSchema));
    const biegen = renderToStaticMarkup(React.createElement(BiegenSchema));
    const walzen = renderToStaticMarkup(React.createElement(WalzenSchema));
    const tiefziehen = renderToStaticMarkup(React.createElement(TiefziehenSchema));
    const pressen = renderToStaticMarkup(React.createElement(PressenSchema));
    const schmieden = renderToStaticMarkup(React.createElement(SchmiedenSchema));
    const giessen = renderToStaticMarkup(React.createElement(GiessenSchema));
    const schweissen = renderToStaticMarkup(React.createElement(SchweissenSchema));
    const loeten = renderToStaticMarkup(React.createElement(LoetenSchema));
    const kleben = renderToStaticMarkup(React.createElement(KlebenSchema));
    const schrauben = renderToStaticMarkup(React.createElement(SchraubenNietenSchema));

    assert.match(saege, /Saegen mit Saegeblatt und Schnittspalt/);
    assert.match(bohren, /Bohren mit Bohrer Span und Bohrung/);
    assert.match(senken, /Senken und Reiben an einer Bohrung/);
    assert.match(gewinde, /Gewindeschneiden mit Kernloch/);
    assert.match(drehen, /Drehen Grundlagen an der Drehmaschine/);
    assert.match(dreharten, /Laengs- und Plandrehen im Vergleich/);
    assert.match(fraesen, /Fraesen Grundlagen mit rotierendem Fraeser/);
    assert.match(fraesarten, /Umfangs- und Stirnfraesen unterscheiden/);
    assert.match(schleifen, /Schleifen mit Schleifscheibe und Korn/);
    assert.match(stanzen, /Stanzen und Schneiden mit Stempel und Matrize/);
    assert.match(biegen, /Biegen mit Biegeradius und Rueckfederung/);
    assert.match(walzen, /Walzen mit Walzspalt/);
    assert.match(tiefziehen, /Tiefziehen mit Niederhalter und Ziehring/);
    assert.match(pressen, /Pressen mit Presskraft und Flaeche/);
    assert.match(schmieden, /Schmieden mit Rohling und Werkzeug/);
    assert.match(giessen, /Giessen mit Form Schmelze und Speiser/);
    assert.match(schweissen, /Schweissen mit Schweissnaht und Waerme/);
    assert.match(loeten, /Loeten mit Lot und Benetzung/);
    assert.match(kleben, /Kleben mit Oberflaeche und Klebschicht/);
    assert.match(schrauben, /Schrauben und Nieten als Verbindungen/);
  });
});

describe('Fachkunde Metallbearbeitung-Interaktionen', () => {
  it('rendert Metallbearbeitungs-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const saege = renderToStaticMarkup(React.createElement(SaegeTrainer));
    const bohren = renderToStaticMarkup(React.createElement(BohrenTrainer));
    const senken = renderToStaticMarkup(React.createElement(SenkenReibenTrainer));
    const gewinde = renderToStaticMarkup(React.createElement(GewindeschneidenTrainer));
    const drehen = renderToStaticMarkup(React.createElement(DrehenGrundlagenTrainer));
    const dreharten = renderToStaticMarkup(React.createElement(LaengsPlanDrehenTrainer));
    const fraesen = renderToStaticMarkup(React.createElement(FraesenGrundlagenTrainer));
    const fraesarten = renderToStaticMarkup(React.createElement(UmfangStirnFraesenTrainer));
    const schleifen = renderToStaticMarkup(React.createElement(SchleifenTrainer));
    const stanzen = renderToStaticMarkup(React.createElement(StanzenSchneidenTrainer));
    const biegen = renderToStaticMarkup(React.createElement(BiegenTrainer));
    const walzen = renderToStaticMarkup(React.createElement(WalzenTrainer));
    const tiefziehen = renderToStaticMarkup(React.createElement(TiefziehenTrainer));
    const pressen = renderToStaticMarkup(React.createElement(PressenTrainer));
    const schmieden = renderToStaticMarkup(React.createElement(SchmiedenTrainer));
    const giessen = renderToStaticMarkup(React.createElement(GiessenTrainer));
    const schweissen = renderToStaticMarkup(React.createElement(SchweissenTrainer));
    const loeten = renderToStaticMarkup(React.createElement(LoetenTrainer));
    const kleben = renderToStaticMarkup(React.createElement(KlebenTrainer));
    const schrauben = renderToStaticMarkup(React.createElement(SchraubenNietenTrainer));

    assert.match(saege, /Saegen/);
    assert.match(saege, /Mit Hand fuehren/);
    assert.match(saege, /aria-live="polite"/);
    assert.match(bohren, /Bohren/);
    assert.match(bohren, /Bohrer frei halten/);
    assert.match(bohren, /aria-pressed/);
    assert.match(senken, /Senken und Reiben/);
    assert.match(senken, /Loch grob aufreissen/);
    assert.match(gewinde, /Gewindeschneiden/);
    assert.match(gewinde, /Trocken erzwingen/);
    assert.match(drehen, /Drehen Grundlagen/);
    assert.match(drehen, /Futter offen lassen/);
    assert.match(dreharten, /Laengs- und Plandrehen/);
    assert.match(dreharten, /Richtung raten/);
    assert.match(fraesen, /Fraesen Grundlagen/);
    assert.match(fraesen, /Spane wegblasen/);
    assert.match(fraesarten, /Umfangs- und Stirnfraesen/);
    assert.match(fraesarten, /Gleich behandeln/);
    assert.match(schleifen, /Schleifen/);
    assert.match(schleifen, /Ohne Schutzscheibe/);
    assert.match(stanzen, /Stanzen und Schneiden/);
    assert.match(stanzen, /Blech festhalten/);
    assert.match(biegen, /Biegen/);
    assert.match(biegen, /Winkel ignorieren/);
    assert.match(walzen, /Walzen/);
    assert.match(walzen, /Walzen anfassen/);
    assert.match(tiefziehen, /Tiefziehen/);
    assert.match(tiefziehen, /Blech knicken/);
    assert.match(pressen, /Pressen/);
    assert.match(pressen, /Hand einlegen/);
    assert.match(schmieden, /Schmieden/);
    assert.match(schmieden, /Kalt anfassen/);
    assert.match(giessen, /Giessen/);
    assert.match(giessen, /Form schuetteln/);
    assert.match(schweissen, /Schweissen/);
    assert.match(schweissen, /Ohne Schutz schauen/);
    assert.match(loeten, /Loeten/);
    assert.match(loeten, /Lot aufhaeufen/);
    assert.match(kleben, /Kleben/);
    assert.match(kleben, /Flaeche anfetten/);
    assert.match(schrauben, /Schrauben und Nieten/);
    assert.match(schrauben, /Niet wieder aufdrehen/);
  });
});

describe('Fachkunde Kunststoffverfahren-Visuals', () => {
  it('rendert Kunststoffverfahren-Visuals zugaenglich', () => {
    const maschine = renderToStaticMarkup(React.createElement(SpritzgiessmaschineSchema));
    const material = renderToStaticMarkup(React.createElement(MaterialtrichterTrocknungSchema));
    const schnecke = renderToStaticMarkup(React.createElement(SchneckeZylinderSchema));
    const einzug = renderToStaticMarkup(React.createElement(EinzugszoneSchema));
    const kompression = renderToStaticMarkup(React.createElement(KompressionszoneSchema));
    const metering = renderToStaticMarkup(React.createElement(MeteringzoneSchema));
    const duese = renderToStaticMarkup(React.createElement(RueckstromsperreDueseSchema));
    const werkzeug = renderToStaticMarkup(React.createElement(WerkzeugKavitaetSchema));
    const anguss = renderToStaticMarkup(React.createElement(AngussEntlueftungSchema));
    const auswerfer = renderToStaticMarkup(React.createElement(AuswerferEntformenSchema));
    const temperierung = renderToStaticMarkup(React.createElement(WerkzeugtemperierungSchema));
    const dosieren = renderToStaticMarkup(React.createElement(PlastifizierenDosierenSchema));
    const einspritzen = renderToStaticMarkup(React.createElement(EinspritzenUmschaltpunktSchema));
    const nachdruck = renderToStaticMarkup(React.createElement(NachdruckSchema));
    const kuehlung = renderToStaticMarkup(React.createElement(KuehlzeitRestkuehlzeitSchema));
    const schliesskraft = renderToStaticMarkup(React.createElement(SchliesskraftSchema));
    const parameter = renderToStaticMarkup(React.createElement(SpritzgiessParameterSchema));
    const zyklus = renderToStaticMarkup(React.createElement(SpritzgiesszyklusSchema));
    const extruder = renderToStaticMarkup(React.createElement(ExtruderAufbauSchema));
    const produkte = renderToStaticMarkup(React.createElement(ExtrusionsprodukteSchema));
    const blasformen = renderToStaticMarkup(React.createElement(BlasformenSchema));
    const thermoformen = renderToStaticMarkup(React.createElement(ThermoformenSchema));
    const verzug = renderToStaticMarkup(React.createElement(SchwindungVerzugSchema));
    const orientierung = renderToStaticMarkup(React.createElement(MolekuelorientierungSchema));
    const wechsel = renderToStaticMarkup(React.createElement(FarbMaterialwechselSchema));

    assert.match(maschine, /Spritzgiessmaschine mit Schliess- und Spritzeinheit/);
    assert.match(material, /Materialtrichter und Trocknung vor dem Plastifizieren/);
    assert.match(schnecke, /Schnecke und Zylinder plastifizieren Kunststoff/);
    assert.match(einzug, /Einzugszone nimmt Granulat sicher auf/);
    assert.match(kompression, /Kompressionszone verdichtet und schmilzt/);
    assert.match(metering, /Meteringzone homogenisiert die Schmelze/);
    assert.match(duese, /Rueckstromsperre und Duese fuehren die Schmelze/);
    assert.match(werkzeug, /Werkzeug und Kavitaet geben die Form vor/);
    assert.match(anguss, /Anguss und Entlueftung fuehren Schmelze und Luft/);
    assert.match(auswerfer, /Auswerfer entformen das abgekuehlte Teil/);
    assert.match(temperierung, /Werkzeugtemperierung stabilisiert den Prozess/);
    assert.match(dosieren, /Plastifizieren und Dosieren bereiten den Schuss vor/);
    assert.match(einspritzen, /Einspritzen und Umschaltpunkt fuellen die Kavitaet/);
    assert.match(nachdruck, /Nachdruck gleicht Schwindung beim Erstarren aus/);
    assert.match(kuehlung, /Kuehlzeit und Restkuehlzeit bestimmen Entformbarkeit/);
    assert.match(schliesskraft, /Schliesskraft haelt das Werkzeug geschlossen/);
    assert.match(parameter, /Einspritzdruck Staudruck und Temperaturen zusammen lesen/);
    assert.match(zyklus, /Kompletter Spritzgiesszyklus vom Schliessen bis Entformen/);
    assert.match(extruder, /Extruder mit Trichter Schnecke Zylinder und Werkzeug/);
    assert.match(produkte, /Profile Rohre und Folien extrudieren/);
    assert.match(blasformen, /Blasformen erzeugt Hohlkoerper mit Luftdruck/);
    assert.match(thermoformen, /Thermoformen verformt erwaermte Folie oder Platte/);
    assert.match(verzug, /Schwindung und Verzug veraendern Mass und Form/);
    assert.match(orientierung, /Molekuelorientierung folgt Fliessrichtung und Abkuehlung/);
    assert.match(wechsel, /Farbwechsel und Materialwechsel kontrolliert durchfuehren/);
  });
});

describe('Fachkunde Kunststoffverfahren-Interaktionen', () => {
  it('rendert Kunststoffverfahren-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const maschine = renderToStaticMarkup(React.createElement(SpritzgiessmaschineTrainer));
    const material = renderToStaticMarkup(React.createElement(MaterialtrichterTrocknungTrainer));
    const schnecke = renderToStaticMarkup(React.createElement(SchneckeZylinderTrainer));
    const einzug = renderToStaticMarkup(React.createElement(EinzugszoneTrainer));
    const kompression = renderToStaticMarkup(React.createElement(KompressionszoneTrainer));
    const metering = renderToStaticMarkup(React.createElement(MeteringzoneTrainer));
    const duese = renderToStaticMarkup(React.createElement(RueckstromsperreDueseTrainer));
    const werkzeug = renderToStaticMarkup(React.createElement(WerkzeugKavitaetTrainer));
    const anguss = renderToStaticMarkup(React.createElement(AngussEntlueftungTrainer));
    const auswerfer = renderToStaticMarkup(React.createElement(AuswerferEntformenTrainer));
    const temperierung = renderToStaticMarkup(React.createElement(WerkzeugtemperierungTrainer));
    const dosieren = renderToStaticMarkup(React.createElement(PlastifizierenDosierenTrainer));
    const einspritzen = renderToStaticMarkup(React.createElement(EinspritzenUmschaltpunktTrainer));
    const nachdruck = renderToStaticMarkup(React.createElement(NachdruckTrainer));
    const kuehlung = renderToStaticMarkup(React.createElement(KuehlzeitRestkuehlzeitTrainer));
    const schliesskraft = renderToStaticMarkup(React.createElement(SchliesskraftTrainer));
    const parameter = renderToStaticMarkup(React.createElement(SpritzgiessParameterTrainer));
    const zyklus = renderToStaticMarkup(React.createElement(SpritzgiesszyklusTrainer));
    const extruder = renderToStaticMarkup(React.createElement(ExtruderAufbauTrainer));
    const produkte = renderToStaticMarkup(React.createElement(ExtrusionsprodukteTrainer));
    const blasformen = renderToStaticMarkup(React.createElement(BlasformenTrainer));
    const thermoformen = renderToStaticMarkup(React.createElement(ThermoformenTrainer));
    const verzug = renderToStaticMarkup(React.createElement(SchwindungVerzugTrainer));
    const orientierung = renderToStaticMarkup(React.createElement(MolekuelorientierungTrainer));
    const wechsel = renderToStaticMarkup(React.createElement(FarbMaterialwechselTrainer));

    assert.match(maschine, /Spritzgiessmaschine ueberblicken/);
    assert.match(maschine, /Nur Farbe vergleichen/);
    assert.match(maschine, /aria-live="polite"/);
    assert.match(material, /Materialtrichter und Trocknung/);
    assert.match(material, /Feuchte ignorieren/);
    assert.match(schnecke, /Schnecke und Zylinder/);
    assert.match(schnecke, /Schnecke trocken laufen lassen/);
    assert.match(einzug, /Einzugszone/);
    assert.match(einzug, /Trichter leerfahren/);
    assert.match(kompression, /Kompressionszone/);
    assert.match(kompression, /Wasser zusetzen/);
    assert.match(metering, /Meteringzone/);
    assert.match(metering, /Kavitaet oeffnen/);
    assert.match(duese, /Rueckstromsperre und Duese/);
    assert.match(duese, /Schmelze zurueckblasen/);
    assert.match(werkzeug, /Werkzeug und Kavitaet/);
    assert.match(werkzeug, /Form raten/);
    assert.match(anguss, /Anguss und Entlueftung/);
    assert.match(anguss, /Entlueftung zukleben/);
    assert.match(auswerfer, /Auswerfer und Entformen/);
    assert.match(auswerfer, /Teil heraushebeln/);
    assert.match(temperierung, /Werkzeugtemperierung/);
    assert.match(temperierung, /Schlauch knicken/);
    assert.match(dosieren, /Plastifizieren und Dosieren/);
    assert.match(dosieren, /Menge schaetzen/);
    assert.match(einspritzen, /Einspritzen und Umschaltpunkt/);
    assert.match(einspritzen, /Bis Anschlag fahren/);
    assert.match(nachdruck, /Nachdruck/);
    assert.match(nachdruck, /Werkzeug oeffnen/);
    assert.match(kuehlung, /Kuehlzeit und Restkuehlzeit/);
    assert.match(kuehlung, /Heiss auswerfen/);
    assert.match(schliesskraft, /Schliesskraft/);
    assert.match(schliesskraft, /Kraft nach Gefuehl senken/);
    assert.match(parameter, /Einspritzdruck, Staudruck, Temperaturen/);
    assert.match(parameter, /Werte frei erfinden/);
    assert.match(zyklus, /Kompletter Spritzgiesszyklus/);
    assert.match(zyklus, /Reihenfolge mischen/);
    assert.match(extruder, /Extruder aufbauen/);
    assert.match(extruder, /Schussweise auswerfen/);
    assert.match(produkte, /Profile, Rohre und Folien extrudieren/);
    assert.match(produkte, /Produkt knicken/);
    assert.match(blasformen, /Blasformen/);
    assert.match(blasformen, /Werkzeug offen aufblasen/);
    assert.match(thermoformen, /Thermoformen/);
    assert.match(thermoformen, /Kalt tiefziehen/);
    assert.match(verzug, /Schwindung und Verzug/);
    assert.match(verzug, /Teil warm richten/);
    assert.match(orientierung, /Molekuelorientierung einfach/);
    assert.match(orientierung, /Molekuele sortieren/);
    assert.match(wechsel, /Farbwechsel und Materialwechsel/);
    assert.match(wechsel, /Vermischung verstecken/);
    assert.match(wechsel, /aria-pressed/);
  });
});

describe('Fachkunde Produktionsvorbereitung-Visuals', () => {
  it('rendert Produktionsvorbereitung-Visuals zugaenglich', () => {
    const abgleich = renderToStaticMarkup(React.createElement(AuftragZeichnungAbgleichSchema));
    const material = renderToStaticMarkup(React.createElement(MaterialChargePruefenSchema));
    const werkzeug = renderToStaticMarkup(React.createElement(WerkzeugVorbereitenSchema));
    const ruesten = renderToStaticMarkup(React.createElement(MaschineRuestenSchema));
    const parameter = renderToStaticMarkup(React.createElement(ParameterUebernehmenSchema));
    const erstteil = renderToStaticMarkup(React.createElement(ErstteilHerstellenSchema));
    const pruefen = renderToStaticMarkup(React.createElement(ErstteilPruefenSchema));
    const freigabe = renderToStaticMarkup(React.createElement(ProduktionsfreigabeSchema));
    const wechsel = renderToStaticMarkup(React.createElement(WerkzeugwechselVorbereitungSchema));
    const anfahren = renderToStaticMarkup(React.createElement(AnfahrenAbfahrenSchema));
    const uebergabe = renderToStaticMarkup(React.createElement(SchichtuebergabeSchema));
    const daten = renderToStaticMarkup(React.createElement(ProduktionsdatenQualitaetSchema));

    assert.match(abgleich, /Auftrag und Zeichnung sicher abgleichen/);
    assert.match(material, /Material und Charge pruefen/);
    assert.match(werkzeug, /Werkzeug am Ruestplatz vorbereiten/);
    assert.match(ruesten, /Maschine ruesten in sicherer Reihenfolge/);
    assert.match(parameter, /Parameter aus Rezept oder Vorgabe uebernehmen/);
    assert.match(erstteil, /Erstteil herstellen und Anfahren beobachten/);
    assert.match(pruefen, /Erstteil gegen Pruefplan pruefen/);
    assert.match(freigabe, /Produktionsfreigabe nach Pruefung entscheiden/);
    assert.match(wechsel, /Werkzeugwechsel sicher planen/);
    assert.match(anfahren, /Anfahren und Abfahren kontrolliert ausfuehren/);
    assert.match(uebergabe, /Schichtuebergabe mit relevanten Informationen/);
    assert.match(daten, /Produktionsdaten fuer Qualitaet sichern/);
  });
});

describe('Fachkunde Produktionsvorbereitung-Interaktionen', () => {
  it('rendert Produktionsvorbereitung-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const abgleich = renderToStaticMarkup(React.createElement(AuftragZeichnungAbgleichTrainer));
    const material = renderToStaticMarkup(React.createElement(MaterialChargePruefenTrainer));
    const werkzeug = renderToStaticMarkup(React.createElement(WerkzeugVorbereitenTrainer));
    const ruesten = renderToStaticMarkup(React.createElement(MaschineRuestenTrainer));
    const parameter = renderToStaticMarkup(React.createElement(ParameterUebernehmenTrainer));
    const erstteil = renderToStaticMarkup(React.createElement(ErstteilHerstellenTrainer));
    const pruefen = renderToStaticMarkup(React.createElement(ErstteilPruefenTrainer));
    const freigabe = renderToStaticMarkup(React.createElement(ProduktionsfreigabeTrainer));
    const wechsel = renderToStaticMarkup(React.createElement(WerkzeugwechselVorbereitungTrainer));
    const anfahren = renderToStaticMarkup(React.createElement(AnfahrenAbfahrenTrainer));
    const uebergabe = renderToStaticMarkup(React.createElement(SchichtuebergabeTrainer));
    const daten = renderToStaticMarkup(React.createElement(ProduktionsdatenQualitaetTrainer));

    assert.match(abgleich, /Auftrag und Zeichnung abgleichen/);
    assert.match(abgleich, /Einfach starten/);
    assert.match(abgleich, /aria-live="polite"/);
    assert.match(material, /Material und Charge pruefen/);
    assert.match(material, /Sackfarbe nehmen/);
    assert.match(werkzeug, /Werkzeug vorbereiten/);
    assert.match(werkzeug, /Beschaedigung uebersehen/);
    assert.match(ruesten, /Maschine ruesten/);
    assert.match(ruesten, /Schutz offen lassen/);
    assert.match(parameter, /Parameter uebernehmen/);
    assert.match(parameter, /Werte auswendig setzen/);
    assert.match(erstteil, /Erstteil herstellen/);
    assert.match(erstteil, /Sofort Serie buchen/);
    assert.match(pruefen, /Erstteil pruefen/);
    assert.match(pruefen, /Grenzwert raten/);
    assert.match(freigabe, /Produktionsfreigabe/);
    assert.match(freigabe, /Fehler weiterlaufen lassen/);
    assert.match(wechsel, /Werkzeugwechsel/);
    assert.match(wechsel, /In Bewegung wechseln/);
    assert.match(anfahren, /Anfahren und Abfahren/);
    assert.match(anfahren, /Alles als Gutteil zaehlen/);
    assert.match(uebergabe, /Schichtuebergabe/);
    assert.match(uebergabe, /Nur sagen: laeuft/);
    assert.match(daten, /Produktionsdaten fuer Qualitaet sichern/);
    assert.match(daten, /Daten spaeter erfinden/);
    assert.match(daten, /aria-pressed/);
  });
});

describe('Fachkunde Qualitaet-Visuals', () => {
  it('rendert Qualitaets-Visuals zugaenglich', () => {
    const qualitaet = renderToStaticMarkup(React.createElement(QualitaetBetriebSchema));
    const sollIst = renderToStaticMarkup(React.createElement(SollIstNennmassSchema));
    const toleranz = renderToStaticMarkup(React.createElement(GrenzmasseToleranzSchema));
    const pruefplan = renderToStaticMarkup(React.createElement(PruefplanLesenSchema));
    const haeufigkeit = renderToStaticMarkup(React.createElement(PruefhaeufigkeitSchema));
    const pruefarten = renderToStaticMarkup(React.createElement(PruefartenSchema));
    const pruefmethoden = renderToStaticMarkup(React.createElement(SichtMassFunktionspruefungSchema));
    const stichprobe = renderToStaticMarkup(React.createElement(StichprobeVollpruefungSchema));
    const teile = renderToStaticMarkup(React.createElement(GutteilNacharbeitAusschussSchema));
    const fehlerquote = renderToStaticMarkup(React.createElement(FehlerquoteBerechnenSchema));
    const mittelwert = renderToStaticMarkup(React.createElement(MittelwertSpannweiteSchema));
    const trend = renderToStaticMarkup(React.createElement(TrendProzessstreuungSchema));
    const normal = renderToStaticMarkup(React.createElement(NormalverteilungSchema));
    const regelkarte = renderToStaticMarkup(React.createElement(RegelkarteLesenSchema));
    const faehigkeit = renderToStaticMarkup(React.createElement(ProzessfaehigkeitSchema));
    const unsicherheit = renderToStaticMarkup(React.createElement(MessunsicherheitQsSchema));
    const trace = renderToStaticMarkup(React.createElement(RueckverfolgbarkeitChargeSchema));
    const protokoll = renderToStaticMarkup(React.createElement(PruefprotokollSchreibenSchema));
    const sperrung = renderToStaticMarkup(React.createElement(SperrungFreigabeSchema));

    assert.match(qualitaet, /Qualitaet im Betrieb als Kundenanforderung verstehen/);
    assert.match(sollIst, /Sollwert Istwert und Nennmass sicher unterscheiden/);
    assert.match(toleranz, /Grenzmasse und Toleranz als Gutteilbereich lesen/);
    assert.match(pruefplan, /Pruefplan lesen und Merkmale finden/);
    assert.match(haeufigkeit, /Pruefhaeufigkeit als Intervall oder Stichprobe planen/);
    assert.match(pruefarten, /Erst Zwischen und Endpruefung im Ablauf zuordnen/);
    assert.match(pruefmethoden, /Sicht Mass und Funktionspruefung passend waehlen/);
    assert.match(stichprobe, /Stichprobe und Vollpruefung nach Risiko unterscheiden/);
    assert.match(teile, /Gutteil Nacharbeit und Ausschuss sauber klassifizieren/);
    assert.match(fehlerquote, /Fehlerquote aus Fehlern und Gesamtmenge berechnen/);
    assert.match(mittelwert, /Mittelwert und Spannweite aus Messreihe bilden/);
    assert.match(trend, /Trend und Prozessstreuung in Messwerten erkennen/);
    assert.match(normal, /Normalverteilung als einfache Glockenkurve deuten/);
    assert.match(regelkarte, /Regelkarte lesen und Warnsignale erkennen/);
    assert.match(faehigkeit, /Prozessfaehigkeit Cp und Cpk grob einordnen/);
    assert.match(unsicherheit, /Messunsicherheit in der Qualitaetssicherung beruecksichtigen/);
    assert.match(trace, /Rueckverfolgbarkeit und Charge sicher verbinden/);
    assert.match(protokoll, /Pruefprotokoll mit Abweichung nachvollziehbar schreiben/);
    assert.match(sperrung, /Sperrung und Freigabe als QS-Entscheidung treffen/);
  });
});

describe('Fachkunde Qualitaet-Interaktionen', () => {
  it('rendert Qualitaets-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const qualitaet = renderToStaticMarkup(React.createElement(QualitaetBetriebTrainer));
    const sollIst = renderToStaticMarkup(React.createElement(SollIstNennmassTrainer));
    const toleranz = renderToStaticMarkup(React.createElement(GrenzmasseToleranzTrainer));
    const pruefplan = renderToStaticMarkup(React.createElement(PruefplanLesenTrainer));
    const haeufigkeit = renderToStaticMarkup(React.createElement(PruefhaeufigkeitTrainer));
    const pruefarten = renderToStaticMarkup(React.createElement(PruefartenTrainer));
    const pruefmethoden = renderToStaticMarkup(React.createElement(SichtMassFunktionspruefungTrainer));
    const stichprobe = renderToStaticMarkup(React.createElement(StichprobeVollpruefungTrainer));
    const teile = renderToStaticMarkup(React.createElement(GutteilNacharbeitAusschussTrainer));
    const fehlerquote = renderToStaticMarkup(React.createElement(FehlerquoteBerechnenTrainer));
    const mittelwert = renderToStaticMarkup(React.createElement(MittelwertSpannweiteTrainer));
    const trend = renderToStaticMarkup(React.createElement(TrendProzessstreuungTrainer));
    const normal = renderToStaticMarkup(React.createElement(NormalverteilungTrainer));
    const regelkarte = renderToStaticMarkup(React.createElement(RegelkarteLesenTrainer));
    const faehigkeit = renderToStaticMarkup(React.createElement(ProzessfaehigkeitTrainer));
    const unsicherheit = renderToStaticMarkup(React.createElement(MessunsicherheitQsTrainer));
    const trace = renderToStaticMarkup(React.createElement(RueckverfolgbarkeitChargeTrainer));
    const protokoll = renderToStaticMarkup(React.createElement(PruefprotokollSchreibenTrainer));
    const sperrung = renderToStaticMarkup(React.createElement(SperrungFreigabeTrainer));

    assert.match(qualitaet, /Qualitaet im Betrieb/);
    assert.match(qualitaet, /Nur schoen aussehen/);
    assert.match(qualitaet, /aria-live="polite"/);
    assert.match(sollIst, /Sollwert Istwert und Nennmass/);
    assert.match(sollIst, /Sollwert raten/);
    assert.match(toleranz, /Grenzmasse und Toleranz/);
    assert.match(toleranz, /Grenze verschieben/);
    assert.match(pruefplan, /Pruefplan lesen/);
    assert.match(pruefplan, /Merkmal ausdenken/);
    assert.match(haeufigkeit, /Pruefhaeufigkeit/);
    assert.match(haeufigkeit, /Pruefung auslassen/);
    assert.match(pruefarten, /Erst Zwischen und Endpruefung/);
    assert.match(pruefarten, /Alles erst am Ende/);
    assert.match(pruefmethoden, /Sicht Mass und Funktionspruefung/);
    assert.match(pruefmethoden, /Alles nur wiegen/);
    assert.match(stichprobe, /Stichprobe und Vollpruefung/);
    assert.match(stichprobe, /Zufaellig weniger pruefen/);
    assert.match(teile, /Gutteil Nacharbeit Ausschuss/);
    assert.match(teile, /Alles mischen/);
    assert.match(fehlerquote, /Fehlerquote berechnen/);
    assert.match(fehlerquote, /Gutteile ignorieren/);
    assert.match(mittelwert, /Mittelwert und Spannweite/);
    assert.match(mittelwert, /Nur besten Wert nehmen/);
    assert.match(trend, /Trend und Prozessstreuung/);
    assert.match(trend, /Ausreisser loeschen/);
    assert.match(normal, /Normalverteilung einfach/);
    assert.match(normal, /Jeden Wert gleich haeufig erwarten/);
    assert.match(regelkarte, /Regelkarte einfach lesen/);
    assert.match(regelkarte, /Signal ignorieren/);
    assert.match(faehigkeit, /Prozessfaehigkeit Cp und Cpk/);
    assert.match(faehigkeit, /Cp nach Gefuehl setzen/);
    assert.match(unsicherheit, /Messunsicherheit in der QS/);
    assert.match(unsicherheit, /Unsicherheit verstecken/);
    assert.match(trace, /Rueckverfolgbarkeit und Charge/);
    assert.match(trace, /Etikett wegwerfen/);
    assert.match(protokoll, /Pruefprotokoll schreiben/);
    assert.match(protokoll, /Spaeter ausfuellen/);
    assert.match(sperrung, /Sperrung und Freigabe/);
    assert.match(sperrung, /Trotz Fehler liefern/);
    assert.match(sperrung, /aria-pressed/);
  });
});

describe('Fachkunde Metallfehler-Visuals', () => {
  it('rendert Metallfehler-Visuals zugaenglich', () => {
    const grat = renderToStaticMarkup(React.createElement(GratMetallSchema));
    const mass = renderToStaticMarkup(React.createElement(MassabweichungMetallSchema));
    const rattern = renderToStaticMarkup(React.createElement(RattermarkenSchema));
    const rundlauf = renderToStaticMarkup(React.createElement(SchlechterRundlaufSchema));
    const bruch = renderToStaticMarkup(React.createElement(WerkzeugbruchSchema));
    const verschleiss = renderToStaticMarkup(React.createElement(WerkzeugverschleissMetallSchema));
    const riss = renderToStaticMarkup(React.createElement(VerformungRissSchema));
    const oberflaeche = renderToStaticMarkup(React.createElement(SchlechteOberflaecheSchema));
    const haerte = renderToStaticMarkup(React.createElement(HaertefehlerSchema));
    const korrosion = renderToStaticMarkup(React.createElement(KorrosionBauteilSchema));

    assert.match(grat, /Grat an Metallteilen als Schnittfehler erkennen/);
    assert.match(mass, /Massabweichung Metall systematisch eingrenzen/);
    assert.match(rattern, /Rattermarken als Schwingungsspur deuten/);
    assert.match(rundlauf, /Schlechten Rundlauf mit Messuhr pruefen/);
    assert.match(bruch, /Werkzeugbruch sicher erkennen und sofort reagieren/);
    assert.match(verschleiss, /Werkzeugverschleiss an Schneide und Freiflaeche erkennen/);
    assert.match(riss, /Verformung und Riss als Materialfehler unterscheiden/);
    assert.match(oberflaeche, /Schlechte Oberflaeche nach Rauheit und Kratzern pruefen/);
    assert.match(haerte, /Haertefehler als Pruefbedarf erkennen/);
    assert.match(korrosion, /Korrosion am Bauteil erkennen und Ursache pruefen/);
  });
});

describe('Fachkunde Metallfehler-Interaktionen', () => {
  it('rendert Metallfehler-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const grat = renderToStaticMarkup(React.createElement(GratMetallTrainer));
    const mass = renderToStaticMarkup(React.createElement(MassabweichungMetallTrainer));
    const rattern = renderToStaticMarkup(React.createElement(RattermarkenTrainer));
    const rundlauf = renderToStaticMarkup(React.createElement(SchlechterRundlaufTrainer));
    const bruch = renderToStaticMarkup(React.createElement(WerkzeugbruchTrainer));
    const verschleiss = renderToStaticMarkup(React.createElement(WerkzeugverschleissMetallTrainer));
    const riss = renderToStaticMarkup(React.createElement(VerformungRissTrainer));
    const oberflaeche = renderToStaticMarkup(React.createElement(SchlechteOberflaecheTrainer));
    const haerte = renderToStaticMarkup(React.createElement(HaertefehlerTrainer));
    const korrosion = renderToStaticMarkup(React.createElement(KorrosionBauteilTrainer));

    assert.match(grat, /Grat an Metallteilen/);
    assert.match(grat, /Grat abbrechen und liefern/);
    assert.match(grat, /aria-live="polite"/);
    assert.match(mass, /Massabweichung Metall/);
    assert.match(mass, /Messwert passend runden/);
    assert.match(rattern, /Rattermarken/);
    assert.match(rattern, /Spuren polieren und schweigen/);
    assert.match(rundlauf, /Schlechter Rundlauf/);
    assert.match(rundlauf, /Drehteil festhalten/);
    assert.match(bruch, /Werkzeugbruch/);
    assert.match(bruch, /Mit Restwerkzeug weiterfahren/);
    assert.match(verschleiss, /Werkzeugverschleiss/);
    assert.match(verschleiss, /Verschleiss ignorieren/);
    assert.match(riss, /Verformung und Riss/);
    assert.match(riss, /Riss ueberlackieren/);
    assert.match(oberflaeche, /Schlechte Oberflaeche/);
    assert.match(oberflaeche, /Oberflaeche einoelen/);
    assert.match(haerte, /Haertefehler/);
    assert.match(haerte, /Mit Hammer testen/);
    assert.match(korrosion, /Korrosion am Bauteil/);
    assert.match(korrosion, /Rost abwischen und freigeben/);
    assert.match(korrosion, /aria-pressed/);
  });
});

describe('Fachkunde Kunststofffehler-Visuals', () => {
  it('rendert Kunststofffehler-Visuals zugaenglich', () => {
    const einfall = renderToStaticMarkup(React.createElement(EinfallstellenSchema));
    const lunker = renderToStaticMarkup(React.createElement(LunkerSchema));
    const grat = renderToStaticMarkup(React.createElement(GratUeberspritzungSchema));
    const unterfuellung = renderToStaticMarkup(React.createElement(UnterfuellungSchema));
    const naehte = renderToStaticMarkup(React.createElement(FliessnaehteBindenaehteSchema));
    const schlieren = renderToStaticMarkup(React.createElement(SchlierenFeuchtigkeitSchema));
    const brand = renderToStaticMarkup(React.createElement(VerbrennungDieseleffektSchema));
    const verzug = renderToStaticMarkup(React.createElement(VerzugKunststoffSchema));
    const delamination = renderToStaticMarkup(React.createElement(DelaminationSchema));
    const punkte = renderToStaticMarkup(React.createElement(SchwarzePunkteSchema));
    const farbe = renderToStaticMarkup(React.createElement(FarbabweichungSchema));
    const anguss = renderToStaticMarkup(React.createElement(AngussAuswerfermarkenSchema));
    const mass = renderToStaticMarkup(React.createElement(MassabweichungKunststoffSchema));
    const diagnose = renderToStaticMarkup(React.createElement(Fehlerdiagnose5MSchema));

    assert.match(einfall, /Einfallstellen durch Schwindung und Nachdruck deuten/);
    assert.match(lunker, /Lunker als inneren Hohlraum im Kunststoffteil erklaeren/);
    assert.match(grat, /Grat und Ueberspritzung an Trennebene erkennen/);
    assert.match(unterfuellung, /Unterfuellung und kurze Teile als Fliessende erkennen/);
    assert.match(naehte, /Fliessnaehte und Bindenaehte an Fliessfronten deuten/);
    assert.match(schlieren, /Schlieren und Feuchtigkeitsschlieren als Materialhinweis pruefen/);
    assert.match(brand, /Verbrennungen und Dieseleffekt an Brandstellen erkennen/);
    assert.match(verzug, /Verzug durch Schwindung und Orientierung eingrenzen/);
    assert.match(delamination, /Delamination als Schichttrennung am Kunststoffteil erkennen/);
    assert.match(punkte, /Schwarze Punkte als Verschmutzung oder Materialabbau pruefen/);
    assert.match(farbe, /Farbabweichungen mit Muster und Masterbatch vergleichen/);
    assert.match(anguss, /Sichtbaren Anguss und Auswerfermarken sicher bewerten/);
    assert.match(mass, /Massabweichungen Kunststoff mit Schwindung und Prozess pruefen/);
    assert.match(diagnose, /Kunststofffehler mit 5M strukturiert diagnostizieren/);
  });
});

describe('Fachkunde Kunststofffehler-Interaktionen', () => {
  it('rendert Kunststofffehler-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const einfall = renderToStaticMarkup(React.createElement(EinfallstellenTrainer));
    const lunker = renderToStaticMarkup(React.createElement(LunkerTrainer));
    const grat = renderToStaticMarkup(React.createElement(GratUeberspritzungTrainer));
    const unterfuellung = renderToStaticMarkup(React.createElement(UnterfuellungTrainer));
    const naehte = renderToStaticMarkup(React.createElement(FliessnaehteBindenaehteTrainer));
    const schlieren = renderToStaticMarkup(React.createElement(SchlierenFeuchtigkeitTrainer));
    const brand = renderToStaticMarkup(React.createElement(VerbrennungDieseleffektTrainer));
    const verzug = renderToStaticMarkup(React.createElement(VerzugKunststoffTrainer));
    const delamination = renderToStaticMarkup(React.createElement(DelaminationTrainer));
    const punkte = renderToStaticMarkup(React.createElement(SchwarzePunkteTrainer));
    const farbe = renderToStaticMarkup(React.createElement(FarbabweichungTrainer));
    const anguss = renderToStaticMarkup(React.createElement(AngussAuswerfermarkenTrainer));
    const mass = renderToStaticMarkup(React.createElement(MassabweichungKunststoffTrainer));
    const diagnose = renderToStaticMarkup(React.createElement(Fehlerdiagnose5MTrainer));

    assert.match(einfall, /Einfallstellen/);
    assert.match(einfall, /Delle warm glattdruecken/);
    assert.match(einfall, /aria-live="polite"/);
    assert.match(lunker, /Lunker/);
    assert.match(lunker, /Aussen glattpolieren/);
    assert.match(grat, /Grat und Ueberspritzung/);
    assert.match(grat, /Grat abreissen und liefern/);
    assert.match(unterfuellung, /Unterfuellung/);
    assert.match(unterfuellung, /Fehlstelle abschneiden/);
    assert.match(naehte, /Fliessnaehte und Bindenaehte/);
    assert.match(naehte, /Naht mit Farbe verdecken/);
    assert.match(schlieren, /Schlieren und Feuchtigkeitsschlieren/);
    assert.match(schlieren, /Mit mehr Farbe ueberdecken/);
    assert.match(brand, /Verbrennungen und Dieseleffekt/);
    assert.match(brand, /Brandstelle wegschleifen/);
    assert.match(verzug, /Verzug Kunststoff/);
    assert.match(verzug, /Teil geradebiegen/);
    assert.match(delamination, /Delamination/);
    assert.match(delamination, /Schicht festkleben/);
    assert.match(punkte, /Schwarze Punkte/);
    assert.match(punkte, /Punkte mit Stift markieren/);
    assert.match(farbe, /Farbabweichungen/);
    assert.match(farbe, /Farbton nach Gefuehl freigeben/);
    assert.match(anguss, /Anguss und Auswerfermarken/);
    assert.match(anguss, /Marke wegkratzen/);
    assert.match(mass, /Massabweichungen Kunststoff/);
    assert.match(mass, /Mass passend druecken/);
    assert.match(diagnose, /Fehlerdiagnose mit 5M/);
    assert.match(diagnose, /Erste Idee sofort umstellen/);
    assert.match(diagnose, /aria-pressed/);
  });
});

describe('Fachkunde Steuerung-Visuals', () => {
  it('rendert Steuerungs-Visuals zugaenglich', () => {
    const signalweg = renderToStaticMarkup(React.createElement(SensorAktorSteuerungSchema));
    const regelung = renderToStaticMarkup(React.createElement(SteuerungRegelungSchema));
    const regelkreis = renderToStaticMarkup(React.createElement(SollIstStellgroesseSchema));
    const sps = renderToStaticMarkup(React.createElement(SpsGrundlagenSchema));
    const io = renderToStaticMarkup(React.createElement(EingangAusgangSchema));
    const logik = renderToStaticMarkup(React.createElement(UndOderVerriegelungSchema));
    const sensorvergleich = renderToStaticMarkup(React.createElement(EndschalterLichtschrankeSchema));
    const materialsensor = renderToStaticMarkup(React.createElement(InduktivKapazitivSensorSchema));
    const prozesswerte = renderToStaticMarkup(React.createElement(TemperaturDrucksensorenSchema));
    const antrieb = renderToStaticMarkup(React.createElement(ElektromotorFrequenzumrichterSchema));

    assert.match(signalweg, /Sensor Aktor und Steuerung als Signalweg verstehen/);
    assert.match(regelung, /Steuerung und Regelung im Rueckmeldevergleich unterscheiden/);
    assert.match(regelkreis, /Sollwert Istwert und Stellgroesse im Regelkreis zuordnen/);
    assert.match(sps, /SPS als speicherprogrammierbare Steuerung einordnen/);
    assert.match(io, /Eingang und Ausgang an der Steuerung sicher zuordnen/);
    assert.match(logik, /UND ODER und Verriegelung als einfache Steuerlogik lesen/);
    assert.match(sensorvergleich, /Endschalter und Lichtschranke als Sensoren erkennen/);
    assert.match(materialsensor, /Induktive und kapazitive Sensoren nach Materialwirkung unterscheiden/);
    assert.match(prozesswerte, /Temperatur und Drucksensoren als Prozesswerte einordnen/);
    assert.match(antrieb, /Elektromotor und Frequenzumrichter als Antriebskette verstehen/);
  });
});

describe('Fachkunde Steuerung-Interaktionen', () => {
  it('rendert Steuerungs-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const signalweg = renderToStaticMarkup(React.createElement(SensorAktorSteuerungTrainer));
    const regelung = renderToStaticMarkup(React.createElement(SteuerungRegelungTrainer));
    const regelkreis = renderToStaticMarkup(React.createElement(SollIstStellgroesseTrainer));
    const sps = renderToStaticMarkup(React.createElement(SpsGrundlagenTrainer));
    const io = renderToStaticMarkup(React.createElement(EingangAusgangTrainer));
    const logik = renderToStaticMarkup(React.createElement(UndOderVerriegelungTrainer));
    const sensorvergleich = renderToStaticMarkup(React.createElement(EndschalterLichtschrankeTrainer));
    const materialsensor = renderToStaticMarkup(React.createElement(InduktivKapazitivSensorTrainer));
    const prozesswerte = renderToStaticMarkup(React.createElement(TemperaturDrucksensorenTrainer));
    const antrieb = renderToStaticMarkup(React.createElement(ElektromotorFrequenzumrichterTrainer));

    assert.match(signalweg, /Sensor Aktor Steuerung/);
    assert.match(signalweg, /Kabel blind tauschen/);
    assert.match(signalweg, /aria-live="polite"/);
    assert.match(regelung, /Steuerung und Regelung/);
    assert.match(regelung, /Rueckmeldung abklemmen/);
    assert.match(regelkreis, /Sollwert Istwert Stellgroesse/);
    assert.match(regelkreis, /Istwert schoenrechnen/);
    assert.match(sps, /SPS-Grundlagen/);
    assert.match(sps, /Programm spontan aendern/);
    assert.match(io, /Eingang und Ausgang/);
    assert.match(io, /Ein- und Ausgang vertauschen/);
    assert.match(logik, /UND ODER Verriegelung/);
    assert.match(logik, /Verriegelung ueberbruecken/);
    assert.match(sensorvergleich, /Endschalter und Lichtschranke/);
    assert.match(sensorvergleich, /Sensor mit Werkzeug blockieren/);
    assert.match(materialsensor, /Induktive und kapazitive Sensoren/);
    assert.match(materialsensor, /Sensorflaeche lackieren/);
    assert.match(prozesswerte, /Temperatur- und Drucksensoren/);
    assert.match(prozesswerte, /Grenzwert frei verschieben/);
    assert.match(antrieb, /Elektromotor und Frequenzumrichter/);
    assert.match(antrieb, /Drehzahl beliebig hochdrehen/);
    assert.match(antrieb, /aria-pressed/);
  });
});

describe('Fachkunde Pneumatik-Hydraulik-Visuals', () => {
  it('rendert Pneumatik- und Hydraulik-Visuals zugaenglich', () => {
    const druckluft = renderToStaticMarkup(React.createElement(DruckluftanlageSchema));
    const wartung = renderToStaticMarkup(React.createElement(WartungseinheitSchema));
    const ventile = renderToStaticMarkup(React.createElement(VentileDrosselnSchema));
    const einfach = renderToStaticMarkup(React.createElement(EinfachwirkenderZylinderSchema));
    const doppelt = renderToStaticMarkup(React.createElement(DoppeltwirkenderZylinderSchema));
    const hydraulik = renderToStaticMarkup(React.createElement(HydraulikGrundlagenSchema));

    assert.match(druckluft, /Druckluftanlage vom Erzeugen bis zum Verbraucher ueberblicken/);
    assert.match(wartung, /Wartungseinheit als Luftaufbereitung sicher einordnen/);
    assert.match(ventile, /Ventile und Drosseln im Pneumatikplan unterscheiden/);
    assert.match(einfach, /Einfachwirkenden Zylinder nach Luft und Feder erklaeren/);
    assert.match(doppelt, /Doppeltwirkenden Zylinder mit zwei Arbeitsraeumen verstehen/);
    assert.match(hydraulik, /Hydraulik als Kraftuebertragung mit Druck und Oel verstehen/);
  });
});

describe('Fachkunde Pneumatik-Hydraulik-Interaktionen', () => {
  it('rendert Pneumatik- und Hydraulik-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const druckluft = renderToStaticMarkup(React.createElement(DruckluftanlageTrainer));
    const wartung = renderToStaticMarkup(React.createElement(WartungseinheitTrainer));
    const ventile = renderToStaticMarkup(React.createElement(VentileDrosselnTrainer));
    const einfach = renderToStaticMarkup(React.createElement(EinfachwirkenderZylinderTrainer));
    const doppelt = renderToStaticMarkup(React.createElement(DoppeltwirkenderZylinderTrainer));
    const hydraulik = renderToStaticMarkup(React.createElement(HydraulikGrundlagenTrainer));

    assert.match(druckluft, /Druckluftanlage/);
    assert.match(druckluft, /Leck mit Klebeband abdichten/);
    assert.match(druckluft, /aria-live="polite"/);
    assert.match(wartung, /Wartungseinheit/);
    assert.match(wartung, /Regler beliebig hochdrehen/);
    assert.match(ventile, /Ventile und Drosseln/);
    assert.match(ventile, /Drossel ganz zudrehen/);
    assert.match(einfach, /Einfachwirkender Zylinder/);
    assert.match(einfach, /Feder ausbauen/);
    assert.match(doppelt, /Doppeltwirkender Zylinder/);
    assert.match(doppelt, /Schlaeuche vertauschen/);
    assert.match(hydraulik, /Hydraulik-Grundlagen/);
    assert.match(hydraulik, /Oelspur ueberwischen/);
    assert.match(hydraulik, /aria-pressed/);
  });
});

describe('Fachkunde Instandhaltung-Visuals', () => {
  it('rendert Instandhaltungs-Visuals zugaenglich', () => {
    const grundbegriffe = renderToStaticMarkup(React.createElement(WartungInspektionInstandsetzungSchema));
    const vorbeugend = renderToStaticMarkup(React.createElement(VorbeugendeInstandhaltungSchema));
    const schmierung = renderToStaticMarkup(React.createElement(SchmierungSchmierplanSchema));
    const verschleiss = renderToStaticMarkup(React.createElement(VerschleissReibungSchema));
    const symptome = renderToStaticMarkup(React.createElement(TemperaturSchwingungGeraeuschSchema));
    const leckage = renderToStaticMarkup(React.createElement(LeckageErkennenSchema));
    const lager = renderToStaticMarkup(React.createElement(LagerfehlerSchema));
    const lauf = renderToStaticMarkup(React.createElement(UnwuchtFehlausrichtungSchema));
    const begriffe = renderToStaticMarkup(React.createElement(StoerungFehlerUrsacheWirkungSchema));
    const fiveWhy = renderToStaticMarkup(React.createElement(FiveWhySchema));
    const ishikawa = renderToStaticMarkup(React.createElement(IshikawaDiagrammSchema));
    const doku = renderToStaticMarkup(React.createElement(StoerungDokumentierenSchema));
    const sicher = renderToStaticMarkup(React.createElement(SichereFehlersucheSchema));
    const kvp = renderToStaticMarkup(React.createElement(VerbesserungNachStoerungSchema));

    assert.match(grundbegriffe, /Wartung Inspektion und Instandsetzung sicher unterscheiden/);
    assert.match(vorbeugend, /Vorbeugende Instandhaltung vor dem Ausfall planen/);
    assert.match(schmierung, /Schmierung und Schmierplan als Vorgabe lesen/);
    assert.match(verschleiss, /Verschleiss und Reibung als Ursache einordnen/);
    assert.match(symptome, /Temperatur Schwingung und Geraeusch als Symptome erkennen/);
    assert.match(leckage, /Leckage erkennen und sicher melden/);
    assert.match(lager, /Lagerfehler an Laufbild und Symptom einordnen/);
    assert.match(lauf, /Unwucht und Fehlausrichtung als Laufproblem trennen/);
    assert.match(begriffe, /Stoerung Fehler Ursache und Wirkung sauber trennen/);
    assert.match(fiveWhy, /5-Why als Warum-Kette zur Grundursache nutzen/);
    assert.match(ishikawa, /Ishikawa-Diagramm mit Ursachenfeldern strukturieren/);
    assert.match(doku, /Stoerung so dokumentieren dass sie verwertbar bleibt/);
    assert.match(sicher, /Sichere Fehlersuche vor Technik-Eingriff planen/);
    assert.match(kvp, /Verbesserung nach Stoerung als KVP-Schleife verstehen/);
  });
});

describe('Fachkunde Instandhaltung-Interaktionen', () => {
  it('rendert Instandhaltungs-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const grundbegriffe = renderToStaticMarkup(React.createElement(WartungInspektionInstandsetzungTrainer));
    const vorbeugend = renderToStaticMarkup(React.createElement(VorbeugendeInstandhaltungTrainer));
    const schmierung = renderToStaticMarkup(React.createElement(SchmierungSchmierplanTrainer));
    const verschleiss = renderToStaticMarkup(React.createElement(VerschleissReibungTrainer));
    const symptome = renderToStaticMarkup(React.createElement(TemperaturSchwingungGeraeuschTrainer));
    const leckage = renderToStaticMarkup(React.createElement(LeckageErkennenTrainer));
    const lager = renderToStaticMarkup(React.createElement(LagerfehlerTrainer));
    const lauf = renderToStaticMarkup(React.createElement(UnwuchtFehlausrichtungTrainer));
    const begriffe = renderToStaticMarkup(React.createElement(StoerungFehlerUrsacheWirkungTrainer));
    const fiveWhy = renderToStaticMarkup(React.createElement(FiveWhyTrainer));
    const ishikawa = renderToStaticMarkup(React.createElement(IshikawaDiagrammTrainer));
    const doku = renderToStaticMarkup(React.createElement(StoerungDokumentierenTrainer));
    const sicher = renderToStaticMarkup(React.createElement(SichereFehlersucheTrainer));
    const kvp = renderToStaticMarkup(React.createElement(VerbesserungNachStoerungTrainer));

    assert.match(grundbegriffe, /Begriffe beliebig mischen/);
    assert.match(grundbegriffe, /aria-live="polite"/);
    assert.match(vorbeugend, /Warten bis Stillstand/);
    assert.match(schmierung, /Fett nach Farbe waehlen/);
    assert.match(verschleiss, /Trockenlauf ignorieren/);
    assert.match(symptome, /Laute Stelle uebertoenen/);
    assert.match(leckage, /Spur wegwischen und weiterfahren/);
    assert.match(lager, /Lager im Lauf nachstellen/);
    assert.match(lauf, /Kupplung nach Augenmass verschieben/);
    assert.match(begriffe, /Symptom zur Ursache erklaeren/);
    assert.match(fiveWhy, /Schuldigen suchen/);
    assert.match(ishikawa, /Erste Idee als Wahrheit nehmen/);
    assert.match(doku, /Nur schreiben: geht nicht/);
    assert.match(sicher, /Schutz fuer Test ueberbruecken/);
    assert.match(kvp, /Nach Neustart nichts mehr tun/);
    assert.match(kvp, /aria-pressed/);
  });
});

describe('Fachkunde Planung-Visuals', () => {
  it('rendert Planungs-Visuals zugaenglich', () => {
    const auftrag = renderToStaticMarkup(React.createElement(FertigungsauftragSchema));
    const folge = renderToStaticMarkup(React.createElement(ArbeitsfolgePlanenSchema));
    const material = renderToStaticMarkup(React.createElement(StuecklisteMaterialbedarfSchema));
    const ressourcen = renderToStaticMarkup(React.createElement(PersonalMaschinenbedarfSchema));
    const kapazitaet = renderToStaticMarkup(React.createElement(MaschinenbelegungKapazitaetSchema));
    const takt = renderToStaticMarkup(React.createElement(TaktzeitZykluszeitSchema));
    const durchlauf = renderToStaticMarkup(React.createElement(DurchlaufzeitSchema));
    const gesamtzeit = renderToStaticMarkup(React.createElement(RuestzeitBearbeitungszeitSchema));
    const stillstand = renderToStaticMarkup(React.createElement(StillstandszeitSchema));
    const termin = renderToStaticMarkup(React.createElement(LieferterminLosgroesseSchema));

    assert.match(auftrag, /Fertigungsauftrag mit Teil Menge Termin und Vorgabe lesen/);
    assert.match(folge, /Arbeitsfolge nach Vorgabe und Abhaengigkeit planen/);
    assert.match(material, /Stueckliste und Materialbedarf aus Menge und Position ableiten/);
    assert.match(ressourcen, /Personal und Maschinenbedarf passend zum Auftrag planen/);
    assert.match(kapazitaet, /Maschinenbelegung und Kapazitaet im Zeitfenster pruefen/);
    assert.match(takt, /Taktzeit und Zykluszeit fuer Ausbringung unterscheiden/);
    assert.match(durchlauf, /Durchlaufzeit vom Auftragseingang bis zur Fertigmeldung lesen/);
    assert.match(gesamtzeit, /Ruestzeit und Bearbeitungszeit fuer Gesamtzeit trennen/);
    assert.match(stillstand, /Stillstandszeit als Planungsrisiko und Verlustzeit bewerten/);
    assert.match(termin, /Liefertermin und Losgroesse gemeinsam gegen Kapazitaet pruefen/);
  });
});

describe('Fachkunde Planung-Interaktionen', () => {
  it('rendert Planungs-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const auftrag = renderToStaticMarkup(React.createElement(FertigungsauftragTrainer));
    const folge = renderToStaticMarkup(React.createElement(ArbeitsfolgePlanenTrainer));
    const material = renderToStaticMarkup(React.createElement(StuecklisteMaterialbedarfTrainer));
    const ressourcen = renderToStaticMarkup(React.createElement(PersonalMaschinenbedarfTrainer));
    const kapazitaet = renderToStaticMarkup(React.createElement(MaschinenbelegungKapazitaetTrainer));
    const takt = renderToStaticMarkup(React.createElement(TaktzeitZykluszeitTrainer));
    const durchlauf = renderToStaticMarkup(React.createElement(DurchlaufzeitTrainer));
    const gesamtzeit = renderToStaticMarkup(React.createElement(RuestzeitBearbeitungszeitTrainer));
    const stillstand = renderToStaticMarkup(React.createElement(StillstandszeitTrainer));
    const termin = renderToStaticMarkup(React.createElement(LieferterminLosgroesseTrainer));

    assert.match(auftrag, /Nach Bauchgefuehl starten/);
    assert.match(auftrag, /aria-live="polite"/);
    assert.match(folge, /Reihenfolge frei mischen/);
    assert.match(material, /Material grob schaetzen/);
    assert.match(ressourcen, /Irgendwen einteilen/);
    assert.match(kapazitaet, /Auftrag dazwischenquetschen/);
    assert.match(takt, /Takt und Zyklus gleichsetzen/);
    assert.match(durchlauf, /Nur Schnittzeit zaehlen/);
    assert.match(gesamtzeit, /Ruestzeit pro Teil verdoppeln/);
    assert.match(stillstand, /Stillstand verstecken/);
    assert.match(termin, /Termin einfach zusagen/);
    assert.match(termin, /aria-pressed/);
  });
});

describe('Fachkunde Lager-Visuals', () => {
  it('rendert Lager-Visuals zugaenglich', () => {
    const bestand = renderToStaticMarkup(React.createElement(BestandMindestbestandSchema));
    const meldebestand = renderToStaticMarkup(React.createElement(MeldebestandSicherheitsbestandSchema));
    const fifo = renderToStaticMarkup(React.createElement(FifoSchema));
    const kanban = renderToStaticMarkup(React.createElement(KanbanGrundprinzipSchema));

    assert.match(bestand, /Bestand und Mindestbestand fuer Materialverfuegbarkeit pruefen/);
    assert.match(meldebestand, /Meldebestand und Sicherheitsbestand als Nachbestellpunkt lesen/);
    assert.match(fifo, /FIFO als zuerst rein zuerst raus im Lager anwenden/);
    assert.match(kanban, /Kanban-Grundprinzip als Pull-System mit Karte verstehen/);
  });
});

describe('Fachkunde Lager-Interaktionen', () => {
  it('rendert Lager-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const bestand = renderToStaticMarkup(React.createElement(BestandMindestbestandTrainer));
    const meldebestand = renderToStaticMarkup(React.createElement(MeldebestandSicherheitsbestandTrainer));
    const fifo = renderToStaticMarkup(React.createElement(FifoTrainer));
    const kanban = renderToStaticMarkup(React.createElement(KanbanGrundprinzipTrainer));

    assert.match(bestand, /Leeres Fach ignorieren/);
    assert.match(bestand, /aria-live="polite"/);
    assert.match(meldebestand, /Puffer frei verbrauchen/);
    assert.match(fifo, /Neue Ware zuerst greifen/);
    assert.match(kanban, /Karte sammeln und spaeter klaeren/);
    assert.match(kanban, /aria-pressed/);
  });
});

describe('Fachkunde Lean-Visuals', () => {
  it('rendert Lean-Visuals zugaenglich', () => {
    const wert = renderToStaticMarkup(React.createElement(WertschoepfungVerschwendungSchema));
    const fuenfs = renderToStaticMarkup(React.createElement(FuenfSWiederholenSchema));
    const kvp = renderToStaticMarkup(React.createElement(KvpImTeamSchema));

    assert.match(wert, /Wertschoepfung und Verschwendung im Prozessband unterscheiden/);
    assert.match(fuenfs, /5S als wiederholbaren Arbeitsplatzstandard anwenden/);
    assert.match(kvp, /KVP im Team als Verbesserungskreis verstehen/);
  });
});

describe('Fachkunde Lean-Interaktionen', () => {
  it('rendert Lean-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const wert = renderToStaticMarkup(React.createElement(WertschoepfungVerschwendungTrainer));
    const fuenfs = renderToStaticMarkup(React.createElement(FuenfSWiederholenTrainer));
    const kvp = renderToStaticMarkup(React.createElement(KvpImTeamTrainer));

    assert.match(wert, /Jedes Bewegen als Wert zaehlen/);
    assert.match(wert, /aria-live="polite"/);
    assert.match(fuenfs, /Einmal aufraeumen und fertig/);
    assert.match(kvp, /Idee ohne Pruefung sofort ueberall einfuehren/);
    assert.match(kvp, /aria-pressed/);
  });
});

describe('Fachkunde OEE-Visuals', () => {
  it('rendert OEE-Visuals zugaenglich', () => {
    const c0 = renderToStaticMarkup(React.createElement(OeeUeberblickenSchema));
    const c1 = renderToStaticMarkup(React.createElement(VerfuegbarkeitBerechnenSchema));
    const c2 = renderToStaticMarkup(React.createElement(LeistungsgradBerechnenSchema));
    const c3 = renderToStaticMarkup(React.createElement(QualitaetsrateBerechnenSchema));
    const c4 = renderToStaticMarkup(React.createElement(OeeVerbessernSchema));
    assert.match(c0, /OEE als Kreis aus drei Faktoren ueberblicken/);
    assert.match(c1, /Verfuegbarkeit aus Laufzeit und Planzeit berechnen/);
    assert.match(c2, /Leistungsgrad aus Istleistung und Sollleistung berechnen/);
    assert.match(c3, /Qualitaetsrate aus Gutmenge und Gesamtmenge berechnen/);
    assert.match(c4, /OEE ueber Verlustursache und Massnahme verbessern/);
  });
});

describe('Fachkunde OEE-Interaktionen', () => {
  it('rendert OEE-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const t0 = renderToStaticMarkup(React.createElement(OeeUeberblickenTrainer));
    const t1 = renderToStaticMarkup(React.createElement(VerfuegbarkeitBerechnenTrainer));
    const t2 = renderToStaticMarkup(React.createElement(LeistungsgradBerechnenTrainer));
    const t3 = renderToStaticMarkup(React.createElement(QualitaetsrateBerechnenTrainer));
    const t4 = renderToStaticMarkup(React.createElement(OeeVerbessernTrainer));
    assert.match(t0, /Nur Ausschuss zaehlen/);
    assert.match(t1, /Zeiten frei schaetzen/);
    assert.match(t2, /Soll frei erhoehen/);
    assert.match(t3, /Ausschuss als Gut zaehlen/);
    assert.match(t4, /Blind Parameter drehen/);
    assert.match(t0, /aria-pressed/);
  });
});


describe('Fachkunde Mathematik-Visuals', () => {
  it('rendert Mathematik-Visuals zugaenglich', () => {
    const c0 = renderToStaticMarkup(React.createElement(RechenwegInPruefungenSchema));
    const c1 = renderToStaticMarkup(React.createElement(GrundrechenartenSicherSchema));
    const c2 = renderToStaticMarkup(React.createElement(DreisatzSchema));
    const c3 = renderToStaticMarkup(React.createElement(ProzentrechnungSchema));
    const c4 = renderToStaticMarkup(React.createElement(EinheitenInAufgabenSchema));
    const c5 = renderToStaticMarkup(React.createElement(UmfangFlaecheRechteckSchema));
    const c6 = renderToStaticMarkup(React.createElement(KreisumfangKreisflaecheSchema));
    const c7 = renderToStaticMarkup(React.createElement(VolumenQuaderZylinderSchema));
    const c8 = renderToStaticMarkup(React.createElement(MasseAusDichteSchema));
    const c9 = renderToStaticMarkup(React.createElement(GeschwindigkeitUndZeitSchema));
    const c10 = renderToStaticMarkup(React.createElement(DrehzahlSchnittgeschwindigkeitSchema));
    const c11 = renderToStaticMarkup(React.createElement(VorschubBerechnenSchema));
    const c12 = renderToStaticMarkup(React.createElement(KraftUndDruckSchema));
    const c13 = renderToStaticMarkup(React.createElement(HydraulischerDruckSchema));
    const c14 = renderToStaticMarkup(React.createElement(LeistungArbeitWirkungsgradSchema));
    const c15 = renderToStaticMarkup(React.createElement(UebersetzungsverhaeltnisSchema));
    const c16 = renderToStaticMarkup(React.createElement(DrehmomentSchema));
    const c17 = renderToStaticMarkup(React.createElement(GutmengeAusschussquoteSchema));
    const c18 = renderToStaticMarkup(React.createElement(ProduktionsleistungSchema));
    const c19 = renderToStaticMarkup(React.createElement(ProzentualeAbweichungSchema));
    const c20 = renderToStaticMarkup(React.createElement(WaermeausdehnungPruefungsnahSchema));
    const c21 = renderToStaticMarkup(React.createElement(ToleranzberechnungSchema));
    const c22 = renderToStaticMarkup(React.createElement(FormelUmstellenSchema));
    const c23 = renderToStaticMarkup(React.createElement(PlausibilitaetVonErgebnissenSchema));
    assert.match(c0, /Rechenweg in Pruefungen als Rechenweg strukturieren/);
    assert.match(c1, /Grundrechenarten sicher als Rechenweg strukturieren/);
    assert.match(c2, /Dreisatz als Rechenweg strukturieren/);
    assert.match(c3, /Prozentrechnung als Rechenweg strukturieren/);
    assert.match(c4, /Einheiten in Aufgaben umrechnen als Rechenweg strukturieren/);
    assert.match(c5, /Umfang und Flaeche Rechteck als Rechenweg strukturieren/);
    assert.match(c6, /Kreisumfang und Kreisflaeche als Rechenweg strukturieren/);
    assert.match(c7, /Volumen Quader und Zylinder als Rechenweg strukturieren/);
    assert.match(c8, /Masse aus Dichte als Rechenweg strukturieren/);
    assert.match(c9, /Geschwindigkeit und Zeit als Rechenweg strukturieren/);
    assert.match(c10, /Drehzahl und Schnittgeschwindigkeit als Rechenweg strukturieren/);
    assert.match(c11, /Vorschub berechnen als Rechenweg strukturieren/);
    assert.match(c12, /Kraft und Druck als Rechenweg strukturieren/);
    assert.match(c13, /Hydraulischer Druck als Rechenweg strukturieren/);
    assert.match(c14, /Leistung, Arbeit, Wirkungsgrad als Rechenweg strukturieren/);
    assert.match(c15, /Uebersetzungsverhaeltnis als Rechenweg strukturieren/);
    assert.match(c16, /Drehmoment als Rechenweg strukturieren/);
    assert.match(c17, /Gutmenge und Ausschussquote als Rechenweg strukturieren/);
    assert.match(c18, /Produktionsleistung als Rechenweg strukturieren/);
    assert.match(c19, /Prozentuale Abweichung als Rechenweg strukturieren/);
    assert.match(c20, /Waermeausdehnung pruefungsnah als Rechenweg strukturieren/);
    assert.match(c21, /Toleranzberechnung als Rechenweg strukturieren/);
    assert.match(c22, /Formel umstellen als Rechenweg strukturieren/);
    assert.match(c23, /Plausibilitaet von Ergebnissen als Rechenweg strukturieren/);
  });
});

describe('Fachkunde Mathematik-Interaktionen', () => {
  it('rendert Mathematik-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const t0 = renderToStaticMarkup(React.createElement(RechenwegInPruefungenTrainer));
    const t1 = renderToStaticMarkup(React.createElement(GrundrechenartenSicherTrainer));
    const t2 = renderToStaticMarkup(React.createElement(DreisatzTrainer));
    const t3 = renderToStaticMarkup(React.createElement(ProzentrechnungTrainer));
    const t4 = renderToStaticMarkup(React.createElement(EinheitenInAufgabenTrainer));
    const t5 = renderToStaticMarkup(React.createElement(UmfangFlaecheRechteckTrainer));
    const t6 = renderToStaticMarkup(React.createElement(KreisumfangKreisflaecheTrainer));
    const t7 = renderToStaticMarkup(React.createElement(VolumenQuaderZylinderTrainer));
    const t8 = renderToStaticMarkup(React.createElement(MasseAusDichteTrainer));
    const t9 = renderToStaticMarkup(React.createElement(GeschwindigkeitUndZeitTrainer));
    const t10 = renderToStaticMarkup(React.createElement(DrehzahlSchnittgeschwindigkeitTrainer));
    const t11 = renderToStaticMarkup(React.createElement(VorschubBerechnenTrainer));
    const t12 = renderToStaticMarkup(React.createElement(KraftUndDruckTrainer));
    const t13 = renderToStaticMarkup(React.createElement(HydraulischerDruckTrainer));
    const t14 = renderToStaticMarkup(React.createElement(LeistungArbeitWirkungsgradTrainer));
    const t15 = renderToStaticMarkup(React.createElement(UebersetzungsverhaeltnisTrainer));
    const t16 = renderToStaticMarkup(React.createElement(DrehmomentTrainer));
    const t17 = renderToStaticMarkup(React.createElement(GutmengeAusschussquoteTrainer));
    const t18 = renderToStaticMarkup(React.createElement(ProduktionsleistungTrainer));
    const t19 = renderToStaticMarkup(React.createElement(ProzentualeAbweichungTrainer));
    const t20 = renderToStaticMarkup(React.createElement(WaermeausdehnungPruefungsnahTrainer));
    const t21 = renderToStaticMarkup(React.createElement(ToleranzberechnungTrainer));
    const t22 = renderToStaticMarkup(React.createElement(FormelUmstellenTrainer));
    const t23 = renderToStaticMarkup(React.createElement(PlausibilitaetVonErgebnissenTrainer));
    assert.match(t0, /Blind rechnen/);
    assert.match(t1, /Blind rechnen/);
    assert.match(t2, /Blind rechnen/);
    assert.match(t3, /Blind rechnen/);
    assert.match(t4, /Blind rechnen/);
    assert.match(t5, /Blind rechnen/);
    assert.match(t6, /Blind rechnen/);
    assert.match(t7, /Blind rechnen/);
    assert.match(t8, /Blind rechnen/);
    assert.match(t9, /Blind rechnen/);
    assert.match(t10, /Blind rechnen/);
    assert.match(t11, /Blind rechnen/);
    assert.match(t12, /Blind rechnen/);
    assert.match(t13, /Blind rechnen/);
    assert.match(t14, /Blind rechnen/);
    assert.match(t15, /Blind rechnen/);
    assert.match(t16, /Blind rechnen/);
    assert.match(t17, /Blind rechnen/);
    assert.match(t18, /Blind rechnen/);
    assert.match(t19, /Blind rechnen/);
    assert.match(t20, /Blind rechnen/);
    assert.match(t21, /Blind rechnen/);
    assert.match(t22, /Blind rechnen/);
    assert.match(t23, /Blind rechnen/);
    assert.match(t0, /aria-pressed/);
  });
});


describe('Fachkunde WiSo-Visuals', () => {
  it('rendert WiSo-Visuals zugaenglich', () => {
    const c0 = renderToStaticMarkup(React.createElement(AusbildungsvertragSchema));
    const c1 = renderToStaticMarkup(React.createElement(RechteUndPflichtenSchema));
    const c2 = renderToStaticMarkup(React.createElement(ProbezeitUndKuendigungSchema));
    const c3 = renderToStaticMarkup(React.createElement(ArbeitsvertragTarifvertragSchema));
    const c4 = renderToStaticMarkup(React.createElement(TarifautonomieBetriebsratSchema));
    const c5 = renderToStaticMarkup(React.createElement(JugendAuszubildendenvertretungSchema));
    const c6 = renderToStaticMarkup(React.createElement(SozialversicherungSchema));
    const c7 = renderToStaticMarkup(React.createElement(ArbeitszeitUndUrlaubSchema));
    const c8 = renderToStaticMarkup(React.createElement(EntgeltabrechnungSchema));
    const c9 = renderToStaticMarkup(React.createElement(NachhaltigkeitUmweltschutzSchema));
    const c10 = renderToStaticMarkup(React.createElement(WirtschaftlichkeitProduktivitaetSchema));
    const c11 = renderToStaticMarkup(React.createElement(OekonomischesPrinzipSchema));
    assert.match(c0, /Ausbildungsvertrag als WiSo-Lernbild einordnen/);
    assert.match(c1, /Rechte und Pflichten als WiSo-Lernbild einordnen/);
    assert.match(c2, /Probezeit und Kuendigung als WiSo-Lernbild einordnen/);
    assert.match(c3, /Arbeitsvertrag und Tarifvertrag als WiSo-Lernbild einordnen/);
    assert.match(c4, /Tarifautonomie und Betriebsrat als WiSo-Lernbild einordnen/);
    assert.match(c5, /Jugend- und Auszubildendenvertretung als WiSo-Lernbild einordnen/);
    assert.match(c6, /Sozialversicherung als WiSo-Lernbild einordnen/);
    assert.match(c7, /Arbeitszeit und Urlaub als WiSo-Lernbild einordnen/);
    assert.match(c8, /Entgeltabrechnung als WiSo-Lernbild einordnen/);
    assert.match(c9, /Nachhaltigkeit und Umweltschutz als WiSo-Lernbild einordnen/);
    assert.match(c10, /Wirtschaftlichkeit und Produktivitaet als WiSo-Lernbild einordnen/);
    assert.match(c11, /Oekonomisches Prinzip als WiSo-Lernbild einordnen/);
  });
});

describe('Fachkunde WiSo-Interaktionen', () => {
  it('rendert WiSo-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const t0 = renderToStaticMarkup(React.createElement(AusbildungsvertragTrainer));
    const t1 = renderToStaticMarkup(React.createElement(RechteUndPflichtenTrainer));
    const t2 = renderToStaticMarkup(React.createElement(ProbezeitUndKuendigungTrainer));
    const t3 = renderToStaticMarkup(React.createElement(ArbeitsvertragTarifvertragTrainer));
    const t4 = renderToStaticMarkup(React.createElement(TarifautonomieBetriebsratTrainer));
    const t5 = renderToStaticMarkup(React.createElement(JugendAuszubildendenvertretungTrainer));
    const t6 = renderToStaticMarkup(React.createElement(SozialversicherungTrainer));
    const t7 = renderToStaticMarkup(React.createElement(ArbeitszeitUndUrlaubTrainer));
    const t8 = renderToStaticMarkup(React.createElement(EntgeltabrechnungTrainer));
    const t9 = renderToStaticMarkup(React.createElement(NachhaltigkeitUmweltschutzTrainer));
    const t10 = renderToStaticMarkup(React.createElement(WirtschaftlichkeitProduktivitaetTrainer));
    const t11 = renderToStaticMarkup(React.createElement(OekonomischesPrinzipTrainer));
    assert.match(t0, /Fristen frei erfinden/);
    assert.match(t1, /Fristen frei erfinden/);
    assert.match(t2, /Fristen frei erfinden/);
    assert.match(t3, /Fristen frei erfinden/);
    assert.match(t4, /Fristen frei erfinden/);
    assert.match(t5, /Fristen frei erfinden/);
    assert.match(t6, /Fristen frei erfinden/);
    assert.match(t7, /Fristen frei erfinden/);
    assert.match(t8, /Fristen frei erfinden/);
    assert.match(t9, /Fristen frei erfinden/);
    assert.match(t10, /Fristen frei erfinden/);
    assert.match(t11, /Fristen frei erfinden/);
    assert.match(t0, /aria-pressed/);
  });
});


describe('Fachkunde Pruefungsvorbereitung-Visuals', () => {
  it('rendert Pruefungsvorbereitung-Visuals zugaenglich', () => {
    const c0 = renderToStaticMarkup(React.createElement(AufgabenstellungRichtigLesenSchema));
    const c1 = renderToStaticMarkup(React.createElement(GegebenUndGesuchtSchema));
    const c2 = renderToStaticMarkup(React.createElement(PassendeFormelFindenSchema));
    const c3 = renderToStaticMarkup(React.createElement(EinheitenKontrollierenSchema));
    const c4 = renderToStaticMarkup(React.createElement(TabellenbuchNutzenSchema));
    const c5 = renderToStaticMarkup(React.createElement(MultipleChoiceAusschlussSchema));
    const c6 = renderToStaticMarkup(React.createElement(UnbekannteBegriffeSchema));
    const c7 = renderToStaticMarkup(React.createElement(ZeitmanagementSchema));
    const c8 = renderToStaticMarkup(React.createElement(PruefungsangstReduzierenSchema));
    const c9 = renderToStaticMarkup(React.createElement(TypischePruefungsfallenSchema));
    const c10 = renderToStaticMarkup(React.createElement(MiniPruefungProduktionstechnikSchema));
    const c11 = renderToStaticMarkup(React.createElement(MiniPruefungProduktionsplanungSchema));
    const c12 = renderToStaticMarkup(React.createElement(MiniPruefungWisoSchema));
    const c13 = renderToStaticMarkup(React.createElement(WiederholungsmodusSchema));
    const c14 = renderToStaticMarkup(React.createElement(PersoenlicheSchwachstellenSchema));
    const c15 = renderToStaticMarkup(React.createElement(PruefungssimulationAbschlussSchema));
    assert.match(c0, /Aufgabenstellung richtig lesen als Pruefungsstrategie trainieren/);
    assert.match(c1, /Gegeben und gesucht finden als Pruefungsstrategie trainieren/);
    assert.match(c2, /Passende Formel finden als Pruefungsstrategie trainieren/);
    assert.match(c3, /Einheiten kontrollieren als Pruefungsstrategie trainieren/);
    assert.match(c4, /Tabellenbuch nutzen als Pruefungsstrategie trainieren/);
    assert.match(c5, /Multiple-Choice-Ausschlussverfahren als Pruefungsstrategie trainieren/);
    assert.match(c6, /Unbekannte Begriffe bearbeiten als Pruefungsstrategie trainieren/);
    assert.match(c7, /Zeitmanagement als Pruefungsstrategie trainieren/);
    assert.match(c8, /Pruefungsangst reduzieren als Pruefungsstrategie trainieren/);
    assert.match(c9, /Typische Pruefungsfallen als Pruefungsstrategie trainieren/);
    assert.match(c10, /Mini-Pruefung Produktionstechnik als Pruefungsstrategie trainieren/);
    assert.match(c11, /Mini-Pruefung Produktionsplanung als Pruefungsstrategie trainieren/);
    assert.match(c12, /Mini-Pruefung WiSo als Pruefungsstrategie trainieren/);
    assert.match(c13, /Wiederholungsmodus nach Fehlern als Pruefungsstrategie trainieren/);
    assert.match(c14, /Persoenliche Schwachstellen erkennen als Pruefungsstrategie trainieren/);
    assert.match(c15, /Pruefungssimulation Abschluss als Pruefungsstrategie trainieren/);
  });
});

describe('Fachkunde Pruefungsvorbereitung-Interaktionen', () => {
  it('rendert Pruefungsvorbereitung-Trainer mit Live-Feedback und stabilen Auswahlzustaenden', () => {
    const t0 = renderToStaticMarkup(React.createElement(AufgabenstellungRichtigLesenTrainer));
    const t1 = renderToStaticMarkup(React.createElement(GegebenUndGesuchtTrainer));
    const t2 = renderToStaticMarkup(React.createElement(PassendeFormelFindenTrainer));
    const t3 = renderToStaticMarkup(React.createElement(EinheitenKontrollierenTrainer));
    const t4 = renderToStaticMarkup(React.createElement(TabellenbuchNutzenTrainer));
    const t5 = renderToStaticMarkup(React.createElement(MultipleChoiceAusschlussTrainer));
    const t6 = renderToStaticMarkup(React.createElement(UnbekannteBegriffeTrainer));
    const t7 = renderToStaticMarkup(React.createElement(ZeitmanagementTrainer));
    const t8 = renderToStaticMarkup(React.createElement(PruefungsangstReduzierenTrainer));
    const t9 = renderToStaticMarkup(React.createElement(TypischePruefungsfallenTrainer));
    const t10 = renderToStaticMarkup(React.createElement(MiniPruefungProduktionstechnikTrainer));
    const t11 = renderToStaticMarkup(React.createElement(MiniPruefungProduktionsplanungTrainer));
    const t12 = renderToStaticMarkup(React.createElement(MiniPruefungWisoTrainer));
    const t13 = renderToStaticMarkup(React.createElement(WiederholungsmodusTrainer));
    const t14 = renderToStaticMarkup(React.createElement(PersoenlicheSchwachstellenTrainer));
    const t15 = renderToStaticMarkup(React.createElement(PruefungssimulationAbschlussTrainer));
    assert.match(t0, /Antworten nur raten/);
    assert.match(t1, /Antworten nur raten/);
    assert.match(t2, /Antworten nur raten/);
    assert.match(t3, /Antworten nur raten/);
    assert.match(t4, /Antworten nur raten/);
    assert.match(t5, /Antworten nur raten/);
    assert.match(t6, /Antworten nur raten/);
    assert.match(t7, /Antworten nur raten/);
    assert.match(t8, /Antworten nur raten/);
    assert.match(t9, /Antworten nur raten/);
    assert.match(t10, /Antworten nur raten/);
    assert.match(t11, /Antworten nur raten/);
    assert.match(t12, /Antworten nur raten/);
    assert.match(t13, /Antworten nur raten/);
    assert.match(t14, /Antworten nur raten/);
    assert.match(t15, /Antworten nur raten/);
    assert.match(t0, /aria-pressed/);
  });
});

describe('Fachkunde BER-Erweiterung-Visuals', () => {
  it('rendert BER-004 bis BER-008 Visuals zugaenglich', () => {
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsauftragLesenSchema)), /Produktionsauftrag mit Teil Menge Termin und Vorgabe lesen/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsablaufVerstehenSchema)), /Produktionsablauf als Stationenkette verstehen/);
    assert.match(renderToStaticMarkup(React.createElement(SchichtbeginnVorbereitenSchema)), /Schichtbeginn mit Checkliste und Uebergabe vorbereiten/);
    assert.match(renderToStaticMarkup(React.createElement(OrdnungAmArbeitsplatzSchema)), /Ordnung am Arbeitsplatz als Sicherheits- und Qualitaetsfaktor/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsdatenNotierenSchema)), /Produktionsdaten vollstaendig und nachvollziehbar notieren/);
  });
});

describe('Fachkunde BER-Erweiterung-Interaktionen', () => {
  it('rendert BER-004 bis BER-008 Trainer mit Distraktoren', () => {
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsauftragLesenTrainer)), /Unklare Daten ignorieren/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsablaufVerstehenTrainer)), /Pruefung einfach weglassen/);
    assert.match(renderToStaticMarkup(React.createElement(SchichtbeginnVorbereitenTrainer)), /Hinweise ignorieren/);
    assert.match(renderToStaticMarkup(React.createElement(OrdnungAmArbeitsplatzTrainer)), /Alles irgendwo ablegen/);
    assert.match(renderToStaticMarkup(React.createElement(ProduktionsdatenNotierenTrainer)), /Werte schoenrechnen/);
  });
});
