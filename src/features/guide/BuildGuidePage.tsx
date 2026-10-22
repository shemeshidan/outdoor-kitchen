import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, Card, Checkbox, ProgressBar, Text, Title2 } from '@fluentui/react-components';
import { CubeRegular, WarningRegular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { ZoneTabs } from '../../components/ZoneTabs';
import { SourceLink } from '../../components/SourceLink';
import { cutLength } from '../../model';
import { countFlagged, currentZone, setFlags } from '../../lib/progress';
import type { PreferencesProps } from '../../types/kitchen-plan';

export function BuildGuidePage({ preferences, setPreferences }: PreferencesProps) {
  const navigate = useNavigate();
  const zone = currentZone(preferences);
  const builtTotal = countFlagged(zone.members, preferences.built);

  function showInModel(stage: number, memberId: string | null = null) {
    setPreferences((previous) => ({ ...previous, stage, selectedMemberId: memberId }));
    navigate('/');
  }

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div><span className="eyebrow">שלב אחרי שלב, לפי התכנית</span><Title2>{zone.label} · שלבי בנייה</Title2></div>
        <ZoneTabs selectedZone={preferences.selectedZone} onSelect={(selectedZone) => setPreferences((previous) => ({ ...previous, selectedZone }))} />
      </div>

      <Card className="progress-card" appearance="outline">
        <div className="progress-head"><Text weight="semibold">התקדמות</Text><Text>{builtTotal} מתוך {zone.members.length} פרופילים הותקנו</Text></div>
        <ProgressBar value={zone.members.length ? builtTotal / zone.members.length : 0} thickness="large" />
      </Card>

      <Card className="guide-card" appearance="outline">
        <div className="general-notes"><Text weight="semibold">לפני שמתחילים</Text><ul>{zone.generalNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
        <Accordion collapsible multiple defaultOpenItems={[String(preferences.stage ?? 1)]}>
          {zone.stages.map((stage) => {
            const members = zone.members.filter((member) => member.stage === stage.number);
            const built = countFlagged(members, preferences.built);
            const complete = members.length > 0 && built === members.length;
            return (
              <AccordionItem key={stage.number} value={String(stage.number)}>
                <AccordionHeader size="large">
                  <span className="stage-header">
                    <span className={complete ? 'stage-number stage-number-done' : 'stage-number'}>{stage.number}</span>
                    <span>{stage.title}</span>
                    {members.length > 0 && <span className="stage-count">{built}/{members.length}</span>}
                  </span>
                </AccordionHeader>
                <AccordionPanel>
                  <div className="stage-panel">
                    <ul className="stage-note-list">{stage.notes.map((note) => <li key={note}>{note}</li>)}</ul>
                    <div className="stage-actions">
                      <Button appearance="primary" icon={<CubeRegular />} onClick={() => showInModel(stage.number)}>הצגת השלב במודל</Button>
                      <SourceLink page={stage.sourcePage} />
                      {members.length > 0 && (
                        <Button appearance="subtle" onClick={() => setPreferences((previous) => ({ ...previous, built: setFlags(previous.built, members.map((member) => member.id), !complete) }))}>
                          {complete ? 'ביטול סימון השלב' : 'סימון כל השלב כהותקן'}
                        </Button>
                      )}
                    </div>
                    {members.length > 0 && (
                      <ul className="check-list">
                        {members.map((member) => (
                          <li key={member.id}>
                            <Checkbox checked={Boolean(preferences.built[member.id])} aria-label={`${member.name} הותקן`}
                              onChange={(_, data) => setPreferences((previous) => ({ ...previous, built: setFlags(previous.built, [member.id], Boolean(data.checked)) }))} />
                            <button type="button" className="check-list-name" onClick={() => showInModel(stage.number, member.id)}>
                              {member.name}{member.needsCheck && <WarningRegular className="member-row-warning" aria-label="לאמת" />}
                              <small>{member.location}</small>
                            </button>
                            <span className="check-list-length" dir="ltr">{member.netLength}<small> / {cutLength(member)}</small></span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </div>
  );
}
