import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderLock, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Download, 
  Eye, 
  Trash2, 
  ExternalLink,
  Loader2,
  Sparkles,
  Check,
  Building2,
  Lock,
  ArrowDownToLine,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StudentDocument } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';
import { digilockerService, DigiLockerAvailableDoc, DigiLockerConnectionStatus } from '../../services/digilockerService';

export const DocumentsPage: React.FC = () => {
  const { documents, syncWithDigiLocker, uploadDocument } = useApp();
  const { user } = useAuth();

  // DigiLocker Connection Status State
  const [digilockerStatus, setDigilockerStatus] = useState<DigiLockerConnectionStatus>(() => 
    digilockerService.getConnectionStatus()
  );
  const [availableDigiDocs, setAvailableDigiDocs] = useState<DigiLockerAvailableDoc[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportingDocId, setIsImportingDocId] = useState<string | null>(null);

  // DigiLocker Simulation Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStepText, setSyncStepText] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<any>('income_certificate');
  const [docTitle, setDocTitle] = useState('');
  const [issuingAuth, setIssuingAuth] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState<StudentDocument | null>(null);

  useEffect(() => {
    digilockerService.getAvailableDocuments().then((docs) => {
      setAvailableDigiDocs(docs);
    });
  }, []);

  // Connect or Reconnect simulated DigiLocker
  const handleToggleDigiLockerConnection = async () => {
    if (digilockerStatus.isConnected) {
      await digilockerService.disconnect();
      setDigilockerStatus(digilockerService.getConnectionStatus());
    } else {
      setIsSyncing(true);
      setSyncStepText('Requesting student e-KYC consent for DigiLocker...');
      await new Promise((r) => setTimeout(r, 600));
      setSyncStepText('Fetching signed cryptographic documents...');
      const updated = await digilockerService.connectWithConsent(user?.aadhaarNumber || 'XXXX-XXXX-5928');
      setDigilockerStatus(updated);
      setIsSyncing(false);
    }
  };

  // Trigger DigiLocker Simulated Flow
  const handleDigiLockerSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      await syncWithDigiLocker((step) => {
        setSyncStepText(step);
      });
      const updatedStatus = await digilockerService.connectWithConsent(user?.aadhaarNumber || 'XXXX-XXXX-5928');
      setDigilockerStatus(updatedStatus);
      setSyncSuccess(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportSingleDoc = async (docId: string) => {
    setIsImportingDocId(docId);
    try {
      const imported = await digilockerService.importDocument(docId, user?.id || 'usr-st-1');
      // Create a mock File and upload to app state
      const mockFile = new File(['%PDF-1.4 Simulated Govt Certificate Data'], imported.fileName, { type: 'application/pdf' });
      await uploadDocument(mockFile, imported.type, imported.title, imported.issuingAuthority);
      
      // Update local available state
      setAvailableDigiDocs((prev) => 
        prev.map((d) => (d.id === docId ? { ...d, isImported: true } : d))
      );
    } finally {
      setIsImportingDocId(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await uploadDocument(
        selectedFile,
        selectedDocType,
        docTitle || selectedFile.name,
        issuingAuth || 'District Authority'
      );
      setIsUploadOpen(false);
      setSelectedFile(null);
      setDocTitle('');
      setIssuingAuth('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
            <FolderLock className="w-4 h-4" />
            <span>Digital Document Wallet</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cryptographic Certificate Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Centralized document vault for Scheduled Tribe scholarship applications. Stored documents are reused across all 5 Ministry schemes without repetitive paper submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<UploadCloud className="w-4 h-4 text-teal-800" />}
            onClick={() => setIsUploadOpen(true)}
          >
            Upload Certificate
          </Button>

          <Button
            variant="saffron"
            size="sm"
            isLoading={isSyncing}
            leftIcon={<RefreshCw className={`w-4 h-4 text-white ${isSyncing ? 'animate-spin' : ''}`} />}
            onClick={handleDigiLockerSync}
          >
            {isSyncing ? 'Syncing...' : 'Sync with DigiLocker'}
          </Button>
        </div>
      </div>

      {/* Simulated DigiLocker Integration Card (Requirement #14 & #15) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white border border-teal-700/60 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Simulated DigiLocker Connection
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                digilockerStatus.isConnected ? 'text-emerald-300' : 'text-slate-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  digilockerStatus.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`} />
                {digilockerStatus.isConnected ? 'Connected & Consented' : 'Disconnected'}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              National Digital Locker Adapter
            </h3>
            <p className="text-xs text-teal-100/90 max-w-2xl leading-relaxed">
              Demonstrating the adapter pattern for seamless one-click import of verified government records (ST Certificate, Class XII Marksheet, UIDAI e-Aadhaar).
            </p>
            {digilockerStatus.isConnected && (
              <div className="flex items-center gap-4 text-[11px] text-teal-200 pt-1">
                <span>Aadhaar Link: <strong>{digilockerStatus.connectedAadhaarMasked}</strong></span>
                <span>•</span>
                <span>Last Synced: <strong>{digilockerStatus.lastSyncedAt}</strong></span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
              onClick={() => setIsImportModalOpen(true)}
              leftIcon={<ArrowDownToLine className="w-3.5 h-3.5" />}
            >
              Browse DigiLocker Vault ({availableDigiDocs.length})
            </Button>

            <button
              onClick={handleToggleDigiLockerConnection}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-teal-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              {digilockerStatus.isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* DigiLocker Simulation Visual Progress Indicator */}
      {isSyncing && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 animate-in fade-in flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-amber-700 animate-spin shrink-0" />
          <div className="text-xs text-amber-950 flex-1">
            <div className="font-bold flex items-center gap-2">
              <span>DigiLocker Secure Handshake in Progress</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">
                DEMO ADAPTER
              </span>
            </div>
            <p className="mt-0.5 text-amber-800 font-mono">{syncStepText || 'Connecting to UIDAI and state portals...'}</p>
          </div>
        </div>
      )}

      {syncSuccess && !isSyncing && (
        <Alert type="success" title="DigiLocker Synchronization Complete">
          All certificates have been validated with digital signatures and state gazette records. SHA-256 checksums are recorded in your wallet.
        </Alert>
      )}

      {/* Notice Banner */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-900">Prototype Demo Notice:</strong> DigiLocker interactions shown here utilize simulated service adapters for hackathon demonstration. In production, this connects via OAuth 2.0 to the National Information Centre (NIC) DigiLocker API to import digitally signed PDFs and metadata XML.
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <Card key={doc.id} className="flex flex-col h-full hover:border-teal-700/50 transition-all">
            <CardBody className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge
                    variant={doc.status === 'Verified' ? 'success' : doc.status === 'Pending' ? 'warning' : 'neutral'}
                    size="sm"
                    dot
                  >
                    {doc.status}
                  </Badge>
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issued by: <strong className="text-slate-700">{doc.issuingAuthority}</strong>
                </p>

                {doc.verifiedSource && (
                  <div className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200/60">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Source: {doc.verifiedSource}</span>
                  </div>
                )}
              </div>

              {/* Metadata & Checksum */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Uploaded/Synced:</span>
                  <span className="font-medium text-slate-700">{doc.uploadedAt}</span>
                </div>
                {doc.hashChecksum && (
                  <div className="flex justify-between">
                    <span>Checksum:</span>
                    <span className="font-mono text-slate-600 truncate max-w-[120px]">{doc.hashChecksum}</span>
                  </div>
                )}
              </div>
            </CardBody>

            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingDoc(doc)}
                className="flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-900 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Certificate</span>
              </button>

              <button
                onClick={() => {
                  setSelectedDocType(doc.type);
                  setDocTitle(doc.title);
                  setIsUploadOpen(true);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Replace
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* DigiLocker Available Documents Modal (Requirement #14 & #15) */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="DigiLocker Issued Documents Vault (Simulated)"
        subtitle="Government records linked to your Aadhaar extract"
        footer={
          <div className="flex items-center justify-between w-full text-xs">
            <span className="text-slate-500">Simulated for demonstration</span>
            <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            The following official documents were located in your simulated DigiLocker account. Click import to add any missing certificates into your active scholarship wallet.
          </p>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {availableDigiDocs.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{d.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200 text-slate-700">
                      {d.category.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{d.issuer}</p>
                  <p className="text-[10px] font-mono text-slate-400">Doc No: {d.documentNumber} • Date: {d.issueDate}</p>
                </div>

                <div className="shrink-0">
                  {d.isImported ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      In Wallet
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isImportingDocId === d.id}
                      onClick={() => handleImportSingleDoc(d.id)}
                      leftIcon={<ArrowDownToLine className="w-3.5 h-3.5" />}
                    >
                      Import
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload or Update Certificate"
        subtitle="Supported formats: PDF, JPG, PNG (Max 5MB)"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isUploading}
              disabled={!selectedFile}
              onClick={handleFileUploadSubmit}
            >
              Upload & Cross-Verify
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFileUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Category *
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
            >
              <option value="caste_certificate">Scheduled Tribe (ST) Caste Certificate</option>
              <option value="income_certificate">Family Income Certificate (Revenue Dept)</option>
              <option value="marksheet">Academic Marksheet / Degree Certificate</option>
              <option value="bank_passbook">Aadhaar Seeded Bank Passbook</option>
              <option value="aadhaar_card">Aadhaar Card (UIDAI)</option>
              <option value="other">Other Supporting Affidavit / Bonafide</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Certificate Title / Number *
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Annual Income Certificate (JH/REV/2024/7712)"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issuing Authority *
            </label>
            <input
              type="text"
              value={issuingAuth}
              onChange={(e) => setIssuingAuth(e.target.value)}
              placeholder="e.g. Sub-Divisional Magistrate / Tahsildar Ranchi"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select or Drag File *
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-700 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition-colors"
            >
              <UploadCloud className="w-8 h-8 mx-auto text-teal-800 mb-2" />
              {selectedFile ? (
                <div>
                  <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag and drop certificate here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PDF, JPG, PNG up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <Modal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          title={viewingDoc.title}
          subtitle={`Issued by: ${viewingDoc.issuingAuthority}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-mono text-slate-500">
                Checksum: {viewingDoc.hashChecksum || 'SHA256: 8F9B...'}
              </span>
              <Button variant="outline" size="sm" onClick={() => setViewingDoc(null)}>
                Close Preview
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Simulated Government Digital Certificate Preview */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-300 font-serif text-center space-y-4 relative overflow-hidden">
              <div className="border-b border-slate-300 pb-3">
                <p className="text-xs uppercase font-sans font-bold tracking-widest text-slate-600">
                  Government of India • State Administration
                </p>
                <h4 className="text-lg font-bold text-slate-900 mt-1 font-serif">
                  {viewingDoc.title}
                </h4>
                <p className="text-xs font-sans text-slate-500">
                  Authority: {viewingDoc.issuingAuthority}
                </p>
              </div>

              <div className="py-6 space-y-2 text-xs font-sans text-slate-700">
                <p>This is to certify that the documents of the applicant have been verified by the authority.</p>
                <p className="font-semibold">Beneficiary: Sunita Soren | Category: Scheduled Tribe</p>
                <p className="font-mono text-[11px] text-teal-800">Verification Source: {viewingDoc.verifiedSource || 'National e-District Service'}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] font-sans text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DigiLocker Digitally Signed (Simulated)</span>
                </div>
                <span>Status: {viewingDoc.status}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
