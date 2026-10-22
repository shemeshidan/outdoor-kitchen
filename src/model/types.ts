export type ZoneId = 'right' | 'center' | 'island';

export type MemberKind = 'track' | 'stud' | 'girt' | 'beam' | 'blocking' | 'header' | 'sill' | 'strap';

/** Raw stock a member is cut from. */
export type Material = 'track' | 'stud' | 'strap';

export type TabKind = 'flat' | 'folded';

/** Axis-aligned box in cm. x = along the run from the zero point, y = depth from the front face, z = height. */
export interface Box {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}

export interface Member {
  id: string;
  zone: ZoneId;
  stage: number;
  kind: MemberKind;
  name: string;
  /** Net length from the plan, without tabs. */
  netLength: number;
  tabs: 0 | 1 | 2;
  tabKind: TabKind;
  /** Cut length stated explicitly in the plan; otherwise computed from tabs. */
  statedCut?: number;
  box: Box;
  /** Rotation in degrees within the x–z plane (diagonal straps). */
  tilt?: number;
  /** Second profile of a box beam; drawn as part of the member it pairs with. */
  pairOf?: string;
  /** Where the plan places it, in words. */
  location: string;
  sourcePage: number;
  /** Position derived from the drawing rather than a stated coordinate. */
  approximate?: boolean;
  /** The plan is ambiguous here; check against the source page before cutting. */
  needsCheck?: string;
}

export interface Stage {
  zone: ZoneId;
  number: number;
  title: string;
  sourcePage: number;
  notes: string[];
}

export interface SceneMarker {
  x: number;
  y: number;
  label: string;
}

export interface ZoneModel {
  id: ZoneId;
  label: string;
  summary: string;
  members: Member[];
  stages: Stage[];
  generalNotes: string[];
  extraItems: string[];
  markers: SceneMarker[];
}
