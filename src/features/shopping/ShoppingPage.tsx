import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Card, MessageBar, MessageBarBody, Radio, RadioGroup, Text, Title2 } from '@fluentui/react-components';
import { ZoneTabs } from '../../components/ZoneTabs';
import { materialLabels, materialOf, packBars, totalLength, type Material } from '../../model';
import { currentZone } from '../../lib/progress';
import type { PreferencesProps, StockLength } from '../../types/kitchen-plan';

const stockOptions: StockLength[] = [300, 400, 600];

export function ShoppingPage({ preferences, setPreferences }: PreferencesProps) {
  const zone = currentZone(preferences);
  const materials = (['track', 'stud'] as Material[]).filter((material) => zone.members.some((member) => materialOf(member) === material));
  const straps = zone.members.filter((member) => materialOf(member) === 'strap');

  return (
    <div className="page-content">
      <div className="page-title-row">
        <div><span className="eyebrow">מחושב מרשימת החיתוך</span><Title2>{zone.label} · רשימת קניות</Title2></div>
        <ZoneTabs selectedZone={preferences.selectedZone} onSelect={(selectedZone) => setPreferences((previous) => ({ ...previous, selectedZone }))} />
      </div>

      <Card className="parts-card" appearance="outline">
        <div className="parts-toolbar">
          <Text weight="semibold">אורך פרופיל בחנות</Text>
          <RadioGroup layout="horizontal" value={String(preferences.stockLength)}
            onChange={(_, data) => setPreferences((previous) => ({ ...previous, stockLength: Number(data.value) as StockLength }))}>
            {stockOptions.map((option) => <Radio key={option} value={String(option)} label={`${option / 100} מ׳`} />)}
          </RadioGroup>
        </div>

        <div className="shopping-grid">
          {materials.map((material) => {
            const members = zone.members.filter((member) => materialOf(member) === material);
            const { bars, tooLong } = packBars(members, preferences.stockLength);
            const waste = bars.reduce((sum, bar) => sum + bar.waste, 0);
            return (
              <section key={material} className="shopping-item">
                <span className="shopping-label">{materialLabels[material]}</span>
                <strong className="shopping-count">{bars.length} <small>יח׳ של {preferences.stockLength / 100} מ׳</small></strong>
                <span className="muted">{members.length} חיתוכים · {(totalLength(members) / 100).toFixed(1)} מ׳ נטו לחיתוך · פחת {(waste / 100).toFixed(1)} מ׳</span>
                {tooLong.length > 0 && <MessageBar intent="error"><MessageBarBody>{tooLong.length} חיתוכים ארוכים מהפרופיל שבחרת.</MessageBarBody></MessageBar>}
                <Accordion collapsible>
                  <AccordionItem value="plan">
                    <AccordionHeader size="small">תכנית חיתוך לפי פרופיל</AccordionHeader>
                    <AccordionPanel>
                      <ol className="bar-list">
                        {bars.map((bar, index) => (
                          <li key={index}>
                            <div className="bar-visual" aria-hidden="true">
                              {bar.cuts.map((item, cutIndex) => <span key={cutIndex} style={{ flexBasis: `${(item.cut / preferences.stockLength) * 100}%` }} />)}
                            </div>
                            <span dir="ltr">{bar.cuts.map((item) => item.cut).join(' + ')}</span>
                            <small> · נשאר {bar.waste}</small>
                          </li>
                        ))}
                      </ol>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </section>
            );
          })}
          {straps.length > 0 && (
            <section className="shopping-item">
              <span className="shopping-label">{materialLabels.strap}</span>
              <strong className="shopping-count">{(totalLength(straps) / 100).toFixed(1)} <small>מ׳ (נמכר בגליל)</small></strong>
              <span className="muted">{straps.length} פסים באלכסון: {[...new Set(straps.map((strap) => strap.netLength))].join(', ')}</span>
            </section>
          )}
        </div>

        <div className="extra-items">
          <Text weight="semibold">פריטים נוספים מהתכנית</Text>
          <ul>{zone.extraItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="parts-note">
          <Text>
            הנחות בחישוב: קורות עשויות מפרופיל ניצב, וחגורות, חוסמים, משקופים וספים עשויים מפרופיל מסילה. כל קופסה נספרת כשני חיתוכים – מסילה וניצב בתוכה. בין חיתוך לחיתוך נלקחים 3 מ״מ לניסור.
            {' '}כדאי לקנות פרופיל אחד או שניים נוספים לכל סוג, למקרה של טעות בחיתוך.
          </Text>
        </div>
      </Card>
    </div>
  );
}
