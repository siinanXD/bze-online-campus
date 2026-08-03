'use client';

import * as React from 'react';
import { Badge, type BadgeVariante } from './primitive/anzeige';
import { Button } from './primitive/button';
import { Input } from './primitive/eingabe';
import { cn } from './cn';

export interface InteraktiverMessschieberProps {
  titel?: string;
  minMm?: number;
  maxMm?: number;
  schrittMm?: number;
  startwertMm?: number;
  nennmassMm?: number;
  oberesAbmassMm?: number;
  unteresAbmassMm?: number;
  quellenHinweis?: string;
  className?: string;
}

export interface InteraktivesToleranzfeldProps {
  titel?: string;
  nennmassMm?: number;
  oberesAbmassMm?: number;
  unteresAbmassMm?: number;
  startIstmassMm?: number;
  schrittMm?: number;
  quellenHinweis?: string;
  className?: string;
}

export interface InteraktiveBegriffListeProps {
  begriffe: string[];
  definitionen?: Record<string, Partial<FachbegriffInfo>>;
  className?: string;
}

export interface MiniWissenscheckProps {
  id: string;
  fragen: MiniWissenscheckFrage[];
  titel?: string;
  masteryHinweis?: string;
  className?: string;
}

export interface MiniWissenscheckFrage {
  id: string;
  masterySchluessel: string;
  aufgabenstellung: string;
  optionen: MiniWissenscheckOption[];
  tabellenbuchHinweis?: string | null;
}

export interface MiniWissenscheckOption {
  id: string;
  text: string;
  istKorrekt: boolean;
  erklaerung: string;
}

export interface ProduktionsStartcheckProps {
  titel?: string;
  className?: string;
}

export interface RollenEntscheiderProps {
  titel?: string;
  className?: string;
}

export interface MeldewegTrainerProps {
  titel?: string;
  className?: string;
}

export interface GefahrstellenTrainerProps {
  titel?: string;
  className?: string;
}

export interface PsaZuordnungProps {
  titel?: string;
  className?: string;
}

export interface SicherheitszeichenTrainerProps {
  titel?: string;
  className?: string;
}

export interface NotHaltSzenarioTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchutzeinrichtungTrainerProps {
  titel?: string;
  className?: string;
}

export interface GefahrbereichTrainerProps {
  titel?: string;
  className?: string;
}

export interface WiedereinschaltenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SicherheitsregelnTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugwechselTrainerProps {
  titel?: string;
  className?: string;
}

export interface UnfallMeldeTrainerProps {
  titel?: string;
  className?: string;
}

export interface AbfallwegTrainerProps {
  titel?: string;
  className?: string;
}

export interface BetriebsstoffZuordnungTrainerProps {
  titel?: string;
  className?: string;
}

export interface GefahrstoffEtikettTrainerProps {
  titel?: string;
  className?: string;
}

export interface SicherheitsdatenblattTrainerProps {
  titel?: string;
  className?: string;
}

export interface KuehlschmierstoffTrainerProps {
  titel?: string;
  className?: string;
}

export interface KunststoffAbfallTrainerProps {
  titel?: string;
  className?: string;
}

export interface ZeichnungZweckTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchriftfeldTrainerProps {
  titel?: string;
  className?: string;
}

export interface AnsichtenTrainerProps {
  titel?: string;
  className?: string;
}

export interface LinienartenTrainerProps {
  titel?: string;
  className?: string;
}

export interface MassstabTrainerProps {
  titel?: string;
  className?: string;
}

export interface BemassungTrainerProps {
  titel?: string;
  className?: string;
}

export interface ToleranzangabenTrainerProps {
  titel?: string;
  className?: string;
}

export interface PassungTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchnittdarstellungTrainerProps {
  titel?: string;
  className?: string;
}

export interface OberflaechenangabenTrainerProps {
  titel?: string;
  className?: string;
}

export interface StuecklisteTrainerProps {
  titel?: string;
  className?: string;
}

export interface ArbeitsplanTrainerProps {
  titel?: string;
  className?: string;
}

export interface SiEinheitenTrainerProps {
  titel?: string;
  className?: string;
}

export interface LaengenUmrechnungTrainerProps {
  titel?: string;
  className?: string;
}

export interface FlaechenTrainerProps {
  titel?: string;
  className?: string;
}

export interface VolumenTrainerProps {
  titel?: string;
  className?: string;
}

export interface DichteTrainerProps {
  titel?: string;
  className?: string;
}

export interface GeschwindigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface TemperaturTrainerProps {
  titel?: string;
  className?: string;
}

export interface PruefenMessenLehrenTrainerProps {
  titel?: string;
  className?: string;
}

export interface MessschieberTeileTrainerProps {
  titel?: string;
  className?: string;
}

export interface AussenmessungTrainerProps {
  titel?: string;
  className?: string;
}

export interface InnenTiefenmessungTrainerProps {
  titel?: string;
  className?: string;
}

export interface MesswertAblesenTrainerProps {
  titel?: string;
  className?: string;
}

export interface BuegelmessschraubeTrainerProps {
  titel?: string;
  className?: string;
}

export interface MessuhrTrainerProps {
  titel?: string;
  className?: string;
}

export interface LehrenTrainerProps {
  titel?: string;
  className?: string;
}

export interface PruefmittelpflegeTrainerProps {
  titel?: string;
  className?: string;
}

export interface KalibrierenJustierenEichenTrainerProps {
  titel?: string;
  className?: string;
}

export interface MessunsicherheitTrainerProps {
  titel?: string;
  className?: string;
}

export interface TemperaturBeimMessenTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkstoffgruppenTrainerProps {
  titel?: string;
  className?: string;
}

export interface EisenStahlTrainerProps {
  titel?: string;
  className?: string;
}

export interface GusseisenTrainerProps {
  titel?: string;
  className?: string;
}

export interface NichteisenmetalleTrainerProps {
  titel?: string;
  className?: string;
}

export interface AluminiumTrainerProps {
  titel?: string;
  className?: string;
}

export interface KupferTrainerProps {
  titel?: string;
  className?: string;
}

export interface ThermoplastTrainerProps {
  titel?: string;
  className?: string;
}

export interface DuroplastTrainerProps {
  titel?: string;
  className?: string;
}

export interface ElastomerTrainerProps {
  titel?: string;
  className?: string;
}

export interface AdditiveMasterbatchTrainerProps {
  titel?: string;
  className?: string;
}

export interface GranulatChargeRezyklatTrainerProps {
  titel?: string;
  className?: string;
}

export interface HaerteTrainerProps {
  titel?: string;
  className?: string;
}

export interface FestigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface ZaehigkeitSproedigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface ElastischPlastischTrainerProps {
  titel?: string;
  className?: string;
}

export interface DichteVergleichTrainerProps {
  titel?: string;
  className?: string;
}

export interface WaermeausdehnungTrainerProps {
  titel?: string;
  className?: string;
}

export interface KorrosionTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkstoffauswahlTrainerProps {
  titel?: string;
  className?: string;
}

export interface WelleAchseTrainerProps {
  titel?: string;
  className?: string;
}

export interface LagerartenTrainerProps {
  titel?: string;
  className?: string;
}

export interface GleitlagerTrainerProps {
  titel?: string;
  className?: string;
}

export interface WaelzlagerTrainerProps {
  titel?: string;
  className?: string;
}

export interface KupplungTrainerProps {
  titel?: string;
  className?: string;
}

export interface ZahnradgetriebeTrainerProps {
  titel?: string;
  className?: string;
}

export interface RiemenantriebTrainerProps {
  titel?: string;
  className?: string;
}

export interface KettenantriebTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchraubenMutternTrainerProps {
  titel?: string;
  className?: string;
}

export interface FedernDaempferTrainerProps {
  titel?: string;
  className?: string;
}

export interface FertigungHauptgruppenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SpanendSpanlosTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchnittVorschubTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchnittgeschwindigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface DrehzahlBerechnenTrainerProps {
  titel?: string;
  className?: string;
}

export interface VorschubZustellungTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugverschleissTrainerProps {
  titel?: string;
  className?: string;
}

export interface KuehlschmierstoffFertigungTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugdatenTrainerProps {
  titel?: string;
  className?: string;
}

export interface BearbeitungszeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface SaegeTrainerProps {
  titel?: string;
  className?: string;
}

export interface BohrenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SenkenReibenTrainerProps {
  titel?: string;
  className?: string;
}

export interface GewindeschneidenTrainerProps {
  titel?: string;
  className?: string;
}

export interface DrehenGrundlagenTrainerProps {
  titel?: string;
  className?: string;
}

export interface LaengsPlanDrehenTrainerProps {
  titel?: string;
  className?: string;
}

export interface FraesenGrundlagenTrainerProps {
  titel?: string;
  className?: string;
}

export interface UmfangStirnFraesenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchleifenTrainerProps {
  titel?: string;
  className?: string;
}

export interface StanzenSchneidenTrainerProps {
  titel?: string;
  className?: string;
}

export interface BiegenTrainerProps {
  titel?: string;
  className?: string;
}

export interface WalzenTrainerProps {
  titel?: string;
  className?: string;
}

export interface TiefziehenTrainerProps {
  titel?: string;
  className?: string;
}

export interface PressenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchmiedenTrainerProps {
  titel?: string;
  className?: string;
}

export interface GiessenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchweissenTrainerProps {
  titel?: string;
  className?: string;
}

export interface LoetenTrainerProps {
  titel?: string;
  className?: string;
}

export interface KlebenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchraubenNietenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SpritzgiessmaschineTrainerProps {
  titel?: string;
  className?: string;
}

export interface MaterialtrichterTrocknungTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchneckeZylinderTrainerProps {
  titel?: string;
  className?: string;
}

export interface EinzugszoneTrainerProps {
  titel?: string;
  className?: string;
}

export interface KompressionszoneTrainerProps {
  titel?: string;
  className?: string;
}

export interface MeteringzoneTrainerProps {
  titel?: string;
  className?: string;
}

export interface RueckstromsperreDueseTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugKavitaetTrainerProps {
  titel?: string;
  className?: string;
}

export interface AngussEntlueftungTrainerProps {
  titel?: string;
  className?: string;
}

export interface AuswerferEntformenTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugtemperierungTrainerProps {
  titel?: string;
  className?: string;
}

export interface PlastifizierenDosierenTrainerProps {
  titel?: string;
  className?: string;
}

export interface EinspritzenUmschaltpunktTrainerProps {
  titel?: string;
  className?: string;
}

export interface NachdruckTrainerProps {
  titel?: string;
  className?: string;
}

export interface KuehlzeitRestkuehlzeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchliesskraftTrainerProps {
  titel?: string;
  className?: string;
}

export interface SpritzgiessParameterTrainerProps {
  titel?: string;
  className?: string;
}

export interface SpritzgiesszyklusTrainerProps {
  titel?: string;
  className?: string;
}

export interface ExtruderAufbauTrainerProps {
  titel?: string;
  className?: string;
}

export interface ExtrusionsprodukteTrainerProps {
  titel?: string;
  className?: string;
}

export interface BlasformenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ThermoformenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchwindungVerzugTrainerProps {
  titel?: string;
  className?: string;
}

export interface MolekuelorientierungTrainerProps {
  titel?: string;
  className?: string;
}

export interface FarbMaterialwechselTrainerProps {
  titel?: string;
  className?: string;
}

export interface AuftragZeichnungAbgleichTrainerProps {
  titel?: string;
  className?: string;
}

export interface MaterialChargePruefenTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugVorbereitenTrainerProps {
  titel?: string;
  className?: string;
}

export interface MaschineRuestenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ParameterUebernehmenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ErstteilHerstellenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ErstteilPruefenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ProduktionsfreigabeTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugwechselVorbereitungTrainerProps {
  titel?: string;
  className?: string;
}

export interface AnfahrenAbfahrenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchichtuebergabeTrainerProps {
  titel?: string;
  className?: string;
}

export interface ProduktionsdatenQualitaetTrainerProps {
  titel?: string;
  className?: string;
}

export interface QualitaetBetriebTrainerProps {
  titel?: string;
  className?: string;
}

export interface SollIstNennmassTrainerProps {
  titel?: string;
  className?: string;
}

export interface GrenzmasseToleranzTrainerProps {
  titel?: string;
  className?: string;
}

export interface PruefplanLesenTrainerProps {
  titel?: string;
  className?: string;
}

export interface PruefhaeufigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface PruefartenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SichtMassFunktionspruefungTrainerProps {
  titel?: string;
  className?: string;
}

export interface StichprobeVollpruefungTrainerProps {
  titel?: string;
  className?: string;
}

export interface GutteilNacharbeitAusschussTrainerProps {
  titel?: string;
  className?: string;
}

export interface FehlerquoteBerechnenTrainerProps {
  titel?: string;
  className?: string;
}

export interface MittelwertSpannweiteTrainerProps {
  titel?: string;
  className?: string;
}

export interface TrendProzessstreuungTrainerProps {
  titel?: string;
  className?: string;
}

export interface NormalverteilungTrainerProps {
  titel?: string;
  className?: string;
}

export interface RegelkarteLesenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ProzessfaehigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface MessunsicherheitQsTrainerProps {
  titel?: string;
  className?: string;
}

export interface RueckverfolgbarkeitChargeTrainerProps {
  titel?: string;
  className?: string;
}

export interface PruefprotokollSchreibenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SperrungFreigabeTrainerProps {
  titel?: string;
  className?: string;
}

export interface GratMetallTrainerProps {
  titel?: string;
  className?: string;
}

export interface MassabweichungMetallTrainerProps {
  titel?: string;
  className?: string;
}

export interface RattermarkenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchlechterRundlaufTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugbruchTrainerProps {
  titel?: string;
  className?: string;
}

export interface WerkzeugverschleissMetallTrainerProps {
  titel?: string;
  className?: string;
}

export interface VerformungRissTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchlechteOberflaecheTrainerProps {
  titel?: string;
  className?: string;
}

export interface HaertefehlerTrainerProps {
  titel?: string;
  className?: string;
}

export interface KorrosionBauteilTrainerProps {
  titel?: string;
  className?: string;
}

export interface EinfallstellenTrainerProps {
  titel?: string;
  className?: string;
}

export interface LunkerTrainerProps {
  titel?: string;
  className?: string;
}

export interface GratUeberspritzungTrainerProps {
  titel?: string;
  className?: string;
}

export interface UnterfuellungTrainerProps {
  titel?: string;
  className?: string;
}

export interface FliessnaehteBindenaehteTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchlierenFeuchtigkeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface VerbrennungDieseleffektTrainerProps {
  titel?: string;
  className?: string;
}

export interface VerzugKunststoffTrainerProps {
  titel?: string;
  className?: string;
}

export interface DelaminationTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchwarzePunkteTrainerProps {
  titel?: string;
  className?: string;
}

export interface FarbabweichungTrainerProps {
  titel?: string;
  className?: string;
}

export interface AngussAuswerfermarkenTrainerProps {
  titel?: string;
  className?: string;
}

export interface MassabweichungKunststoffTrainerProps {
  titel?: string;
  className?: string;
}

export interface Fehlerdiagnose5MTrainerProps {
  titel?: string;
  className?: string;
}

export interface SensorAktorSteuerungTrainerProps {
  titel?: string;
  className?: string;
}

export interface SteuerungRegelungTrainerProps {
  titel?: string;
  className?: string;
}

export interface SollIstStellgroesseTrainerProps {
  titel?: string;
  className?: string;
}

export interface SpsGrundlagenTrainerProps {
  titel?: string;
  className?: string;
}

export interface EingangAusgangTrainerProps {
  titel?: string;
  className?: string;
}

export interface UndOderVerriegelungTrainerProps {
  titel?: string;
  className?: string;
}

export interface EndschalterLichtschrankeTrainerProps {
  titel?: string;
  className?: string;
}

export interface InduktivKapazitivSensorTrainerProps {
  titel?: string;
  className?: string;
}

export interface TemperaturDrucksensorenTrainerProps {
  titel?: string;
  className?: string;
}

export interface ElektromotorFrequenzumrichterTrainerProps {
  titel?: string;
  className?: string;
}

export interface DruckluftanlageTrainerProps {
  titel?: string;
  className?: string;
}

export interface WartungseinheitTrainerProps {
  titel?: string;
  className?: string;
}

export interface VentileDrosselnTrainerProps {
  titel?: string;
  className?: string;
}

export interface EinfachwirkenderZylinderTrainerProps {
  titel?: string;
  className?: string;
}

export interface DoppeltwirkenderZylinderTrainerProps {
  titel?: string;
  className?: string;
}

export interface HydraulikGrundlagenTrainerProps {
  titel?: string;
  className?: string;
}

export interface WartungInspektionInstandsetzungTrainerProps {
  titel?: string;
  className?: string;
}

export interface VorbeugendeInstandhaltungTrainerProps {
  titel?: string;
  className?: string;
}

export interface SchmierungSchmierplanTrainerProps {
  titel?: string;
  className?: string;
}

export interface VerschleissReibungTrainerProps {
  titel?: string;
  className?: string;
}

export interface TemperaturSchwingungGeraeuschTrainerProps {
  titel?: string;
  className?: string;
}

export interface LeckageErkennenTrainerProps {
  titel?: string;
  className?: string;
}

export interface LagerfehlerTrainerProps {
  titel?: string;
  className?: string;
}

export interface UnwuchtFehlausrichtungTrainerProps {
  titel?: string;
  className?: string;
}

export interface StoerungFehlerUrsacheWirkungTrainerProps {
  titel?: string;
  className?: string;
}

export interface FiveWhyTrainerProps {
  titel?: string;
  className?: string;
}

export interface IshikawaDiagrammTrainerProps {
  titel?: string;
  className?: string;
}

export interface StoerungDokumentierenTrainerProps {
  titel?: string;
  className?: string;
}

export interface SichereFehlersucheTrainerProps {
  titel?: string;
  className?: string;
}

export interface VerbesserungNachStoerungTrainerProps {
  titel?: string;
  className?: string;
}

export interface FertigungsauftragTrainerProps {
  titel?: string;
  className?: string;
}

export interface ArbeitsfolgePlanenTrainerProps {
  titel?: string;
  className?: string;
}

export interface StuecklisteMaterialbedarfTrainerProps {
  titel?: string;
  className?: string;
}

export interface PersonalMaschinenbedarfTrainerProps {
  titel?: string;
  className?: string;
}

export interface MaschinenbelegungKapazitaetTrainerProps {
  titel?: string;
  className?: string;
}

export interface TaktzeitZykluszeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface DurchlaufzeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface RuestzeitBearbeitungszeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface StillstandszeitTrainerProps {
  titel?: string;
  className?: string;
}

export interface LieferterminLosgroesseTrainerProps {
  titel?: string;
  className?: string;
}

export interface BestandMindestbestandTrainerProps {
  titel?: string;
  className?: string;
}

export interface MeldebestandSicherheitsbestandTrainerProps {
  titel?: string;
  className?: string;
}

export interface FifoTrainerProps {
  titel?: string;
  className?: string;
}

export interface KanbanGrundprinzipTrainerProps {
  titel?: string;
  className?: string;
}

export interface WertschoepfungVerschwendungTrainerProps {
  titel?: string;
  className?: string;
}

export interface FuenfSWiederholenTrainerProps {
  titel?: string;
  className?: string;
}

export interface KvpImTeamTrainerProps {
  titel?: string;
  className?: string;
}


export interface OeeUeberblickenTrainerProps {
  titel?: string;
  className?: string;
}


export interface VerfuegbarkeitBerechnenTrainerProps {
  titel?: string;
  className?: string;
}


export interface LeistungsgradBerechnenTrainerProps {
  titel?: string;
  className?: string;
}


export interface QualitaetsrateBerechnenTrainerProps {
  titel?: string;
  className?: string;
}


export interface OeeVerbessernTrainerProps {
  titel?: string;
  className?: string;
}


export interface RechenwegInPruefungenTrainerProps {
  titel?: string;
  className?: string;
}


export interface GrundrechenartenSicherTrainerProps {
  titel?: string;
  className?: string;
}


export interface DreisatzTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProzentrechnungTrainerProps {
  titel?: string;
  className?: string;
}


export interface EinheitenInAufgabenTrainerProps {
  titel?: string;
  className?: string;
}


export interface UmfangFlaecheRechteckTrainerProps {
  titel?: string;
  className?: string;
}


export interface KreisumfangKreisflaecheTrainerProps {
  titel?: string;
  className?: string;
}


export interface VolumenQuaderZylinderTrainerProps {
  titel?: string;
  className?: string;
}


export interface MasseAusDichteTrainerProps {
  titel?: string;
  className?: string;
}


export interface GeschwindigkeitUndZeitTrainerProps {
  titel?: string;
  className?: string;
}


export interface DrehzahlSchnittgeschwindigkeitTrainerProps {
  titel?: string;
  className?: string;
}


export interface VorschubBerechnenTrainerProps {
  titel?: string;
  className?: string;
}


export interface KraftUndDruckTrainerProps {
  titel?: string;
  className?: string;
}


export interface HydraulischerDruckTrainerProps {
  titel?: string;
  className?: string;
}


export interface LeistungArbeitWirkungsgradTrainerProps {
  titel?: string;
  className?: string;
}


export interface UebersetzungsverhaeltnisTrainerProps {
  titel?: string;
  className?: string;
}


export interface DrehmomentTrainerProps {
  titel?: string;
  className?: string;
}


export interface GutmengeAusschussquoteTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProduktionsleistungTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProzentualeAbweichungTrainerProps {
  titel?: string;
  className?: string;
}


export interface WaermeausdehnungPruefungsnahTrainerProps {
  titel?: string;
  className?: string;
}


export interface ToleranzberechnungTrainerProps {
  titel?: string;
  className?: string;
}


export interface FormelUmstellenTrainerProps {
  titel?: string;
  className?: string;
}


export interface PlausibilitaetVonErgebnissenTrainerProps {
  titel?: string;
  className?: string;
}


export interface AusbildungsvertragTrainerProps {
  titel?: string;
  className?: string;
}


export interface RechteUndPflichtenTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProbezeitUndKuendigungTrainerProps {
  titel?: string;
  className?: string;
}


export interface ArbeitsvertragTarifvertragTrainerProps {
  titel?: string;
  className?: string;
}


export interface TarifautonomieBetriebsratTrainerProps {
  titel?: string;
  className?: string;
}


export interface JugendAuszubildendenvertretungTrainerProps {
  titel?: string;
  className?: string;
}


export interface SozialversicherungTrainerProps {
  titel?: string;
  className?: string;
}


export interface ArbeitszeitUndUrlaubTrainerProps {
  titel?: string;
  className?: string;
}


export interface EntgeltabrechnungTrainerProps {
  titel?: string;
  className?: string;
}


export interface NachhaltigkeitUmweltschutzTrainerProps {
  titel?: string;
  className?: string;
}


export interface WirtschaftlichkeitProduktivitaetTrainerProps {
  titel?: string;
  className?: string;
}


export interface OekonomischesPrinzipTrainerProps {
  titel?: string;
  className?: string;
}


export interface AufgabenstellungRichtigLesenTrainerProps {
  titel?: string;
  className?: string;
}


export interface GegebenUndGesuchtTrainerProps {
  titel?: string;
  className?: string;
}


export interface PassendeFormelFindenTrainerProps {
  titel?: string;
  className?: string;
}


export interface EinheitenKontrollierenTrainerProps {
  titel?: string;
  className?: string;
}


export interface TabellenbuchNutzenTrainerProps {
  titel?: string;
  className?: string;
}


export interface MultipleChoiceAusschlussTrainerProps {
  titel?: string;
  className?: string;
}


export interface UnbekannteBegriffeTrainerProps {
  titel?: string;
  className?: string;
}


export interface ZeitmanagementTrainerProps {
  titel?: string;
  className?: string;
}


export interface PruefungsangstReduzierenTrainerProps {
  titel?: string;
  className?: string;
}


export interface TypischePruefungsfallenTrainerProps {
  titel?: string;
  className?: string;
}


export interface MiniPruefungProduktionstechnikTrainerProps {
  titel?: string;
  className?: string;
}


export interface MiniPruefungProduktionsplanungTrainerProps {
  titel?: string;
  className?: string;
}


export interface MiniPruefungWisoTrainerProps {
  titel?: string;
  className?: string;
}


export interface WiederholungsmodusTrainerProps {
  titel?: string;
  className?: string;
}


export interface PersoenlicheSchwachstellenTrainerProps {
  titel?: string;
  className?: string;
}


export interface PruefungssimulationAbschlussTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProduktionsauftragLesenTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProduktionsablaufVerstehenTrainerProps {
  titel?: string;
  className?: string;
}


export interface SchichtbeginnVorbereitenTrainerProps {
  titel?: string;
  className?: string;
}


export interface OrdnungAmArbeitsplatzTrainerProps {
  titel?: string;
  className?: string;
}


export interface ProduktionsdatenNotierenTrainerProps {
  titel?: string;
  className?: string;
}

interface FachbegriffInfo {
  fachdefinition: string;
  einfach: string;
  bezug: string;
}

type MesswertStatus = 'zu_klein' | 'in_toleranz' | 'zu_gross';

const STATUS_DATEN: Record<
  MesswertStatus,
  { label: string; hinweis: string; badge: BadgeVariante; symbol: string; box: string }
> = {
  zu_klein: {
    label: 'Unter Grenzmass',
    hinweis: 'Der Wert liegt unter dem unteren Grenzmass. Das Teil waere zu klein.',
    badge: 'danger',
    symbol: '-',
    box: 'border-danger-border bg-danger-bg/45',
  },
  in_toleranz: {
    label: 'Im Toleranzfeld',
    hinweis: 'Der Wert liegt zwischen unterem und oberem Grenzmass.',
    badge: 'success',
    symbol: '=',
    box: 'border-success-border bg-success-bg/45',
  },
  zu_gross: {
    label: 'Ueber Grenzmass',
    hinweis: 'Der Wert liegt ueber dem oberen Grenzmass. Das Teil waere zu gross.',
    badge: 'danger',
    symbol: '+',
    box: 'border-danger-border bg-danger-bg/45',
  },
};

const STARTCHECK_PUNKTE = [
  'Auftrag gelesen',
  'Material passt zum Auftrag',
  'Maschine wirkt betriebsbereit',
  'Pruefmerkmal ist bekannt',
  'Rueckmeldung ist klar',
] as const;

const ROLLEN_SZENARIEN = [
  {
    id: 'material-unklar',
    frage: 'Auftrag und Materialkennzeichnung passen nicht zusammen.',
    richtigeRolle: 'Melden',
    begruendung: 'Widersprueche werden vor dem Start geklaert und ueber den Meldeweg weitergegeben.',
  },
  {
    id: 'schutz-offen',
    frage: 'Eine Schutzeinrichtung ist offen oder wirkt beschaedigt.',
    richtigeRolle: 'Sichern',
    begruendung: 'Sicherheit kommt vor Produktion. Die Anlage wird nach Vorgabe nicht einfach weiter betrieben.',
  },
  {
    id: 'teil-auffaellig',
    frage: 'Ein Teil sieht anders aus als die vorherigen Teile.',
    richtigeRolle: 'Pruefen',
    begruendung: 'Auffaellige Teile werden nach Pruefvorgabe kontrolliert und bei Bedarf gemeldet.',
  },
] as const;

const ROLLEN_OPTIONEN = ['Ruesten', 'Bedienen', 'Pruefen', 'Melden', 'Sichern'] as const;

const MELDEWEG_SCHRITTE = ['Erkennen', 'Sichern', 'Melden', 'Sperren', 'Dokumentieren'] as const;

const GEFAHRSTELLEN = [
  { id: 'einzug', label: 'Einzug', beschreibung: 'Koerperteile, Kleidung oder Material koennen in bewegte Teile gezogen werden.' },
  { id: 'quetschen', label: 'Quetschen', beschreibung: 'Zwischen bewegten oder schliessenden Teilen kann Druck entstehen.' },
  { id: 'schneiden', label: 'Schneiden', beschreibung: 'Scharfe Kanten, Messer oder Spaene koennen Schnittverletzungen verursachen.' },
  { id: 'stolpern', label: 'Stolpern', beschreibung: 'Material, Leitungen oder Unordnung im Laufweg koennen zu Stuerzen fuehren.' },
] as const;

const PSA_AUFGABEN = [
  { situation: 'Spaene koennen beim Bearbeiten wegfliegen.', korrekt: 'Schutzbrille' },
  { situation: 'Schwere Teile werden in der Werkhalle transportiert.', korrekt: 'Sicherheitsschuhe' },
  { situation: 'Scharfkantige Teile werden nach Vorgabe ausserhalb laufender Maschinen gehandhabt.', korrekt: 'Handschuhe nach Vorgabe' },
] as const;

const PSA_OPTIONEN = ['Schutzbrille', 'Sicherheitsschuhe', 'Handschuhe nach Vorgabe'] as const;

const SICHERHEITSZEICHEN_AUFGABEN = [
  { text: 'Du musst eine bestimmte Handlung ausfuehren, zum Beispiel Augenschutz tragen.', korrekt: 'Gebot' },
  { text: 'Eine Handlung ist untersagt, zum Beispiel Rauchen oder Zutritt.', korrekt: 'Verbot' },
  { text: 'Vor einer Gefahr wird gewarnt, zum Beispiel Quetschstelle oder elektrische Spannung.', korrekt: 'Warnung' },
] as const;

const SICHERHEITSZEICHEN_OPTIONEN = ['Gebot', 'Verbot', 'Warnung'] as const;

const NOT_HALT_SZENARIEN = [
  {
    situation: 'Eine Person greift in den Bereich, waehrend sich Teile bewegen.',
    korrekt: 'Not-Halt betaetigen',
    begruendung: 'Bei unmittelbarer Gefahr wird zuerst die Gefahr gestoppt und danach gemeldet.',
  },
  {
    situation: 'Der Not-Halt ist eingerastet. Die Ursache ist noch nicht geklaert.',
    korrekt: 'Melden und Freigabe abwarten',
    begruendung: 'Reset und Neustart kommen erst nach Klaerung, Beseitigung der Gefahr und Freigabe.',
  },
  {
    situation: 'Nach einer Stoerung sagt dir niemand, dass die Anlage wieder frei ist.',
    korrekt: 'Nicht neu starten',
    begruendung: 'Ohne Freigabe wird nicht weiter produziert, auch wenn Zeitdruck besteht.',
  },
] as const;

const NOT_HALT_OPTIONEN = ['Not-Halt betaetigen', 'Melden und Freigabe abwarten', 'Nicht neu starten', 'Weiter produzieren'] as const;

const SCHUTZEINRICHTUNG_AUFGABEN = [
  {
    text: 'Ein Schutzgitter ist offen und die Maschine soll trotzdem laufen.',
    korrekt: 'Nicht ueberbruecken',
    erklaerung: 'Schutzgitter und Verriegelung gehoeren zum Schutzkonzept und duerfen nicht manipuliert werden.',
  },
  {
    text: 'Eine Lichtschranke stoppt die Anlage beim Hineingreifen in den Gefahrbereich.',
    korrekt: 'Schutzfunktion erkennen',
    erklaerung: 'Die Lichtschranke erkennt den Eingriff und verhindert gefaehrliche Bewegung nach Schutzkonzept.',
  },
  {
    text: 'Eine Abdeckung wirkt locker oder beschaedigt.',
    korrekt: 'Sichern und melden',
    erklaerung: 'Beschaedigte Schutzeinrichtungen werden nicht ignoriert, sondern gesichert und gemeldet.',
  },
] as const;

const SCHUTZEINRICHTUNG_OPTIONEN = ['Schutzfunktion erkennen', 'Nicht ueberbruecken', 'Sichern und melden'] as const;

const GEFAHRBEREICH_AUFGABEN = [
  {
    situation: 'Material steckt zwischen zwei laufenden Walzen fest.',
    korrekt: 'Abstand halten und melden',
    begruendung: 'In laufende Einzugsstellen wird nicht gegriffen. Die Anlage wird nach Vorgabe gesichert.',
  },
  {
    situation: 'Ein Schieber faehrt hin und her, daneben liegt ein Teil schief.',
    korrekt: 'Stillstand und Freigabe abwarten',
    begruendung: 'Quetschstellen sind erst nach sicherem Stillstand und Freigabe zu klaeren.',
  },
  {
    situation: 'Lose Kleidung haengt nahe an einer drehenden Welle.',
    korrekt: 'Bereich verlassen und sichern',
    begruendung: 'Lose Kleidung kann eingezogen werden. Abstand und sichere Kleidung sind Pflicht.',
  },
] as const;

const GEFAHRBEREICH_OPTIONEN = ['Abstand halten und melden', 'Stillstand und Freigabe abwarten', 'Bereich verlassen und sichern', 'Schnell herausziehen'] as const;

const WIEDEREINSCHALTEN_SCHRITTE = ['Abstellen', 'Sichern', 'Kennzeichnen', 'Pruefen', 'Freigabe abwarten'] as const;

const SICHERHEITSREGELN_SCHRITTE = ['Freischalten', 'Gegen Wiedereinschalten sichern', 'Spannungsfreiheit feststellen', 'Erden und kurzschliessen', 'Benachbarte Teile abdecken'] as const;

const WERKZEUGWECHSEL_AUFGABEN = [
  {
    situation: 'Das Werkzeug soll gewechselt werden, die Maschine steht aber nur im normalen Halt.',
    korrekt: 'Sichern und Freigabe klaeren',
    begruendung: 'Vor dem Wechsel braucht es die freigegebene Sicherung gegen gefaehrliche Bewegung.',
  },
  {
    situation: 'Nach dem Wechsel sitzt das Werkzeug, aber die Pruefung fehlt noch.',
    korrekt: 'Erst pruefen',
    begruendung: 'Vor Serienlauf werden Sitz, Schutz und erstes Ergebnis nach Vorgabe geprueft.',
  },
  {
    situation: 'Beim Wechsel wirkt noch Druck oder Spannung in der Vorrichtung.',
    korrekt: 'Restenergie melden',
    begruendung: 'Restenergie wird nicht ignoriert. Die Situation wird gesichert und gemeldet.',
  },
] as const;

const WERKZEUGWECHSEL_OPTIONEN = ['Sichern und Freigabe klaeren', 'Erst pruefen', 'Restenergie melden', 'Sofort Serienlauf starten'] as const;

const UNFALL_MELDE_AUFGABEN = [
  {
    situation: 'Eine Person ist verletzt und die Maschine laeuft noch.',
    korrekt: 'Bereich sichern und Hilfe holen',
    begruendung: 'Erst weitere Gefahr verhindern, dann Hilfe holen und Erste Hilfe einleiten.',
  },
  {
    situation: 'Es gab keinen Schaden, aber ein Teil flog knapp an jemandem vorbei.',
    korrekt: 'Beinaheunfall melden',
    begruendung: 'Beinaheunfaelle zeigen echte Risiken und muessen nach Vorgabe gemeldet werden.',
  },
  {
    situation: 'Nach einem Vorfall fragt niemand nach Details.',
    korrekt: 'Dokumentieren nach Vorgabe',
    begruendung: 'Meldung und Dokumentation helfen, Ursachen zu klaeren und Wiederholung zu verhindern.',
  },
] as const;

const UNFALL_MELDE_OPTIONEN = ['Bereich sichern und Hilfe holen', 'Beinaheunfall melden', 'Dokumentieren nach Vorgabe', 'Einfach weiterarbeiten'] as const;

const ABFALLWEGE = ['Vermeiden', 'Trennen', 'Kennzeichnen', 'Sammeln', 'Entsorgen nach Vorgabe'] as const;

const BETRIEBSSTOFF_AUFGABEN = [
  { situation: 'Schmierstelle an einer Fuehrung nach Wartungsplan.', korrekt: 'Fett' },
  { situation: 'Behaelter fuer Hydraulikaggregat nach Betriebsanweisung.', korrekt: 'Oel' },
  { situation: 'Bearbeitungsstelle braucht Kuehlung und Schmierung.', korrekt: 'Kuehlschmierstoff' },
  { situation: 'Verschmutzte Flaeche soll nach Vorgabe gereinigt werden.', korrekt: 'Reiniger' },
] as const;

const BETRIEBSSTOFF_OPTIONEN = ['Oel', 'Fett', 'Kuehlschmierstoff', 'Reiniger'] as const;

const GEFAHRSTOFF_ETIKETT_AUFGABEN = [
  { text: 'Welcher Bereich zeigt dir die Art der Gefahr als Symbol?', korrekt: 'Piktogramm' },
  { text: 'Wo findest du kurze Hinweise zu Gefahren und Schutzmassnahmen?', korrekt: 'H-/P-Saetze' },
  { text: 'Was zeigt dir, welches Produkt im Gebinde ist?', korrekt: 'Produktname' },
] as const;

const GEFAHRSTOFF_ETIKETT_OPTIONEN = ['Produktname', 'Piktogramm', 'H-/P-Saetze', 'Signalwort'] as const;

const SDB_AUFGABEN = [
  { situation: 'Du willst wissen, welche PSA beim Stoff vorgesehen ist.', korrekt: 'PSA' },
  { situation: 'Jemand hatte Hautkontakt mit einem Stoff.', korrekt: 'Erste Hilfe' },
  { situation: 'Ein Reststoff muss entsorgt werden.', korrekt: 'Entsorgung' },
] as const;

const SDB_OPTIONEN = ['Gefahren', 'Erste Hilfe', 'Handhabung', 'PSA', 'Entsorgung'] as const;

const KSS_AUFGABEN = [
  {
    situation: 'Kuehlschmierstoff ist auf dem Boden ausgelaufen.',
    korrekt: 'Bereich sichern und melden',
    begruendung: 'Rutschgefahr und Umweltgefahr werden gesichert und nach Vorgabe beseitigt.',
  },
  {
    situation: 'Deine Haut ist laenger mit KSS in Kontakt gekommen.',
    korrekt: 'Hautschutz beachten',
    begruendung: 'Hautkontakt wird vermieden; Reinigung und Hautschutz richten sich nach Unterweisung.',
  },
  {
    situation: 'Der KSS riecht auffaellig oder sieht veraendert aus.',
    korrekt: 'Zustand melden',
    begruendung: 'Auffaellige Zustaende werden nicht ignoriert, sondern nach Vorgabe geprueft.',
  },
] as const;

const KSS_OPTIONEN = ['Bereich sichern und melden', 'Hautschutz beachten', 'Zustand melden', 'Mit Druckluft wegblasen'] as const;

const KUNSTSTOFF_ABFALL_AUFGABEN = [
  { situation: 'Saubere Anguesse aus bekanntem Material.', korrekt: 'Sortenrein sammeln' },
  { situation: 'Kunststoffteil mit Metallrest.', korrekt: 'Fremdstoff trennen' },
  { situation: 'Unbekannte Mischung aus mehreren Kunststoffen.', korrekt: 'Nach Vorgabe klaeren' },
] as const;

const KUNSTSTOFF_ABFALL_OPTIONEN = ['Sortenrein sammeln', 'Fremdstoff trennen', 'Nach Vorgabe klaeren', 'Alles zusammenwerfen'] as const;

const ZEICHNUNG_ZWECK_AUFGABEN = [
  { situation: 'Du willst wissen, aus welchem Werkstoff ein Teil gefertigt werden soll.', korrekt: 'Zeichnung und Schriftfeld lesen' },
  { situation: 'Du willst wissen, ob die sichtbare Form vollstaendig beschrieben ist.', korrekt: 'Alle Ansichten vergleichen' },
  { situation: 'Du willst ein Mass fuer die Fertigung uebernehmen.', korrekt: 'Bemassung lesen' },
] as const;

const ZEICHNUNG_ZWECK_OPTIONEN = ['Zeichnung und Schriftfeld lesen', 'Alle Ansichten vergleichen', 'Bemassung lesen', 'Nach Augenmass schaetzen'] as const;

const SCHRIFTFELD_AUFGABEN = [
  { frage: 'Wo findest du die eindeutige Kennung der Zeichnung?', korrekt: 'Zeichnungsnummer' },
  { frage: 'Wo erkennst du den angegebenen Werkstoff?', korrekt: 'Werkstoff' },
  { frage: 'Wo erkennst du, ob die Darstellung vergroessert oder verkleinert ist?', korrekt: 'Massstab' },
] as const;

const SCHRIFTFELD_OPTIONEN = ['Zeichnungsnummer', 'Werkstoff', 'Massstab', 'Oberflaeche'] as const;

const ANSICHTEN_AUFGABEN = [
  { frage: 'Welche Ansicht zeigt das Bauteil von vorne?', korrekt: 'Vorderansicht' },
  { frage: 'Welche Ansicht zeigt das Bauteil von oben?', korrekt: 'Draufsicht' },
  { frage: 'Welche Ansicht hilft, Tiefe oder Seitenform zu erkennen?', korrekt: 'Seitenansicht' },
] as const;

const ANSICHTEN_OPTIONEN = ['Vorderansicht', 'Draufsicht', 'Seitenansicht'] as const;

const LINIENARTEN_AUFGABEN = [
  { frage: 'Welche Linie zeigt sichtbare Kanten?', korrekt: 'Volllinie' },
  { frage: 'Welche Linie kann verdeckte Kanten darstellen?', korrekt: 'Strichlinie' },
  { frage: 'Welche Linie kann eine Mittellinie darstellen?', korrekt: 'Strichpunktlinie' },
] as const;

const LINIENARTEN_OPTIONEN = ['Volllinie', 'Strichlinie', 'Strichpunktlinie'] as const;

const MASSSTAB_AUFGABEN = [
  {
    situation: 'Auf der Zeichnung steht 1:1.',
    korrekt: 'Originalgroesse',
    begruendung: 'Die Darstellung ist in Originalgroesse, die Bemassung bleibt trotzdem verbindlich.',
  },
  {
    situation: 'Auf der Zeichnung steht 2:1.',
    korrekt: 'Vergroesserung',
    begruendung: 'Das Bauteil ist groesser dargestellt als es wirklich ist.',
  },
  {
    situation: 'Auf der Zeichnung steht 1:2.',
    korrekt: 'Verkleinerung',
    begruendung: 'Das Bauteil ist kleiner dargestellt als es wirklich ist.',
  },
] as const;

const MASSSTAB_OPTIONEN = ['Originalgroesse', 'Vergroesserung', 'Verkleinerung', 'Bauteilmass verdoppeln'] as const;

const BEMASSUNG_AUFGABEN = [
  { frage: 'Welche Angabe liest du als Zahlenwert fuer ein Mass?', korrekt: 'Masszahl' },
  { frage: 'Welche Linie zeigt, worauf sich die Masszahl bezieht?', korrekt: 'Masslinie' },
  { frage: 'Was begrenzt die Masslinie an den Enden?', korrekt: 'Masspfeile' },
] as const;

const BEMASSUNG_OPTIONEN = ['Masszahl', 'Masslinie', 'Masspfeile', 'Schraffur'] as const;

const TOLERANZANGABEN_AUFGABEN = [
  { frage: 'Welches Mass steht als Sollwert in der Zeichnung?', korrekt: 'Nennmass' },
  { frage: 'Welche Grenze darf ein Istmass nicht ueberschreiten?', korrekt: 'Oberes Grenzmass' },
  { frage: 'Welche Grenze darf ein Istmass nicht unterschreiten?', korrekt: 'Unteres Grenzmass' },
] as const;

const TOLERANZANGABEN_OPTIONEN = ['Nennmass', 'Oberes Grenzmass', 'Unteres Grenzmass', 'Schaetzwert'] as const;

const PASSUNG_AUFGABEN = [
  {
    situation: 'Die Welle ist kleiner als die Bohrung und laesst sich leicht bewegen.',
    korrekt: 'Spiel',
    begruendung: 'Zwischen Welle und Bohrung bleibt Platz.',
  },
  {
    situation: 'Welle und Bohrung koennen je nach Istmass gerade noch sitzen oder leicht klemmen.',
    korrekt: 'Uebergang',
    begruendung: 'Der Bereich liegt zwischen eindeutigem Spiel und eindeutigem Uebermass.',
  },
  {
    situation: 'Die Welle ist groesser als die Bohrung und wird nicht locker eingesetzt.',
    korrekt: 'Uebermass',
    begruendung: 'Die Masse ueberschneiden sich so, dass ein fester Sitz entstehen kann.',
  },
] as const;

const PASSUNG_OPTIONEN = ['Spiel', 'Uebergang', 'Uebermass', 'Oberflaeche'] as const;

const SCHNITT_AUFGABEN = [
  { frage: 'Welche Darstellung macht Innenkonturen sichtbar?', korrekt: 'Schnittdarstellung' },
  { frage: 'Welche Kennzeichnung zeigt geschnittene Flaechen im Lernbeispiel?', korrekt: 'Schraffur' },
  { frage: 'Was darfst du bei einem Schnitt nicht mit Material verwechseln?', korrekt: 'Hohlraum' },
] as const;

const SCHNITT_OPTIONEN = ['Schnittdarstellung', 'Schraffur', 'Hohlraum', 'Massstab'] as const;

const OBERFLAECHE_AUFGABEN = [
  { frage: 'Welche Angabe beschreibt die geforderte Flaechenqualitaet?', korrekt: 'Rauheit' },
  { frage: 'Woher nimmst du verbindliche Symbolbedeutungen?', korrekt: 'Tabellenbuch oder freigegebene Zeichnung' },
  { frage: 'Was pruefst du, wenn eine Funktionsflaeche markiert ist?', korrekt: 'Oberflaechenanforderung' },
] as const;

const OBERFLAECHE_OPTIONEN = ['Rauheit', 'Oberflaechenanforderung', 'Tabellenbuch oder freigegebene Zeichnung', 'Farbe des Papiers'] as const;

const STUECKLISTE_AUFGABEN = [
  { frage: 'Welche Spalte verbindet Zeichnungshinweis und Teil?', korrekt: 'Position' },
  { frage: 'Welche Angabe brauchst du fuer die Anzahl gleicher Teile?', korrekt: 'Menge' },
  { frage: 'Welche Angabe sagt, wie das Teil heisst?', korrekt: 'Benennung' },
] as const;

const STUECKLISTE_OPTIONEN = ['Position', 'Menge', 'Benennung', 'Schraffur'] as const;

const ARBEITSPLAN_AUFGABEN = [
  {
    situation: 'Du willst wissen, welcher Schritt zuerst kommt.',
    korrekt: 'Arbeitsfolge lesen',
    begruendung: 'Die Reihenfolge der Arbeitsgaenge verhindert falsches Vorbereiten oder Pruefen.',
  },
  {
    situation: 'Du brauchst die Maschine, das Werkzeug oder Pruefmittel fuer einen Schritt.',
    korrekt: 'Betriebsmittel pruefen',
    begruendung: 'Betriebsmittel stehen im Arbeitsplan oder in der zugehoerigen Vorgabe.',
  },
  {
    situation: 'Nach der Bearbeitung muss ein Merkmal kontrolliert werden.',
    korrekt: 'Pruefschritt beachten',
    begruendung: 'Pruefschritte sichern, dass das Ergebnis zur Zeichnung passt.',
  },
] as const;

const ARBEITSPLAN_OPTIONEN = ['Arbeitsfolge lesen', 'Betriebsmittel pruefen', 'Pruefschritt beachten', 'Reihenfolge raten'] as const;

const SI_EINHEITEN_AUFGABEN = [
  { frage: 'Welche Einheit gehoert zur Laenge?', korrekt: 'Meter' },
  { frage: 'Welche Einheit gehoert zur Zeit?', korrekt: 'Sekunde' },
  { frage: 'Welche Einheit gehoert zur Masse?', korrekt: 'Kilogramm' },
] as const;

const SI_EINHEITEN_OPTIONEN = ['Meter', 'Sekunde', 'Kilogramm', 'Liter'] as const;

const LAENGEN_UMRECHNUNG_AUFGABEN = [
  { frage: 'Wie viele Millimeter sind 1 Zentimeter?', korrekt: '10 mm' },
  { frage: 'Wie viele Zentimeter sind 1 Meter?', korrekt: '100 cm' },
  { frage: 'Wie viele Millimeter sind 1 Meter?', korrekt: '1000 mm' },
] as const;

const LAENGEN_UMRECHNUNG_OPTIONEN = ['10 mm', '100 cm', '1000 mm', '1 mm'] as const;

const FLAECHEN_AUFGABEN = [
  { frage: 'Welche Formel passt fuer eine Rechteckflaeche?', korrekt: 'A = Laenge x Breite' },
  { frage: 'Welche Einheit passt zu einer Flaeche?', korrekt: 'Quadratmillimeter' },
  { frage: 'Was musst du vor dem Rechnen pruefen?', korrekt: 'Einheiten gleich machen' },
] as const;

const FLAECHEN_OPTIONEN = ['A = Laenge x Breite', 'Quadratmillimeter', 'Einheiten gleich machen', 'Kilogramm'] as const;

const VOLUMEN_AUFGABEN = [
  { frage: 'Welche Formel passt fuer einen Quader?', korrekt: 'V = Laenge x Breite x Hoehe' },
  { frage: 'Welche Einheit passt zu Volumen?', korrekt: 'Kubikmillimeter' },
  { frage: 'Was beschreibt Volumen?', korrekt: 'Rauminhalt' },
] as const;

const VOLUMEN_OPTIONEN = ['V = Laenge x Breite x Hoehe', 'Kubikmillimeter', 'Rauminhalt', 'Sekunde'] as const;

const DICHTE_AUFGABEN = [
  {
    situation: 'Zwei gleich grosse Teile haben unterschiedliche Masse.',
    korrekt: 'Dichte vergleichen',
    begruendung: 'Bei gleichem Volumen zeigt unterschiedliche Masse eine unterschiedliche Dichte.',
  },
  {
    situation: 'Du kennst Masse und Volumen eines Werkstoffs.',
    korrekt: 'Dichte = Masse / Volumen',
    begruendung: 'Die Dichte verbindet Masse und Volumen.',
  },
  {
    situation: 'Ein Werkstoff wirkt ungewoehnlich schwer fuer seine Groesse.',
    korrekt: 'Werkstoffangabe pruefen',
    begruendung: 'Masse, Volumen und Werkstoffangabe muessen zusammenpassen.',
  },
] as const;

const DICHTE_OPTIONEN = ['Dichte vergleichen', 'Dichte = Masse / Volumen', 'Werkstoffangabe pruefen', 'Zeit stoppen'] as const;

const GESCHWINDIGKEIT_AUFGABEN = [
  { frage: 'Welche Formel beschreibt Geschwindigkeit einfach?', korrekt: 'v = Weg / Zeit' },
  { frage: 'Was brauchst du ausser dem Weg?', korrekt: 'Zeit' },
  { frage: 'Was passiert mit der Geschwindigkeit bei gleicher Strecke und weniger Zeit?', korrekt: 'Sie wird groesser' },
] as const;

const GESCHWINDIGKEIT_OPTIONEN = ['v = Weg / Zeit', 'Zeit', 'Sie wird groesser', 'Sie wird kleiner'] as const;

const TEMPERATUR_AUFGABEN = [
  { frage: 'Welche Angabe beschreibt einen Prozesszustand warm oder kalt?', korrekt: 'Temperatur' },
  { frage: 'Was bedeutet Delta T im Lernbeispiel?', korrekt: 'Temperaturunterschied' },
  { frage: 'Was tust du bei unklarer Prozess-Temperaturvorgabe?', korrekt: 'Vorgabe pruefen' },
] as const;

const TEMPERATUR_OPTIONEN = ['Temperatur', 'Temperaturunterschied', 'Vorgabe pruefen', 'Stueckliste sortieren'] as const;

const PRUEFEN_MESSEN_LEHREN_AUFGABEN = [
  { frage: 'Du willst feststellen, ob ein Teil die Vorgabe erfuellt.', korrekt: 'Pruefen' },
  { frage: 'Du bestimmst einen Zahlenwert mit Einheit.', korrekt: 'Messen' },
  { frage: 'Du nutzt eine Grenzlehre fuer Gut oder Ausschuss.', korrekt: 'Lehren' },
] as const;

const PRUEFEN_MESSEN_LEHREN_OPTIONEN = ['Pruefen', 'Messen', 'Lehren', 'Ruesten'] as const;

const MESSSCHIEBER_TEILE_AUFGABEN = [
  { frage: 'Welcher Teil liefert den ganzen Millimeterwert?', korrekt: 'Hauptskala' },
  { frage: 'Welcher Teil liefert den feinen Nachkommanteil?', korrekt: 'Nonius' },
  { frage: 'Welcher Teil wird fuer Tiefenmessungen genutzt?', korrekt: 'Tiefenstange' },
] as const;

const MESSSCHIEBER_TEILE_OPTIONEN = ['Hauptskala', 'Nonius', 'Tiefenstange', 'Ratsche'] as const;

const AUSSENMESSUNG_AUFGABEN = [
  {
    situation: 'Du misst den Aussendurchmesser eines Bolzens.',
    korrekt: 'Grosse Messschenkel nutzen',
    begruendung: 'Aussenmasse werden mit den grossen Messschenkeln sauber umfasst.',
  },
  {
    situation: 'Das Werkstueck ist verschmutzt oder hat Spaene an der Messstelle.',
    korrekt: 'Messflaechen reinigen',
    begruendung: 'Schmutz und Spaene koennen den Messwert verfaelschen.',
  },
  {
    situation: 'Der Messschieber sitzt schraeg am Teil.',
    korrekt: 'Gerade anlegen',
    begruendung: 'Verkanten fuehrt zu unsicheren Messwerten.',
  },
] as const;

const AUSSENMESSUNG_OPTIONEN = ['Grosse Messschenkel nutzen', 'Messflaechen reinigen', 'Gerade anlegen', 'Mit Kraft zudruecken'] as const;

const INNEN_TIEFEN_AUFGABEN = [
  { frage: 'Welche Messart nutzt du fuer eine Bohrung innen?', korrekt: 'Innenmessung' },
  { frage: 'Welche Messart nutzt du fuer die Tiefe einer Nut?', korrekt: 'Tiefenmessung' },
  { frage: 'Was ist bei der Tiefenmessung wichtig?', korrekt: 'Plan aufsetzen' },
] as const;

const INNEN_TIEFEN_OPTIONEN = ['Innenmessung', 'Tiefenmessung', 'Plan aufsetzen', 'Aussenmessung'] as const;

const MESSWERT_ABLESEN_AUFGABEN = [
  { frage: 'Was liest du zuerst?', korrekt: 'Hauptskala' },
  { frage: 'Was liest du danach fuer den Feinwert?', korrekt: 'Nonius' },
  { frage: 'Was vermeidest du beim Ablesen?', korrekt: 'Schraegblick' },
] as const;

const MESSWERT_ABLESEN_OPTIONEN = ['Hauptskala', 'Nonius', 'Schraegblick', 'Schaetzwert'] as const;

const BUEGELMESS_AUFGABEN = [
  {
    situation: 'Du brauchst eine feinere Aussenmessung als mit dem Messschieber.',
    korrekt: 'Buegelmessschraube waehlen',
    begruendung: 'Die Buegelmessschraube ist fuer feine Aussenmessungen vorgesehen, wenn Messbereich und Aufgabe passen.',
  },
  {
    situation: 'Du willst gleichmaessigen Messdruck erreichen.',
    korrekt: 'Ratsche nutzen',
    begruendung: 'Die Ratsche hilft, den Messdruck kontrolliert aufzubauen.',
  },
  {
    situation: 'Das Messmittel fuehlt sich schwergangig oder beschaedigt an.',
    korrekt: 'Nicht erzwingen',
    begruendung: 'Beschaedigte oder auffaellige Pruefmittel werden nach Vorgabe gemeldet.',
  },
] as const;

const BUEGELMESS_OPTIONEN = ['Buegelmessschraube waehlen', 'Ratsche nutzen', 'Nicht erzwingen', 'Mit Gewalt schliessen'] as const;

const MESSUHR_AUFGABEN = [
  {
    situation: 'Du pruefst, ob ein rundes Teil beim Drehen stark ausschlaegt.',
    korrekt: 'Messuhr ruhig antasten',
    begruendung: 'Die Messuhr zeigt Abweichungen nur verlaesslich, wenn der Aufbau fest und der Tastkontakt sauber ist.',
  },
  {
    situation: 'Der Zeiger springt beim Drehen unruhig.',
    korrekt: 'Aufbau pruefen',
    begruendung: 'Ein loser Aufbau, Schmutz oder falscher Tastpunkt kann die Anzeige unbrauchbar machen.',
  },
  {
    situation: 'Du sollst den Rundlauf beurteilen.',
    korrekt: 'Vorgabe vergleichen',
    begruendung: 'Die Anzeige allein reicht nicht; sie wird mit Zeichnung, Pruefplan oder Unterweisung verglichen.',
  },
] as const;

const MESSUHR_OPTIONEN = ['Messuhr ruhig antasten', 'Aufbau pruefen', 'Vorgabe vergleichen', 'Zeiger verbiegen'] as const;

const LEHREN_AUFGABEN = [
  { frage: 'Was liefert eine Grenzlehre meistens?', korrekt: 'Gut oder Ausschuss' },
  { frage: 'Welche Lehre prueft haeufig Bohrungen?', korrekt: 'Grenzlehrdorn' },
  { frage: 'Was machst du, wenn die Lehre nicht sauber angesetzt werden kann?', korrekt: 'Pruefstelle reinigen' },
] as const;

const LEHREN_OPTIONEN = ['Gut oder Ausschuss', 'Grenzlehrdorn', 'Pruefstelle reinigen', 'Messwert schaetzen'] as const;

const PRUEFMITTELPFLEGE_AUFGABEN = [
  {
    situation: 'Am Messschieber kleben Spaene und KSS-Reste.',
    korrekt: 'Reinigen',
    begruendung: 'Schmutz an Messflaechen kann Messwerte verfaelschen und das Pruefmittel beschaedigen.',
  },
  {
    situation: 'Eine Buegelmessschraube ist heruntergefallen.',
    korrekt: 'Melden',
    begruendung: 'Nach Sturz oder Auffaelligkeit wird nicht weitergemessen, bis die Vorgabe geklaert ist.',
  },
  {
    situation: 'Das Pruefmittel wird nach der Schicht nicht mehr gebraucht.',
    korrekt: 'Sicher lagern',
    begruendung: 'Saubere, trockene und geschuetzte Lagerung erhaelt die Verlaesslichkeit.',
  },
] as const;

const PRUEFMITTELPFLEGE_OPTIONEN = ['Reinigen', 'Melden', 'Sicher lagern', 'In die Spankiste legen'] as const;

const KALIBRIEREN_JUSTIEREN_EICHEN_AUFGABEN = [
  { frage: 'Welcher Begriff bedeutet: Abweichung feststellen und dokumentieren?', korrekt: 'Kalibrieren' },
  { frage: 'Welcher Begriff bedeutet: Messmittel einstellen oder abgleichen?', korrekt: 'Justieren' },
  { frage: 'Welcher Begriff ist eine amtliche Bestaetigung?', korrekt: 'Eichen' },
] as const;

const KALIBRIEREN_JUSTIEREN_EICHEN_OPTIONEN = ['Kalibrieren', 'Justieren', 'Eichen', 'Polieren'] as const;

const MESSUNSICHERHEIT_AUFGABEN = [
  { frage: 'Was bedeutet es, wenn Wiederholmessungen leicht streuen?', korrekt: 'Messunsicherheit beachten' },
  { frage: 'Was erhoeht die Unsicherheit oft?', korrekt: 'Schmutz und Schraegblick' },
  { frage: 'Was machst du bei einem Grenzfall?', korrekt: 'Nach Vorgabe absichern' },
] as const;

const MESSUNSICHERHEIT_OPTIONEN = ['Messunsicherheit beachten', 'Schmutz und Schraegblick', 'Nach Vorgabe absichern', 'Wert schoenrechnen'] as const;

const TEMPERATUR_BEIM_MESSEN_AUFGABEN = [
  {
    situation: 'Ein Werkstueck kommt warm direkt aus dem Prozess zur Messstelle.',
    korrekt: 'Temperatur beachten',
    begruendung: 'Temperatur kann Masse beeinflussen; kritische Messungen brauchen geeignete Bedingungen nach Vorgabe.',
  },
  {
    situation: 'Du misst ein Teil sofort nach starker Erwaermung und liegst knapp an der Grenze.',
    korrekt: 'Freigabe klaeren',
    begruendung: 'Grenznahe Ergebnisse werden nicht geraten, sondern nach Pruefplan oder Ausbildervorgabe abgesichert.',
  },
  {
    situation: 'Messmittel und Werkstueck lagen in sehr unterschiedlichen Bereichen.',
    korrekt: 'Anpasszeit beachten',
    begruendung: 'Unterschiedliche Temperaturen koennen Messung und Vergleich unsicher machen.',
  },
] as const;

const TEMPERATUR_BEIM_MESSEN_OPTIONEN = ['Temperatur beachten', 'Freigabe klaeren', 'Anpasszeit beachten', 'Heiss schneller messen'] as const;

const WERKSTOFFGRUPPEN_AUFGABEN = [
  { frage: 'Welche Gruppe enthaelt Stahl, Aluminium und Kupfer?', korrekt: 'Metalle' },
  { frage: 'Welche Gruppe enthaelt Thermoplaste, Duroplaste und Elastomere?', korrekt: 'Kunststoffe' },
  { frage: 'Was pruefst du zuerst bei unbekanntem Material?', korrekt: 'Materialangabe lesen' },
] as const;

const WERKSTOFFGRUPPEN_OPTIONEN = ['Metalle', 'Kunststoffe', 'Materialangabe lesen', 'Farbe raten'] as const;

const EISEN_STAHL_AUFGABEN = [
  { frage: 'Zu welcher Werkstofffamilie gehoert Stahl?', korrekt: 'Eisenwerkstoff' },
  { frage: 'Was kann Eigenschaften von Stahl veraendern?', korrekt: 'Legierung' },
  { frage: 'Welche Quelle brauchst du fuer eine konkrete Stahlsorte?', korrekt: 'Datenblatt oder Tabellenbuch' },
] as const;

const EISEN_STAHL_OPTIONEN = ['Eisenwerkstoff', 'Legierung', 'Datenblatt oder Tabellenbuch', 'Augenmass'] as const;

const GUSSEISEN_AUFGABEN = [
  { frage: 'Wie wird Gusseisen typischerweise in Form gebracht?', korrekt: 'Giessen' },
  { frage: 'Welcher Begriff ist bei Gusseisen wichtig?', korrekt: 'Graphit' },
  { frage: 'Was klaert die genaue Gusseisensorte?', korrekt: 'Werkstoffkennzeichnung' },
] as const;

const GUSSEISEN_OPTIONEN = ['Giessen', 'Graphit', 'Werkstoffkennzeichnung', 'Kupferdraht'] as const;

const NICHTEISENMETALLE_AUFGABEN = [
  { frage: 'Was bedeutet NE-Metall vereinfacht?', korrekt: 'Eisen nicht Hauptbestandteil' },
  { frage: 'Welches Material ist ein typisches NE-Metall?', korrekt: 'Aluminium' },
  { frage: 'Was pruefst du vor Bearbeitung eines NE-Metalls?', korrekt: 'Sorte und Vorgabe' },
] as const;

const NICHTEISENMETALLE_OPTIONEN = ['Eisen nicht Hauptbestandteil', 'Aluminium', 'Sorte und Vorgabe', 'Immer magnetisch'] as const;

const ALUMINIUM_AUFGABEN = [
  {
    situation: 'Ein leichtes Bauteil soll bearbeitet werden.',
    korrekt: 'Aluminium moeglich',
    begruendung: 'Aluminium ist ein typisches Leichtmetall, aber Sorte und Vorgabe muessen stimmen.',
  },
  {
    situation: 'Die Oberflaeche ist fuer die Funktion wichtig.',
    korrekt: 'Oxidschicht beachten',
    begruendung: 'Oberflaeche, Legierung und Behandlung koennen die Verarbeitung beeinflussen.',
  },
  {
    situation: 'Du kennst die genaue Legierung nicht.',
    korrekt: 'Datenblatt pruefen',
    begruendung: 'Konkrete Eigenschaften werden nicht geraten, sondern aus Kennzeichnung oder Datenblatt gelesen.',
  },
] as const;

const ALUMINIUM_OPTIONEN = ['Aluminium moeglich', 'Oxidschicht beachten', 'Datenblatt pruefen', 'Mit Stahl gleichsetzen'] as const;

const KUPFER_AUFGABEN = [
  {
    situation: 'Ein Bauteil soll Strom oder Waerme gut leiten.',
    korrekt: 'Kupfer in Betracht ziehen',
    begruendung: 'Kupfer ist fuer gute Leitfaehigkeit bekannt, aber Sorte und Einsatz muessen passen.',
  },
  {
    situation: 'Du sollst Kupfer von Stahl grob einordnen.',
    korrekt: 'NE-Metall erkennen',
    begruendung: 'Kupfer ist ein Nichteisenmetall und wird nicht wie Stahl eingeordnet.',
  },
  {
    situation: 'Die Zeichnung nennt eine konkrete Kupfersorte.',
    korrekt: 'Werkstoffangabe einhalten',
    begruendung: 'Die konkrete Werkstoffangabe ist verbindlicher als allgemeines Wissen ueber Kupfer.',
  },
] as const;

const KUPFER_OPTIONEN = ['Kupfer in Betracht ziehen', 'NE-Metall erkennen', 'Werkstoffangabe einhalten', 'Als Kunststoff behandeln'] as const;

const THERMOPLAST_AUFGABEN = [
  { frage: 'Was passiert mit vielen Thermoplasten bei geeigneter Waerme?', korrekt: 'Sie werden weich' },
  { frage: 'Welcher Zustand ist fuer Spritzgiessen wichtig?', korrekt: 'Schmelze' },
  { frage: 'Woher kommen konkrete Verarbeitungstemperaturen?', korrekt: 'Datenblatt oder Vorgabe' },
] as const;

const THERMOPLAST_OPTIONEN = ['Sie werden weich', 'Schmelze', 'Datenblatt oder Vorgabe', 'Immer vernetzen'] as const;

const DUROPLAST_AUFGABEN = [
  { frage: 'Welcher Begriff passt zu Duroplasten?', korrekt: 'Vernetzung' },
  { frage: 'Was unterscheidet sie grob von Thermoplasten?', korrekt: 'Nicht erneut schmelzfaehig' },
  { frage: 'Was pruefst du bei Duroplast-Bauteilen zuerst?', korrekt: 'Werkstoffangabe' },
] as const;

const DUROPLAST_OPTIONEN = ['Vernetzung', 'Nicht erneut schmelzfaehig', 'Werkstoffangabe', 'Schmelze einstellen'] as const;

const ELASTOMER_AUFGABEN = [
  { frage: 'Welche Eigenschaft steht bei Elastomeren im Vordergrund?', korrekt: 'Elastische Rueckstellung' },
  { frage: 'Was kann eine Ueberlastung verursachen?', korrekt: 'Bleibende Schaeden' },
  { frage: 'Welche Quelle klaert Einsatzgrenzen?', korrekt: 'Datenblatt oder Vorgabe' },
] as const;

const ELASTOMER_OPTIONEN = ['Elastische Rueckstellung', 'Bleibende Schaeden', 'Datenblatt oder Vorgabe', 'Stahlhaerte'] as const;

const ADDITIVE_MASTERBATCH_AUFGABEN = [
  {
    situation: 'Granulat soll eine bestimmte Farbe bekommen.',
    korrekt: 'Masterbatch nach Vorgabe',
    begruendung: 'Masterbatch wird nach Vorgabe dosiert und dokumentiert, nicht nach Gefuehl.',
  },
  {
    situation: 'Ein Zusatzstoff soll eine Eigenschaft beeinflussen.',
    korrekt: 'Additiv pruefen',
    begruendung: 'Additive koennen Eigenschaften beeinflussen; Sorte und Menge gehoeren in Datenblatt oder Auftrag.',
  },
  {
    situation: 'Du bist unsicher, ob ein Zusatz freigegeben ist.',
    korrekt: 'Freigabe klaeren',
    begruendung: 'Nicht freigegebene Zusatzstoffe koennen Qualitaet und Rueckverfolgbarkeit gefaehrden.',
  },
] as const;

const ADDITIVE_MASTERBATCH_OPTIONEN = ['Masterbatch nach Vorgabe', 'Additiv pruefen', 'Freigabe klaeren', 'Handvoll zugeben'] as const;

const GRANULAT_CHARGE_REZYKLAT_AUFGABEN = [
  {
    situation: 'Du oeffnest einen neuen Materialsack.',
    korrekt: 'Etikett und Charge pruefen',
    begruendung: 'Material und Charge muessen zum Auftrag passen und rueckverfolgbar bleiben.',
  },
  {
    situation: 'Rezyklat soll beigemischt werden.',
    korrekt: 'Freigabe und Vorgabe pruefen',
    begruendung: 'Rezyklatanteile und Einsatzregeln duerfen nicht geraten werden.',
  },
  {
    situation: 'Zwei Chargen stehen gleichzeitig am Arbeitsplatz.',
    korrekt: 'Verwechslung vermeiden',
    begruendung: 'Klare Trennung und Dokumentation sichern die Rueckverfolgbarkeit.',
  },
] as const;

const GRANULAT_CHARGE_REZYKLAT_OPTIONEN = ['Etikett und Charge pruefen', 'Freigabe und Vorgabe pruefen', 'Verwechslung vermeiden', 'Etikett wegwerfen'] as const;

const HAERTE_AUFGABEN = [
  { frage: 'Was beschreibt Haerte vereinfacht?', korrekt: 'Widerstand gegen Eindringen' },
  { frage: 'Woher kommen konkrete Haertewerte?', korrekt: 'Pruefanweisung lesen' },
  { frage: 'Was ist bei Haertepruefung wichtig?', korrekt: 'Oberflaeche beachten' },
] as const;

const HAERTE_OPTIONEN = ['Widerstand gegen Eindringen', 'Pruefanweisung lesen', 'Oberflaeche beachten', 'Farbe beurteilen'] as const;

const FESTIGKEIT_AUFGABEN = [
  { frage: 'Was meint Festigkeit im Grundgedanken?', korrekt: 'Belastung aufnehmen' },
  { frage: 'Was ist bei konkreten Festigkeitswerten sicher?', korrekt: 'Datenblatt pruefen' },
  { frage: 'Woran denkst du bei Ueberlastung?', korrekt: 'Bruchrisiko erkennen' },
] as const;

const FESTIGKEIT_OPTIONEN = ['Belastung aufnehmen', 'Datenblatt pruefen', 'Bruchrisiko erkennen', 'Gewicht erraten'] as const;

const ZAEHIGKEIT_SPROEDIGKEIT_AUFGABEN = [
  { frage: 'Wie verhaelt sich ein zaeher Werkstoff eher?', korrekt: 'Er verformt sich' },
  { frage: 'Was passt zu sproedem Verhalten?', korrekt: 'Er bricht scharf' },
  { frage: 'Was klaert Bruchverhalten fachlich?', korrekt: 'Werkstoffangabe pruefen' },
] as const;

const ZAEHIGKEIT_SPROEDIGKEIT_OPTIONEN = ['Er verformt sich', 'Er bricht scharf', 'Werkstoffangabe pruefen', 'Immer gleich behandeln'] as const;

const ELASTISCH_PLASTISCH_AUFGABEN = [
  { frage: 'Was bedeutet elastische Verformung vereinfacht?', korrekt: 'Geht zurueck' },
  { frage: 'Was bedeutet plastische Verformung?', korrekt: 'Bleibt veraendert' },
  { frage: 'Was pruefst du bei bleibender Verformung?', korrekt: 'Freigabe klaeren' },
] as const;

const ELASTISCH_PLASTISCH_OPTIONEN = ['Geht zurueck', 'Bleibt veraendert', 'Freigabe klaeren', 'Wert ignorieren'] as const;

const DICHTE_VERGLEICH_AUFGABEN = [
  { frage: 'Was verbindet Dichte?', korrekt: 'Masse und Volumen' },
  { frage: 'Was kann bei gleicher Bauteilgroesse unterschiedlich sein?', korrekt: 'Gewicht abschaetzen' },
  { frage: 'Was brauchst du fuer Rechenwerte?', korrekt: 'Tabellenbuch nutzen' },
] as const;

const DICHTE_VERGLEICH_OPTIONEN = ['Masse und Volumen', 'Gewicht abschaetzen', 'Tabellenbuch nutzen', 'Farbe vergleichen'] as const;

const WAERMEAUSDEHNUNG_AUFGABEN = [
  { situation: 'Ein langes Metallteil wurde gerade warm bearbeitet.', korrekt: 'Temperatur beachten', begruendung: 'Waerme kann Laenge und Messentscheidung beeinflussen.' },
  { situation: 'In einer Rechenaufgabe wird ein Ausdehnungswert gebraucht.', korrekt: 'Tabellenbuchwert verwenden', begruendung: 'Ausdehnungskoeffizienten werden nicht geraten.' },
  { situation: 'Ein Spielmass ist bei Temperaturwechsel kritisch.', korrekt: 'Vorgabe pruefen', begruendung: 'Spiel, Werkstoff und Temperatur muessen zusammen beurteilt werden.' },
] as const;

const WAERMEAUSDEHNUNG_OPTIONEN = ['Temperatur beachten', 'Tabellenbuchwert verwenden', 'Vorgabe pruefen', 'Kaltmass ignorieren'] as const;

const KORROSION_AUFGABEN = [
  { situation: 'Du siehst Rost oder angegriffene Oberflaeche an einem Bauteil.', korrekt: 'Auffaelligkeit melden', begruendung: 'Korrosion kann Funktion, Masshaltigkeit oder Sicherheit beeinflussen.' },
  { situation: 'Ein Teil braucht Korrosionsschutz.', korrekt: 'Schutzvorgabe lesen', begruendung: 'Schutzart und Behandlung richten sich nach Vorgabe.' },
  { situation: 'Du erkennst Feuchtigkeit an gelagertem Material.', korrekt: 'Lagerzustand pruefen', begruendung: 'Umgebung und Lagerung koennen Korrosion beguenstigen.' },
] as const;

const KORROSION_OPTIONEN = ['Auffaelligkeit melden', 'Schutzvorgabe lesen', 'Lagerzustand pruefen', 'Rost ueberstreichen'] as const;

const WERKSTOFFAUSWAHL_AUFGABEN = [
  { situation: 'Ein Bauteil soll hohe Belastung aufnehmen.', korrekt: 'Anforderung abgleichen', begruendung: 'Belastung ist ein Auswahlkriterium, aber erst Vorgabe und Werkstoffdaten machen die Entscheidung belastbar.' },
  { situation: 'Das Gewicht ist fuer die Baugruppe wichtig.', korrekt: 'Dichte beruecksichtigen', begruendung: 'Dichte beeinflusst die Masse bei gleichem Volumen.' },
  { situation: 'Du willst wegen besserer Bearbeitbarkeit anderes Material nehmen.', korrekt: 'Freigabe einholen', begruendung: 'Werkstoffaenderungen duerfen nicht eigenmaechtig erfolgen.' },
] as const;

const WERKSTOFFAUSWAHL_OPTIONEN = ['Anforderung abgleichen', 'Dichte beruecksichtigen', 'Freigabe einholen', 'Material frei tauschen'] as const;

const WELLE_ACHSE_AUFGABEN = [
  { frage: 'Was ist die Grundfunktion einer Welle?', korrekt: 'Drehmoment uebertragen' },
  { frage: 'Was ist die Grundfunktion einer Achse?', korrekt: 'Drehteil tragen' },
  { frage: 'Woher kommt die genaue Ausfuehrung?', korrekt: 'Zeichnung pruefen' },
] as const;

const WELLE_ACHSE_OPTIONEN = ['Drehmoment uebertragen', 'Drehteil tragen', 'Zeichnung pruefen', 'Farbe vergleichen'] as const;

const LAGERARTEN_AUFGABEN = [
  { frage: 'Welche Aufgabe haben Lager grundsaetzlich?', korrekt: 'Fuehren und stuetzen' },
  { frage: 'Was verringern Lager im Betrieb?', korrekt: 'Reibung beachten' },
  { frage: 'Was klaert die passende Lagerart?', korrekt: 'Bauart aus Vorgabe' },
] as const;

const LAGERARTEN_OPTIONEN = ['Fuehren und stuetzen', 'Reibung beachten', 'Bauart aus Vorgabe', 'Lager werfen'] as const;

const GLEITLAGER_AUFGABEN = [
  { situation: 'Eine Welle laeuft in einer Buchse.', korrekt: 'Gleitprinzip erkennen', begruendung: 'Beim Gleitlager gleiten Flaechen aufeinander.' },
  { situation: 'Das Lager soll trocken weiterlaufen, obwohl Schmierung vorgesehen ist.', korrekt: 'Schmierung pruefen', begruendung: 'Fehlende Schmierung kann Verschleiss und Schaeden verursachen.' },
  { situation: 'Schmutz ist im Lagerbereich sichtbar.', korrekt: 'Sauberkeit herstellen', begruendung: 'Schmutz kann den Schmierfilm und die Lagerflaechen schaedigen.' },
] as const;

const GLEITLAGER_OPTIONEN = ['Gleitprinzip erkennen', 'Schmierung pruefen', 'Sauberkeit herstellen', 'Trocken weiterfahren'] as const;

const WAELZLAGER_AUFGABEN = [
  { frage: 'Was befindet sich im Waelzlager zwischen den Ringen?', korrekt: 'Waelzkoerper erkennen' },
  { frage: 'Welche Beispiele passen zu Waelzkoerpern?', korrekt: 'Kugel oder Rolle' },
  { frage: 'Was ist bei Montage und Belastung sicher?', korrekt: 'Vorgabe beachten' },
] as const;

const WAELZLAGER_OPTIONEN = ['Waelzkoerper erkennen', 'Kugel oder Rolle', 'Vorgabe beachten', 'Mit Hammer eintreiben'] as const;

const KUPPLUNG_AUFGABEN = [
  { situation: 'Zwei Wellen sollen Bewegung uebertragen.', korrekt: 'Kupplung einordnen', begruendung: 'Kupplungen verbinden Wellen und uebertragen Drehmoment.' },
  { situation: 'Eine Kupplung laeuft sichtbar versetzt.', korrekt: 'Ausrichtung melden', begruendung: 'Fehlausrichtung kann Lager, Kupplung und Maschine belasten.' },
  { situation: 'Ein Schutz an der Kupplung fehlt.', korrekt: 'Schutz pruefen', begruendung: 'Drehende Kupplungen gehoeren zu Gefahrbereichen.' },
] as const;

const KUPPLUNG_OPTIONEN = ['Kupplung einordnen', 'Ausrichtung melden', 'Schutz pruefen', 'Offen greifen'] as const;

const ZAHNRADGETRIEBE_AUFGABEN = [
  { frage: 'Wie greifen Zahnraeder ineinander?', korrekt: 'Formschluss erkennen' },
  { frage: 'Was kann ein Zahnradpaar veraendern?', korrekt: 'Uebersetzung ableiten' },
  { frage: 'Woher kommen konkrete Zaehnezahlen und Verhaeltnisse?', korrekt: 'Tabellenbuch nutzen' },
] as const;

const ZAHNRADGETRIEBE_OPTIONEN = ['Formschluss erkennen', 'Uebersetzung ableiten', 'Tabellenbuch nutzen', 'Zaehne abschaetzen'] as const;

const RIEMENANTRIEB_AUFGABEN = [
  { frage: 'Welches Grundprinzip passt zum Riemenantrieb?', korrekt: 'Kraftschluss verstehen' },
  { frage: 'Was ist fuer den Riemenbetrieb wichtig?', korrekt: 'Riemenspannung pruefen' },
  { frage: 'Was tust du bei beschaedigtem Riemen?', korrekt: 'Melden und sichern' },
] as const;

const RIEMENANTRIEB_OPTIONEN = ['Kraftschluss verstehen', 'Riemenspannung pruefen', 'Melden und sichern', 'Riemen anfassen'] as const;

const KETTENANTRIEB_AUFGABEN = [
  { frage: 'Welches Grundprinzip passt zum Kettenantrieb?', korrekt: 'Formschluss verstehen' },
  { frage: 'Was greift am Kettenrad?', korrekt: 'Kettenglied erkennen' },
  { frage: 'Was ist fuer den Betrieb wichtig?', korrekt: 'Schmierung und Spannung' },
] as const;

const KETTENANTRIEB_OPTIONEN = ['Formschluss verstehen', 'Kettenglied erkennen', 'Schmierung und Spannung', 'Kette im Lauf richten'] as const;

const SCHRAUBEN_MUTTERN_AUFGABEN = [
  { frage: 'Welche Verbindung bilden Schrauben und Muttern meist?', korrekt: 'Loesbare Verbindung' },
  { frage: 'Was bestimmt Gewinde, Laenge und Anzug?', korrekt: 'Zeichnung und Vorgabe' },
  { frage: 'Was ist bei Sicherungselementen wichtig?', korrekt: 'Sicherung beachten' },
] as const;

const SCHRAUBEN_MUTTERN_OPTIONEN = ['Loesbare Verbindung', 'Zeichnung und Vorgabe', 'Sicherung beachten', 'Nach Gefuehl anziehen'] as const;

const FEDERN_DAEMPFER_AUFGABEN = [
  { frage: 'Welche Grundfunktion hat eine Feder?', korrekt: 'Rueckstellung erzeugen' },
  { frage: 'Welche Grundfunktion hat ein Daempfer?', korrekt: 'Bewegung bremsen' },
  { frage: 'Was ist bei auffaelligem Federweg oder Daempfer wichtig?', korrekt: 'Zustand melden' },
] as const;

const FEDERN_DAEMPFER_OPTIONEN = ['Rueckstellung erzeugen', 'Bewegung bremsen', 'Zustand melden', 'Daempfer ausbauen'] as const;

const FERTIGUNG_HAUPTGRUPPEN_AUFGABEN = [
  { frage: 'Welche Hauptgruppe erzeugt eine Form aus formlosem Stoff?', korrekt: 'Urformen erkennen' },
  { frage: 'Welche Hauptgruppe veraendert eine vorhandene Form ohne Spanabtrag?', korrekt: 'Umformen zuordnen' },
  { frage: 'Welche Hauptgruppe passt zu Bohren, Saegen oder Drehen?', korrekt: 'Trennen einordnen' },
] as const;

const FERTIGUNG_HAUPTGRUPPEN_OPTIONEN = ['Urformen erkennen', 'Umformen zuordnen', 'Trennen einordnen', 'Nach Farbe sortieren'] as const;

const SPANEND_SPANLOS_AUFGABEN = [
  { frage: 'Woran erkennst du spanende Fertigung?', korrekt: 'Span entsteht' },
  { frage: 'Was passt zu spanloser Fertigung?', korrekt: 'Form ohne Span aendern' },
  { frage: 'Was klaert ein unbekanntes Verfahren sicher?', korrekt: 'Verfahrensangabe lesen' },
] as const;

const SPANEND_SPANLOS_OPTIONEN = ['Span entsteht', 'Form ohne Span aendern', 'Verfahrensangabe lesen', 'Spaene ignorieren'] as const;

const SCHNITT_VORSCHUB_AUFGABEN = [
  { frage: 'Welche Bewegung erzeugt beim Zerspanen die Schnittwirkung?', korrekt: 'Schnittbewegung erkennen' },
  { frage: 'Welche Bewegung fuehrt Werkzeug oder Werkstueck weiter?', korrekt: 'Vorschubrichtung zuordnen' },
  { frage: 'Welche Groesse legt die Eingriffstiefe fest?', korrekt: 'Zustellung beachten' },
] as const;

const SCHNITT_VORSCHUB_OPTIONEN = ['Schnittbewegung erkennen', 'Vorschubrichtung zuordnen', 'Zustellung beachten', 'Werkzeugfarbe waehlen'] as const;

const SCHNITTGESCHWINDIGKEIT_AUFGABEN = [
  { frage: 'Was beschreibt vc am drehenden Werkstueck?', korrekt: 'Umfangsgeschwindigkeit' },
  { frage: 'Welche Groessen gehoeren zur Grundformel?', korrekt: 'Durchmesser und Drehzahl' },
  { frage: 'Woher kommt ein konkreter vc-Wert?', korrekt: 'Tabellenbuch nutzen' },
] as const;

const SCHNITTGESCHWINDIGKEIT_OPTIONEN = ['Umfangsgeschwindigkeit', 'Durchmesser und Drehzahl', 'Tabellenbuch nutzen', 'Wert raten'] as const;

const DREHZAHL_BERECHNEN_AUFGABEN = [
  { frage: 'Welche Groesse wird mit n bezeichnet?', korrekt: 'Drehzahl erkennen' },
  { frage: 'Was muss vor dem Einsetzen in die Formel stimmen?', korrekt: 'Einheiten pruefen' },
  { frage: 'Was tust du bei fehlendem Tabellenwert?', korrekt: 'Quelle klaeren' },
] as const;

const DREHZAHL_BERECHNEN_OPTIONEN = ['Drehzahl erkennen', 'Einheiten pruefen', 'Quelle klaeren', 'Maximal stellen'] as const;

const VORSCHUB_ZUSTELLUNG_AUFGABEN = [
  { frage: 'Was beeinflusst die Strecke je Umdrehung oder Hub?', korrekt: 'Vorschub einordnen' },
  { frage: 'Was beeinflusst die Eingriffstiefe?', korrekt: 'Zustellung einordnen' },
  { frage: 'Was kann sich bei zu hoher Belastung veraendern?', korrekt: 'Span und Oberflaeche' },
] as const;

const VORSCHUB_ZUSTELLUNG_OPTIONEN = ['Vorschub einordnen', 'Zustellung einordnen', 'Span und Oberflaeche', 'Hebel festhalten'] as const;

const WERKZEUGVERSCHLEISS_AUFGABEN = [
  { situation: 'Die Schneide wirkt stumpf und die Oberflaeche wird schlechter.', korrekt: 'Verschleiss melden', begruendung: 'Werkzeugverschleiss kann Mass, Oberflaeche und Prozesssicherheit beeinflussen.' },
  { situation: 'Eine Standzeit ist im Arbeitsplan oder Werkzeugdatenblatt angegeben.', korrekt: 'Standzeit beachten', begruendung: 'Standzeit ist ein Vorgabewert und wird nicht nach Gefuehl verlaengert.' },
  { situation: 'Geraeusch und Spaene veraendern sich deutlich.', korrekt: 'Prozess pruefen', begruendung: 'Auffaellige Prozesszeichen muessen bewertet und gemeldet werden.' },
] as const;

const WERKZEUGVERSCHLEISS_OPTIONEN = ['Verschleiss melden', 'Standzeit beachten', 'Prozess pruefen', 'Weiterdruecken'] as const;

const KUEHLSCHMIERSTOFF_FERTIGUNG_AUFGABEN = [
  { frage: 'Welche Aufgabe kann KSS an der Schnittzone haben?', korrekt: 'Kuehlen und schmieren' },
  { frage: 'Was hilft beim Abtransport aus der Schnittzone?', korrekt: 'Spaene wegspuelen' },
  { frage: 'Was ist bei KSS immer mitzudenken?', korrekt: 'Hautschutz beachten' },
] as const;

const KUEHLSCHMIERSTOFF_FERTIGUNG_OPTIONEN = ['Kuehlen und schmieren', 'Spaene wegspuelen', 'Hautschutz beachten', 'Mit Hand pruefen'] as const;

const WERKZEUGDATEN_AUFGABEN = [
  { frage: 'Welche Informationen brauchst du fuer Werkzeugdaten?', korrekt: 'Werkzeug und Werkstoff' },
  { frage: 'Wo pruefst du Schnittwerte oder Vorschubwerte?', korrekt: 'Freigegebene Tabelle' },
  { frage: 'Was machst du bei widerspruechlichen Angaben?', korrekt: 'Rueckfrage stellen' },
] as const;

const WERKZEUGDATEN_OPTIONEN = ['Werkzeug und Werkstoff', 'Freigegebene Tabelle', 'Rueckfrage stellen', 'Aus Erinnerung nehmen'] as const;

const BEARBEITUNGSZEIT_AUFGABEN = [
  { frage: 'Welche Grundidee steckt hinter t = s / v?', korrekt: 'Weg durch Geschwindigkeit' },
  { frage: 'Was gehoert nicht automatisch zur reinen Bearbeitungszeit?', korrekt: 'Ruestzeit separat planen' },
  { frage: 'Warum ist eine grobe Zeitplanung nuetzlich?', korrekt: 'Ablauf abschaetzen' },
] as const;

const BEARBEITUNGSZEIT_OPTIONEN = ['Weg durch Geschwindigkeit', 'Ruestzeit separat planen', 'Ablauf abschaetzen', 'Pause einrechnen'] as const;

const SAEGE_AUFGABEN = [
  { frage: 'Welche Hauptwirkung hat Saegen?', korrekt: 'Werkstoff trennen' },
  { frage: 'Was muss beim Saegen sicher gehalten werden?', korrekt: 'Werkstueck spannen' },
  { frage: 'Was entsteht im Schnittspalt?', korrekt: 'Spaene beachten' },
] as const;

const SAEGE_OPTIONEN = ['Werkstoff trennen', 'Werkstueck spannen', 'Spaene beachten', 'Mit Hand fuehren'] as const;

const BOHREN_AUFGABEN = [
  { frage: 'Was erzeugt Bohren im Werkstueck?', korrekt: 'Bohrung herstellen' },
  { frage: 'Welche Bewegungen gehoeren zum Bohren?', korrekt: 'Drehung und Vorschub' },
  { frage: 'Woher kommen Drehzahl und Vorschub?', korrekt: 'Tabellenwert pruefen' },
] as const;

const BOHREN_OPTIONEN = ['Bohrung herstellen', 'Drehung und Vorschub', 'Tabellenwert pruefen', 'Bohrer frei halten'] as const;

const SENKEN_REIBEN_AUFGABEN = [
  { frage: 'Was macht Senken an einer Bohrung?', korrekt: 'Kante oder Sitz formen' },
  { frage: 'Was ist ein Ziel beim Reiben?', korrekt: 'Mass und Oberflaeche' },
  { frage: 'Was pruefst du nach der Nacharbeit?', korrekt: 'Bohrungsqualitaet pruefen' },
] as const;

const SENKEN_REIBEN_OPTIONEN = ['Kante oder Sitz formen', 'Mass und Oberflaeche', 'Bohrungsqualitaet pruefen', 'Loch grob aufreissen'] as const;

const GEWINDESCHNEIDEN_AUFGABEN = [
  { frage: 'Was braucht ein Innengewinde vor dem Schneiden?', korrekt: 'Kernloch herstellen' },
  { frage: 'Was wird beim Gewindeschneiden erzeugt?', korrekt: 'Gewindeprofil schneiden' },
  { frage: 'Was hilft gegen Werkzeugbruch?', korrekt: 'Span brechen' },
] as const;

const GEWINDESCHNEIDEN_OPTIONEN = ['Kernloch herstellen', 'Gewindeprofil schneiden', 'Span brechen', 'Trocken erzwingen'] as const;

const DREHEN_GRUNDLAGEN_AUFGABEN = [
  { frage: 'Was rotiert beim klassischen Drehen meist?', korrekt: 'Werkstueck rotiert' },
  { frage: 'Welches Werkzeug schneidet beim Drehen?', korrekt: 'Drehmeissel einsetzen' },
  { frage: 'Woher kommen konkrete Schnittwerte?', korrekt: 'Werkzeugdaten nutzen' },
] as const;

const DREHEN_GRUNDLAGEN_OPTIONEN = ['Werkstueck rotiert', 'Drehmeissel einsetzen', 'Werkzeugdaten nutzen', 'Futter offen lassen'] as const;

const LAENGS_PLAN_DREHEN_AUFGABEN = [
  { frage: 'Welche Flaeche bearbeitet Laengsdrehen?', korrekt: 'Mantelflaeche bearbeiten' },
  { frage: 'Welche Flaeche bearbeitet Plandrehen?', korrekt: 'Stirnflaeche bearbeiten' },
  { frage: 'Was entscheidet die passende Drehoperation?', korrekt: 'Zeichnung lesen' },
] as const;

const LAENGS_PLAN_DREHEN_OPTIONEN = ['Mantelflaeche bearbeiten', 'Stirnflaeche bearbeiten', 'Zeichnung lesen', 'Richtung raten'] as const;

const FRAESEN_GRUNDLAGEN_AUFGABEN = [
  { frage: 'Was rotiert beim Fraesen?', korrekt: 'Fraeser rotiert' },
  { frage: 'Welche Bewegung fuehrt das Werkstueck weiter?', korrekt: 'Tischvorschub beachten' },
  { frage: 'Warum ist Fraesen oft mehrschneidig?', korrekt: 'Mehrere Schneiden greifen' },
] as const;

const FRAESEN_GRUNDLAGEN_OPTIONEN = ['Fraeser rotiert', 'Tischvorschub beachten', 'Mehrere Schneiden greifen', 'Spane wegblasen'] as const;

const UMFANG_STIRN_FRAESEN_AUFGABEN = [
  { frage: 'Welche Werkzeugzone arbeitet beim Umfangsfraesen?', korrekt: 'Umfang schneidet' },
  { frage: 'Welche Werkzeugzone steht beim Stirnfraesen im Vordergrund?', korrekt: 'Stirnseite schneidet' },
  { frage: 'Was vergleichst du zur Auswahl?', korrekt: 'Flaechenziel pruefen' },
] as const;

const UMFANG_STIRN_FRAESEN_OPTIONEN = ['Umfang schneidet', 'Stirnseite schneidet', 'Flaechenziel pruefen', 'Gleich behandeln'] as const;

const SCHLEIFEN_AUFGABEN = [
  { frage: 'Womit trennt die Schleifscheibe Material?', korrekt: 'Koerner schneiden' },
  { frage: 'Was ist beim Schleifen besonders zu beachten?', korrekt: 'Waerme und Schutz' },
  { frage: 'Was pruefst du am Schleifwerkzeug?', korrekt: 'Scheibenzustand pruefen' },
] as const;

const SCHLEIFEN_OPTIONEN = ['Koerner schneiden', 'Waerme und Schutz', 'Scheibenzustand pruefen', 'Ohne Schutzscheibe'] as const;

const STANZEN_SCHNEIDEN_AUFGABEN = [
  { frage: 'Welche Werkzeugteile gehoeren zum Stanzen?', korrekt: 'Stempel und Matrize' },
  { frage: 'Was kann an der Schnittkante entstehen?', korrekt: 'Grat erkennen' },
  { frage: 'Was ist im Werkzeugbereich wichtig?', korrekt: 'Schutzbereich meiden' },
] as const;

const STANZEN_SCHNEIDEN_OPTIONEN = ['Stempel und Matrize', 'Grat erkennen', 'Schutzbereich meiden', 'Blech festhalten'] as const;

const BIEGEN_AUFGABEN = [
  { frage: 'Welche Fertigungshauptgruppe passt zum Biegen?', korrekt: 'Umformen erkennen' },
  { frage: 'Was ist am Biegeteil zu beachten?', korrekt: 'Biegeradius pruefen' },
  { frage: 'Was kann nach dem Biegen auftreten?', korrekt: 'Rueckfederung beachten' },
] as const;

const BIEGEN_OPTIONEN = ['Umformen erkennen', 'Biegeradius pruefen', 'Rueckfederung beachten', 'Winkel ignorieren'] as const;

const WALZEN_AUFGABEN = [
  { frage: 'Was veraendert der Walzspalt?', korrekt: 'Dicke veraendern' },
  { frage: 'Welche Hauptgruppe passt zum Walzen?', korrekt: 'Umformen zuordnen' },
  { frage: 'Was wird nach dem Walzen geprueft?', korrekt: 'Dicke und Oberflaeche' },
] as const;

const WALZEN_OPTIONEN = ['Dicke veraendern', 'Umformen zuordnen', 'Dicke und Oberflaeche', 'Walzen anfassen'] as const;

const TIEFZIEHEN_AUFGABEN = [
  { frage: 'Was entsteht beim Tiefziehen haeufig?', korrekt: 'Hohlkoerper formen' },
  { frage: 'Was fuehrt das Blech im Werkzeug?', korrekt: 'Niederhalter beachten' },
  { frage: 'Welche Fehler koennen auftreten?', korrekt: 'Falten und Risse' },
] as const;

const TIEFZIEHEN_OPTIONEN = ['Hohlkoerper formen', 'Niederhalter beachten', 'Falten und Risse', 'Blech knicken'] as const;

const PRESSEN_AUFGABEN = [
  { frage: 'Welche Groesse wirkt beim Pressen auf die Flaeche?', korrekt: 'Presskraft beachten' },
  { frage: 'Welche Grundformel beschreibt Druck?', korrekt: 'p = F / A' },
  { frage: 'Was ist vor Eingriff in den Pressraum wichtig?', korrekt: 'Schutzfreigabe pruefen' },
] as const;

const PRESSEN_OPTIONEN = ['Presskraft beachten', 'p = F / A', 'Schutzfreigabe pruefen', 'Hand einlegen'] as const;

const SCHMIEDEN_AUFGABEN = [
  { frage: 'Welche Hauptgruppe passt zum Schmieden?', korrekt: 'Umformen erkennen' },
  { frage: 'Was wird beim Schmieden oft eingesetzt?', korrekt: 'Waerme beachten' },
  { frage: 'Was veraendert sich am Rohling?', korrekt: 'Form und Gefuege' },
] as const;

const SCHMIEDEN_OPTIONEN = ['Umformen erkennen', 'Waerme beachten', 'Form und Gefuege', 'Kalt anfassen'] as const;

const GIESSEN_AUFGABEN = [
  { frage: 'Welche Hauptgruppe passt zum Giessen?', korrekt: 'Urformen erkennen' },
  { frage: 'Was fuellt beim Giessen die Form?', korrekt: 'Schmelze fliesst' },
  { frage: 'Wozu kann ein Speiser dienen?', korrekt: 'Nachspeisen ermoeglichen' },
] as const;

const GIESSEN_OPTIONEN = ['Urformen erkennen', 'Schmelze fliesst', 'Nachspeisen ermoeglichen', 'Form schuetteln'] as const;

const SCHWEISSEN_AUFGABEN = [
  { frage: 'Welche Hauptgruppe passt zum Schweissen?', korrekt: 'Fuegen erkennen' },
  { frage: 'Was entsteht zwischen den Bauteilen?', korrekt: 'Schweissnaht beurteilen' },
  { frage: 'Was ist wegen Waerme und Lichtbogen wichtig?', korrekt: 'PSA verwenden' },
] as const;

const SCHWEISSEN_OPTIONEN = ['Fuegen erkennen', 'Schweissnaht beurteilen', 'PSA verwenden', 'Ohne Schutz schauen'] as const;

const LOETEN_AUFGABEN = [
  { frage: 'Welcher Werkstoff verbindet beim Loeten?', korrekt: 'Lot verwenden' },
  { frage: 'Was muss das Lot an der Oberflaeche tun?', korrekt: 'Benetzung erreichen' },
  { frage: 'Was ist beim Fuegespalt wichtig?', korrekt: 'Spalt sauber halten' },
] as const;

const LOETEN_OPTIONEN = ['Lot verwenden', 'Benetzung erreichen', 'Spalt sauber halten', 'Lot aufhaeufen'] as const;

const KLEBEN_AUFGABEN = [
  { frage: 'Was ist vor dem Kleben wichtig?', korrekt: 'Oberflaeche vorbereiten' },
  { frage: 'Woher kommen Verarbeitungszeit und Sicherheit?', korrekt: 'Datenblatt lesen' },
  { frage: 'Was braucht die Klebschicht nach dem Fuegen?', korrekt: 'Ausharten lassen' },
] as const;

const KLEBEN_OPTIONEN = ['Oberflaeche vorbereiten', 'Datenblatt lesen', 'Ausharten lassen', 'Flaeche anfetten'] as const;

const SCHRAUBEN_NIETEN_AUFGABEN = [
  { frage: 'Welche Verbindung ist meist loesbar?', korrekt: 'Schraube einordnen' },
  { frage: 'Welche Verbindung ist meist dauerhaft?', korrekt: 'Niet einordnen' },
  { frage: 'Was wird bei Schrauben nach Vorgabe eingestellt?', korrekt: 'Drehmoment beachten' },
] as const;

const SCHRAUBEN_NIETEN_OPTIONEN = ['Schraube einordnen', 'Niet einordnen', 'Drehmoment beachten', 'Niet wieder aufdrehen'] as const;

const STANDARD_GLOSSAR: Record<string, FachbegriffInfo> = {
  Messschieber: {
    fachdefinition: 'Mechanisches Pruefmittel fuer direkte Laengenmessungen an Werkstuecken.',
    einfach: 'Ein genauer Schieber zum Messen von aussen, innen und in der Tiefe.',
    bezug: 'Im Slice wird er genutzt, um ein Aussenmass am Bolzen zu pruefen.',
  },
  Aussenmessung: {
    fachdefinition: 'Messung eines aeusseren Masses, zum Beispiel Durchmesser, Breite oder Dicke.',
    einfach: 'Du misst die Aussenseite eines Werkstuecks.',
    bezug: 'Die grossen Messschenkel liegen aussen am Werkstueck an.',
  },
  Innenmessung: {
    fachdefinition: 'Messung eines inneren Masses, zum Beispiel Bohrung, Nut oder Innenbreite.',
    einfach: 'Du misst, wie gross etwas innen ist.',
    bezug: 'Dafuer werden die kleineren Innenmessschenkel vorsichtig gespreizt.',
  },
  Tiefenmessung: {
    fachdefinition: 'Messung einer Tiefe mit der Tiefenstange des Messschiebers.',
    einfach: 'Du misst, wie tief eine Nut oder Bohrung ist.',
    bezug: 'Die Auflageflaeche muss plan sitzen, sonst wird der Wert falsch.',
  },
  Hauptskala: {
    fachdefinition: 'Feste Skala am Messschieber, auf der der ganze Millimeterwert abgelesen wird.',
    einfach: 'Das ist die lange Skala wie bei einem Lineal.',
    bezug: 'Erst Hauptskala lesen, danach den Nonius zur Feinablesung nutzen.',
  },
  Nonius: {
    fachdefinition: 'Hilfsskala am beweglichen Schieber fuer die feinere Ablesung zwischen Hauptskalenstrichen.',
    einfach: 'Der Nonius zeigt den kleinen Nachkommanteil des Messwerts.',
    bezug: 'Im Trainer wird er als beweglicher Teil des Messschiebers dargestellt.',
  },
  Nennmass: {
    fachdefinition: 'Sollmass aus der Zeichnung, von dem Abmasse und Grenzmasse abgeleitet werden.',
    einfach: 'Das Mass, das eigentlich erreicht werden soll.',
    bezug: 'Im Beispiel ist es die Mitte der Toleranzaufgabe.',
  },
  Toleranz: {
    fachdefinition: 'Zulaessige Abweichung zwischen unterem und oberem Grenzmass.',
    einfach: 'Der Bereich, in dem ein Teil noch gut ist.',
    bezug: 'Das Toleranzfeld zeigt, ob ein Istmass gut, zu klein oder zu gross ist.',
  },
  Betrieb: {
    fachdefinition: 'Organisierte Arbeitsstaette, in der Menschen, Maschinen, Material und Informationen zusammenwirken.',
    einfach: 'Der Betrieb ist der Ort, an dem Auftraege geplant, gefertigt, geprueft und ausgeliefert werden.',
    bezug: 'Im Kapitel Berufsrolle ordnest du ein, wo dein Arbeitsplatz im Produktionsbetrieb liegt.',
  },
  Linie: {
    fachdefinition: 'Abfolge verbundener Arbeitsplaetze oder Maschinen fuer einen wiederholbaren Produktionsablauf.',
    einfach: 'Eine Linie ist eine Kette von Stationen, durch die Material Schritt fuer Schritt laeuft.',
    bezug: 'Du lernst, wie dein Platz mit vorherigen und folgenden Stationen verbunden ist.',
  },
  Auftrag: {
    fachdefinition: 'Verbindliche Arbeitsvorgabe mit Informationen zu Produkt, Menge, Termin, Material und Qualitaetsanforderung.',
    einfach: 'Der Auftrag sagt, was hergestellt werden soll und worauf du achten musst.',
    bezug: 'Vor dem Start pruefst du, ob Auftrag, Material und Arbeitsplatz zusammenpassen.',
  },
  Ruesten: {
    fachdefinition: 'Vorbereiten einer Maschine oder Anlage fuer einen bestimmten Auftrag.',
    einfach: 'Du machst die Maschine bereit, bevor die eigentliche Produktion startet.',
    bezug: 'Ruesten gehoert zur Verantwortung des Maschinenfuehrers, aber nur nach betrieblicher Vorgabe.',
  },
  Bedienen: {
    fachdefinition: 'Fuehren und Ueberwachen einer Maschine oder Anlage im laufenden Prozess.',
    einfach: 'Du startest, beobachtest und haeltst den Ablauf nach Vorgabe stabil.',
    bezug: 'Bedienen bedeutet nicht blind Knöpfe druecken, sondern Auftrag, Sicherheit und Qualitaet mitdenken.',
  },
  Pruefen: {
    fachdefinition: 'Feststellen, ob ein Teil, Zustand oder Ablauf eine vorgegebene Anforderung erfuellt.',
    einfach: 'Du kontrollierst, ob etwas passt oder gemeldet werden muss.',
    bezug: 'Im Messblock unterscheidest du Pruefen als Oberbegriff von Messen und Lehren.',
  },
  Messen: {
    fachdefinition: 'Bestimmen eines Zahlenwerts einer Groesse mit einem geeigneten Messmittel.',
    einfach: 'Du findest heraus, wie gross etwas als Zahl mit Einheit ist.',
    bezug: 'Beim Messschieber bestimmst du Laengenwerte in Millimeter.',
  },
  Lehren: {
    fachdefinition: 'Pruefen mit einer Lehre, haeufig ohne Zahlenwert, sondern mit Gut/Ausschuss-Entscheidung.',
    einfach: 'Die Lehre sagt dir, ob etwas passt oder nicht passt.',
    bezug: 'Lehren wird von Messen unterschieden, weil kein genauer Zahlenwert abgelesen wird.',
  },
  Messschenkel: {
    fachdefinition: 'Kontaktflaechen am Messschieber, mit denen Aussen- oder Innenmasse erfasst werden.',
    einfach: 'Die Schenkel beruehren das Werkstueck beim Messen.',
    bezug: 'Grosse Messschenkel nutzt du fuer Aussenmessungen.',
  },
  Tiefenstange: {
    fachdefinition: 'Ausfahrbarer Teil des Messschiebers fuer Tiefenmessungen.',
    einfach: 'Die Stange, mit der du Tiefe misst.',
    bezug: 'Sie muss bei Tiefenmessungen mit sauberer Auflage genutzt werden.',
  },
  Skala: {
    fachdefinition: 'Markierte Teilung auf einem Messmittel zum Ablesen eines Messwerts.',
    einfach: 'Die Striche und Zahlen zum Ablesen.',
    bezug: 'Beim Messschieber liest du Hauptskala und Nonius zusammen.',
  },
  Buegelmessschraube: {
    fachdefinition: 'Feinmessmittel fuer Aussenmasse mit Buegel, Spindel, Skala, Trommel und Ratsche.',
    einfach: 'Ein sehr feines Messmittel fuer Aussenmasse.',
    bezug: 'Du lernst, wann sie statt des Messschiebers sinnvoll ist.',
  },
  Spindel: {
    fachdefinition: 'Beweglicher Messbolzen einer Buegelmessschraube.',
    einfach: 'Der bewegliche Teil, der an das Werkstueck heranfaehrt.',
    bezug: 'Die Spindel wird kontrolliert bewegt, nicht mit Gewalt geschlossen.',
  },
  Ratsche: {
    fachdefinition: 'Bedienelement zur Erzeugung eines gleichmaessigen Messdrucks an der Buegelmessschraube.',
    einfach: 'Sie hilft, nicht zu fest zu druecken.',
    bezug: 'Beim feinen Messen wird die Ratsche nach Vorgabe genutzt.',
  },
  Messuhr: {
    fachdefinition: 'Anzeigendes Messgeraet zum Erfassen kleiner Weg- oder Lageabweichungen.',
    einfach: 'Eine Uhr, deren Zeiger kleine Abweichungen sichtbar macht.',
    bezug: 'Du nutzt sie zum Beispiel, um Rundlauf oder Lageabweichungen nach Vorgabe zu pruefen.',
  },
  Rundlauf: {
    fachdefinition: 'Abweichung einer drehenden Flaeche oder Achse von der gewuenschten runden Bewegung.',
    einfach: 'Beim Drehen laeuft das Teil nicht ganz gleichmaessig.',
    bezug: 'Die Messuhr zeigt, ob der Zeiger beim Drehen stark ausschlaegt.',
  },
  Grenzlehrdorn: {
    fachdefinition: 'Lehre mit Gut- und Ausschussseite zum Pruefen von Bohrungen oder Innenmassen.',
    einfach: 'Ein Pruefstift, der zeigt, ob eine Bohrung passt.',
    bezug: 'Er liefert meist eine Gut/Ausschuss-Entscheidung statt eines Zahlenwerts.',
  },
  Rachenlehre: {
    fachdefinition: 'Lehre mit geoeffnetem Rachen zum Pruefen aeusserer Masse.',
    einfach: 'Eine Lehre, die wie ein kleiner Rachen um ein Aussenmass greift.',
    bezug: 'Sie wird vorsichtig angesetzt und nicht mit Gewalt ueber das Teil gedrueckt.',
  },
  Pruefmittel: {
    fachdefinition: 'Mess- oder Pruefmittel, mit dem Masse, Zustande oder Anforderungen beurteilt werden.',
    einfach: 'Ein Werkzeug zum Messen oder Pruefen.',
    bezug: 'Pruefmittel muessen sauber, intakt und nach Vorgabe genutzt werden.',
  },
  Kalibrieren: {
    fachdefinition: 'Feststellen und Dokumentieren der Abweichung eines Messmittels gegen eine Referenz.',
    einfach: 'Man prueft, wie genau ein Messmittel anzeigt.',
    bezug: 'Kalibrieren bedeutet noch nicht automatisch, dass etwas eingestellt wurde.',
  },
  Justieren: {
    fachdefinition: 'Einstellen oder Abgleichen eines Messmittels, um die Anzeige zu korrigieren.',
    einfach: 'Man stellt ein Messmittel richtig ein.',
    bezug: 'Justieren duerfen nur berechtigte Personen nach Vorgabe.',
  },
  Eichen: {
    fachdefinition: 'Amtliche Pruefung und Bestaetigung eines Messgeraets fuer geregelte Anwendungsfaelle.',
    einfach: 'Eine offizielle Stelle bestaetigt das Messgeraet.',
    bezug: 'Eichen ist nicht dasselbe wie Reinigen, Kalibrieren oder Justieren.',
  },
  Messunsicherheit: {
    fachdefinition: 'Bereich, der beschreibt, wie sicher ein Messergebnis unter den gegebenen Bedingungen ist.',
    einfach: 'Der Messwert kann ein bisschen streuen oder unsicher sein.',
    bezug: 'Bei Grenzfaellen zaehlt nicht nur die Zahl, sondern auch die Sicherheit der Messung.',
  },
  Ausdehnung: {
    fachdefinition: 'Groessenaenderung eines Werkstuecks durch Temperaturveraenderung.',
    einfach: 'Warm kann ein Teil etwas groesser, kalt etwas kleiner wirken.',
    bezug: 'Beim Messen beachtest du Temperatur und Vorgabe, bevor du grenznahe Teile beurteilst.',
  },
  Referenztemperatur: {
    fachdefinition: 'Vorgegebene Bezugstemperatur fuer vergleichbare Messbedingungen.',
    einfach: 'Die Temperatur, auf die sich die Messvorgabe bezieht.',
    bezug: 'Kritische Messungen werden nach Vorgabe unter passenden Bedingungen bewertet.',
  },
  Werkstoff: {
    fachdefinition: 'Material, aus dem ein Bauteil oder Hilfsmittel besteht und dessen Eigenschaften fuer Verarbeitung und Einsatz wichtig sind.',
    einfach: 'Der Stoff, aus dem ein Teil gemacht ist.',
    bezug: 'Im Werkstoffblock ordnest du Material erst grob und dann genauer nach Kennzeichnung ein.',
  },
  Metall: {
    fachdefinition: 'Werkstoffgruppe mit typischen metallischen Eigenschaften, zum Beispiel Leitfaehigkeit, Umformbarkeit oder metallischem Gefuege.',
    einfach: 'Eine grosse Materialgruppe, zu der Stahl, Aluminium und Kupfer gehoeren.',
    bezug: 'Metalle werden nach genauer Sorte, Eigenschaft und Vorgabe verarbeitet.',
  },
  Kunststoff: {
    fachdefinition: 'Werkstoffgruppe aus polymeren Werkstoffen, die je nach Aufbau sehr unterschiedliche Eigenschaften haben kann.',
    einfach: 'Eine Materialgruppe wie Thermoplast, Duroplast oder Elastomer.',
    bezug: 'Kunststoffe werden im spaeteren Kapitel nach Verhalten bei Waerme unterschieden.',
  },
  Eisen: {
    fachdefinition: 'Chemisches Element und Basis vieler Eisenwerkstoffe.',
    einfach: 'Der Grundstoff vieler Staehle und Gusseisen.',
    bezug: 'Stahl und Gusseisen werden als Eisenwerkstoffe eingeordnet.',
  },
  Stahl: {
    fachdefinition: 'Eisenwerkstoff, dessen Eigenschaften durch Zusammensetzung und Behandlung festgelegt werden.',
    einfach: 'Ein wichtiger Eisenwerkstoff fuer viele Bauteile.',
    bezug: 'Konkrete Stahlsorten werden nach Zeichnung, Datenblatt oder Tabellenbuch verarbeitet.',
  },
  Legierung: {
    fachdefinition: 'Metallischer Werkstoff aus mindestens zwei Bestandteilen, um Eigenschaften gezielt zu beeinflussen.',
    einfach: 'Ein gemischter Metallwerkstoff mit bestimmten Eigenschaften.',
    bezug: 'Legierungselemente koennen Festigkeit, Korrosion oder Bearbeitbarkeit beeinflussen.',
  },
  Gusseisen: {
    fachdefinition: 'Eisenwerkstoff, der vorwiegend durch Giessen in Form gebracht wird und je nach Sorte Graphit enthalten kann.',
    einfach: 'Ein gegossener Eisenwerkstoff.',
    bezug: 'Gusseisen wird nicht nur nach Aussehen, sondern nach Kennzeichnung und Sorte beurteilt.',
  },
  Graphit: {
    fachdefinition: 'Kohlenstoffform, die in Gusseisen je nach Ausbildung die Werkstoffeigenschaften beeinflusst.',
    einfach: 'Eine Form von Kohlenstoff im Gusseisen.',
    bezug: 'Graphitform und Sorte helfen, Gusseisen fachlich einzuordnen.',
  },
  Nichteisenmetall: {
    fachdefinition: 'Metallischer Werkstoff, bei dem Eisen nicht der Hauptbestandteil ist.',
    einfach: 'Ein Metall, das nicht hauptsaechlich aus Eisen besteht.',
    bezug: 'Aluminium und Kupfer sind typische Beispiele im Grundlagenblock.',
  },
  Aluminium: {
    fachdefinition: 'Leichtmetall, dessen Eigenschaften von Legierung, Zustand und Oberflaeche abhaengen.',
    einfach: 'Ein leichtes Metall fuer viele Bauteile.',
    bezug: 'Bei Aluminium beachtest du Legierung, Oxidschicht und Bearbeitungsvorgabe.',
  },
  Oxidschicht: {
    fachdefinition: 'Duenne Oberflaechenschicht, die durch Reaktion mit Sauerstoff entstehen kann.',
    einfach: 'Eine Schicht auf der Oberflaeche.',
    bezug: 'Bei Aluminium kann die Oberflaeche fuer Bearbeitung, Verbindung und Funktion wichtig sein.',
  },
  Kupfer: {
    fachdefinition: 'Nichteisenmetall mit guter elektrischer und thermischer Leitfaehigkeit.',
    einfach: 'Ein Metall, das gut Strom und Waerme leitet.',
    bezug: 'Kupfer wird nach Werkstoffangabe, Datenblatt und Einsatzvorgabe verarbeitet.',
  },
  Leitfaehigkeit: {
    fachdefinition: 'Faehigkeit eines Werkstoffs, Strom oder Waerme zu leiten.',
    einfach: 'Wie gut etwas Strom oder Waerme weitergibt.',
    bezug: 'Kupfer wird haeufig wegen seiner Leitfaehigkeit eingesetzt.',
  },
  Thermoplast: {
    fachdefinition: 'Kunststoff, der bei geeigneter Waerme weich oder schmelzfaehig werden kann.',
    einfach: 'Ein Kunststoff, der bei Waerme formbar werden kann.',
    bezug: 'Thermoplaste sind fuer viele Spritzgiessprozesse wichtig; konkrete Temperaturen kommen aus Datenblatt oder Vorgabe.',
  },
  Schmelze: {
    fachdefinition: 'Fliessfaehiger Werkstoffzustand bei geeigneter Temperatur und Verarbeitung.',
    einfach: 'Der Werkstoff ist so warm, dass er fliessen kann.',
    bezug: 'Schmelze kommt zum Beispiel beim Spritzgiessen oder Giessen vor; konkrete Temperaturen sind quellenpflichtig.',
  },
  Duroplast: {
    fachdefinition: 'Kunststoff mit vernetzter Struktur, der nach dem Aushaerten nicht erneut wie ein Thermoplast schmilzt.',
    einfach: 'Ein Kunststoff, der nach dem Aushaerten formstabil bleibt.',
    bezug: 'Duroplaste werden von Thermoplasten ueber Vernetzung und Waermeverhalten abgegrenzt.',
  },
  Vernetzung: {
    fachdefinition: 'Chemische oder strukturelle Verbindung von Polymerketten zu einem Netzwerk.',
    einfach: 'Viele Kunststoffketten sind fest miteinander verbunden.',
    bezug: 'Vernetzung erklaert, warum Duroplaste anders reagieren als Thermoplaste.',
  },
  Elastomer: {
    fachdefinition: 'Elastischer Kunststoff, der sich verformen und weitgehend zurueckstellen kann.',
    einfach: 'Ein gummiartiger Kunststoff.',
    bezug: 'Elastomere werden ueber Rueckstellung und Einsatzgrenzen eingeordnet.',
  },
  Rueckstellung: {
    fachdefinition: 'Faehigkeit eines Werkstoffs, nach Verformung in Richtung Ausgangsform zurueckzukehren.',
    einfach: 'Das Material geht wieder zurueck.',
    bezug: 'Beim Elastomer ist Rueckstellung eine zentrale Eigenschaft.',
  },
  Additiv: {
    fachdefinition: 'Zusatzstoff, der einem Werkstoff beigegeben wird, um Eigenschaften zu beeinflussen.',
    einfach: 'Ein Zusatz, der etwas am Material veraendern soll.',
    bezug: 'Additive werden nur nach Datenblatt, Auftrag oder Freigabe verwendet.',
  },
  Masterbatch: {
    fachdefinition: 'Konzentrierte Mischung aus Traegermaterial und Zusatzstoffen, oft fuer Farbe oder Eigenschaften.',
    einfach: 'Ein stark konzentrierter Zusatz im Granulat.',
    bezug: 'Masterbatch wird nach Vorgabe dosiert und dokumentiert.',
  },
  Granulat: {
    fachdefinition: 'Koernige Lieferform von Kunststoffmaterial fuer die Verarbeitung.',
    einfach: 'Kunststoff in kleinen Koernern.',
    bezug: 'Granulat muss zum Auftrag passen und sauber rueckverfolgbar bleiben.',
  },
  Charge: {
    fachdefinition: 'Eindeutig abgegrenzte Material- oder Produktionsmenge mit gemeinsamer Kennzeichnung.',
    einfach: 'Eine eindeutig beschriftete Materialmenge.',
    bezug: 'Chargenangaben sichern Rueckverfolgbarkeit und Qualitaet.',
  },
  Spritzgiessmaschine: {
    fachdefinition: 'Maschine zur schussweisen Herstellung von Kunststoffteilen aus plastifizierter Schmelze in einem Werkzeug.',
    einfach: 'Eine Maschine, die Kunststoff schmilzt und in eine Form spritzt.',
    bezug: 'Im Kunststoffverfahren-Block ordnest du Schliessseite, Spritzeinheit und Werkzeug ein.',
  },
  Materialtrichter: {
    fachdefinition: 'Behaelter an der Verarbeitungsmaschine zur kontrollierten Zufuhr von Granulat oder Materialmischung.',
    einfach: 'Der Trichter, aus dem Granulat in die Maschine gelangt.',
    bezug: 'Trichter muessen sauber bleiben, damit Material nicht vermischt wird.',
  },
  Trocknung: {
    fachdefinition: 'Vorbehandlung von Kunststoffgranulat zur Reduzierung unerwuenschter Feuchte nach Materialvorgabe.',
    einfach: 'Material wird vor dem Verarbeiten getrocknet.',
    bezug: 'Trocknungsbedingungen kommen aus Datenblatt oder betrieblicher Freigabe.',
  },
  Schnecke: {
    fachdefinition: 'Rotierendes Foerder- und Plastifizierelement im Zylinder einer Kunststoffverarbeitungsmaschine.',
    einfach: 'Die Schnecke bewegt und mischt den Kunststoff im Zylinder.',
    bezug: 'Schnecke und Zylinder bereiten die Schmelze fuer den Schuss oder Strang vor.',
  },
  Zylinder: {
    fachdefinition: 'Beheizter Maschinenbereich, in dem Kunststoff durch Schnecke, Waerme und Scherung plastifiziert wird.',
    einfach: 'Der warme Rohrbereich um die Schnecke.',
    bezug: 'Zylindertemperaturen sind material- und quellenabhaengig.',
  },
  Einzugszone: {
    fachdefinition: 'Bereich der Schnecke, in dem Granulat aufgenommen und weitergefoerdert wird.',
    einfach: 'Der erste Bereich, in dem Material in die Schnecke kommt.',
    bezug: 'Stoerungen wie Brueckenbildung werden hier frueh sichtbar.',
  },
  Kompressionszone: {
    fachdefinition: 'Schneckenbereich, in dem Material verdichtet und zunehmend plastifiziert wird.',
    einfach: 'Der Bereich, in dem Druck und Waerme stark zunehmen.',
    bezug: 'Druck, Scherung und Temperatur werden nach Vorgabe betrachtet.',
  },
  Meteringzone: {
    fachdefinition: 'Schneckenbereich zur Homogenisierung und gleichmaessigen Foerderung der Schmelze.',
    einfach: 'Der Bereich, der die Schmelze gleichmaessiger macht.',
    bezug: 'Die Meteringzone bereitet eine stabile Dosiermenge vor.',
  },
  Rueckstromsperre: {
    fachdefinition: 'Bauteil an der Schneckenspitze, das Rueckfluss der Schmelze beim Einspritzen begrenzt.',
    einfach: 'Eine Sperre, damit Schmelze beim Spritzen nicht zurueckfliesst.',
    bezug: 'Sie beeinflusst Druckaufbau und Wiederholgenauigkeit.',
  },
  Duese: {
    fachdefinition: 'Uebergabestelle zwischen Spritzeinheit und Werkzeuganguss fuer die Kunststoffschmelze.',
    einfach: 'Die Verbindung, durch die Schmelze ins Werkzeug gelangt.',
    bezug: 'Duesenzustand und Dichtheit sind vor dem Prozess wichtig.',
  },
  Werkzeug: {
    fachdefinition: 'Formgebende Einrichtung, in der Kunststoffschmelze zum Bauteil erstarrt oder geformt wird.',
    einfach: 'Die Form, in der das Kunststoffteil entsteht.',
    bezug: 'Werkzeugzustand, Kavitaet und Temperierung bestimmen die Teilequalitaet.',
  },
  Kavitaet: {
    fachdefinition: 'Formgebender Hohlraum im Werkzeug, der die Bauteilgeometrie abbildet.',
    einfach: 'Der Hohlraum fuer das spaetere Teil.',
    bezug: 'Die Kavitaet wird beim Spritzgiessen mit Schmelze gefuellt.',
  },
  Anguss: {
    fachdefinition: 'Fliessweg, ueber den Kunststoffschmelze vom Duesenbereich in die Kavitaet gelangt.',
    einfach: 'Der Weg, der die Schmelze in die Form fuehrt.',
    bezug: 'Anguss und Entlueftung beeinflussen die Fuellung.',
  },
  Entlueftung: {
    fachdefinition: 'Kontrollierte Moeglichkeit, Luft oder Gase beim Fuellen aus dem Werkzeug entweichen zu lassen.',
    einfach: 'Luft kann aus der Form heraus.',
    bezug: 'Schlechte Entlueftung kann Brandstellen oder Fuellprobleme beguenstigen.',
  },
  Auswerfer: {
    fachdefinition: 'Werkzeugelement, das ein abgekuehltes Formteil aus der Kavitaet drueckt.',
    einfach: 'Stifte oder Elemente, die das Teil auswerfen.',
    bezug: 'Auswerferweg und Teiltemperatur muessen zur Entformung passen.',
  },
  Werkzeugtemperierung: {
    fachdefinition: 'Gezielte Temperaturfuehrung des Werkzeugs ueber Temperiermedium und Kanaele.',
    einfach: 'Das Werkzeug wird kontrolliert warm oder kalt gehalten.',
    bezug: 'Temperierung beeinflusst Kuehlung, Oberflaeche, Schwindung und Zykluszeit.',
  },
  Plastifizieren: {
    fachdefinition: 'Ueberfuehren von Kunststoff in einen verarbeitbaren plastischen oder schmelzefaehigen Zustand.',
    einfach: 'Kunststoff wird so vorbereitet, dass er fliessen kann.',
    bezug: 'Plastifizieren passiert in Schnecke und Zylinder.',
  },
  Dosieren: {
    fachdefinition: 'Bereitstellen einer definierten Material- oder Schmelzemenge fuer den naechsten Verarbeitungsschritt.',
    einfach: 'Die passende Menge wird vorbereitet.',
    bezug: 'Dosieren bestimmt die Schussmenge beim Spritzgiessen mit.',
  },
  Umschaltpunkt: {
    fachdefinition: 'Prozesspunkt, an dem vom Fuellen auf die Nachdruckphase gewechselt wird.',
    einfach: 'Der Moment, in dem die Maschine von Spritzen auf Druckhalten wechselt.',
    bezug: 'Der Umschaltpunkt wird nach Prozessvorgabe eingestellt.',
  },
  Nachdruck: {
    fachdefinition: 'Druckphase nach dem Fuellen zur Stabilisierung von Bauteilmasse und Ausgleich von Schwindung.',
    einfach: 'Nach dem Fuellen wird noch Druck gehalten.',
    bezug: 'Nachdruck wirkt nur sinnvoll, solange Nachfluss moeglich ist.',
  },
  Kuehlzeit: {
    fachdefinition: 'Zeitanteil im Zyklus, in dem das Formteil im Werkzeug abkuehlt und ausreichend stabil wird.',
    einfach: 'Die Zeit, in der das Teil in der Form abkuehlt.',
    bezug: 'Zu kurze Kuehlung kann Entformfehler und Verzug beguenstigen.',
  },
  Einfallstelle: {
    fachdefinition: 'Eingesunkene Oberflaechenstelle am Kunststoffteil, haeufig durch lokale Schwindung oder unzureichende Nachspeisung.',
    einfach: 'Eine sichtbare Delle im Kunststoffteil.',
    bezug: 'Einfallstellen werden besonders an dickeren Bereichen, Rippen oder Bossen geprueft.',
  },
  Lunker: {
    fachdefinition: 'Innerer Hohlraum im Kunststoffteil, der durch Schwindung und fehlende Nachspeisung entstehen kann.',
    einfach: 'Ein Loch oder Hohlraum im Inneren des Teils.',
    bezug: 'Lunker sind oft erst im Schnittbild, Bruchbild oder durch Pruefung sicher erkennbar.',
  },
  Ueberspritzung: {
    fachdefinition: 'Unerwuenschter Austritt von Kunststoffschmelze aus der vorgesehenen Kavitaet, oft an Trennebenen oder Spalten.',
    einfach: 'Kunststoff laeuft dort hin, wo er nicht hin soll.',
    bezug: 'Ueberspritzung wird nach Trennebene, Werkzeugzustand und Prozessvorgabe bewertet.',
  },
  Unterfuellung: {
    fachdefinition: 'Unvollstaendige Fuellung der Kavitaet, sodass das Kunststoffteil nicht vollstaendig ausgebildet ist.',
    einfach: 'Das Teil ist nicht ganz voll geworden.',
    bezug: 'Unterfuellung kann durch Fliessweg, Temperatur, Druck, Entlueftung oder Materialzustand entstehen.',
  },
  Fliessweg: {
    fachdefinition: 'Weg, den die Kunststoffschmelze vom Anschnitt bis zum Fliessende im Werkzeug zuruecklegt.',
    einfach: 'Der Weg, den der Kunststoff in der Form nimmt.',
    bezug: 'Lange oder enge Fliesswege koennen Fuellprobleme und Nahtbildung beeinflussen.',
  },
  Fliessnaht: {
    fachdefinition: 'Sichtbare Linie, an der Fliessfronten zusammentreffen oder unterschiedlich abkuehlen.',
    einfach: 'Eine Linie dort, wo Kunststoffstroeme zusammenkommen.',
    bezug: 'Fliessnaehte koennen optisch oder funktional relevant sein.',
  },
  Bindenaht: {
    fachdefinition: 'Nahtstelle zwischen zusammentreffenden Schmelzefronten, die die Festigkeit beeinflussen kann.',
    einfach: 'Eine moegliche Schwachstelle, wo Schmelze zusammenkommt.',
    bezug: 'Bindenaehte werden nach Lage, Belastung und Pruefvorgabe bewertet.',
  },
  Schlieren: {
    fachdefinition: 'Streifen- oder wolkenartige Oberflaechen- oder Farbabweichung im Kunststoffteil.',
    einfach: 'Sichtbare Streifen oder Wolken im Teil.',
    bezug: 'Schlieren koennen auf Material, Feuchte, Farbe, Temperatur oder Vermischung hinweisen.',
  },
  Feuchte: {
    fachdefinition: 'Unerwuenschter Wasseranteil im Material, der Verarbeitung und Bauteilqualitaet beeinflussen kann.',
    einfach: 'Zu viel Wasser im Material.',
    bezug: 'Feuchte wird ueber Datenblatt, Trocknung und Materialfreigabe beurteilt.',
  },
  Verbrennung: {
    fachdefinition: 'Thermisch geschaedigte oder dunkel verfaerbte Stelle am Kunststoffteil.',
    einfach: 'Eine verbrannte Stelle am Teil.',
    bezug: 'Verbrennungen werden nicht ueberdeckt, sondern als Prozess- oder Entlueftungshinweis gemeldet.',
  },
  Dieseleffekt: {
    fachdefinition: 'Verbrennungseffekt durch stark komprimierte eingeschlossene Luft oder Gase im Werkzeug.',
    einfach: 'Eingeschlossene Luft wird so heiss, dass eine dunkle Stelle entsteht.',
    bezug: 'Der Dieseleffekt verweist haeufig auf Entlueftung, Fliessende oder Prozessparameter.',
  },
  Orientierung: {
    fachdefinition: 'Ausrichtung von Polymerketten, Fuellstoffen oder Fasern durch Fliess- und Abkuehlbedingungen.',
    einfach: 'Teilchen oder Ketten liegen eher in eine Richtung.',
    bezug: 'Orientierung kann Schwindung, Festigkeit und Verzug beeinflussen.',
  },
  Delamination: {
    fachdefinition: 'Schichttrennung oder Abloesung innerhalb eines Kunststoffteils oder an seiner Oberflaeche.',
    einfach: 'Das Teil trennt sich in Schichten.',
    bezug: 'Delamination kann auf Materialunvertraeglichkeit, Feuchte oder Verschmutzung hinweisen.',
  },
  Inkompatibilitaet: {
    fachdefinition: 'Unvertraeglichkeit von Materialien oder Zusatzstoffen, die keine stabile Verbindung bilden.',
    einfach: 'Materialien passen nicht gut zusammen.',
    bezug: 'Bei Materialwechsel, Rezyklat oder Fremdstoffverdacht wird Inkompatibilitaet geprueft.',
  },
  Farbabweichung: {
    fachdefinition: 'Abweichung von vorgegebenem Farbton, Glanz oder Farbeindruck gegen Muster oder Freigabe.',
    einfach: 'Die Farbe passt nicht zum Muster.',
    bezug: 'Farbabweichungen werden mit Muster, Masterbatch, Charge und Freigabe verglichen.',
  },
  Auswerfermarke: {
    fachdefinition: 'Sichtbare Spur oder Abzeichnung eines Auswerferelements am Kunststoffteil.',
    einfach: 'Eine Markierung vom Auswerferstift.',
    bezug: 'Auswerfermarken koennen zulaessig oder fehlerhaft sein; entscheidend ist die Vorgabe.',
  },
  Schliesskraft: {
    fachdefinition: 'Kraft der Schliesseinheit, die das Werkzeug gegen den Innendruck geschlossen haelt.',
    einfach: 'Die Kraft, die die Form geschlossen haelt.',
    bezug: 'Schliesskraft wird nicht nach Gefuehl veraendert.',
  },
  Einspritzdruck: {
    fachdefinition: 'Druck zum Einbringen der Schmelze in Werkzeug und Kavitaet.',
    einfach: 'Der Druck beim Fuellen der Form.',
    bezug: 'Einspritzdruck wird im Zusammenhang mit Material und Werkzeug bewertet.',
  },
  Staudruck: {
    fachdefinition: 'Gegendruck auf die Schnecke waehrend des Plastifizierens und Dosierens.',
    einfach: 'Ein Druck, der beim Dosieren gegen die Schnecke wirkt.',
    bezug: 'Staudruck beeinflusst Homogenisierung und Schmelzezustand.',
  },
  Extruder: {
    fachdefinition: 'Maschine zur kontinuierlichen Plastifizierung und Formgebung von Kunststoff durch ein Werkzeug.',
    einfach: 'Eine Maschine, die Kunststoff als durchlaufenden Strang formt.',
    bezug: 'Extruder werden fuer Profile, Rohre, Folien und andere Strangprodukte genutzt.',
  },
  Extrusion: {
    fachdefinition: 'Kontinuierliches Verfahren, bei dem plastifizierter Kunststoff durch ein formgebendes Werkzeug gedrueckt wird.',
    einfach: 'Kunststoff wird fortlaufend durch eine Form gedrueckt.',
    bezug: 'Extrusion unterscheidet sich vom schussweisen Spritzgiessen.',
  },
  Blasformen: {
    fachdefinition: 'Kunststoffverfahren zur Herstellung von Hohlkoerpern durch Aufweiten eines Vorformlings mit Luftdruck.',
    einfach: 'Ein warmer Kunststoff wird mit Luft in Form geblasen.',
    bezug: 'Vorformling, Luftdruck und Kuehlung bestimmen den Hohlkoerper.',
  },
  Thermoformen: {
    fachdefinition: 'Umformen eines erwaermten Kunststoffhalbzeugs an oder in einer Form.',
    einfach: 'Eine warme Folie oder Platte wird in Form gebracht.',
    bezug: 'Thermoformen startet mit Halbzeug, nicht mit Granulat im Werkzeug.',
  },
  Schwindung: {
    fachdefinition: 'Volumen- oder Massaenderung eines Kunststoffteils beim Abkuehlen und Erstarren.',
    einfach: 'Das Teil zieht sich beim Abkuehlen zusammen.',
    bezug: 'Schwindung beeinflusst Einfallstellen, Lunker, Massabweichungen und Verzug.',
  },
  Verzug: {
    fachdefinition: 'Formabweichung eines Kunststoffteils durch ungleichmaessige Schwindung, Kuehlung, Spannungen oder Orientierung.',
    einfach: 'Das Teil wird krumm oder verdreht.',
    bezug: 'Verzug wird mit Formvorgabe, Lagerung, Kuehlung und Schwindung zusammen bewertet.',
  },
  Molekuelorientierung: {
    fachdefinition: 'Ausrichtung von Polymerketten durch Fliessen, Scherung und anschliessendes Erstarren.',
    einfach: 'Die Kunststoffketten koennen sich in eine Richtung ausrichten.',
    bezug: 'Orientierung kann Eigenschaften in unterschiedlichen Richtungen beeinflussen.',
  },
  Materialwechsel: {
    fachdefinition: 'Kontrollierte Umstellung einer Anlage von einem Kunststoffmaterial auf ein anderes.',
    einfach: 'Die Maschine wird von einem Material auf ein anderes umgestellt.',
    bezug: 'Wechsel brauchen Sauberkeit, Freigabe und Rueckverfolgbarkeit.',
  },
  Farbwechsel: {
    fachdefinition: 'Kontrollierte Umstellung einer Kunststoffverarbeitung von einer Farbe auf eine andere.',
    einfach: 'Die Produktion wechselt von einer Farbe zur naechsten.',
    bezug: 'Farbwechsel erfordern Spuelen und Freigabe der ersten Teile.',
  },
  Haerte: {
    fachdefinition: 'Werkstoffeigenschaft, die den Widerstand gegen Eindringen, Ritzen oder Verschleiss beschreibt.',
    einfach: 'Wie stark sich ein Material gegen Eindruecken wehrt.',
    bezug: 'Im Eigenschaftsblock wird Haerte als Grundidee verstanden; Pruefwerte kommen aus Vorgabe oder Tabellenbuch.',
  },
  Eindringen: {
    fachdefinition: 'Einwirken eines Pruefkoerpers oder Fremdkoerpers in die Werkstoffoberflaeche.',
    einfach: 'Etwas drueckt in die Oberflaeche hinein.',
    bezug: 'Haerte wird im Grundbild ueber die Eindringtiefe veranschaulicht.',
  },
  Festigkeit: {
    fachdefinition: 'Faehigkeit eines Werkstoffs, mechanische Belastungen ohne unzulaessige Veraenderung oder Bruch aufzunehmen.',
    einfach: 'Wie viel Belastung ein Material aushaelt.',
    bezug: 'Festigkeit wird nicht nach Gefuehl bewertet, sondern ueber Werkstoffdaten und Vorgaben.',
  },
  Zugfestigkeit: {
    fachdefinition: 'Kennwert fuer die maximale Zugbeanspruchung eines Werkstoffs vor dem Versagen im Zugversuch.',
    einfach: 'Wie stark ein Material beim Ziehen belastet werden kann.',
    bezug: 'Konkrete Werte brauchen Datenblatt, Tabellenbuch oder freigegebene Aufgabe.',
  },
  Bruch: {
    fachdefinition: 'Trennung eines Werkstoffs oder Bauteils infolge zu hoher Beanspruchung oder Schaedigungswirkung.',
    einfach: 'Das Teil reisst oder bricht auseinander.',
    bezug: 'Bruchbilder helfen, zaehes und sproedes Verhalten grundlegend zu unterscheiden.',
  },
  Zaehigkeit: {
    fachdefinition: 'Faehigkeit eines Werkstoffs, Energie aufzunehmen und sich vor dem Bruch zu verformen.',
    einfach: 'Das Material haelt etwas aus und verformt sich eher.',
    bezug: 'Zaehe Werkstoffe brechen oft nicht schlagartig ohne sichtbare Veraenderung.',
  },
  Sproedigkeit: {
    fachdefinition: 'Werkstoffverhalten mit geringer plastischer Verformung vor dem Bruch.',
    einfach: 'Das Material bricht eher scharf oder ploetzlich.',
    bezug: 'Sproedes Verhalten ist fuer Bruchrisiko, Temperatur und Einsatzgrenzen wichtig.',
  },
  Elastizitaet: {
    fachdefinition: 'Faehigkeit eines Werkstoffs, nach Entlastung in Richtung Ausgangsform zurueckzukehren.',
    einfach: 'Das Material federt wieder zurueck.',
    bezug: 'Elastische Verformung wird von bleibender plastischer Verformung unterschieden.',
  },
  'plastische Verformung': {
    fachdefinition: 'Bleibende Formveraenderung eines Werkstoffs nach Ueberschreiten des elastischen Bereichs.',
    einfach: 'Das Material bleibt verbogen oder veraendert.',
    bezug: 'Bleibende Verformung kann ein Freigabe- oder Ausschussgrund sein.',
  },
  Korrosion: {
    fachdefinition: 'Schaedigung oder Veraenderung eines Werkstoffs durch Reaktion mit seiner Umgebung.',
    einfach: 'Das Material wird durch Umgebung angegriffen, zum Beispiel Rost.',
    bezug: 'Korrosion wird erkannt, gemeldet und nach Vorgabe beurteilt.',
  },
  Rost: {
    fachdefinition: 'Korrosionsprodukt von Eisenwerkstoffen bei Einwirkung von Sauerstoff und Feuchtigkeit.',
    einfach: 'Die typische braunrote Korrosion an Eisen oder Stahl.',
    bezug: 'Roststellen koennen Funktion, Oberflaeche oder Masshaltigkeit beeintraechtigen.',
  },
  Oxidation: {
    fachdefinition: 'Chemische Reaktion mit Sauerstoff, die je nach Werkstoff schaden oder eine Schutzschicht bilden kann.',
    einfach: 'Ein Stoff reagiert mit Sauerstoff.',
    bezug: 'Oxidation erklaert Rost, aber auch bestimmte Schutzschichten an Werkstoffen.',
  },
  Beanspruchung: {
    fachdefinition: 'Art und Wirkung einer Belastung auf ein Bauteil, zum Beispiel Zug, Druck, Biegung oder Umgebungseinfluss.',
    einfach: 'Was ein Bauteil im Einsatz aushalten muss.',
    bezug: 'Werkstoffauswahl beginnt mit der Frage, welche Beanspruchung vorliegt.',
  },
  Welle: {
    fachdefinition: 'Maschinenelement, das Drehbewegung oder Drehmoment uebertraegt und dabei meist selbst rotiert.',
    einfach: 'Ein drehendes Teil, das Bewegung weitergibt.',
    bezug: 'Im Maschinenelemente-Block unterscheidest du Welle und Achse nach Funktion.',
  },
  Achse: {
    fachdefinition: 'Maschinenelement, das drehende Teile traegt oder fuehrt, ohne zwingend selbst Drehmoment zu uebertragen.',
    einfach: 'Ein tragendes Teil fuer Raeder oder Rollen.',
    bezug: 'Achsen werden ueber ihre tragende Funktion von Wellen abgegrenzt.',
  },
  Lager: {
    fachdefinition: 'Maschinenelement zum Stuetzen, Fuehren oder Lagern bewegter Teile bei moeglichst kontrollierter Reibung.',
    einfach: 'Ein Bauteil, damit sich etwas gefuehrt bewegen kann.',
    bezug: 'Lagerarten werden nach Bauart, Last, Reibung und Vorgabe unterschieden.',
  },
  Reibung: {
    fachdefinition: 'Widerstand zwischen sich beruehrenden oder relativ bewegten Flaechen.',
    einfach: 'Bewegung wird durch Kontakt gebremst.',
    bezug: 'Lager und Schmierung helfen, Reibung kontrolliert zu halten.',
  },
  Gleitlager: {
    fachdefinition: 'Lager, bei dem Welle und Lagerschale ueber gleitende Flaechen gefuehrt werden.',
    einfach: 'Ein Lager, bei dem Flaechen gleiten.',
    bezug: 'Gleitlager brauchen passende Schmierung, Sauberkeit und Montage.',
  },
  Schmierung: {
    fachdefinition: 'Einbringen oder Vorhandensein eines Schmierstoffs zur Verringerung von Reibung und Verschleiss.',
    einfach: 'Schmierstoff hilft, dass Teile nicht trocken aneinander reiben.',
    bezug: 'Schmierung ist bei Lagern, Ketten und vielen Antrieben ein Wartungspunkt.',
  },
  Waelzlager: {
    fachdefinition: 'Lager, bei dem Waelzkoerper zwischen Innen- und Aussenring rollen.',
    einfach: 'Ein Lager mit Kugeln oder Rollen.',
    bezug: 'Waelzlager werden nach Bauart, Last und Montagevorgabe behandelt.',
  },
  Waelzkoerper: {
    fachdefinition: 'Rollendes Element in einem Waelzlager, zum Beispiel Kugel, Rolle oder Nadel.',
    einfach: 'Das Teil im Lager, das rollt.',
    bezug: 'Waelzkoerper ermoeglichen rollende statt gleitende Bewegung im Lager.',
  },
  Kugellager: {
    fachdefinition: 'Waelzlager mit Kugeln als Waelzkoerpern.',
    einfach: 'Ein Lager mit Kugeln.',
    bezug: 'Kugellager sind ein typisches Beispiel fuer Waelzlager im Grundlagenblock.',
  },
  Rolle: {
    fachdefinition: 'Zylindrischer Waelzkoerper oder drehendes Bauteil zur Fuehrung, Stuetzung oder Bewegung.',
    einfach: 'Ein rundes Teil, das rollen kann.',
    bezug: 'Rollen kommen bei Lagern, Foerderern und Antrieben vor.',
  },
  Kupplung: {
    fachdefinition: 'Maschinenelement zum Verbinden von Wellen und Uebertragen von Drehmoment.',
    einfach: 'Ein Verbindungsteil zwischen zwei Wellen.',
    bezug: 'Kupplungen muessen ausgerichtet und gegen Eingriff geschuetzt sein.',
  },
  Drehmoment: {
    fachdefinition: 'Drehende Wirkung einer Kraft um eine Achse oder Welle.',
    einfach: 'Die Kraftwirkung, die etwas drehen will.',
    bezug: 'Wellen, Kupplungen und Getriebe uebertragen Drehmoment.',
  },
  Ausgleich: {
    fachdefinition: 'Faehigkeit einer Kupplung, kleine Abweichungen zwischen verbundenen Wellen nach Bauart auszugleichen.',
    einfach: 'Die Kupplung kann kleine Unterschiede ausgleichen.',
    bezug: 'Ob und wie viel Ausgleich erlaubt ist, steht in Bauart und Vorgabe.',
  },
  Zahnrad: {
    fachdefinition: 'Rad mit Zaehnen zur formschluessigen Uebertragung von Drehbewegung.',
    einfach: 'Ein Rad mit Zaehnen, das in ein anderes greift.',
    bezug: 'Zahnraeder bilden Zahnradgetriebe und koennen Uebersetzungen erzeugen.',
  },
  Getriebe: {
    fachdefinition: 'Anordnung von Maschinenelementen zur Uebertragung oder Umformung von Bewegung, Drehzahl oder Drehmoment.',
    einfach: 'Eine Baugruppe, die Bewegung weitergibt oder veraendert.',
    bezug: 'Im Zahnradgetriebe wird das Uebersetzungsprinzip vorbereitet.',
  },
  Uebersetzung: {
    fachdefinition: 'Verhaeltnis zwischen Eingangs- und Ausgangsbewegung, zum Beispiel Drehzahlverhaeltnis.',
    einfach: 'Wie stark Bewegung schneller, langsamer oder kraeftiger wird.',
    bezug: 'Konkrete Berechnungen folgen spaeter mit Tabellenbuch und freigegebener Formel.',
  },
  Riemen: {
    fachdefinition: 'Flexibles Maschinenelement zur kraftschluessigen Bewegungsuebertragung ueber Riemenscheiben.',
    einfach: 'Ein umlaufendes Band zur Bewegungsuebertragung.',
    bezug: 'Riemen brauchen Spannung, Zustandkontrolle und Schutz nach Vorgabe.',
  },
  Riemenscheibe: {
    fachdefinition: 'Scheibe, ueber die ein Riemen laeuft und Bewegung uebertraegt.',
    einfach: 'Das Rad, auf dem der Riemen laeuft.',
    bezug: 'Riemenscheiben gehoeren zum Riemenantrieb.',
  },
  Kette: {
    fachdefinition: 'Gegliedertes Maschinenelement zur formschluessigen Bewegungsuebertragung ueber Kettenraeder.',
    einfach: 'Viele verbundene Glieder, die Bewegung uebertragen.',
    bezug: 'Kettenantriebe brauchen Schmierung, Spannung und Schutz.',
  },
  Kettenrad: {
    fachdefinition: 'Rad mit Zahnung oder Profil, in das eine Kette formschluessig eingreift.',
    einfach: 'Das Rad, in das die Kette greift.',
    bezug: 'Kettenrad und Kette bilden gemeinsam den Kettenantrieb.',
  },
  Schraube: {
    fachdefinition: 'Verbindungselement mit Gewinde, das Bauteile loesbar verbinden oder einstellen kann.',
    einfach: 'Ein Gewindeteil zum Verbinden.',
    bezug: 'Schrauben werden nach Zeichnung, Gewinde, Laenge und Anzugsvorgabe verwendet.',
  },
  Gewinde: {
    fachdefinition: 'Schraubenfoermige Profilierung an Schraube oder Mutter zur Kraft- und Bewegungsuebertragung.',
    einfach: 'Die schraubenfoermige Form, mit der Schraube und Mutter greifen.',
    bezug: 'Gewindeangaben werden nicht geraten, sondern aus Zeichnung oder Vorgabe gelesen.',
  },
  Mutter: {
    fachdefinition: 'Verbindungselement mit Innengewinde, das mit einer Schraube zusammenwirkt.',
    einfach: 'Das Gegenstueck zur Schraube.',
    bezug: 'Mutter und Schraube bilden eine loesbare Verbindung.',
  },
  Feder: {
    fachdefinition: 'Maschinenelement, das elastisch verformt wird und Rueckstellkraft oder Energie speichern kann.',
    einfach: 'Ein Teil, das nach Belastung zurueckfedert.',
    bezug: 'Federn werden nach Funktion, Federweg und Vorgabe beurteilt.',
  },
  Daempfer: {
    fachdefinition: 'Maschinenelement, das Bewegung oder Schwingung abbremst und Energie umwandelt.',
    einfach: 'Ein Teil, das Bewegung bremst.',
    bezug: 'Daempfer werden bei auffaelligem Verhalten gemeldet und nach Vorgabe geprueft.',
  },
  Fertigung: {
    fachdefinition: 'Herstellung von Werkstuecken oder Produkten durch geplante Fertigungsverfahren.',
    einfach: 'Fertigung ist das Herstellen von Teilen nach Vorgabe.',
    bezug: 'Kapitel 2 ordnet Verfahren, Bewegungen, Werkzeugdaten und Bearbeitungszeiten ein.',
  },
  Urformen: {
    fachdefinition: 'Fertigungs-Hauptgruppe, bei der aus formlosem Stoff ein fester Koerper entsteht.',
    einfach: 'Ein Teil bekommt erstmals seine Form.',
    bezug: 'Du unterscheidest Urformen von Umformen und Trennen.',
  },
  Umformen: {
    fachdefinition: 'Fertigungs-Hauptgruppe, bei der ein fester Koerper seine Form ohne Stoffabtrag aendert.',
    einfach: 'Ein vorhandenes Teil wird in eine andere Form gebracht.',
    bezug: 'Umformen gehoert zu den spanlosen Verfahren.',
  },
  Trennen: {
    fachdefinition: 'Fertigungs-Hauptgruppe, bei der Stoffzusammenhalt aufgehoben wird, zum Beispiel beim Schneiden oder Zerspanen.',
    einfach: 'Material wird getrennt oder abgetragen.',
    bezug: 'Spanende Verfahren sind eine Form des Trennens.',
  },
  Fuegen: {
    fachdefinition: 'Fertigungs-Hauptgruppe, bei der getrennte Teile dauerhaft oder loesbar verbunden werden.',
    einfach: 'Mehrere Teile werden zusammengebracht.',
    bezug: 'Fuegen wird als Hauptgruppe neben Trennen und Umformen eingeordnet.',
  },
  Beschichten: {
    fachdefinition: 'Fertigungs-Hauptgruppe, bei der eine haftende Schicht auf ein Werkstueck aufgebracht wird.',
    einfach: 'Eine Oberflaeche bekommt eine Schicht.',
    bezug: 'Beschichten wird als eigene Fertigungshauptgruppe erkannt.',
  },
  Span: {
    fachdefinition: 'Beim spanenden Trennen abgetrennter Werkstoffanteil.',
    einfach: 'Das Material, das beim Bearbeiten als Spaenchen wegkommt.',
    bezug: 'Ob ein Span entsteht, hilft bei der Unterscheidung spanend oder spanlos.',
  },
  Schnittbewegung: {
    fachdefinition: 'Relativbewegung zwischen Werkzeug und Werkstueck, die beim Zerspanen die Schnittwirkung erzeugt.',
    einfach: 'Die Bewegung, die wirklich schneidet.',
    bezug: 'Sie wird von Vorschub und Zustellung unterschieden.',
  },
  Vorschub: {
    fachdefinition: 'Bewegung, mit der Werkzeug oder Werkstueck fortlaufend weitergefuehrt wird.',
    einfach: 'Das Werkzeug oder Teil wird weitergeschoben.',
    bezug: 'Vorschub beeinflusst Spanbildung, Oberflaeche und Zeit.',
  },
  Zustellung: {
    fachdefinition: 'Einstellung der Eingriffstiefe oder Spanungsdicke zwischen Werkzeug und Werkstueck.',
    einfach: 'Wie tief das Werkzeug ins Material geht.',
    bezug: 'Zustellung wird nicht mit Vorschub verwechselt.',
  },
  Schnittgeschwindigkeit: {
    fachdefinition: 'Geschwindigkeit der Schnittbewegung an der Wirkstelle zwischen Werkzeug und Werkstueck.',
    einfach: 'Wie schnell an der Schneide geschnitten wird.',
    bezug: 'Konkrete Werte fuer vc werden aus Tabellenbuch oder Werkzeugdaten gelesen.',
  },
  Drehzahl: {
    fachdefinition: 'Anzahl der Umdrehungen eines rotierenden Werkstuecks oder Werkzeugs pro Zeit.',
    einfach: 'Wie oft sich etwas pro Minute dreht.',
    bezug: 'Drehzahl wird aus Schnittwert, Durchmesser und Einheit abgeleitet.',
  },
  Standzeit: {
    fachdefinition: 'Zeit oder Einsatzdauer, in der ein Werkzeug unter definierten Bedingungen brauchbar arbeitet.',
    einfach: 'Wie lange ein Werkzeug gut arbeitet.',
    bezug: 'Standzeit ist ein Vorgabewert und wird nicht nach Gefuehl verlaengert.',
  },
  Werkzeugverschleiss: {
    fachdefinition: 'Abnutzung eines Werkzeugs durch Belastung, Reibung, Waerme oder Prozessbedingungen.',
    einfach: 'Das Werkzeug wird stumpf oder schlechter.',
    bezug: 'Verschleisszeichen werden gemeldet, weil sie Qualitaet und Sicherheit beeinflussen.',
  },
  Werkzeugdaten: {
    fachdefinition: 'Technische Angaben zu Werkzeug, Werkstoff und Prozess, zum Beispiel Schnittwert, Vorschub oder Einsatzgrenze.',
    einfach: 'Daten, mit denen du das Werkzeug richtig einsetzt.',
    bezug: 'Werkzeugdaten werden aus freigegebenen Quellen uebernommen.',
  },
  Bearbeitungszeit: {
    fachdefinition: 'Zeitanteil, in dem ein Arbeitsgang am Werkstueck bearbeitend ausgefuehrt wird.',
    einfach: 'Wie lange die eigentliche Bearbeitung dauert.',
    bezug: 'Die grobe Planung unterscheidet Bearbeitungszeit von Ruest- und Nebenzeiten.',
  },
  Saegeblatt: {
    fachdefinition: 'Werkzeug mit vielen Schneiden zum trennenden Bearbeiten von Werkstoff.',
    einfach: 'Das schneidende Blatt der Saege.',
    bezug: 'Beim Saegen bestimmst du Prozess und Sicherheit nicht nach Gefuehl.',
  },
  Schnittspalt: {
    fachdefinition: 'Durch das Trennen entstehender Spalt im Werkstueck.',
    einfach: 'Die Luecke, die beim Schneiden entsteht.',
    bezug: 'Schnittspalt und Span zeigen das Saegen als Trennverfahren.',
  },
  Bohrer: {
    fachdefinition: 'Rotierendes Schneidwerkzeug zum Herstellen von Bohrungen.',
    einfach: 'Das Werkzeug, das ein Loch bohrt.',
    bezug: 'Bohrer, Drehzahl, Vorschub und Werkstoff muessen zusammenpassen.',
  },
  Spanwinkel: {
    fachdefinition: 'Winkel an der Werkzeugschneide, der Spanbildung und Schnittverhalten beeinflusst.',
    einfach: 'Ein Winkel an der Schneide des Werkzeugs.',
    bezug: 'Spanwinkel werden nicht geschaetzt, sondern fachlich ueber Werkzeugdaten eingeordnet.',
  },
  Senker: {
    fachdefinition: 'Werkzeug zum Herstellen einer Senkung oder Kantenbearbeitung an Bohrungen.',
    einfach: 'Ein Werkzeug fuer die Bohrungskante.',
    bezug: 'Senken wird von Reiben und Bohren unterschieden.',
  },
  Reibahle: {
    fachdefinition: 'Mehrschneidiges Werkzeug zur genauen Nachbearbeitung von Bohrungen.',
    einfach: 'Ein Werkzeug, das eine Bohrung genauer macht.',
    bezug: 'Reiben dient Mass- und Oberflaechenqualitaet.',
  },
  Kernloch: {
    fachdefinition: 'Vorbohrung mit passendem Durchmesser fuer ein Innengewinde.',
    einfach: 'Das Loch vor dem Gewinde.',
    bezug: 'Kernlochdurchmesser sind quellenpflichtig.',
  },
  Drehmaschine: {
    fachdefinition: 'Werkzeugmaschine, bei der ein rotierendes Werkstueck mit Werkzeugen bearbeitet wird.',
    einfach: 'Eine Maschine, auf der Teile gedreht werden.',
    bezug: 'Drehen wird mit Drehmeissel, Einspannung und Schnittwerten betrachtet.',
  },
  Drehmeissel: {
    fachdefinition: 'Schneidwerkzeug fuer Drehbearbeitungen.',
    einfach: 'Das Werkzeug, das beim Drehen schneidet.',
    bezug: 'Drehmeissel werden nach Werkstoff, Geometrie und Arbeitsgang gewaehlt.',
  },
  Laengsdrehen: {
    fachdefinition: 'Drehbearbeitung entlang der Werkstueckachse zur Bearbeitung der Mantelflaeche.',
    einfach: 'Drehen entlang des Werkstuecks.',
    bezug: 'Laengsdrehen wird vom Plandrehen unterschieden.',
  },
  Plandrehen: {
    fachdefinition: 'Drehbearbeitung quer zur Werkstueckachse zur Bearbeitung einer Stirnflaeche.',
    einfach: 'Drehen der vorderen Flaeche.',
    bezug: 'Die Zeichnung entscheidet, welche Flaeche bearbeitet wird.',
  },
  Fraeser: {
    fachdefinition: 'Rotierendes mehrschneidiges Werkzeug fuer Fraesbearbeitungen.',
    einfach: 'Ein rundes Werkzeug mit mehreren Schneiden.',
    bezug: 'Fraeser, Vorschub und Eingriff bestimmen den Prozess.',
  },
  Tischvorschub: {
    fachdefinition: 'Vorschubbewegung des Maschinentischs oder Werkstuecks beim Fraesen.',
    einfach: 'Der Tisch bewegt das Werkstueck weiter.',
    bezug: 'Tischvorschub wird nicht mit Schnittbewegung verwechselt.',
  },
  Umfangsfraesen: {
    fachdefinition: 'Fraesverfahren, bei dem der Werkzeugumfang die Hauptzerspanung uebernimmt.',
    einfach: 'Der Rand des Fraesers arbeitet.',
    bezug: 'Umfangsfraesen wird vom Stirnfraesen abgegrenzt.',
  },
  Stirnfraesen: {
    fachdefinition: 'Fraesverfahren, bei dem die Stirnseite des Werkzeugs eine Planflaeche bearbeitet.',
    einfach: 'Die Vorderseite des Fraesers arbeitet.',
    bezug: 'Das Flaechenziel hilft bei der Zuordnung.',
  },
  Schleifscheibe: {
    fachdefinition: 'Rotierendes Schleifwerkzeug mit gebundenen Schleifkoernern.',
    einfach: 'Eine Scheibe mit vielen harten Koernern.',
    bezug: 'Scheibenzustand, Schutz und Waerme sind beim Schleifen wichtig.',
  },
  Korn: {
    fachdefinition: 'Schneidendes Schleifmittelteilchen in einer Schleifscheibe oder Schleiflage.',
    einfach: 'Ein kleines hartes Schneidteilchen.',
    bezug: 'Viele Koerner tragen beim Schleifen Material ab.',
  },
  Stempel: {
    fachdefinition: 'Aktives Werkzeugteil beim Stanzen oder Pressen, das Kraft auf das Werkstueck uebertraegt.',
    einfach: 'Das Werkzeugteil, das drueckt.',
    bezug: 'Stempel und Matrize bilden beim Stanzen den Schneidbereich.',
  },
  Matrize: {
    fachdefinition: 'Gegenwerkzeug oder Aufnahme beim Stanzen, Pressen oder Umformen.',
    einfach: 'Das Gegenstueck zum Stempel.',
    bezug: 'Die Matrize nimmt das Material oder Werkzeug auf.',
  },
  Grat: {
    fachdefinition: 'Unerwuenschter scharfer Materialueberstand an einer Kante.',
    einfach: 'Eine scharfe Kante oder ein Rest am Teil.',
    bezug: 'Grat wird erkannt, gemeldet oder nach Vorgabe entfernt.',
  },
  Biegen: {
    fachdefinition: 'Umformverfahren, bei dem ein Werkstueck um eine Biegekante oder einen Radius geformt wird.',
    einfach: 'Ein Teil wird in einen Winkel gebogen.',
    bezug: 'Biegeradius und Rueckfederung werden beachtet.',
  },
  Biegeradius: {
    fachdefinition: 'Radius der gebogenen Zone an einem Werkstueck.',
    einfach: 'Die Rundung an der Biegestelle.',
    bezug: 'Zu kleine Radien koennen Bauteil und Werkstoff belasten.',
  },
  Rueckfederung: {
    fachdefinition: 'Elastisches Zurueckgehen eines Werkstuecks nach dem Umformen.',
    einfach: 'Das Teil federt nach dem Biegen etwas zurueck.',
    bezug: 'Rueckfederung beeinflusst den Endwinkel.',
  },
  Walze: {
    fachdefinition: 'Rotierendes Werkzeug zum Umformen oder Foerdern eines Werkstuecks.',
    einfach: 'Eine drehende Rolle im Prozess.',
    bezug: 'Beim Walzen bestimmen Walzen und Spalt die Umformung.',
  },
  Walzspalt: {
    fachdefinition: 'Abstand zwischen Walzen, durch den das Werkstueck gefuehrt wird.',
    einfach: 'Der Spalt zwischen zwei Walzen.',
    bezug: 'Der Walzspalt beeinflusst die Dicke.',
  },
  Niederhalter: {
    fachdefinition: 'Werkzeugteil, das beim Tiefziehen das Blech haelt und fuehrt.',
    einfach: 'Ein Teil, das das Blech beim Ziehen festhaelt.',
    bezug: 'Der Niederhalter hilft, Falten zu vermeiden.',
  },
  Ziehring: {
    fachdefinition: 'Werkzeugteil, durch das Blech beim Tiefziehen in eine Form gezogen wird.',
    einfach: 'Der Ring, durch den das Blech geformt wird.',
    bezug: 'Ziehring und Stempel formen den Hohlkoerper.',
  },
  Presse: {
    fachdefinition: 'Maschine, die grosse Kraefte fuer Umform-, Schneid- oder Fuegeprozesse bereitstellt.',
    einfach: 'Eine Maschine, die mit viel Kraft drueckt.',
    bezug: 'Pressen haben Schutzraeume und Freigabeanforderungen.',
  },
  Presskraft: {
    fachdefinition: 'Kraft, die eine Presse oder ein Werkzeug auf Werkstueck oder Werkzeug ausuebt.',
    einfach: 'Die Kraft der Presse.',
    bezug: 'Presskraft und Flaeche gehoeren zum Druckzusammenhang.',
  },
  Schmieden: {
    fachdefinition: 'Umformverfahren, bei dem ein Rohling durch Druck oder Schlag geformt wird.',
    einfach: 'Metall wird mit Kraft in Form gebracht.',
    bezug: 'Schmieden kann Waerme und Gefuegeveraenderung beinhalten.',
  },
  Rohling: {
    fachdefinition: 'Ausgangsteil vor der weiteren Bearbeitung oder Umformung.',
    einfach: 'Das Teil vor der Bearbeitung.',
    bezug: 'Beim Schmieden wird der Rohling in eine neue Form gebracht.',
  },
  Giessen: {
    fachdefinition: 'Urformverfahren, bei dem fluessiger Werkstoff in eine Form eingebracht und erstarrt.',
    einfach: 'Fluessiges Metall wird in eine Form gegossen.',
    bezug: 'Form, Schmelze und Speiser gehoeren zum Gussprozess.',
  },
  Speiser: {
    fachdefinition: 'Gussbereich, der beim Erstarren Material nachliefert.',
    einfach: 'Ein Vorrat fuer fluessiges Metall beim Giessen.',
    bezug: 'Speiser helfen, Volumenveraenderungen beim Erstarren auszugleichen.',
  },
  Schweissnaht: {
    fachdefinition: 'Beim Schweissen entstandene verbindende Zone zwischen Bauteilen.',
    einfach: 'Die Naht, die zwei Teile verbindet.',
    bezug: 'Schweissnaehte werden nach Vorgabe beurteilt.',
  },
  Lot: {
    fachdefinition: 'Zusatzwerkstoff zum Loeten, der schmilzt und Bauteile verbindet.',
    einfach: 'Das Material, das beim Loeten fliesst.',
    bezug: 'Lot, Spalt und Benetzung gehoeren zusammen.',
  },
  Benetzung: {
    fachdefinition: 'Ausbreiten und Haften eines fluessigen Stoffs auf einer Oberflaeche.',
    einfach: 'Das Lot oder der Klebstoff verteilt sich gut.',
    bezug: 'Gute Benetzung ist fuer Loet- und Klebverbindungen wichtig.',
  },
  Klebstoff: {
    fachdefinition: 'Stoff zum Verbinden von Oberflaechen durch Haftung und innere Festigkeit.',
    einfach: 'Material zum Kleben.',
    bezug: 'Klebstoff wird nach Datenblatt verarbeitet.',
  },
  Klebschicht: {
    fachdefinition: 'Ausgehaertete oder wirksame Schicht zwischen geklebten Bauteilen.',
    einfach: 'Die Schicht Klebstoff zwischen Teilen.',
    bezug: 'Klebschicht, Oberflaeche und Aushartezeit bestimmen die Verbindung.',
  },
  Niet: {
    fachdefinition: 'Fuegeelement fuer meist dauerhafte Verbindungen durch plastische Verformung.',
    einfach: 'Ein Verbindungsteil, das vernietet wird.',
    bezug: 'Nieten werden von loesbaren Schraubverbindungen unterschieden.',
  },
  Stoerung: {
    fachdefinition: 'Abweichung vom vorgesehenen Maschinen-, Anlagen- oder Prozesszustand.',
    einfach: 'Etwas laeuft nicht so, wie es soll.',
    bezug: 'Bei Stoerungen sicherst du die Situation, meldest sie und dokumentierst nach Vorgabe.',
  },
  Sperrung: {
    fachdefinition: 'Kennzeichnung oder organisatorische Massnahme, damit ein Teil, Bereich oder Prozess nicht weiter genutzt wird.',
    einfach: 'Gesperrt heisst: nicht weiterverwenden, bis entschieden wurde.',
    bezug: 'Auffaellige Teile oder unsichere Zustaende werden nicht einfach weitergegeben.',
  },
  Freigabe: {
    fachdefinition: 'Betriebliche Entscheidung, dass Arbeit, Teil oder Prozess nach Pruefung fortgesetzt werden darf.',
    einfach: 'Jemand Berechtigtes sagt: Es darf weitergehen.',
    bezug: 'Du lernst, wann du selbst handeln darfst und wann du eine Freigabe abwarten musst.',
  },
  Zeichnungsabgleich: {
    fachdefinition: 'Systematischer Vergleich von Auftrag, Zeichnung und weiteren Vorgaben vor Arbeitsbeginn.',
    einfach: 'Du pruefst, ob Auftrag und Zeichnung wirklich zusammenpassen.',
    bezug: 'In der Produktionsvorbereitung klaerst du Widersprueche vor dem Start.',
  },
  Ruestplatz: {
    fachdefinition: 'Vorbereiteter Bereich, an dem Werkzeuge, Hilfsmittel und Unterlagen fuer das Ruesten bereitgestellt werden.',
    einfach: 'Der Platz, an dem alles fuer den Werkzeug- oder Auftragswechsel vorbereitet wird.',
    bezug: 'Ein sauberer Ruestplatz reduziert Suchzeit, Fehler und Sicherheitsrisiken.',
  },
  Nullpunkt: {
    fachdefinition: 'Festgelegter Bezugspunkt einer Maschine, eines Werkzeugs oder Werkstuecks fuer Masse und Bewegungen.',
    einfach: 'Der Bezugspunkt, von dem aus die Maschine richtig arbeitet.',
    bezug: 'Beim Ruesten werden Bezug und Nullpunkt nach Vorgabe geprueft.',
  },
  Rezept: {
    fachdefinition: 'Freigegebener Parametersatz fuer eine Maschine, ein Werkzeug, Material oder Produkt.',
    einfach: 'Eine gespeicherte Vorgabe mit Einstellungen.',
    bezug: 'Parameter werden aus Rezept oder Vorgabe uebernommen, nicht geraten.',
  },
  Parameter: {
    fachdefinition: 'Einstell- oder Prozessgroesse, die den Maschinenablauf oder das Prozessergebnis beeinflusst.',
    einfach: 'Ein Wert, den die Maschine fuer den Prozess nutzt.',
    bezug: 'Parameter brauchen Quelle, Version und Plausibilitaetspruefung.',
  },
  Erstteil: {
    fachdefinition: 'Erstes Teil nach Ruesten, Werkzeugwechsel oder Anfahren, das zur Pruefung und Freigabe dient.',
    einfach: 'Das erste Teil, mit dem geprueft wird, ob alles passt.',
    bezug: 'Serienproduktion startet erst nach geeigneter Erstteilpruefung und Freigabe.',
  },
  Erstteilpruefung: {
    fachdefinition: 'Pruefung des Erstteils gegen Zeichnung, Pruefplan und Freigabevorgaben.',
    einfach: 'Das erste Teil wird genau gegen die Vorgabe kontrolliert.',
    bezug: 'Die Erstteilpruefung bereitet die Produktionsfreigabe vor.',
  },
  Produktionsfreigabe: {
    fachdefinition: 'Freigabeentscheidung fuer den Serienlauf nach erfolgreicher Vorbereitung und Pruefung.',
    einfach: 'Die Serie darf erst starten, wenn die Produktion freigegeben ist.',
    bezug: 'Ohne Freigabe werden auffaellige Teile gesperrt oder geklaert.',
  },
  Ruestzeit: {
    fachdefinition: 'Zeitanteil zum Vorbereiten, Umstellen oder Einrichten einer Maschine fuer einen Auftrag.',
    einfach: 'Die Zeit, bis die Maschine fuer den Auftrag bereit ist.',
    bezug: 'Werkzeugwechsel und Ruesten werden geplant und dokumentiert.',
  },
  Anfahrteil: {
    fachdefinition: 'Teil aus der Anfahrphase, das vor stabiler Prozessfreigabe entsteht.',
    einfach: 'Ein Teil vom Start, das noch nicht automatisch gut ist.',
    bezug: 'Anfahrteile werden getrennt, geprueft oder nach Vorgabe behandelt.',
  },
  Ausschuss: {
    fachdefinition: 'Teil oder Material, das die Anforderungen nicht erfuellt und nicht als Gutteil verwendet werden darf.',
    einfach: 'Ein Teil, das nicht gut ist.',
    bezug: 'Ausschuss wird gekennzeichnet, getrennt und dokumentiert.',
  },
  Schichtuebergabe: {
    fachdefinition: 'Strukturierte Weitergabe relevanter Informationen zwischen Arbeitsschichten.',
    einfach: 'Die naechste Schicht bekommt die wichtigen Infos.',
    bezug: 'Auftrag, Stoerungen, Qualitaet und offene Punkte muessen verwertbar uebergeben werden.',
  },
  Rueckverfolgung: {
    fachdefinition: 'Moeglichkeit, Material, Prozessdaten, Pruefungen und Entscheidungen einem Produkt oder Auftrag zuzuordnen.',
    einfach: 'Man kann spaeter nachvollziehen, was womit und wann produziert wurde.',
    bezug: 'Produktionsdaten sichern Qualitaet und Klaerung bei Abweichungen.',
  },
  Qualitaet: {
    fachdefinition: 'Grad, in dem ein Produkt, Prozess oder Ergebnis festgelegte Anforderungen erfuellt.',
    einfach: 'Qualitaet heisst: Es passt zu dem, was gefordert ist.',
    bezug: 'In der QS lernst du, Qualitaet ueber Vorgaben, Pruefung und Rueckmeldung abzusichern.',
  },
  Kunde: {
    fachdefinition: 'Interne oder externe Stelle, die Anforderungen an Produkt, Termin, Funktion oder Nachweis stellt.',
    einfach: 'Der Kunde ist die Person oder Stelle, fuer die das Ergebnis passen muss.',
    bezug: 'Qualitaet wird nicht nach Gefuehl bewertet, sondern an Anforderungen.',
  },
  Soll: {
    fachdefinition: 'Vorgegebener Ziel- oder Grenzwert aus Zeichnung, Pruefplan, Auftrag oder freigegebener Quelle.',
    einfach: 'Soll ist das, was erreicht werden soll.',
    bezug: 'Beim Pruefen vergleichst du den Istwert mit der Sollvorgabe.',
  },
  Istwert: {
    fachdefinition: 'Tatsaechlich gemessener oder festgestellter Wert eines Merkmals.',
    einfach: 'Der Istwert ist das, was du wirklich gemessen hast.',
    bezug: 'Istwerte werden dokumentiert und gegen die Sollvorgabe bewertet.',
  },
  Sensor: {
    fachdefinition: 'Bauteil oder Geraet, das einen Zustand, eine Position oder Prozessgroesse erkennt und als Signal bereitstellt.',
    einfach: 'Ein Sensor merkt etwas und meldet es.',
    bezug: 'Sensoren liefern Eingangssignale fuer Steuerungen und Regelungen.',
  },
  Aktor: {
    fachdefinition: 'Bauteil, das ein Steuerungssignal in eine Wirkung wie Bewegung, Schalten, Leuchten oder Ventilstellung umsetzt.',
    einfach: 'Ein Aktor macht nach Signal etwas.',
    bezug: 'Aktoren werden ueber Ausgaenge angesteuert und duerfen nicht gefaehrlich ueberbrueckt werden.',
  },
  Steuerung: {
    fachdefinition: 'Technische Einrichtung oder Logik, die Signale verarbeitet und einen Ablauf ohne staendigen Soll-Ist-Vergleich fuehrt.',
    einfach: 'Eine Steuerung sagt der Anlage, was als Naechstes passieren soll.',
    bezug: 'Bei Steuerungen liest du Signalweg, Bedingungen und Freigaben.',
  },
  Regelung: {
    fachdefinition: 'Technische Funktion mit Rueckmeldung, bei der Istwert und Sollwert verglichen und eine Stellgroesse angepasst wird.',
    einfach: 'Eine Regelung misst zurueck und korrigiert.',
    bezug: 'Regelungen erkennst du am Soll-Ist-Vergleich und an der Rueckmeldung.',
  },
  Sollwert: {
    fachdefinition: 'Vorgegebener Zielwert einer Steuerungs- oder Regelungsaufgabe.',
    einfach: 'Der Wert, der erreicht werden soll.',
    bezug: 'Sollwerte kommen aus Vorgabe, Rezept, Programm oder Bedienfreigabe.',
  },
  Stellgroesse: {
    fachdefinition: 'Groesse, mit der ein Regler oder eine Steuerung auf den Prozess einwirkt.',
    einfach: 'Der Eingriff, mit dem die Anlage korrigiert.',
    bezug: 'Stellgroessen werden nicht nach Gefuehl veraendert.',
  },
  SPS: {
    fachdefinition: 'Speicherprogrammierbare Steuerung zum zyklischen Lesen von Eingaengen, Verarbeiten eines Programms und Setzen von Ausgaengen.',
    einfach: 'Ein Industrie-Computer fuer Maschinenablaeufe.',
    bezug: 'SPS-Programme werden nur durch befugte Personen und nach Freigabe geaendert.',
  },
  Programm: {
    fachdefinition: 'Festgelegte Folge von Anweisungen oder Logik, nach der eine Steuerung arbeitet.',
    einfach: 'Die gespeicherte Ablauf-Logik der Steuerung.',
    bezug: 'Programmstatus, Version und Freigabe sind fuer Anlagenverhalten wichtig.',
  },
  Eingang: {
    fachdefinition: 'Signalanschluss oder logischer Signalpunkt, ueber den Informationen in eine Steuerung gelangen.',
    einfach: 'Hier kommt ein Signal in die Steuerung hinein.',
    bezug: 'Eingaenge stammen zum Beispiel von Sensoren, Tastern oder Schaltern.',
  },
  Ausgang: {
    fachdefinition: 'Signalanschluss oder logischer Signalpunkt, ueber den eine Steuerung eine Aktion ausloest.',
    einfach: 'Hier geht ein Befehl aus der Steuerung heraus.',
    bezug: 'Ausgaenge schalten zum Beispiel Aktoren, Anzeigen, Ventile oder Relais.',
  },
  UND: {
    fachdefinition: 'Logische Verknuepfung, bei der alle Bedingungen erfuellt sein muessen.',
    einfach: 'Alles muss stimmen.',
    bezug: 'UND-Bedingungen werden in Freigaben und Sicherheitslogik genutzt.',
  },
  ODER: {
    fachdefinition: 'Logische Verknuepfung, bei der mindestens eine Bedingung erfuellt sein muss.',
    einfach: 'Eine passende Bedingung reicht.',
    bezug: 'ODER-Logik muss trotzdem eindeutig und freigegeben sein.',
  },
  Verriegelung: {
    fachdefinition: 'Logische oder technische Sperre, die unerwuenschte oder gefaehrliche Aktionen verhindert.',
    einfach: 'Eine Sicherung in der Logik.',
    bezug: 'Verriegelungen werden nicht ueberbrueckt.',
  },
  Endschalter: {
    fachdefinition: 'Sensor oder Schalter, der eine definierte Endlage oder Position erkennt.',
    einfach: 'Ein Schalter fuer eine Endposition.',
    bezug: 'Endschalter helfen, Bewegungen und Positionen zu ueberwachen.',
  },
  Induktiv: {
    fachdefinition: 'Sensorprinzip, das typische metallische Objekte beruehrungslos erkennt.',
    einfach: 'Reagiert besonders auf Metall.',
    bezug: 'Induktive Sensoren werden nach Einbau, Abstand und Materialvorgabe beurteilt.',
  },
  Kapazitiv: {
    fachdefinition: 'Sensorprinzip, das Aenderungen eines elektrischen Feldes nutzt und unterschiedliche Materialien erkennen kann.',
    einfach: 'Kann auch Nichtmetall oder Fuellstand erkennen.',
    bezug: 'Kapazitive Sensoren reagieren empfindlich auf Einbau, Umgebung und Material.',
  },
  Druck: {
    fachdefinition: 'Kraftbezogene Prozessgroesse, die haeufig in Fluid-, Pneumatik-, Hydraulik- oder Kunststoffprozessen ueberwacht wird.',
    einfach: 'Wie stark etwas drueckt.',
    bezug: 'Druckwerte werden nur mit freigegebener Einheit, Messstelle und Quelle bewertet.',
  },
  Drucksensor: {
    fachdefinition: 'Sensor zur Erfassung eines Druckwerts an einer definierten Messstelle.',
    einfach: 'Ein Sensor, der Druck misst.',
    bezug: 'Drucksensoren liefern Prozesswerte fuer Anzeige, Ueberwachung oder Regelung.',
  },
  Temperatursensor: {
    fachdefinition: 'Sensor zur Erfassung eines Temperaturwerts an einer definierten Messstelle.',
    einfach: 'Ein Sensor, der Temperatur misst.',
    bezug: 'Temperaturwerte brauchen Messstelle, Einheit und Vorgabe.',
  },
  Elektromotor: {
    fachdefinition: 'Elektrische Maschine, die elektrische Energie in Drehbewegung oder mechanische Arbeit umsetzt.',
    einfach: 'Ein Motor, der mit Strom dreht.',
    bezug: 'Elektromotoren treiben Pumpen, Foerderer, Schnecken, Spindeln oder andere Anlagenbereiche an.',
  },
  Frequenzumrichter: {
    fachdefinition: 'Elektronisches Geraet zur Versorgung und Drehzahlbeeinflussung eines Elektromotors durch veraenderte Frequenz und Spannung.',
    einfach: 'Ein Geraet, das die Motordrehzahl steuern kann.',
    bezug: 'FU-Parameter werden nur nach Vorgabe und Freigabe geaendert.',
  },
  Druckluft: {
    fachdefinition: 'Verdichtete Luft als Energietraeger in pneumatischen Anlagen.',
    einfach: 'Luft unter Druck, die Bewegungen ausloesen kann.',
    bezug: 'Druckluft wird erzeugt, aufbereitet, verteilt und am Verbraucher genutzt.',
  },
  Kompressor: {
    fachdefinition: 'Maschine zum Verdichten von Luft fuer ein Druckluftsystem.',
    einfach: 'Er macht aus Umgebungsluft Druckluft.',
    bezug: 'Der Kompressor steht am Anfang des Druckluftwegs.',
  },
  Wartungseinheit: {
    fachdefinition: 'Baugruppe zur Aufbereitung von Druckluft, typischerweise mit Filter, Druckregler und Anzeige.',
    einfach: 'Sie macht die Luft vor dem Verbraucher passend.',
    bezug: 'Wartungseinheiten werden nach Betriebs- und Anlagenvorgabe geprueft.',
  },
  Filter: {
    fachdefinition: 'Bauteil zum Abscheiden von Schmutz, Kondensat oder Partikeln aus einem Medium.',
    einfach: 'Er haelt Verunreinigungen zurueck.',
    bezug: 'Filterzustand und Kondensat werden nicht ignoriert.',
  },
  Druckregler: {
    fachdefinition: 'Bauteil zum Einstellen oder Konstanthalten eines vorgegebenen Drucks.',
    einfach: 'Er stellt den Arbeitsdruck ein.',
    bezug: 'Arbeitsdruckwerte bleiben quellen- und freigabepflichtig.',
  },
  Kondensat: {
    fachdefinition: 'Ausfallende Fluessigkeit, die in Druckluftsystemen durch Abkuehlung entstehen kann.',
    einfach: 'Wasser, das sich in der Druckluftanlage sammelt.',
    bezug: 'Kondensat wird nach Vorgabe kontrolliert und abgefuehrt.',
  },
  Ventil: {
    fachdefinition: 'Bauteil zum Sperren, Freigeben oder Umschalten eines Fluidstroms.',
    einfach: 'Es bestimmt, wo Luft oder Oel hinfliesst.',
    bezug: 'Ventile werden ueber Anschluesse, Schaltstellungen und Funktion gelesen.',
  },
  Drossel: {
    fachdefinition: 'Bauteil zur Begrenzung des Volumenstroms und damit zur Beeinflussung einer Bewegungsgeschwindigkeit.',
    einfach: 'Sie macht den Luftstrom kleiner oder langsamer.',
    bezug: 'Drosseleinstellungen werden nicht frei nach Gefuehl veraendert.',
  },
  Pneumatikzylinder: {
    fachdefinition: 'Linearer pneumatischer Aktor, der Druckluft in eine geradlinige Bewegung umsetzt.',
    einfach: 'Ein Druckluft-Bauteil, das aus- und einfaehrt.',
    bezug: 'Pneumatikzylinderbewegungen werden nach Luftweg, Ventil, Drossel und Endlage beurteilt.',
  },
  Einfachwirkend: {
    fachdefinition: 'Zylinderprinzip, bei dem Druckluft nur fuer eine Arbeitsrichtung genutzt wird.',
    einfach: 'Luft bewegt in eine Richtung, Ruecklauf kommt anders zustande.',
    bezug: 'Die Rueckstellung erfolgt zum Beispiel durch Feder oder Last.',
  },
  Doppeltwirkend: {
    fachdefinition: 'Zylinderprinzip, bei dem beide Bewegungsrichtungen aktiv durch Druckluft oder Hydraulikmedium erzeugt werden.',
    einfach: 'Luft oder Oel bewegt aktiv hin und zurueck.',
    bezug: 'Doppeltwirkende Zylinder haben zwei Arbeitsraeume. ',
  },
  Hydraulik: {
    fachdefinition: 'Technik zur Kraft- und Bewegungsuebertragung mit Fluessigkeit unter Druck.',
    einfach: 'Oel uebertraegt Druck und Kraft.',
    bezug: 'Hydraulik ist kraftvoll, aber Leckage, Druck und Freigabe muessen beachtet werden.',
  },
  Hydraulikoel: {
    fachdefinition: 'Betriebsstoff und Arbeitsmedium in hydraulischen Anlagen.',
    einfach: 'Das Oel, mit dem die Hydraulik arbeitet.',
    bezug: 'Oelsorte, Sauberkeit, Leckage und Entsorgung folgen der Vorgabe.',
  },
  Pumpe: {
    fachdefinition: 'Maschine zum Foerdern eines Fluids und zum Aufbau eines Volumenstroms.',
    einfach: 'Sie bewegt Oel oder ein anderes Medium durch die Anlage.',
    bezug: 'In der Hydraulik liefert die Pumpe den Volumenstrom fuer Druckaufbau und Bewegung.',
  },
  Wartung: {
    fachdefinition: 'Massnahme zum Erhalten des Sollzustands einer Maschine oder Anlage.',
    einfach: 'Du sorgst dafuer, dass die Anlage in gutem Zustand bleibt.',
    bezug: 'Wartung folgt Wartungsplan, Betriebsanweisung oder Herstellerunterlage.',
  },
  Inspektion: {
    fachdefinition: 'Massnahme zum Feststellen und Beurteilen des Istzustands einer Maschine oder Anlage.',
    einfach: 'Du pruefst, wie der Zustand wirklich ist.',
    bezug: 'Inspektion liefert Hinweise fuer Wartung, Reparatur oder Freigabe.',
  },
  Instandsetzung: {
    fachdefinition: 'Massnahme zum Wiederherstellen des funktionsfaehigen Sollzustands.',
    einfach: 'Etwas Defektes wird repariert.',
    bezug: 'Instandsetzung braucht Befugnis, Ersatzteil, Pruefung und Freigabe.',
  },
  'Vorbeugende Instandhaltung': {
    fachdefinition: 'Geplante Instandhaltung vor einem erwarteten Ausfall oder erkennbaren Schaden.',
    einfach: 'Man handelt, bevor die Anlage ausfaellt.',
    bezug: 'Vorbeugung kann zeit-, nutzungs- oder zustandsorientiert geplant sein.',
  },
  Zustandsorientiert: {
    fachdefinition: 'Instandhaltungsart, bei der der gemessene oder beobachtete Zustand die Massnahme ausloest.',
    einfach: 'Der Zustand entscheidet, wann gehandelt wird.',
    bezug: 'Typische Hinweise sind Temperatur, Schwingung, Geraeusch, Leckage oder Trend.',
  },
  Schmierplan: {
    fachdefinition: 'Vorgabe mit Schmierstellen, Schmierstoff, Menge, Intervall und Nachweis.',
    einfach: 'Der Plan sagt, wo und womit geschmiert wird.',
    bezug: 'Schmierplaene verhindern falschen Schmierstoff und vergessene Wartung.',
  },
  Verschleiss: {
    fachdefinition: 'Fortschreitender Material- oder Funktionsverlust durch Nutzung, Reibung, Belastung oder Umgebung.',
    einfach: 'Ein Teil nutzt sich ab.',
    bezug: 'Verschleiss wird ueber Symptome, Pruefung und Wartungsplan verfolgt.',
  },
  Geraeusch: {
    fachdefinition: 'Hoerbares Symptom, das auf veraenderten Lauf, Reibung, Lagerfehler oder Stoerung hinweisen kann.',
    einfach: 'Die Anlage klingt anders als normal.',
    bezug: 'Ungewoehnliche Geraeusche werden gemeldet und nicht uebertoent.',
  },
  Leckage: {
    fachdefinition: 'Unerwuenschtes Austreten eines Mediums aus einer Anlage, Leitung oder Dichtung.',
    einfach: 'Etwas tritt aus, wo es nicht austreten darf.',
    bezug: 'Leckage kann Sicherheits-, Umwelt-, Qualitaets- und Anlagenrisiko sein.',
  },
  Dichtung: {
    fachdefinition: 'Bauteil zum Abdichten zwischen Raeumen, Bauteilen oder Medien.',
    einfach: 'Sie verhindert, dass etwas austritt.',
    bezug: 'Dichtungen koennen durch Verschleiss, Montagefehler oder Medium beschaedigt werden.',
  },
  Lagerluft: {
    fachdefinition: 'Spiel oder Freiraum im Lager, der fuer Funktion und Zustand relevant ist.',
    einfach: 'Wie viel Spiel ein Lager hat.',
    bezug: 'Zu viel oder falsches Spiel kann auf Lagerfehler hinweisen.',
  },
  Pitting: {
    fachdefinition: 'Punktfoermige Materialausbrueche an belasteten Kontaktflaechen, zum Beispiel in Lagern oder Zahnraedern.',
    einfach: 'Kleine Ausbrueche auf einer belasteten Flaeche.',
    bezug: 'Pitting ist ein Schadensbild, das fachlich bewertet werden muss.',
  },
  Fehlausrichtung: {
    fachdefinition: 'Falsche Lage von Wellen, Kupplungen oder Baugruppen zueinander.',
    einfach: 'Teile laufen nicht sauber in einer Linie.',
    bezug: 'Fehlausrichtung kann Schwingung, Verschleiss und Lagerbelastung erhoehen.',
  },
  Ursache: {
    fachdefinition: 'Grund oder Ausloeser, der zu einem Fehler, einer Stoerung oder Wirkung fuehrt.',
    einfach: 'Warum etwas passiert ist.',
    bezug: 'Ursachen werden belegt, nicht geraten.',
  },
  Wirkung: {
    fachdefinition: 'Folge, die durch eine Ursache oder Stoerung im Prozess entsteht.',
    einfach: 'Was daraus passiert.',
    bezug: 'Wirkungen koennen Qualitaet, Sicherheit, Zeit oder Maschine betreffen.',
  },
  Grundursache: {
    fachdefinition: 'Tieferliegende Ursache, deren Beseitigung eine Wiederholung des Problems verhindern soll.',
    einfach: 'Der eigentliche Grund hinter dem Problem.',
    bezug: 'Methoden wie 5-Why suchen nach der Grundursache.',
  },
  Ishikawa: {
    fachdefinition: 'Ursache-Wirkungs-Diagramm zur strukturierten Sammlung moeglicher Ursachen.',
    einfach: 'Eine Fischgraete fuer Ursachen.',
    bezug: 'Ishikawa ordnet Ursachenfelder, ersetzt aber keine Pruefung.',
  },
  Dokumentation: {
    fachdefinition: 'Nachvollziehbare Aufzeichnung von Zustand, Pruefung, Entscheidung, Massnahme oder Ergebnis.',
    einfach: 'Du schreibst verwertbar auf, was passiert ist.',
    bezug: 'Dokumentation macht Stoerungen und Freigaben spaeter nachvollziehbar.',
  },
  Massnahme: {
    fachdefinition: 'Festgelegte Handlung zur Behebung, Absicherung, Pruefung oder Verbesserung eines Zustands.',
    einfach: 'Was konkret getan wird.',
    bezug: 'Massnahmen brauchen Verantwortliche, Nachweis und Wirksamkeitspruefung.',
  },
  Verbesserung: {
    fachdefinition: 'Gezielte Aenderung, die Wiederholfehler reduziert oder Ablauf, Sicherheit, Qualitaet oder Stabilitaet erhoeht.',
    einfach: 'Etwas wird dauerhaft besser gemacht.',
    bezug: 'Verbesserungen werden nach Stoerungen auf Wirksamkeit geprueft.',
  },
  KVP: {
    fachdefinition: 'Kontinuierlicher Verbesserungsprozess mit kleinen, nachvollziehbaren Verbesserungen.',
    einfach: 'Immer wieder sinnvoll verbessern.',
    bezug: 'KVP verbindet Ursache, Massnahme, Wirkung und Standard.',
  },
  Pruefplan: {
    fachdefinition: 'Dokument oder Datensatz mit Pruefmerkmalen, Pruefmitteln, Haeufigkeit, Grenzwerten und Dokumentationsvorgaben.',
    einfach: 'Der Pruefplan sagt, was du wie pruefen musst.',
    bezug: 'QS-Einheiten nutzen den Pruefplan als verbindliche Arbeitsquelle.',
  },
  Merkmal: {
    fachdefinition: 'Pruefbares Produkt- oder Prozesskennzeichen, zum Beispiel Mass, Oberflaeche, Funktion oder Zustand.',
    einfach: 'Ein Merkmal ist das, worauf du bei der Pruefung achtest.',
    bezug: 'Merkmale werden nicht geraten, sondern aus Pruefplan oder Zeichnung gelesen.',
  },
  Pruefhaeufigkeit: {
    fachdefinition: 'Festgelegter Abstand oder Anlass, nach dem eine Pruefung wiederholt wird.',
    einfach: 'Sie sagt, wie oft geprueft wird.',
    bezug: 'Pruefhaeufigkeit kann als Intervall, Stichprobe oder Anlasspruefung vorgegeben sein.',
  },
  Stichprobe: {
    fachdefinition: 'Ausgewaehlter Teil einer Menge, der stellvertretend geprueft wird.',
    einfach: 'Du pruefst nicht alles, sondern eine festgelegte Auswahl.',
    bezug: 'Stichproben brauchen Vorgabe zu Umfang, Zeitpunkt und Reaktion.',
  },
  Vollpruefung: {
    fachdefinition: 'Pruefung jedes einzelnen Teils oder jeder einzelnen Einheit einer Menge.',
    einfach: 'Bei Vollpruefung wird jedes Teil kontrolliert.',
    bezug: 'Vollpruefung kann bei hohem Risiko oder besonderer Vorgabe erforderlich sein.',
  },
  Gutteil: {
    fachdefinition: 'Teil, das alle geforderten Pruefmerkmale innerhalb der Vorgaben erfuellt.',
    einfach: 'Ein Teil, das nach der Pruefung in Ordnung ist.',
    bezug: 'Gutteile werden von Nacharbeit und Ausschuss getrennt.',
  },
  Nacharbeit: {
    fachdefinition: 'Zulaessige Bearbeitung eines abweichenden Teils, um die Anforderungen nach Vorgabe doch noch zu erfuellen.',
    einfach: 'Ein Teil darf nachgebessert werden, wenn die Vorgabe das erlaubt.',
    bezug: 'Nacharbeit braucht Freigabe, Kennzeichnung und Dokumentation.',
  },
  Fehlerquote: {
    fachdefinition: 'Anteil fehlerhafter Teile an einer Gesamtmenge, haeufig als Prozentwert dargestellt.',
    einfach: 'Sie zeigt, wie viele von allen Teilen fehlerhaft waren.',
    bezug: 'Fehlerquoten werden aus Fehleranzahl und Gesamtmenge berechnet.',
  },
  Mittelwert: {
    fachdefinition: 'Durchschnittswert einer Messreihe als Summe der Werte geteilt durch die Anzahl der Werte.',
    einfach: 'Der Mittelwert ist der Durchschnitt.',
    bezug: 'In der QS beschreibt er die Lage einer Messreihe.',
  },
  Spannweite: {
    fachdefinition: 'Differenz zwischen groesstem und kleinstem Wert einer Messreihe.',
    einfach: 'Sie zeigt, wie weit die Werte auseinanderliegen.',
    bezug: 'Spannweite ist ein einfacher Hinweis auf Streuung.',
  },
  Trend: {
    fachdefinition: 'Erkennbare Richtung, in die sich Messwerte oder Prozessdaten ueber die Zeit veraendern.',
    einfach: 'Die Werte laufen sichtbar nach oben oder unten.',
    bezug: 'Trends helfen, Prozessdrift frueh zu erkennen.',
  },
  Streuung: {
    fachdefinition: 'Ausmass, in dem Messwerte um eine Mitte verteilt sind.',
    einfach: 'Streuung zeigt, wie stark Werte schwanken.',
    bezug: 'Hohe Streuung kann auf einen instabilen Prozess hinweisen.',
  },
  Normalverteilung: {
    fachdefinition: 'Statistisches Modell, bei dem viele Werte um eine Mitte liegen und Randwerte seltener auftreten.',
    einfach: 'Viele Werte liegen in der Mitte, wenige weit aussen.',
    bezug: 'Die Glockenkurve hilft beim einfachen Verstehen von Streuung.',
  },
  Regelkarte: {
    fachdefinition: 'Diagramm zur laufenden Ueberwachung von Prozesswerten mit Linien fuer Mitte und Grenzen.',
    einfach: 'Eine Karte, die zeigt, ob der Prozess auffaellig wird.',
    bezug: 'Regelkarten zeigen Warnsignale und Eingriffsbedarf.',
  },
  Eingriffsgrenze: {
    fachdefinition: 'Grenzlinie in einer Regelkarte, bei deren Ueberschreiten nach Vorgabe reagiert werden muss.',
    einfach: 'Wenn ein Punkt darueber oder darunter liegt, muss gehandelt werden.',
    bezug: 'Eingriffsgrenzen werden nicht selbst erfunden, sondern aus der Vorgabe uebernommen.',
  },
  Cp: {
    fachdefinition: 'Kennwert, der Toleranzbreite und Prozessstreuung ohne Lageverschiebung grob vergleicht.',
    einfach: 'Cp zeigt vereinfacht, ob die Streuung in die Toleranz passen koennte.',
    bezug: 'Cp wird nur mit belastbaren Messdaten und gueltiger Vorgabe bewertet.',
  },
  Cpk: {
    fachdefinition: 'Kennwert, der Prozessstreuung und Lage zur naeheren Toleranzgrenze beruecksichtigt.',
    einfach: 'Cpk zeigt vereinfacht, ob der Prozess auch richtig in der Toleranz liegt.',
    bezug: 'Cpk ist anspruchsvoller als eine einzelne Gut/Ausschuss-Entscheidung.',
  },
  Protokoll: {
    fachdefinition: 'Nachvollziehbare Dokumentation von Pruefung, Ergebnis, Bewertung und verantwortlicher Kennung.',
    einfach: 'Ein Protokoll haelt fest, was geprueft und entschieden wurde.',
    bezug: 'Pruefprotokolle sichern Nachweis, Rueckverfolgbarkeit und Eskalation.',
  },
  Massabweichung: {
    fachdefinition: 'Abweichung eines gemessenen Masses von der zulaessigen Vorgabe oder dem Grenzbereich.',
    einfach: 'Das Teil ist groesser oder kleiner als erlaubt.',
    bezug: 'Bei Metallfehlern pruefst du Messmittel, Werkzeug, Aufspannung und Prozessursache.',
  },
  Rattern: {
    fachdefinition: 'Unerwuenschte Schwingung beim Zerspanen, die sichtbare oder hoerbare Spuren verursachen kann.',
    einfach: 'Werkzeug oder Werkstueck vibriert beim Bearbeiten.',
    bezug: 'Rattermarken zeigen, dass der Prozess nicht ruhig schneidet.',
  },
  Schwingung: {
    fachdefinition: 'Mechanische Hin- und Herbewegung eines Systems um eine Ruhelage.',
    einfach: 'Etwas vibriert oder schwingt.',
    bezug: 'Schwingung kann Oberflaeche, Masshaltigkeit und Werkzeugstandzeit beeinflussen.',
  },
  Unwucht: {
    fachdefinition: 'Ungleichmaessige Massenverteilung an einem drehenden Teil, die Rundlaufprobleme oder Schwingungen verursachen kann.',
    einfach: 'Ein drehendes Teil ist nicht gleichmaessig ausbalanciert.',
    bezug: 'Schlechter Rundlauf kann mit Unwucht oder fehlerhafter Spannung zusammenhaengen.',
  },
  Werkzeugbruch: {
    fachdefinition: 'Ploetzliches Brechen eines Werkzeugs oder Werkzeugteils im Prozess.',
    einfach: 'Das Werkzeug bricht waehrend der Arbeit.',
    bezug: 'Bei Werkzeugbruch werden Prozess, Teile und Werkzeug sofort gesichert und gemeldet.',
  },
  Freiflaeche: {
    fachdefinition: 'Flaeche am Werkzeug hinter der Schneidkante, die beim Verschleiss sichtbar betroffen sein kann.',
    einfach: 'Ein Bereich hinter der Schneide, an dem Verschleiss sichtbar wird.',
    bezug: 'Freiflaechenverschleiss ist ein typisches Verschleissbild an Schneidwerkzeugen.',
  },
  Schneide: {
    fachdefinition: 'Wirksame Kante eines Werkzeugs, die Material trennt oder abtraegt.',
    einfach: 'Die Kante, die schneidet.',
    bezug: 'Scharfe, intakte Schneiden sind wichtig fuer Mass und Oberflaeche.',
  },
  Riss: {
    fachdefinition: 'Materialtrennung oder Anriss im Bauteil, der Stabilitaet und Funktion beeintraechtigen kann.',
    einfach: 'Ein Spalt oder Anriss im Material.',
    bezug: 'Risse werden nicht uebergangen, sondern gesperrt und bewertet.',
  },
  Verformung: {
    fachdefinition: 'Aenderung der Bauteilform durch Kraft, Waerme, Spannung oder Materialzustand.',
    einfach: 'Das Teil ist verbogen oder anders geformt als vorgesehen.',
    bezug: 'Verformung wird von Riss, Grat und Massabweichung unterschieden.',
  },
  Kratzer: {
    fachdefinition: 'Lineare Oberflaechenbeschaedigung durch Kontakt, Spane, Werkzeug oder Handhabung.',
    einfach: 'Eine sichtbare Linie oder Beschaedigung auf der Oberflaeche.',
    bezug: 'Kratzer werden nach Zeichnung, Muster oder Pruefplan bewertet.',
  },
  Haertefehler: {
    fachdefinition: 'Abweichung der geforderten Haerte oder Haerteverteilung eines Bauteils.',
    einfach: 'Das Teil ist zu weich, zu hart oder falsch behandelt.',
    bezug: 'Haertefehler brauchen geeignete Pruefung und Freigabeentscheidung.',
  },
  Waerme: {
    fachdefinition: 'Thermischer Einfluss, der Gefuege, Haerte, Mass, Oberflaeche oder Prozessstabilitaet beeinflussen kann.',
    einfach: 'Temperatur oder Erwaermung veraendert das Bauteil oder den Prozess.',
    bezug: 'Bei Metallfehlern kann Waerme zu Verzug, Haerteproblemen oder Oberflaechenfehlern beitragen.',
  },
  Medium: {
    fachdefinition: 'Stoff oder Umgebungseinfluss, der mit einem Bauteil in Kontakt steht, zum Beispiel Wasser, Kuehlschmierstoff oder Luftfeuchte.',
    einfach: 'Etwas aus der Umgebung beruehrt das Teil.',
    bezug: 'Korrosion entsteht haeufig durch ungeeignete Medien, Feuchte oder fehlenden Schutz.',
  },
  Meldeweg: {
    fachdefinition: 'Festgelegte Reihenfolge, an wen Informationen, Stoerungen oder Gefahren weitergegeben werden.',
    einfach: 'Der Meldeweg sagt, wen du zuerst informierst.',
    bezug: 'In der Stoerungseinheit trainierst du die sichere Reihenfolge von Erkennen bis Dokumentieren.',
  },
  Gefahrstelle: {
    fachdefinition: 'Bereich oder Situation, in der durch Maschine, Werkzeug, Material oder Umgebung eine Gefaehrdung entstehen kann.',
    einfach: 'Eine Stelle, an der du verletzt werden kannst, wenn du nicht nach Vorgabe handelst.',
    bezug: 'Im Sicherheitsteil markierst du typische Gefahrstellen in einer Werkhallenskizze.',
  },
  Quetschen: {
    fachdefinition: 'Mechanische Gefaehrdung durch Druck zwischen bewegten, schliessenden oder festen Teilen.',
    einfach: 'Etwas kann eingeklemmt werden.',
    bezug: 'Quetschstellen werden nicht mit der Hand geprueft und nicht im laufenden Bereich beruehrt.',
  },
  Schneiden: {
    fachdefinition: 'Mechanische Gefaehrdung durch scharfe Kanten, Werkzeuge, Messer oder Spaene.',
    einfach: 'Etwas kann schneiden.',
    bezug: 'Schnittgefahren erkennst du an Werkzeugen, Werkstuecken und Spaenen.',
  },
  Einzug: {
    fachdefinition: 'Gefaehrdung, bei der Koerperteile, Kleidung oder Material in bewegte Maschinenteile gezogen werden koennen.',
    einfach: 'Etwas zieht dich oder Kleidung in die Maschine.',
    bezug: 'Bei Einzugsstellen gelten Abstand, Schutz und die freigegebene Bedienvorgabe.',
  },
  PSA: {
    fachdefinition: 'Persoenliche Schutzausruestung, die eine Person gegen bestimmte Gefaehrdungen schuetzen soll.',
    einfach: 'Schutzkleidung und Schutzmittel, die du selbst traegst.',
    bezug: 'Du ordnest PSA nicht nach Gefuehl, sondern passend zur Situation und Betriebsanweisung zu.',
  },
  Schutzbrille: {
    fachdefinition: 'Augenschutz gegen mechanische, chemische oder andere Einwirkungen nach Vorgabe.',
    einfach: 'Sie schuetzt deine Augen.',
    bezug: 'In der Werkhalle ist sie typisch, wenn Spaene, Spritzer oder Partikel auftreten koennen.',
  },
  Sicherheitsschuhe: {
    fachdefinition: 'Schutzschuhe mit betrieblich vorgegebenen Schutzmerkmalen, zum Beispiel Zehenschutz.',
    einfach: 'Schuhe, die deine Fuesse besser schuetzen.',
    bezug: 'Sie sind wichtig, wenn Teile, Werkzeuge oder Material auf den Fuss fallen koennen.',
  },
  Sicherheitszeichen: {
    fachdefinition: 'Genormtes Zeichen, das Sicherheitshinweise visuell vermittelt.',
    einfach: 'Ein Schild, das dir sagt: tun, nicht tun oder aufpassen.',
    bezug: 'Du unterscheidest Gebot, Verbot und Warnung als Grundarten.',
  },
  Gebot: {
    fachdefinition: 'Sicherheitszeichen, das eine vorgeschriebene Handlung anzeigt.',
    einfach: 'Du musst etwas tun.',
    bezug: 'Zum Beispiel vorgeschriebene PSA tragen.',
  },
  Verbot: {
    fachdefinition: 'Sicherheitszeichen, das eine Handlung untersagt.',
    einfach: 'Du darfst etwas nicht tun.',
    bezug: 'Zum Beispiel kein Zutritt oder nicht rauchen.',
  },
  Warnung: {
    fachdefinition: 'Sicherheitszeichen, das vor einer Gefaehrdung warnt.',
    einfach: 'Achtung, hier kann etwas gefaehrlich sein.',
    bezug: 'Zum Beispiel Warnung vor Quetschstelle oder elektrischer Spannung.',
  },
  'Not-Halt': {
    fachdefinition: 'Sicherheitsfunktion zum schnellen Stillsetzen einer gefaehrlichen Bewegung oder Anlage in einer Gefahrensituation.',
    einfach: 'Der Not-Halt ist fuer echte Gefahr da: druecken, damit die Gefahr gestoppt wird.',
    bezug: 'Du trainierst, wann Not-Halt richtig ist und warum Reset erst nach Klaerung kommt.',
  },
  Reset: {
    fachdefinition: 'Ruecksetzen eines ausgeloesten Zustands nach Stoerung oder Sicherheitsausloesung gemaess Vorgabe.',
    einfach: 'Reset macht eine Sperre nicht automatisch sicher weg. Erst muss klar sein, warum sie da war.',
    bezug: 'Nach Not-Halt wird Reset nicht gedrueckt, bevor Gefahr und Freigabe geklaert sind.',
  },
  Schutzeinrichtung: {
    fachdefinition: 'Technische Einrichtung, die Personen von Gefahrbereichen trennt oder gefaehrliche Bewegungen verhindert.',
    einfach: 'Ein Schutz, der dich von gefaehrlichen Maschinenteilen fernhaelt.',
    bezug: 'Du unterscheidest Schutzgitter, Verriegelung und Lichtschranke als einfache Beispiele.',
  },
  Schutzgitter: {
    fachdefinition: 'Trennende Schutzeinrichtung, die den Zugang zu einem Gefahrbereich begrenzt.',
    einfach: 'Ein Gitter oder eine Tuer, damit du nicht in den gefaehrlichen Bereich kommst.',
    bezug: 'Ein offenes oder defektes Schutzgitter wird nicht ueberbrueckt.',
  },
  Lichtschranke: {
    fachdefinition: 'Beruehrungslos wirkende Schutzeinrichtung, die einen Eingriff oder Durchtritt erkennt.',
    einfach: 'Ein unsichtbarer Lichtstrahl, der merkt, wenn etwas in den Bereich kommt.',
    bezug: 'Im Trainer ordnest du sie als Schutzfunktion am Gefahrbereich ein.',
  },
  Restenergie: {
    fachdefinition: 'Nach dem Abschalten noch vorhandene Energie, zum Beispiel Druck, Spannung, gespeicherte Lage- oder Bewegungsenergie.',
    einfach: 'Auch nach dem Stopp kann noch Kraft in der Anlage stecken.',
    bezug: 'Restenergie ist ein Grund, warum Stillstand und Freigabe vor Eingriffen wichtig sind.',
  },
  Gefahrbereich: {
    fachdefinition: 'Raum an oder in einer Maschine, in dem eine Person einer Gefaehrdung ausgesetzt sein kann.',
    einfach: 'Der Bereich, in dem du verletzt werden kannst.',
    bezug: 'Du trainierst, Abstand zu halten und Eingriffe nur nach sicherer Vorgabe zu machen.',
  },
  Einzugsstelle: {
    fachdefinition: 'Stelle, an der Koerperteile, Kleidung oder Material durch bewegte Teile eingezogen werden koennen.',
    einfach: 'Eine Stelle, die etwas hineinziehen kann.',
    bezug: 'Laufende Walzen oder Wellen werden nicht mit der Hand freigemacht.',
  },
  Quetschstelle: {
    fachdefinition: 'Stelle, an der Koerperteile zwischen bewegten, schliessenden oder festen Teilen gequetscht werden koennen.',
    einfach: 'Eine Stelle, an der etwas eingeklemmt werden kann.',
    bezug: 'Bei schliessenden Schiebern, Backen oder Werkzeugen haeltst du Abstand und wartest Freigabe ab.',
  },
  Freischalten: {
    fachdefinition: 'Trennen einer Anlage oder eines Anlagenteils von der Energieversorgung gemaess freigegebener Vorgabe.',
    einfach: 'Die Energie wird sicher weggenommen, bevor jemand eingreift.',
    bezug: 'Du ordnest Freischalten als ersten Sicherungsgedanken vor Arbeiten an Anlagen ein.',
  },
  'Wiedereinschalten sichern': {
    fachdefinition: 'Massnahme, die unbeabsichtigtes oder unbefugtes Einschalten waehrend eines Eingriffs verhindert.',
    einfach: 'Niemand soll die Maschine aus Versehen wieder einschalten koennen.',
    bezug: 'Im Trainer bringst du die Sicherungsschritte in eine sichere Reihenfolge.',
  },
  Kennzeichnen: {
    fachdefinition: 'Sichtbare Information, dass Anlage, Bereich oder Schaltstelle gesichert, gesperrt oder nicht freigegeben ist.',
    einfach: 'Ein klarer Hinweis: nicht einschalten, nicht benutzen, erst klaeren.',
    bezug: 'Kennzeichnen macht fuer andere sichtbar, dass ein Eingriff oder eine Sperrung laeuft.',
  },
  Spannungsfreiheit: {
    fachdefinition: 'Zustand, in dem nach Pruefung keine gefaehrliche elektrische Spannung mehr anliegt.',
    einfach: 'Es ist geprueft, dass keine gefaehrliche Spannung mehr da ist.',
    bezug: 'Du lernst die Sicherheitsregel als Reihenfolge, ohne selbst Elektroarbeiten zu ersetzen.',
  },
  Erden: {
    fachdefinition: 'Verbinden leitfaehiger Teile mit Erde nach elektrotechnischer Vorgabe.',
    einfach: 'Eine Schutzmassnahme, damit gefaehrliche Spannung abgeleitet wird.',
    bezug: 'Der Begriff gehoert zu den Sicherheitsregeln und braucht fachliche Unterweisung.',
  },
  Werkzeugwechsel: {
    fachdefinition: 'Geplanter Wechsel eines Werkzeugs oder Werkzeugeinsatzes an Maschine oder Anlage.',
    einfach: 'Ein Werkzeug wird herausgenommen und ein anderes eingesetzt.',
    bezug: 'Du trainierst, warum Stoppen, Sichern, Pruefen und Freigabe vor Serienlauf wichtig sind.',
  },
  'Erste Hilfe': {
    fachdefinition: 'Unmittelbare Hilfeleistung nach einem Unfall bis weitere Hilfe uebernimmt.',
    einfach: 'Schnell helfen, ohne dich selbst in Gefahr zu bringen.',
    bezug: 'In der Unfall-Einheit steht zuerst Sichern, Hilfe holen und Meldeweg einhalten.',
  },
  Beinaheunfall: {
    fachdefinition: 'Ereignis, das zu einem Unfall haette fuehren koennen, aber ohne Verletzung oder Schaden ausgegangen ist.',
    einfach: 'Es ist knapp nichts passiert, aber es haette schlimm ausgehen koennen.',
    bezug: 'Beinaheunfaelle werden gemeldet, damit Ursachen beseitigt werden koennen.',
  },
  Verbandbuch: {
    fachdefinition: 'Betriebliche Dokumentation von Erste-Hilfe-Leistungen oder Verletzungen nach Vorgabe.',
    einfach: 'Dort wird notiert, was passiert ist und welche Hilfe geleistet wurde.',
    bezug: 'Die konkrete Dokumentation richtet sich nach betrieblicher Vorgabe.',
  },
  Abfall: {
    fachdefinition: 'Stoff oder Gegenstand, der nicht weiter im aktuellen Prozess verwendet wird und nach Vorgabe behandelt werden muss.',
    einfach: 'Etwas bleibt uebrig und muss richtig gesammelt oder entsorgt werden.',
    bezug: 'Du lernst, Abfall nicht beliebig wegzuwerfen, sondern sauber zu trennen.',
  },
  Recycling: {
    fachdefinition: 'Rueckfuehrung von Material in einen Verwertungsprozess nach geeigneter Trennung und Aufbereitung.',
    einfach: 'Material wird wieder nutzbar gemacht.',
    bezug: 'Im Umweltblock erkennst du, warum sortenreines Sammeln wichtig ist.',
  },
  Betriebsstoff: {
    fachdefinition: 'Stoff, der fuer Betrieb, Wartung oder Prozess einer Anlage gebraucht wird, aber nicht Hauptbestandteil des Produkts ist.',
    einfach: 'Ein Hilfsstoff fuer Maschine oder Prozess, zum Beispiel Oel, Fett oder KSS.',
    bezug: 'Du ordnest typische Betriebsstoffe Situationen zu.',
  },
  Oel: {
    fachdefinition: 'Fluessiger Betriebsstoff, zum Beispiel fuer Schmierung, Hydraulik oder Pflege nach Vorgabe.',
    einfach: 'Ein fluessiger Schmier- oder Betriebsstoff.',
    bezug: 'Oel wird nicht mit anderen Stoffen vermischt und nur nach Vorgabe verwendet.',
  },
  Fett: {
    fachdefinition: 'Pastoeser Schmierstoff fuer bestimmte Schmierstellen nach Wartungs- oder Betriebsanweisung.',
    einfach: 'Ein dickfluessiger Schmierstoff.',
    bezug: 'Fett passt nur dort, wo es die Vorgabe verlangt.',
  },
  KSS: {
    fachdefinition: 'Kuehlschmierstoff zur Kuehlung, Schmierung und Spanabfuhr in Bearbeitungsprozessen.',
    einfach: 'Eine Fluessigkeit, die beim Bearbeiten kuehlt und schmiert.',
    bezug: 'Du lernst, KSS als Prozessstoff mit Haut- und Umweltbezug zu behandeln.',
  },
  Gefahrstoff: {
    fachdefinition: 'Stoff oder Gemisch mit gefaehrlichen Eigenschaften, die Kennzeichnung und Schutzmassnahmen erfordern.',
    einfach: 'Ein Stoff, der Menschen oder Umwelt gefaehrden kann.',
    bezug: 'Du liest Etikett und Sicherheitsdatenblatt, statt nach Geruch oder Farbe zu raten.',
  },
  'H-Satz': {
    fachdefinition: 'Gefahrenhinweis auf Gefahrstoffkennzeichnung oder Sicherheitsdatenblatt.',
    einfach: 'Ein Satz, der die Gefahr beschreibt.',
    bezug: 'Du findest H-Saetze auf Etikett oder im Sicherheitsdatenblatt.',
  },
  'P-Satz': {
    fachdefinition: 'Sicherheitshinweis mit Schutz- oder Verhaltensmassnahmen fuer Gefahrstoffe.',
    einfach: 'Ein Satz, der sagt, wie du dich schuetzen sollst.',
    bezug: 'P-Saetze helfen, Schutzmassnahmen nicht zu raten.',
  },
  GHS: {
    fachdefinition: 'Global harmonisiertes System zur Einstufung und Kennzeichnung von Chemikalien.',
    einfach: 'Ein System fuer Gefahrstoffsymbole und Hinweise.',
    bezug: 'Du erkennst Piktogramme als Teil der Gefahrstoffkennzeichnung.',
  },
  SDB: {
    fachdefinition: 'Sicherheitsdatenblatt mit Informationen zu Gefahren, Handhabung, Schutzmassnahmen und Entsorgung eines Stoffs.',
    einfach: 'Ein Datenblatt, in dem steht, was beim Stoff wichtig und gefaehrlich ist.',
    bezug: 'Du navigierst zu passenden Abschnitten statt lange Texte blind zu lesen.',
  },
  Hautschutz: {
    fachdefinition: 'Massnahmen zum Schutz der Haut vor Stoffen, Feuchtigkeit, Reibung oder Verschmutzung.',
    einfach: 'Du schuetzt und reinigst deine Haut nach Vorgabe.',
    bezug: 'Beim KSS ist Hautschutz ein zentraler Praxispunkt.',
  },
  Rezyklat: {
    fachdefinition: 'Aus aufbereitetem Kunststoffabfall gewonnenes Material fuer erneute Nutzung.',
    einfach: 'Wiederverwendeter Kunststoff.',
    bezug: 'Sortenreine Abfaelle koennen eher zu Rezyklat werden.',
  },
  Sortenreinheit: {
    fachdefinition: 'Trennung von Materialien nach gleicher Art ohne stoerende Fremdstoffe oder Mischungen.',
    einfach: 'Gleiches Material bleibt zusammen, Fremdes kommt raus.',
    bezug: 'Du sortierst Kunststoffabfaelle so, dass Wiederverwertung moeglich bleibt.',
  },
  Zeichnung: {
    fachdefinition: 'Technische Darstellung eines Bauteils oder einer Baugruppe mit verbindlichen Informationen fuer Fertigung und Pruefung.',
    einfach: 'Die Zeichnung sagt, wie ein Teil aussehen und geprueft werden soll.',
    bezug: 'Du lernst, Zeichnung, Ansichten, Schriftfeld und Bemassung zusammen zu lesen.',
  },
  Bauteil: {
    fachdefinition: 'Ein einzelnes herzustellendes oder zu pruefendes Teil innerhalb eines Produkts oder einer Baugruppe.',
    einfach: 'Das einzelne Teil, um das es in der Zeichnung geht.',
    bezug: 'Die Zeichnung beschreibt Form, Masse und Angaben zum Bauteil.',
  },
  Schriftfeld: {
    fachdefinition: 'Informationsbereich einer technischen Zeichnung mit Grunddaten wie Zeichnungsnummer, Benennung, Werkstoff und Massstab.',
    einfach: 'Der Infokasten der Zeichnung.',
    bezug: 'Du trainierst, welche Information im Schriftfeld gesucht wird.',
  },
  Zeichnungsnummer: {
    fachdefinition: 'Eindeutige Kennung einer technischen Zeichnung oder eines Zeichnungsstands.',
    einfach: 'Die Nummer, mit der die richtige Zeichnung gefunden wird.',
    bezug: 'Vor Fertigung oder Pruefung muss klar sein, welche Zeichnung gilt.',
  },
  Vorderansicht: {
    fachdefinition: 'Ansicht eines Bauteils von vorne als Hauptansicht einer technischen Darstellung.',
    einfach: 'So sieht das Teil von vorne aus.',
    bezug: 'Du ordnest Vorderansicht, Draufsicht und Seitenansicht sicher zu.',
  },
  Draufsicht: {
    fachdefinition: 'Ansicht eines Bauteils von oben.',
    einfach: 'So sieht das Teil von oben aus.',
    bezug: 'Die Draufsicht ergaenzt Informationen, die vorne fehlen koennen.',
  },
  Seitenansicht: {
    fachdefinition: 'Ansicht eines Bauteils von der Seite.',
    einfach: 'So sieht das Teil von links oder rechts aus.',
    bezug: 'Sie hilft, Tiefe und seitliche Konturen zu verstehen.',
  },
  Volllinie: {
    fachdefinition: 'Linienart, die in Zeichnungen typischerweise sichtbare Kanten oder Umrisse darstellt.',
    einfach: 'Eine durchgezogene Linie fuer sichtbare Konturen.',
    bezug: 'Du unterscheidest sie von Strichlinie und Strichpunktlinie.',
  },
  Strichlinie: {
    fachdefinition: 'Unterbrochene Linienart, die je nach Zeichnungsregel verdeckte Kanten darstellen kann.',
    einfach: 'Eine gestrichelte Linie fuer etwas, das nicht direkt sichtbar ist.',
    bezug: 'Im Linienarten-Trainer ordnest du ihre Grundbedeutung zu.',
  },
  Strichpunktlinie: {
    fachdefinition: 'Linienart aus Strichen und Punkten, zum Beispiel fuer Mittellinien nach Zeichnungsregel.',
    einfach: 'Eine Linie mit Strich und Punkt, oft fuer die Mitte.',
    bezug: 'Du erkennst sie als eigene Linienart.',
  },
  Massstab: {
    fachdefinition: 'Verhaeltnis zwischen gezeichneter Darstellung und realer Groesse eines Bauteils.',
    einfach: 'Er sagt, ob die Zeichnung groesser, kleiner oder gleich gross dargestellt ist.',
    bezug: 'Du lernst, dass der Massstab nicht die Masszahl ersetzt.',
  },
  Verkleinerung: {
    fachdefinition: 'Darstellung eines Bauteils kleiner als die reale Groesse.',
    einfach: 'Das Teil ist kleiner gezeichnet als in echt.',
    bezug: 'Massstab 1:2 ist ein Lernbeispiel fuer Verkleinerung.',
  },
  Bemassung: {
    fachdefinition: 'Eintragung von Massen mit Masszahlen, Masslinien, Hilfslinien und Pfeilen in einer technischen Zeichnung.',
    einfach: 'Die Massangaben, die sagen, wie gross etwas sein soll.',
    bezug: 'Du liest Masszahl, Masslinie und Bezug zum Bauteil.',
  },
  Masslinie: {
    fachdefinition: 'Linie einer Bemassung, die den Bezug und die Richtung eines Masses zeigt.',
    einfach: 'Die Linie, an der die Masszahl steht.',
    bezug: 'Sie verbindet die Masszahl mit dem Bauteilbezug.',
  },
  Masszahl: {
    fachdefinition: 'Zahlenangabe eines Masses in der technischen Zeichnung.',
    einfach: 'Die Zahl, die du als Mass liest.',
    bezug: 'Masszahlen werden nicht durch Abmessen am Bildschirm ersetzt.',
  },
  Abmass: {
    fachdefinition: 'Zulaessige Abweichung vom Nennmass, aus der Grenzmasse abgeleitet werden.',
    einfach: 'So weit darf das Mass vom Sollwert abweichen.',
    bezug: 'Du ordnest obere und untere Grenzen einer Toleranzangabe zu.',
  },
  Grenzmass: {
    fachdefinition: 'Oberer oder unterer zulaessiger Masswert eines tolerierten Merkmals.',
    einfach: 'Die Grenze, bis zu der ein Istmass noch erlaubt ist.',
    bezug: 'Im Toleranztrainer unterscheidest du oberes und unteres Grenzmass.',
  },
  Passung: {
    fachdefinition: 'Massliche Beziehung zwischen zusammenwirkenden Teilen, zum Beispiel Welle und Bohrung.',
    einfach: 'Sie sagt, wie zwei Teile zusammenpassen.',
    bezug: 'Du unterscheidest Spiel, Uebergang und Uebermass.',
  },
  Spiel: {
    fachdefinition: 'Zustand einer Passung, bei dem zwischen den gefuegten Teilen Abstand bleibt.',
    einfach: 'Das eine Teil hat Platz im anderen.',
    bezug: 'Spiel kann Beweglichkeit oder leichte Montage ermoeglichen.',
  },
  Uebermass: {
    fachdefinition: 'Zustand einer Passung, bei dem das fuegende Teil groesser ist als die Aufnahme.',
    einfach: 'Das Teil sitzt nicht locker, sondern muss fest gefuegt werden.',
    bezug: 'Du erkennst Uebermass als Gegenstueck zum Spiel.',
  },
  Schnitt: {
    fachdefinition: 'Darstellung eines Bauteils, bei der ein gedachter Schnitt Innenkonturen sichtbar macht.',
    einfach: 'Man schaut gedanklich in das Teil hinein.',
    bezug: 'Schnittdarstellungen helfen, Bohrungen, Hohlraeume und Innenformen zu erkennen.',
  },
  Schraffur: {
    fachdefinition: 'Linienmuster zur Kennzeichnung geschnittener Flaechen in einer Schnittdarstellung.',
    einfach: 'Schraege Linien zeigen, wo Material geschnitten ist.',
    bezug: 'Du unterscheidest geschnittene Flaeche und Hohlraum.',
  },
  Rauheit: {
    fachdefinition: 'Kenngroesse fuer die Beschaffenheit einer Oberflaeche.',
    einfach: 'Sie beschreibt, wie glatt oder rau eine Flaeche sein darf.',
    bezug: 'Oberflaechenangaben werden aus Symbolen und freigegebener Quelle gelesen.',
  },
  Stueckliste: {
    fachdefinition: 'Strukturierte Liste der Teile einer Baugruppe mit Position, Menge, Benennung und weiteren Angaben.',
    einfach: 'Eine Teileliste fuer die Baugruppe.',
    bezug: 'Du findest Positionen, Mengen und Materialangaben.',
  },
  Position: {
    fachdefinition: 'Nummer oder Kennung eines Einzelteils in Zeichnung und Stueckliste.',
    einfach: 'Die Nummer, mit der du ein Teil in der Liste findest.',
    bezug: 'Positionsnummern verbinden Zeichnungsballons mit der Stueckliste.',
  },
  Menge: {
    fachdefinition: 'Anzahl benoetigter gleicher Teile oder Einheiten in einer Stueckliste.',
    einfach: 'Wie oft ein Teil gebraucht wird.',
    bezug: 'Die Menge ist wichtig fuer Materialbereitstellung und Kontrolle.',
  },
  Arbeitsplan: {
    fachdefinition: 'Dokument mit Arbeitsgaengen, Reihenfolge, Betriebsmitteln und Pruefhinweisen fuer die Fertigung.',
    einfach: 'Der Plan, der sagt, welche Arbeitsschritte nacheinander kommen.',
    bezug: 'Du liest Arbeitsfolge, Betriebsmittel und Pruefschritt zusammen.',
  },
  Arbeitsgang: {
    fachdefinition: 'Ein einzelner geplanter Schritt innerhalb eines Arbeitsplans.',
    einfach: 'Ein Arbeitsschritt.',
    bezug: 'Arbeitsgaenge werden in sinnvoller Reihenfolge abgearbeitet.',
  },
  Betriebsmittel: {
    fachdefinition: 'Mittel zur Durchfuehrung eines Arbeitsgangs, zum Beispiel Maschine, Werkzeug, Vorrichtung oder Pruefmittel.',
    einfach: 'Das, was du fuer den Arbeitsschritt brauchst.',
    bezug: 'Betriebsmittel werden vor dem Arbeitsgang geprueft und bereitgestellt.',
  },
  Hohlraum: {
    fachdefinition: 'Innenliegender leerer Bereich oder Aussparung in einem Bauteil.',
    einfach: 'Ein leerer Bereich im Teil.',
    bezug: 'Schnittdarstellungen helfen, Hohlraeume nicht mit Material zu verwechseln.',
  },
  Oberflaechenanforderung: {
    fachdefinition: 'Vorgabe an die Beschaffenheit einer bestimmten Bauteilflaeche.',
    einfach: 'Eine Vorgabe dazu, wie eine Flaeche sein soll.',
    bezug: 'Du pruefst, welche Flaeche gemeint ist und welche Symbolik gilt.',
  },
  Benennung: {
    fachdefinition: 'Name oder Beschreibung eines Teils in Schriftfeld oder Stueckliste.',
    einfach: 'So heisst das Teil.',
    bezug: 'In der Stueckliste verbindet die Benennung Position und Teilbeschreibung.',
  },
  Pruefschritt: {
    fachdefinition: 'Geplanter Schritt zur Kontrolle eines Merkmals oder Arbeitsergebnisses.',
    einfach: 'Der Schritt, bei dem du pruefst.',
    bezug: 'Arbeitsplaene koennen Pruefschritte vor, zwischen oder nach Arbeitsgaengen enthalten.',
  },
  Arbeitsfolge: {
    fachdefinition: 'Geordnete Reihenfolge der Arbeitsgaenge in einem Arbeitsplan.',
    einfach: 'Die Reihenfolge der Arbeitsschritte.',
    bezug: 'Du liest zuerst die Arbeitsfolge, bevor du einzelne Arbeitsgaenge ausfuehrst.',
  },
  Fertigungsauftrag: {
    fachdefinition: 'Betrieblicher Auftrag zur Herstellung einer definierten Menge eines Produkts oder Bauteils nach Vorgaben.',
    einfach: 'Der Auftrag sagt, was hergestellt werden soll.',
    bezug: 'Planung startet mit Teil, Menge, Termin, Material und freigegebener Vorgabe.',
  },
  Materialbedarf: {
    fachdefinition: 'Benoetigte Materialmenge fuer einen Auftrag auf Basis von Stueckliste, Auftragsmenge und freigegebenen Zuschlaegen.',
    einfach: 'So viel Material brauchst du fuer den Auftrag.',
    bezug: 'Materialbedarf wird nicht geschaetzt, sondern aus Auftrag, Stueckliste und Vorgabe abgeleitet.',
  },
  Maschinenbedarf: {
    fachdefinition: 'Notwendige Maschinen- oder Anlagenressource fuer einen Arbeitsgang oder Auftrag.',
    einfach: 'Welche Maschine wird gebraucht?',
    bezug: 'Maschinenbedarf muss zur Arbeitsfolge, Verfuegbarkeit und Befugnis passen.',
  },
  Kapazitaet: {
    fachdefinition: 'Verfuegbare nutzbare Leistung oder Zeit einer Ressource in einem geplanten Zeitraum.',
    einfach: 'Wie viel eine Maschine oder ein Team schaffen kann.',
    bezug: 'Kapazitaet wird mit Belegung, Ruestzeit, Laufzeit und Stillstand abgeglichen.',
  },
  Maschinenbelegung: {
    fachdefinition: 'Zeitliche Zuordnung von Auftraegen, Ruestvorgaengen oder Sperrzeiten zu einer Maschine.',
    einfach: 'Der Kalender der Maschine.',
    bezug: 'Belegung zeigt, ob ein neuer Auftrag in ein Zeitfenster passt.',
  },
  Taktzeit: {
    fachdefinition: 'Zeitabstand, in dem ein Teil fertig werden muss, damit ein Bedarf im verfuegbaren Zeitraum gedeckt wird.',
    einfach: 'Wie oft ein Teil gebraucht wird.',
    bezug: 'Taktzeit wird mit der echten Zykluszeit verglichen.',
  },
  Zykluszeit: {
    fachdefinition: 'Zeit fuer einen vollstaendigen wiederholten Prozesszyklus bis zum naechsten gleichen Zustand.',
    einfach: 'Wie lange der Prozess fuer eine Runde braucht.',
    bezug: 'Zykluszeit bestimmt Ausbringung und muss zur Taktzeit passen.',
  },
  Durchlaufzeit: {
    fachdefinition: 'Gesamtdauer eines Auftrags vom Start bis zur Fertigstellung inklusive Warte-, Ruest-, Bearbeitungs-, Pruef- und Transportzeiten.',
    einfach: 'Wie lange der Auftrag insgesamt durch den Betrieb laeuft.',
    bezug: 'Durchlaufzeit ist mehr als reine Bearbeitungszeit.',
  },
  Stillstandszeit: {
    fachdefinition: 'Zeit, in der eine Maschine oder Anlage nicht produziert, obwohl sie fuer Produktion relevant ist.',
    einfach: 'Die Maschine steht und produziert nicht.',
    bezug: 'Stillstand wird nach geplant, ungeplant, Ursache und Dauer dokumentiert.',
  },
  Liefertermin: {
    fachdefinition: 'Vorgegebener Zeitpunkt, zu dem ein Auftrag, Produkt oder Teil bereitgestellt sein muss.',
    einfach: 'Bis wann etwas fertig sein muss.',
    bezug: 'Liefertermin wird gegen Kapazitaet, Material und Losgroesse geprueft.',
  },
  Losgroesse: {
    fachdefinition: 'Menge gleicher Teile oder Produkte, die zusammen als Auftrag oder Fertigungslos geplant wird.',
    einfach: 'Wie viele gleiche Teile in einem Durchlauf geplant sind.',
    bezug: 'Losgroesse beeinflusst Materialbedarf, Ruestanteil und Terminrisiko.',
  },
  Bestand: {
    fachdefinition: 'Tatsaechlich vorhandene Menge eines Materials, Teils oder Artikels zu einem bestimmten Zeitpunkt.',
    einfach: 'Das, was gerade im Lager da ist.',
    bezug: 'Bestand wird mit Bedarf, Mindestbestand und Meldebestand verglichen.',
  },
  Mindestbestand: {
    fachdefinition: 'Festgelegte Untergrenze eines Lagerbestands, die nicht unterschritten werden soll.',
    einfach: 'So wenig darf moeglichst nicht im Lager uebrig bleiben.',
    bezug: 'Mindestbestand schuetzt vor Materialmangel und muss nach Vorgabe festgelegt sein.',
  },
  Meldebestand: {
    fachdefinition: 'Bestandsgrenze, bei deren Erreichen Nachschub oder Bestellung ausgeloest wird.',
    einfach: 'Wenn dieser Punkt erreicht ist, muss gemeldet oder bestellt werden.',
    bezug: 'Meldebestand verbindet Verbrauch, Lieferzeit und Sicherheitsbestand.',
  },
  Sicherheitsbestand: {
    fachdefinition: 'Reservebestand zum Abfangen von unsicherem Verbrauch, Lieferverzug oder Stoerungen.',
    einfach: 'Ein Puffer, falls etwas nicht wie geplant laeuft.',
    bezug: 'Sicherheitsbestand wird nicht frei verbraucht, sondern nach Lagerregel behandelt.',
  },
  FIFO: {
    fachdefinition: 'First-in-first-out-Prinzip: zuerst eingelagerte freigegebene Ware wird zuerst entnommen.',
    einfach: 'Was zuerst rein kam, geht zuerst raus.',
    bezug: 'FIFO hilft bei Chargen, Haltbarkeit, Materialwechsel und Rueckverfolgung.',
  },
  Kanban: {
    fachdefinition: 'Pull-System, bei dem Verbrauch ueber Karte, Behaelter oder Signal Nachschub ausloest.',
    einfach: 'Wenn etwas verbraucht wird, startet automatisch Nachschub.',
    bezug: 'Kanban braucht feste Regeln zu Menge, Karte, Behaelter und Nachfuellung.',
  },
  Wertschoepfung: {
    fachdefinition: 'Taetigkeit, die ein Produkt oder eine Leistung so veraendert, dass der Kunde den Nutzen wirklich braucht und bezahlt.',
    einfach: 'Arbeit, die dem Kunden wirklich etwas bringt.',
    bezug: 'Im Lean-Block bewertest du Schritte danach, ob sie Nutzen schaffen oder Verschwendung sind.',
  },
  Verschwendung: {
    fachdefinition: 'Taetigkeit oder Zustand, der Ressourcen verbraucht, ohne fuer den Kunden Nutzen zu schaffen.',
    einfach: 'Zeit, Wege oder Material ohne echten Nutzen.',
    bezug: 'Warten, Suchen, Nacharbeit und unnoetige Bewegung sind typische Verschwendungsarten.',
  },
  '5S': {
    fachdefinition: 'Methode zur Ordnung und Standardisierung am Arbeitsplatz: Sortieren, Systematisieren, Saubern, Standardisieren, Selbstdisziplin.',
    einfach: 'Fuenf Schritte fuer einen klaren und sicheren Arbeitsplatz.',
    bezug: '5S wirkt nur, wenn der Standard im Alltag gehalten und kontrolliert wird.',
  },
  Standard: {
    fachdefinition: 'Festgelegte, freigegebene beste bekannte Arbeitsweise, gegen die Abweichungen erkannt werden koennen.',
    einfach: 'Die vereinbarte richtige Art, etwas zu tun.',
    bezug: 'Verbesserungen werden erst wirksam, wenn sie in einen Standard ueberfuehrt werden.',
  },
  Arbeitsplatz: {
    fachdefinition: 'Ort und Umfeld, an dem Material, Werkzeuge, Informationen und Schutzmittel fuer die Arbeit bereitstehen.',
    einfach: 'Dein Platz zum Arbeiten mit allem, was dazu gehoert.',
    bezug: 'Ordnung am Arbeitsplatz ist Teil von Sicherheit, Qualitaet und Lean.',
  },
  Vorschlag: {
    fachdefinition: 'Konkrete Idee zur Verbesserung eines Problems, Ablaufs oder Standards, die im Team bewertet wird.',
    einfach: 'Eine Idee, wie es besser werden kann.',
    bezug: 'Im KVP werden Vorschlaege geprueft, geplant und auf Wirksamkeit getestet.',
  },
  Materialfluss: {
    fachdefinition: 'Weg und Abfolge, auf dem Material, Teile oder Behaelter durch Lager, Bearbeitung und Montage bewegt werden.',
    einfach: 'Wie Material durch den Betrieb wandert.',
    bezug: 'Lean bewertet, ob der Materialfluss Nutzen schafft oder unnoetige Wege erzeugt.',
  },
  Nachschub: {
    fachdefinition: 'Bereitstellung von Material oder Teilen, wenn Verbrauch, Meldebestand oder Kanban-Signal es ausloest.',
    einfach: 'Neues Material kommt nach, wenn es gebraucht wird.',
    bezug: 'Nachschub muss geregelt sein, sonst entstehen Warten oder Ueberbestaende.',
  },
  Sicherheit: {
    fachdefinition: 'Zustand und Verhalten, bei dem Risiken fuer Menschen, Anlage und Umwelt erkannt, reduziert und beherrscht werden.',
    einfach: 'Dass niemand und nichts unnoetig gefaehrdet wird.',
    bezug: 'Ordnung, 5S und klare Ablaeufe unterstuetzen Sicherheit am Arbeitsplatz.',
  },
  OEE: {
    fachdefinition: 'Gesamtanlageneffektivitaet aus Verfuegbarkeit, Leistungsgrad und Qualitaetsrate.',
    einfach: 'Eine Kennzahl, wie wirksam eine Anlage insgesamt arbeitet.',
    bezug: 'OEE zerlegt Verluste in Laufzeit, Leistung und Qualitaet.',
  },
  Verfuegbarkeit: {
    fachdefinition: 'Anteil der geplanten Zeit, in dem eine Anlage tatsaechlich laeuft.',
    einfach: 'Wie viel der geplanten Zeit wirklich produziert wurde.',
    bezug: 'Verfuegbarkeit = Laufzeit / Planzeit nach Betriebsregel.',
  },
  Leistungsgrad: {
    fachdefinition: 'Verhaeltnis von Istleistung zu freigegebener Sollleistung.',
    einfach: 'Ob die Anlage so schnell liefert wie geplant.',
    bezug: 'Leistungsgrad braucht eine klare Sollbasis.',
  },
  Qualitaetsrate: {
    fachdefinition: 'Anteil der Gutmenge an der produzierten Gesamtmenge.',
    einfach: 'Wie gross der Anteil guter Teile ist.',
    bezug: 'Nacharbeit wird nur nach Regel bewertet.',
  },
  Verlust: {
    fachdefinition: 'Abweichung, die Verfuegbarkeit, Leistung oder Qualitaet mindert.',
    einfach: 'Etwas, das Kennzahlen und Nutzen verschlechtert.',
    bezug: 'OEE-Verbesserung startet beim groessten Verlust.',
  },
  Sollleistung: {
    fachdefinition: 'Freigegebene Zielausbringung je Zeit oder Zyklus.',
    einfach: 'Das Leistungssoll der Anlage.',
    bezug: 'Ohne Sollbasis ist der Leistungsgrad nicht belastbar.',
  },
  Produktionsleistung: {
    fachdefinition: 'Ausbringung einer Anlage oder Linie bezogen auf die Zeit.',
    einfach: 'Wie viele Teile in einer Zeit entstehen.',
    bezug: 'Produktionsleistung verbindet Menge und Zeit.',
  },
  gegeben: {
    fachdefinition: 'In der Aufgabe genannte Ausgangswerte.',
    einfach: 'Die Zahlen und Angaben, die du schon hast.',
    bezug: 'Gegebene Werte werden vor dem Rechnen markiert.',
  },
  gesucht: {
    fachdefinition: 'Die Groesse, die in der Aufgabe ermittelt werden soll.',
    einfach: 'Das, was du herausfinden sollst.',
    bezug: 'Gesucht bestimmt Formelwahl und Umstellung.',
  },
  Summe: {
    fachdefinition: 'Ergebnis einer Addition.',
    einfach: 'Das Ergebnis beim Zusammenzaehlen.',
    bezug: 'Summenfehler entstehen oft durch falsche Vorzeichen oder Einheiten.',
  },
  Produkt: {
    fachdefinition: 'Ergebnis einer Multiplikation.',
    einfach: 'Das Ergebnis beim Malnehmen.',
    bezug: 'Produkte brauchen passende Einheiten.',
  },
  Dreisatz: {
    fachdefinition: 'Rechenverfahren fuer proportionale Beziehungen.',
    einfach: 'Wenn sich etwas im gleichen Verhaeltnis aendert.',
    bezug: 'Dreisatz braucht klare Zuordnung der Groessen.',
  },
  Prozent: {
    fachdefinition: 'Anteil bezogen auf Hundert.',
    einfach: 'Wie gross ein Anteil von etwas ist.',
    bezug: 'Prozentrechnung braucht Grundwert und Anteil.',
  },
  Grundwert: {
    fachdefinition: 'Bezugsmenge, auf die ein Prozentanteil bezogen wird.',
    einfach: 'Die Ausgangsmenge bei Prozentrechnung.',
    bezug: 'Ohne Grundwert ist Prozentrechnung nicht moeglich.',
  },
  Anteil: {
    fachdefinition: 'Teil einer Gesamtmenge.',
    einfach: 'Ein Stueck vom Ganzen.',
    bezug: 'Anteile werden oft als Prozent angegeben.',
  },
  Umfang: {
    fachdefinition: 'Laenge der Begrenzung einer Flaeche.',
    einfach: 'Der Randweg um eine Form.',
    bezug: 'Beim Rechteck: zwei mal Laenge plus Breite.',
  },
  Radius: {
    fachdefinition: 'Abstand vom Kreismittelpunkt zum Kreisrand.',
    einfach: 'Die halbe Strecke durch den Kreis.',
    bezug: 'Radius = Durchmesser / 2.',
  },
  Durchmesser: {
    fachdefinition: 'Strecke durch den Kreismittelpunkt von Rand zu Rand.',
    einfach: 'Die volle Breite eines Kreises.',
    bezug: 'Durchmesser = 2 mal Radius.',
  },
  Quader: {
    fachdefinition: 'Koerper mit sechs rechteckigen Seitenflaechen.',
    einfach: 'Ein kastenförmiger Koerper.',
    bezug: 'Volumen Quader = Laenge mal Breite mal Hoehe.',
  },
  Wirkungsgrad: {
    fachdefinition: 'Verhaeltnis von Nutzleistung zu zugefuehrter Leistung.',
    einfach: 'Wie viel von der eingesetzten Energie wirklich nuetzt.',
    bezug: 'Wirkungsgrad liegt unter 1 bzw. unter 100 Prozent.',
  },
  Arbeit: {
    fachdefinition: 'Energieumsatz als Kraft mal Weg oder Leistung mal Zeit.',
    einfach: 'Was ueber eine Strecke oder Zeit verrichtet wird.',
    bezug: 'Arbeit und Leistung muessen in der Formel getrennt bleiben.',
  },
  Hebelarm: {
    fachdefinition: 'Senkrechter Abstand zwischen Kraftwirkungslinie und Drehpunkt.',
    einfach: 'Der Abstand, mit dem eine Kraft dreht.',
    bezug: 'Drehmoment = Kraft mal Hebelarm.',
  },
  Gutmenge: {
    fachdefinition: 'Menge der Teile, die die Qualitaetsanforderung erfuellen.',
    einfach: 'Die guten Teile.',
    bezug: 'Gutmenge fliesst in Qualitaetsrate und Ausschussquote.',
  },
  Ausdehnungskoeffizient: {
    fachdefinition: 'Werkstoffkennwert fuer die relative Laengenaenderung je Temperaturdifferenz.',
    einfach: 'Wie stark sich Material bei Temperatur aendert.',
    bezug: 'Werte nur aus Tabellenbuch oder Datenblatt.',
  },
  Umstellen: {
    fachdefinition: 'Umformen einer Formel, sodass die gesuchte Groesse isoliert steht.',
    einfach: 'Die Formel so drehen, dass das Gesuchte allein steht.',
    bezug: 'Umstellen braucht gleiche Operationen auf beiden Seiten.',
  },
  Plausibilitaet: {
    fachdefinition: 'Pruefung, ob ein Ergebnis groessenordnung und Einheit nach sinnvollen ist.',
    einfach: 'Ob das Ergebnis ueberhaupt passen kann.',
    bezug: 'Plausibilitaet faengt grobe Rechenfehler ab.',
  },
  Ausbildungsvertrag: {
    fachdefinition: 'Vertrag ueber Inhalt, Dauer und Bedingungen einer Ausbildung.',
    einfach: 'Der Vertrag fuer deine Ausbildung.',
    bezug: 'Rechte und Pflichten stehen im Ausbildungsvertrag.',
  },
  Rechte: {
    fachdefinition: 'Rechtlich geschuetzte Ansprueche einer Person.',
    einfach: 'Was dir zusteht.',
    bezug: 'Rechte stehen oft neben Pflichten.',
  },
  Pflichten: {
    fachdefinition: 'Rechtlich oder vertraglich geschuldete Handlungen.',
    einfach: 'Was du tun musst.',
    bezug: 'Pflichten gelten fuer Azubi und Ausbildungsbetrieb.',
  },
  Sorgfalt: {
    fachdefinition: 'Pflicht, Aufgaben gewissenhaft und aufmerksam zu erledigen.',
    einfach: 'Sorgfaeltig und verantwortungsvoll arbeiten.',
    bezug: 'Sorgfalt schuetzt Qualitaet und Sicherheit.',
  },
  Weisung: {
    fachdefinition: 'Anordnung berechtigter Personen im Betrieb im Rahmen der Vorschriften.',
    einfach: 'Eine Anweisung, wie etwas zu tun ist.',
    bezug: 'Weisungen muessen rechtmaessig und zumutbar sein.',
  },
  Probezeit: {
    fachdefinition: 'Anfangszeitraum eines Vertrags mit besonderen Kuendigungsregeln.',
    einfach: 'Die Zeit zum gegenseitigen Kennenlernen.',
    bezug: 'Fristen nicht raten, Quelle lesen.',
  },
  Kuendigung: {
    fachdefinition: 'Einseitige Beendigung eines Vertragsverhaeltnisses.',
    einfach: 'Wenn ein Vertrag beendet wird.',
    bezug: 'Form und Frist sind entscheidend.',
  },
  Frist: {
    fachdefinition: 'Zeitraum, in dem etwas erklaert oder erledigt sein muss.',
    einfach: 'Bis wann etwas gelten oder passieren muss.',
    bezug: 'Fristen kommen aus Vertrag oder Gesetz.',
  },
  Arbeitsvertrag: {
    fachdefinition: 'Vertrag ueber Arbeitsleistung gegen Entgelt.',
    einfach: 'Der Vertrag fuer die Arbeit.',
    bezug: 'Arbeitsvertrag und Ausbildungsvertrag sind zu unterscheiden.',
  },
  Tarifvertrag: {
    fachdefinition: 'Schriftliche Vereinbarung zwischen Tarifparteien zu Arbeitsbedingungen.',
    einfach: 'Regeln, die Gewerkschaft und Arbeitgeberseite aushandeln.',
    bezug: 'Tarifvertrag kann Entgelt und Arbeitszeit regeln.',
  },
  Tarifautonomie: {
    fachdefinition: 'Recht der Tarifparteien, Arbeitsbedingungen unabhaengig vom Staat zu vereinbaren.',
    einfach: 'Dass Tarifpartner selbst verhandeln duerfen.',
    bezug: 'Tarifautonomie gehoert zur Mitbestimmungslandschaft.',
  },
  Betriebsrat: {
    fachdefinition: 'Gewaehlte Interessenvertretung der Beschaeftigten im Betrieb.',
    einfach: 'Die Vertretung der Belegschaft.',
    bezug: 'Betriebsrat wirkt bei vielen betrieblichen Themen mit.',
  },
  Mitbestimmung: {
    fachdefinition: 'Rechtliche Beteiligung von Beschaeftigtenvertretungen an Entscheidungen.',
    einfach: 'Mitreden bei betrieblichen Themen.',
    bezug: 'Mitbestimmung hat klare gesetzliche Grenzen und Rechte.',
  },
  JAV: {
    fachdefinition: 'Jugend- und Auszubildendenvertretung.',
    einfach: 'Die Vertretung junger Beschaeftigter und Azubis.',
    bezug: 'JAV arbeitet mit dem Betriebsrat zusammen.',
  },
  Wahl: {
    fachdefinition: 'Demokratische Bestimmung von Vertretungen.',
    einfach: 'Abstimmung ueber Vertreter.',
    bezug: 'Wahlrechte und -pflichten stehen in den Regeln.',
  },
  Auszubildende: {
    fachdefinition: 'Personen in einer anerkannten Berufsausbildung.',
    einfach: 'Azubis im Betrieb.',
    bezug: 'Ihre Rechte und Pflichten stehen im Ausbildungsvertrag.',
  },
  Sozialversicherung: {
    fachdefinition: 'Gesetzliches Sicherungssystem mit mehreren Versicherungszweigen.',
    einfach: 'Die Pflichtversicherungen fuer soziale Risiken.',
    bezug: 'Typisch: KV, PV, RV, AV und UV.',
  },
  Krankenversicherung: {
    fachdefinition: 'Zweig der Sozialversicherung fuer Krankheitskosten und Absicherung.',
    einfach: 'Versicherung bei Krankheit.',
    bezug: 'Teil der Sozialversicherung.',
  },
  Rentenversicherung: {
    fachdefinition: 'Zweig der Sozialversicherung fuer Alter und Erwerbsminderung.',
    einfach: 'Versicherung fuer die Rente.',
    bezug: 'Teil der Sozialversicherung.',
  },
  Arbeitslosenversicherung: {
    fachdefinition: 'Zweig der Sozialversicherung bei Arbeitslosigkeit.',
    einfach: 'Versicherung bei Verlust des Arbeitsplatzes.',
    bezug: 'Teil der Sozialversicherung.',
  },
  Unfallversicherung: {
    fachdefinition: 'Zweig der Sozialversicherung fuer Arbeits- und Wegeunfaelle.',
    einfach: 'Versicherung bei Arbeitsunfall.',
    bezug: 'Teil der Sozialversicherung.',
  },
  Pflegeversicherung: {
    fachdefinition: 'Zweig der Sozialversicherung fuer Pflegebeduerftigkeit.',
    einfach: 'Versicherung fuer Pflege.',
    bezug: 'Teil der Sozialversicherung.',
  },
  Urlaub: {
    fachdefinition: 'Bezahlte Freistellung von der Arbeit nach Gesetz oder Tarif.',
    einfach: 'Freie Tage zum Erholen.',
    bezug: 'Anspruch und Dauer nicht raten.',
  },
  Entgelt: {
    fachdefinition: 'Verguetung fuer geleistete Arbeit oder Ausbildung.',
    einfach: 'Das Geld fuer die Arbeit.',
    bezug: 'Brutto und Netto unterscheiden.',
  },
  Brutto: {
    fachdefinition: 'Entgelt vor Abzuegen.',
    einfach: 'Das Geld vor Steuern und Sozialabgaben.',
    bezug: 'Brutto steht oft oben auf der Abrechnung.',
  },
  Netto: {
    fachdefinition: 'Entgelt nach Abzuegen.',
    einfach: 'Das Geld, das ausgezahlt wird.',
    bezug: 'Netto = Brutto minus Abzuege.',
  },
  Abzug: {
    fachdefinition: 'Abgesetzter Betrag vom Bruttoentgelt.',
    einfach: 'Was vom Brutto abgezogen wird.',
    bezug: 'Typisch Steuern und Sozialversicherung.',
  },
  Nachhaltigkeit: {
    fachdefinition: 'Wirtschaften so, dass oekonomische, oekologische und soziale Ziele dauerhaft tragfaehig bleiben.',
    einfach: 'Heute so handeln, dass morgen noch geht.',
    bezug: 'Im Betrieb betrifft das Ressourcen, Abfall und Prozesse.',
  },
  Ressourcen: {
    fachdefinition: 'Eingesetzt Mittel wie Material, Energie, Zeit und Personal.',
    einfach: 'Das, was verbraucht oder genutzt wird.',
    bezug: 'Ressourcen sparsam und zielgerichtet einsetzen.',
  },
  Kosten: {
    fachdefinition: 'Bewerteter Ressourcenverbrauch fuer Leistungserstellung.',
    einfach: 'Was etwas kostet.',
    bezug: 'Kosten beeinflussen Wirtschaftlichkeit.',
  },
  Wirtschaftlichkeit: {
    fachdefinition: 'Verhaeltnis von Leistung zu Kosten bzw. Mitteleinsatz.',
    einfach: 'Ob Aufwand und Nutzen gut zusammenpassen.',
    bezug: 'Wirtschaftlichkeit wird mit Kennzahlen bewertet.',
  },
  Produktivitaet: {
    fachdefinition: 'Verhaeltnis von Ausbringung zu eingesetzten Faktoren.',
    einfach: 'Wie viel mit dem Einsatz entsteht.',
    bezug: 'Produktivitaet ist von OEE verwandt, aber nicht identisch.',
  },
  Minimalprinzip: {
    fachdefinition: 'Mit moeglichst geringem Einsatz ein festes Ziel erreichen.',
    einfach: 'Weniger Aufwand fuer dasselbe Ziel.',
    bezug: 'Teil des oekonomischen Prinzips.',
  },
  Maximalprinzip: {
    fachdefinition: 'Mit gegebenem Einsatz den groesstmoeglichen Erfolg erreichen.',
    einfach: 'Mehr Ergebnis aus demselben Einsatz.',
    bezug: 'Teil des oekonomischen Prinzips.',
  },
  Operator: {
    fachdefinition: 'Aufforderungswort in einer Aufgabe, zum Beispiel berechnen, erklaeren, vergleichen.',
    einfach: 'Das Wort, das sagt, was du tun sollst.',
    bezug: 'Operatoren steuern den Loesungsweg.',
  },
  Aufgabe: {
    fachdefinition: 'Gestellte Anforderung mit gegebenen Informationen und gesuchtem Ergebnis.',
    einfach: 'Das, was du loesen sollst.',
    bezug: 'Aufgabe zuerst lesen, dann rechnen.',
  },
  Distraktor: {
    fachdefinition: 'Plausible falsche Antwortoption in Multiple-Choice-Aufgaben.',
    einfach: 'Eine Antwort, die falsch ist, aber verlockend wirkt.',
    bezug: 'Distraktoren werden systematisch ausgeschlossen.',
  },
  Ausschluss: {
    fachdefinition: 'Verfahren, unpassende Optionen schrittweise zu verwerfen.',
    einfach: 'Falsche Antworten streichen.',
    bezug: 'Ausschlussverfahren hilft bei MC-Aufgaben.',
  },
  Kontext: {
    fachdefinition: 'Umgebende Informationen, die einen Begriff oder eine Aufgabe verstaendlich machen.',
    einfach: 'Der Zusammenhang drumherum.',
    bezug: 'Unbekannte Begriffe zuerst aus dem Kontext lesen.',
  },
  Register: {
    fachdefinition: 'Inhalts- oder Stichwortverzeichnis eines Nachschlagewerks.',
    einfach: 'Das Verzeichnis zum Finden von Seiten.',
    bezug: 'Im Tabellenbuch fuehrt das Register zur Fundstelle.',
  },
  Fundstelle: {
    fachdefinition: 'Stelle in einem Nachschlagewerk, an der eine Angabe steht.',
    einfach: 'Wo du die Information findest.',
    bezug: 'Fundstellen nicht aus dem Gedaechtnis erfinden.',
  },
  Zeitbudget: {
    fachdefinition: 'Verfuegbare Zeit fuer Aufgabe, Teil oder gesamte Pruefung.',
    einfach: 'Wie viel Zeit du hast.',
    bezug: 'Zeitbudget steuert die Bearbeitungsreihenfolge.',
  },
  Markierung: {
    fachdefinition: 'Kennzeichnung wichtiger Stellen in Aufgabe oder Unterlage.',
    einfach: 'Etwas sichtbar anstreichen.',
    bezug: 'Markierungen helfen gegen Lesefehler.',
  },
  Prioritaet: {
    fachdefinition: 'Reihenfolge nach Wichtigkeit oder Nutzen.',
    einfach: 'Was zuerst kommt.',
    bezug: 'In der Pruefung zuerst sichere Punkte sichern.',
  },
  Stress: {
    fachdefinition: 'Belastungszustand mit koerperlicher und mentaler Anspannung.',
    einfach: 'Innere Anspannung vor oder in der Pruefung.',
    bezug: 'Routine und Atmung helfen gegen Pruefungsstress.',
  },
  Atemtechnik: {
    fachdefinition: 'Bewusste Atemuebung zur Beruhigung und Konzentration.',
    einfach: 'Ruhig und bewusst atmen.',
    bezug: 'Kurze Atemtechnik vor schwierigen Aufgaben.',
  },
  Routine: {
    fachdefinition: 'Eingeuebter Ablauf, der Sicherheit gibt.',
    einfach: 'Ein gewohnter sicherer Weg.',
    bezug: 'Pruefungsroutine reduziert Angst und Fehler.',
  },
  Falle: {
    fachdefinition: 'Typische Fehlerquelle in Pruefungsaufgaben.',
    einfach: 'Ein Trick oder haeufiger Stolperstein.',
    bezug: 'Fallen erkennst du mit Plausibilitaet und Einheitenkontrolle.',
  },
  Produktionstechnik: {
    fachdefinition: 'Fachlicher Pruefungsbereich zu Fertigung, Maschinen und Prozessen.',
    einfach: 'Der technische Teil der Pruefung.',
    bezug: 'Mini-Pruefungen trainieren gemischte Produktionstechnik.',
  },
  Produktionsplanung: {
    fachdefinition: 'Planung von Mengen, Zeiten, Ressourcen und Terminen.',
    einfach: 'Wie Produktion vorbereitet und gesteuert wird.',
    bezug: 'Mini-Pruefungen verbinden Planung, Lager und OEE.',
  },
  WiSo: {
    fachdefinition: 'Wirtschafts- und Sozialkunde.',
    einfach: 'Der gesellschaftliche und rechtliche Pruefungsteil.',
    bezug: 'WiSo braucht Begriffe und aktuelle Regeln.',
  },
  Wiederholung: {
    fachdefinition: 'Erneutes Ueben von Inhalten nach Fehlern oder Abstand.',
    einfach: 'Nochmal gezielt ueben.',
    bezug: 'Wiederholung folgt Schwachstellen, nicht Zufall.',
  },
  Mastery: {
    fachdefinition: 'Lernstandssystem, das Koennen und Wiederholungsbedarf abbildet.',
    einfach: 'Dein Lernstand je Thema.',
    bezug: 'Mastery steuert Wiederholung und Fortschritt.',
  },
  Schwachstelle: {
    fachdefinition: 'Thema oder Aufgabentyp mit erhoehtem Fehleranteil.',
    einfach: 'Das, was dir noch schwerfaellt.',
    bezug: 'Schwachstellen werden im Lernplan priorisiert.',
  },
  Lernplan: {
    fachdefinition: 'Geplante Reihenfolge von Themen, Uebungen und Wiederholungen.',
    einfach: 'Dein Plan, was du als Naechstes uebst.',
    bezug: 'Lernplan folgt Schwachstellen und Pruefungsterminen.',
  },
  Simulation: {
    fachdefinition: 'Realitaetsnahe Uebung unter pruefungsnahen Bedingungen.',
    einfach: 'Wie eine echte Pruefung ueben.',
    bezug: 'Simulation trainiert Zeit, Strategie und Ausdauer.',
  },
  Ergebnis: {
    fachdefinition: 'Resultierende Groesse einer Berechnung oder Pruefung.',
    einfach: 'Das, was herauskommt.',
    bezug: 'Ergebnis immer mit Einheit und Plausibilitaet pruefen.',
  },
  Formelzeichen: {
    fachdefinition: 'Buchstabe oder Symbol fuer eine physikalische oder technische Groesse.',
    einfach: 'Das Zeichen in der Formel.',
    bezug: 'Formelzeichen muessen zur Einheit passen.',
  },
  Fehler: {
    fachdefinition: 'Abweichung vom Soll oder falsche Bearbeitung.',
    einfach: 'Etwas stimmt nicht.',
    bezug: 'Fehler werden analysiert und wiederholt geuebt.',
  },
  Los: {
    fachdefinition: 'Menge gleicher Teile, die als Auftrag oder Fertigungslos zusammengefasst wird.',
    einfach: 'Eine zusammengehoerende Menge gleicher Teile.',
    bezug: 'Los verbindet Auftrag, Termin und Materialbedarf.',
  },
  Termin: {
    fachdefinition: 'Festgelegter Zeitpunkt fuer Fertigstellung oder Lieferung.',
    einfach: 'Bis wann etwas fertig sein muss.',
    bezug: 'Termine werden gegen Kapazitaet und Material geprueft.',
  },
  Schicht: {
    fachdefinition: 'Zeitabschnitt der Betriebsarbeit mit Uebergabe an die naechste Besetzung.',
    einfach: 'Dein Arbeitsabschnitt im Betrieb.',
    bezug: 'Schichtbeginn braucht Check und Uebergabe.',
  },
  Uebergabe: {
    fachdefinition: 'Informationsweitergabe zwischen Schichten oder Personen zum aktuellen Stand.',
    einfach: 'Was die naechste Schicht wissen muss.',
    bezug: 'Uebergabe verhindert Blindstart.',
  },
  Checkliste: {
    fachdefinition: 'Strukturierte Liste von Pruefpunkten vor Start, Wechsel oder Abschluss.',
    einfach: 'Eine Abhakliste fuer wichtige Punkte.',
    bezug: 'Checklisten machen Vollstaendigkeit pruefbar.',
  },
  Material: {
    fachdefinition: 'Eingangsstoff oder Ausgangsteil fuer die Fertigung.',
    einfach: 'Das, woraus oder womit produziert wird.',
    bezug: 'Material wird gegen Auftrag und Charge geprueft.',
  },
  Einheit: {
    fachdefinition: 'Festgelegte Groesse, mit der ein Messwert eindeutig angegeben wird.',
    einfach: 'Die Einheit sagt, was die Zahl bedeutet.',
    bezug: 'Bei Rechnungen muessen Zahl und Einheit zusammenpassen.',
  },
  Meter: {
    fachdefinition: 'SI-Basiseinheit der Laenge.',
    einfach: 'Eine Grundeinheit fuer Laengen.',
    bezug: 'Meter wird in der Stufenleiter in Zentimeter und Millimeter umgerechnet.',
  },
  Sekunde: {
    fachdefinition: 'SI-Basiseinheit der Zeit.',
    einfach: 'Eine Grundeinheit fuer Zeit.',
    bezug: 'Zeitwerte brauchst du bei Prozesszeiten und Geschwindigkeit.',
  },
  Kilogramm: {
    fachdefinition: 'SI-Basiseinheit der Masse.',
    einfach: 'Eine Grundeinheit dafuer, wie schwer etwas ist.',
    bezug: 'Masse wird spaeter mit Volumen zur Dichte verbunden.',
  },
  Laenge: {
    fachdefinition: 'Ausdehnung in einer Richtung, zum Beispiel Breite, Hoehe, Weg oder Mass.',
    einfach: 'Wie lang etwas ist.',
    bezug: 'Laengen werden haeufig zwischen m, cm und mm umgerechnet.',
  },
  Faktor: {
    fachdefinition: 'Zahl, mit der ein Wert bei einer Umrechnung multipliziert oder dividiert wird.',
    einfach: 'Die Zahl, mit der du umrechnest.',
    bezug: 'Bei Laengen sind typische Faktoren 10, 100 und 1000.',
  },
  Umrechnung: {
    fachdefinition: 'Aenderung eines Werts in eine andere Einheit bei gleicher physikalischer Groesse.',
    einfach: 'Du schreibst denselben Wert in einer anderen Einheit.',
    bezug: 'Vor Formeln muessen die Einheiten zueinander passen.',
  },
  Flaeche: {
    fachdefinition: 'Groesse einer ebenen Ausdehnung, zum Beispiel Rechteckflaeche.',
    einfach: 'Wie gross eine ebene Stelle ist.',
    bezug: 'Rechteckflaechen werden im Lernbeispiel mit Laenge mal Breite berechnet.',
  },
  Quadrat: {
    fachdefinition: 'Flaecheneinheit oder Form mit zwei Laengenrichtungen; Einheiten werden quadratisch angegeben.',
    einfach: 'Bei Flaechen zaehlen zwei Richtungen.',
    bezug: 'Quadratmillimeter zeigt, dass eine Flaeche gemeint ist.',
  },
  Volumen: {
    fachdefinition: 'Rauminhalt eines Koerpers oder Materials.',
    einfach: 'Wie viel Raum etwas einnimmt.',
    bezug: 'Quader-Volumen nutzt Laenge, Breite und Hoehe.',
  },
  Kubik: {
    fachdefinition: 'Hinweis auf eine Volumeneinheit mit drei Laengenrichtungen.',
    einfach: 'Bei Volumen zaehlen drei Richtungen.',
    bezug: 'Kubikmillimeter zeigt, dass ein Rauminhalt gemeint ist.',
  },
  Masse: {
    fachdefinition: 'Physikalische Groesse fuer die Stoffmenge eines Koerpers, im Betrieb oft als Wiegewert genutzt.',
    einfach: 'Wie schwer ein Teil ist.',
    bezug: 'Masse wird mit Volumen zur Dichte in Beziehung gesetzt.',
  },
  Dichte: {
    fachdefinition: 'Verhaeltnis von Masse zu Volumen eines Werkstoffs.',
    einfach: 'Wie schwer ein Material bei gleicher Groesse ist.',
    bezug: 'Dichte hilft, Werkstoffe und Materialangaben einzuordnen.',
  },
  Zeit: {
    fachdefinition: 'Physikalische Groesse fuer Dauer oder Ablauf, gemessen zum Beispiel in Sekunden.',
    einfach: 'Wie lange etwas dauert.',
    bezug: 'Zeit wird fuer Prozessdauer und Geschwindigkeit gebraucht.',
  },
  Geschwindigkeit: {
    fachdefinition: 'Weg pro Zeit.',
    einfach: 'Wie schnell sich etwas bewegt.',
    bezug: 'Im Foerderbandbeispiel wird Geschwindigkeit aus Weg und Zeit gelesen.',
  },
  Temperatur: {
    fachdefinition: 'Zustandsgroesse fuer warm oder kalt, im Prozess als Vorgabe oder Messwert genutzt.',
    einfach: 'Wie warm oder kalt etwas ist.',
    bezug: 'Temperaturen beeinflussen viele Fertigungs- und Pruefprozesse.',
  },
  'Grad Celsius': {
    fachdefinition: 'Im Betrieb haeufig verwendete Temperatureinheit fuer Prozess- und Umgebungswerte.',
    einfach: 'Eine uebliche Einheit fuer Temperaturangaben.',
    bezug: 'Prozessangaben koennen in Grad Celsius vorgegeben sein.',
  },
  'Delta T': {
    fachdefinition: 'Temperaturdifferenz zwischen zwei Temperaturwerten.',
    einfach: 'Der Unterschied zwischen zwei Temperaturen.',
    bezug: 'Delta T hilft, Erwaermung oder Abkuehlung zu beschreiben.',
  },
  Vorgabe: {
    fachdefinition: 'Verbindliche Angabe aus Zeichnung, Arbeitsplan, Datenblatt, Betriebsanweisung oder Unterweisung.',
    einfach: 'Das, woran du dich halten musst.',
    bezug: 'Bei Prozesswerten wie Temperatur wird nicht geraten, sondern die Vorgabe geprueft.',
  },
};

/**
 * Macht Fachbegriff-Chips interaktiv und zeigt Definitionen in einem Drawer.
 */
export function InteraktiveBegriffListe({ begriffe, definitionen = {}, className }: InteraktiveBegriffListeProps) {
  const [aktiverBegriff, setAktiverBegriff] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aktiverEintrag = aktiverBegriff ? holeBegriffInfo(aktiverBegriff, definitionen) : null;

  React.useEffect(() => {
    /**
     * Schliesst den Glossar-Drawer mit Escape.
     */
    function schliesseMitEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') setAktiverBegriff(null);
    }

    if (!aktiverBegriff) return;
    document.addEventListener('keydown', schliesseMitEscape);
    return () => document.removeEventListener('keydown', schliesseMitEscape);
  }, [aktiverBegriff]);

  return (
    <section className={cn('mb-4', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <h3 id={`${beschreibungId}-titel`} className="mb-2 text-label font-bold text-fg">
        Fachbegriffe
      </h3>
      <div className="flex flex-wrap gap-2">
        {begriffe.map((begriff) => (
          <button
            key={begriff}
            type="button"
            className="inline-flex min-h-touch items-center rounded-full border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-fg underline-offset-2 hover:border-primary hover:text-primary focus:outline-none focus:ring-3 focus:ring-primary/35"
            aria-haspopup="dialog"
            onClick={() => setAktiverBegriff(begriff)}
          >
            {begriff}
          </button>
        ))}
      </div>

      {aktiverBegriff && aktiverEintrag && (
        <div className="fixed inset-0 z-50 bg-black/35 p-4" role="presentation" onClick={() => setAktiverBegriff(null)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${beschreibungId}-drawer-title`}
            className="ms-auto flex h-full w-full max-w-md flex-col rounded-lg border border-border bg-surface p-5 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-caption font-semibold uppercase tracking-wide text-primary">Glossar</p>
                <h4 id={`${beschreibungId}-drawer-title`} className="mt-1 text-h3 font-bold text-fg">
                  {aktiverBegriff}
                </h4>
              </div>
              <Button variante="sekundaer" className="min-h-touch" onClick={() => setAktiverBegriff(null)}>
                Schliessen
              </Button>
            </div>

            <div className="space-y-4 overflow-y-auto text-body-sm text-fg">
              <GlossarAbschnitt titel="Fachlich" text={aktiverEintrag.fachdefinition} />
              <GlossarAbschnitt titel="Einfach" text={aktiverEintrag.einfach} />
              <GlossarAbschnitt titel="In dieser Lerneinheit" text={aktiverEintrag.bezug} />
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

/**
 * Rendert einen strukturierten Mini-Wissenscheck mit MC-Daten, die spaeter in Mastery importierbar sind.
 */
export function MiniWissenscheck({
  id,
  fragen,
  titel = 'Mini-Wissenscheck',
  masteryHinweis = 'Dieser Demo-Check speichert noch keinen Fortschritt. Die IDs sind fuer den spaeteren Import in Fragen/Mastery vorbereitet.',
  className,
}: MiniWissenscheckProps) {
  validiereMiniWissenscheck(id, fragen);
  const [frageIndex, setFrageIndex] = React.useState(0);
  const [gewaehltId, setGewaehltId] = React.useState<string | null>(null);
  const [beantwortet, setBeantwortet] = React.useState(false);
  const [richtig, setRichtig] = React.useState(0);
  const beschreibungId = React.useId();
  const feedbackId = React.useId();
  const frage = holeAktuelleMiniWissenscheckFrage(fragen, frageIndex);
  const gewaehlteOption = frage.optionen.find((option) => option.id === gewaehltId) ?? null;
  const richtigeOption = frage.optionen.find((option) => option.istKorrekt);
  const istLetzteFrage = frageIndex === fragen.length - 1;
  const istFertig = beantwortet && istLetzteFrage;
  const prozent = Math.round(((frageIndex + (beantwortet ? 1 : 0)) / fragen.length) * 100);

  /**
   * Bewertet die gewaehlte Option lokal und zeigt Feedback.
   */
  function pruefen(): void {
    if (!gewaehlteOption || beantwortet) return;
    setBeantwortet(true);
    if (gewaehlteOption.istKorrekt) setRichtig((wert) => wert + 1);
  }

  /**
   * Wechselt zur naechsten Frage und setzt die Auswahl zurueck.
   */
  function weiter(): void {
    if (!beantwortet) return;
    if (istLetzteFrage) return;
    setFrageIndex((wert) => wert + 1);
    setGewaehltId(null);
    setBeantwortet(false);
  }

  /**
   * Startet den lokalen Demo-Check neu.
   */
  function neuStarten(): void {
    setFrageIndex(0);
    setGewaehltId(null);
    setBeantwortet(false);
    setRichtig(0);
  }

  return (
    <section
      className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)}
      aria-labelledby={`${beschreibungId}-titel`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">
            {titel}
          </h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Frage {frageIndex + 1} von {fragen.length}. Ziel wie im Mastery-System: sicher richtig beantworten und Fehler sofort verbessern.
          </p>
        </div>
        <Badge variante={istFertig ? 'success' : 'primary'} symbol={istFertig ? '=' : '?'}>
          {istFertig ? `${richtig}/${fragen.length} richtig` : 'Mastery-ready'}
        </Badge>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-border" aria-hidden="true">
        <div className="h-full rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-DEFAULT" style={{ width: `${prozent}%` }} />
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-caption font-semibold uppercase tracking-wide text-fg-muted">{frage.masterySchluessel}</p>
        <p className="mt-2 text-body font-bold leading-snug text-fg">{frage.aufgabenstellung}</p>

        <div className="mt-4 space-y-2">
          {frage.optionen.map((option) => {
            const istGewaehlt = option.id === gewaehltId;
            const sollKorrektMarkieren = beantwortet && option.istKorrekt;
            const istFalschGewaehlt = beantwortet && istGewaehlt && !option.istKorrekt;
            return (
              <button
                key={option.id}
                type="button"
                disabled={beantwortet}
                aria-pressed={istGewaehlt}
                className={cn(
                  'flex w-full min-h-touch items-start gap-2 rounded-lg border bg-surface p-3 text-start text-body-sm motion-safe:transition',
                  !beantwortet && istGewaehlt && 'border-primary ring-3 ring-primary/30',
                  !beantwortet && !istGewaehlt && 'border-border hover:border-primary',
                  sollKorrektMarkieren && 'border-success-border bg-success-bg text-fg',
                  istFalschGewaehlt && 'border-danger-border bg-danger-bg text-fg',
                )}
                onClick={() => setGewaehltId(option.id)}
              >
                <span aria-hidden="true" className="mt-0.5 font-bold">
                  {sollKorrektMarkieren ? '=' : istFalschGewaehlt ? 'x' : 'o'}
                </span>
                <span>{option.text}</span>
              </button>
            );
          })}
        </div>

        {beantwortet && gewaehlteOption && richtigeOption && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              'mt-4 rounded-lg border p-3 text-body-sm',
              gewaehlteOption.istKorrekt ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45',
            )}
          >
            <p className="font-bold">{gewaehlteOption.istKorrekt ? 'Richtig.' : 'Noch nicht richtig.'}</p>
            <p className="mt-1 text-fg-muted">{gewaehlteOption.erklaerung}</p>
            {!gewaehlteOption.istKorrekt && <p className="mt-2 text-fg-muted">Richtig waere: {richtigeOption.text}</p>}
            {frage.tabellenbuchHinweis && <p className="mt-2 text-caption text-fg-muted">{frage.tabellenbuchHinweis}</p>}
          </div>
        )}
      </div>

      <p id={feedbackId} aria-live="polite" className="sr-only">
        {beantwortet && gewaehlteOption
          ? gewaehlteOption.istKorrekt
            ? 'Antwort richtig.'
            : 'Antwort noch nicht richtig.'
          : 'Noch keine Antwort geprueft.'}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-caption text-fg-muted">{masteryHinweis}</p>
        {!beantwortet && (
          <Button className="min-h-touch" onClick={pruefen} disabled={!gewaehltId}>
            Antwort pruefen
          </Button>
        )}
        {beantwortet && !istLetzteFrage && (
          <Button className="min-h-touch" onClick={weiter}>
            Naechste Frage
          </Button>
        )}
        {istFertig && (
          <Button className="min-h-touch" onClick={neuStarten}>
            Nochmal ueben
          </Button>
        )}
      </div>
    </section>
  );
}

/**
 * Trainiert den sicheren Startblick auf Auftrag, Material, Maschine, Pruefung und Rueckmeldung.
 */
export function ProduktionsStartcheck({ titel = 'Startcheck Produktion', className }: ProduktionsStartcheckProps) {
  const [auswahl, setAuswahl] = React.useState<Set<string>>(() => new Set());
  const beschreibungId = React.useId();
  const feedbackId = React.useId();
  const istVollstaendig = STARTCHECK_PUNKTE.every((punkt) => auswahl.has(punkt));

  /**
   * Schaltet einen Checkpunkt ein oder aus.
   */
  function umschalten(punkt: string): void {
    setAuswahl((aktuell) => {
      const naechsteAuswahl = new Set(aktuell);
      if (naechsteAuswahl.has(punkt)) {
        naechsteAuswahl.delete(punkt);
      } else {
        naechsteAuswahl.add(punkt);
      }
      return naechsteAuswahl;
    });
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">
            {titel}
          </h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Hake ab, was du vor einem sicheren Produktionsstart klaeren musst.
          </p>
        </div>
        <Badge variante={istVollstaendig ? 'success' : 'warning'} symbol={istVollstaendig ? '=' : '!'}>
          {auswahl.size}/{STARTCHECK_PUNKTE.length}
        </Badge>
      </div>

      <div className="grid gap-2">
        {STARTCHECK_PUNKTE.map((punkt) => {
          const aktiv = auswahl.has(punkt);
          return (
            <button
              key={punkt}
              type="button"
              aria-pressed={aktiv}
              className={cn(
                'flex min-h-touch w-full items-center gap-3 rounded-lg border p-3 text-start text-body-sm motion-safe:transition',
                aktiv ? 'border-success-border bg-success-bg/45 text-fg' : 'border-border bg-bg-subtle text-fg hover:border-primary',
              )}
              onClick={() => umschalten(punkt)}
            >
              <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-caption font-bold">
                {aktiv ? '=' : '+'}
              </span>
              <span>{punkt}</span>
            </button>
          );
        })}
      </div>

      <div
        id={feedbackId}
        role="status"
        aria-live="polite"
        className={cn('mt-4 rounded-lg border p-3 text-body-sm', istVollstaendig ? 'border-success-border bg-success-bg/45' : 'border-info-border bg-info-bg/40')}
      >
        <p className="font-bold">{istVollstaendig ? 'Startblick vollstaendig.' : 'Noch nicht vollstaendig.'}</p>
        <p className="mt-1 text-fg-muted">
          {istVollstaendig
            ? 'Du hast Auftrag, Material, Maschine, Pruefung und Rueckmeldung im Blick.'
            : 'Vor dem Start muessen alle Punkte geklaert sein. Bei Unsicherheit wird nachgefragt.'}
        </p>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung typischer Situationen zu Aufgaben der Maschinenfuehrung.
 */
export function RollenEntscheider({ titel = 'Rollenentscheidung trainieren', className }: RollenEntscheiderProps) {
  const [szenarioIndex, setSzenarioIndex] = React.useState(0);
  const [gewaehlteRolle, setGewaehlteRolle] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const feedbackId = React.useId();
  const szenario = ROLLEN_SZENARIEN[szenarioIndex];
  if (!szenario) throw new Error('RollenEntscheider konnte kein Szenario finden.');
  const istRichtig = gewaehlteRolle === null ? null : gewaehlteRolle === szenario.richtigeRolle;

  /**
   * Springt zum naechsten Szenario und leert die Auswahl.
   */
  function naechstesSzenario(): void {
    setSzenarioIndex((index) => (index + 1) % ROLLEN_SZENARIEN.length);
    setGewaehlteRolle(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">
            {titel}
          </h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Waehle, welche Rollenaufgabe in der Situation zuerst im Vordergrund steht.
          </p>
        </div>
        <Badge variante="primary" symbol="?">
          Fall {szenarioIndex + 1}/{ROLLEN_SZENARIEN.length}
        </Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold leading-snug text-fg">{szenario.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {ROLLEN_OPTIONEN.map((rolle) => (
            <Button
              key={rolle}
              variante={gewaehlteRolle === rolle ? 'primary' : 'sekundaer'}
              className="min-h-touch"
              aria-pressed={gewaehlteRolle === rolle}
              onClick={() => setGewaehlteRolle(rolle)}
            >
              {rolle}
            </Button>
          ))}
        </div>
      </div>

      <RollenFeedback
        feedbackId={feedbackId}
        istRichtig={istRichtig}
        gewaehlteRolle={gewaehlteRolle}
        richtigeRolle={szenario.richtigeRolle}
        begruendung={szenario.begruendung}
      />

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechstesSzenario}>
          Naechster Fall
        </Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die sichere Reihenfolge des Meldewegs bei Stoerungen.
 */
export function MeldewegTrainer({ titel = 'Meldeweg-Reihenfolge trainieren', className }: MeldewegTrainerProps) {
  const [auswahl, setAuswahl] = React.useState<string[]>([]);
  const beschreibungId = React.useId();
  const feedbackId = React.useId();
  const naechsterSchritt = MELDEWEG_SCHRITTE[auswahl.length] ?? null;
  const istFertig = auswahl.length === MELDEWEG_SCHRITTE.length;

  /**
   * Fuegt einen Schritt hinzu, wenn er noch nicht gewaehlt wurde.
   */
  function waehleSchritt(schritt: string): void {
    if (auswahl.includes(schritt) || istFertig) return;
    setAuswahl((aktuell) => [...aktuell, schritt]);
  }

  /**
   * Setzt den Trainer auf den Anfang zurueck.
   */
  function zuruecksetzen(): void {
    setAuswahl([]);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">
            {titel}
          </h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Klicke die Schritte in der sicheren Reihenfolge an.
          </p>
        </div>
        <Badge variante={istFertig ? 'success' : 'primary'} symbol={istFertig ? '=' : '>'}>
          {auswahl.length}/{MELDEWEG_SCHRITTE.length}
        </Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-5">
        {MELDEWEG_SCHRITTE.map((schritt) => {
          const position = auswahl.indexOf(schritt);
          const gewaehlt = position >= 0;
          const istNaechster = schritt === naechsterSchritt;
          return (
            <button
              key={schritt}
              type="button"
              disabled={gewaehlt}
              className={cn(
                'min-h-touch rounded-lg border p-3 text-center text-body-sm font-semibold motion-safe:transition',
                gewaehlt && 'border-success-border bg-success-bg/45 text-fg',
                !gewaehlt && istNaechster && 'border-primary bg-primary-subtle/45 text-fg hover:border-primary',
                !gewaehlt && !istNaechster && 'border-border bg-bg-subtle text-fg hover:border-primary',
              )}
              onClick={() => waehleSchritt(schritt)}
            >
              <span className="block text-caption text-fg-muted">{gewaehlt ? `${position + 1}. Schritt` : 'offen'}</span>
              {schritt}
            </button>
          );
        })}
      </div>

      <div
        id={feedbackId}
        role="status"
        aria-live="polite"
        className={cn('mt-4 rounded-lg border p-3 text-body-sm', istFertig ? 'border-success-border bg-success-bg/45' : 'border-info-border bg-info-bg/40')}
      >
        <p className="font-bold">{istFertig ? 'Meldeweg komplett.' : `Naechster sicherer Schritt: ${naechsterSchritt ?? 'fertig'}`}</p>
        <p className="mt-1 text-fg-muted">
          {istFertig
            ? 'Die Grundlogik stimmt: erkennen, sichern, melden, sperren und dokumentieren.'
            : 'Wenn die betriebliche Anweisung abweicht, gilt immer die freigegebene Vorgabe.'}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={zuruecksetzen}>
          Zuruecksetzen
        </Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das Erkennen typischer Gefahrstellen in einer Werkhallensituation.
 */
export function GefahrstellenTrainer({ titel = 'Gefahrstellen markieren', className }: GefahrstellenTrainerProps) {
  const [auswahl, setAuswahl] = React.useState<Set<string>>(() => new Set());
  const beschreibungId = React.useId();
  const istFertig = GEFAHRSTELLEN.every((stelle) => auswahl.has(stelle.id));

  /**
   * Schaltet eine Gefahrstelle ein oder aus.
   */
  function umschalten(id: string): void {
    setAuswahl((aktuell) => {
      const naechsteAuswahl = new Set(aktuell);
      if (naechsteAuswahl.has(id)) naechsteAuswahl.delete(id);
      else naechsteAuswahl.add(id);
      return naechsteAuswahl;
    });
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Markiere alle typischen Gefahrstellen, die du vor dem Arbeiten beachten musst.
          </p>
        </div>
        <Badge variante={istFertig ? 'success' : 'warning'} symbol={istFertig ? '=' : '!'}>
          {auswahl.size}/{GEFAHRSTELLEN.length}
        </Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {GEFAHRSTELLEN.map((stelle) => {
          const aktiv = auswahl.has(stelle.id);
          return (
            <button
              key={stelle.id}
              type="button"
              aria-pressed={aktiv}
              className={cn(
                'min-h-touch rounded-lg border p-3 text-start text-body-sm motion-safe:transition',
                aktiv ? 'border-success-border bg-success-bg/45' : 'border-border bg-bg-subtle hover:border-primary',
              )}
              onClick={() => umschalten(stelle.id)}
            >
              <span className="block font-bold text-fg">{stelle.label}</span>
              <span className="mt-1 block text-fg-muted">{stelle.beschreibung}</span>
            </button>
          );
        })}
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istFertig ? 'border-success-border bg-success-bg/45' : 'border-info-border bg-info-bg/40')}>
        <p className="font-bold">{istFertig ? 'Alle Gefahrstellen erkannt.' : 'Noch nicht alle Gefahrstellen markiert.'}</p>
        <p className="mt-1 text-fg-muted">Echte Maschinen werden immer nach Unterweisung, Schutzkonzept und Betriebsanweisung beurteilt.</p>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung von PSA zu typischen Situationen.
 */
export function PsaZuordnung({ titel = 'PSA passend zuordnen', className }: PsaZuordnungProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = PSA_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('PsaZuordnung konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Zeigt die naechste PSA-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % PSA_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die PSA, die in der Situation zuerst naheliegt.</p>
        </div>
        <Badge variante="primary" symbol="?">Fall {aufgabenIndex + 1}/{PSA_AUFGABEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {PSA_OPTIONEN.map((option) => (
            <Button
              key={option}
              variante={auswahl === option ? 'primary' : 'sekundaer'}
              className="min-h-touch"
              aria-pressed={auswahl === option}
              onClick={() => setAuswahl(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine PSA.' : istRichtig ? 'Richtig zugeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Entscheidend bleibt die freigegebene Betriebsanweisung.</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Fall</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Unterscheidung von Gebots-, Verbots- und Warnzeichen.
 */
export function SicherheitszeichenTrainer({ titel = 'Sicherheitszeichen unterscheiden', className }: SicherheitszeichenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = SICHERHEITSZEICHEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('SicherheitszeichenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Zeigt die naechste Zeichen-Aufgabe.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % SICHERHEITSZEICHEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die Beschreibung der richtigen Zeichenart zu.</p>
        </div>
        <Badge variante="primary" symbol="?">Zeichen {aufgabenIndex + 1}/{SICHERHEITSZEICHEN_AUFGABEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.text}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {SICHERHEITSZEICHEN_OPTIONEN.map((option) => (
            <Button
              key={option}
              variante={auswahl === option ? 'primary' : 'sekundaer'}
              className="min-h-touch"
              aria-pressed={auswahl === option}
              onClick={() => setAuswahl(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Zeichenart.' : istRichtig ? 'Richtig erkannt.' : 'Noch nicht richtig.'}</p>
        <p className="mt-1 text-fg-muted">Richtig ist: {aufgabe.korrekt}. Am Arbeitsplatz zaehlt immer das konkrete Schild und die Unterweisung.</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechstes Zeichen</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die sichere Entscheidung rund um Not-Halt, Melden und Reset.
 */
export function NotHaltSzenarioTrainer({ titel = 'Not-Halt-Szenarien trainieren', className }: NotHaltSzenarioTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = NOT_HALT_SZENARIEN[aufgabenIndex];
  if (!aufgabe) throw new Error('NotHaltSzenarioTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zum naechsten Not-Halt-Szenario und leert die Auswahl.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % NOT_HALT_SZENARIEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Entscheide, was in der Situation sicher zuerst passt.
          </p>
        </div>
        <Badge variante="danger" symbol="!">Fall {aufgabenIndex + 1}/{NOT_HALT_SZENARIEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {NOT_HALT_OPTIONEN.map((option) => (
            <Button
              key={option}
              variante={auswahl === option ? 'primary' : 'sekundaer'}
              className="min-h-touch"
              aria-pressed={auswahl === option}
              onClick={() => setAuswahl(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Sichere Entscheidung.' : 'Noch nicht sicher.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Fall</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das Erkennen und Bewerten einfacher Schutzeinrichtungs-Situationen.
 */
export function SchutzeinrichtungTrainer({ titel = 'Schutzeinrichtungen beurteilen', className }: SchutzeinrichtungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = SCHUTZEINRICHTUNG_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('SchutzeinrichtungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Zeigt die naechste Schutzeinrichtungs-Aufgabe.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % SCHUTZEINRICHTUNG_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Ordne die Situation der richtigen Schutzlogik zu.
          </p>
        </div>
        <Badge variante="primary" symbol="?">Schutz {aufgabenIndex + 1}/{SCHUTZEINRICHTUNG_AUFGABEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.text}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {SCHUTZEINRICHTUNG_OPTIONEN.map((option) => (
            <Button
              key={option}
              variante={auswahl === option ? 'primary' : 'sekundaer'}
              className="min-h-touch"
              aria-pressed={auswahl === option}
              onClick={() => setAuswahl(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Schutzlogik.' : istRichtig ? 'Richtig beurteilt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.erklaerung}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert sichere Entscheidungen an Einzugsstellen, Quetschstellen und Gefahrbereichen.
 */
export function GefahrbereichTrainer({ titel = 'Gefahrbereich sicher einschaetzen', className }: GefahrbereichTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = GEFAHRBEREICH_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('GefahrbereichTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Zeigt die naechste Gefahrbereich-Aufgabe.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % GEFAHRBEREICH_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Waehle die sichere Reaktion auf die Gefahr im Maschinenbereich.
          </p>
        </div>
        <Badge variante="warning" symbol="!">Gefahr {aufgabenIndex + 1}/{GEFAHRBEREICH_AUFGABEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {GEFAHRBEREICH_OPTIONEN.map((option) => (
            <Button
              key={option}
              variante={auswahl === option ? 'primary' : 'sekundaer'}
              className="min-h-touch"
              aria-pressed={auswahl === option}
              onClick={() => setAuswahl(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Reaktion.' : istRichtig ? 'Sicher reagiert.' : 'Gefaehrliche Reaktion.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Gefahr</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Grundreihenfolge gegen unbeabsichtigtes Wiedereinschalten.
 */
export function WiedereinschaltenTrainer({ titel = 'Sicherungsfolge trainieren', className }: WiedereinschaltenTrainerProps) {
  const [gewaehlteSchritte, setGewaehlteSchritte] = React.useState<string[]>([]);
  const beschreibungId = React.useId();
  const feedbackId = React.useId();
  const istFertig = gewaehlteSchritte.length === WIEDEREINSCHALTEN_SCHRITTE.length;
  const naechsterSchritt = WIEDEREINSCHALTEN_SCHRITTE[gewaehlteSchritte.length] ?? null;

  /**
   * Nimmt den naechsten passenden Schritt in die Reihenfolge auf.
   */
  function waehleSchritt(schritt: string): void {
    if (schritt !== naechsterSchritt || gewaehlteSchritte.includes(schritt)) return;
    setGewaehlteSchritte((aktuell) => [...aktuell, schritt]);
  }

  /**
   * Leert die lokale Uebungsreihenfolge.
   */
  function zuruecksetzen(): void {
    setGewaehlteSchritte([]);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Waehle die Sicherungsschritte in der Grundreihenfolge.
          </p>
        </div>
        <Badge variante={istFertig ? 'success' : 'warning'} symbol={istFertig ? '=' : '!'}>
          {gewaehlteSchritte.length}/{WIEDEREINSCHALTEN_SCHRITTE.length}
        </Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-5">
        {WIEDEREINSCHALTEN_SCHRITTE.map((schritt) => {
          const gewaehlt = gewaehlteSchritte.includes(schritt);
          const istNaechster = schritt === naechsterSchritt;
          const position = gewaehlteSchritte.indexOf(schritt);
          return (
            <button
              key={schritt}
              type="button"
              disabled={gewaehlt}
              className={cn(
                'min-h-touch rounded-lg border p-3 text-center text-body-sm font-semibold motion-safe:transition',
                gewaehlt && 'border-success-border bg-success-bg/45 text-fg',
                !gewaehlt && istNaechster && 'border-primary bg-primary-subtle/45 text-fg hover:border-primary',
                !gewaehlt && !istNaechster && 'border-border bg-bg-subtle text-fg hover:border-primary',
              )}
              onClick={() => waehleSchritt(schritt)}
            >
              <span className="block text-caption text-fg-muted">{gewaehlt ? `${position + 1}. Schritt` : 'offen'}</span>
              {schritt}
            </button>
          );
        })}
      </div>

      <div id={feedbackId} role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istFertig ? 'border-success-border bg-success-bg/45' : 'border-info-border bg-info-bg/40')}>
        <p className="font-bold">{istFertig ? 'Sicherungsfolge komplett.' : `Naechster sicherer Schritt: ${naechsterSchritt ?? 'fertig'}`}</p>
        <p className="mt-1 text-fg-muted">Diese Uebung zeigt die Grundidee. Betriebliche LOTO-/Freischaltvorgaben bleiben verbindlich.</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={zuruecksetzen}>Zuruecksetzen</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Reihenfolge der fuenf Sicherheitsregeln als Lernfolge.
 */
export function SicherheitsregelnTrainer({ titel = 'Fuenf Sicherheitsregeln sortieren', className }: SicherheitsregelnTrainerProps) {
  const [gewaehlteSchritte, setGewaehlteSchritte] = React.useState<string[]>([]);
  const beschreibungId = React.useId();
  const istFertig = gewaehlteSchritte.length === SICHERHEITSREGELN_SCHRITTE.length;
  const naechsterSchritt = SICHERHEITSREGELN_SCHRITTE[gewaehlteSchritte.length] ?? null;

  /**
   * Fuegt den naechsten korrekten Sicherheitsregel-Schritt hinzu.
   */
  function waehleSchritt(schritt: string): void {
    if (schritt !== naechsterSchritt || gewaehlteSchritte.includes(schritt)) return;
    setGewaehlteSchritte((aktuell) => [...aktuell, schritt]);
  }

  /**
   * Startet die Sortieruebung neu.
   */
  function zuruecksetzen(): void {
    setGewaehlteSchritte([]);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Sortiere die Lernkarten in der bekannten Reihenfolge.
          </p>
        </div>
        <Badge variante={istFertig ? 'success' : 'primary'} symbol={istFertig ? '=' : '?'}>
          {gewaehlteSchritte.length}/{SICHERHEITSREGELN_SCHRITTE.length}
        </Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-5">
        {SICHERHEITSREGELN_SCHRITTE.map((schritt) => {
          const gewaehlt = gewaehlteSchritte.includes(schritt);
          return (
            <button
              key={schritt}
              type="button"
              disabled={gewaehlt}
              className={cn(
                'min-h-touch rounded-lg border p-3 text-center text-body-sm font-semibold motion-safe:transition',
                gewaehlt ? 'border-success-border bg-success-bg/45' : 'border-border bg-bg-subtle hover:border-primary',
              )}
              onClick={() => waehleSchritt(schritt)}
            >
              <span className="block text-caption text-fg-muted">{gewaehlt ? `${gewaehlteSchritte.indexOf(schritt) + 1}. Regel` : 'offen'}</span>
              {schritt}
            </button>
          );
        })}
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istFertig ? 'border-success-border bg-success-bg/45' : 'border-info-border bg-info-bg/40')}>
        <p className="font-bold">{istFertig ? 'Reihenfolge komplett.' : `Naechste Karte: ${naechsterSchritt ?? 'fertig'}`}</p>
        <p className="mt-1 text-fg-muted">Die Uebung ersetzt keine elektrotechnische Unterweisung und keine Arbeitsfreigabe.</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={zuruecksetzen}>Zuruecksetzen</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert sichere Entscheidungen beim Werkzeugwechsel.
 */
export function WerkzeugwechselTrainer({ titel = 'Werkzeugwechsel sicher entscheiden', className }: WerkzeugwechselTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = WERKZEUGWECHSEL_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('WerkzeugwechselTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zum naechsten Werkzeugwechsel-Fall.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % WERKZEUGWECHSEL_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die sichere Reaktion vor oder nach dem Wechsel.</p>
        </div>
        <Badge variante="warning" symbol="!">Fall {aufgabenIndex + 1}/{WERKZEUGWECHSEL_AUFGABEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {WERKZEUGWECHSEL_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Reaktion.' : istRichtig ? 'Sicher entschieden.' : 'Noch nicht sicher.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Fall</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Meldeentscheidungen bei Unfall und Beinaheunfall.
 */
export function UnfallMeldeTrainer({ titel = 'Unfallmeldung trainieren', className }: UnfallMeldeTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = UNFALL_MELDE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('UnfallMeldeTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Unfall- oder Beinaheunfall-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % UNFALL_MELDE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Entscheide, wie du die Situation sicher behandelst.</p>
        </div>
        <Badge variante="danger" symbol="!">Meldung {aufgabenIndex + 1}/{UNFALL_MELDE_AUFGABEN.length}</Badge>
      </div>

      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {UNFALL_MELDE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>

      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig gemeldet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Grundfolge fuer betriebliche Abfallwege.
 */
export function AbfallwegTrainer({ titel = 'Abfallweg sortieren', className }: AbfallwegTrainerProps) {
  const [gewaehlteSchritte, setGewaehlteSchritte] = React.useState<string[]>([]);
  const beschreibungId = React.useId();
  const istFertig = gewaehlteSchritte.length === ABFALLWEGE.length;
  const naechsterSchritt = ABFALLWEGE[gewaehlteSchritte.length] ?? null;

  /**
   * Fuegt den naechsten korrekten Abfallschritt hinzu.
   */
  function waehleSchritt(schritt: string): void {
    if (schritt !== naechsterSchritt || gewaehlteSchritte.includes(schritt)) return;
    setGewaehlteSchritte((aktuell) => [...aktuell, schritt]);
  }

  /**
   * Setzt die Sortieruebung zurueck.
   */
  function zuruecksetzen(): void {
    setGewaehlteSchritte([]);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die Umwelt-Grundfolge vom Vermeiden bis zur Entsorgung.</p>
        </div>
        <Badge variante={istFertig ? 'success' : 'primary'} symbol={istFertig ? '=' : '?'}>
          {gewaehlteSchritte.length}/{ABFALLWEGE.length}
        </Badge>
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {ABFALLWEGE.map((schritt) => {
          const gewaehlt = gewaehlteSchritte.includes(schritt);
          return (
            <button
              key={schritt}
              type="button"
              disabled={gewaehlt}
              className={cn('min-h-touch rounded-lg border p-3 text-center text-body-sm font-semibold motion-safe:transition', gewaehlt ? 'border-success-border bg-success-bg/45' : 'border-border bg-bg-subtle hover:border-primary')}
              onClick={() => waehleSchritt(schritt)}
            >
              <span className="block text-caption text-fg-muted">{gewaehlt ? `${gewaehlteSchritte.indexOf(schritt) + 1}. Schritt` : 'offen'}</span>
              {schritt}
            </button>
          );
        })}
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istFertig ? 'border-success-border bg-success-bg/45' : 'border-info-border bg-info-bg/40')}>
        <p className="font-bold">{istFertig ? 'Abfallweg komplett.' : `Naechster Schritt: ${naechsterSchritt ?? 'fertig'}`}</p>
        <p className="mt-1 text-fg-muted">Betriebliche Sammelstellen und Entsorgungswege bleiben verbindlich.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={zuruecksetzen}>Zuruecksetzen</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung von Betriebsstoffen zu typischen Situationen.
 */
export function BetriebsstoffZuordnungTrainer({ titel = 'Betriebsstoff zuordnen', className }: BetriebsstoffZuordnungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = BETRIEBSSTOFF_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('BetriebsstoffZuordnungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Betriebsstoff-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % BETRIEBSSTOFF_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die Situation dem passenden Betriebsstoff zu.</p>
        </div>
        <Badge variante="primary" symbol="?">Fall {aufgabenIndex + 1}/{BETRIEBSSTOFF_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {BETRIEBSSTOFF_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Betriebsstoff.' : istRichtig ? 'Richtig zugeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Verbindlich ist immer Gebinde, Kennzeichnung und Betriebsanweisung.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Fall</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das Lesen zentraler Bereiche eines Gefahrstoffetiketts.
 */
export function GefahrstoffEtikettTrainer({ titel = 'Gefahrstoffetikett lesen', className }: GefahrstoffEtikettTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = GEFAHRSTOFF_ETIKETT_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('GefahrstoffEtikettTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Etikett-Aufgabe.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % GEFAHRSTOFF_ETIKETT_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den Etikettbereich, der zur Frage passt.</p>
        </div>
        <Badge variante="warning" symbol="!">Etikett {aufgabenIndex + 1}/{GEFAHRSTOFF_ETIKETT_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.text}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {GEFAHRSTOFF_ETIKETT_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Bereich.' : istRichtig ? 'Richtig gelesen.' : 'Noch nicht richtig.'}</p>
        <p className="mt-1 text-fg-muted">Richtig ist: {aufgabe.korrekt}. Bei Gefahrstoffen zaehlt die echte Kennzeichnung.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Frage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Navigation zu passenden Sicherheitsdatenblatt-Abschnitten.
 */
export function SicherheitsdatenblattTrainer({ titel = 'SDB-Abschnitt finden', className }: SicherheitsdatenblattTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = SDB_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('SicherheitsdatenblattTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Sicherheitsdatenblatt-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % SDB_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Finde den passenden SDB-Abschnitt zur Situation.</p>
        </div>
        <Badge variante="primary" symbol="?">SDB {aufgabenIndex + 1}/{SDB_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {SDB_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Abschnitt.' : istRichtig ? 'Richtig gefunden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Das echte SDB und die Unterweisung sind verbindlich.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert sichere Entscheidungen beim Umgang mit Kuehlschmierstoff.
 */
export function KuehlschmierstoffTrainer({ titel = 'KSS-Situation entscheiden', className }: KuehlschmierstoffTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = KSS_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('KuehlschmierstoffTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten KSS-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % KSS_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die sichere Reaktion fuer die KSS-Situation.</p>
        </div>
        <Badge variante="info" symbol="i">KSS {aufgabenIndex + 1}/{KSS_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {KSS_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Reaktion.' : istRichtig ? 'Sicher reagiert.' : 'Noch nicht sicher.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste KSS-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Entscheidung fuer sortenreine Kunststoffabfall-Sammlung.
 */
export function KunststoffAbfallTrainer({ titel = 'Kunststoffabfall sortieren', className }: KunststoffAbfallTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = KUNSTSTOFF_ABFALL_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('KunststoffAbfallTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zum naechsten Kunststoffabfall-Fall.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % KUNSTSTOFF_ABFALL_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den passenden Umgang mit dem Kunststoffrest.</p>
        </div>
        <Badge variante="success" symbol="=">Rest {aufgabenIndex + 1}/{KUNSTSTOFF_ABFALL_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {KUNSTSTOFF_ABFALL_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Weg.' : istRichtig ? 'Richtig sortiert.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Sortenreinheit und betriebliche Sammelstelle entscheiden.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Rest</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert, welche Information aus einer technischen Zeichnung gelesen wird.
 */
export function ZeichnungZweckTrainer({ titel = 'Zeichnung sicher nutzen', className }: ZeichnungZweckTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = ZEICHNUNG_ZWECK_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('ZeichnungZweckTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Zeichnungssituation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % ZEICHNUNG_ZWECK_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle, welchen Teil der Zeichnung du fuer die Situation nutzt.</p>
        </div>
        <Badge variante="primary" symbol="Z">ZEI {aufgabenIndex + 1}/{ZEICHNUNG_ZWECK_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ZEICHNUNG_ZWECK_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Zeichnungsinformation.' : istRichtig ? 'Richtig zugeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Verbindlich sind Zeichnung, Pruefplan und freigegebener Stand.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das gezielte Lesen typischer Schriftfeldangaben.
 */
export function SchriftfeldTrainer({ titel = 'Schriftfeld-Information finden', className }: SchriftfeldTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = SCHRIFTFELD_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('SchriftfeldTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Schriftfeldfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % SCHRIFTFELD_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die gesuchte Information dem passenden Schriftfeldbereich zu.</p>
        </div>
        <Badge variante="info" symbol="i">Feld {aufgabenIndex + 1}/{SCHRIFTFELD_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {SCHRIFTFELD_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Bereich.' : istRichtig ? 'Richtig gefunden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Gesucht ist: {aufgabe.korrekt}. Das Schriftfeld klaert den gueltigen Zeichnungsstand.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Frage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung wichtiger technischer Ansichten.
 */
export function AnsichtenTrainer({ titel = 'Ansicht richtig zuordnen', className }: AnsichtenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = ANSICHTEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('AnsichtenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Ansichtenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % ANSICHTEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Ansicht fuer die beschriebene Blickrichtung.</p>
        </div>
        <Badge variante="primary" symbol="A">Ansicht {aufgabenIndex + 1}/{ANSICHTEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {ANSICHTEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Ansicht.' : istRichtig ? 'Richtig zugeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Mehrere Ansichten beschreiben die Form zusammen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Ansicht</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Grundbedeutung von Linienarten.
 */
export function LinienartenTrainer({ titel = 'Linienart erkennen', className }: LinienartenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = LINIENARTEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('LinienartenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Linienartenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % LINIENARTEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die Linienbedeutung der richtigen Linienart zu.</p>
        </div>
        <Badge variante="info" symbol="-">Linie {aufgabenIndex + 1}/{LINIENARTEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {LINIENARTEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Linienart.' : istRichtig ? 'Richtig erkannt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Linienarten werden nach Zeichnungsregel gelesen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Linie</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Einordnung einfacher Massstabangaben.
 */
export function MassstabTrainer({ titel = 'Massstab einordnen', className }: MassstabTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = MASSSTAB_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('MassstabTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Massstabsituation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % MASSSTAB_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle, wie die Darstellung zum echten Bauteil steht.</p>
        </div>
        <Badge variante="primary" symbol="M">Massstab {aufgabenIndex + 1}/{MASSSTAB_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MASSSTAB_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Einordnung.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Massstab</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung von Grundelementen einer Bemassung.
 */
export function BemassungTrainer({ titel = 'Bemassungsteile zuordnen', className }: BemassungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = BEMASSUNG_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('BemassungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Bemassungsfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % BEMASSUNG_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne das Bemassungselement der gesuchten Funktion zu.</p>
        </div>
        <Badge variante="info" symbol="mm">Mass {aufgabenIndex + 1}/{BEMASSUNG_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {BEMASSUNG_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle ein Bemassungselement.' : istRichtig ? 'Richtig zugeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Masszahlen werden nicht abgemessen, sondern aus der Bemassung gelesen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Frage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das Lesen von Nennmass und Grenzmassen aus Toleranzangaben.
 */
export function ToleranzangabenTrainer({ titel = 'Toleranzangaben lesen', className }: ToleranzangabenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = TOLERANZANGABEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('ToleranzangabenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Toleranzfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % TOLERANZANGABEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die Toleranzangabe der richtigen Bedeutung zu.</p>
        </div>
        <Badge variante="primary" symbol="+-">Tol {aufgabenIndex + 1}/{TOLERANZANGABEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {TOLERANZANGABEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Angabe.' : istRichtig ? 'Richtig gelesen.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Toleranzen werden aus Zeichnung und Pruefvorgabe gelesen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Toleranzfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Grundentscheidung zwischen Spiel, Uebergang und Uebermass.
 */
export function PassungTrainer({ titel = 'Passung einordnen', className }: PassungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = PASSUNG_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('PassungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Passungssituation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % PASSUNG_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle, wie Welle und Bohrung zusammenpassen.</p>
        </div>
        <Badge variante="info" symbol="O">Passung {aufgabenIndex + 1}/{PASSUNG_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {PASSUNG_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Passungsart.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Passung</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Deutung von Schnittdarstellungen und Schraffur.
 */
export function SchnittdarstellungTrainer({ titel = 'Schnittdarstellung deuten', className }: SchnittdarstellungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = SCHNITT_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('SchnittdarstellungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Schnittfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % SCHNITT_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne Schnittbegriffe der richtigen Bedeutung zu.</p>
        </div>
        <Badge variante="primary" symbol="/">Schnitt {aufgabenIndex + 1}/{SCHNITT_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {SCHNITT_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Begriff.' : istRichtig ? 'Richtig gedeutet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Schnitte zeigen Innenformen, ohne das reale Teil zu zerschneiden.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Schnittfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die sichere Orientierung bei Oberflaechenangaben.
 */
export function OberflaechenangabenTrainer({ titel = 'Oberflaechenangaben erkennen', className }: OberflaechenangabenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = OBERFLAECHE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('OberflaechenangabenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Oberflaechenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % OBERFLAECHE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Aussage zur Oberflaechenangabe.</p>
        </div>
        <Badge variante="info" symbol="Ra">Oberflaeche {aufgabenIndex + 1}/{OBERFLAECHE_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {OBERFLAECHE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Aussage.' : istRichtig ? 'Richtig erkannt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Verbindlich sind Symbol, Zeichnung und freigegebene Quelle.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Angabe</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das Lesen von Position, Menge und Benennung aus Stuecklisten.
 */
export function StuecklisteTrainer({ titel = 'Stueckliste lesen', className }: StuecklisteTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = STUECKLISTE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('StuecklisteTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Stuecklistenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % STUECKLISTE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die gesuchte Information der passenden Stuecklistenspalte zu.</p>
        </div>
        <Badge variante="primary" symbol="#">Liste {aufgabenIndex + 1}/{STUECKLISTE_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {STUECKLISTE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Spalte.' : istRichtig ? 'Richtig gefunden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Gesucht ist: {aufgabe.korrekt}. Stueckliste und Zeichnung muessen zusammen gelesen werden.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Frage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Entscheidungen beim Lesen eines einfachen Arbeitsplans.
 */
export function ArbeitsplanTrainer({ titel = 'Arbeitsplan richtig nutzen', className }: ArbeitsplanTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = ARBEITSPLAN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('ArbeitsplanTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Arbeitsplansituation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % ARBEITSPLAN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle, welche Information du im Arbeitsplan nutzt.</p>
        </div>
        <Badge variante="info" symbol="AP">Plan {aufgabenIndex + 1}/{ARBEITSPLAN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ARBEITSPLAN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Information.' : istRichtig ? 'Richtig genutzt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung grundlegender SI-Einheiten.
 */
export function SiEinheitenTrainer({ titel = 'SI-Einheiten zuordnen', className }: SiEinheitenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = SI_EINHEITEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('SiEinheitenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Einheitenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % SI_EINHEITEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die Groesse der passenden Einheit zu.</p>
        </div>
        <Badge variante="primary" symbol="SI">Einheit {aufgabenIndex + 1}/{SI_EINHEITEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {SI_EINHEITEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Einheit.' : istRichtig ? 'Richtig zugeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Zahl und Einheit gehoeren immer zusammen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Einheit</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert einfache Laengen-Umrechnungen.
 */
export function LaengenUmrechnungTrainer({ titel = 'Laengen umrechnen', className }: LaengenUmrechnungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = LAENGEN_UMRECHNUNG_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('LaengenUmrechnungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Umrechnungsfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % LAENGEN_UMRECHNUNG_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Laengen-Umrechnung.</p>
        </div>
        <Badge variante="info" symbol="mm">Laenge {aufgabenIndex + 1}/{LAENGEN_UMRECHNUNG_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {LAENGEN_UMRECHNUNG_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Umrechnung.' : istRichtig ? 'Richtig umgerechnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Vor Formeln immer die Einheit pruefen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Umrechnung</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Grundbegriffe zur Rechteckflaeche.
 */
export function FlaechenTrainer({ titel = 'Flaeche berechnen', className }: FlaechenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = FLAECHEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('FlaechenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Flaechenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % FLAECHEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle Formel, Einheit oder Rechenschritt zur Flaeche.</p>
        </div>
        <Badge variante="primary" symbol="A">Flaeche {aufgabenIndex + 1}/{FLAECHEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {FLAECHEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Bei Flaechen zaehlen zwei Laengenrichtungen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Flaechenfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Grundbegriffe zum Volumen eines Quaders.
 */
export function VolumenTrainer({ titel = 'Volumen einordnen', className }: VolumenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = VOLUMEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('VolumenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Volumenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % VOLUMEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle Formel, Einheit oder Bedeutung zum Volumen.</p>
        </div>
        <Badge variante="info" symbol="V">Volumen {aufgabenIndex + 1}/{VOLUMEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {VOLUMEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Bei Volumen zaehlen drei Laengenrichtungen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Volumenfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Entscheidungen zum Zusammenhang von Masse, Volumen und Dichte.
 */
export function DichteTrainer({ titel = 'Masse und Dichte verstehen', className }: DichteTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = DICHTE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('DichteTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Dichte-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % DICHTE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Aussage zur Situation.</p>
        </div>
        <Badge variante="primary" symbol="m/V">Dichte {aufgabenIndex + 1}/{DICHTE_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {DICHTE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Aussage.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Dichte-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Grundbegriffe zu Zeit und Geschwindigkeit.
 */
export function GeschwindigkeitTrainer({ titel = 'Zeit und Geschwindigkeit', className }: GeschwindigkeitTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = GESCHWINDIGKEIT_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('GeschwindigkeitTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Geschwindigkeitsfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % GESCHWINDIGKEIT_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Aussage zu Weg, Zeit und Geschwindigkeit.</p>
        </div>
        <Badge variante="info" symbol="v">Tempo {aufgabenIndex + 1}/{GESCHWINDIGKEIT_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {GESCHWINDIGKEIT_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Aussage.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Geschwindigkeit verbindet Weg und Zeit.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Frage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Deutung von Temperatur und Temperaturdifferenz.
 */
export function TemperaturTrainer({ titel = 'Temperatur im Prozess', className }: TemperaturTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = TEMPERATUR_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('TemperaturTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Temperaturfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % TEMPERATUR_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Temperatur-Aussage.</p>
        </div>
        <Badge variante="primary" symbol="T">Temp {aufgabenIndex + 1}/{TEMPERATUR_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {TEMPERATUR_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Aussage.' : istRichtig ? 'Richtig gedeutet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Prozesswerte werden nach Vorgabe gelesen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Temperaturfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Unterscheidung von Pruefen, Messen und Lehren.
 */
export function PruefenMessenLehrenTrainer({ titel = 'Pruefen, Messen, Lehren unterscheiden', className }: PruefenMessenLehrenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = PRUEFEN_MESSEN_LEHREN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('PruefenMessenLehrenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Vergleichsfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % PRUEFEN_MESSEN_LEHREN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne die Situation dem passenden Begriff zu.</p>
        </div>
        <Badge variante="primary" symbol="?">Begriff {aufgabenIndex + 1}/{PRUEFEN_MESSEN_LEHREN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {PRUEFEN_MESSEN_LEHREN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Begriff.' : istRichtig ? 'Richtig unterschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Pruefen ist der Oberbegriff, Messen und Lehren sind typische Wege.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Begriff</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die wichtigsten Teile des Messschiebers.
 */
export function MessschieberTeileTrainer({ titel = 'Messschieberteile benennen', className }: MessschieberTeileTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = MESSSCHIEBER_TEILE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('MessschieberTeileTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Teilefrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % MESSSCHIEBER_TEILE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den Messschieberteil zur beschriebenen Funktion.</p>
        </div>
        <Badge variante="info" symbol="ms">Teil {aufgabenIndex + 1}/{MESSSCHIEBER_TEILE_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {MESSSCHIEBER_TEILE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Teil.' : istRichtig ? 'Richtig benannt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Messmittel werden vor dem Einsatz sauber identifiziert.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Teil</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert sichere Entscheidungen bei der Aussenmessung.
 */
export function AussenmessungTrainer({ titel = 'Aussenmessung sicher ausfuehren', className }: AussenmessungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = AUSSENMESSUNG_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('AussenmessungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Aussenmessungs-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % AUSSENMESSUNG_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Handlung fuer die Aussenmessung.</p>
        </div>
        <Badge variante="primary" symbol="mm">Aussen {aufgabenIndex + 1}/{AUSSENMESSUNG_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {AUSSENMESSUNG_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig gehandelt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Innenmessung, Tiefenmessung und saubere Auflage.
 */
export function InnenTiefenmessungTrainer({ titel = 'Innen- und Tiefenmessung waehlen', className }: InnenTiefenmessungTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = INNEN_TIEFEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('InnenTiefenmessungTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Innen-/Tiefenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % INNEN_TIEFEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle Messart oder Grundsatz zur Situation.</p>
        </div>
        <Badge variante="info" symbol="T">Messart {aufgabenIndex + 1}/{INNEN_TIEFEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {INNEN_TIEFEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Messart und saubere Auflage entscheiden ueber den Messwert.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Messart</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Reihenfolge beim Ablesen von Hauptskala und Nonius.
 */
export function MesswertAblesenTrainer({ titel = 'Messwert richtig ablesen', className }: MesswertAblesenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = MESSWERT_ABLESEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('MesswertAblesenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Ablesefrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % MESSWERT_ABLESEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den richtigen Ableseschritt.</p>
        </div>
        <Badge variante="primary" symbol="0">Ablesen {aufgabenIndex + 1}/{MESSWERT_ABLESEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {MESSWERT_ABLESEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Schritt.' : istRichtig ? 'Richtig abgelesen.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Schaetzen ersetzt kein ruhiges Ablesen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Schritt</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert den sicheren Einsatz der Buegelmessschraube.
 */
export function BuegelmessschraubeTrainer({ titel = 'Buegelmessschraube verwenden', className }: BuegelmessschraubeTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = BUEGELMESS_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('BuegelmessschraubeTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Buegelmessschrauben-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % BUEGELMESS_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die sichere Handlung fuer das Feinmessen.</p>
        </div>
        <Badge variante="info" symbol="um">Fein {aufgabenIndex + 1}/{BUEGELMESS_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {BUEGELMESS_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig entschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert den sicheren Einsatz der Messuhr bei Abweichungspruefungen.
 */
export function MessuhrTrainer({ titel = 'Messuhr einsetzen', className }: MessuhrTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = MESSUHR_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('MessuhrTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Messuhr-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % MESSUHR_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die sichere Handlung beim Pruefen mit der Messuhr.</p>
        </div>
        <Badge variante="primary" symbol="ru">Messuhr {aufgabenIndex + 1}/{MESSUHR_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MESSUHR_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig entschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Messuhr-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Gut-/Ausschuss-Entscheidungen mit Lehren.
 */
export function LehrenTrainer({ titel = 'Lehren benutzen', className }: LehrenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = LEHREN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('LehrenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Lehrenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % LEHREN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne Lehre, Entscheidung oder Vorbereitung richtig zu.</p>
        </div>
        <Badge variante="info" symbol="go">Lehre {aufgabenIndex + 1}/{LEHREN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {LEHREN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Lehren werden sauber angesetzt und nie erzwungen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Lehrenfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Pflegeentscheidungen fuer Mess- und Pruefmittel.
 */
export function PruefmittelpflegeTrainer({ titel = 'Pruefmittel schonend behandeln', className }: PruefmittelpflegeTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = PRUEFMITTELPFLEGE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('PruefmittelpflegeTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Pflege-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % PRUEFMITTELPFLEGE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Pflege- oder Meldehandlung.</p>
        </div>
        <Badge variante="primary" symbol="pf">Pflege {aufgabenIndex + 1}/{PRUEFMITTELPFLEGE_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRUEFMITTELPFLEGE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig gepflegt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Pflege-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Begriffe Kalibrieren, Justieren und Eichen.
 */
export function KalibrierenJustierenEichenTrainer({ titel = 'Kalibrieren, Justieren, Eichen unterscheiden', className }: KalibrierenJustierenEichenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = KALIBRIEREN_JUSTIEREN_EICHEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('KalibrierenJustierenEichenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Begriffsfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % KALIBRIEREN_JUSTIEREN_EICHEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den passenden Pruefmittelbegriff.</p>
        </div>
        <Badge variante="info" symbol="k">Begriff {aufgabenIndex + 1}/{KALIBRIEREN_JUSTIEREN_EICHEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {KALIBRIEREN_JUSTIEREN_EICHEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle einen Begriff.' : istRichtig ? 'Richtig unterschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Diese Begriffe werden nicht austauschbar verwendet.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechster Begriff</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert einfache Entscheidungen zur Messunsicherheit.
 */
export function MessunsicherheitTrainer({ titel = 'Messunsicherheit einfach verstehen', className }: MessunsicherheitTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = MESSUNSICHERHEIT_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('MessunsicherheitTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Unsicherheitsfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % MESSUNSICHERHEIT_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den passenden Umgang mit unsicheren Messergebnissen.</p>
        </div>
        <Badge variante="primary" symbol="+-">Unsicherheit {aufgabenIndex + 1}/{MESSUNSICHERHEIT_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MESSUNSICHERHEIT_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig abgesichert.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Grenzfaelle brauchen eine sichere Vorgabe statt Bauchgefuehl.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Unsicherheitsfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert den Einfluss der Temperatur auf Messentscheidungen.
 */
export function TemperaturBeimMessenTrainer({ titel = 'Temperatur beim Messen beachten', className }: TemperaturBeimMessenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = TEMPERATUR_BEIM_MESSEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('TemperaturBeimMessenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Temperatur-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % TEMPERATUR_BEIM_MESSEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Reaktion, wenn Temperatur die Messung beeinflussen kann.</p>
        </div>
        <Badge variante="info" symbol="T">Temperatur {aufgabenIndex + 1}/{TEMPERATUR_BEIM_MESSEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {TEMPERATUR_BEIM_MESSEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig entschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Temperatur-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Zuordnung grundlegender Werkstoffgruppen.
 */
export function WerkstoffgruppenTrainer({ titel = 'Werkstoffgruppen ueberblicken', className }: WerkstoffgruppenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = WERKSTOFFGRUPPEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('WerkstoffgruppenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Werkstoffgruppenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % WERKSTOFFGRUPPEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne Material oder Vorgehen der passenden Grundidee zu.</p>
        </div>
        <Badge variante="primary" symbol="w">Werkstoff {aufgabenIndex + 1}/{WERKSTOFFGRUPPEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {WERKSTOFFGRUPPEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Materialangaben werden nicht geraten, sondern gelesen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Werkstofffrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Grundbegriffe zu Eisenwerkstoffen und Stahl.
 */
export function EisenStahlTrainer({ titel = 'Eisenwerkstoffe und Stahl', className }: EisenStahlTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = EISEN_STAHL_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('EisenStahlTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Stahlfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % EISEN_STAHL_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den passenden Begriff zur Stahl-Grundlage.</p>
        </div>
        <Badge variante="info" symbol="Fe">Stahl {aufgabenIndex + 1}/{EISEN_STAHL_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {EISEN_STAHL_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Konkrete Stahlsorten brauchen Kennzeichnung oder Datenblatt.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Stahlfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert einfache Grundlagen zu Gusseisen.
 */
export function GusseisenTrainer({ titel = 'Gusseisen verstehen', className }: GusseisenTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = GUSSEISEN_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('GusseisenTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Gusseisenfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % GUSSEISEN_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne Herstellung, Begriff oder Kennzeichnung ein.</p>
        </div>
        <Badge variante="primary" symbol="G">Guss {aufgabenIndex + 1}/{GUSSEISEN_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {GUSSEISEN_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Gusseisen wird nach Sorte und Kennzeichnung beurteilt.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Gussfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Einordnung von Nichteisenmetallen.
 */
export function NichteisenmetalleTrainer({ titel = 'Nichteisenmetalle einordnen', className }: NichteisenmetalleTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = NICHTEISENMETALLE_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('NichteisenmetalleTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten NE-Metallfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % NICHTEISENMETALLE_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle Bedeutung, Beispiel oder sicheren Pruefschritt.</p>
        </div>
        <Badge variante="info" symbol="NE">NE {aufgabenIndex + 1}/{NICHTEISENMETALLE_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {NICHTEISENMETALLE_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. NE-Metalle werden nicht pauschal wie Stahl behandelt.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste NE-Frage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Entscheidungen zu Aluminium in der Produktion.
 */
export function AluminiumTrainer({ titel = 'Aluminium in der Produktion', className }: AluminiumTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = ALUMINIUM_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('AluminiumTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Aluminium-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % ALUMINIUM_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Materialentscheidung.</p>
        </div>
        <Badge variante="primary" symbol="Al">Alu {aufgabenIndex + 1}/{ALUMINIUM_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ALUMINIUM_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig entschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Alu-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Einordnung von Kupfer und Leitfaehigkeit.
 */
export function KupferTrainer({ titel = 'Kupfer und Leitfaehigkeit', className }: KupferTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = KUPFER_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('KupferTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Kupfer-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % KUPFER_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die passende Entscheidung zu Kupfer und Einsatz.</p>
        </div>
        <Badge variante="info" symbol="Cu">Kupfer {aufgabenIndex + 1}/{KUPFER_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {KUPFER_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig entschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Kupfer-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert das Waermeverhalten von Thermoplasten.
 */
export function ThermoplastTrainer({ titel = 'Thermoplaste verstehen', className }: ThermoplastTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = THERMOPLAST_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('ThermoplastTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Thermoplastfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % THERMOPLAST_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle Verhalten, Zustand oder sichere Quelle.</p>
        </div>
        <Badge variante="primary" symbol="T">Thermo {aufgabenIndex + 1}/{THERMOPLAST_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {THERMOPLAST_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Konkrete Temperaturen stehen in Datenblatt oder Vorgabe.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Thermoplastfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert die Abgrenzung von Duroplasten.
 */
export function DuroplastTrainer({ titel = 'Duroplaste abgrenzen', className }: DuroplastTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = DUROPLAST_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('DuroplastTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Duroplastfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % DUROPLAST_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle den passenden Begriff oder sicheren Pruefschritt.</p>
        </div>
        <Badge variante="info" symbol="D">Duro {aufgabenIndex + 1}/{DUROPLAST_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {DUROPLAST_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig abgegrenzt.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Duroplaste werden nach Werkstoffangabe und Vorgabe behandelt.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Duroplastfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Elastomer-Eigenschaften und Einsatzgrenzen.
 */
export function ElastomerTrainer({ titel = 'Elastomere verstehen', className }: ElastomerTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = ELASTOMER_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('ElastomerTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Elastomerfrage.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % ELASTOMER_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Ordne Eigenschaft, Risiko oder Quelle ein.</p>
        </div>
        <Badge variante="primary" symbol="E">Elasto {aufgabenIndex + 1}/{ELASTOMER_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.frage}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ELASTOMER_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Antwort.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. Elastische Rueckstellung gilt nur innerhalb der Einsatzgrenzen.</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Elastomerfrage</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert den Umgang mit Additiven und Masterbatch.
 */
export function AdditiveMasterbatchTrainer({ titel = 'Additive und Masterbatch einordnen', className }: AdditiveMasterbatchTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = ADDITIVE_MASTERBATCH_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('AdditiveMasterbatchTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Zusatzstoff-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % ADDITIVE_MASTERBATCH_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die sichere Handlung zu Zusatzstoffen.</p>
        </div>
        <Badge variante="info" symbol="MB">Zusatz {aufgabenIndex + 1}/{ADDITIVE_MASTERBATCH_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ADDITIVE_MASTERBATCH_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig entschieden.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Zusatzstoff-Situation</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Materialverfolgung mit Granulat, Charge und Rezyklat.
 */
export function GranulatChargeRezyklatTrainer({ titel = 'Granulat, Charge und Rezyklat verfolgen', className }: GranulatChargeRezyklatTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = GRANULAT_CHARGE_REZYKLAT_AUFGABEN[aufgabenIndex];
  if (!aufgabe) throw new Error('GranulatChargeRezyklatTrainer konnte keine Aufgabe finden.');
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;

  /**
   * Wechselt zur naechsten Materialverfolgungs-Situation.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % GRANULAT_CHARGE_REZYKLAT_AUFGABEN.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">Waehle die sichere Handlung fuer Material und Rueckverfolgbarkeit.</p>
        </div>
        <Badge variante="primary" symbol="ID">Charge {aufgabenIndex + 1}/{GRANULAT_CHARGE_REZYKLAT_AUFGABEN.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabe.situation}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {GRANULAT_CHARGE_REZYKLAT_OPTIONEN.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? 'Waehle eine Handlung.' : istRichtig ? 'Richtig abgesichert.' : 'Noch nicht passend.'}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>Naechste Material-Situation</Button>
      </div>
    </section>
  );
}

type EigenschaftTrainerAufgabe = Readonly<{
  frage?: string;
  situation?: string;
  korrekt: string;
  begruendung?: string;
}>;

interface EigenschaftAuswahlTrainerProps {
  titel: string;
  beschreibung: string;
  badgeText: string;
  badgeSymbol: string;
  badgeVariante: BadgeVariante;
  optionen: readonly string[];
  aufgaben: readonly EigenschaftTrainerAufgabe[];
  fehlerName: string;
  feedbackNeutral: string;
  feedbackRichtig: string;
  feedbackFalsch: string;
  standardBegruendung: string;
  naechsterButton: string;
  className?: string;
}

/**
 * Rendert einen wiederverwendbaren Auswahltrainer fuer Werkstoffeigenschaften.
 */
function EigenschaftAuswahlTrainer({
  titel,
  beschreibung,
  badgeText,
  badgeSymbol,
  badgeVariante,
  optionen,
  aufgaben,
  fehlerName,
  feedbackNeutral,
  feedbackRichtig,
  feedbackFalsch,
  standardBegruendung,
  naechsterButton,
  className,
}: EigenschaftAuswahlTrainerProps) {
  const [aufgabenIndex, setAufgabenIndex] = React.useState(0);
  const [auswahl, setAuswahl] = React.useState<string | null>(null);
  const beschreibungId = React.useId();
  const aufgabe = aufgaben[aufgabenIndex];
  if (!aufgabe) throw new Error(`${fehlerName} konnte keine Aufgabe finden.`);
  const istRichtig = auswahl === null ? null : auswahl === aufgabe.korrekt;
  const aufgabentext = aufgabe.frage ?? aufgabe.situation ?? '';

  /**
   * Wechselt zur naechsten Eigenschaftsaufgabe.
   */
  function naechsteAufgabe(): void {
    setAufgabenIndex((index) => (index + 1) % aufgaben.length);
    setAuswahl(null);
  }

  return (
    <section className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)} aria-labelledby={`${beschreibungId}-titel`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">{titel}</h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">{beschreibung}</p>
        </div>
        <Badge variante={badgeVariante} symbol={badgeSymbol}>{badgeText} {aufgabenIndex + 1}/{aufgaben.length}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-bg-subtle p-4">
        <p className="text-body font-bold text-fg">{aufgabentext}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {optionen.map((option) => (
            <Button key={option} variante={auswahl === option ? 'primary' : 'sekundaer'} className="min-h-touch" aria-pressed={auswahl === option} onClick={() => setAuswahl(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm', istRichtig === null ? 'border-info-border bg-info-bg/40' : istRichtig ? 'border-success-border bg-success-bg/45' : 'border-danger-border bg-danger-bg/45')}>
        <p className="font-bold">{istRichtig === null ? feedbackNeutral : istRichtig ? feedbackRichtig : feedbackFalsch}</p>
        <p className="mt-1 text-fg-muted">Passend ist: {aufgabe.korrekt}. {aufgabe.begruendung ?? standardBegruendung}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variante="sekundaer" className="min-h-touch" onClick={naechsteAufgabe}>{naechsterButton}</Button>
      </div>
    </section>
  );
}

/**
 * Trainiert Haerte als Werkstoffeigenschaft.
 */
export function HaerteTrainer({ titel = 'Haerte verstehen', className }: HaerteTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Begriff, Quelle oder Pruefhinweis zur Haerte."
      badgeText="Haerte"
      badgeSymbol="H"
      badgeVariante="primary"
      optionen={HAERTE_OPTIONEN}
      aufgaben={HAERTE_AUFGABEN}
      fehlerName="HaerteTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Haerte wird ueber Vorgaben und Pruefverfahren beurteilt."
      naechsterButton="Naechste Haertefrage"
      className={className}
    />
  );
}

/**
 * Trainiert Festigkeit und Belastbarkeit.
 */
export function FestigkeitTrainer({ titel = 'Festigkeit verstehen', className }: FestigkeitTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Belastung, Datenquelle oder Bruchrisiko richtig ein."
      badgeText="Festigkeit"
      badgeSymbol="F"
      badgeVariante="info"
      optionen={FESTIGKEIT_OPTIONEN}
      aufgaben={FESTIGKEIT_AUFGABEN}
      fehlerName="FestigkeitTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig belastet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Festigkeit wird anhand belastbarer Werkstoffdaten beurteilt."
      naechsterButton="Naechste Festigkeitsfrage"
      className={className}
    />
  );
}

/**
 * Trainiert zaehes und sproedes Bruchverhalten.
 */
export function ZaehigkeitSproedigkeitTrainer({ titel = 'Zaehigkeit und Sproedigkeit', className }: ZaehigkeitSproedigkeitTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Unterscheide zaehes, sproedes und nachweispflichtiges Verhalten."
      badgeText="Bruch"
      badgeSymbol="B"
      badgeVariante="warning"
      optionen={ZAEHIGKEIT_SPROEDIGKEIT_OPTIONEN}
      aufgaben={ZAEHIGKEIT_SPROEDIGKEIT_AUFGABEN}
      fehlerName="ZaehigkeitSproedigkeitTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig unterschieden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Bruchverhalten wird nicht nach Aussehen allein beurteilt."
      naechsterButton="Naechste Bruchfrage"
      className={className}
    />
  );
}

/**
 * Trainiert elastische und plastische Verformung.
 */
export function ElastischPlastischTrainer({ titel = 'Elastizitaet und plastische Verformung', className }: ElastischPlastischTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Rueckstellung, bleibende Veraenderung und Freigabe ein."
      badgeText="Verformung"
      badgeSymbol="V"
      badgeVariante="primary"
      optionen={ELASTISCH_PLASTISCH_OPTIONEN}
      aufgaben={ELASTISCH_PLASTISCH_AUFGABEN}
      fehlerName="ElastischPlastischTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig verformt."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Bleibende Verformung muss nach Vorgabe beurteilt werden."
      naechsterButton="Naechste Verformungsfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Dichtevergleiche zwischen Werkstoffen.
 */
export function DichteVergleichTrainer({ titel = 'Dichte im Werkstoffvergleich', className }: DichteVergleichTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Masse, Volumen und sichere Tabellenwerte zu."
      badgeText="Dichte"
      badgeSymbol="rho"
      badgeVariante="info"
      optionen={DICHTE_VERGLEICH_OPTIONEN}
      aufgaben={DICHTE_VERGLEICH_AUFGABEN}
      fehlerName="DichteVergleichTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig verglichen."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Dichte verknuepft Masse und Volumen."
      naechsterButton="Naechste Dichtefrage"
      className={className}
    />
  );
}

/**
 * Trainiert den Einfluss der Waermeausdehnung.
 */
export function WaermeausdehnungTrainer({ titel = 'Waermeausdehnung einfach', className }: WaermeausdehnungTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle den sicheren Umgang mit Temperatur, Laenge und Vorgaben."
      badgeText="Waerme"
      badgeSymbol="T"
      badgeVariante="warning"
      optionen={WAERMEAUSDEHNUNG_OPTIONEN}
      aufgaben={WAERMEAUSDEHNUNG_AUFGABEN}
      fehlerName="WaermeausdehnungTrainer"
      feedbackNeutral="Waehle eine Handlung."
      feedbackRichtig="Richtig entschieden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Temperatur kann Werkstofflaengen und Messungen beeinflussen."
      naechsterButton="Naechste Waermefrage"
      className={className}
    />
  );
}

/**
 * Trainiert das Erkennen von Korrosion.
 */
export function KorrosionTrainer({ titel = 'Korrosion erkennen', className }: KorrosionTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle die passende Reaktion auf Korrosion, Schutz und Lagerung."
      badgeText="Korrosion"
      badgeSymbol="K"
      badgeVariante="danger"
      optionen={KORROSION_OPTIONEN}
      aufgaben={KORROSION_AUFGABEN}
      fehlerName="KorrosionTrainer"
      feedbackNeutral="Waehle eine Handlung."
      feedbackRichtig="Richtig abgesichert."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Korrosion wird gemeldet und nach Vorgabe beurteilt."
      naechsterButton="Naechste Korrosionsfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Werkstoffauswahl nach technischen Anforderungen.
 */
export function WerkstoffauswahlTrainer({ titel = 'Werkstoffauswahl nach Aufgabe', className }: WerkstoffauswahlTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Gleiche Anforderungen, Werkstoffdaten und Freigabe sauber ab."
      badgeText="Auswahl"
      badgeSymbol="A"
      badgeVariante="primary"
      optionen={WERKSTOFFAUSWAHL_OPTIONEN}
      aufgaben={WERKSTOFFAUSWAHL_AUFGABEN}
      fehlerName="WerkstoffauswahlTrainer"
      feedbackNeutral="Waehle eine Handlung."
      feedbackRichtig="Richtig abgeglichen."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Werkstoffwechsel brauchen Freigabe und nachvollziehbare Anforderungen."
      naechsterButton="Naechste Auswahlfrage"
      className={className}
    />
  );
}

/**
 * Trainiert die Unterscheidung von Welle und Achse.
 */
export function WelleAchseTrainer({ titel = 'Wellen und Achsen unterscheiden', className }: WelleAchseTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Funktion, Bauteilrolle und Quelle richtig ein."
      badgeText="Welle"
      badgeSymbol="W"
      badgeVariante="primary"
      optionen={WELLE_ACHSE_OPTIONEN}
      aufgaben={WELLE_ACHSE_AUFGABEN}
      fehlerName="WelleAchseTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig unterschieden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Welle und Achse werden nach Funktion unterschieden."
      naechsterButton="Naechste Wellenfrage"
      className={className}
    />
  );
}

/**
 * Trainiert den Grundueberblick zu Lagerarten.
 */
export function LagerartenTrainer({ titel = 'Lagerarten ueberblicken', className }: LagerartenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Aufgabe, Reibungsbezug oder Bauartquelle."
      badgeText="Lager"
      badgeSymbol="L"
      badgeVariante="info"
      optionen={LAGERARTEN_OPTIONEN}
      aufgaben={LAGERARTEN_AUFGABEN}
      fehlerName="LagerartenTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig gelagert."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Lager fuehren und stuetzen bewegte Teile."
      naechsterButton="Naechste Lagerfrage"
      className={className}
    />
  );
}

/**
 * Trainiert das Gleitlagerprinzip.
 */
export function GleitlagerTrainer({ titel = 'Gleitlager verstehen', className }: GleitlagerTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Gleitprinzip, Schmierung oder sichere Reaktion."
      badgeText="Gleitlager"
      badgeSymbol="G"
      badgeVariante="primary"
      optionen={GLEITLAGER_OPTIONEN}
      aufgaben={GLEITLAGER_AUFGABEN}
      fehlerName="GleitlagerTrainer"
      feedbackNeutral="Waehle eine Handlung."
      feedbackRichtig="Richtig entschieden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Gleitlager brauchen kontrollierte Reibung und Schmierung."
      naechsterButton="Naechste Gleitlagerfrage"
      className={className}
    />
  );
}

/**
 * Trainiert den Aufbau von Waelzlagern.
 */
export function WaelzlagerTrainer({ titel = 'Waelzlager verstehen', className }: WaelzlagerTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Waelzkoerper, Bauform und Montagevorgabe ein."
      badgeText="Waelzlager"
      badgeSymbol="WZ"
      badgeVariante="info"
      optionen={WAELZLAGER_OPTIONEN}
      aufgaben={WAELZLAGER_AUFGABEN}
      fehlerName="WaelzlagerTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Waelzlager werden nach Bauart und Vorgabe behandelt."
      naechsterButton="Naechste Waelzlagerfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Kupplungen als Verbindung von Wellen.
 */
export function KupplungTrainer({ titel = 'Kupplungen', className }: KupplungTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Funktion, Ausrichtung oder Schutzhandlung."
      badgeText="Kupplung"
      badgeSymbol="K"
      badgeVariante="warning"
      optionen={KUPPLUNG_OPTIONEN}
      aufgaben={KUPPLUNG_AUFGABEN}
      fehlerName="KupplungTrainer"
      feedbackNeutral="Waehle eine Handlung."
      feedbackRichtig="Richtig abgesichert."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Kupplungen verbinden Wellen und koennen Gefahrbereiche bilden."
      naechsterButton="Naechste Kupplungsfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Grundideen zum Zahnradgetriebe.
 */
export function ZahnradgetriebeTrainer({ titel = 'Zahnradgetriebe', className }: ZahnradgetriebeTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Formschluss, Uebersetzung und Quellenpflicht ein."
      badgeText="Getriebe"
      badgeSymbol="Z"
      badgeVariante="primary"
      optionen={ZAHNRADGETRIEBE_OPTIONEN}
      aufgaben={ZAHNRADGETRIEBE_AUFGABEN}
      fehlerName="ZahnradgetriebeTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig uebersetzt."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Konkrete Getriebewerte werden aus Zeichnung oder Tabellenbuch entnommen."
      naechsterButton="Naechste Zahnradfrage"
      className={className}
    />
  );
}

/**
 * Trainiert den Riemenantrieb.
 */
export function RiemenantriebTrainer({ titel = 'Riemenantrieb', className }: RiemenantriebTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Kraftschluss, Riemenzustand oder sichere Reaktion."
      badgeText="Riemen"
      badgeSymbol="R"
      badgeVariante="info"
      optionen={RIEMENANTRIEB_OPTIONEN}
      aufgaben={RIEMENANTRIEB_AUFGABEN}
      fehlerName="RiemenantriebTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Riemenantriebe brauchen Spannung, Zustandkontrolle und Schutz."
      naechsterButton="Naechste Riemenfrage"
      className={className}
    />
  );
}

/**
 * Trainiert den Kettenantrieb.
 */
export function KettenantriebTrainer({ titel = 'Kettenantrieb', className }: KettenantriebTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Formschluss, Kettenglied und sichere Wartung ein."
      badgeText="Kette"
      badgeSymbol="C"
      badgeVariante="primary"
      optionen={KETTENANTRIEB_OPTIONEN}
      aufgaben={KETTENANTRIEB_AUFGABEN}
      fehlerName="KettenantriebTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig verkettet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Kettenantriebe greifen formschluessig und brauchen Schutz."
      naechsterButton="Naechste Kettenfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Schrauben und Muttern als Verbindung.
 */
export function SchraubenMutternTrainer({ titel = 'Schrauben und Muttern', className }: SchraubenMutternTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Verbindung, Vorgabe oder Sicherung."
      badgeText="Schraube"
      badgeSymbol="S"
      badgeVariante="info"
      optionen={SCHRAUBEN_MUTTERN_OPTIONEN}
      aufgaben={SCHRAUBEN_MUTTERN_AUFGABEN}
      fehlerName="SchraubenMutternTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig verbunden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Schraubverbindungen werden nach Zeichnung und Vorgabe montiert."
      naechsterButton="Naechste Schraubenfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Federn und Daempfer als Funktionselemente.
 */
export function FedernDaempferTrainer({ titel = 'Federn und Daempfer', className }: FedernDaempferTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Rueckstellung, Daempfung und Meldepunkt ein."
      badgeText="Feder"
      badgeSymbol="FD"
      badgeVariante="primary"
      optionen={FEDERN_DAEMPFER_OPTIONEN}
      aufgaben={FEDERN_DAEMPFER_AUFGABEN}
      fehlerName="FedernDaempferTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Federn und Daempfer werden nach Zustand und Funktion beurteilt."
      naechsterButton="Naechste Federfrage"
      className={className}
    />
  );
}

/**
 * Trainiert die sechs Fertigungshauptgruppen.
 */
export function FertigungHauptgruppenTrainer({ titel = 'Fertigungshauptgruppen', className }: FertigungHauptgruppenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Hauptgruppe, Grundwirkung und Verfahren sicher zu."
      badgeText="Fertigung"
      badgeSymbol="F"
      badgeVariante="primary"
      optionen={FERTIGUNG_HAUPTGRUPPEN_OPTIONEN}
      aufgaben={FERTIGUNG_HAUPTGRUPPEN_AUFGABEN}
      fehlerName="FertigungHauptgruppenTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Fertigungsverfahren werden nach ihrer Hauptwirkung geordnet."
      naechsterButton="Naechste Fertigungsfrage"
      className={className}
    />
  );
}

/**
 * Trainiert den Unterschied zwischen spanender und spanloser Fertigung.
 */
export function SpanendSpanlosTrainer({ titel = 'Spanend und spanlos unterscheiden', className }: SpanendSpanlosTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Entscheide, ob Spanabtrag, Formveraenderung oder Vorgabe im Vordergrund steht."
      badgeText="Span"
      badgeSymbol="S"
      badgeVariante="info"
      optionen={SPANEND_SPANLOS_OPTIONEN}
      aufgaben={SPANEND_SPANLOS_AUFGABEN}
      fehlerName="SpanendSpanlosTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig unterschieden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Spanend und spanlos werden nach Materialabtrag unterschieden."
      naechsterButton="Naechste Spanfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Schnittbewegung, Vorschub und Zustellung.
 */
export function SchnittVorschubTrainer({ titel = 'Schnittbewegung und Vorschub', className }: SchnittVorschubTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Bewegungsarten beim Zerspanen richtig ein."
      badgeText="Bewegung"
      badgeSymbol="B"
      badgeVariante="primary"
      optionen={SCHNITT_VORSCHUB_OPTIONEN}
      aufgaben={SCHNITT_VORSCHUB_AUFGABEN}
      fehlerName="SchnittVorschubTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig bewegt."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Schnittbewegung, Vorschub und Zustellung haben unterschiedliche Aufgaben."
      naechsterButton="Naechste Bewegungsfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Grundideen zur Schnittgeschwindigkeit.
 */
export function SchnittgeschwindigkeitTrainer({ titel = 'Schnittgeschwindigkeit', className }: SchnittgeschwindigkeitTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne vc, Durchmesser, Drehzahl und Quellenpflicht ein."
      badgeText="vc"
      badgeSymbol="v"
      badgeVariante="warning"
      optionen={SCHNITTGESCHWINDIGKEIT_OPTIONEN}
      aufgaben={SCHNITTGESCHWINDIGKEIT_AUFGABEN}
      fehlerName="SchnittgeschwindigkeitTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig zugeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Konkrete Schnittwerte muessen aus freigegebener Quelle kommen."
      naechsterButton="Naechste vc-Frage"
      className={className}
    />
  );
}

/**
 * Trainiert Drehzahlbezug und sichere Quellenarbeit.
 */
export function DrehzahlBerechnenTrainer({ titel = 'Drehzahl berechnen', className }: DrehzahlBerechnenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Drehzahlbegriff, Einheit oder Quellenhandlung."
      badgeText="n"
      badgeSymbol="n"
      badgeVariante="info"
      optionen={DREHZAHL_BERECHNEN_OPTIONEN}
      aufgaben={DREHZAHL_BERECHNEN_AUFGABEN}
      fehlerName="DrehzahlBerechnenTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig gerechnet vorbereitet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Drehzahlrechnungen brauchen passende Einheiten und freigegebene Werte."
      naechsterButton="Naechste Drehzahlfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Vorschub und Zustellung als Prozessgroessen.
 */
export function VorschubZustellungTrainer({ titel = 'Vorschub und Zustellung', className }: VorschubZustellungTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Vorschub, Zustellung und Prozesswirkung."
      badgeText="vf"
      badgeSymbol="f"
      badgeVariante="primary"
      optionen={VORSCHUB_ZUSTELLUNG_OPTIONEN}
      aufgaben={VORSCHUB_ZUSTELLUNG_AUFGABEN}
      fehlerName="VorschubZustellungTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Vorschub und Zustellung beeinflussen Span, Oberflaeche und Belastung."
      naechsterButton="Naechste Vorschubfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Standzeit und Werkzeugverschleiss.
 */
export function WerkzeugverschleissTrainer({ titel = 'Standzeit und Werkzeugverschleiss', className }: WerkzeugverschleissTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle sichere Reaktion auf Verschleiss, Standzeit und Prozesszeichen."
      badgeText="Werkzeug"
      badgeSymbol="W"
      badgeVariante="warning"
      optionen={WERKZEUGVERSCHLEISS_OPTIONEN}
      aufgaben={WERKZEUGVERSCHLEISS_AUFGABEN}
      fehlerName="WerkzeugverschleissTrainer"
      feedbackNeutral="Waehle eine Handlung."
      feedbackRichtig="Richtig abgesichert."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Werkzeugverschleiss wird nicht ignoriert, sondern nach Vorgabe beurteilt."
      naechsterButton="Naechste Werkzeugfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Kuehlschmierstoff-Aufgaben in der Fertigung.
 */
export function KuehlschmierstoffFertigungTrainer({ titel = 'Kuehlschmierstoffe', className }: KuehlschmierstoffFertigungTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Kuehlung, Schmierung, Spanabfuhr und Hautschutz."
      badgeText="KSS"
      badgeSymbol="K"
      badgeVariante="info"
      optionen={KUEHLSCHMIERSTOFF_FERTIGUNG_OPTIONEN}
      aufgaben={KUEHLSCHMIERSTOFF_FERTIGUNG_AUFGABEN}
      fehlerName="KuehlschmierstoffFertigungTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig entschieden."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Kuehlschmierstoffe brauchen Prozess-, Haut- und Umweltbezug."
      naechsterButton="Naechste KSS-Frage"
      className={className}
    />
  );
}

/**
 * Trainiert sichere Uebernahme von Werkzeugdaten.
 */
export function WerkzeugdatenTrainer({ titel = 'Werkzeugdaten sicher uebernehmen', className }: WerkzeugdatenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Waehle Datenquelle, Abgleich oder Rueckfrage statt Schaetzwert."
      badgeText="Daten"
      badgeSymbol="D"
      badgeVariante="primary"
      optionen={WERKZEUGDATEN_OPTIONEN}
      aufgaben={WERKZEUGDATEN_AUFGABEN}
      fehlerName="WerkzeugdatenTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig uebernommen."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Werkzeugdaten werden aus freigegebenen Quellen uebernommen."
      naechsterButton="Naechste Datenfrage"
      className={className}
    />
  );
}

/**
 * Trainiert die grobe Planung der Bearbeitungszeit.
 */
export function BearbeitungszeitTrainer({ titel = 'Bearbeitungszeit grob planen', className }: BearbeitungszeitTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung="Ordne Weg, Geschwindigkeit, Ruestzeit und Ablaufplanung."
      badgeText="Zeit"
      badgeSymbol="t"
      badgeVariante="info"
      optionen={BEARBEITUNGSZEIT_OPTIONEN}
      aufgaben={BEARBEITUNGSZEIT_AUFGABEN}
      fehlerName="BearbeitungszeitTrainer"
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig geplant."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung="Bearbeitungszeit wird mit Weg, Geschwindigkeit und Randzeiten geplant."
      naechsterButton="Naechste Zeitfrage"
      className={className}
    />
  );
}

/**
 * Trainiert Saegen als trennendes Verfahren.
 */
export function SaegeTrainer({ titel = 'Saegen', className }: SaegeTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Saegeprozess, Spannung und Spanbezug." badgeText="Saege" badgeSymbol="S" badgeVariante="primary" optionen={SAEGE_OPTIONEN} aufgaben={SAEGE_AUFGABEN} fehlerName="SaegeTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig getrennt." feedbackFalsch="Noch nicht passend." standardBegruendung="Saegen ist ein trennendes Verfahren mit sicherer Werkstueckspannung." naechsterButton="Naechste Saegefrage" className={className} />
  );
}

/**
 * Trainiert Bohren und sichere Schnittwertarbeit.
 */
export function BohrenTrainer({ titel = 'Bohren', className }: BohrenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Bohrung, Bewegung und Tabellenwert." badgeText="Bohren" badgeSymbol="B" badgeVariante="info" optionen={BOHREN_OPTIONEN} aufgaben={BOHREN_AUFGABEN} fehlerName="BohrenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gebohrt." feedbackFalsch="Noch nicht passend." standardBegruendung="Bohren braucht Drehung, Vorschub und passende Werkzeugdaten." naechsterButton="Naechste Bohrfrage" className={className} />
  );
}

/**
 * Trainiert Senken und Reiben als Bohrungsnacharbeit.
 */
export function SenkenReibenTrainer({ titel = 'Senken und Reiben', className }: SenkenReibenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Unterscheide Senken, Reiben und Pruefen." badgeText="Bohrung" badgeSymbol="SR" badgeVariante="primary" optionen={SENKEN_REIBEN_OPTIONEN} aufgaben={SENKEN_REIBEN_AUFGABEN} fehlerName="SenkenReibenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig nachbearbeitet." feedbackFalsch="Noch nicht passend." standardBegruendung="Senken und Reiben haben unterschiedliche Ziele an der Bohrung." naechsterButton="Naechste Bohrungsfrage" className={className} />
  );
}

/**
 * Trainiert Gewindeschneiden mit Kernlochbezug.
 */
export function GewindeschneidenTrainer({ titel = 'Gewindeschneiden', className }: GewindeschneidenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Kernloch, Gewindeprofil und Spanbruch." badgeText="Gewinde" badgeSymbol="G" badgeVariante="warning" optionen={GEWINDESCHNEIDEN_OPTIONEN} aufgaben={GEWINDESCHNEIDEN_AUFGABEN} fehlerName="GewindeschneidenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geschnitten." feedbackFalsch="Noch nicht passend." standardBegruendung="Gewinde brauchen Kernloch, Werkzeugfuehrung und passende Schmierung nach Vorgabe." naechsterButton="Naechste Gewindefrage" className={className} />
  );
}

/**
 * Trainiert Grundlagen des Drehens.
 */
export function DrehenGrundlagenTrainer({ titel = 'Drehen Grundlagen', className }: DrehenGrundlagenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Rotation, Werkzeug und Schnittwerte." badgeText="Drehen" badgeSymbol="D" badgeVariante="primary" optionen={DREHEN_GRUNDLAGEN_OPTIONEN} aufgaben={DREHEN_GRUNDLAGEN_AUFGABEN} fehlerName="DrehenGrundlagenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gedreht." feedbackFalsch="Noch nicht passend." standardBegruendung="Beim Drehen rotiert meist das Werkstueck und das Werkzeug schneidet." naechsterButton="Naechste Drehfrage" className={className} />
  );
}

/**
 * Trainiert Laengsdrehen und Plandrehen.
 */
export function LaengsPlanDrehenTrainer({ titel = 'Laengs- und Plandrehen', className }: LaengsPlanDrehenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Unterscheide Mantel- und Stirnflaechenbearbeitung." badgeText="Drehen" badgeSymbol="LP" badgeVariante="info" optionen={LAENGS_PLAN_DREHEN_OPTIONEN} aufgaben={LAENGS_PLAN_DREHEN_AUFGABEN} fehlerName="LaengsPlanDrehenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig unterschieden." feedbackFalsch="Noch nicht passend." standardBegruendung="Die Zeichnung entscheidet, ob Laengs- oder Plandrehen passt." naechsterButton="Naechste Drehartfrage" className={className} />
  );
}

/**
 * Trainiert Grundlagen des Fraesens.
 */
export function FraesenGrundlagenTrainer({ titel = 'Fraesen Grundlagen', className }: FraesenGrundlagenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Fraeser, Tischvorschub und Schneiden." badgeText="Fraesen" badgeSymbol="F" badgeVariante="primary" optionen={FRAESEN_GRUNDLAGEN_OPTIONEN} aufgaben={FRAESEN_GRUNDLAGEN_AUFGABEN} fehlerName="FraesenGrundlagenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gefraest." feedbackFalsch="Noch nicht passend." standardBegruendung="Beim Fraesen rotiert ein meist mehrschneidiges Werkzeug." naechsterButton="Naechste Fraesfrage" className={className} />
  );
}

/**
 * Trainiert Umfangsfraesen und Stirnfraesen.
 */
export function UmfangStirnFraesenTrainer({ titel = 'Umfangs- und Stirnfraesen', className }: UmfangStirnFraesenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Unterscheide Werkzeugzone und Flaechenziel." badgeText="Fraesen" badgeSymbol="US" badgeVariante="info" optionen={UMFANG_STIRN_FRAESEN_OPTIONEN} aufgaben={UMFANG_STIRN_FRAESEN_AUFGABEN} fehlerName="UmfangStirnFraesenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig unterschieden." feedbackFalsch="Noch nicht passend." standardBegruendung="Umfangs- und Stirnfraesen werden nach arbeitender Werkzeugzone abgegrenzt." naechsterButton="Naechste Fraesartfrage" className={className} />
  );
}

/**
 * Trainiert Schleifen als trennendes Feinbearbeitungsverfahren.
 */
export function SchleifenTrainer({ titel = 'Schleifen', className }: SchleifenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Schleifkorn, Waerme, Schutz und Scheibenzustand." badgeText="Schleifen" badgeSymbol="S" badgeVariante="warning" optionen={SCHLEIFEN_OPTIONEN} aufgaben={SCHLEIFEN_AUFGABEN} fehlerName="SchleifenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geschliffen." feedbackFalsch="Noch nicht passend." standardBegruendung="Schleifen braucht besondere Aufmerksamkeit fuer Waerme und Schutz." naechsterButton="Naechste Schleiffrage" className={className} />
  );
}

/**
 * Trainiert Stanzen und Schneiden.
 */
export function StanzenSchneidenTrainer({ titel = 'Stanzen und Schneiden', className }: StanzenSchneidenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Werkzeugteile, Grat und Schutzbereich." badgeText="Stanzen" badgeSymbol="ST" badgeVariante="danger" optionen={STANZEN_SCHNEIDEN_OPTIONEN} aufgaben={STANZEN_SCHNEIDEN_AUFGABEN} fehlerName="StanzenSchneidenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geschnitten." feedbackFalsch="Noch nicht passend." standardBegruendung="Stanzwerkzeuge haben Gefahrbereiche, die nicht beruehrt werden." naechsterButton="Naechste Stanzfrage" className={className} />
  );
}

/**
 * Trainiert Biegen als Umformverfahren.
 */
export function BiegenTrainer({ titel = 'Biegen', className }: BiegenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Umformen, Radius und Rueckfederung." badgeText="Biegen" badgeSymbol="B" badgeVariante="primary" optionen={BIEGEN_OPTIONEN} aufgaben={BIEGEN_AUFGABEN} fehlerName="BiegenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gebogen." feedbackFalsch="Noch nicht passend." standardBegruendung="Biegen ist spanloses Umformen mit Radius- und Winkelbezug." naechsterButton="Naechste Biegefrage" className={className} />
  );
}

/**
 * Trainiert Walzen und Walzspalt.
 */
export function WalzenTrainer({ titel = 'Walzen', className }: WalzenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Umformung, Walzspalt und Pruefmerkmal." badgeText="Walzen" badgeSymbol="W" badgeVariante="info" optionen={WALZEN_OPTIONEN} aufgaben={WALZEN_AUFGABEN} fehlerName="WalzenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gewalzt." feedbackFalsch="Noch nicht passend." standardBegruendung="Walzen veraendert Dicke oder Form durch Druck im Walzspalt." naechsterButton="Naechste Walzfrage" className={className} />
  );
}

/**
 * Trainiert Tiefziehen.
 */
export function TiefziehenTrainer({ titel = 'Tiefziehen', className }: TiefziehenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Hohlkoerper, Niederhalter und typische Fehler." badgeText="Tiefziehen" badgeSymbol="T" badgeVariante="primary" optionen={TIEFZIEHEN_OPTIONEN} aufgaben={TIEFZIEHEN_AUFGABEN} fehlerName="TiefziehenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig tiefgezogen." feedbackFalsch="Noch nicht passend." standardBegruendung="Tiefziehen formt Blech zu Hohlkoerpern und braucht kontrollierte Werkzeugfuehrung." naechsterButton="Naechste Tiefziehfrage" className={className} />
  );
}

/**
 * Trainiert Pressen und Druckzusammenhang.
 */
export function PressenTrainer({ titel = 'Pressen', className }: PressenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Presskraft, Druckformel und Schutzfreigabe." badgeText="Pressen" badgeSymbol="P" badgeVariante="warning" optionen={PRESSEN_OPTIONEN} aufgaben={PRESSEN_AUFGABEN} fehlerName="PressenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gepresst." feedbackFalsch="Noch nicht passend." standardBegruendung="Pressen braucht Kraft, Flaechenbezug und sichere Freigabe." naechsterButton="Naechste Pressfrage" className={className} />
  );
}

/**
 * Trainiert Schmieden.
 */
export function SchmiedenTrainer({ titel = 'Schmieden', className }: SchmiedenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Umformen, Waerme und Rohling." badgeText="Schmieden" badgeSymbol="S" badgeVariante="warning" optionen={SCHMIEDEN_OPTIONEN} aufgaben={SCHMIEDEN_AUFGABEN} fehlerName="SchmiedenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geschmiedet." feedbackFalsch="Noch nicht passend." standardBegruendung="Schmieden formt Rohlinge mit hoher Kraft, haeufig unter Waerme." naechsterButton="Naechste Schmiedefrage" className={className} />
  );
}

/**
 * Trainiert Giessen als Urformen.
 */
export function GiessenTrainer({ titel = 'Giessen', className }: GiessenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Urformen, Schmelze, Form und Speiser." badgeText="Giessen" badgeSymbol="G" badgeVariante="primary" optionen={GIESSEN_OPTIONEN} aufgaben={GIESSEN_AUFGABEN} fehlerName="GiessenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig gegossen." feedbackFalsch="Noch nicht passend." standardBegruendung="Giessen erzeugt Form aus fluessigem Werkstoff." naechsterButton="Naechste Gussfrage" className={className} />
  );
}

/**
 * Trainiert Schweissen als Fuegeverfahren.
 */
export function SchweissenTrainer({ titel = 'Schweissen', className }: SchweissenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Fuegen, Schweissnaht und Schutz." badgeText="Schweissen" badgeSymbol="SW" badgeVariante="danger" optionen={SCHWEISSEN_OPTIONEN} aufgaben={SCHWEISSEN_AUFGABEN} fehlerName="SchweissenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geschweisst." feedbackFalsch="Noch nicht passend." standardBegruendung="Schweissen verbindet Bauteile und erfordert besonderen Schutz." naechsterButton="Naechste Schweissfrage" className={className} />
  );
}

/**
 * Trainiert Loeten.
 */
export function LoetenTrainer({ titel = 'Loeten', className }: LoetenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Lot, Benetzung und Fuegespalt." badgeText="Loeten" badgeSymbol="L" badgeVariante="info" optionen={LOETEN_OPTIONEN} aufgaben={LOETEN_AUFGABEN} fehlerName="LoetenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geloetet." feedbackFalsch="Noch nicht passend." standardBegruendung="Loeten braucht Lot, passende Temperatur und saubere Fuegeflaechen." naechsterButton="Naechste Loetfrage" className={className} />
  );
}

/**
 * Trainiert Kleben mit Datenblattbezug.
 */
export function KlebenTrainer({ titel = 'Kleben', className }: KlebenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Ordne Oberflaeche, Datenblatt und Ausharten." badgeText="Kleben" badgeSymbol="K" badgeVariante="primary" optionen={KLEBEN_OPTIONEN} aufgaben={KLEBEN_AUFGABEN} fehlerName="KlebenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig geklebt." feedbackFalsch="Noch nicht passend." standardBegruendung="Kleben braucht vorbereitete Oberflaechen und Datenblattvorgaben." naechsterButton="Naechste Klebefrage" className={className} />
  );
}

/**
 * Trainiert Schrauben und Nieten als Verbindungsarten.
 */
export function SchraubenNietenTrainer({ titel = 'Schrauben und Nieten', className }: SchraubenNietenTrainerProps) {
  return (
    <EigenschaftAuswahlTrainer titel={titel} beschreibung="Unterscheide loesbare und dauerhafte Verbindung." badgeText="Verbindung" badgeSymbol="V" badgeVariante="info" optionen={SCHRAUBEN_NIETEN_OPTIONEN} aufgaben={SCHRAUBEN_NIETEN_AUFGABEN} fehlerName="SchraubenNietenTrainer" feedbackNeutral="Waehle eine Antwort." feedbackRichtig="Richtig verbunden." feedbackFalsch="Noch nicht passend." standardBegruendung="Schrauben und Nieten werden nach Verbindung, Vorgabe und Sicherung unterschieden." naechsterButton="Naechste Verbindungsfrage" className={className} />
  );
}

interface KunststoffverfahrenTrainerBaseProps {
  titel: string;
  beschreibung: string;
  badgeText: string;
  badgeSymbol: string;
  optionen: readonly string[];
  aufgaben: readonly EigenschaftTrainerAufgabe[];
  fehlerName: string;
  standardBegruendung: string;
  naechsterButton: string;
  className?: string;
}

/**
 * Rendert einen einheitlichen Auswahltrainer fuer Kunststoffverfahren.
 */
function KunststoffverfahrenTrainerBase({
  titel,
  beschreibung,
  badgeText,
  badgeSymbol,
  optionen,
  aufgaben,
  fehlerName,
  standardBegruendung,
  naechsterButton,
  className,
}: KunststoffverfahrenTrainerBaseProps) {
  return (
    <EigenschaftAuswahlTrainer
      titel={titel}
      beschreibung={beschreibung}
      badgeText={badgeText}
      badgeSymbol={badgeSymbol}
      badgeVariante="primary"
      optionen={optionen}
      aufgaben={aufgaben}
      fehlerName={fehlerName}
      feedbackNeutral="Waehle eine Antwort."
      feedbackRichtig="Richtig eingeordnet."
      feedbackFalsch="Noch nicht passend."
      standardBegruendung={standardBegruendung}
      naechsterButton={naechsterButton}
      className={className}
    />
  );
}

/**
 * Trainiert den Ueberblick ueber die Spritzgiessmaschine.
 */
export function SpritzgiessmaschineTrainer({ titel = 'Spritzgiessmaschine ueberblicken', className }: SpritzgiessmaschineTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Maschinenbereiche und Prozessfolge." badgeText="Spritzguss" badgeSymbol="SG" optionen={['Schliessseite erkennen', 'Spritzeinheit zuordnen', 'Werkzeugbereich pruefen', 'Nur Farbe vergleichen']} aufgaben={[{ frage: 'Welche Seite haelt das Werkzeug geschlossen?', korrekt: 'Schliessseite erkennen' }, { frage: 'Wo wird Granulat plastifiziert?', korrekt: 'Spritzeinheit zuordnen' }, { frage: 'Wo entsteht die Bauteilform?', korrekt: 'Werkzeugbereich pruefen' }]} fehlerName="SpritzgiessmaschineTrainer" standardBegruendung="Spritzgiessen verbindet Schliessseite, Spritzeinheit und Werkzeug." naechsterButton="Naechste Maschinenfrage" className={className} />;
}

/**
 * Trainiert Materialtrichter und Trocknung.
 */
export function MaterialtrichterTrocknungTrainer({ titel = 'Materialtrichter und Trocknung', className }: MaterialtrichterTrocknungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Materialfreigabe, Trocknung und Sauberkeit." badgeText="Material" badgeSymbol="M" optionen={['Charge pruefen', 'Datenblatt nutzen', 'Trichter sauber halten', 'Feuchte ignorieren']} aufgaben={[{ frage: 'Was pruefst du vor dem Einfuellen?', korrekt: 'Charge pruefen' }, { frage: 'Woher kommen Trocknungsbedingungen?', korrekt: 'Datenblatt nutzen' }, { frage: 'Was verhindert Vermischungen?', korrekt: 'Trichter sauber halten' }]} fehlerName="MaterialtrichterTrocknungTrainer" standardBegruendung="Materialzustand und Freigabe sind Prozessgrundlage." naechsterButton="Naechste Materialfrage" className={className} />;
}

/**
 * Trainiert Schnecke und Zylinder.
 */
export function SchneckeZylinderTrainer({ titel = 'Schnecke und Zylinder', className }: SchneckeZylinderTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Foerdern, Plastifizieren und Dosieren." badgeText="Schnecke" badgeSymbol="SZ" optionen={['Granulat foerdern', 'Schmelze homogenisieren', 'Dosiermenge bilden', 'Schnecke trocken laufen lassen']} aufgaben={[{ frage: 'Welche Aufgabe hat die Schnecke zuerst?', korrekt: 'Granulat foerdern' }, { frage: 'Was soll aus dem Kunststoff entstehen?', korrekt: 'Schmelze homogenisieren' }, { frage: 'Was wird fuer den naechsten Schuss bereitgestellt?', korrekt: 'Dosiermenge bilden' }]} fehlerName="SchneckeZylinderTrainer" standardBegruendung="Schnecke und Zylinder bereiten die Schmelze kontrolliert vor." naechsterButton="Naechste Schneckenfrage" className={className} />;
}

/**
 * Trainiert die Einzugszone.
 */
export function EinzugszoneTrainer({ titel = 'Einzugszone', className }: EinzugszoneTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Zufuhr und typische Einzugsstoerungen." badgeText="Einzug" badgeSymbol="E" optionen={['Granulat aufnehmen', 'Brueckenbildung melden', 'Materialfluss beobachten', 'Trichter leerfahren']} aufgaben={[{ frage: 'Was passiert in der Einzugszone?', korrekt: 'Granulat aufnehmen' }, { frage: 'Was meldest du bei stockendem Material?', korrekt: 'Brueckenbildung melden' }, { frage: 'Was beobachtest du am Prozessstart?', korrekt: 'Materialfluss beobachten' }]} fehlerName="EinzugszoneTrainer" standardBegruendung="Die Einzugszone braucht gleichmaessige Materialzufuhr." naechsterButton="Naechste Einzugsfrage" className={className} />;
}

/**
 * Trainiert die Kompressionszone.
 */
export function KompressionszoneTrainer({ titel = 'Kompressionszone', className }: KompressionszoneTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Verdichtung, Waerme und Druckaufbau." badgeText="Kompression" badgeSymbol="KZ" optionen={['Druck aufbauen', 'Material aufschmelzen', 'Temperatur beachten', 'Wasser zusetzen']} aufgaben={[{ frage: 'Was steigt in der Kompressionszone?', korrekt: 'Druck aufbauen' }, { frage: 'Was passiert mit dem Granulat zunehmend?', korrekt: 'Material aufschmelzen' }, { frage: 'Welche Groesse bleibt quellenpflichtig?', korrekt: 'Temperatur beachten' }]} fehlerName="KompressionszoneTrainer" standardBegruendung="Kompression erzeugt Druck, Scherung und Waermeeintrag." naechsterButton="Naechste Kompressionsfrage" className={className} />;
}

/**
 * Trainiert die Meteringzone.
 */
export function MeteringzoneTrainer({ titel = 'Meteringzone', className }: MeteringzoneTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Homogenisieren und Dosieren." badgeText="Metering" badgeSymbol="MT" optionen={['Schmelze mischen', 'Menge dosieren', 'Vorraum fuellen', 'Kavitaet oeffnen']} aufgaben={[{ frage: 'Was soll mit der Schmelze passieren?', korrekt: 'Schmelze mischen' }, { frage: 'Was wird fuer den Schuss festgelegt?', korrekt: 'Menge dosieren' }, { frage: 'Wo sammelt sich Schmelze vor dem Einspritzen?', korrekt: 'Vorraum fuellen' }]} fehlerName="MeteringzoneTrainer" standardBegruendung="Die Meteringzone liefert eine gleichmaessige dosierte Schmelze." naechsterButton="Naechste Meteringfrage" className={className} />;
}

/**
 * Trainiert Rueckstromsperre und Duese.
 */
export function RueckstromsperreDueseTrainer({ titel = 'Rueckstromsperre und Duese', className }: RueckstromsperreDueseTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Rueckfluss, Druckaufbau und Uebergabe." badgeText="Duese" badgeSymbol="RD" optionen={['Rueckfluss verhindern', 'Druck halten', 'Werkzeug anbinden', 'Schmelze zurueckblasen']} aufgaben={[{ frage: 'Welche Aufgabe hat die Rueckstromsperre?', korrekt: 'Rueckfluss verhindern' }, { frage: 'Was braucht die Einspritzphase?', korrekt: 'Druck halten' }, { frage: 'Was verbindet die Duese?', korrekt: 'Werkzeug anbinden' }]} fehlerName="RueckstromsperreDueseTrainer" standardBegruendung="Rueckstromsperre und Duese stabilisieren die Schmelzeuebergabe." naechsterButton="Naechste Duesenfrage" className={className} />;
}

/**
 * Trainiert Werkzeug und Kavitaet.
 */
export function WerkzeugKavitaetTrainer({ titel = 'Werkzeug und Kavitaet', className }: WerkzeugKavitaetTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Werkzeughaelften, Hohlraum und Trennebene." badgeText="Werkzeug" badgeSymbol="WK" optionen={['Kavitaet erkennen', 'Trennebene beachten', 'Werkzeugzustand melden', 'Form raten']} aufgaben={[{ frage: 'Wie heisst der formgebende Hohlraum?', korrekt: 'Kavitaet erkennen' }, { frage: 'Welche Linie trennt Werkzeughaelften?', korrekt: 'Trennebene beachten' }, { frage: 'Was tust du bei Beschaedigung?', korrekt: 'Werkzeugzustand melden' }]} fehlerName="WerkzeugKavitaetTrainer" standardBegruendung="Werkzeug und Kavitaet bestimmen Bauteilform und Entformung." naechsterButton="Naechste Werkzeugfrage" className={className} />;
}

/**
 * Trainiert Anguss und Entlueftung.
 */
export function AngussEntlueftungTrainer({ titel = 'Anguss und Entlueftung', className }: AngussEntlueftungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Fuellweg und Luftabfuhr." badgeText="Fuellung" badgeSymbol="AE" optionen={['Schmelze fuehren', 'Luft entweichen lassen', 'Brandstellen melden', 'Entlueftung zukleben']} aufgaben={[{ frage: 'Was macht der Anguss?', korrekt: 'Schmelze fuehren' }, { frage: 'Was muss aus der Kavitaet heraus?', korrekt: 'Luft entweichen lassen' }, { frage: 'Was kann schlechte Entlueftung sichtbar machen?', korrekt: 'Brandstellen melden' }]} fehlerName="AngussEntlueftungTrainer" standardBegruendung="Beim Fuellen muss Schmelze hinein und Luft heraus." naechsterButton="Naechste Fuellfrage" className={className} />;
}

/**
 * Trainiert Auswerfer und Entformen.
 */
export function AuswerferEntformenTrainer({ titel = 'Auswerfer und Entformen', className }: AuswerferEntformenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Werkzeugoeffnung, Auswerfer und Entnahme." badgeText="Entformen" badgeSymbol="AW" optionen={['Kuehlung abwarten', 'Auswerferweg pruefen', 'Teil sicher entnehmen', 'Teil heraushebeln']} aufgaben={[{ frage: 'Was ist vor dem Entformen wichtig?', korrekt: 'Kuehlung abwarten' }, { frage: 'Was muss zur Bewegung passen?', korrekt: 'Auswerferweg pruefen' }, { frage: 'Was passiert nach dem Oeffnen?', korrekt: 'Teil sicher entnehmen' }]} fehlerName="AuswerferEntformenTrainer" standardBegruendung="Entformen braucht ausreichende Stabilitaet und sichere Entnahme." naechsterButton="Naechste Entformfrage" className={className} />;
}

/**
 * Trainiert Werkzeugtemperierung.
 */
export function WerkzeugtemperierungTrainer({ titel = 'Werkzeugtemperierung', className }: WerkzeugtemperierungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Temperierkreis, Stabilitaet und Bauteilwirkung." badgeText="Temperierung" badgeSymbol="WT" optionen={['Vorlauf pruefen', 'Ruecklauf beobachten', 'Masshaltigkeit sichern', 'Schlauch knicken']} aufgaben={[{ frage: 'Was gehoert zum Temperierkreis?', korrekt: 'Vorlauf pruefen' }, { frage: 'Was zeigt Durchfluss und Waermeabgabe?', korrekt: 'Ruecklauf beobachten' }, { frage: 'Was beeinflusst stabile Temperierung?', korrekt: 'Masshaltigkeit sichern' }]} fehlerName="WerkzeugtemperierungTrainer" standardBegruendung="Temperierung beeinflusst Kuehlung, Oberflaeche und Masse." naechsterButton="Naechste Temperierfrage" className={className} />;
}

/**
 * Trainiert Plastifizieren und Dosieren.
 */
export function PlastifizierenDosierenTrainer({ titel = 'Plastifizieren und Dosieren', className }: PlastifizierenDosierenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Schmelzebildung, Staudruck und Dosierweg." badgeText="Dosieren" badgeSymbol="PD" optionen={['Schnecke rotiert', 'Schmelze sammeln', 'Dosierweg beachten', 'Menge schaetzen']} aufgaben={[{ frage: 'Welche Bewegung plastifiziert typischerweise?', korrekt: 'Schnecke rotiert' }, { frage: 'Was entsteht vor der Schnecke?', korrekt: 'Schmelze sammeln' }, { frage: 'Was legt die Schussmenge mit fest?', korrekt: 'Dosierweg beachten' }]} fehlerName="PlastifizierenDosierenTrainer" standardBegruendung="Plastifizieren und Dosieren bereiten den naechsten Schuss vor." naechsterButton="Naechste Dosierfrage" className={className} />;
}

/**
 * Trainiert Einspritzen und Umschaltpunkt.
 */
export function EinspritzenUmschaltpunktTrainer({ titel = 'Einspritzen und Umschaltpunkt', className }: EinspritzenUmschaltpunktTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Fuellphase, Umschalten und Nachdruckstart." badgeText="Einspritzen" badgeSymbol="EU" optionen={['Kavitaet fuellen', 'Umschaltpunkt beachten', 'Nachdruck starten', 'Bis Anschlag fahren']} aufgaben={[{ frage: 'Was passiert in der Einspritzphase?', korrekt: 'Kavitaet fuellen' }, { frage: 'Was trennt Fuell- und Nachdruckphase?', korrekt: 'Umschaltpunkt beachten' }, { frage: 'Was folgt nach dem Umschalten?', korrekt: 'Nachdruck starten' }]} fehlerName="EinspritzenUmschaltpunktTrainer" standardBegruendung="Der Umschaltpunkt ist eine zentrale Prozessvorgabe." naechsterButton="Naechste Einspritzfrage" className={className} />;
}

/**
 * Trainiert Nachdruck.
 */
export function NachdruckTrainer({ titel = 'Nachdruck', className }: NachdruckTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Druckhalten, Nachfluss und Schwindung." badgeText="Nachdruck" badgeSymbol="ND" optionen={['Druck halten', 'Schwindung ausgleichen', 'Anguss beachten', 'Werkzeug oeffnen']} aufgaben={[{ frage: 'Was passiert nach der Fuellung?', korrekt: 'Druck halten' }, { frage: 'Wozu kann Material nachfliessen?', korrekt: 'Schwindung ausgleichen' }, { frage: 'Welche Stelle begrenzt den Nachfluss?', korrekt: 'Anguss beachten' }]} fehlerName="NachdruckTrainer" standardBegruendung="Nachdruck stabilisiert Masse und Gewicht, solange Nachfluss moeglich ist." naechsterButton="Naechste Nachdruckfrage" className={className} />;
}

/**
 * Trainiert Kuehlzeit und Restkuehlzeit.
 */
export function KuehlzeitRestkuehlzeitTrainer({ titel = 'Kuehlzeit und Restkuehlzeit', className }: KuehlzeitRestkuehlzeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Erstarrung, Entformbarkeit und Zyklusanteil." badgeText="Kuehlen" badgeSymbol="KR" optionen={['Erstarrung abwarten', 'Entformbarkeit pruefen', 'Zykluszeit beachten', 'Heiss auswerfen']} aufgaben={[{ frage: 'Was muss im Werkzeug passieren?', korrekt: 'Erstarrung abwarten' }, { frage: 'Was entscheidet ueber sicheres Auswerfen?', korrekt: 'Entformbarkeit pruefen' }, { frage: 'Welche Zeit beeinflusst die Ausbringung stark?', korrekt: 'Zykluszeit beachten' }]} fehlerName="KuehlzeitRestkuehlzeitTrainer" standardBegruendung="Kuehlzeit beeinflusst Stabilitaet, Zyklus und Bauteilqualitaet." naechsterButton="Naechste Kuehlfrage" className={className} />;
}

/**
 * Trainiert Schliesskraft.
 */
export function SchliesskraftTrainer({ titel = 'Schliesskraft', className }: SchliesskraftTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Gegenkraft, Trennebene und Gratbildung." badgeText="Schliesskraft" badgeSymbol="SK" optionen={['Werkzeug geschlossen halten', 'Innendruck beachten', 'Gratbildung melden', 'Kraft nach Gefuehl senken']} aufgaben={[{ frage: 'Was ist die Aufgabe der Schliesskraft?', korrekt: 'Werkzeug geschlossen halten' }, { frage: 'Wogegen wirkt die Schliesskraft?', korrekt: 'Innendruck beachten' }, { frage: 'Was kann bei unpassender Einstellung auftreten?', korrekt: 'Gratbildung melden' }]} fehlerName="SchliesskraftTrainer" standardBegruendung="Schliesskraft wird nach Prozessvorgabe eingestellt." naechsterButton="Naechste Schliesskraftfrage" className={className} />;
}

/**
 * Trainiert Spritzgiessparameter.
 */
export function SpritzgiessParameterTrainer({ titel = 'Einspritzdruck, Staudruck, Temperaturen', className }: SpritzgiessParameterTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Druck- und Temperaturparameter." badgeText="Parameter" badgeSymbol="P" optionen={['Einspritzdruck zuordnen', 'Staudruck beim Dosieren', 'Temperaturen mit Quelle', 'Werte frei erfinden']} aufgaben={[{ frage: 'Welche Groesse wirkt beim Fuellen?', korrekt: 'Einspritzdruck zuordnen' }, { frage: 'Welcher Druck gehoert zum Plastifizieren?', korrekt: 'Staudruck beim Dosieren' }, { frage: 'Wie gehst du mit Temperaturwerten um?', korrekt: 'Temperaturen mit Quelle' }]} fehlerName="SpritzgiessParameterTrainer" standardBegruendung="Parameter werden nur mit Material, Werkzeug und freigegebener Quelle bewertet." naechsterButton="Naechste Parameterfrage" className={className} />;
}

/**
 * Trainiert den kompletten Spritzgiesszyklus.
 */
export function SpritzgiesszyklusTrainer({ titel = 'Kompletter Spritzgiesszyklus', className }: SpritzgiesszyklusTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne die wiederkehrenden Zyklusschritte." badgeText="Zyklus" badgeSymbol="Z" optionen={['Werkzeug schliessen', 'Einspritzen und Nachdruck', 'Kuehlen und auswerfen', 'Reihenfolge mischen']} aufgaben={[{ frage: 'Was passiert vor dem Einspritzen?', korrekt: 'Werkzeug schliessen' }, { frage: 'Welche Phasen fuellen und stabilisieren?', korrekt: 'Einspritzen und Nachdruck' }, { frage: 'Was folgt vor dem neuen Zyklus?', korrekt: 'Kuehlen und auswerfen' }]} fehlerName="SpritzgiesszyklusTrainer" standardBegruendung="Der Zyklus laeuft wiederholbar in festgelegter Reihenfolge." naechsterButton="Naechste Zyklusfrage" className={className} />;
}

/**
 * Trainiert den Extruderaufbau.
 */
export function ExtruderAufbauTrainer({ titel = 'Extruder aufbauen', className }: ExtruderAufbauTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Trichter, Schnecke, Werkzeug und Abzug." badgeText="Extruder" badgeSymbol="EX" optionen={['Kontinuierlich foerdern', 'Werkzeug formt', 'Abzug stabil halten', 'Schussweise auswerfen']} aufgaben={[{ frage: 'Wie arbeitet Extrusion im Grundprinzip?', korrekt: 'Kontinuierlich foerdern' }, { frage: 'Was gibt den Querschnitt vor?', korrekt: 'Werkzeug formt' }, { frage: 'Was fuehrt das Produkt weiter?', korrekt: 'Abzug stabil halten' }]} fehlerName="ExtruderAufbauTrainer" standardBegruendung="Extrusion erzeugt einen kontinuierlichen Strang durch ein Werkzeug." naechsterButton="Naechste Extruderfrage" className={className} />;
}

/**
 * Trainiert Extrusionsprodukte.
 */
export function ExtrusionsprodukteTrainer({ titel = 'Profile, Rohre und Folien extrudieren', className }: ExtrusionsprodukteTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Produktform, Kalibrierung und Abzug." badgeText="Extrusion" badgeSymbol="EP" optionen={['Querschnitt beachten', 'Kalibrierung nutzen', 'Wanddicke pruefen', 'Produkt knicken']} aufgaben={[{ frage: 'Was bestimmt Profil oder Rohrform?', korrekt: 'Querschnitt beachten' }, { frage: 'Was hilft beim Masshalten?', korrekt: 'Kalibrierung nutzen' }, { frage: 'Was wird bei Rohr und Folie kontrolliert?', korrekt: 'Wanddicke pruefen' }]} fehlerName="ExtrusionsprodukteTrainer" standardBegruendung="Extrusionsprodukte brauchen stabile Formgebung, Kuehlung und Abzug." naechsterButton="Naechste Produktfrage" className={className} />;
}

/**
 * Trainiert Blasformen.
 */
export function BlasformenTrainer({ titel = 'Blasformen', className }: BlasformenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Vorformling, Luft und Hohlkoerper." badgeText="Blasform" badgeSymbol="BF" optionen={['Vorformling nutzen', 'Luftdruck formt', 'Hohlkoerper pruefen', 'Werkzeug offen aufblasen']} aufgaben={[{ frage: 'Was wird in die Form gebracht?', korrekt: 'Vorformling nutzen' }, { frage: 'Was legt den Kunststoff an die Kavitaet?', korrekt: 'Luftdruck formt' }, { frage: 'Was entsteht typischerweise?', korrekt: 'Hohlkoerper pruefen' }]} fehlerName="BlasformenTrainer" standardBegruendung="Blasformen formt warme Kunststoffvorformen mit Luftdruck." naechsterButton="Naechste Blasformfrage" className={className} />;
}

/**
 * Trainiert Thermoformen.
 */
export function ThermoformenTrainer({ titel = 'Thermoformen', className }: ThermoformenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Halbzeug, Erwarmen, Formen und Beschnitt." badgeText="Thermoform" badgeSymbol="TF" optionen={['Halbzeug erwaermen', 'An Form anlegen', 'Beschnitt beachten', 'Kalt tiefziehen']} aufgaben={[{ frage: 'Was ist der Ausgangsstoff?', korrekt: 'Halbzeug erwaermen' }, { frage: 'Was passiert mit der weichen Folie?', korrekt: 'An Form anlegen' }, { frage: 'Was folgt haeufig nach dem Formen?', korrekt: 'Beschnitt beachten' }]} fehlerName="ThermoformenTrainer" standardBegruendung="Thermoformen nutzt erwaermte Folie oder Platte als Halbzeug." naechsterButton="Naechste Thermoformfrage" className={className} />;
}

/**
 * Trainiert Schwindung und Verzug.
 */
export function SchwindungVerzugTrainer({ titel = 'Schwindung und Verzug', className }: SchwindungVerzugTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Massaenderung, Formfehler und Kuehlung." badgeText="Qualitaet" badgeSymbol="SV" optionen={['Schwindung erkennen', 'Verzug melden', 'Kuehlung bewerten', 'Teil warm richten']} aufgaben={[{ frage: 'Was veraendert Masse beim Abkuehlen?', korrekt: 'Schwindung erkennen' }, { frage: 'Was ist eine ungewollte Formabweichung?', korrekt: 'Verzug melden' }, { frage: 'Welche Prozessgroesse beeinflusst beides stark?', korrekt: 'Kuehlung bewerten' }]} fehlerName="SchwindungVerzugTrainer" standardBegruendung="Schwindung und Verzug werden ueber Material, Werkzeug und Prozess beeinflusst." naechsterButton="Naechste Qualitaetsfrage" className={className} />;
}

/**
 * Trainiert Molekuelorientierung.
 */
export function MolekuelorientierungTrainer({ titel = 'Molekuelorientierung einfach', className }: MolekuelorientierungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Fliessrichtung, Kettenausrichtung und Eigenschaften." badgeText="Orientierung" badgeSymbol="MO" optionen={['Fliessrichtung beachten', 'Kettenausrichtung verstehen', 'Richtungseigenschaften melden', 'Molekuele sortieren']} aufgaben={[{ frage: 'Was beeinflusst die Orientierung?', korrekt: 'Fliessrichtung beachten' }, { frage: 'Was kann beim Fliessen passieren?', korrekt: 'Kettenausrichtung verstehen' }, { frage: 'Was kann dadurch entstehen?', korrekt: 'Richtungseigenschaften melden' }]} fehlerName="MolekuelorientierungTrainer" standardBegruendung="Molekuelorientierung beschreibt vereinfacht Ausrichtung durch Fliessen und Erstarren." naechsterButton="Naechste Orientierungsfrage" className={className} />;
}

/**
 * Trainiert Farb- und Materialwechsel.
 */
export function FarbMaterialwechselTrainer({ titel = 'Farbwechsel und Materialwechsel', className }: FarbMaterialwechselTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Spuelen, Freigabe und Dokumentation." badgeText="Wechsel" badgeSymbol="FM" optionen={['Restmaterial entfernen', 'Neue Charge pruefen', 'Erste Teile freigeben', 'Vermischung verstecken']} aufgaben={[{ frage: 'Was passiert mit altem Material?', korrekt: 'Restmaterial entfernen' }, { frage: 'Was pruefst du vor dem Anfahren?', korrekt: 'Neue Charge pruefen' }, { frage: 'Was braucht die Produktion nach dem Wechsel?', korrekt: 'Erste Teile freigeben' }]} fehlerName="FarbMaterialwechselTrainer" standardBegruendung="Wechselprozesse brauchen Sauberkeit, Rueckverfolgbarkeit und Freigabe." naechsterButton="Naechste Wechsel Frage" className={className} />;
}

/**
 * Trainiert den Abgleich von Auftrag und Zeichnung.
 */
export function AuftragZeichnungAbgleichTrainer({ titel = 'Auftrag und Zeichnung abgleichen', className }: AuftragZeichnungAbgleichTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Auftrag, Zeichnung und Widerspruchsklaerung." badgeText="Abgleich" badgeSymbol="AZ" optionen={['Auftrag lesen', 'Zeichnung vergleichen', 'Widerspruch klaeren', 'Einfach starten']} aufgaben={[{ frage: 'Was ist der erste sichere Schritt?', korrekt: 'Auftrag lesen' }, { frage: 'Womit vergleichst du Masse und Vorgaben?', korrekt: 'Zeichnung vergleichen' }, { frage: 'Was machst du bei widerspruechlichen Angaben?', korrekt: 'Widerspruch klaeren' }]} fehlerName="AuftragZeichnungAbgleichTrainer" standardBegruendung="Vor dem Start muessen Auftrag und Zeichnung widerspruchsfrei sein." naechsterButton="Naechste Abgleichfrage" className={className} />;
}

/**
 * Trainiert Material- und Chargenpruefung.
 */
export function MaterialChargePruefenTrainer({ titel = 'Material und Charge pruefen', className }: MaterialChargePruefenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Etikett, Charge und Rueckverfolgbarkeit." badgeText="Charge" badgeSymbol="MC" optionen={['Etikett lesen', 'Charge abgleichen', 'Rueckverfolgung sichern', 'Sackfarbe nehmen']} aufgaben={[{ frage: 'Was pruefst du am Material zuerst?', korrekt: 'Etikett lesen' }, { frage: 'Was muss zum Auftrag passen?', korrekt: 'Charge abgleichen' }, { frage: 'Warum werden Chargen notiert?', korrekt: 'Rueckverfolgung sichern' }]} fehlerName="MaterialChargePruefenTrainer" standardBegruendung="Material und Charge sichern Qualitaet und Nachvollziehbarkeit." naechsterButton="Naechste Materialfrage" className={className} />;
}

/**
 * Trainiert Werkzeugvorbereitung.
 */
export function WerkzeugVorbereitenTrainer({ titel = 'Werkzeug vorbereiten', className }: WerkzeugVorbereitenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Werkzeugidentitaet, Zustand und Ruestplatz." badgeText="Werkzeug" badgeSymbol="WV" optionen={['Werkzeugnummer pruefen', 'Zustand melden', 'Ruestplatz vorbereiten', 'Beschaedigung uebersehen']} aufgaben={[{ frage: 'Wie stellst du sicher, dass das Werkzeug passt?', korrekt: 'Werkzeugnummer pruefen' }, { frage: 'Was tust du bei sichtbarem Schaden?', korrekt: 'Zustand melden' }, { frage: 'Was reduziert Suchzeit und Fehler?', korrekt: 'Ruestplatz vorbereiten' }]} fehlerName="WerkzeugVorbereitenTrainer" standardBegruendung="Werkzeuge werden vor dem Einbau eindeutig und sicher vorbereitet." naechsterButton="Naechste Werkzeugfrage" className={className} />;
}

/**
 * Trainiert Ruesten in Reihenfolge.
 */
export function MaschineRuestenTrainer({ titel = 'Maschine ruesten', className }: MaschineRuestenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne sichere Ruestschritte und Bezugspunkte." badgeText="Ruesten" badgeSymbol="MR" optionen={['Maschine sichern', 'Werkzeug einbauen', 'Nullpunkt pruefen', 'Schutz offen lassen']} aufgaben={[{ frage: 'Was kommt vor Eingriffen?', korrekt: 'Maschine sichern' }, { frage: 'Was gehoert zum Ruestablauf?', korrekt: 'Werkzeug einbauen' }, { frage: 'Was verhindert Lage- und Massfehler?', korrekt: 'Nullpunkt pruefen' }]} fehlerName="MaschineRuestenTrainer" standardBegruendung="Ruesten braucht sichere Reihenfolge, Bezug und Freigabe." naechsterButton="Naechste Ruestfrage" className={className} />;
}

/**
 * Trainiert Parameteruebernahme.
 */
export function ParameterUebernehmenTrainer({ titel = 'Parameter uebernehmen', className }: ParameterUebernehmenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Rezept, Quelle und Plausibilitaet." badgeText="Parameter" badgeSymbol="PU" optionen={['Rezeptstand pruefen', 'Quelle nutzen', 'Rueckfrage stellen', 'Werte auswendig setzen']} aufgaben={[{ frage: 'Was pruefst du vor dem Laden?', korrekt: 'Rezeptstand pruefen' }, { frage: 'Woher kommen sichere Parameter?', korrekt: 'Quelle nutzen' }, { frage: 'Was tust du bei unplausiblen Angaben?', korrekt: 'Rueckfrage stellen' }]} fehlerName="ParameterUebernehmenTrainer" standardBegruendung="Parameter werden aus freigegebener Quelle uebernommen." naechsterButton="Naechste Parameterfrage" className={className} />;
}

/**
 * Trainiert Erstteilherstellung.
 */
export function ErstteilHerstellenTrainer({ titel = 'Erstteil herstellen', className }: ErstteilHerstellenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Anfahren, Erstteil und Trennung vom Serienlauf." badgeText="Erstteil" badgeSymbol="EH" optionen={['Anfahren beobachten', 'Erstteil kennzeichnen', 'Anfahrteile trennen', 'Sofort Serie buchen']} aufgaben={[{ frage: 'Was beobachtest du beim Start?', korrekt: 'Anfahren beobachten' }, { frage: 'Wie bleibt das erste Teil nachvollziehbar?', korrekt: 'Erstteil kennzeichnen' }, { frage: 'Was passiert mit Startteilen?', korrekt: 'Anfahrteile trennen' }]} fehlerName="ErstteilHerstellenTrainer" standardBegruendung="Erstteile und Anfahrteile werden bewusst getrennt und bewertet." naechsterButton="Naechste Erstteilfrage" className={className} />;
}

/**
 * Trainiert Erstteilpruefung.
 */
export function ErstteilPruefenTrainer({ titel = 'Erstteil pruefen', className }: ErstteilPruefenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Sollvorgabe, Pruefmerkmal und Ergebnis." badgeText="Pruefung" badgeSymbol="EP" optionen={['Pruefplan lesen', 'Merkmal messen', 'Ergebnis dokumentieren', 'Grenzwert raten']} aufgaben={[{ frage: 'Wo stehen Pruefmerkmale?', korrekt: 'Pruefplan lesen' }, { frage: 'Was passiert am konkreten Merkmal?', korrekt: 'Merkmal messen' }, { frage: 'Was ist fuer Freigabe wichtig?', korrekt: 'Ergebnis dokumentieren' }]} fehlerName="ErstteilPruefenTrainer" standardBegruendung="Erstteilpruefung vergleicht Ist gegen Soll und dokumentiert das Ergebnis." naechsterButton="Naechste Prueffrage" className={className} />;
}

/**
 * Trainiert Produktionsfreigabe.
 */
export function ProduktionsfreigabeTrainer({ titel = 'Produktionsfreigabe', className }: ProduktionsfreigabeTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Freigabe, Sperrung und Serienstart." badgeText="Freigabe" badgeSymbol="PF" optionen={['Freigabe abwarten', 'Abweichung sperren', 'Serienstart dokumentieren', 'Fehler weiterlaufen lassen']} aufgaben={[{ frage: 'Was ist vor Serienlauf noetig?', korrekt: 'Freigabe abwarten' }, { frage: 'Was passiert mit auffaelligen Teilen?', korrekt: 'Abweichung sperren' }, { frage: 'Was macht den Start nachvollziehbar?', korrekt: 'Serienstart dokumentieren' }]} fehlerName="ProduktionsfreigabeTrainer" standardBegruendung="Produktionsfreigabe ist eine dokumentierte Entscheidung." naechsterButton="Naechste Freigabefrage" className={className} />;
}

/**
 * Trainiert Werkzeugwechselvorbereitung.
 */
export function WerkzeugwechselVorbereitungTrainer({ titel = 'Werkzeugwechsel', className }: WerkzeugwechselVorbereitungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Stoppen, Sichern, Wechseln und Ruestzeit." badgeText="Wechsel" badgeSymbol="WW" optionen={['Anlage stillsetzen', 'Energie sichern', 'Ruestzeit planen', 'In Bewegung wechseln']} aufgaben={[{ frage: 'Was kommt vor dem Werkzeugausbau?', korrekt: 'Anlage stillsetzen' }, { frage: 'Was verhindert unbeabsichtigte Bewegung?', korrekt: 'Energie sichern' }, { frage: 'Welche Zeit muss geplant werden?', korrekt: 'Ruestzeit planen' }]} fehlerName="WerkzeugwechselVorbereitungTrainer" standardBegruendung="Werkzeugwechsel braucht sichere Stillsetzung und Planung." naechsterButton="Naechste Werkzeugwechselfrage" className={className} />;
}

/**
 * Trainiert Anfahren und Abfahren.
 */
export function AnfahrenAbfahrenTrainer({ titel = 'Anfahren und Abfahren', className }: AnfahrenAbfahrenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Startteile, stabilen Lauf und Ausschussbehandlung." badgeText="Start/Stopp" badgeSymbol="AA" optionen={['Anfahrteile trennen', 'Stabilen Lauf pruefen', 'Ausschuss dokumentieren', 'Alles als Gutteil zaehlen']} aufgaben={[{ frage: 'Was machst du mit Teilen aus der Startphase?', korrekt: 'Anfahrteile trennen' }, { frage: 'Was muss vor Serienlauf erkennbar sein?', korrekt: 'Stabilen Lauf pruefen' }, { frage: 'Was passiert mit nicht guten Teilen?', korrekt: 'Ausschuss dokumentieren' }]} fehlerName="AnfahrenAbfahrenTrainer" standardBegruendung="Start- und Stoppteile werden getrennt und bewertet." naechsterButton="Naechste Start-Stopp-Frage" className={className} />;
}

/**
 * Trainiert Schichtuebergabe.
 */
export function SchichtuebergabeTrainer({ titel = 'Schichtuebergabe', className }: SchichtuebergabeTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne relevante Informationen fuer die naechste Schicht." badgeText="Uebergabe" badgeSymbol="SU" optionen={['Auftragsstatus nennen', 'Stoerung uebergeben', 'Offene Pruefung nennen', 'Nur sagen: laeuft']} aufgaben={[{ frage: 'Welche Grundinfo braucht die naechste Schicht?', korrekt: 'Auftragsstatus nennen' }, { frage: 'Was darf nicht verloren gehen?', korrekt: 'Stoerung uebergeben' }, { frage: 'Was ist fuer Qualitaet wichtig?', korrekt: 'Offene Pruefung nennen' }]} fehlerName="SchichtuebergabeTrainer" standardBegruendung="Schichtuebergabe muss fuer Sicherheit, Qualitaet und Ablauf verwertbar sein." naechsterButton="Naechste Uebergabefrage" className={className} />;
}

/**
 * Trainiert Produktionsdaten fuer Qualitaet.
 */
export function ProduktionsdatenQualitaetTrainer({ titel = 'Produktionsdaten fuer Qualitaet sichern', className }: ProduktionsdatenQualitaetTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Auftrag, Charge, Pruefung und Rueckverfolgung." badgeText="Daten" badgeSymbol="PD" optionen={['Auftragsdaten sichern', 'Charge dokumentieren', 'Pruefergebnis notieren', 'Daten spaeter erfinden']} aufgaben={[{ frage: 'Welche Daten verbinden Teil und Auftrag?', korrekt: 'Auftragsdaten sichern' }, { frage: 'Was verbindet Material mit Produkt?', korrekt: 'Charge dokumentieren' }, { frage: 'Was braucht die Qualitaetsklaerung?', korrekt: 'Pruefergebnis notieren' }]} fehlerName="ProduktionsdatenQualitaetTrainer" standardBegruendung="Rueckverfolgbare Daten sichern spaetere Qualitaetsentscheidungen." naechsterButton="Naechste Datenfrage" className={className} />;
}

export function QualitaetBetriebTrainer({ titel = 'Qualitaet im Betrieb', className }: QualitaetBetriebTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Kundenanforderung, Vorgabe und Pruefnachweis." badgeText="Qualitaet" badgeSymbol="QB" optionen={['Anforderung lesen', 'Vorgabe anwenden', 'Pruefung nachweisen', 'Nur schoen aussehen']} aufgaben={[{ frage: 'Womit beginnt Qualitaet?', korrekt: 'Anforderung lesen' }, { frage: 'Was setzt die Fertigung um?', korrekt: 'Vorgabe anwenden' }, { frage: 'Was belegt das Ergebnis?', korrekt: 'Pruefung nachweisen' }]} fehlerName="QualitaetBetriebTrainer" standardBegruendung="Qualitaet wird an Anforderungen und Nachweisen bewertet." naechsterButton="Naechste Qualitaetsfrage" className={className} />;
}

export function SollIstNennmassTrainer({ titel = 'Sollwert Istwert und Nennmass', className }: SollIstNennmassTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Vorgabe, Messwert und Abweichung." badgeText="Soll/Ist" badgeSymbol="SI" optionen={['Nennmass lesen', 'Istwert messen', 'Abweichung bilden', 'Sollwert raten']} aufgaben={[{ frage: 'Was steht in der Zeichnung?', korrekt: 'Nennmass lesen' }, { frage: 'Was entsteht durch Messung?', korrekt: 'Istwert messen' }, { frage: 'Was vergleichst du danach?', korrekt: 'Abweichung bilden' }]} fehlerName="SollIstNennmassTrainer" standardBegruendung="Soll, Ist und Nennmass muessen sauber getrennt werden." naechsterButton="Naechste Soll-Ist-Frage" className={className} />;
}

export function GrenzmasseToleranzTrainer({ titel = 'Grenzmasse und Toleranz', className }: GrenzmasseToleranzTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne unteren Grenzwert, oberen Grenzwert und Gutteilentscheidung." badgeText="Toleranz" badgeSymbol="GT" optionen={['Unteres Grenzmass lesen', 'Oberes Grenzmass lesen', 'Istwert einordnen', 'Grenze verschieben']} aufgaben={[{ frage: 'Was begrenzt den Bereich nach unten?', korrekt: 'Unteres Grenzmass lesen' }, { frage: 'Was begrenzt den Bereich nach oben?', korrekt: 'Oberes Grenzmass lesen' }, { frage: 'Was pruefst du mit dem Messwert?', korrekt: 'Istwert einordnen' }]} fehlerName="GrenzmasseToleranzTrainer" standardBegruendung="Grenzmasse werden aus der Vorgabe gelesen und nicht angepasst." naechsterButton="Naechste Toleranzfrage" className={className} />;
}

export function PruefplanLesenTrainer({ titel = 'Pruefplan lesen', className }: PruefplanLesenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Merkmal, Pruefmittel und Dokumentation." badgeText="Pruefplan" badgeSymbol="PL" optionen={['Merkmal finden', 'Pruefmittel waehlen', 'Ergebnis dokumentieren', 'Merkmal ausdenken']} aufgaben={[{ frage: 'Was wird geprueft?', korrekt: 'Merkmal finden' }, { frage: 'Womit wird geprueft?', korrekt: 'Pruefmittel waehlen' }, { frage: 'Was macht die Pruefung nachvollziehbar?', korrekt: 'Ergebnis dokumentieren' }]} fehlerName="PruefplanLesenTrainer" standardBegruendung="Der Pruefplan ist die verbindliche Quelle fuer Pruefmerkmale." naechsterButton="Naechste Pruefplanfrage" className={className} />;
}

export function PruefhaeufigkeitTrainer({ titel = 'Pruefhaeufigkeit', className }: PruefhaeufigkeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Intervall, Stichprobe und Anlasspruefung." badgeText="Takt" badgeSymbol="PH" optionen={['Intervall lesen', 'Stichprobe ziehen', 'Anlasspruefung starten', 'Pruefung auslassen']} aufgaben={[{ frage: 'Was gibt den Abstand vor?', korrekt: 'Intervall lesen' }, { frage: 'Was pruefst du aus der Menge?', korrekt: 'Stichprobe ziehen' }, { frage: 'Was kann nach Stoerung noetig sein?', korrekt: 'Anlasspruefung starten' }]} fehlerName="PruefhaeufigkeitTrainer" standardBegruendung="Pruefhaeufigkeit wird aus Pruefplan oder Vorgabe uebernommen." naechsterButton="Naechste Haeufigkeitsfrage" className={className} />;
}

export function PruefartenTrainer({ titel = 'Erst Zwischen und Endpruefung', className }: PruefartenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Pruefarten an den richtigen Prozesszeitpunkt." badgeText="Pruefart" badgeSymbol="PA" optionen={['Erstpruefung vor Serie', 'Zwischenpruefung im Lauf', 'Endpruefung am Schluss', 'Alles erst am Ende']} aufgaben={[{ frage: 'Was sichert den Serienstart?', korrekt: 'Erstpruefung vor Serie' }, { frage: 'Was ueberwacht den laufenden Prozess?', korrekt: 'Zwischenpruefung im Lauf' }, { frage: 'Was bewertet das fertige Ergebnis?', korrekt: 'Endpruefung am Schluss' }]} fehlerName="PruefartenTrainer" standardBegruendung="Pruefarten haben unterschiedliche Zeitpunkte und Zwecke." naechsterButton="Naechste Pruefartenfrage" className={className} />;
}

export function SichtMassFunktionspruefungTrainer({ titel = 'Sicht Mass und Funktionspruefung', className }: SichtMassFunktionspruefungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Pruefart und passendes Merkmal." badgeText="Merkmal" badgeSymbol="SMF" optionen={['Oberflaeche ansehen', 'Mass messen', 'Funktion testen', 'Alles nur wiegen']} aufgaben={[{ frage: 'Was gehoert zur Sichtpruefung?', korrekt: 'Oberflaeche ansehen' }, { frage: 'Was gehoert zur Masspruefung?', korrekt: 'Mass messen' }, { frage: 'Was prueft die Nutzung?', korrekt: 'Funktion testen' }]} fehlerName="SichtMassFunktionspruefungTrainer" standardBegruendung="Pruefart und Merkmal muessen zusammenpassen." naechsterButton="Naechste Pruefartfrage" className={className} />;
}

export function StichprobeVollpruefungTrainer({ titel = 'Stichprobe und Vollpruefung', className }: StichprobeVollpruefungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Auswahl, Vollmenge und Risiko." badgeText="Menge" badgeSymbol="SV" optionen={['Auswahl pruefen', 'Jedes Teil pruefen', 'Risiko beachten', 'Zufaellig weniger pruefen']} aufgaben={[{ frage: 'Was ist eine Stichprobe?', korrekt: 'Auswahl pruefen' }, { frage: 'Was ist Vollpruefung?', korrekt: 'Jedes Teil pruefen' }, { frage: 'Was beeinflusst die Vorgabe?', korrekt: 'Risiko beachten' }]} fehlerName="StichprobeVollpruefungTrainer" standardBegruendung="Pruefumfang folgt Vorgabe und Risiko, nicht Bequemlichkeit." naechsterButton="Naechste Mengenfrage" className={className} />;
}

export function GutteilNacharbeitAusschussTrainer({ titel = 'Gutteil Nacharbeit Ausschuss', className }: GutteilNacharbeitAusschussTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Teile nach Pruefergebnis." badgeText="Teile" badgeSymbol="GNA" optionen={['Gutteil weitergeben', 'Nacharbeit klaeren', 'Ausschuss sperren', 'Alles mischen']} aufgaben={[{ frage: 'Was passiert mit einem passenden Teil?', korrekt: 'Gutteil weitergeben' }, { frage: 'Was braucht ein nachbesserbares Teil?', korrekt: 'Nacharbeit klaeren' }, { frage: 'Was passiert mit nicht verwendbaren Teilen?', korrekt: 'Ausschuss sperren' }]} fehlerName="GutteilNacharbeitAusschussTrainer" standardBegruendung="Teile werden nach Pruefung eindeutig getrennt." naechsterButton="Naechste Teilefrage" className={className} />;
}

export function FehlerquoteBerechnenTrainer({ titel = 'Fehlerquote berechnen', className }: FehlerquoteBerechnenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Fehleranzahl, Gesamtmenge und Prozentwert." badgeText="Quote" badgeSymbol="FQ" optionen={['Fehler zaehlen', 'Gesamtmenge erfassen', 'Anteil berechnen', 'Gutteile ignorieren']} aufgaben={[{ frage: 'Welche Menge steht oben im Bruch?', korrekt: 'Fehler zaehlen' }, { frage: 'Welche Menge steht unten im Bruch?', korrekt: 'Gesamtmenge erfassen' }, { frage: 'Was entsteht daraus?', korrekt: 'Anteil berechnen' }]} fehlerName="FehlerquoteBerechnenTrainer" standardBegruendung="Fehlerquote ist Fehleranzahl bezogen auf Gesamtmenge." naechsterButton="Naechste Quotefrage" className={className} />;
}

export function MittelwertSpannweiteTrainer({ titel = 'Mittelwert und Spannweite', className }: MittelwertSpannweiteTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Durchschnitt, Minimum, Maximum und Spannweite." badgeText="Messreihe" badgeSymbol="MS" optionen={['Werte addieren', 'Durch Anzahl teilen', 'Max minus Min bilden', 'Nur besten Wert nehmen']} aufgaben={[{ frage: 'Was machst du fuer den Mittelwert zuerst?', korrekt: 'Werte addieren' }, { frage: 'Was folgt fuer den Durchschnitt?', korrekt: 'Durch Anzahl teilen' }, { frage: 'Wie entsteht die Spannweite?', korrekt: 'Max minus Min bilden' }]} fehlerName="MittelwertSpannweiteTrainer" standardBegruendung="Mittelwert und Spannweite beschreiben unterschiedliche Eigenschaften einer Messreihe." naechsterButton="Naechste Messreihenfrage" className={className} />;
}

export function TrendProzessstreuungTrainer({ titel = 'Trend und Prozessstreuung', className }: TrendProzessstreuungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Richtung, Streuung und Reaktion." badgeText="Trend" badgeSymbol="TP" optionen={['Messreihe ansehen', 'Richtung erkennen', 'Streuung bewerten', 'Ausreisser loeschen']} aufgaben={[{ frage: 'Was brauchst du fuer Trendbewertung?', korrekt: 'Messreihe ansehen' }, { frage: 'Was zeigt eine Drift?', korrekt: 'Richtung erkennen' }, { frage: 'Was zeigt schwankende Werte?', korrekt: 'Streuung bewerten' }]} fehlerName="TrendProzessstreuungTrainer" standardBegruendung="Auffaellige Verlaeufe werden erkannt und nach Vorgabe gemeldet." naechsterButton="Naechste Trendfrage" className={className} />;
}

export function NormalverteilungTrainer({ titel = 'Normalverteilung einfach', className }: NormalverteilungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Mitte, Streuung und Randwerte." badgeText="Verteilung" badgeSymbol="NV" optionen={['Mitte erkennen', 'Streuung sehen', 'Randwerte beachten', 'Jeden Wert gleich haeufig erwarten']} aufgaben={[{ frage: 'Wo liegen bei der Glockenkurve viele Werte?', korrekt: 'Mitte erkennen' }, { frage: 'Was beschreibt die Breite?', korrekt: 'Streuung sehen' }, { frage: 'Welche Werte sind seltener?', korrekt: 'Randwerte beachten' }]} fehlerName="NormalverteilungTrainer" standardBegruendung="Normalverteilung ist ein Modell, kein einzelner Messwert." naechsterButton="Naechste Verteilungsfrage" className={className} />;
}

export function RegelkarteLesenTrainer({ titel = 'Regelkarte einfach lesen', className }: RegelkarteLesenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Messpunkt, Grenze und Reaktion." badgeText="Regelkarte" badgeSymbol="RK" optionen={['Messpunkt eintragen', 'Grenze beachten', 'Warnsignal melden', 'Signal ignorieren']} aufgaben={[{ frage: 'Was wird in die Karte eingetragen?', korrekt: 'Messpunkt eintragen' }, { frage: 'Was darf nicht ueberschritten werden?', korrekt: 'Grenze beachten' }, { frage: 'Was passiert bei Auffaelligkeit?', korrekt: 'Warnsignal melden' }]} fehlerName="RegelkarteLesenTrainer" standardBegruendung="Regelkarten dienen der fruehen Reaktion auf Prozesssignale." naechsterButton="Naechste Regelkartenfrage" className={className} />;
}

export function ProzessfaehigkeitTrainer({ titel = 'Prozessfaehigkeit Cp und Cpk', className }: ProzessfaehigkeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Toleranz, Streuung, Lage und Kennwert." badgeText="Cp/Cpk" badgeSymbol="CP" optionen={['Toleranzbreite lesen', 'Prozessstreuung bewerten', 'Prozesslage beachten', 'Cp nach Gefuehl setzen']} aufgaben={[{ frage: 'Was kommt aus der Vorgabe?', korrekt: 'Toleranzbreite lesen' }, { frage: 'Was zeigen Messdaten?', korrekt: 'Prozessstreuung bewerten' }, { frage: 'Was beruecksichtigt Cpk zusaetzlich?', korrekt: 'Prozesslage beachten' }]} fehlerName="ProzessfaehigkeitTrainer" standardBegruendung="Faehigkeitskennwerte brauchen gueltige Daten und Quellen." naechsterButton="Naechste Faehigkeitsfrage" className={className} />;
}

export function MessunsicherheitQsTrainer({ titel = 'Messunsicherheit in der QS', className }: MessunsicherheitQsTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Messmittel, Umgebung und grenznahes Ergebnis." badgeText="Unsicherheit" badgeSymbol="MU" optionen={['Messmittel pruefen', 'Umgebung beachten', 'Grenzfall klaeren', 'Unsicherheit verstecken']} aufgaben={[{ frage: 'Was beeinflusst das Messergebnis?', korrekt: 'Messmittel pruefen' }, { frage: 'Was kann Messung veraendern?', korrekt: 'Umgebung beachten' }, { frage: 'Was tust du bei grenznahem Wert?', korrekt: 'Grenzfall klaeren' }]} fehlerName="MessunsicherheitQsTrainer" standardBegruendung="Messunsicherheit gehoert zur Bewertung, besonders nahe an Grenzen." naechsterButton="Naechste Unsicherheitsfrage" className={className} />;
}

export function RueckverfolgbarkeitChargeTrainer({ titel = 'Rueckverfolgbarkeit und Charge', className }: RueckverfolgbarkeitChargeTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Charge, Auftrag und Pruefnachweis." badgeText="Trace" badgeSymbol="RC" optionen={['Charge zuordnen', 'Auftrag verknuepfen', 'Pruefnachweis sichern', 'Etikett wegwerfen']} aufgaben={[{ frage: 'Was verbindet Material mit Produkt?', korrekt: 'Charge zuordnen' }, { frage: 'Was verbindet Produkt mit Fertigung?', korrekt: 'Auftrag verknuepfen' }, { frage: 'Was braucht spaetere Klaerung?', korrekt: 'Pruefnachweis sichern' }]} fehlerName="RueckverfolgbarkeitChargeTrainer" standardBegruendung="Rueckverfolgbarkeit braucht eindeutige Zuordnung und Dokumentation." naechsterButton="Naechste Trace-Frage" className={className} />;
}

export function PruefprotokollSchreibenTrainer({ titel = 'Pruefprotokoll schreiben', className }: PruefprotokollSchreibenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Merkmal, Soll, Ist und Bewertung." badgeText="Protokoll" badgeSymbol="PP" optionen={['Merkmal notieren', 'Istwert eintragen', 'Bewertung festhalten', 'Spaeter ausfuellen']} aufgaben={[{ frage: 'Was wurde geprueft?', korrekt: 'Merkmal notieren' }, { frage: 'Was wurde gemessen?', korrekt: 'Istwert eintragen' }, { frage: 'Was macht das Ergebnis verwertbar?', korrekt: 'Bewertung festhalten' }]} fehlerName="PruefprotokollSchreibenTrainer" standardBegruendung="Pruefprotokolle muessen zeitnah und nachvollziehbar sein." naechsterButton="Naechste Protokollfrage" className={className} />;
}

export function SperrungFreigabeTrainer({ titel = 'Sperrung und Freigabe', className }: SperrungFreigabeTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Abweichung, Sperrung, Klaerung und Freigabe." badgeText="Entscheid" badgeSymbol="SF" optionen={['Abweichung melden', 'Teil sperren', 'Freigabe abwarten', 'Trotz Fehler liefern']} aufgaben={[{ frage: 'Was passiert bei auffaelligem Ergebnis?', korrekt: 'Abweichung melden' }, { frage: 'Was verhindert Vermischung?', korrekt: 'Teil sperren' }, { frage: 'Was kommt vor Weitergabe?', korrekt: 'Freigabe abwarten' }]} fehlerName="SperrungFreigabeTrainer" standardBegruendung="Sperrung und Freigabe sind dokumentierte QS-Entscheidungen." naechsterButton="Naechste Entscheidungsfrage" className={className} />;
}

export function GratMetallTrainer({ titel = 'Grat an Metallteilen', className }: GratMetallTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Gratbild, Schnittspalt und sichere Nacharbeit." badgeText="Grat" badgeSymbol="GM" optionen={['Kante pruefen', 'Schnittspalt klaeren', 'Nacharbeit freigeben lassen', 'Grat abbrechen und liefern']} aufgaben={[{ frage: 'Wo erkennst du Grat zuerst?', korrekt: 'Kante pruefen' }, { frage: 'Welche Ursache kann beim Schneiden beteiligt sein?', korrekt: 'Schnittspalt klaeren' }, { frage: 'Was braucht Entgraten nach Vorgabe?', korrekt: 'Nacharbeit freigeben lassen' }]} fehlerName="GratMetallTrainer" standardBegruendung="Grat wird erkannt, bewertet und nach Vorgabe behandelt." naechsterButton="Naechste Gratfrage" className={className} />;
}

export function MassabweichungMetallTrainer({ titel = 'Massabweichung Metall', className }: MassabweichungMetallTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Messwert, Messmittel und Ursachenfelder." badgeText="Mass" badgeSymbol="MM" optionen={['Sollwert vergleichen', 'Messmittel pruefen', 'Werkzeugzustand melden', 'Messwert passend runden']} aufgaben={[{ frage: 'Was vergleichst du mit dem Istwert?', korrekt: 'Sollwert vergleichen' }, { frage: 'Was kann eine falsche Messung verursachen?', korrekt: 'Messmittel pruefen' }, { frage: 'Was kann reale Massdrift verursachen?', korrekt: 'Werkzeugzustand melden' }]} fehlerName="MassabweichungMetallTrainer" standardBegruendung="Massabweichung braucht Messsicherheit und Ursachenpruefung." naechsterButton="Naechste Massfrage" className={className} />;
}

export function RattermarkenTrainer({ titel = 'Rattermarken', className }: RattermarkenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Oberflaechenspur, Schwingung und Prozessmeldung." badgeText="Rattern" badgeSymbol="RM" optionen={['Regelmaessige Spuren erkennen', 'Spannung pruefen lassen', 'Schnittwerte mit Quelle klaeren', 'Spuren polieren und schweigen']} aufgaben={[{ frage: 'Was ist typisch sichtbar?', korrekt: 'Regelmaessige Spuren erkennen' }, { frage: 'Was kann Schwingung beguenstigen?', korrekt: 'Spannung pruefen lassen' }, { frage: 'Was wird nicht frei geraten?', korrekt: 'Schnittwerte mit Quelle klaeren' }]} fehlerName="RattermarkenTrainer" standardBegruendung="Rattermarken deuten auf Schwingung oder instabile Bearbeitung hin." naechsterButton="Naechste Ratterfrage" className={className} />;
}

export function SchlechterRundlaufTrainer({ titel = 'Schlechter Rundlauf', className }: SchlechterRundlaufTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Messuhrpruefung, Ausschlag und Rundlaufursache." badgeText="Rundlauf" badgeSymbol="RL" optionen={['Messuhr ansetzen', 'Ausschlag beobachten', 'Spannung oder Unwucht klaeren', 'Drehteil festhalten']} aufgaben={[{ frage: 'Womit pruefst du Rundlauf typisch?', korrekt: 'Messuhr ansetzen' }, { frage: 'Was zeigt die Abweichung?', korrekt: 'Ausschlag beobachten' }, { frage: 'Was kann Ursache sein?', korrekt: 'Spannung oder Unwucht klaeren' }]} fehlerName="SchlechterRundlaufTrainer" standardBegruendung="Rundlaufpruefung erfolgt kontrolliert, nicht durch Festhalten." naechsterButton="Naechste Rundlauffrage" className={className} />;
}

export function WerkzeugbruchTrainer({ titel = 'Werkzeugbruch', className }: WerkzeugbruchTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Sofortmassnahmen bei Werkzeugbruch." badgeText="Bruch" badgeSymbol="WB" optionen={['Maschine sicher stoppen', 'Teile sperren', 'Werkzeugbruch melden', 'Mit Restwerkzeug weiterfahren']} aufgaben={[{ frage: 'Was kommt zuerst?', korrekt: 'Maschine sicher stoppen' }, { frage: 'Was passiert mit betroffenen Teilen?', korrekt: 'Teile sperren' }, { frage: 'Was braucht die Instandsetzung?', korrekt: 'Werkzeugbruch melden' }]} fehlerName="WerkzeugbruchTrainer" standardBegruendung="Werkzeugbruch ist ein Sofortstopp- und Meldefall." naechsterButton="Naechste Bruchfrage" className={className} />;
}

export function WerkzeugverschleissMetallTrainer({ titel = 'Werkzeugverschleiss', className }: WerkzeugverschleissMetallTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Schneide, Freiflaeche und Prozessfolge." badgeText="Verschleiss" badgeSymbol="WV" optionen={['Schneide ansehen', 'Freiflaeche vergleichen', 'Massdrift beobachten', 'Verschleiss ignorieren']} aufgaben={[{ frage: 'Wo kann Verschleiss sichtbar sein?', korrekt: 'Schneide ansehen' }, { frage: 'Welche Flaeche wird haeufig verglichen?', korrekt: 'Freiflaeche vergleichen' }, { frage: 'Was kann im Prozess folgen?', korrekt: 'Massdrift beobachten' }]} fehlerName="WerkzeugverschleissMetallTrainer" standardBegruendung="Werkzeugverschleiss beeinflusst Oberflaeche, Mass und Prozesssicherheit." naechsterButton="Naechste Verschleissfrage" className={className} />;
}

export function VerformungRissTrainer({ titel = 'Verformung und Riss', className }: VerformungRissTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Formabweichung, Rissbild und Sperrweg." badgeText="Riss" badgeSymbol="VR" optionen={['Formabweichung erkennen', 'Rissstelle markieren', 'Teil sperren und melden', 'Riss ueberlackieren']} aufgaben={[{ frage: 'Was zeigt eine Verformung?', korrekt: 'Formabweichung erkennen' }, { frage: 'Was muss bei Rissverdacht passieren?', korrekt: 'Rissstelle markieren' }, { frage: 'Was verhindert Weitergabe?', korrekt: 'Teil sperren und melden' }]} fehlerName="VerformungRissTrainer" standardBegruendung="Risse und Verformungen brauchen sichere Bewertung." naechsterButton="Naechste Rissfrage" className={className} />;
}

export function SchlechteOberflaecheTrainer({ titel = 'Schlechte Oberflaeche', className }: SchlechteOberflaecheTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Rauheit, Kratzer und Vorgabenbezug." badgeText="Oberflaeche" badgeSymbol="OF" optionen={['Rauheit vergleichen', 'Kratzer bewerten', 'Zeichnung oder Muster nutzen', 'Oberflaeche einoelen']} aufgaben={[{ frage: 'Was beschreibt die Oberflaechenstruktur?', korrekt: 'Rauheit vergleichen' }, { frage: 'Was ist eine sichtbare Beschaedigung?', korrekt: 'Kratzer bewerten' }, { frage: 'Woher kommt die Bewertung?', korrekt: 'Zeichnung oder Muster nutzen' }]} fehlerName="SchlechteOberflaecheTrainer" standardBegruendung="Oberflaechen werden nach Vorgabe bewertet." naechsterButton="Naechste Oberflaechenfrage" className={className} />;
}

export function HaertefehlerTrainer({ titel = 'Haertefehler', className }: HaertefehlerTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Haertevorgabe, Waermeeinfluss und Pruefbedarf." badgeText="Haerte" badgeSymbol="HF" optionen={['Haertevorgabe lesen', 'Waermeeinfluss beachten', 'Pruefung anfordern', 'Mit Hammer testen']} aufgaben={[{ frage: 'Was brauchst du zur Bewertung?', korrekt: 'Haertevorgabe lesen' }, { frage: 'Was kann Haerte beeinflussen?', korrekt: 'Waermeeinfluss beachten' }, { frage: 'Was ist bei Verdacht noetig?', korrekt: 'Pruefung anfordern' }]} fehlerName="HaertefehlerTrainer" standardBegruendung="Haertefehler werden nicht improvisiert geprueft." naechsterButton="Naechste Haertefrage" className={className} />;
}

export function KorrosionBauteilTrainer({ titel = 'Korrosion am Bauteil', className }: KorrosionBauteilTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Medium, Oberflaechenfund und Schutzmassnahme." badgeText="Korrosion" badgeSymbol="KB" optionen={['Korrosionsstelle erkennen', 'Medium oder Lagerung pruefen', 'Bauteil sperren', 'Rost abwischen und freigeben']} aufgaben={[{ frage: 'Was erkennst du an der Oberflaeche?', korrekt: 'Korrosionsstelle erkennen' }, { frage: 'Was kann Ursache sein?', korrekt: 'Medium oder Lagerung pruefen' }, { frage: 'Was passiert bei unklarer Korrosion?', korrekt: 'Bauteil sperren' }]} fehlerName="KorrosionBauteilTrainer" standardBegruendung="Korrosion braucht Ursachenpruefung und Freigabeweg." naechsterButton="Naechste Korrosionsfrage" className={className} />;
}

export function EinfallstellenTrainer({ titel = 'Einfallstellen', className }: EinfallstellenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Delle, Wanddicke, Schwindung und Nachdruck." badgeText="Einfall" badgeSymbol="EF" optionen={['Eingesunkene Stelle erkennen', 'Wanddicke pruefen', 'Nachdruck mit Quelle klaeren', 'Delle warm glattdruecken']} aufgaben={[{ frage: 'Was ist typisch sichtbar?', korrekt: 'Eingesunkene Stelle erkennen' }, { frage: 'Wo entstehen Einfallstellen haeufig?', korrekt: 'Wanddicke pruefen' }, { frage: 'Welche Prozessphase kann Einfluss haben?', korrekt: 'Nachdruck mit Quelle klaeren' }]} fehlerName="EinfallstellenTrainer" standardBegruendung="Einfallstellen brauchen Ursachenpruefung, nicht kosmetische Nacharbeit." naechsterButton="Naechste Einfallfrage" className={className} />;
}

export function LunkerTrainer({ titel = 'Lunker', className }: LunkerTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne inneren Hohlraum, Schwindung und sichere Pruefung." badgeText="Lunker" badgeSymbol="LU" optionen={['Schnittbild pruefen', 'Schwindung beachten', 'Teil sperren und klaeren', 'Aussen glattpolieren']} aufgaben={[{ frage: 'Woran wird ein innerer Hohlraum sicherer erkannt?', korrekt: 'Schnittbild pruefen' }, { frage: 'Welche Ursache ist typisch beteiligt?', korrekt: 'Schwindung beachten' }, { frage: 'Was passiert bei Verdacht?', korrekt: 'Teil sperren und klaeren' }]} fehlerName="LunkerTrainer" standardBegruendung="Lunker koennen innen liegen und brauchen einen klaren Pruefweg." naechsterButton="Naechste Lunkerfrage" className={className} />;
}

export function GratUeberspritzungTrainer({ titel = 'Grat und Ueberspritzung', className }: GratUeberspritzungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Trennebene, Werkzeugspalt und Schliesskraftbezug." badgeText="Grat" badgeSymbol="GU" optionen={['Trennebene ansehen', 'Werkzeugspalt klaeren', 'Schliesskraft mit Quelle pruefen', 'Grat abreissen und liefern']} aufgaben={[{ frage: 'Wo findest du Grat haeufig?', korrekt: 'Trennebene ansehen' }, { frage: 'Was kann am Werkzeug beteiligt sein?', korrekt: 'Werkzeugspalt klaeren' }, { frage: 'Was darf nicht frei geraten werden?', korrekt: 'Schliesskraft mit Quelle pruefen' }]} fehlerName="GratUeberspritzungTrainer" standardBegruendung="Ueberspritzung wird bewertet, dokumentiert und nach Vorgabe behandelt." naechsterButton="Naechste Ueberspritzungsfrage" className={className} />;
}

export function UnterfuellungTrainer({ titel = 'Unterfuellung', className }: UnterfuellungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne kurzes Teil, Fliessweg und Fuellursache." badgeText="Kurzteil" badgeSymbol="UF" optionen={['Fliessende erkennen', 'Anschnitt und Fliessweg pruefen', 'Fuellproblem melden', 'Fehlstelle abschneiden']} aufgaben={[{ frage: 'Was zeigt eine Unterfuellung am Teil?', korrekt: 'Fliessende erkennen' }, { frage: 'Welche Geometrie hilft bei der Ursache?', korrekt: 'Anschnitt und Fliessweg pruefen' }, { frage: 'Was passiert mit wiederholten Kurzschuessen?', korrekt: 'Fuellproblem melden' }]} fehlerName="UnterfuellungTrainer" standardBegruendung="Unterfuellung ist ein Prozess- und Freigabethema." naechsterButton="Naechste Fuellfrage" className={className} />;
}

export function FliessnaehteBindenaehteTrainer({ titel = 'Fliessnaehte und Bindenaehte', className }: FliessnaehteBindenaehteTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne zusammentreffende Fliessfronten, Nahtlage und Bewertung." badgeText="Naht" badgeSymbol="FB" optionen={['Fliessfronten erkennen', 'Nahtlage bewerten', 'Festigkeitsrisiko klaeren', 'Naht mit Farbe verdecken']} aufgaben={[{ frage: 'Wie entsteht eine Naht haeufig?', korrekt: 'Fliessfronten erkennen' }, { frage: 'Was entscheidet ueber Sicht- oder Funktionsrelevanz?', korrekt: 'Nahtlage bewerten' }, { frage: 'Was ist bei belasteter Stelle wichtig?', korrekt: 'Festigkeitsrisiko klaeren' }]} fehlerName="FliessnaehteBindenaehteTrainer" standardBegruendung="Nahtstellen werden nach Lage, Belastung und Vorgabe bewertet." naechsterButton="Naechste Nahtfrage" className={className} />;
}

export function SchlierenFeuchtigkeitTrainer({ titel = 'Schlieren und Feuchtigkeitsschlieren', className }: SchlierenFeuchtigkeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Oberflaechenspur, Feuchteverdacht und Trocknung." badgeText="Schlieren" badgeSymbol="SF" optionen={['Streifenbild erkennen', 'Feuchteverdacht pruefen', 'Trocknung nach Datenblatt klaeren', 'Mit mehr Farbe ueberdecken']} aufgaben={[{ frage: 'Was ist bei Schlieren sichtbar?', korrekt: 'Streifenbild erkennen' }, { frage: 'Welche Materialursache kann beteiligt sein?', korrekt: 'Feuchteverdacht pruefen' }, { frage: 'Woher kommt die Trocknungsvorgabe?', korrekt: 'Trocknung nach Datenblatt klaeren' }]} fehlerName="SchlierenFeuchtigkeitTrainer" standardBegruendung="Schlieren sind ein Hinweis auf Material, Prozess oder Feuchte." naechsterButton="Naechste Schlierenfrage" className={className} />;
}

export function VerbrennungDieseleffektTrainer({ titel = 'Verbrennungen und Dieseleffekt', className }: VerbrennungDieseleffektTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Brandstelle, eingeschlossene Luft und Entlueftung." badgeText="Brand" badgeSymbol="VD" optionen={['Dunkle Stelle erkennen', 'Entlueftung pruefen lassen', 'Fliessende beachten', 'Brandstelle wegschleifen']} aufgaben={[{ frage: 'Was ist typisch sichtbar?', korrekt: 'Dunkle Stelle erkennen' }, { frage: 'Was kann beim Dieseleffekt beteiligt sein?', korrekt: 'Entlueftung pruefen lassen' }, { frage: 'Wo tritt eingeschlossene Luft oft auf?', korrekt: 'Fliessende beachten' }]} fehlerName="VerbrennungDieseleffektTrainer" standardBegruendung="Brandstellen weisen auf Prozess- oder Entlueftungsprobleme hin." naechsterButton="Naechste Brandfrage" className={className} />;
}

export function VerzugKunststoffTrainer({ titel = 'Verzug Kunststoff', className }: VerzugKunststoffTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Formabweichung, Kuehlung, Schwindung und Orientierung." badgeText="Verzug" badgeSymbol="VK" optionen={['Formabweichung messen', 'Kuehlung vergleichen', 'Schwindung beachten', 'Teil geradebiegen']} aufgaben={[{ frage: 'Was zeigt Verzug?', korrekt: 'Formabweichung messen' }, { frage: 'Was kann ungleichmaessigen Verzug beguenstigen?', korrekt: 'Kuehlung vergleichen' }, { frage: 'Welche Materialreaktion spielt mit?', korrekt: 'Schwindung beachten' }]} fehlerName="VerzugKunststoffTrainer" standardBegruendung="Verzug wird ueber Form, Prozess und Material eingegrenzt." naechsterButton="Naechste Verzugsfrage" className={className} />;
}

export function DelaminationTrainer({ titel = 'Delamination', className }: DelaminationTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Schichttrennung, Materialmix und Sperrung." badgeText="Schicht" badgeSymbol="DL" optionen={['Schichtabloesung erkennen', 'Materialmix klaeren', 'Teil sperren', 'Schicht festkleben']} aufgaben={[{ frage: 'Was zeigt Delamination?', korrekt: 'Schichtabloesung erkennen' }, { frage: 'Welche Ursache kann beteiligt sein?', korrekt: 'Materialmix klaeren' }, { frage: 'Was passiert bei unklarer Schichttrennung?', korrekt: 'Teil sperren' }]} fehlerName="DelaminationTrainer" standardBegruendung="Delamination kann Material- oder Prozessursachen haben und braucht Freigabe." naechsterButton="Naechste Delaminationsfrage" className={className} />;
}

export function SchwarzePunkteTrainer({ titel = 'Schwarze Punkte', className }: SchwarzePunkteTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Punktfund, Materialabbau, Fremdstoff und Reinigung." badgeText="Punkte" badgeSymbol="SP" optionen={['Punkte dokumentieren', 'Materialabbau pruefen', 'Reinigung oder Materialweg klaeren', 'Punkte mit Stift markieren']} aufgaben={[{ frage: 'Was machst du mit sichtbaren Punkten zuerst?', korrekt: 'Punkte dokumentieren' }, { frage: 'Welche Prozessursache ist moeglich?', korrekt: 'Materialabbau pruefen' }, { frage: 'Was hilft bei wiederholtem Fund?', korrekt: 'Reinigung oder Materialweg klaeren' }]} fehlerName="SchwarzePunkteTrainer" standardBegruendung="Schwarze Punkte werden systematisch auf Abbau, Fremdstoff oder Reinigung geprueft." naechsterButton="Naechste Punktefrage" className={className} />;
}

export function FarbabweichungTrainer({ titel = 'Farbabweichungen', className }: FarbabweichungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Mustervergleich, Masterbatch und Chargenbezug." badgeText="Farbe" badgeSymbol="FA" optionen={['Muster vergleichen', 'Masterbatch-Dosierung klaeren', 'Charge rueckverfolgen', 'Farbton nach Gefuehl freigeben']} aufgaben={[{ frage: 'Womit vergleichst du die Farbe?', korrekt: 'Muster vergleichen' }, { frage: 'Welche Dosierung kann Einfluss haben?', korrekt: 'Masterbatch-Dosierung klaeren' }, { frage: 'Was brauchst du fuer spaetere Klaerung?', korrekt: 'Charge rueckverfolgen' }]} fehlerName="FarbabweichungTrainer" standardBegruendung="Farbe wird gegen Vorgabe, Muster und Materialdaten bewertet." naechsterButton="Naechste Farbfrage" className={className} />;
}

export function AngussAuswerfermarkenTrainer({ titel = 'Anguss und Auswerfermarken', className }: AngussAuswerfermarkenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne sichtbaren Anguss, Auswerfermarke und Musterfreigabe." badgeText="Spur" badgeSymbol="AA" optionen={['Angussrest pruefen', 'Auswerfermarke erkennen', 'Musterfreigabe vergleichen', 'Marke wegkratzen']} aufgaben={[{ frage: 'Was bleibt am Angussbereich sichtbar?', korrekt: 'Angussrest pruefen' }, { frage: 'Was kann vom Auswerfer stammen?', korrekt: 'Auswerfermarke erkennen' }, { frage: 'Was entscheidet ueber Zulaessigkeit?', korrekt: 'Musterfreigabe vergleichen' }]} fehlerName="AngussAuswerfermarkenTrainer" standardBegruendung="Werkzeugspuren sind nur nach Vorgabe zulaessig." naechsterButton="Naechste Spurfrage" className={className} />;
}

export function MassabweichungKunststoffTrainer({ titel = 'Massabweichungen Kunststoff', className }: MassabweichungKunststoffTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Soll-Ist-Vergleich, Schwindung und Messzeitpunkt." badgeText="Mass" badgeSymbol="MK" optionen={['Soll und Ist vergleichen', 'Messzeitpunkt beachten', 'Schwindung und Prozess klaeren', 'Mass passend druecken']} aufgaben={[{ frage: 'Was steht vor jeder Bewertung?', korrekt: 'Soll und Ist vergleichen' }, { frage: 'Was ist bei Kunststoffteilen besonders wichtig?', korrekt: 'Messzeitpunkt beachten' }, { frage: 'Welche Prozessreaktion kann die Masse veraendern?', korrekt: 'Schwindung und Prozess klaeren' }]} fehlerName="MassabweichungKunststoffTrainer" standardBegruendung="Kunststoffmasse werden mit Zeit, Schwindung und Prozessbezug bewertet." naechsterButton="Naechste Kunststoffmassfrage" className={className} />;
}

export function Fehlerdiagnose5MTrainer({ titel = 'Fehlerdiagnose mit 5M', className }: Fehlerdiagnose5MTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Ursachenfelder, Pruefung und Massnahme." badgeText="5M" badgeSymbol="5M" optionen={['Material pruefen', 'Maschine und Methode klaeren', 'Massnahme dokumentieren', 'Erste Idee sofort umstellen']} aufgaben={[{ frage: 'Welches Feld umfasst Charge, Feuchte und Masterbatch?', korrekt: 'Material pruefen' }, { frage: 'Welche Felder umfassen Anlage und Parameter?', korrekt: 'Maschine und Methode klaeren' }, { frage: 'Was macht die Reaktion nachvollziehbar?', korrekt: 'Massnahme dokumentieren' }]} fehlerName="Fehlerdiagnose5MTrainer" standardBegruendung="5M ordnet Ursachen, bevor Prozesswerte geaendert werden." naechsterButton="Naechste 5M-Frage" className={className} />;
}

export function SensorAktorSteuerungTrainer({ titel = 'Sensor Aktor Steuerung', className }: SensorAktorSteuerungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Erkennen, Verarbeiten und Handeln im Signalweg." badgeText="Signal" badgeSymbol="SA" optionen={['Sensor erkennt Zustand', 'Steuerung verarbeitet Signal', 'Aktor fuehrt Aktion aus', 'Kabel blind tauschen']} aufgaben={[{ frage: 'Wer erkennt eine Position oder einen Zustand?', korrekt: 'Sensor erkennt Zustand' }, { frage: 'Wer entscheidet nach Programm oder Logik?', korrekt: 'Steuerung verarbeitet Signal' }, { frage: 'Wer bewegt, schaltet oder stellt?', korrekt: 'Aktor fuehrt Aktion aus' }]} fehlerName="SensorAktorSteuerungTrainer" standardBegruendung="Sensor, Steuerung und Aktor bilden den Grundsignalweg." naechsterButton="Naechste Signalfrage" className={className} />;
}

export function SteuerungRegelungTrainer({ titel = 'Steuerung und Regelung', className }: SteuerungRegelungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Ablauf, Rueckmeldung und Korrektur." badgeText="Regeln" badgeSymbol="SR" optionen={['Ablauf ohne Rueckvergleich erkennen', 'Istwert rueckmelden', 'Soll-Ist-Vergleich nutzen', 'Rueckmeldung abklemmen']} aufgaben={[{ frage: 'Was passt eher zur einfachen Steuerung?', korrekt: 'Ablauf ohne Rueckvergleich erkennen' }, { frage: 'Was braucht eine Regelung?', korrekt: 'Istwert rueckmelden' }, { frage: 'Was macht die Regelung zur Korrektur?', korrekt: 'Soll-Ist-Vergleich nutzen' }]} fehlerName="SteuerungRegelungTrainer" standardBegruendung="Regelungen nutzen Rueckmeldung und Vergleich, Steuerungen fuehren Logik aus." naechsterButton="Naechste Regelungsfrage" className={className} />;
}

export function SollIstStellgroesseTrainer({ titel = 'Sollwert Istwert Stellgroesse', className }: SollIstStellgroesseTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Vorgabe, Messwert und Eingriff im Regelkreis." badgeText="Regelkreis" badgeSymbol="SIS" optionen={['Sollwert als Ziel lesen', 'Istwert als Messwert erkennen', 'Stellgroesse als Eingriff nutzen', 'Istwert schoenrechnen']} aufgaben={[{ frage: 'Was ist die Vorgabe?', korrekt: 'Sollwert als Ziel lesen' }, { frage: 'Was wird gemessen oder erfasst?', korrekt: 'Istwert als Messwert erkennen' }, { frage: 'Womit greift der Regler ein?', korrekt: 'Stellgroesse als Eingriff nutzen' }]} fehlerName="SollIstStellgroesseTrainer" standardBegruendung="Sollwert, Istwert und Stellgroesse muessen sauber getrennt werden." naechsterButton="Naechste Regelkreisfrage" className={className} />;
}

export function SpsGrundlagenTrainer({ titel = 'SPS-Grundlagen', className }: SpsGrundlagenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Eingang lesen, Programm verarbeiten und Ausgang setzen." badgeText="SPS" badgeSymbol="SPS" optionen={['Eingaenge zyklisch lesen', 'Programm auswerten', 'Ausgaenge setzen', 'Programm spontan aendern']} aufgaben={[{ frage: 'Was macht eine SPS mit Sensorsignalen?', korrekt: 'Eingaenge zyklisch lesen' }, { frage: 'Was bestimmt die Logik?', korrekt: 'Programm auswerten' }, { frage: 'Was steuert Aktoren an?', korrekt: 'Ausgaenge setzen' }]} fehlerName="SpsGrundlagenTrainer" standardBegruendung="SPS-Aenderungen brauchen Befugnis und Freigabe." naechsterButton="Naechste SPS-Frage" className={className} />;
}

export function EingangAusgangTrainer({ titel = 'Eingang und Ausgang', className }: EingangAusgangTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Signalrichtung zwischen Sensor, SPS und Aktor." badgeText="I/O" badgeSymbol="IO" optionen={['Sensor an Eingang denken', 'Aktor an Ausgang denken', 'Signalrichtung pruefen', 'Ein- und Ausgang vertauschen']} aufgaben={[{ frage: 'Wohin gehoert ein Sensorsignal?', korrekt: 'Sensor an Eingang denken' }, { frage: 'Wohin gehoert ein Schaltbefehl fuer Aktoren?', korrekt: 'Aktor an Ausgang denken' }, { frage: 'Was verhindert falsche Diagnose?', korrekt: 'Signalrichtung pruefen' }]} fehlerName="EingangAusgangTrainer" standardBegruendung="Eingaenge fuehren Signale hinein, Ausgaenge schalten heraus." naechsterButton="Naechste I/O-Frage" className={className} />;
}

export function UndOderVerriegelungTrainer({ titel = 'UND ODER Verriegelung', className }: UndOderVerriegelungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Logikbedingungen und sichere Sperren." badgeText="Logik" badgeSymbol="UV" optionen={['UND braucht alle Bedingungen', 'ODER braucht eine Bedingung', 'Verriegelung schuetzt Ablauf', 'Verriegelung ueberbruecken']} aufgaben={[{ frage: 'Was gilt bei UND?', korrekt: 'UND braucht alle Bedingungen' }, { frage: 'Was gilt bei ODER?', korrekt: 'ODER braucht eine Bedingung' }, { frage: 'Was verhindert falsche oder gefaehrliche Aktion?', korrekt: 'Verriegelung schuetzt Ablauf' }]} fehlerName="UndOderVerriegelungTrainer" standardBegruendung="Verriegelungen sind Teil der sicheren Steuerlogik." naechsterButton="Naechste Logikfrage" className={className} />;
}

export function EndschalterLichtschrankeTrainer({ titel = 'Endschalter und Lichtschranke', className }: EndschalterLichtschrankeTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne mechanische Endlage und beruehrungslose Lichtabfrage." badgeText="Sensor" badgeSymbol="EL" optionen={['Endlage mechanisch erkennen', 'Lichtweg ueberwachen', 'Signalstatus pruefen', 'Sensor mit Werkzeug blockieren']} aufgaben={[{ frage: 'Was passt zum Endschalter?', korrekt: 'Endlage mechanisch erkennen' }, { frage: 'Was passt zur Lichtschranke?', korrekt: 'Lichtweg ueberwachen' }, { frage: 'Was pruefst du bei Stoerung?', korrekt: 'Signalstatus pruefen' }]} fehlerName="EndschalterLichtschrankeTrainer" standardBegruendung="Sensoren werden anhand Funktion, Signal und Einbau beurteilt." naechsterButton="Naechste Sensorfrage" className={className} />;
}

export function InduktivKapazitivSensorTrainer({ titel = 'Induktive und kapazitive Sensoren', className }: InduktivKapazitivSensorTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Sensorprinzip, Material und Einbau." badgeText="Material" badgeSymbol="IK" optionen={['Induktiv fuer Metall merken', 'Kapazitiv fuer verschiedene Materialien pruefen', 'Schaltabstand aus Quelle nutzen', 'Sensorflaeche lackieren']} aufgaben={[{ frage: 'Was erkennt ein induktiver Sensor typisch?', korrekt: 'Induktiv fuer Metall merken' }, { frage: 'Was kann ein kapazitiver Sensor je nach Anwendung erkennen?', korrekt: 'Kapazitiv fuer verschiedene Materialien pruefen' }, { frage: 'Was ist beim Einbau quellenpflichtig?', korrekt: 'Schaltabstand aus Quelle nutzen' }]} fehlerName="InduktivKapazitivSensorTrainer" standardBegruendung="Sensorprinzip, Material und Einbau gehoeren zusammen." naechsterButton="Naechste Materialsensorfrage" className={className} />;
}

export function TemperaturDrucksensorenTrainer({ titel = 'Temperatur- und Drucksensoren', className }: TemperaturDrucksensorenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Messstelle, Prozesswert und Reaktion." badgeText="Prozess" badgeSymbol="TD" optionen={['Messstelle beachten', 'Einheit und Grenzwert lesen', 'Auffaelligen Wert melden', 'Grenzwert frei verschieben']} aufgaben={[{ frage: 'Was braucht jeder Sensorwert?', korrekt: 'Messstelle beachten' }, { frage: 'Was macht den Wert bewertbar?', korrekt: 'Einheit und Grenzwert lesen' }, { frage: 'Was tust du bei auffaelligem Prozesswert?', korrekt: 'Auffaelligen Wert melden' }]} fehlerName="TemperaturDrucksensorenTrainer" standardBegruendung="Temperatur und Druck werden gegen Quelle und Vorgabe bewertet." naechsterButton="Naechste Prozesswertfrage" className={className} />;
}

export function ElektromotorFrequenzumrichterTrainer({ titel = 'Elektromotor und Frequenzumrichter', className }: ElektromotorFrequenzumrichterTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Antrieb, Drehzahlstellung und Freigabe." badgeText="Antrieb" badgeSymbol="FU" optionen={['Motor treibt Last an', 'FU beeinflusst Drehzahl', 'Parameterfreigabe beachten', 'Drehzahl beliebig hochdrehen']} aufgaben={[{ frage: 'Was wandelt Strom in Bewegung?', korrekt: 'Motor treibt Last an' }, { frage: 'Was kann die Drehzahl steuern?', korrekt: 'FU beeinflusst Drehzahl' }, { frage: 'Was brauchst du vor Parameterwechsel?', korrekt: 'Parameterfreigabe beachten' }]} fehlerName="ElektromotorFrequenzumrichterTrainer" standardBegruendung="Antriebsparameter beeinflussen Sicherheit, Qualitaet und Maschine." naechsterButton="Naechste Antriebsfrage" className={className} />;
}

export function DruckluftanlageTrainer({ titel = 'Druckluftanlage', className }: DruckluftanlageTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Erzeugung, Aufbereitung und Verbraucher im Luftweg." badgeText="Pneumatik" badgeSymbol="DL" optionen={['Kompressor erzeugt Druckluft', 'Wartungseinheit bereitet Luft vor', 'Verbraucher nutzt Druckluft', 'Leck mit Klebeband abdichten']} aufgaben={[{ frage: 'Wo beginnt der Druckluftweg?', korrekt: 'Kompressor erzeugt Druckluft' }, { frage: 'Was kommt vor vielen Verbrauchern?', korrekt: 'Wartungseinheit bereitet Luft vor' }, { frage: 'Wo wird Druckluft in Arbeit umgesetzt?', korrekt: 'Verbraucher nutzt Druckluft' }]} fehlerName="DruckluftanlageTrainer" standardBegruendung="Druckluft wird erzeugt, vorbereitet, verteilt und sicher genutzt." naechsterButton="Naechste Druckluftfrage" className={className} />;
}

export function WartungseinheitTrainer({ titel = 'Wartungseinheit', className }: WartungseinheitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Filter, Regler und Kondensatkontrolle." badgeText="Luftpflege" badgeSymbol="WE" optionen={['Filterzustand pruefen', 'Druck nach Vorgabe lesen', 'Kondensat nach Vorgabe ablassen', 'Regler beliebig hochdrehen']} aufgaben={[{ frage: 'Was haelt Schmutz und Wasser zurueck?', korrekt: 'Filterzustand pruefen' }, { frage: 'Was muss mit Anlagenvorgabe verglichen werden?', korrekt: 'Druck nach Vorgabe lesen' }, { frage: 'Was darf sich nicht unkontrolliert sammeln?', korrekt: 'Kondensat nach Vorgabe ablassen' }]} fehlerName="WartungseinheitTrainer" standardBegruendung="Die Wartungseinheit schuetzt Verbraucher und Prozess vor falscher Luftqualitaet." naechsterButton="Naechste Wartungsfrage" className={className} />;
}

export function VentileDrosselnTrainer({ titel = 'Ventile und Drosseln', className }: VentileDrosselnTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Umschalten, Sperren und Geschwindigkeitseinstellung." badgeText="Luftweg" badgeSymbol="VD" optionen={['Wegeventil schaltet Luftweg', 'Drossel begrenzt Volumenstrom', 'Schaltstellung lesen', 'Drossel ganz zudrehen']} aufgaben={[{ frage: 'Was bestimmt, welcher Anschluss belueftet wird?', korrekt: 'Wegeventil schaltet Luftweg' }, { frage: 'Womit wird Bewegungsgeschwindigkeit beeinflusst?', korrekt: 'Drossel begrenzt Volumenstrom' }, { frage: 'Was zeigt der Pneumatikplan am Ventil?', korrekt: 'Schaltstellung lesen' }]} fehlerName="VentileDrosselnTrainer" standardBegruendung="Ventile schalten Richtung und Drosseln beeinflussen den Volumenstrom." naechsterButton="Naechste Ventilfrage" className={className} />;
}

export function EinfachwirkenderZylinderTrainer({ titel = 'Einfachwirkender Zylinder', className }: EinfachwirkenderZylinderTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Druckhub, Rueckstellung und sichere Endlage." badgeText="Zylinder" badgeSymbol="EZ" optionen={['Druckluft bewegt eine Richtung', 'Feder stellt zurueck', 'Endlage pruefen', 'Feder ausbauen']} aufgaben={[{ frage: 'Wie entsteht die Arbeitsbewegung?', korrekt: 'Druckluft bewegt eine Richtung' }, { frage: 'Was bringt den Zylinder oft zurueck?', korrekt: 'Feder stellt zurueck' }, { frage: 'Was pruefst du bei Stoerung am Hubende?', korrekt: 'Endlage pruefen' }]} fehlerName="EinfachwirkenderZylinderTrainer" standardBegruendung="Einfachwirkende Zylinder brauchen Luft fuer eine Richtung und eine Rueckstellkraft." naechsterButton="Naechste Zylinderfrage" className={className} />;
}

export function DoppeltwirkenderZylinderTrainer({ titel = 'Doppeltwirkender Zylinder', className }: DoppeltwirkenderZylinderTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne beide Luftseiten und aktive Bewegungen." badgeText="Zylinder" badgeSymbol="DZ" optionen={['Ausfahren aktiv belueften', 'Einfahren aktiv belueften', 'Abluftweg beachten', 'Schlaeuche vertauschen']} aufgaben={[{ frage: 'Was passiert fuer die Plusbewegung?', korrekt: 'Ausfahren aktiv belueften' }, { frage: 'Was passiert fuer die Minusbewegung?', korrekt: 'Einfahren aktiv belueften' }, { frage: 'Was muss die jeweils andere Seite koennen?', korrekt: 'Abluftweg beachten' }]} fehlerName="DoppeltwirkenderZylinderTrainer" standardBegruendung="Doppeltwirkende Zylinder nutzen beide Arbeitsraeume fuer kontrollierte Bewegung." naechsterButton="Naechste Doppelzylinderfrage" className={className} />;
}

export function HydraulikGrundlagenTrainer({ titel = 'Hydraulik-Grundlagen', className }: HydraulikGrundlagenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Oel, Druck, Flaeche und Kraft." badgeText="Hydraulik" badgeSymbol="HY" optionen={['Hydraulikoel uebertraegt Druck', 'Kolbenflaeche bestimmt Kraft mit', 'Leckage sofort melden', 'Oelspur ueberwischen']} aufgaben={[{ frage: 'Welches Medium uebertraegt die Kraft?', korrekt: 'Hydraulikoel uebertraegt Druck' }, { frage: 'Welche Groesse gehoert zu F = p mal A?', korrekt: 'Kolbenflaeche bestimmt Kraft mit' }, { frage: 'Was ist bei austretendem Oel richtig?', korrekt: 'Leckage sofort melden' }]} fehlerName="HydraulikGrundlagenTrainer" standardBegruendung="Hydraulik verbindet Druck, Flaeche und sichere Medienkontrolle." naechsterButton="Naechste Hydraulikfrage" className={className} />;
}

export function WartungInspektionInstandsetzungTrainer({ titel = 'Wartung Inspektion Instandsetzung', className }: WartungInspektionInstandsetzungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Erhalten, Feststellen und Wiederherstellen." badgeText="IH" badgeSymbol="WI" optionen={['Wartung erhaelt Sollzustand', 'Inspektion stellt Istzustand fest', 'Instandsetzung stellt Funktion wieder her', 'Begriffe beliebig mischen']} aufgaben={[{ frage: 'Was haelt eine Anlage planmaessig in gutem Zustand?', korrekt: 'Wartung erhaelt Sollzustand' }, { frage: 'Was beschreibt die Zustandsfeststellung?', korrekt: 'Inspektion stellt Istzustand fest' }, { frage: 'Was folgt bei defekter Funktion?', korrekt: 'Instandsetzung stellt Funktion wieder her' }]} fehlerName="WartungInspektionInstandsetzungTrainer" standardBegruendung="Die drei Begriffe beschreiben unterschiedliche Instandhaltungsaufgaben." naechsterButton="Naechste IH-Frage" className={className} />;
}

export function VorbeugendeInstandhaltungTrainer({ titel = 'Vorbeugende Instandhaltung', className }: VorbeugendeInstandhaltungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Plan, Zustand und Risiko vor dem Ausfall." badgeText="Planung" badgeSymbol="VI" optionen={['Intervall nach Plan nutzen', 'Zustandssignal beachten', 'Ausfallrisiko senken', 'Warten bis Stillstand']} aufgaben={[{ frage: 'Was nutzt zeitbasierte Instandhaltung?', korrekt: 'Intervall nach Plan nutzen' }, { frage: 'Was nutzt zustandsorientierte Instandhaltung?', korrekt: 'Zustandssignal beachten' }, { frage: 'Was ist das Ziel der Vorbeugung?', korrekt: 'Ausfallrisiko senken' }]} fehlerName="VorbeugendeInstandhaltungTrainer" standardBegruendung="Vorbeugende Instandhaltung erkennt Handlungsbedarf vor dem ungeplanten Ausfall." naechsterButton="Naechste Vorbeugungsfrage" className={className} />;
}

export function SchmierungSchmierplanTrainer({ titel = 'Schmierung und Schmierplan', className }: SchmierungSchmierplanTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Schmierstelle, Schmierstoff und Nachweis." badgeText="Schmierung" badgeSymbol="SP" optionen={['Schmierstelle finden', 'Schmierstoff aus Plan nehmen', 'Intervall dokumentieren', 'Fett nach Farbe waehlen']} aufgaben={[{ frage: 'Was zeigt, wo geschmiert wird?', korrekt: 'Schmierstelle finden' }, { frage: 'Woher kommt der richtige Stoff?', korrekt: 'Schmierstoff aus Plan nehmen' }, { frage: 'Was macht Wartung nachvollziehbar?', korrekt: 'Intervall dokumentieren' }]} fehlerName="SchmierungSchmierplanTrainer" standardBegruendung="Schmierung folgt Plan, nicht Gefuehl oder Farbe." naechsterButton="Naechste Schmierfrage" className={className} />;
}

export function VerschleissReibungTrainer({ titel = 'Verschleiss und Reibung', className }: VerschleissReibungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Kontakt, Schmierung und Verschleissanzeichen." badgeText="Verschleiss" badgeSymbol="VR" optionen={['Kontakt und Bewegung erkennen', 'Schmierfilm beachten', 'Waerme oder Spiel melden', 'Trockenlauf ignorieren']} aufgaben={[{ frage: 'Wo entsteht Reibung typischerweise?', korrekt: 'Kontakt und Bewegung erkennen' }, { frage: 'Was kann Reibung senken?', korrekt: 'Schmierfilm beachten' }, { frage: 'Was kann auf Verschleiss hinweisen?', korrekt: 'Waerme oder Spiel melden' }]} fehlerName="VerschleissReibungTrainer" standardBegruendung="Verschleiss wird ueber Kontakt, Schmierung und Symptome eingegrenzt." naechsterButton="Naechste Verschleissfrage" className={className} />;
}

export function TemperaturSchwingungGeraeuschTrainer({ titel = 'Temperatur Schwingung Geraeusch', className }: TemperaturSchwingungGeraeuschTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Symptome und sichere Reaktion." badgeText="Symptom" badgeSymbol="TSG" optionen={['Auffaellige Waerme melden', 'Schwingung als Hinweis nutzen', 'Geraeusch veraendert beachten', 'Laute Stelle uebertoenen']} aufgaben={[{ frage: 'Was kann auf Reibung oder Lagerproblem hinweisen?', korrekt: 'Auffaellige Waerme melden' }, { frage: 'Was zeigt ein veraenderter Lauf?', korrekt: 'Schwingung als Hinweis nutzen' }, { frage: 'Was darf bei neuem Laufgeraeusch nicht passieren?', korrekt: 'Geraeusch veraendert beachten' }]} fehlerName="TemperaturSchwingungGeraeuschTrainer" standardBegruendung="Symptome werden beobachtet, verglichen und gemeldet." naechsterButton="Naechste Symptomfrage" className={className} />;
}

export function LeckageErkennenTrainer({ titel = 'Leckage erkennen', className }: LeckageErkennenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Medium, Austrittsstelle und Meldung." badgeText="Leckage" badgeSymbol="LE" optionen={['Austrittsmedium erkennen', 'Leckstelle absichern', 'Leckage melden', 'Spur wegwischen und weiterfahren']} aufgaben={[{ frage: 'Was pruefst du zuerst am Fund?', korrekt: 'Austrittsmedium erkennen' }, { frage: 'Was ist bei Rutsch- oder Umweltgefahr noetig?', korrekt: 'Leckstelle absichern' }, { frage: 'Was macht die Reaktion nachvollziehbar?', korrekt: 'Leckage melden' }]} fehlerName="LeckageErkennenTrainer" standardBegruendung="Leckage betrifft Sicherheit, Umwelt und Anlagenzustand." naechsterButton="Naechste Leckagefrage" className={className} />;
}

export function LagerfehlerTrainer({ titel = 'Lagerfehler', className }: LagerfehlerTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Lagerzeichen und Diagnoseweg." badgeText="Lager" badgeSymbol="LF" optionen={['Geraeusch und Waerme beachten', 'Lagerspiel melden', 'Schmierung pruefen lassen', 'Lager im Lauf nachstellen']} aufgaben={[{ frage: 'Welche Symptome koennen Lagerfehler anzeigen?', korrekt: 'Geraeusch und Waerme beachten' }, { frage: 'Was kann auf Zustand oder Schaden hinweisen?', korrekt: 'Lagerspiel melden' }, { frage: 'Welcher Punkt gehoert zum Diagnoseweg?', korrekt: 'Schmierung pruefen lassen' }]} fehlerName="LagerfehlerTrainer" standardBegruendung="Lagerfehler werden ueber Symptome und freigegebenen Pruefweg eingeordnet." naechsterButton="Naechste Lagerfrage" className={className} />;
}

export function UnwuchtFehlausrichtungTrainer({ titel = 'Unwucht und Fehlausrichtung', className }: UnwuchtFehlausrichtungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne rotierende Masse und Wellenflucht." badgeText="Lauf" badgeSymbol="UF" optionen={['Unwucht bei Rotation denken', 'Ausrichtung an Wellen pruefen', 'Schwingung dokumentieren', 'Kupplung nach Augenmass verschieben']} aufgaben={[{ frage: 'Was passt zu ungleich verteilter Masse?', korrekt: 'Unwucht bei Rotation denken' }, { frage: 'Was passt zu falscher Lage zweier Wellen?', korrekt: 'Ausrichtung an Wellen pruefen' }, { frage: 'Was macht den Fund verwertbar?', korrekt: 'Schwingung dokumentieren' }]} fehlerName="UnwuchtFehlausrichtungTrainer" standardBegruendung="Unwucht und Fehlausrichtung sind verschiedene Ursachen fuer Laufprobleme." naechsterButton="Naechste Laufproblemfrage" className={className} />;
}

export function StoerungFehlerUrsacheWirkungTrainer({ titel = 'Stoerung Fehler Ursache Wirkung', className }: StoerungFehlerUrsacheWirkungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Symptom, Fehlerbild, Ursache und Folge." badgeText="Analyse" badgeSymbol="SUW" optionen={['Stoerung als Abweichung beschreiben', 'Ursache belegen', 'Wirkung auf Prozess nennen', 'Symptom zur Ursache erklaeren']} aufgaben={[{ frage: 'Was wird zuerst beobachtet oder gemeldet?', korrekt: 'Stoerung als Abweichung beschreiben' }, { frage: 'Was darf nicht geraten werden?', korrekt: 'Ursache belegen' }, { frage: 'Was beschreibt die Folge fuer Anlage oder Qualitaet?', korrekt: 'Wirkung auf Prozess nennen' }]} fehlerName="StoerungFehlerUrsacheWirkungTrainer" standardBegruendung="Analyse trennt Beobachtung, Ursache und Wirkung." naechsterButton="Naechste Analysefrage" className={className} />;
}

export function FiveWhyTrainer({ titel = '5-Why', className }: FiveWhyTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Warum-Fragen, Belege und Grundursache." badgeText="Warum" badgeSymbol="5W" optionen={['Problem klar formulieren', 'Warum mit Beleg fragen', 'Grundursache ableiten', 'Schuldigen suchen']} aufgaben={[{ frage: 'Was steht am Anfang einer 5-Why-Kette?', korrekt: 'Problem klar formulieren' }, { frage: 'Was braucht jede Warum-Antwort?', korrekt: 'Warum mit Beleg fragen' }, { frage: 'Was soll am Ende besser verstanden sein?', korrekt: 'Grundursache ableiten' }]} fehlerName="FiveWhyTrainer" standardBegruendung="5-Why sucht eine belegte Ursache, keine Schuldzuweisung." naechsterButton="Naechste Warum-Frage" className={className} />;
}

export function IshikawaDiagrammTrainer({ titel = 'Ishikawa-Diagramm', className }: IshikawaDiagrammTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Problemkopf, Ursachenfelder und Pruefung." badgeText="Ishikawa" badgeSymbol="IK" optionen={['Problemkopf festlegen', '5M-Felder sammeln', 'Ursachen pruefen', 'Erste Idee als Wahrheit nehmen']} aufgaben={[{ frage: 'Wo steht das zu untersuchende Problem?', korrekt: 'Problemkopf festlegen' }, { frage: 'Wie werden moegliche Ursachen geordnet?', korrekt: '5M-Felder sammeln' }, { frage: 'Was folgt nach dem Sammeln?', korrekt: 'Ursachen pruefen' }]} fehlerName="IshikawaDiagrammTrainer" standardBegruendung="Ishikawa strukturiert Ursachen, beweist sie aber nicht automatisch." naechsterButton="Naechste Ishikawa-Frage" className={className} />;
}

export function StoerungDokumentierenTrainer({ titel = 'Stoerung dokumentieren', className }: StoerungDokumentierenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Zeit, Symptom, Massnahme und Freigabe." badgeText="Doku" badgeSymbol="SD" optionen={['Zeit und Anlage nennen', 'Symptom sachlich beschreiben', 'Massnahme und Freigabe notieren', 'Nur schreiben: geht nicht']} aufgaben={[{ frage: 'Was macht die Meldung zuordenbar?', korrekt: 'Zeit und Anlage nennen' }, { frage: 'Wie wird die Beobachtung verwertbar?', korrekt: 'Symptom sachlich beschreiben' }, { frage: 'Was muss nach der Reaktion nachvollziehbar sein?', korrekt: 'Massnahme und Freigabe notieren' }]} fehlerName="StoerungDokumentierenTrainer" standardBegruendung="Stoerungsdokumentation muss spaeter auswertbar sein." naechsterButton="Naechste Dokumentationsfrage" className={className} />;
}

export function SichereFehlersucheTrainer({ titel = 'Sichere Fehlersuche', className }: SichereFehlersucheTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Gefahr, Energie und Befugnis vor dem Eingriff." badgeText="Sicherheit" badgeSymbol="SF" optionen={['Gefahrstelle erkennen', 'Restenergie sichern', 'Befugnis klaeren', 'Schutz fuer Test ueberbruecken']} aufgaben={[{ frage: 'Was kommt vor dem Eingriff?', korrekt: 'Gefahrstelle erkennen' }, { frage: 'Was bleibt nach dem Abschalten moeglich?', korrekt: 'Restenergie sichern' }, { frage: 'Was muss vor Oeffnen oder Einstellen klar sein?', korrekt: 'Befugnis klaeren' }]} fehlerName="SichereFehlersucheTrainer" standardBegruendung="Fehlersuche beginnt mit Sicherheit und Freigabe." naechsterButton="Naechste Sicherheitsfrage" className={className} />;
}

export function VerbesserungNachStoerungTrainer({ titel = 'Verbesserung nach Stoerung', className }: VerbesserungNachStoerungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Ursache, Massnahme, Wirkung und Standard." badgeText="KVP" badgeSymbol="KVP" optionen={['Ursache nachvollziehen', 'Massnahme festlegen', 'Wirksamkeit pruefen', 'Nach Neustart nichts mehr tun']} aufgaben={[{ frage: 'Was muss nach einer Stoerung verstanden werden?', korrekt: 'Ursache nachvollziehen' }, { frage: 'Was wird gegen Wiederholung geplant?', korrekt: 'Massnahme festlegen' }, { frage: 'Was zeigt, ob die Verbesserung hilft?', korrekt: 'Wirksamkeit pruefen' }]} fehlerName="VerbesserungNachStoerungTrainer" standardBegruendung="KVP macht aus Stoerungen lernbare Verbesserungen." naechsterButton="Naechste KVP-Frage" className={className} />;
}

/**
 * Trainiert das Lesen eines Fertigungsauftrags.
 */
export function FertigungsauftragTrainer({ titel = 'Fertigungsauftrag verstehen', className }: FertigungsauftragTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Auftragsdaten, Vorgaben und Rueckfragepunkt." badgeText="Auftrag" badgeSymbol="A" optionen={['Teil und Menge klaeren', 'Termin pruefen', 'Vorgabe abgleichen', 'Nach Bauchgefuehl starten']} aufgaben={[{ frage: 'Was muss vor der Planung eindeutig sein?', korrekt: 'Teil und Menge klaeren' }, { frage: 'Was zeigt den Zeitdruck des Auftrags?', korrekt: 'Termin pruefen' }, { frage: 'Was verhindert Arbeiten mit falschem Stand?', korrekt: 'Vorgabe abgleichen' }]} fehlerName="FertigungsauftragTrainer" standardBegruendung="Ein Fertigungsauftrag wird vor Start auf Teil, Menge, Termin und Vorgabe geprueft." naechsterButton="Naechste Auftragsfrage" className={className} />;
}

/**
 * Trainiert die Planung einer Arbeitsfolge.
 */
export function ArbeitsfolgePlanenTrainer({ titel = 'Arbeitsfolge planen', className }: ArbeitsfolgePlanenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Reihenfolge, Abhaengigkeit und Pruefschritt." badgeText="Folge" badgeSymbol="F" optionen={['Abhaengigkeit beachten', 'Pruefschritt einplanen', 'Betriebsmittel zuordnen', 'Reihenfolge frei mischen']} aufgaben={[{ frage: 'Warum darf die Reihenfolge nicht beliebig sein?', korrekt: 'Abhaengigkeit beachten' }, { frage: 'Was gehoert an die passende Stelle im Ablauf?', korrekt: 'Pruefschritt einplanen' }, { frage: 'Was wird jedem Arbeitsgang passend zugeordnet?', korrekt: 'Betriebsmittel zuordnen' }]} fehlerName="ArbeitsfolgePlanenTrainer" standardBegruendung="Arbeitsfolgen folgen technischer Logik, Vorgabe und Pruefbedarf." naechsterButton="Naechste Folgefrage" className={className} />;
}

/**
 * Trainiert Stueckliste und Materialbedarf.
 */
export function StuecklisteMaterialbedarfTrainer({ titel = 'Stueckliste und Materialbedarf', className }: StuecklisteMaterialbedarfTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Position, Auftragsmenge und Bedarf." badgeText="Material" badgeSymbol="M" optionen={['Position lesen', 'Menge mal Bedarf rechnen', 'Zuschlag nach Vorgabe nutzen', 'Material grob schaetzen']} aufgaben={[{ frage: 'Was verbindet Zeichnung und Stueckliste?', korrekt: 'Position lesen' }, { frage: 'Wie wird der Grundbedarf bestimmt?', korrekt: 'Menge mal Bedarf rechnen' }, { frage: 'Wie darf Reserve oder Ausschuss beruecksichtigt werden?', korrekt: 'Zuschlag nach Vorgabe nutzen' }]} fehlerName="StuecklisteMaterialbedarfTrainer" standardBegruendung="Materialbedarf entsteht aus Stueckliste, Auftragsmenge und freigegebenen Zuschlaegen." naechsterButton="Naechste Materialfrage" className={className} />;
}

/**
 * Trainiert Personal- und Maschinenbedarf.
 */
export function PersonalMaschinenbedarfTrainer({ titel = 'Personal- und Maschinenbedarf', className }: PersonalMaschinenbedarfTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Maschine, Befugnis und Verfuegbarkeit." badgeText="Ressource" badgeSymbol="R" optionen={['Passende Maschine waehlen', 'Befugnis pruefen', 'Verfuegbarkeit klaeren', 'Irgendwen einteilen']} aufgaben={[{ frage: 'Was muss zum Arbeitsgang technisch passen?', korrekt: 'Passende Maschine waehlen' }, { frage: 'Was ist bei Personalplanung sicherheitsrelevant?', korrekt: 'Befugnis pruefen' }, { frage: 'Was entscheidet, ob der Plan praktisch machbar ist?', korrekt: 'Verfuegbarkeit klaeren' }]} fehlerName="PersonalMaschinenbedarfTrainer" standardBegruendung="Ressourcenplanung braucht passende Maschine, befugtes Personal und realistische Verfuegbarkeit." naechsterButton="Naechste Ressourcenfrage" className={className} />;
}

/**
 * Trainiert Maschinenbelegung und Kapazitaet.
 */
export function MaschinenbelegungKapazitaetTrainer({ titel = 'Maschinenbelegung und Kapazitaet', className }: MaschinenbelegungKapazitaetTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Zeitfenster, Belegung und Konflikt." badgeText="Kapazitaet" badgeSymbol="K" optionen={['Freies Zeitfenster pruefen', 'Ruestzeit einrechnen', 'Konflikt melden', 'Auftrag dazwischenquetschen']} aufgaben={[{ frage: 'Was zeigt, ob eine Maschine planbar frei ist?', korrekt: 'Freies Zeitfenster pruefen' }, { frage: 'Welche Zeit darf in der Belegung nicht fehlen?', korrekt: 'Ruestzeit einrechnen' }, { frage: 'Was passiert bei Doppelbelegung?', korrekt: 'Konflikt melden' }]} fehlerName="MaschinenbelegungKapazitaetTrainer" standardBegruendung="Kapazitaet wird mit realer Belegung, Ruestzeit und Konflikten abgeglichen." naechsterButton="Naechste Kapazitaetsfrage" className={className} />;
}

/**
 * Trainiert Taktzeit und Zykluszeit.
 */
export function TaktzeitZykluszeitTrainer({ titel = 'Taktzeit und Zykluszeit', className }: TaktzeitZykluszeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Unterscheide Bedarfstakt und Prozesszyklus." badgeText="Zeit" badgeSymbol="t" optionen={['Takt aus Bedarf ableiten', 'Zyklus am Prozess messen', 'Vergleich bewerten', 'Takt und Zyklus gleichsetzen']} aufgaben={[{ frage: 'Welche Zeit kommt aus Bedarf und verfuegbarer Zeit?', korrekt: 'Takt aus Bedarf ableiten' }, { frage: 'Welche Zeit zeigt der echte Maschinenablauf?', korrekt: 'Zyklus am Prozess messen' }, { frage: 'Was zeigt, ob der Auftrag rechtzeitig laufen kann?', korrekt: 'Vergleich bewerten' }]} fehlerName="TaktzeitZykluszeitTrainer" standardBegruendung="Taktzeit beschreibt Bedarf, Zykluszeit beschreibt Prozessdauer." naechsterButton="Naechste Zeitfrage" className={className} />;
}

/**
 * Trainiert Durchlaufzeit.
 */
export function DurchlaufzeitTrainer({ titel = 'Durchlaufzeit', className }: DurchlaufzeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Wartezeit, Ruesten, Bearbeitung und Pruefung." badgeText="DLZ" badgeSymbol="D" optionen={['Wartezeit mitzaehlen', 'Bearbeitung einordnen', 'Pruefung beruecksichtigen', 'Nur Schnittzeit zaehlen']} aufgaben={[{ frage: 'Was gehoert zur Durchlaufzeit, obwohl nicht produziert wird?', korrekt: 'Wartezeit mitzaehlen' }, { frage: 'Was ist der produktive Anteil im Ablauf?', korrekt: 'Bearbeitung einordnen' }, { frage: 'Was sichert Ergebnis und Freigabe im Ablauf?', korrekt: 'Pruefung beruecksichtigen' }]} fehlerName="DurchlaufzeitTrainer" standardBegruendung="Durchlaufzeit umfasst den ganzen Auftragsweg, nicht nur die reine Bearbeitung." naechsterButton="Naechste Durchlauffrage" className={className} />;
}

/**
 * Trainiert Ruestzeit und Bearbeitungszeit.
 */
export function RuestzeitBearbeitungszeitTrainer({ titel = 'Ruestzeit und Bearbeitungszeit', className }: RuestzeitBearbeitungszeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trenne einmaliges Ruesten und mengenabhaengiges Bearbeiten." badgeText="Gesamt" badgeSymbol="G" optionen={['Ruestzeit einmal planen', 'Bearbeitungszeit je Teil rechnen', 'Menge beruecksichtigen', 'Ruestzeit pro Teil verdoppeln']} aufgaben={[{ frage: 'Welche Zeit faellt fuer das Einrichten an?', korrekt: 'Ruestzeit einmal planen' }, { frage: 'Welche Zeit haengt direkt an der Stueckzahl?', korrekt: 'Bearbeitungszeit je Teil rechnen' }, { frage: 'Was beeinflusst die Gesamtzeit bei Serienmenge stark?', korrekt: 'Menge beruecksichtigen' }]} fehlerName="RuestzeitBearbeitungszeitTrainer" standardBegruendung="Ruestzeit und Bearbeitungszeit werden getrennt geplant und danach zum Zeitbedarf verbunden." naechsterButton="Naechste Gesamtzeitfrage" className={className} />;
}

/**
 * Trainiert Stillstandszeit.
 */
export function StillstandszeitTrainer({ titel = 'Stillstandszeit', className }: StillstandszeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne geplanten Stopp, Stoerung und Dokumentation." badgeText="Stillstand" badgeSymbol="S" optionen={['Geplant oder ungeplant trennen', 'Ursache dokumentieren', 'Dauer erfassen', 'Stillstand verstecken']} aufgaben={[{ frage: 'Was ist fuer die Bewertung zuerst wichtig?', korrekt: 'Geplant oder ungeplant trennen' }, { frage: 'Was macht Stillstand spaeter auswertbar?', korrekt: 'Ursache dokumentieren' }, { frage: 'Was brauchst du fuer OEE oder Rueckmeldung?', korrekt: 'Dauer erfassen' }]} fehlerName="StillstandszeitTrainer" standardBegruendung="Stillstand wird mit Art, Ursache und Dauer dokumentiert." naechsterButton="Naechste Stillstandsfrage" className={className} />;
}

/**
 * Trainiert Liefertermin und Losgroesse.
 */
export function LieferterminLosgroesseTrainer({ titel = 'Liefertermin und Losgroesse', className }: LieferterminLosgroesseTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Termin, Menge, Kapazitaet und Risiko." badgeText="Termin" badgeSymbol="T" optionen={['Losgroesse mit Kapazitaet vergleichen', 'Materialstatus pruefen', 'Terminrisiko melden', 'Termin einfach zusagen']} aufgaben={[{ frage: 'Was zeigt, ob die Menge in die verfuegbare Zeit passt?', korrekt: 'Losgroesse mit Kapazitaet vergleichen' }, { frage: 'Was kann einen Termin trotz freier Maschine blockieren?', korrekt: 'Materialstatus pruefen' }, { frage: 'Was ist bei absehbarer Verspaetung richtig?', korrekt: 'Terminrisiko melden' }]} fehlerName="LieferterminLosgroesseTrainer" standardBegruendung="Termine sind nur belastbar, wenn Losgroesse, Material und Kapazitaet zusammenpassen." naechsterButton="Naechste Terminfrage" className={className} />;
}

/**
 * Trainiert Bestand und Mindestbestand.
 */
export function BestandMindestbestandTrainer({ titel = 'Bestand und Mindestbestand', className }: BestandMindestbestandTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Istbestand, Grenze und Materialmeldung." badgeText="Bestand" badgeSymbol="B" optionen={['Istbestand pruefen', 'Mindestbestand beachten', 'Bedarf abgleichen', 'Leeres Fach ignorieren']} aufgaben={[{ frage: 'Was zeigt, wie viel aktuell vorhanden ist?', korrekt: 'Istbestand pruefen' }, { frage: 'Welche Grenze soll nicht unterschritten werden?', korrekt: 'Mindestbestand beachten' }, { frage: 'Was verbindet Lagerstand mit Auftrag?', korrekt: 'Bedarf abgleichen' }]} fehlerName="BestandMindestbestandTrainer" standardBegruendung="Bestand wird gegen Bedarf und Mindestbestand geprueft." naechsterButton="Naechste Bestandsfrage" className={className} />;
}

/**
 * Trainiert Meldebestand und Sicherheitsbestand.
 */
export function MeldebestandSicherheitsbestandTrainer({ titel = 'Meldebestand und Sicherheitsbestand', className }: MeldebestandSicherheitsbestandTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Nachbestellpunkt, Puffer und Lieferzeit." badgeText="Melde" badgeSymbol="MB" optionen={['Nachschub ausloesen', 'Sicherheitsbestand schuetzen', 'Lieferzeit beachten', 'Puffer frei verbrauchen']} aufgaben={[{ frage: 'Was passiert am Meldebestand?', korrekt: 'Nachschub ausloesen' }, { frage: 'Was puffert Unsicherheit im Lager?', korrekt: 'Sicherheitsbestand schuetzen' }, { frage: 'Was beeinflusst den Meldebestand stark?', korrekt: 'Lieferzeit beachten' }]} fehlerName="MeldebestandSicherheitsbestandTrainer" standardBegruendung="Meldebestand und Sicherheitsbestand verhindern zu spaete Nachversorgung." naechsterButton="Naechste Meldebestandsfrage" className={className} />;
}

/**
 * Trainiert FIFO im Lager.
 */
export function FifoTrainer({ titel = 'FIFO', className }: FifoTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Charge, Reihenfolge und Rueckverfolgung." badgeText="FIFO" badgeSymbol="F" optionen={['Aelteste freigegebene Charge nehmen', 'Eingangsdatum pruefen', 'Charge dokumentieren', 'Neue Ware zuerst greifen']} aufgaben={[{ frage: 'Welche Ware wird nach FIFO zuerst entnommen?', korrekt: 'Aelteste freigegebene Charge nehmen' }, { frage: 'Was hilft bei der Reihenfolge?', korrekt: 'Eingangsdatum pruefen' }, { frage: 'Was sichert spaetere Rueckverfolgung?', korrekt: 'Charge dokumentieren' }]} fehlerName="FifoTrainer" standardBegruendung="FIFO haelt Materialreihenfolge und Chargenbezug nachvollziehbar." naechsterButton="Naechste FIFO-Frage" className={className} />;
}

/**
 * Trainiert das Kanban-Grundprinzip.
 */
export function KanbanGrundprinzipTrainer({ titel = 'Kanban-Grundprinzip', className }: KanbanGrundprinzipTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Verbrauchssignal, Karte und Nachschub." badgeText="Kanban" badgeSymbol="K" optionen={['Verbrauch als Signal nutzen', 'Karte weitergeben', 'Feste Menge nachfuellen', 'Karte sammeln und spaeter klaeren']} aufgaben={[{ frage: 'Was loest im Pull-Prinzip Nachschub aus?', korrekt: 'Verbrauch als Signal nutzen' }, { frage: 'Was darf nicht im Arbeitsplatz liegen bleiben?', korrekt: 'Karte weitergeben' }, { frage: 'Was haelt den Regelkreis stabil?', korrekt: 'Feste Menge nachfuellen' }]} fehlerName="KanbanGrundprinzipTrainer" standardBegruendung="Kanban funktioniert nur mit klarer Karte, Menge und Nachfuellregel." naechsterButton="Naechste Kanban-Frage" className={className} />;
}

/**
 * Trainiert Wertschoepfung und Verschwendung.
 */
export function WertschoepfungVerschwendungTrainer({ titel = 'Wertschoepfung und Verschwendung', className }: WertschoepfungVerschwendungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Nutzen, Wartezeit und unnoetige Bewegung." badgeText="Lean" badgeSymbol="L" optionen={['Kundennutzen schaffen', 'Wartezeit als Verlust sehen', 'Suchen als Verschwendung erkennen', 'Jedes Bewegen als Wert zaehlen']} aufgaben={[{ frage: 'Was ist Wertschoepfung?', korrekt: 'Kundennutzen schaffen' }, { frage: 'Was ist typische Verschwendung im Ablauf?', korrekt: 'Wartezeit als Verlust sehen' }, { frage: 'Was ist oft versteckte Verschwendung am Arbeitsplatz?', korrekt: 'Suchen als Verschwendung erkennen' }]} fehlerName="WertschoepfungVerschwendungTrainer" standardBegruendung="Wertschoepfung schafft Kundennutzen. Alles andere wird kritisch als Verschwendung geprueft." naechsterButton="Naechste Lean-Frage" className={className} />;
}

/**
 * Trainiert 5S am Arbeitsplatz.
 */
export function FuenfSWiederholenTrainer({ titel = '5S wiederholen', className }: FuenfSWiederholenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Sortieren, Standard und taegliches Halten." badgeText="5S" badgeSymbol="5S" optionen={['Unnoetiges aussortieren', 'Platz fuer jedes Werkzeug festlegen', 'Standard taeglich halten', 'Einmal aufraeumen und fertig']} aufgaben={[{ frage: 'Was ist der erste Schritt bei 5S?', korrekt: 'Unnoetiges aussortieren' }, { frage: 'Was macht Systematisieren konkret?', korrekt: 'Platz fuer jedes Werkzeug festlegen' }, { frage: 'Wann wirkt 5S wirklich?', korrekt: 'Standard taeglich halten' }]} fehlerName="FuenfSWiederholenTrainer" standardBegruendung="5S bleibt nur wirksam, wenn Ordnung und Standard im Alltag gehalten werden." naechsterButton="Naechste 5S-Frage" className={className} />;
}

/**
 * Trainiert KVP im Team.
 */
export function KvpImTeamTrainer({ titel = 'KVP im Team', className }: KvpImTeamTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Problem, Vorschlag, Massnahme und Standard." badgeText="KVP" badgeSymbol="KVP" optionen={['Problem im Team sichtbar machen', 'Massnahme gemeinsam festlegen', 'Wirksamkeit pruefen', 'Idee ohne Pruefung sofort ueberall einfuehren']} aufgaben={[{ frage: 'Womit beginnt KVP im Team?', korrekt: 'Problem im Team sichtbar machen' }, { frage: 'Was folgt auf einen bewerteten Vorschlag?', korrekt: 'Massnahme gemeinsam festlegen' }, { frage: 'Was zeigt, ob die Verbesserung hilft?', korrekt: 'Wirksamkeit pruefen' }]} fehlerName="KvpImTeamTrainer" standardBegruendung="KVP im Team verbindet Problem, Massnahme, Wirksamkeitspruefung und Standard." naechsterButton="Naechste Team-KVP-Frage" className={className} />;
}

/**
 * Tastatur- und touchbedienbarer Messschieber-Trainer fuer die erste Fachkunde-Lerneinheit.
 */

export function OeeUeberblickenTrainer({ titel = 'OEE ueberblicken', className }: OeeUeberblickenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne die drei OEE-Faktoren." badgeText="OEE" badgeSymbol="O" optionen={['Verfuegbarkeit einordnen', 'Leistungsgrad einordnen', 'Qualitaetsrate einordnen', 'Nur Ausschuss zaehlen']} aufgaben={[{ frage: 'Welcher Faktor bewertet Laufzeit gegen Planzeit?', korrekt: 'Verfuegbarkeit einordnen' }, { frage: 'Welcher Faktor bewertet Ausbringung gegen Soll?', korrekt: 'Leistungsgrad einordnen' }, { frage: 'Welcher Faktor bewertet Gutmenge gegen Gesamtmenge?', korrekt: 'Qualitaetsrate einordnen' }]} fehlerName="OeeUeberblickenTrainer" standardBegruendung="OEE verbindet Verfuegbarkeit, Leistungsgrad und Qualitaetsrate." naechsterButton="Naechste OEE-Frage" className={className} />;
}


export function VerfuegbarkeitBerechnenTrainer({ titel = 'Verfuegbarkeit berechnen', className }: VerfuegbarkeitBerechnenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Planzeit, Laufzeit und Stillstand." badgeText="Verf." badgeSymbol="V" optionen={['Planzeit klaeren', 'Laufzeit bestimmen', 'Stillstand abziehen', 'Zeiten frei schaetzen']} aufgaben={[{ frage: 'Was ist der Bezugswert der Verfuegbarkeit?', korrekt: 'Planzeit klaeren' }, { frage: 'Was steht im Zaehler der Verfuegbarkeit?', korrekt: 'Laufzeit bestimmen' }, { frage: 'Was senkt die Verfuegbarkeit?', korrekt: 'Stillstand abziehen' }]} fehlerName="VerfuegbarkeitBerechnenTrainer" standardBegruendung="Verfuegbarkeit braucht Planzeit, Laufzeit und dokumentierten Stillstand." naechsterButton="Naechste Verfuegbarkeitsfrage" className={className} />;
}


export function LeistungsgradBerechnenTrainer({ titel = 'Leistungsgrad berechnen', className }: LeistungsgradBerechnenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Sollleistung und Istleistung." badgeText="Leist." badgeSymbol="L" optionen={['Sollbasis lesen', 'Istleistung bestimmen', 'Leistungsgrad berechnen', 'Soll frei erhoehen']} aufgaben={[{ frage: 'Woher kommt die Sollleistung?', korrekt: 'Sollbasis lesen' }, { frage: 'Was wird mit dem Soll verglichen?', korrekt: 'Istleistung bestimmen' }, { frage: 'Was ergibt der Vergleich?', korrekt: 'Leistungsgrad berechnen' }]} fehlerName="LeistungsgradBerechnenTrainer" standardBegruendung="Leistungsgrad vergleicht Ist- und Sollleistung auf freigegebener Basis." naechsterButton="Naechste Leistungsfrage" className={className} />;
}


export function QualitaetsrateBerechnenTrainer({ titel = 'Qualitaetsrate berechnen', className }: QualitaetsrateBerechnenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Gutmenge, Ausschuss und Regel." badgeText="Qual." badgeSymbol="Q" optionen={['Gesamtmenge klaeren', 'Gutmenge bestimmen', 'Nacharbeit nach Regel bewerten', 'Ausschuss als Gut zaehlen']} aufgaben={[{ frage: 'Was steht im Nenner der Qualitaetsrate?', korrekt: 'Gesamtmenge klaeren' }, { frage: 'Was steht typisch im Zaehler?', korrekt: 'Gutmenge bestimmen' }, { frage: 'Was darf nicht willkuerlich umgebucht werden?', korrekt: 'Nacharbeit nach Regel bewerten' }]} fehlerName="QualitaetsrateBerechnenTrainer" standardBegruendung="Qualitaetsrate braucht klare Gut-, Ausschuss- und Nacharbeitsregeln." naechsterButton="Naechste Qualitaetsratenfrage" className={className} />;
}


export function OeeVerbessernTrainer({ titel = 'OEE verbessern', className }: OeeVerbessernTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Verlust, Ursache und Massnahme." badgeText="Verb." badgeSymbol="VB" optionen={['Groessten Verlust finden', 'Ursache klaeren', 'Wirksamkeit pruefen', 'Blind Parameter drehen']} aufgaben={[{ frage: 'Womit beginnt die Verbesserung?', korrekt: 'Groessten Verlust finden' }, { frage: 'Was folgt auf den Verlust?', korrekt: 'Ursache klaeren' }, { frage: 'Was zeigt, ob die Massnahme hilft?', korrekt: 'Wirksamkeit pruefen' }]} fehlerName="OeeVerbessernTrainer" standardBegruendung="OEE-Verbesserung braucht Verlustbild, Ursache und Wirksamkeitspruefung." naechsterButton="Naechste Verbesserungsfrage" className={className} />;
}


export function RechenwegInPruefungenTrainer({ titel = 'Rechenweg in Pruefungen', className }: RechenwegInPruefungenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Rechenweg in Pruefungen." badgeText="MAT" badgeSymbol="1" optionen={['Gegeben und gesucht markieren', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Rechenweg in Pruefungen?', korrekt: 'Gegeben und gesucht markieren' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="RechenwegInPruefungenTrainer" standardBegruendung="Rechenweg in Pruefungen braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function GrundrechenartenSicherTrainer({ titel = 'Grundrechenarten sicher', className }: GrundrechenartenSicherTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Grundrechenarten sicher." badgeText="MAT" badgeSymbol="2" optionen={['Rechenfehler vermeiden', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Grundrechenarten sicher?', korrekt: 'Rechenfehler vermeiden' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="GrundrechenartenSicherTrainer" standardBegruendung="Grundrechenarten sicher braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function DreisatzTrainer({ titel = 'Dreisatz', className }: DreisatzTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Dreisatz." badgeText="MAT" badgeSymbol="3" optionen={['Proportional rechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Dreisatz?', korrekt: 'Proportional rechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="DreisatzTrainer" standardBegruendung="Dreisatz braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function ProzentrechnungTrainer({ titel = 'Prozentrechnung', className }: ProzentrechnungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Prozentrechnung." badgeText="MAT" badgeSymbol="4" optionen={['Anteile berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Prozentrechnung?', korrekt: 'Anteile berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="ProzentrechnungTrainer" standardBegruendung="Prozentrechnung braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function EinheitenInAufgabenTrainer({ titel = 'Einheiten in Aufgaben umrechnen', className }: EinheitenInAufgabenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Einheiten in Aufgaben umrechnen." badgeText="MAT" badgeSymbol="5" optionen={['Einheit vor Formel pruefen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Einheiten in Aufgaben umrechnen?', korrekt: 'Einheit vor Formel pruefen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="EinheitenInAufgabenTrainer" standardBegruendung="Einheiten in Aufgaben umrechnen braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function UmfangFlaecheRechteckTrainer({ titel = 'Umfang und Flaeche Rechteck', className }: UmfangFlaecheRechteckTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Umfang und Flaeche Rechteck." badgeText="MAT" badgeSymbol="6" optionen={['Rechteck berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Umfang und Flaeche Rechteck?', korrekt: 'Rechteck berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="UmfangFlaecheRechteckTrainer" standardBegruendung="Umfang und Flaeche Rechteck braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function KreisumfangKreisflaecheTrainer({ titel = 'Kreisumfang und Kreisflaeche', className }: KreisumfangKreisflaecheTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Kreisumfang und Kreisflaeche." badgeText="MAT" badgeSymbol="7" optionen={['Kreiswerte berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Kreisumfang und Kreisflaeche?', korrekt: 'Kreiswerte berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="KreisumfangKreisflaecheTrainer" standardBegruendung="Kreisumfang und Kreisflaeche braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function VolumenQuaderZylinderTrainer({ titel = 'Volumen Quader und Zylinder', className }: VolumenQuaderZylinderTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Volumen Quader und Zylinder." badgeText="MAT" badgeSymbol="8" optionen={['Volumen berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Volumen Quader und Zylinder?', korrekt: 'Volumen berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="VolumenQuaderZylinderTrainer" standardBegruendung="Volumen Quader und Zylinder braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function MasseAusDichteTrainer({ titel = 'Masse aus Dichte', className }: MasseAusDichteTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Masse aus Dichte." badgeText="MAT" badgeSymbol="9" optionen={['Masse berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Masse aus Dichte?', korrekt: 'Masse berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="MasseAusDichteTrainer" standardBegruendung="Masse aus Dichte braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function GeschwindigkeitUndZeitTrainer({ titel = 'Geschwindigkeit und Zeit', className }: GeschwindigkeitUndZeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Geschwindigkeit und Zeit." badgeText="MAT" badgeSymbol="10" optionen={['Bewegungsaufgaben loesen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Geschwindigkeit und Zeit?', korrekt: 'Bewegungsaufgaben loesen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="GeschwindigkeitUndZeitTrainer" standardBegruendung="Geschwindigkeit und Zeit braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function DrehzahlSchnittgeschwindigkeitTrainer({ titel = 'Drehzahl und Schnittgeschwindigkeit', className }: DrehzahlSchnittgeschwindigkeitTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Drehzahl und Schnittgeschwindigkeit." badgeText="MAT" badgeSymbol="11" optionen={['Formeln umstellen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Drehzahl und Schnittgeschwindigkeit?', korrekt: 'Formeln umstellen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="DrehzahlSchnittgeschwindigkeitTrainer" standardBegruendung="Drehzahl und Schnittgeschwindigkeit braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function VorschubBerechnenTrainer({ titel = 'Vorschub berechnen', className }: VorschubBerechnenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Vorschub berechnen." badgeText="MAT" badgeSymbol="12" optionen={['Vorschubaufgaben loesen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Vorschub berechnen?', korrekt: 'Vorschubaufgaben loesen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="VorschubBerechnenTrainer" standardBegruendung="Vorschub berechnen braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function KraftUndDruckTrainer({ titel = 'Kraft und Druck', className }: KraftUndDruckTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Kraft und Druck." badgeText="MAT" badgeSymbol="13" optionen={['Druckaufgaben loesen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Kraft und Druck?', korrekt: 'Druckaufgaben loesen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="KraftUndDruckTrainer" standardBegruendung="Kraft und Druck braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function HydraulischerDruckTrainer({ titel = 'Hydraulischer Druck', className }: HydraulischerDruckTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Hydraulischer Druck." badgeText="MAT" badgeSymbol="14" optionen={['Kraftuebersetzung verstehen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Hydraulischer Druck?', korrekt: 'Kraftuebersetzung verstehen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="HydraulischerDruckTrainer" standardBegruendung="Hydraulischer Druck braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function LeistungArbeitWirkungsgradTrainer({ titel = 'Leistung, Arbeit, Wirkungsgrad', className }: LeistungArbeitWirkungsgradTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Leistung, Arbeit, Wirkungsgrad." badgeText="MAT" badgeSymbol="15" optionen={['Energiebegriffe anwenden', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Leistung, Arbeit, Wirkungsgrad?', korrekt: 'Energiebegriffe anwenden' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="LeistungArbeitWirkungsgradTrainer" standardBegruendung="Leistung, Arbeit, Wirkungsgrad braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function UebersetzungsverhaeltnisTrainer({ titel = 'Uebersetzungsverhaeltnis', className }: UebersetzungsverhaeltnisTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Uebersetzungsverhaeltnis." badgeText="MAT" badgeSymbol="16" optionen={['Getriebe rechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Uebersetzungsverhaeltnis?', korrekt: 'Getriebe rechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="UebersetzungsverhaeltnisTrainer" standardBegruendung="Uebersetzungsverhaeltnis braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function DrehmomentTrainer({ titel = 'Drehmoment', className }: DrehmomentTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Drehmoment." badgeText="MAT" badgeSymbol="17" optionen={['Hebelarm nutzen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Drehmoment?', korrekt: 'Hebelarm nutzen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="DrehmomentTrainer" standardBegruendung="Drehmoment braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function GutmengeAusschussquoteTrainer({ titel = 'Gutmenge und Ausschussquote', className }: GutmengeAusschussquoteTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Gutmenge und Ausschussquote." badgeText="MAT" badgeSymbol="18" optionen={['Produktionsmenge bewerten', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Gutmenge und Ausschussquote?', korrekt: 'Produktionsmenge bewerten' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="GutmengeAusschussquoteTrainer" standardBegruendung="Gutmenge und Ausschussquote braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function ProduktionsleistungTrainer({ titel = 'Produktionsleistung', className }: ProduktionsleistungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Produktionsleistung." badgeText="MAT" badgeSymbol="19" optionen={['Leistung je Zeit berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Produktionsleistung?', korrekt: 'Leistung je Zeit berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="ProduktionsleistungTrainer" standardBegruendung="Produktionsleistung braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function ProzentualeAbweichungTrainer({ titel = 'Prozentuale Abweichung', className }: ProzentualeAbweichungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Prozentuale Abweichung." badgeText="MAT" badgeSymbol="20" optionen={['Abweichung bewerten', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Prozentuale Abweichung?', korrekt: 'Abweichung bewerten' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="ProzentualeAbweichungTrainer" standardBegruendung="Prozentuale Abweichung braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function WaermeausdehnungPruefungsnahTrainer({ titel = 'Waermeausdehnung pruefungsnah', className }: WaermeausdehnungPruefungsnahTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Waermeausdehnung pruefungsnah." badgeText="MAT" badgeSymbol="21" optionen={['Delta-L berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Waermeausdehnung pruefungsnah?', korrekt: 'Delta-L berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="WaermeausdehnungPruefungsnahTrainer" standardBegruendung="Waermeausdehnung pruefungsnah braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function ToleranzberechnungTrainer({ titel = 'Toleranzberechnung', className }: ToleranzberechnungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Toleranzberechnung." badgeText="MAT" badgeSymbol="22" optionen={['Grenzmasse berechnen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Toleranzberechnung?', korrekt: 'Grenzmasse berechnen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="ToleranzberechnungTrainer" standardBegruendung="Toleranzberechnung braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function FormelUmstellenTrainer({ titel = 'Formel umstellen', className }: FormelUmstellenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Formel umstellen." badgeText="MAT" badgeSymbol="23" optionen={['Zielgroesse isolieren', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Formel umstellen?', korrekt: 'Zielgroesse isolieren' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="FormelUmstellenTrainer" standardBegruendung="Formel umstellen braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function PlausibilitaetVonErgebnissenTrainer({ titel = 'Plausibilitaet von Ergebnissen', className }: PlausibilitaetVonErgebnissenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Plausibilitaet von Ergebnissen." badgeText="MAT" badgeSymbol="24" optionen={['Ergebnis pruefen', 'Einheiten pruefen', 'Ergebnis auf Plausibilitaet testen', 'Blind rechnen']} aufgaben={[{ frage: 'Was ist das Lernziel bei Plausibilitaet von Ergebnissen?', korrekt: 'Ergebnis pruefen' }, { frage: 'Was verhindert Einheitenfehler?', korrekt: 'Einheiten pruefen' }, { frage: 'Was machst du nach dem Rechnen?', korrekt: 'Ergebnis auf Plausibilitaet testen' }]} fehlerName="PlausibilitaetVonErgebnissenTrainer" standardBegruendung="Plausibilitaet von Ergebnissen braucht strukturierten Rechenweg und Einheitenkontrolle." naechsterButton="Naechste Mathefrage" className={className} />;
}


export function AusbildungsvertragTrainer({ titel = 'Ausbildungsvertrag', className }: AusbildungsvertragTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Ausbildungsvertrag." badgeText="WiSo" badgeSymbol="1" optionen={['Vertragsinhalte kennen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Ausbildungsvertrag?', korrekt: 'Vertragsinhalte kennen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="AusbildungsvertragTrainer" standardBegruendung="Ausbildungsvertrag braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function RechteUndPflichtenTrainer({ titel = 'Rechte und Pflichten', className }: RechteUndPflichtenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Rechte und Pflichten." badgeText="WiSo" badgeSymbol="2" optionen={['Pflichten zuordnen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Rechte und Pflichten?', korrekt: 'Pflichten zuordnen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="RechteUndPflichtenTrainer" standardBegruendung="Rechte und Pflichten braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function ProbezeitUndKuendigungTrainer({ titel = 'Probezeit und Kuendigung', className }: ProbezeitUndKuendigungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Probezeit und Kuendigung." badgeText="WiSo" badgeSymbol="3" optionen={['Fristen nicht raten', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Probezeit und Kuendigung?', korrekt: 'Fristen nicht raten' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="ProbezeitUndKuendigungTrainer" standardBegruendung="Probezeit und Kuendigung braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function ArbeitsvertragTarifvertragTrainer({ titel = 'Arbeitsvertrag und Tarifvertrag', className }: ArbeitsvertragTarifvertragTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Arbeitsvertrag und Tarifvertrag." badgeText="WiSo" badgeSymbol="4" optionen={['Vertragstypen trennen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Arbeitsvertrag und Tarifvertrag?', korrekt: 'Vertragstypen trennen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="ArbeitsvertragTarifvertragTrainer" standardBegruendung="Arbeitsvertrag und Tarifvertrag braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function TarifautonomieBetriebsratTrainer({ titel = 'Tarifautonomie und Betriebsrat', className }: TarifautonomieBetriebsratTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Tarifautonomie und Betriebsrat." badgeText="WiSo" badgeSymbol="5" optionen={['Mitbestimmung einordnen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Tarifautonomie und Betriebsrat?', korrekt: 'Mitbestimmung einordnen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="TarifautonomieBetriebsratTrainer" standardBegruendung="Tarifautonomie und Betriebsrat braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function JugendAuszubildendenvertretungTrainer({ titel = 'Jugend- und Auszubildendenvertretung', className }: JugendAuszubildendenvertretungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Jugend- und Auszubildendenvertretung." badgeText="WiSo" badgeSymbol="6" optionen={['Vertretung kennen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Jugend- und Auszubildendenvertretung?', korrekt: 'Vertretung kennen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="JugendAuszubildendenvertretungTrainer" standardBegruendung="Jugend- und Auszubildendenvertretung braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function SozialversicherungTrainer({ titel = 'Sozialversicherung', className }: SozialversicherungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Sozialversicherung." badgeText="WiSo" badgeSymbol="7" optionen={['Zweige nennen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Sozialversicherung?', korrekt: 'Zweige nennen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="SozialversicherungTrainer" standardBegruendung="Sozialversicherung braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function ArbeitszeitUndUrlaubTrainer({ titel = 'Arbeitszeit und Urlaub', className }: ArbeitszeitUndUrlaubTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Arbeitszeit und Urlaub." badgeText="WiSo" badgeSymbol="8" optionen={['Regelungen finden', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Arbeitszeit und Urlaub?', korrekt: 'Regelungen finden' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="ArbeitszeitUndUrlaubTrainer" standardBegruendung="Arbeitszeit und Urlaub braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function EntgeltabrechnungTrainer({ titel = 'Entgeltabrechnung', className }: EntgeltabrechnungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Entgeltabrechnung." badgeText="WiSo" badgeSymbol="9" optionen={['Brutto/Netto verstehen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Entgeltabrechnung?', korrekt: 'Brutto/Netto verstehen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="EntgeltabrechnungTrainer" standardBegruendung="Entgeltabrechnung braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function NachhaltigkeitUmweltschutzTrainer({ titel = 'Nachhaltigkeit und Umweltschutz', className }: NachhaltigkeitUmweltschutzTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Nachhaltigkeit und Umweltschutz." badgeText="WiSo" badgeSymbol="10" optionen={['Nachhaltigkeit betrieblich sehen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Nachhaltigkeit und Umweltschutz?', korrekt: 'Nachhaltigkeit betrieblich sehen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="NachhaltigkeitUmweltschutzTrainer" standardBegruendung="Nachhaltigkeit und Umweltschutz braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function WirtschaftlichkeitProduktivitaetTrainer({ titel = 'Wirtschaftlichkeit und Produktivitaet', className }: WirtschaftlichkeitProduktivitaetTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Wirtschaftlichkeit und Produktivitaet." badgeText="WiSo" badgeSymbol="11" optionen={['Kennzahlen deuten', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Wirtschaftlichkeit und Produktivitaet?', korrekt: 'Kennzahlen deuten' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="WirtschaftlichkeitProduktivitaetTrainer" standardBegruendung="Wirtschaftlichkeit und Produktivitaet braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function OekonomischesPrinzipTrainer({ titel = 'Oekonomisches Prinzip', className }: OekonomischesPrinzipTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Oekonomisches Prinzip." badgeText="WiSo" badgeSymbol="12" optionen={['Minimal/Maximalprinzip erkennen', 'Quelle beachten', 'Begriffe korrekt zuordnen', 'Fristen frei erfinden']} aufgaben={[{ frage: 'Was ist das Lernziel bei Oekonomisches Prinzip?', korrekt: 'Minimal/Maximalprinzip erkennen' }, { frage: 'Worauf stuetzt du konkrete Angaben?', korrekt: 'Quelle beachten' }, { frage: 'Was ist in der Pruefung wichtig?', korrekt: 'Begriffe korrekt zuordnen' }]} fehlerName="OekonomischesPrinzipTrainer" standardBegruendung="Oekonomisches Prinzip braucht klare Begriffe und Quellenbezug." naechsterButton="Naechste WiSo-Frage" className={className} />;
}


export function AufgabenstellungRichtigLesenTrainer({ titel = 'Aufgabenstellung richtig lesen', className }: AufgabenstellungRichtigLesenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Aufgabenstellung richtig lesen." badgeText="PRF" badgeSymbol="1" optionen={['Operatoren markieren', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Aufgabenstellung richtig lesen?', korrekt: 'Operatoren markieren' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="AufgabenstellungRichtigLesenTrainer" standardBegruendung="Aufgabenstellung richtig lesen braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function GegebenUndGesuchtTrainer({ titel = 'Gegeben und gesucht finden', className }: GegebenUndGesuchtTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Gegeben und gesucht finden." badgeText="PRF" badgeSymbol="2" optionen={['Werte strukturieren', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Gegeben und gesucht finden?', korrekt: 'Werte strukturieren' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="GegebenUndGesuchtTrainer" standardBegruendung="Gegeben und gesucht finden braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function PassendeFormelFindenTrainer({ titel = 'Passende Formel finden', className }: PassendeFormelFindenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Passende Formel finden." badgeText="PRF" badgeSymbol="3" optionen={['Formel auswaehlen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Passende Formel finden?', korrekt: 'Formel auswaehlen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="PassendeFormelFindenTrainer" standardBegruendung="Passende Formel finden braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function EinheitenKontrollierenTrainer({ titel = 'Einheiten kontrollieren', className }: EinheitenKontrollierenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Einheiten kontrollieren." badgeText="PRF" badgeSymbol="4" optionen={['Einheitenfehler finden', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Einheiten kontrollieren?', korrekt: 'Einheitenfehler finden' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="EinheitenKontrollierenTrainer" standardBegruendung="Einheiten kontrollieren braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function TabellenbuchNutzenTrainer({ titel = 'Tabellenbuch nutzen', className }: TabellenbuchNutzenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Tabellenbuch nutzen." badgeText="PRF" badgeSymbol="5" optionen={['Fundstellen finden', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Tabellenbuch nutzen?', korrekt: 'Fundstellen finden' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="TabellenbuchNutzenTrainer" standardBegruendung="Tabellenbuch nutzen braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function MultipleChoiceAusschlussTrainer({ titel = 'Multiple-Choice-Ausschlussverfahren', className }: MultipleChoiceAusschlussTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Multiple-Choice-Ausschlussverfahren." badgeText="PRF" badgeSymbol="6" optionen={['Distraktoren pruefen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Multiple-Choice-Ausschlussverfahren?', korrekt: 'Distraktoren pruefen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="MultipleChoiceAusschlussTrainer" standardBegruendung="Multiple-Choice-Ausschlussverfahren braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function UnbekannteBegriffeTrainer({ titel = 'Unbekannte Begriffe bearbeiten', className }: UnbekannteBegriffeTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Unbekannte Begriffe bearbeiten." badgeText="PRF" badgeSymbol="7" optionen={['Kontext nutzen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Unbekannte Begriffe bearbeiten?', korrekt: 'Kontext nutzen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="UnbekannteBegriffeTrainer" standardBegruendung="Unbekannte Begriffe bearbeiten braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function ZeitmanagementTrainer({ titel = 'Zeitmanagement', className }: ZeitmanagementTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Zeitmanagement." badgeText="PRF" badgeSymbol="8" optionen={['Zeit einteilen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Zeitmanagement?', korrekt: 'Zeit einteilen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="ZeitmanagementTrainer" standardBegruendung="Zeitmanagement braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function PruefungsangstReduzierenTrainer({ titel = 'Pruefungsangst reduzieren', className }: PruefungsangstReduzierenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Pruefungsangst reduzieren." badgeText="PRF" badgeSymbol="9" optionen={['Routine nutzen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Pruefungsangst reduzieren?', korrekt: 'Routine nutzen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="PruefungsangstReduzierenTrainer" standardBegruendung="Pruefungsangst reduzieren braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function TypischePruefungsfallenTrainer({ titel = 'Typische Pruefungsfallen', className }: TypischePruefungsfallenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Typische Pruefungsfallen." badgeText="PRF" badgeSymbol="10" optionen={['Fallen erkennen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Typische Pruefungsfallen?', korrekt: 'Fallen erkennen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="TypischePruefungsfallenTrainer" standardBegruendung="Typische Pruefungsfallen braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function MiniPruefungProduktionstechnikTrainer({ titel = 'Mini-Pruefung Produktionstechnik', className }: MiniPruefungProduktionstechnikTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Mini-Pruefung Produktionstechnik." badgeText="PRF" badgeSymbol="11" optionen={['gemischt ueben', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Mini-Pruefung Produktionstechnik?', korrekt: 'gemischt ueben' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="MiniPruefungProduktionstechnikTrainer" standardBegruendung="Mini-Pruefung Produktionstechnik braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function MiniPruefungProduktionsplanungTrainer({ titel = 'Mini-Pruefung Produktionsplanung', className }: MiniPruefungProduktionsplanungTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Mini-Pruefung Produktionsplanung." badgeText="PRF" badgeSymbol="12" optionen={['Planung ueben', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Mini-Pruefung Produktionsplanung?', korrekt: 'Planung ueben' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="MiniPruefungProduktionsplanungTrainer" standardBegruendung="Mini-Pruefung Produktionsplanung braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function MiniPruefungWisoTrainer({ titel = 'Mini-Pruefung WiSo', className }: MiniPruefungWisoTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Mini-Pruefung WiSo." badgeText="PRF" badgeSymbol="13" optionen={['WiSo ueben', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Mini-Pruefung WiSo?', korrekt: 'WiSo ueben' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="MiniPruefungWisoTrainer" standardBegruendung="Mini-Pruefung WiSo braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function WiederholungsmodusTrainer({ titel = 'Wiederholungsmodus nach Fehlern', className }: WiederholungsmodusTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Wiederholungsmodus nach Fehlern." badgeText="PRF" badgeSymbol="14" optionen={['Schwachstellen nutzen', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Wiederholungsmodus nach Fehlern?', korrekt: 'Schwachstellen nutzen' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="WiederholungsmodusTrainer" standardBegruendung="Wiederholungsmodus nach Fehlern braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function PersoenlicheSchwachstellenTrainer({ titel = 'Persoenliche Schwachstellen erkennen', className }: PersoenlicheSchwachstellenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Persoenliche Schwachstellen erkennen." badgeText="PRF" badgeSymbol="15" optionen={['Lernplan ableiten', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Persoenliche Schwachstellen erkennen?', korrekt: 'Lernplan ableiten' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="PersoenlicheSchwachstellenTrainer" standardBegruendung="Persoenliche Schwachstellen erkennen braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function PruefungssimulationAbschlussTrainer({ titel = 'Pruefungssimulation Abschluss', className }: PruefungssimulationAbschlussTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Trainiere Pruefungssimulation Abschluss." badgeText="PRF" badgeSymbol="16" optionen={['realistisch trainieren', 'Rechenweg strukturieren', 'Ergebnis pruefen', 'Antworten nur raten']} aufgaben={[{ frage: 'Was ist das Ziel bei Pruefungssimulation Abschluss?', korrekt: 'realistisch trainieren' }, { frage: 'Was hilft gegen typische Fehler?', korrekt: 'Rechenweg strukturieren' }, { frage: 'Was machst du vor dem Abgeben?', korrekt: 'Ergebnis pruefen' }]} fehlerName="PruefungssimulationAbschlussTrainer" standardBegruendung="Pruefungssimulation Abschluss braucht eine klare Pruefungsstrategie." naechsterButton="Naechste Pruefungsfrage" className={className} />;
}


export function ProduktionsauftragLesenTrainer({ titel = 'Produktionsauftrag lesen', className }: ProduktionsauftragLesenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Auftragsdaten und Klaerung." badgeText="Auftrag" badgeSymbol="A" optionen={['Teil und Menge finden', 'Termin pruefen', 'Offene Punkte klaeren', 'Unklare Daten ignorieren']} aufgaben={[{ frage: 'Was brauchst du zuerst aus dem Auftrag?', korrekt: 'Teil und Menge finden' }, { frage: 'Was zeigt den Lieferdruck?', korrekt: 'Termin pruefen' }, { frage: 'Was ist bei Luecken richtig?', korrekt: 'Offene Punkte klaeren' }]} fehlerName="ProduktionsauftragLesenTrainer" standardBegruendung="Auftragsdaten werden gelesen und Luecken vor dem Start geklaert." naechsterButton="Naechste Auftragsfrage" className={className} />;
}


export function ProduktionsablaufVerstehenTrainer({ titel = 'Produktionsablauf verstehen', className }: ProduktionsablaufVerstehenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne die Stationen im Ablauf." badgeText="Ablauf" badgeSymbol="AB" optionen={['Auftrag zuerst lesen', 'Material bereitstellen', 'Ergebnis pruefen', 'Pruefung einfach weglassen']} aufgaben={[{ frage: 'Womit beginnt der Ablauf?', korrekt: 'Auftrag zuerst lesen' }, { frage: 'Was braucht die Maschine vor dem Start?', korrekt: 'Material bereitstellen' }, { frage: 'Was sichert Qualitaet im Ablauf?', korrekt: 'Ergebnis pruefen' }]} fehlerName="ProduktionsablaufVerstehenTrainer" standardBegruendung="Produktionsablaeufe verbinden Auftrag, Material, Bearbeitung und Pruefung." naechsterButton="Naechste Ablaufsfrage" className={className} />;
}


export function SchichtbeginnVorbereitenTrainer({ titel = 'Schichtbeginn vorbereiten', className }: SchichtbeginnVorbereitenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne die Schritte am Schichtbeginn." badgeText="Schicht" badgeSymbol="S" optionen={['Uebergabe lesen', 'Sicherheitscheck machen', 'Offene Punkte klaeren', 'Hinweise ignorieren']} aufgaben={[{ frage: 'Was machst du zuerst bei der Uebernahme?', korrekt: 'Uebergabe lesen' }, { frage: 'Was kommt vor dem Produzieren?', korrekt: 'Sicherheitscheck machen' }, { frage: 'Was darf nicht mitlaufen?', korrekt: 'Offene Punkte klaeren' }]} fehlerName="SchichtbeginnVorbereitenTrainer" standardBegruendung="Schichtbeginn braucht Uebergabe, Sicherheit und Klaerung offener Punkte." naechsterButton="Naechste Schichtfrage" className={className} />;
}


export function OrdnungAmArbeitsplatzTrainer({ titel = 'Ordnung am Arbeitsplatz', className }: OrdnungAmArbeitsplatzTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Massnahmen fuer den Arbeitsplatz." badgeText="Ordnung" badgeSymbol="OR" optionen={['Feste Plaetze nutzen', 'Kennzeichnung beachten', 'Standard halten', 'Alles irgendwo ablegen']} aufgaben={[{ frage: 'Was reduziert Suchzeiten?', korrekt: 'Feste Plaetze nutzen' }, { frage: 'Was verhindert Verwechslung?', korrekt: 'Kennzeichnung beachten' }, { frage: 'Was haelt Ordnung dauerhaft?', korrekt: 'Standard halten' }]} fehlerName="OrdnungAmArbeitsplatzTrainer" standardBegruendung="Ordnung braucht feste Plaetze, Kennzeichnung und gehaltene Standards." naechsterButton="Naechste Ordnungsfrage" className={className} />;
}


export function ProduktionsdatenNotierenTrainer({ titel = 'Produktionsdaten sauber notieren', className }: ProduktionsdatenNotierenTrainerProps) {
  return <KunststoffverfahrenTrainerBase titel={titel} beschreibung="Ordne Pflichtangaben in der Dokumentation." badgeText="Daten" badgeSymbol="D" optionen={['Menge eintragen', 'Charge dokumentieren', 'Ausschuss wahrheitsgemaess notieren', 'Werte schoenrechnen']} aufgaben={[{ frage: 'Was gehoert zur Mengenrueckmeldung?', korrekt: 'Menge eintragen' }, { frage: 'Was sichert Rueckverfolgung?', korrekt: 'Charge dokumentieren' }, { frage: 'Was darf nicht geschoent werden?', korrekt: 'Ausschuss wahrheitsgemaess notieren' }]} fehlerName="ProduktionsdatenNotierenTrainer" standardBegruendung="Produktionsdaten muessen vollstaendig, lesbar und wahr sein." naechsterButton="Naechste Datenfrage" className={className} />;
}

export function InteraktiverMessschieber({
  titel = 'Interaktiver Messschieber',
  minMm = 0,
  maxMm = 50,
  schrittMm = 0.05,
  startwertMm = 20,
  nennmassMm = 20,
  oberesAbmassMm = 0.1,
  unteresAbmassMm = -0.05,
  quellenHinweis = 'Uebungswerte aus der Beispielzeichnung. Reale Grenzwerte immer aus Zeichnung, Pruefplan oder Tabellenbuch uebernehmen.',
  className,
}: InteraktiverMessschieberProps) {
  validiereMessschieberKonfiguration(minMm, maxMm, schrittMm, nennmassMm, unteresAbmassMm, oberesAbmassMm);
  const bereinigterStartwert = normalisiereMesswert(startwertMm, minMm, maxMm, schrittMm);
  const [messwertMm, setMesswertMm] = React.useState(bereinigterStartwert);
  const [eingabe, setEingabe] = React.useState(formatiereZahl(bereinigterStartwert));
  const beschreibungId = React.useId();
  const ergebnisId = React.useId();

  const unteresGrenzmass = nennmassMm + unteresAbmassMm;
  const oberesGrenzmass = nennmassMm + oberesAbmassMm;
  const status = bewerteMesswert(messwertMm, unteresGrenzmass, oberesGrenzmass);
  const statusDaten = STATUS_DATEN[status];
  const position = berechnePosition(messwertMm, minMm, maxMm);
  const schrittLabel = formatiereZahl(schrittMm);

  /**
   * Setzt den Messwert ueber alle Eingabewege konsistent.
   */
  function setzeMesswert(naechsterWert: number): void {
    const normalisiert = normalisiereMesswert(naechsterWert, minMm, maxMm, schrittMm);
    setMesswertMm(normalisiert);
    setEingabe(formatiereZahl(normalisiert));
  }

  /**
   * Uebernimmt freie Zahleneingaben nach Blur oder Enter.
   */
  function uebernehmeEingabe(): void {
    const geparst = parseMesswert(eingabe);
    if (geparst === null) {
      setEingabe(formatiereZahl(messwertMm));
      return;
    }
    setzeMesswert(geparst);
  }

  return (
    <section
      className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)}
      aria-labelledby={`${beschreibungId}-titel`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">
            {titel}
          </h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Stelle den Messwert ein und pruefe, ob er innerhalb des Beispiel-Toleranzfelds liegt.
          </p>
        </div>
        <Badge variante={statusDaten.badge} symbol={statusDaten.symbol}>
          {statusDaten.label}
        </Badge>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg border border-border bg-bg-subtle">
        <svg
          viewBox="0 0 420 210"
          role="img"
          aria-labelledby={`${beschreibungId}-svg-title ${beschreibungId}-svg-desc`}
          className="h-auto w-full"
        >
          <title id={`${beschreibungId}-svg-title`}>Messschieber mit einstellbarem Nonius</title>
          <desc id={`${beschreibungId}-svg-desc`}>
            Der bewegliche Messschenkel steht bei {formatiereMillimeter(messwertMm)}.
          </desc>
          <rect x="24" y="88" width="350" height="24" rx="5" className="fill-surface stroke-border-strong" />
          <path d="M40 88 L40 28 L78 88 Z" className="fill-surface-raised stroke-border-strong" />
          <path d="M374 100 L408 100" className="stroke-border-strong" strokeWidth="4" strokeLinecap="round" />
          {erstelleTicks(11).map((tick) => (
            <g key={tick.index}>
              <path
                d={`M${48 + tick.index * 30} 88 L${48 + tick.index * 30} ${tick.index % 5 === 0 ? 62 : 72}`}
                className="stroke-fg-muted"
                strokeWidth="2"
              />
              {tick.index % 5 === 0 && (
                <text x={42 + tick.index * 30} y="55" className="fill-fg-muted text-[10px]">
                  {tick.index * 5}
                </text>
              )}
            </g>
          ))}
          <g transform={`translate(${position}, 0)`}>
            <path d="M0 88 L0 34 L36 88 Z" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
            <rect x="-18" y="111" width="92" height="44" rx="6" className="fill-primary-subtle stroke-primary" strokeWidth="2" />
            {erstelleTicks(6).map((tick) => (
              <path
                key={tick.index}
                d={`M${-4 + tick.index * 13} 155 L${-4 + tick.index * 13} ${tick.index % 2 === 0 ? 174 : 166}`}
                className="stroke-primary"
                strokeWidth="2"
              />
            ))}
            <text x="-13" y="140" className="fill-primary text-[11px] font-semibold">
              Nonius
            </text>
          </g>
          <text x="24" y="198" className="fill-fg-muted text-[11px]">
            Hauptskala in mm, vereinfachte Lernansicht
          </text>
          <text x="252" y="198" className="fill-fg text-[13px] font-bold">
            {formatiereMillimeter(messwertMm)}
          </text>
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-2 block text-caption font-semibold uppercase tracking-wide text-fg-muted">Messwert einstellen</span>
          <input
            type="range"
            min={minMm}
            max={maxMm}
            step={schrittMm}
            value={messwertMm}
            aria-describedby={`${beschreibungId} ${ergebnisId}`}
            aria-label="Messwert in Millimeter einstellen"
            className="h-12 w-full accent-primary"
            onChange={(event) => setzeMesswert(Number(event.currentTarget.value))}
          />
        </label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
          <Input
            inputMode="decimal"
            value={eingabe}
            aria-label="Messwert als Zahl in Millimeter"
            suffix="mm"
            onBlur={uebernehmeEingabe}
            onChange={(event) => setEingabe(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') uebernehmeEingabe();
            }}
          />
          <Button variante="sekundaer" className="min-h-touch min-w-touch px-3" onClick={() => setzeMesswert(messwertMm - schrittMm)}>
            -{schrittLabel}
          </Button>
          <Button variante="sekundaer" className="min-h-touch min-w-touch px-3" onClick={() => setzeMesswert(messwertMm + schrittMm)}>
            +{schrittLabel}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MesswertFakt label="Nennmass" wert={formatiereMillimeter(nennmassMm)} />
        <MesswertFakt label="Unteres Grenzmass" wert={formatiereMillimeter(unteresGrenzmass)} />
        <MesswertFakt label="Oberes Grenzmass" wert={formatiereMillimeter(oberesGrenzmass)} />
      </div>

      <div id={ergebnisId} role="status" aria-live="polite" className={cn('mt-4 rounded-lg border p-3 text-body-sm text-fg', statusDaten.box)}>
        <p className="font-bold">
          {formatiereMillimeter(messwertMm)}: {statusDaten.label}
        </p>
        <p className="mt-1 text-fg-muted">{statusDaten.hinweis}</p>
      </div>

      <p className="mt-3 text-caption text-fg-muted">{quellenHinweis}</p>
    </section>
  );
}

/**
 * Visualisiert Grenzmasse und trainiert die Gut-/Ausschuss-Entscheidung.
 */
export function InteraktivesToleranzfeld({
  titel = 'Interaktives Toleranzfeld',
  nennmassMm = 20,
  oberesAbmassMm = 0.1,
  unteresAbmassMm = -0.05,
  startIstmassMm = 20,
  schrittMm = 0.01,
  quellenHinweis = 'Uebungswerte aus der Beispielzeichnung. Reale Grenzwerte immer aus Zeichnung, Pruefplan oder Tabellenbuch uebernehmen.',
  className,
}: InteraktivesToleranzfeldProps) {
  validiereToleranzfeldKonfiguration(nennmassMm, unteresAbmassMm, oberesAbmassMm, schrittMm);

  const unteresGrenzmass = nennmassMm + unteresAbmassMm;
  const oberesGrenzmass = nennmassMm + oberesAbmassMm;
  const skalenMin = Number((unteresGrenzmass - 0.2).toFixed(2));
  const skalenMax = Number((oberesGrenzmass + 0.2).toFixed(2));
  const [istmassMm, setIstmassMm] = React.useState(normalisiereMesswert(startIstmassMm, skalenMin, skalenMax, schrittMm));
  const [entscheidung, setEntscheidung] = React.useState<MesswertStatus | null>(null);
  const beschreibungId = React.useId();
  const feedbackId = React.useId();
  const status = bewerteMesswert(istmassMm, unteresGrenzmass, oberesGrenzmass);
  const statusDaten = STATUS_DATEN[status];
  const entscheidungRichtig = entscheidung === null ? null : entscheidung === status;

  /**
   * Setzt das Istmass und leert eine alte Entscheidung, damit Feedback nicht veraltet.
   */
  function setzeIstmass(naechsterWert: number): void {
    setIstmassMm(normalisiereMesswert(naechsterWert, skalenMin, skalenMax, schrittMm));
    setEntscheidung(null);
  }

  return (
    <section
      className={cn('mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm', className)}
      aria-labelledby={`${beschreibungId}-titel`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${beschreibungId}-titel`} className="text-label font-bold text-fg">
            {titel}
          </h3>
          <p id={beschreibungId} className="mt-1 text-body-sm text-fg-muted">
            Verschiebe das Istmass und entscheide, ob das Werkstueck gut, zu klein oder zu gross ist.
          </p>
        </div>
        <Badge variante={statusDaten.badge} symbol={statusDaten.symbol}>
          {statusDaten.label}
        </Badge>
      </div>

      <div className="mb-4 rounded-lg border border-border bg-bg-subtle p-3">
        <svg
          viewBox="0 0 420 150"
          role="img"
          aria-labelledby={`${beschreibungId}-toleranz-title ${beschreibungId}-toleranz-desc`}
          className="h-auto w-full"
        >
          <title id={`${beschreibungId}-toleranz-title`}>Toleranzfeld mit Istmass</title>
          <desc id={`${beschreibungId}-toleranz-desc`}>
            Unteres Grenzmass {formatiereMillimeter(unteresGrenzmass)}, oberes Grenzmass {formatiereMillimeter(oberesGrenzmass)},
            Istmass {formatiereMillimeter(istmassMm)}.
          </desc>
          <line x1="32" y1="80" x2="388" y2="80" className="stroke-border-strong" strokeWidth="8" strokeLinecap="round" />
          <rect
            x={toleranzPosition(unteresGrenzmass, skalenMin, skalenMax)}
            y="68"
            width={Math.max(8, toleranzPosition(oberesGrenzmass, skalenMin, skalenMax) - toleranzPosition(unteresGrenzmass, skalenMin, skalenMax))}
            height="24"
            rx="6"
            className="fill-success-bg stroke-success"
          />
          <line x1={toleranzPosition(nennmassMm, skalenMin, skalenMax)} y1="46" x2={toleranzPosition(nennmassMm, skalenMin, skalenMax)} y2="114" className="stroke-primary" strokeWidth="2" />
          <line x1={toleranzPosition(istmassMm, skalenMin, skalenMax)} y1="34" x2={toleranzPosition(istmassMm, skalenMin, skalenMax)} y2="126" className="stroke-danger" strokeWidth="3" />
          <circle cx={toleranzPosition(istmassMm, skalenMin, skalenMax)} cy="80" r="9" className="fill-danger" />
          <text x="32" y="28" className="fill-fg-muted text-[10px]">
            UG {formatiereMillimeter(unteresGrenzmass)}
          </text>
          <text x="166" y="28" className="fill-primary text-[10px] font-semibold">
            Nennmass {formatiereMillimeter(nennmassMm)}
          </text>
          <text x="285" y="28" className="fill-fg-muted text-[10px]">
            OG {formatiereMillimeter(oberesGrenzmass)}
          </text>
          <text x="140" y="140" className="fill-fg text-[13px] font-bold">
            Istmass: {formatiereMillimeter(istmassMm)}
          </text>
        </svg>
      </div>

      <label className="block">
        <span className="mb-2 block text-caption font-semibold uppercase tracking-wide text-fg-muted">Istmass einstellen</span>
        <input
          type="range"
          min={skalenMin}
          max={skalenMax}
          step={schrittMm}
          value={istmassMm}
          aria-describedby={`${beschreibungId} ${feedbackId}`}
          aria-label="Istmass in Millimeter einstellen"
          className="h-12 w-full accent-primary"
          onChange={(event) => setzeIstmass(Number(event.currentTarget.value))}
        />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <MesswertFakt label="Istmass" wert={formatiereMillimeter(istmassMm)} />
        <MesswertFakt label="Unteres Grenzmass" wert={formatiereMillimeter(unteresGrenzmass)} />
        <MesswertFakt label="Nennmass" wert={formatiereMillimeter(nennmassMm)} />
        <MesswertFakt label="Oberes Grenzmass" wert={formatiereMillimeter(oberesGrenzmass)} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-fg-muted">Deine Entscheidung</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button variante="sekundaer" className="min-h-touch" onClick={() => setEntscheidung('zu_klein')}>
            Zu klein
          </Button>
          <Button variante="sekundaer" className="min-h-touch" onClick={() => setEntscheidung('in_toleranz')}>
            Gutteil
          </Button>
          <Button variante="sekundaer" className="min-h-touch" onClick={() => setEntscheidung('zu_gross')}>
            Zu gross
          </Button>
        </div>
      </div>

      <div
        id={feedbackId}
        role="status"
        aria-live="polite"
        className={cn(
          'mt-4 rounded-lg border p-3 text-body-sm text-fg',
          entscheidungRichtig === null
            ? 'border-info-border bg-info-bg/40'
            : entscheidungRichtig
              ? 'border-success-border bg-success-bg/45'
              : 'border-danger-border bg-danger-bg/45',
        )}
      >
        <p className="font-bold">
          {entscheidungRichtig === null ? 'Triff eine Entscheidung.' : entscheidungRichtig ? 'Richtig entschieden.' : 'Noch einmal pruefen.'}
        </p>
        <p className="mt-1 text-fg-muted">{statusDaten.hinweis}</p>
      </div>

      <p className="mt-3 text-caption text-fg-muted">{quellenHinweis}</p>
    </section>
  );
}

interface MesswertFaktProps {
  label: string;
  wert: string;
}

interface GlossarAbschnittProps {
  titel: string;
  text: string;
}

interface RollenFeedbackProps {
  feedbackId: string;
  istRichtig: boolean | null;
  gewaehlteRolle: string | null;
  richtigeRolle: string;
  begruendung: string;
}

/**
 * Rendert einen Abschnitt im Glossar-Drawer.
 */
function GlossarAbschnitt({ titel, text }: GlossarAbschnittProps) {
  return (
    <section className="rounded-md border border-border bg-bg-subtle p-3">
      <h5 className="text-caption font-semibold uppercase tracking-wide text-fg-muted">{titel}</h5>
      <p className="mt-1 leading-relaxed text-fg">{text}</p>
    </section>
  );
}

/**
 * Zeigt Feedback zur Rollenentscheidung.
 */
function RollenFeedback({ feedbackId, istRichtig, gewaehlteRolle, richtigeRolle, begruendung }: RollenFeedbackProps) {
  return (
    <div
      id={feedbackId}
      role="status"
      aria-live="polite"
      className={cn(
        'mt-4 rounded-lg border p-3 text-body-sm',
        istRichtig === null
          ? 'border-info-border bg-info-bg/40'
          : istRichtig
            ? 'border-success-border bg-success-bg/45'
            : 'border-danger-border bg-danger-bg/45',
      )}
    >
      <p className="font-bold">
        {istRichtig === null ? 'Waehle eine Rolle.' : istRichtig ? 'Richtig eingeordnet.' : 'Noch nicht passend.'}
      </p>
      <p className="mt-1 text-fg-muted">
        {istRichtig === null
          ? 'Entscheide, welche Aufgabe zuerst im Vordergrund steht.'
          : `${gewaehlteRolle ?? 'Auswahl'} gewaehlt. Passend ist: ${richtigeRolle}. ${begruendung}`}
      </p>
    </div>
  );
}

/**
 * Zeigt eine einzelne Rechengroesse der Messaufgabe.
 */
function MesswertFakt({ label, wert }: MesswertFaktProps) {
  return (
    <div className="rounded-md border border-border bg-bg-subtle p-3">
      <p className="text-caption font-semibold uppercase tracking-wide text-fg-muted">{label}</p>
      <p className="mt-1 font-mono text-body font-bold text-fg">{wert}</p>
    </div>
  );
}

/**
 * Bricht bei widerspruechlichen Messbereichs-Props explizit ab.
 */
function validiereMessschieberKonfiguration(
  min: number,
  max: number,
  schritt: number,
  nennmass: number,
  unteresAbmass: number,
  oberesAbmass: number,
): void {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    throw new Error('InteraktiverMessschieber braucht maxMm groesser als minMm.');
  }
  if (!Number.isFinite(schritt) || schritt <= 0) {
    throw new Error('InteraktiverMessschieber braucht eine positive Schrittweite.');
  }
  if (!Number.isFinite(nennmass) || !Number.isFinite(unteresAbmass) || !Number.isFinite(oberesAbmass)) {
    throw new Error('InteraktiverMessschieber braucht gueltige Nennmass- und Abmasswerte.');
  }
  if (nennmass + unteresAbmass > nennmass + oberesAbmass) {
    throw new Error('InteraktiverMessschieber braucht ein unteres Grenzmass kleiner/gleich oberem Grenzmass.');
  }
}

/**
 * Liefert Glossar-Text aus MDX-Props, Standardglossar oder Fallback.
 */
function holeBegriffInfo(begriff: string, definitionen: Record<string, Partial<FachbegriffInfo>>): FachbegriffInfo {
  const basis = STANDARD_GLOSSAR[begriff] ?? {
    fachdefinition: 'Definition ist noch offen und braucht fachliche Pflege.',
    einfach: 'Dieser Begriff wird spaeter in einfacher Sprache erklaert.',
    bezug: 'Der Bezug zur aktuellen Lerneinheit wird beim Ausbau des Glossars ergaenzt.',
  };
  return {
    fachdefinition: definitionen[begriff]?.fachdefinition ?? basis.fachdefinition,
    einfach: definitionen[begriff]?.einfach ?? basis.einfach,
    bezug: definitionen[begriff]?.bezug ?? basis.bezug,
  };
}

/**
 * Validiert Mini-Wissenscheck-Daten vor dem Rendern.
 */
function validiereMiniWissenscheck(id: string, fragen: MiniWissenscheckFrage[]): void {
  if (!/^[A-Za-z0-9:-]+$/.test(id)) {
    throw new Error('MiniWissenscheck braucht eine stabile ID.');
  }
  if (fragen.length === 0) {
    throw new Error('MiniWissenscheck braucht mindestens eine Frage.');
  }
  const masterySchluessel = new Set<string>();
  for (const frage of fragen) {
    if (!frage.id || !frage.masterySchluessel || !frage.aufgabenstellung) {
      throw new Error('MiniWissenscheck-Fragen brauchen ID, Mastery-Schluessel und Aufgabenstellung.');
    }
    if (masterySchluessel.has(frage.masterySchluessel)) {
      throw new Error('MiniWissenscheck-Fragen brauchen eindeutige Mastery-Schluessel.');
    }
    masterySchluessel.add(frage.masterySchluessel);
    if (frage.optionen.length < 2) {
      throw new Error('MiniWissenscheck-Fragen brauchen mindestens zwei Antwortoptionen.');
    }
    if (frage.optionen.filter((option) => option.istKorrekt).length !== 1) {
      throw new Error('MiniWissenscheck-Fragen brauchen genau eine richtige Antwortoption.');
    }
  }
}

/**
 * Liefert die aktuelle Mini-Wissenscheck-Frage oder bricht bei inkonsistentem State ab.
 */
function holeAktuelleMiniWissenscheckFrage(fragen: MiniWissenscheckFrage[], index: number): MiniWissenscheckFrage {
  const frage = fragen[index];
  if (!frage) {
    throw new Error('MiniWissenscheck konnte die aktuelle Frage nicht finden.');
  }
  return frage;
}

/**
 * Validiert die Toleranzfeld-Parameter vor der interaktiven Darstellung.
 */
function validiereToleranzfeldKonfiguration(nennmass: number, unteresAbmass: number, oberesAbmass: number, schritt: number): void {
  if (!Number.isFinite(nennmass) || !Number.isFinite(unteresAbmass) || !Number.isFinite(oberesAbmass)) {
    throw new Error('InteraktivesToleranzfeld braucht gueltige Nennmass- und Abmasswerte.');
  }
  if (nennmass + unteresAbmass > nennmass + oberesAbmass) {
    throw new Error('InteraktivesToleranzfeld braucht ein unteres Grenzmass kleiner/gleich oberem Grenzmass.');
  }
  if (!Number.isFinite(schritt) || schritt <= 0) {
    throw new Error('InteraktivesToleranzfeld braucht eine positive Schrittweite.');
  }
}

/**
 * Berechnet eine SVG-X-Position auf der Toleranzskala.
 */
function toleranzPosition(wert: number, min: number, max: number): number {
  if (max <= min) return 32;
  return 32 + ((wert - min) / (max - min)) * 356;
}

/**
 * Bewertet den eingestellten Messwert gegen die Grenzmasse.
 */
function bewerteMesswert(wert: number, unteresGrenzmass: number, oberesGrenzmass: number): MesswertStatus {
  if (wert < unteresGrenzmass) return 'zu_klein';
  if (wert > oberesGrenzmass) return 'zu_gross';
  return 'in_toleranz';
}

/**
 * Berechnet die horizontale Position des beweglichen Messschenkels im SVG.
 */
function berechnePosition(wert: number, min: number, max: number): number {
  if (max <= min) return 0;
  return 40 + ((wert - min) / (max - min)) * 270;
}

/**
 * Normalisiert einen Messwert auf Bereich und Schrittweite.
 */
function normalisiereMesswert(wert: number, min: number, max: number, schritt: number): number {
  const begrenzt = Math.min(max, Math.max(min, wert));
  const schritte = Math.round((begrenzt - min) / schritt);
  return Number((min + schritte * schritt).toFixed(2));
}

/**
 * Parst deutsche und englische Dezimalschreibweise ohne stillen Fallback.
 */
function parseMesswert(wert: string): number | null {
  const normalisiert = wert.trim().replace(',', '.');
  if (!normalisiert) return null;
  const zahl = Number(normalisiert);
  return Number.isFinite(zahl) ? zahl : null;
}

/**
 * Formatiert eine Zahl fuer ein Eingabefeld ohne Einheit.
 */
function formatiereZahl(wert: number): string {
  return wert.toFixed(2).replace('.', ',');
}

/**
 * Formatiert Millimeterwerte fuer sichtbare UI-Texte.
 */
function formatiereMillimeter(wert: number): string {
  return `${formatiereZahl(wert)} mm`;
}

/**
 * Erstellt stabile Tick-Objekte fuer SVG-Skalen.
 */
function erstelleTicks(anzahl: number): Array<{ index: number }> {
  return Array.from({ length: anzahl }, (_, index) => ({ index }));
}
