import { useState } from 'react';
import { Card, Checkbox, Dropdown, Option, Text, Title2 } from '@fluentui/react-components';
import { WarningRegular } from '@fluentui/react-icons';
import { ZoneTabs } from '../../components/ZoneTabs';
import { groupCuts, kindLabels, materialLabels, tabLength, type CutGroup, type Material } from '../../model';
import { countFlagged, currentZone, setFlags } from '../../lib/progress';
import type { PreferencesProps } from '../../types/kitchen-plan';

export function CutListPage({ preferences, setPreferences }: PreferencesProps) {
  const zone = currentZone(preferences);
  const [stageFilter, setStageFilter] = useState<number | null>(null);
  const members = zone.members.filter((member) => stageFilter === null || member.stage === stageFilter);
  const groups = groupCuts(members);
  const cutCount = countFlagged(members, preferences.cut);
  const materials: Material[] = ['track', 'stud', 'strap'];

  const tabsOf = (group: CutGroup) => {
    const first = group.members[0];
    if (!first || first.statedCut !== undefined) return 'לפי התכנית';
    if (first.tabs === 0) return '—';
    return `${first.tabs} × ${tabLength[first.tabKind]}`;
  };

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div><span className="eyebrow">אורכי חיתוך כולל לשוניות</span><Title2>{zone.label} · רשימת חיתוך</Title2></div>
        <ZoneTabs selectedZone={preferences.selectedZone} onSelect={(selectedZone) => setPreferences((previous) => ({ ...previous, selectedZone }))} />
      </div>

      <Card className="parts-card" appearance="outline">
        <div className="parts-toolbar">
          <Text>{cutCount} מתוך {members.length} חיתוכים בוצעו</Text>
          <Dropdown aria-label="סינון לפי שלב" value={stageFilter === null ? 'כל השלבים' : `שלב ${stageFilter}`}
            selectedOptions={[String(stageFilter ?? 'all')]}
            onOptionSelect={(_, data) => setStageFilter(data.optionValue === 'all' ? null : Number(data.optionValue))}>
            <Option value="all">כל השלבים</Option>
            {zone.stages.filter((stage) => zone.members.some((member) => member.stage === stage.number)).map((stage) => (
              <Option key={stage.number} value={String(stage.number)} text={`שלב ${stage.number}`}>שלב {stage.number} · {stage.title}</Option>
            ))}
          </Dropdown>
        </div>
        {materials.map((material) => {
          const rows = groups.filter((group) => group.material === material);
          if (rows.length === 0) return null;
          return (
            <section key={material} className="cut-section">
              <h3>{materialLabels[material]}</h3>
              <div className="table-scroll">
                <table className="cut-table">
                  <thead><tr><th>בוצע</th><th>אורך חיתוך</th><th>כמות</th><th>נטו</th><th>לשוניות</th><th>סוג</th></tr></thead>
                  <tbody>
                    {rows.map((group) => {
                      const ids = group.members.map((member) => member.id);
                      const done = countFlagged(group.members, preferences.cut);
                      const warn = group.members.some((member) => member.needsCheck);
                      return (
                        <tr key={`${group.kind}-${group.cut}-${group.net}`} className={done === ids.length ? 'cut-row-done' : undefined}>
                          <td>
                            <Checkbox aria-label={`חיתוך ${group.cut} בוצע`} checked={done === 0 ? false : done === ids.length ? true : 'mixed'}
                              onChange={() => setPreferences((previous) => ({ ...previous, cut: setFlags(previous.cut, ids, done !== ids.length) }))} />
                          </td>
                          <td className="cut-length" dir="ltr">{group.cut}</td>
                          <td className="cut-qty">× {group.members.length}</td>
                          <td dir="ltr">{group.net}</td>
                          <td dir="ltr">{tabsOf(group)}</td>
                          <td>{kindLabels[group.kind]}{warn && <WarningRegular className="member-row-warning" aria-label="יש פריט לאימות" />}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
        <div className="parts-note"><Text>כל המידות בס״מ. אורכי הניצבים לפי התכנית – בגלל שיפוע הרצפה, למדוד כל ניצב במקום לפני החיתוך. <WarningRegular className="member-row-warning" /> = פריט שצריך לאמת מול התכנית.</Text></div>
      </Card>
    </div>
  );
}
