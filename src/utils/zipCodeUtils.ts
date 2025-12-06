/**
 * ZIP Code to State Mapping Utility
 * Maps US ZIP code prefixes to their corresponding states
 * Based on USPS ZIP code ranges
 */

interface StateInfo {
  stateCode: string;
  stateName: string;
}

// ZIP code prefix ranges mapped to states
// Format: [startPrefix, endPrefix, stateCode, stateName]
const ZIP_RANGES: [number, number, string, string][] = [
  // Eastern States
  [1, 2, 'MA', 'Massachusetts'],
  [3, 4, 'RI', 'Rhode Island'],
  [5, 5, 'NH', 'New Hampshire'],
  [6, 6, 'ME', 'Maine'],
  [7, 9, 'VT', 'Vermont'],
  [10, 14, 'NY', 'New York'],
  [15, 19, 'PA', 'Pennsylvania'],
  [20, 20, 'DC', 'District of Columbia'],
  [21, 21, 'MD', 'Maryland'],
  [22, 24, 'VA', 'Virginia'],
  [25, 26, 'WV', 'West Virginia'],
  [27, 28, 'NC', 'North Carolina'],
  [29, 29, 'SC', 'South Carolina'],
  [30, 31, 'GA', 'Georgia'],
  [32, 34, 'FL', 'Florida'],
  [35, 36, 'AL', 'Alabama'],
  [37, 38, 'TN', 'Tennessee'],
  [39, 39, 'MS', 'Mississippi'],
  [40, 42, 'KY', 'Kentucky'],
  [43, 45, 'OH', 'Ohio'],
  [46, 47, 'IN', 'Indiana'],
  [48, 49, 'MI', 'Michigan'],
  [50, 52, 'IA', 'Iowa'],
  [53, 54, 'WI', 'Wisconsin'],
  [55, 56, 'MN', 'Minnesota'],
  [57, 57, 'SD', 'South Dakota'],
  [58, 58, 'ND', 'North Dakota'],
  [59, 59, 'MT', 'Montana'],
  [60, 62, 'IL', 'Illinois'],
  [63, 65, 'MO', 'Missouri'],
  [66, 67, 'KS', 'Kansas'],
  [68, 69, 'NE', 'Nebraska'],
  [70, 71, 'LA', 'Louisiana'],
  [72, 72, 'AR', 'Arkansas'],
  [73, 74, 'OK', 'Oklahoma'],
  [75, 79, 'TX', 'Texas'],
  [80, 81, 'CO', 'Colorado'],
  [82, 83, 'WY', 'Wyoming'],
  [84, 84, 'UT', 'Utah'],
  [85, 86, 'AZ', 'Arizona'],
  [87, 88, 'NM', 'New Mexico'],
  [89, 89, 'NV', 'Nevada'],
  [90, 96, 'CA', 'California'],
  [97, 97, 'OR', 'Oregon'],
  [98, 99, 'WA', 'Washington'],
  // Special cases
  [967, 968, 'HI', 'Hawaii'],
  [995, 999, 'AK', 'Alaska'],
  // Territories
  [6, 9, 'PR', 'Puerto Rico'], // 006-009
  [8, 8, 'VI', 'U.S. Virgin Islands'], // 008
];

// More precise 3-digit prefix mapping for edge cases
const ZIP_PREFIX_3_MAP: Record<string, StateInfo> = {
  // Hawaii
  '967': { stateCode: 'HI', stateName: 'Hawaii' },
  '968': { stateCode: 'HI', stateName: 'Hawaii' },
  // Alaska
  '995': { stateCode: 'AK', stateName: 'Alaska' },
  '996': { stateCode: 'AK', stateName: 'Alaska' },
  '997': { stateCode: 'AK', stateName: 'Alaska' },
  '998': { stateCode: 'AK', stateName: 'Alaska' },
  '999': { stateCode: 'AK', stateName: 'Alaska' },
  // Puerto Rico
  '006': { stateCode: 'PR', stateName: 'Puerto Rico' },
  '007': { stateCode: 'PR', stateName: 'Puerto Rico' },
  '009': { stateCode: 'PR', stateName: 'Puerto Rico' },
  // Virgin Islands
  '008': { stateCode: 'VI', stateName: 'U.S. Virgin Islands' },
  // Guam, American Samoa
  '969': { stateCode: 'GU', stateName: 'Guam' },
  // DC specific
  '200': { stateCode: 'DC', stateName: 'District of Columbia' },
  '202': { stateCode: 'DC', stateName: 'District of Columbia' },
  '203': { stateCode: 'DC', stateName: 'District of Columbia' },
  '204': { stateCode: 'DC', stateName: 'District of Columbia' },
  '205': { stateCode: 'DC', stateName: 'District of Columbia' },
  // Maryland vs DC edge cases
  '206': { stateCode: 'MD', stateName: 'Maryland' },
  '207': { stateCode: 'MD', stateName: 'Maryland' },
  '208': { stateCode: 'MD', stateName: 'Maryland' },
  '209': { stateCode: 'MD', stateName: 'Maryland' },
  '210': { stateCode: 'MD', stateName: 'Maryland' },
  '211': { stateCode: 'MD', stateName: 'Maryland' },
  '212': { stateCode: 'MD', stateName: 'Maryland' },
  '214': { stateCode: 'MD', stateName: 'Maryland' },
  '215': { stateCode: 'MD', stateName: 'Maryland' },
  '216': { stateCode: 'MD', stateName: 'Maryland' },
  '217': { stateCode: 'MD', stateName: 'Maryland' },
  '218': { stateCode: 'MD', stateName: 'Maryland' },
  '219': { stateCode: 'MD', stateName: 'Maryland' },
};

// Comprehensive 2-digit prefix mapping for reliable fallback
const ZIP_PREFIX_2_MAP: Record<string, StateInfo> = {
  '00': { stateCode: 'PR', stateName: 'Puerto Rico' },
  '01': { stateCode: 'MA', stateName: 'Massachusetts' },
  '02': { stateCode: 'MA', stateName: 'Massachusetts' },
  '03': { stateCode: 'NH', stateName: 'New Hampshire' },
  '04': { stateCode: 'ME', stateName: 'Maine' },
  '05': { stateCode: 'VT', stateName: 'Vermont' },
  '06': { stateCode: 'CT', stateName: 'Connecticut' },
  '07': { stateCode: 'NJ', stateName: 'New Jersey' },
  '08': { stateCode: 'NJ', stateName: 'New Jersey' },
  '10': { stateCode: 'NY', stateName: 'New York' },
  '11': { stateCode: 'NY', stateName: 'New York' },
  '12': { stateCode: 'NY', stateName: 'New York' },
  '13': { stateCode: 'NY', stateName: 'New York' },
  '14': { stateCode: 'NY', stateName: 'New York' },
  '15': { stateCode: 'PA', stateName: 'Pennsylvania' },
  '16': { stateCode: 'PA', stateName: 'Pennsylvania' },
  '17': { stateCode: 'PA', stateName: 'Pennsylvania' },
  '18': { stateCode: 'PA', stateName: 'Pennsylvania' },
  '19': { stateCode: 'PA', stateName: 'Pennsylvania' },
  '20': { stateCode: 'DC', stateName: 'District of Columbia' },
  '21': { stateCode: 'MD', stateName: 'Maryland' },
  '22': { stateCode: 'VA', stateName: 'Virginia' },
  '23': { stateCode: 'VA', stateName: 'Virginia' },
  '24': { stateCode: 'VA', stateName: 'Virginia' },
  '25': { stateCode: 'WV', stateName: 'West Virginia' },
  '26': { stateCode: 'WV', stateName: 'West Virginia' },
  '27': { stateCode: 'NC', stateName: 'North Carolina' },
  '28': { stateCode: 'NC', stateName: 'North Carolina' },
  '29': { stateCode: 'SC', stateName: 'South Carolina' },
  '30': { stateCode: 'GA', stateName: 'Georgia' },
  '31': { stateCode: 'GA', stateName: 'Georgia' },
  '32': { stateCode: 'FL', stateName: 'Florida' },
  '33': { stateCode: 'FL', stateName: 'Florida' },
  '34': { stateCode: 'FL', stateName: 'Florida' },
  '35': { stateCode: 'AL', stateName: 'Alabama' },
  '36': { stateCode: 'AL', stateName: 'Alabama' },
  '37': { stateCode: 'TN', stateName: 'Tennessee' },
  '38': { stateCode: 'TN', stateName: 'Tennessee' },
  '39': { stateCode: 'MS', stateName: 'Mississippi' },
  '40': { stateCode: 'KY', stateName: 'Kentucky' },
  '41': { stateCode: 'KY', stateName: 'Kentucky' },
  '42': { stateCode: 'KY', stateName: 'Kentucky' },
  '43': { stateCode: 'OH', stateName: 'Ohio' },
  '44': { stateCode: 'OH', stateName: 'Ohio' },
  '45': { stateCode: 'OH', stateName: 'Ohio' },
  '46': { stateCode: 'IN', stateName: 'Indiana' },
  '47': { stateCode: 'IN', stateName: 'Indiana' },
  '48': { stateCode: 'MI', stateName: 'Michigan' },
  '49': { stateCode: 'MI', stateName: 'Michigan' },
  '50': { stateCode: 'IA', stateName: 'Iowa' },
  '51': { stateCode: 'IA', stateName: 'Iowa' },
  '52': { stateCode: 'IA', stateName: 'Iowa' },
  '53': { stateCode: 'WI', stateName: 'Wisconsin' },
  '54': { stateCode: 'WI', stateName: 'Wisconsin' },
  '55': { stateCode: 'MN', stateName: 'Minnesota' },
  '56': { stateCode: 'MN', stateName: 'Minnesota' },
  '57': { stateCode: 'SD', stateName: 'South Dakota' },
  '58': { stateCode: 'ND', stateName: 'North Dakota' },
  '59': { stateCode: 'MT', stateName: 'Montana' },
  '60': { stateCode: 'IL', stateName: 'Illinois' },
  '61': { stateCode: 'IL', stateName: 'Illinois' },
  '62': { stateCode: 'IL', stateName: 'Illinois' },
  '63': { stateCode: 'MO', stateName: 'Missouri' },
  '64': { stateCode: 'MO', stateName: 'Missouri' },
  '65': { stateCode: 'MO', stateName: 'Missouri' },
  '66': { stateCode: 'KS', stateName: 'Kansas' },
  '67': { stateCode: 'KS', stateName: 'Kansas' },
  '68': { stateCode: 'NE', stateName: 'Nebraska' },
  '69': { stateCode: 'NE', stateName: 'Nebraska' },
  '70': { stateCode: 'LA', stateName: 'Louisiana' },
  '71': { stateCode: 'LA', stateName: 'Louisiana' },
  '72': { stateCode: 'AR', stateName: 'Arkansas' },
  '73': { stateCode: 'OK', stateName: 'Oklahoma' },
  '74': { stateCode: 'OK', stateName: 'Oklahoma' },
  '75': { stateCode: 'TX', stateName: 'Texas' },
  '76': { stateCode: 'TX', stateName: 'Texas' },
  '77': { stateCode: 'TX', stateName: 'Texas' },
  '78': { stateCode: 'TX', stateName: 'Texas' },
  '79': { stateCode: 'TX', stateName: 'Texas' },
  '80': { stateCode: 'CO', stateName: 'Colorado' },
  '81': { stateCode: 'CO', stateName: 'Colorado' },
  '82': { stateCode: 'WY', stateName: 'Wyoming' },
  '83': { stateCode: 'ID', stateName: 'Idaho' },
  '84': { stateCode: 'UT', stateName: 'Utah' },
  '85': { stateCode: 'AZ', stateName: 'Arizona' },
  '86': { stateCode: 'AZ', stateName: 'Arizona' },
  '87': { stateCode: 'NM', stateName: 'New Mexico' },
  '88': { stateCode: 'NM', stateName: 'New Mexico' },
  '89': { stateCode: 'NV', stateName: 'Nevada' },
  '90': { stateCode: 'CA', stateName: 'California' },
  '91': { stateCode: 'CA', stateName: 'California' },
  '92': { stateCode: 'CA', stateName: 'California' },
  '93': { stateCode: 'CA', stateName: 'California' },
  '94': { stateCode: 'CA', stateName: 'California' },
  '95': { stateCode: 'CA', stateName: 'California' },
  '96': { stateCode: 'CA', stateName: 'California' },
  '97': { stateCode: 'OR', stateName: 'Oregon' },
  '98': { stateCode: 'WA', stateName: 'Washington' },
  '99': { stateCode: 'WA', stateName: 'Washington' },
};

/**
 * Validates if a string is a valid US ZIP code format
 * @param zipCode - The ZIP code to validate
 * @returns boolean indicating if the ZIP code is valid
 */
export const isValidZipCode = (zipCode: string): boolean => {
  if (!zipCode) return false;
  const cleaned = zipCode.replace(/\s/g, '').replace(/-.*$/, ''); // Remove spaces and ZIP+4
  return /^\d{5}$/.test(cleaned);
};

/**
 * Gets the state information from a US ZIP code
 * @param zipCode - The ZIP code (5 digits or ZIP+4 format)
 * @returns StateInfo object with stateCode and stateName, or null if invalid
 */
export const getStateFromZip = (zipCode: string): StateInfo | null => {
  if (!zipCode) return null;
  
  // Clean the ZIP code - remove spaces and take first 5 digits
  const cleaned = zipCode.replace(/\s/g, '').replace(/-.*$/, '');
  
  if (!/^\d{5}$/.test(cleaned)) {
    return null;
  }
  
  const prefix3 = cleaned.substring(0, 3);
  const prefix2 = cleaned.substring(0, 2);
  
  // Check 3-digit prefix first for special cases (Hawaii, Alaska, DC, territories)
  if (ZIP_PREFIX_3_MAP[prefix3]) {
    return ZIP_PREFIX_3_MAP[prefix3];
  }
  
  // Fall back to 2-digit prefix mapping
  if (ZIP_PREFIX_2_MAP[prefix2]) {
    return ZIP_PREFIX_2_MAP[prefix2];
  }
  
  return null;
};

/**
 * Gets just the state code from a ZIP code
 * @param zipCode - The ZIP code
 * @returns 2-letter state code or null if invalid
 */
export const getStateCodeFromZip = (zipCode: string): string | null => {
  const stateInfo = getStateFromZip(zipCode);
  return stateInfo?.stateCode || null;
};

/**
 * Gets just the state name from a ZIP code
 * @param zipCode - The ZIP code
 * @returns Full state name or null if invalid
 */
export const getStateNameFromZip = (zipCode: string): string | null => {
  const stateInfo = getStateFromZip(zipCode);
  return stateInfo?.stateName || null;
};

/**
 * Formats a ZIP code to standard format
 * @param zipCode - The ZIP code to format
 * @returns Formatted ZIP code (5 digits) or original if invalid
 */
export const formatZipCode = (zipCode: string): string => {
  if (!zipCode) return '';
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length >= 5) {
    return cleaned.substring(0, 5);
  }
  return cleaned;
};

// Export a list of all US states for dropdowns
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'GU', name: 'Guam' },
  { code: 'VI', name: 'U.S. Virgin Islands' },
];
