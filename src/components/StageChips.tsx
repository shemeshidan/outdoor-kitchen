import { ToggleButton } from '@fluentui/react-components';
import type { Stage } from '../model';

interface StageChipsProps {
  stages: Stage[];
  value: number | null;
  onChange: (stage: number | null) => void;
}

export function StageChips({ stages, value, onChange }: StageChipsProps) {
  return (
    <div className="stage-chips" role="group" aria-label="שלב בנייה">
      <ToggleButton size="small" checked={value === null} onClick={() => onChange(null)}>הכול</ToggleButton>
      {stages.map((stage) => (
        <ToggleButton key={stage.number} size="small" checked={value === stage.number} onClick={() => onChange(stage.number)} title={stage.title}>
          שלב {stage.number}
        </ToggleButton>
      ))}
    </div>
  );
}
