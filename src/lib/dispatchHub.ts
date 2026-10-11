// Maps a destination country to the regional hub that dispatches the order.
// Keep in sync with the "Where Your Order Ships From" section of ShippingPolicy.
const EU_UK = new Set([
  'GB','AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'CH','NO','IS','LI',
]);
const OCEANIA = new Set(['AU', 'NZ']);
const AMERICAS = new Set(['US','PR','CA','MX','BR','AR','CL','CO','PE','EC','UY','PY','CR','PA','SV','NI','DO','GT','HN','JM','BS']);
const VAT_GST = new Set([...EU_UK, 'AU']);

export type HubRegion = 'americas' | 'europe' | 'oceania' | 'other';

export const getHubRegion = (cc: string): HubRegion =>
  AMERICAS.has(cc) ? 'americas' : EU_UK.has(cc) ? 'europe' : OCEANIA.has(cc) ? 'oceania' : 'other';

export const getDispatchHub = (cc: string): string => {
  switch (getHubRegion(cc)) {
    case 'americas': return 'Miami, FL, USA';
    case 'europe': return 'Poland or Turkey hub';
    case 'oceania': return 'Thailand hub';
    default: return 'nearest regional hub (confirmed on invoice)';
  }
};

export const getDutiesNote = (cc: string): string => {
  if (cc === 'US') return 'Sales tax calculated from your ZIP code at checkout.';
  if (VAT_GST.has(cc)) return cc === 'AU' ? 'GST calculated at checkout.' : 'VAT calculated at checkout.';
  return 'No tax charged at checkout — import duties and taxes are payable on delivery.';
};

export const getRefrigerantCompliance = (cc: string): string | null => {
  if (cc === 'US' || cc === 'PR') return 'EPA Section 608 certification required.';
  if (EU_UK.has(cc)) return 'Valid F-Gas certification required.';
  if (cc === 'AU') return 'ARC licence (RTA/RHL) required.';
  if (cc === 'NZ') return 'EPA NZ import permit required for bulk gas.';
  return 'Import licence for your country required before freight is booked.';
};
