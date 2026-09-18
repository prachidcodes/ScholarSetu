/**
 * DigiLocker Service Adapter (Simulated / Prototype Layer)
 * 
 * IMPORTANT ACCURACY RULE:
 * This service implements a simulated DigiLocker connection for hackathon demonstration.
 * It is clearly labeled as "Simulated DigiLocker Connection" and does NOT claim live API authorization.
 * The architecture uses standard adapter patterns so that production OAuth 2.0 / DigiLocker
 * REST endpoints can be plugged in seamlessly in the future.
 */

import { StudentDocument } from '../types';

export interface DigiLockerAvailableDoc {
  id: string;
  name: string;
  category: 'identity' | 'caste' | 'income' | 'academic' | 'banking';
  issuer: string;
  issueDate: string;
  documentNumber: string;
  uri: string;
  isImported: boolean;
}

export interface DigiLockerConnectionStatus {
  isConnected: boolean;
  isSimulated: true;
  consentGiven: boolean;
  connectedAadhaarMasked?: string;
  lastSyncedAt?: string;
  availableCount: number;
}

const STORAGE_KEY_DIGILOCKER_CONNECTED = 'scholarsetu_digilocker_status';

const SAMPLE_ISSUED_DOCS: DigiLockerAvailableDoc[] = [
  {
    id: 'dl-st-cert',
    name: 'Scheduled Tribe Certificate',
    category: 'caste',
    issuer: 'e-District Revenue Administration, Govt. of Jharkhand',
    issueDate: '12 Jan 2024',
    documentNumber: 'JH-ST-2024-998241',
    uri: 'in.gov.jharkhand.edistrict.caste.998241',
    isImported: true
  },
  {
    id: 'dl-aadhaar',
    name: 'Aadhaar Card (Digital Demographic Extract)',
    category: 'identity',
    issuer: 'Unique Identification Authority of India (UIDAI)',
    issueDate: '04 Mar 2022',
    documentNumber: 'XXXX-XXXX-5928',
    uri: 'in.gov.uidai.aadhaar.5928',
    isImported: true
  },
  {
    id: 'dl-marksheet-12',
    name: 'Class XII Passing Certificate & Marksheet',
    category: 'academic',
    issuer: 'Jharkhand Academic Council (JAC), Ranchi',
    issueDate: '28 May 2022',
    documentNumber: 'JAC-2022-881920',
    uri: 'in.gov.jac.marksheet12.881920',
    isImported: true
  },
  {
    id: 'dl-income',
    name: 'Income Certificate (FY 2024-25)',
    category: 'income',
    issuer: 'Circle Officer, Ranchi Sadar',
    issueDate: '15 Jul 2024',
    documentNumber: 'INC-2024-441209',
    uri: 'in.gov.jharkhand.edistrict.income.441209',
    isImported: false
  },
  {
    id: 'dl-bank',
    name: 'Bank Account Seeding & Passbook Proof',
    category: 'banking',
    issuer: 'State Bank of India (PFMS Aadhaar Seeded)',
    issueDate: '10 Feb 2024',
    documentNumber: 'SBI-DBT-4092',
    uri: 'in.co.sbi.account.4092',
    isImported: true
  }
];

export const digilockerService = {
  /**
   * Retrieves the current simulated connection status.
   */
  getConnectionStatus(): DigiLockerConnectionStatus {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DIGILOCKER_CONNECTED);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    // Default prototype state: simulated connected state
    const defaultStatus: DigiLockerConnectionStatus = {
      isConnected: true,
      isSimulated: true,
      consentGiven: true,
      connectedAadhaarMasked: 'XXXX-XXXX-5928',
      lastSyncedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      availableCount: SAMPLE_ISSUED_DOCS.length
    };
    return defaultStatus;
  },

  /**
   * Connects simulated DigiLocker with consent.
   */
  async connectWithConsent(aadhaarMasked: string = 'XXXX-XXXX-5928'): Promise<DigiLockerConnectionStatus> {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const status: DigiLockerConnectionStatus = {
      isConnected: true,
      isSimulated: true,
      consentGiven: true,
      connectedAadhaarMasked: aadhaarMasked,
      lastSyncedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      availableCount: SAMPLE_ISSUED_DOCS.length
    };

    localStorage.setItem(STORAGE_KEY_DIGILOCKER_CONNECTED, JSON.stringify(status));
    return status;
  },

  /**
   * Disconnects simulated session.
   */
  async disconnect(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const status: DigiLockerConnectionStatus = {
      isConnected: false,
      isSimulated: true,
      consentGiven: false,
      availableCount: 0
    };
    localStorage.setItem(STORAGE_KEY_DIGILOCKER_CONNECTED, JSON.stringify(status));
    return true;
  },

  /**
   * Retrieves available government-issued documents from the simulated DigiLocker account.
   */
  async getAvailableDocuments(): Promise<DigiLockerAvailableDoc[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return SAMPLE_ISSUED_DOCS;
  },

  /**
   * Imports a specific document into ScholarSetu's Document Wallet.
   */
  async importDocument(docId: string, userId: string): Promise<StudentDocument> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const found = SAMPLE_ISSUED_DOCS.find((d) => d.id === docId);
    if (!found) {
      throw new Error('Requested document not found in simulated DigiLocker vault.');
    }

    const importedDoc: StudentDocument = {
      id: `imported-${docId}-${Date.now()}`,
      userId,
      type: (found.category === 'caste' ? 'caste_certificate' : found.category === 'identity' ? 'aadhaar' : found.category === 'income' ? 'income_certificate' : found.category === 'academic' ? 'marksheet' : 'bank_passbook') as any,
      title: found.name,
      documentNumber: found.documentNumber,
      issuingAuthority: found.issuer,
      fileName: `${found.name.toLowerCase().replace(/\s+/g, '_')}_verified.pdf`,
      fileSize: '412 KB',
      uploadedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Verified',
      verifiedSource: `Simulated DigiLocker: ${found.issuer}`,
      hashChecksum: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
    };

    return importedDoc;
  }
};
