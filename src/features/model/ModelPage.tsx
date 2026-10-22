import { lazy, Suspense, useRef, useState } from 'react';
import { Button, Card, Spinner, Switch, Text, Title2 } from '@fluentui/react-components';
import { ArrowCounterclockwiseRegular, CheckmarkCircleFilled, WarningRegular } from '@fluentui/react-icons';
import { ZoneTabs } from '../../components/ZoneTabs';
import { StageChips } from '../../components/StageChips';
import { SourceLink } from '../../components/SourceLink';
import { SceneErrorBoundary } from '../../components/SceneErrorBoundary';
import { cutLength, kindLabels } from '../../model';
import { currentZone } from '../../lib/progress';
import type { PreferencesProps } from '../../types/kitchen-plan';
import { MemberInspector } from './MemberInspector';
import { kindColors } from './colors';

const KitchenScene = lazy(() => import('./KitchenScene'));

export function ModelPage({ preferences, setPreferences }: PreferencesProps) {
  const zone = currentZone(preferences);
  const [showLabels, setShowLabels] = useState(true);
  const [viewKey, setViewKey] = useState(0);
  const labelLayer = useRef<HTMLDivElement>(null);
  const stage = zone.stages.find((candidate) => candidate.number === preferences.stage) ?? null;
  const selected = zone.members.find((member) => member.id === preferences.selectedMemberId) ?? null;
  const listed = zone.members.filter((member) => stage === null || member.stage === stage.number);

  const select = (id: string) => setPreferences((previous) => ({ ...previous, selectedMemberId: previous.selectedMemberId === id ? null : id }));

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div><span className="eyebrow">{zone.summary}</span><Title2>{zone.label} · מודל השלד</Title2></div>
        <ZoneTabs selectedZone={preferences.selectedZone} onSelect={(selectedZone) => setPreferences((previous) => ({ ...previous, selectedZone, selectedMemberId: null, stage: null }))} />
      </div>

      <div className="map-layout">
        <Card className="workspace-card" appearance="outline">
          <div className="model-toolbar">
            <StageChips stages={zone.stages} value={preferences.stage}
              onChange={(value) => setPreferences((previous) => ({ ...previous, stage: value }))} />
            <div className="model-tools">
              <Switch checked={showLabels} onChange={(_, data) => setShowLabels(data.checked)} label="מידות" />
              <Button appearance="subtle" icon={<ArrowCounterclockwiseRegular />} onClick={() => setViewKey((key) => key + 1)}>איפוס מבט</Button>
            </div>
          </div>
          <div className="scene-frame">
            <SceneErrorBoundary>
              <Suspense fallback={<div className="scene-state"><Spinner label="טוען את המודל…" /></div>}>
                <KitchenScene key={viewKey} zone={zone} stage={preferences.stage} selectedId={preferences.selectedMemberId} showLabels={showLabels} onSelect={select} labelLayer={labelLayer} />
              </Suspense>
            </SceneErrorBoundary>
            <div className="scene-labels" ref={labelLayer} aria-hidden="true" />
          </div>
          <div className="scene-legend">
            {(Object.keys(kindColors) as (keyof typeof kindColors)[]).filter((kind) => kind !== 'sill' && zone.members.some((member) => member.kind === kind)).map((kind) => (
              <span key={kind}><i style={{ background: kindColors[kind] }} />{kind === 'header' ? 'משקוף / סף' : kindLabels[kind]}</span>
            ))}
            <span className="scene-hint">גרירה לסיבוב · צביטה או גלגלת לזום · לחיצה על פרופיל לבחירה</span>
          </div>
          {stage && (
            <div className="stage-notes">
              <div className="stage-notes-title"><Text weight="semibold">שלב {stage.number} · {stage.title}</Text><SourceLink page={stage.sourcePage} /></div>
              <ul>{stage.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            </div>
          )}
        </Card>

        <aside className="inspector-column" aria-label="פרטי הפרופיל הנבחר">
          <MemberInspector member={selected} preferences={preferences} setPreferences={setPreferences} />
          <Card className="member-list-card" appearance="outline">
            <Text weight="semibold">{stage ? `פרופילים בשלב ${stage.number}` : 'כל הפרופילים'} ({listed.length})</Text>
            {listed.length === 0
              ? <Text size={200} className="muted">בשלב הזה אין פרופילים לחיתוך – רק הוראות.</Text>
              : (
                <ul className="member-list">
                  {listed.map((member) => (
                    <li key={member.id}>
                      <button type="button" className={member.id === selected?.id ? 'member-row member-row-selected' : 'member-row'} onClick={() => select(member.id)}>
                        <i style={{ background: kindColors[member.kind] }} />
                        <span className="member-row-name">{member.name}</span>
                        {member.needsCheck && <WarningRegular className="member-row-warning" aria-label="לאמת" />}
                        {preferences.built[member.id] && <CheckmarkCircleFilled className="member-row-done" aria-label="הותקן" />}
                        <span className="member-row-length" dir="ltr">{member.netLength}<small> / {cutLength(member)}</small></span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            <Text size={100} className="muted">נטו / חיתוך, בס״מ</Text>
          </Card>
        </aside>
      </div>
    </div>
  );
}
