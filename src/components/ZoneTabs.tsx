import { Tab, TabList } from '@fluentui/react-components';
import { zoneModels, zones, type ZoneId } from '../model';

interface ZoneTabsProps {
  selectedZone: ZoneId;
  onSelect: (zoneId: ZoneId) => void;
}

export function ZoneTabs({ selectedZone, onSelect }: ZoneTabsProps) {
  return (
    <TabList
      aria-label="אזור במטבח"
      selectedValue={selectedZone}
      onTabSelect={(_, data) => onSelect(data.value as ZoneId)}
      className="zone-tabs"
    >
      {zones.map((zone) => {
        const ready = Boolean(zoneModels[zone.id]);
        return (
          <Tab key={zone.id} value={zone.id} disabled={!ready}>
            {zone.label}{!ready && <span className="tab-soon"> · בקרוב</span>}
          </Tab>
        );
      })}
    </TabList>
  );
}
