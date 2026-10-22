import { Badge, Button, Card, Checkbox, MessageBar, MessageBarBody, Text } from '@fluentui/react-components';
import { DismissRegular, RulerRegular } from '@fluentui/react-icons';
import { cutLength, formatCm, kindLabels, materialLabels, materialOf, tabLength, type Member } from '../../model';
import { SourceLink } from '../../components/SourceLink';
import { setFlags } from '../../lib/progress';
import type { PreferencesProps } from '../../types/kitchen-plan';

interface MemberInspectorProps extends PreferencesProps {
  member: Member | null;
}

export function MemberInspector({ member, preferences, setPreferences }: MemberInspectorProps) {
  if (!member) {
    return (
      <Card className="inspector-card" appearance="outline">
        <div className="inspector-title"><RulerRegular /><div><Text weight="semibold">פרופיל נבחר</Text><span>לחץ על פרופיל במודל או ברשימה כדי לראות את המידות שלו.</span></div></div>
      </Card>
    );
  }

  const cut = cutLength(member);
  const tabsText = member.statedCut !== undefined
    ? 'אורך החיתוך כתוב בתכנית'
    : member.tabs === 0
      ? 'בלי לשוניות'
      : `${member.tabs} לשוניות ${member.tabKind === 'flat' ? 'שטוחות' : 'מקופלות'} × ${tabLength[member.tabKind]}`;

  return (
    <Card className="inspector-card" appearance="outline">
      <div className="inspector-title">
        <RulerRegular />
        <div><Text weight="semibold">{member.name}</Text><span>{kindLabels[member.kind]} · {materialLabels[materialOf(member)]} · שלב {member.stage}</span></div>
        <Button className="inspector-close" appearance="subtle" size="small" icon={<DismissRegular />} aria-label="ביטול הבחירה"
          onClick={() => setPreferences((previous) => ({ ...previous, selectedMemberId: null }))} />
      </div>
      <div className="measurement-grid">
        <div className="measurement-block"><span>אורך נטו</span><strong>{formatCm(member.netLength)}</strong></div>
        <div className="measurement-block measurement-cut"><span>אורך חיתוך</span><strong>{formatCm(cut)}</strong><small>{tabsText}</small></div>
      </div>
      <div className="source-detail"><span>מיקום</span><strong>{member.location}</strong></div>
      <div className="source-detail"><span>מקור</span><strong><SourceLink page={member.sourcePage} />{member.approximate && <Badge appearance="tint" color="informative" className="inline-badge">מיקום משוער בתצוגה</Badge>}</strong></div>
      {member.needsCheck && <MessageBar intent="warning"><MessageBarBody>{member.needsCheck}</MessageBarBody></MessageBar>}
      <div className="inspector-checks">
        <Checkbox label="נחתך" checked={Boolean(preferences.cut[member.id])}
          onChange={(_, data) => setPreferences((previous) => ({ ...previous, cut: setFlags(previous.cut, [member.id], Boolean(data.checked)) }))} />
        <Checkbox label="הותקן" checked={Boolean(preferences.built[member.id])}
          onChange={(_, data) => setPreferences((previous) => ({ ...previous, built: setFlags(previous.built, [member.id], Boolean(data.checked)) }))} />
      </div>
    </Card>
  );
}
