/**
 * Aadhaar Service - Format validation and simulated identity verification
 * 
 * IMPORTANT ARCHITECTURAL & ACCURACY RULES:
 * 1. A valid Verhoeff checksum format validation does NOT prove UIDAI existence or identity ownership.
 * 2. Never claim "Aadhaar verified with UIDAI" unless an authorized live UIDAI service is connected.
 * 3. In this prototype, identity verification is explicitly a "Mock Aadhaar Verification Service"
 *    labeled "Simulated verification for demonstration".
 * 4. Raw Aadhaar numbers must be masked in the UI and never exposed in logs or admin tables.
 */

// Verhoeff algorithm multiplication table 'd'
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Verhoeff algorithm permutation table 'p'
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

// Verhoeff inverse table 'inv'
const VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

export interface AadhaarFormatValidationResult {
  isValid: boolean;
  isLengthValid: boolean;
  isChecksumValid: boolean;
  error?: string;
  formatted: string;
  masked: string;
}

export type IdentityVerificationStatus = 
  | 'Not Started'
  | 'Format Valid'
  | 'Verification Pending'
  | 'Verified'
  | 'Information Mismatch'
  | 'Manual Review Requested';

export interface IdentityVerificationResult {
  status: IdentityVerificationStatus;
  isSimulated: true;
  sourceNotice: string;
  nameMatch: boolean;
  dobMatch: boolean;
  addressMatch: boolean;
  discrepancyMessage?: string;
  verifiedTimestamp?: string;
  canRequestManualReview: boolean;
}

export const aadhaarService = {
  /**
   * Evaluates if a given string satisfies the Verhoeff checksum.
   */
  validateVerhoeff(numStr: string): boolean {
    const clean = numStr.replace(/\D/g, '');
    if (!clean) return false;

    let c = 0;
    const reversed = clean.split('').reverse().map(Number);
    for (let i = 0; i < reversed.length; i++) {
      c = VERHOEFF_D[c][VERHOEFF_P[i % 8][reversed[i]]];
    }
    return c === 0;
  },

  /**
   * Computes the Verhoeff checksum digit for an 11-digit number string.
   */
  generateVerhoeffCheckDigit(numStr: string): number {
    const clean = numStr.replace(/\D/g, '');
    let c = 0;
    const reversed = clean.split('').reverse().map(Number);
    for (let i = 0; i < reversed.length; i++) {
      c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][reversed[i]]];
    }
    return VERHOEFF_INV[c];
  },

  /**
   * Generates a sample valid 12-digit Aadhaar for testing/demo purposes.
   */
  getSampleValidAadhaar(): string {
    const prefix = '89241038592';
    const checkDigit = this.generateVerhoeffCheckDigit(prefix);
    return `${prefix}${checkDigit}`; // 8924 1038 5928
  },

  /**
   * Validates the 12-digit format and Verhoeff checksum.
   * NOTE: A valid checksum does NOT mean UIDAI has verified identity.
   */
  validateFormat(input: string): AadhaarFormatValidationResult {
    const clean = input.replace(/[\s-]/g, '');

    // Check for alphabetic or illegal characters
    if (/[^\d]/.test(clean)) {
      return {
        isValid: false,
        isLengthValid: false,
        isChecksumValid: false,
        error: 'Aadhaar number must contain digits only (0-9).',
        formatted: input,
        masked: 'XXXX-XXXX-XXXX'
      };
    }

    if (clean.length !== 12) {
      return {
        isValid: false,
        isLengthValid: false,
        isChecksumValid: false,
        error: `Aadhaar must be exactly 12 digits (currently ${clean.length}).`,
        formatted: this.formatAadhaar(clean),
        masked: this.maskAadhaar(clean)
      };
    }

    // First digit cannot be 0 or 1 under UIDAI numbering norms
    if (clean.startsWith('0') || clean.startsWith('1')) {
      return {
        isValid: false,
        isLengthValid: true,
        isChecksumValid: false,
        error: 'Aadhaar number cannot start with 0 or 1.',
        formatted: this.formatAadhaar(clean),
        masked: this.maskAadhaar(clean)
      };
    }

    // Check Verhoeff checksum
    const isChecksumValid = this.validateVerhoeff(clean);
    if (!isChecksumValid) {
      return {
        isValid: false,
        isLengthValid: true,
        isChecksumValid: false,
        error: 'Invalid Aadhaar checksum (Verhoeff validation failed). Please recheck the digits.',
        formatted: this.formatAadhaar(clean),
        masked: this.maskAadhaar(clean)
      };
    }

    return {
      isValid: true,
      isLengthValid: true,
      isChecksumValid: true,
      formatted: this.formatAadhaar(clean),
      masked: this.maskAadhaar(clean)
    };
  },

  /**
   * Formats 12 digits into 4-digit grouped display: 8924 1038 5928
   */
  formatAadhaar(cleanDigits: string): string {
    const digits = cleanDigits.replace(/\D/g, '').slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  },

  /**
   * Masks Aadhaar for safe presentation across all UI screens: XXXX-XXXX-5928
   */
  maskAadhaar(rawOrFormatted: string): string {
    const digits = rawOrFormatted.replace(/\D/g, '');
    if (digits.length < 4) return 'XXXX-XXXX-XXXX';
    const last4 = digits.slice(-4);
    return `XXXX-XXXX-${last4}`;
  },

  /**
   * Mock Identity Verification Service.
   * Clearly labeled as simulated for demonstration.
   */
  async verifyIdentity(params: {
    aadhaarNumber: string;
    fullName: string;
    dateOfBirth?: string;
    state?: string;
  }): Promise<IdentityVerificationResult> {
    // Simulate API network hop
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const formatCheck = this.validateFormat(params.aadhaarNumber);
    if (!formatCheck.isValid) {
      return {
        status: 'Information Mismatch',
        isSimulated: true,
        sourceNotice: 'Simulated verification for demonstration (Mock Identity Service)',
        nameMatch: false,
        dobMatch: false,
        addressMatch: false,
        discrepancyMessage: formatCheck.error || 'Aadhaar format validation failed.',
        canRequestManualReview: true
      };
    }

    // For demonstration, if name has fewer than 3 characters, simulate mismatch
    const nameValid = params.fullName.trim().length >= 3;

    if (!nameValid) {
      return {
        status: 'Information Mismatch',
        isSimulated: true,
        sourceNotice: 'Simulated verification for demonstration (Mock Identity Service)',
        nameMatch: false,
        dobMatch: true,
        addressMatch: true,
        discrepancyMessage: 'Submitted full name has low phonetic similarity to mock identity record.',
        canRequestManualReview: true
      };
    }

    return {
      status: 'Verified',
      isSimulated: true,
      sourceNotice: 'Simulated verification for demonstration (Mock Identity Service)',
      nameMatch: true,
      dobMatch: true,
      addressMatch: true,
      verifiedTimestamp: new Date().toISOString(),
      canRequestManualReview: false
    };
  }
};
