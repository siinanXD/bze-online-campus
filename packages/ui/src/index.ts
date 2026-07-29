/**
 * Oeffentliche Oberflaeche des Designsystems.
 * packages/ui bleibt frei von Fachlogik und Datenzugriff — hier wird
 * nichts aus app/ oder aus Supabase importiert.
 */

export { cn, variante } from './cn';

/* Primitives */
export { Button, IconButton } from './primitive/button';
export type {
  ButtonProps,
  IconButtonProps,
  ButtonVariante,
  ButtonGroesse,
} from './primitive/button';

export { Input, Textarea, Select, Checkbox, Radio } from './primitive/eingabe';
export type {
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
} from './primitive/eingabe';

export { Badge, Alert, Progress, Skeleton, Avatar } from './primitive/anzeige';
export type {
  BadgeProps,
  BadgeVariante,
  AlertProps,
  AlertVariante,
  ProgressProps,
  AvatarProps,
} from './primitive/anzeige';

export { Spinner } from './primitive/spinner';
export type { SpinnerProps, SpinnerGroesse } from './primitive/spinner';

export { Card, CardKopf, CardTitel, CardFuss } from './primitive/card';
export type { CardProps, CardVariante } from './primitive/card';

export { StatusBadge } from './primitive/status-badge';
export type { StatusBadgeProps, FrageStatus } from './primitive/status-badge';

export { ProgressRing } from './progress-ring';
export type { ProgressRingProps } from './progress-ring';

export { Chip } from './chip';

/* Muster */
export { Seitenkopf } from './muster/seitenkopf';
export type { SeitenkopfProps } from './muster/seitenkopf';

export { Formularfeld } from './muster/formularfeld';
export type { FormularfeldProps } from './muster/formularfeld';

export { LeerZustand, FehlerZustand, LadeZustand } from './muster/zustaende';
export type {
  LeerZustandProps,
  FehlerZustandProps,
  LadeZustandProps,
} from './muster/zustaende';

export { DatenTabelle } from './muster/daten-tabelle';
export type { DatenTabelleProps, Spalte } from './muster/daten-tabelle';

export { Modal, Bestaetigungsdialog } from './muster/modal';
export type { ModalProps, BestaetigungsdialogProps } from './muster/modal';

export { Suchfeld } from './muster/suchfeld';
export type { SuchfeldProps } from './muster/suchfeld';
