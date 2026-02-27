/**
 * Cannabis Legal Status by State (2026)
 * Source: DISA, Forbes, NORML - Updated February 2026
 */

export type LegalStatus = 
  | 'fully_legal'        // Recreational + Medical legal
  | 'medical_only'       // Medical only
  | 'cbd_only'           // CBD with THC only
  | 'decriminalized'     // Decriminalized but not legal
  | 'illegal';           // Fully illegal

export interface StateCompliance {
  name: string;
  abbreviation: string;
  legalStatus: LegalStatus;
  recreational: boolean;
  medical: boolean;
  decriminalized: boolean;
  minAge: number; // 21 for recreational, 18 for medical only
  notes?: string;
}

export const STATE_COMPLIANCE: Record<string, StateCompliance> = {
  AL: { name: 'Alabama', abbreviation: 'AL', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  AK: { name: 'Alaska', abbreviation: 'AK', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  AZ: { name: 'Arizona', abbreviation: 'AZ', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  AR: { name: 'Arkansas', abbreviation: 'AR', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  CA: { name: 'California', abbreviation: 'CA', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  CO: { name: 'Colorado', abbreviation: 'CO', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  CT: { name: 'Connecticut', abbreviation: 'CT', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  DE: { name: 'Delaware', abbreviation: 'DE', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  DC: { name: 'District of Columbia', abbreviation: 'DC', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  FL: { name: 'Florida', abbreviation: 'FL', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  GA: { name: 'Georgia', abbreviation: 'GA', legalStatus: 'cbd_only', recreational: false, medical: false, decriminalized: false, minAge: 18, notes: 'CBD oil only' },
  HI: { name: 'Hawaii', abbreviation: 'HI', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: true, minAge: 18 },
  ID: { name: 'Idaho', abbreviation: 'ID', legalStatus: 'illegal', recreational: false, medical: false, decriminalized: false, minAge: 21 },
  IL: { name: 'Illinois', abbreviation: 'IL', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  IN: { name: 'Indiana', abbreviation: 'IN', legalStatus: 'cbd_only', recreational: false, medical: false, decriminalized: false, minAge: 18, notes: 'CBD oil only' },
  IA: { name: 'Iowa', abbreviation: 'IA', legalStatus: 'cbd_only', recreational: false, medical: false, decriminalized: false, minAge: 18, notes: 'CBD oil only' },
  KS: { name: 'Kansas', abbreviation: 'KS', legalStatus: 'illegal', recreational: false, medical: false, decriminalized: false, minAge: 21 },
  KY: { name: 'Kentucky', abbreviation: 'KY', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  LA: { name: 'Louisiana', abbreviation: 'LA', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: true, minAge: 18 },
  ME: { name: 'Maine', abbreviation: 'ME', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  MD: { name: 'Maryland', abbreviation: 'MD', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  MA: { name: 'Massachusetts', abbreviation: 'MA', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  MI: { name: 'Michigan', abbreviation: 'MI', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  MN: { name: 'Minnesota', abbreviation: 'MN', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  MS: { name: 'Mississippi', abbreviation: 'MS', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: true, minAge: 18 },
  MO: { name: 'Missouri', abbreviation: 'MO', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  MT: { name: 'Montana', abbreviation: 'MT', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  NE: { name: 'Nebraska', abbreviation: 'NE', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: true, minAge: 18 },
  NV: { name: 'Nevada', abbreviation: 'NV', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  NH: { name: 'New Hampshire', abbreviation: 'NH', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: true, minAge: 18 },
  NJ: { name: 'New Jersey', abbreviation: 'NJ', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  NM: { name: 'New Mexico', abbreviation: 'NM', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  NY: { name: 'New York', abbreviation: 'NY', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  NC: { name: 'North Carolina', abbreviation: 'NC', legalStatus: 'decriminalized', recreational: false, medical: false, decriminalized: true, minAge: 21 },
  ND: { name: 'North Dakota', abbreviation: 'ND', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: true, minAge: 18 },
  OH: { name: 'Ohio', abbreviation: 'OH', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  OK: { name: 'Oklahoma', abbreviation: 'OK', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  OR: { name: 'Oregon', abbreviation: 'OR', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  PA: { name: 'Pennsylvania', abbreviation: 'PA', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  RI: { name: 'Rhode Island', abbreviation: 'RI', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  SC: { name: 'South Carolina', abbreviation: 'SC', legalStatus: 'illegal', recreational: false, medical: false, decriminalized: false, minAge: 21 },
  SD: { name: 'South Dakota', abbreviation: 'SD', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  TN: { name: 'Tennessee', abbreviation: 'TN', legalStatus: 'cbd_only', recreational: false, medical: false, decriminalized: false, minAge: 18, notes: 'CBD oil only' },
  TX: { name: 'Texas', abbreviation: 'TX', legalStatus: 'cbd_only', recreational: false, medical: false, decriminalized: false, minAge: 18, notes: 'CBD oil only' },
  UT: { name: 'Utah', abbreviation: 'UT', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  VT: { name: 'Vermont', abbreviation: 'VT', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  VA: { name: 'Virginia', abbreviation: 'VA', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  WA: { name: 'Washington', abbreviation: 'WA', legalStatus: 'fully_legal', recreational: true, medical: true, decriminalized: true, minAge: 21 },
  WV: { name: 'West Virginia', abbreviation: 'WV', legalStatus: 'medical_only', recreational: false, medical: true, decriminalized: false, minAge: 18 },
  WI: { name: 'Wisconsin', abbreviation: 'WI', legalStatus: 'cbd_only', recreational: false, medical: false, decriminalized: false, minAge: 18, notes: 'CBD oil only' },
  WY: { name: 'Wyoming', abbreviation: 'WY', legalStatus: 'illegal', recreational: false, medical: false, decriminalized: false, minAge: 21 },
};

/**
 * Get list of states where cannabis is legal (recreational or medical)
 */
export function getLegalStates(): string[] {
  return Object.keys(STATE_COMPLIANCE).filter(
    state => STATE_COMPLIANCE[state].legalStatus !== 'illegal'
  );
}

/**
 * Get list of states where recreational cannabis is legal
 */
export function getRecreationalStates(): string[] {
  return Object.keys(STATE_COMPLIANCE).filter(
    state => STATE_COMPLIANCE[state].recreational
  );
}

/**
 * Get list of states where medical cannabis is legal
 */
export function getMedicalStates(): string[] {
  return Object.keys(STATE_COMPLIANCE).filter(
    state => STATE_COMPLIANCE[state].medical
  );
}

/**
 * Check if cannabis is legal in a state
 */
export function isLegalInState(stateAbbr: string): boolean {
  const state = STATE_COMPLIANCE[stateAbbr.toUpperCase()];
  return state ? state.legalStatus !== 'illegal' : false;
}

/**
 * Check if recreational cannabis is legal in a state
 */
export function isRecreationalLegal(stateAbbr: string): boolean {
  const state = STATE_COMPLIANCE[stateAbbr.toUpperCase()];
  return state ? state.recreational : false;
}

/**
 * Get minimum age for cannabis purchase in a state
 */
export function getMinAge(stateAbbr: string): number {
  const state = STATE_COMPLIANCE[stateAbbr.toUpperCase()];
  return state ? state.minAge : 21;
}

/**
 * Get legal status display text
 */
export function getLegalStatusText(status: LegalStatus): string {
  switch (status) {
    case 'fully_legal':
      return 'Recreational & Medical Legal';
    case 'medical_only':
      return 'Medical Only';
    case 'cbd_only':
      return 'CBD Only';
    case 'decriminalized':
      return 'Decriminalized';
    case 'illegal':
      return 'Illegal';
  }
}
