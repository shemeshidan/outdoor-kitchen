import type { MemberKind } from '../../model';

// Kept apart from KitchenScene so pages can use the legend without loading three.js.
export const kindColors: Record<MemberKind, string> = {
  track: '#3b9ad9',
  stud: '#a3aeb5',
  girt: '#4fae6e',
  beam: '#cdb57a',
  blocking: '#e8892f',
  header: '#2f7fbf',
  sill: '#2f7fbf',
  strap: '#b4532a',
};
