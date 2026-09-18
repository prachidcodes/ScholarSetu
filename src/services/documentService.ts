import { StudentDocument, DocumentStatus, DocumentType } from '../types';
import { INITIAL_DOCUMENTS } from '../data/mockData';

const DOCUMENTS_STORAGE_KEY = 'scholarsetu_documents';

export const documentService = {
  getDocuments(userId?: string): StudentDocument[] {
    try {
      const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      if (stored) {
        const parsed: StudentDocument[] = JSON.parse(stored);
        if (userId) {
          return parsed.filter((d) => d.userId === userId);
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    // Initialize default documents
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
    return INITIAL_DOCUMENTS;
  },

  getDocumentById(id: string): StudentDocument | undefined {
    const docs = this.getDocuments();
    return docs.find((d) => d.id === id);
  },

  async uploadDocument(
    userId: string,
    file: File,
    type: DocumentType,
    title: string,
    issuingAuthority: string,
    documentNumber?: string
  ): Promise<StudentDocument> {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    const newDoc: StudentDocument = {
      id: `doc-${Date.now()}`,
      userId,
      type,
      title,
      documentNumber: documentNumber || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      issuingAuthority,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Verifying'
    };

    const currentDocs = this.getDocuments();
    // If replacing document of same type
    const updatedDocs = [newDoc, ...currentDocs];
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocs));

    // Simulate automated background verification after 2.5 seconds
    setTimeout(() => {
      const docs = this.getDocuments();
      const target = docs.find((d) => d.id === newDoc.id);
      if (target) {
        target.status = 'Verified';
        target.verifiedSource = 'Automated State Document Registry';
        localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));
      }
    }, 2500);

    return newDoc;
  },

  async syncWithDigiLocker(
    userId: string,
    onStepChange?: (step: 'connecting' | 'fetching' | 'cross-checking' | 'completed') => void
  ): Promise<StudentDocument[]> {
    if (onStepChange) onStepChange('connecting');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (onStepChange) onStepChange('fetching');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (onStepChange) onStepChange('cross-checking');
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Restore or ensure verified state for core documents
    const existing = this.getDocuments(userId);
    const updated = existing.map((doc) => {
      if (doc.type === 'aadhaar' || doc.type === 'caste_certificate' || doc.type === 'marksheet') {
        return {
          ...doc,
          status: 'Verified' as DocumentStatus,
          verifiedSource: 'DigiLocker Certified Gateway'
        };
      }
      return doc;
    });

    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
    if (onStepChange) onStepChange('completed');
    return updated;
  },

  updateDocumentStatus(id: string, status: DocumentStatus, verifiedSource?: string, mismatchReason?: string): void {
    const docs = this.getDocuments();
    const updated = docs.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status,
          verifiedSource: verifiedSource || d.verifiedSource,
          mismatchReason: mismatchReason || d.mismatchReason
        };
      }
      return d;
    });
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updated));
  }
};
