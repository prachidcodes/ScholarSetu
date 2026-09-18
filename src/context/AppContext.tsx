import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  ScholarshipApplication, 
  StudentDocument, 
  NotificationItem, 
  ScholarshipScheme 
} from '../types';
import { applicationService } from '../services/applicationService';
import { documentService } from '../services/documentService';
import { notificationService } from '../services/notificationService';
import { scholarshipService } from '../services/scholarshipService';
import { useAuth } from './AuthContext';

interface AppContextType {
  applications: ScholarshipApplication[];
  documents: StudentDocument[];
  notifications: NotificationItem[];
  schemes: ScholarshipScheme[];
  unreadNotificationCount: number;
  isJagoOpen: boolean;
  setIsJagoOpen: (open: boolean) => void;
  openJagoWithPrompt?: (promptText: string) => void;
  pendingJagoPrompt: string | null;
  setPendingJagoPrompt: (prompt: string | null) => void;
  refreshApplications: () => void;
  refreshDocuments: () => void;
  refreshNotifications: () => void;
  createApplication: (payload: any) => Promise<ScholarshipApplication>;
  requestManualReview: (appId: string, note?: string) => Promise<ScholarshipApplication>;
  adminResolveReview: (appId: string, decision: 'Approve' | 'Request More Info' | 'Sanction', remarks: string) => Promise<ScholarshipApplication>;
  uploadDocument: (file: File, type: any, title: string, issuingAuthority: string) => Promise<StudentDocument>;
  syncWithDigiLocker: (onStepChange?: (step: any) => void) => Promise<StudentDocument[]>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activeDemoApplication: ScholarshipApplication | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [schemes] = useState<ScholarshipScheme[]>(scholarshipService.getAllSchemes());
  const [isJagoOpen, setIsJagoOpen] = useState<boolean>(false);
  const [pendingJagoPrompt, setPendingJagoPrompt] = useState<string | null>(null);

  const refreshApplications = useCallback(() => {
    const apps = applicationService.getApplications();
    setApplications(apps);
  }, []);

  const refreshDocuments = useCallback(() => {
    const docs = documentService.getDocuments(user?.id);
    setDocuments(docs);
  }, [user?.id]);

  const refreshNotifications = useCallback(() => {
    const notifs = notificationService.getNotifications(user?.id);
    setNotifications(notifs);
  }, [user?.id]);

  useEffect(() => {
    refreshApplications();
    refreshDocuments();
    refreshNotifications();
  }, [refreshApplications, refreshDocuments, refreshNotifications]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const createApplication = async (payload: any): Promise<ScholarshipApplication> => {
    const newApp = await applicationService.createApplication(payload);
    refreshApplications();
    refreshNotifications();
    return newApp;
  };

  const requestManualReview = async (appId: string, note?: string): Promise<ScholarshipApplication> => {
    const updated = await applicationService.requestManualReview(appId, note);
    refreshApplications();
    refreshNotifications();
    return updated;
  };

  const adminResolveReview = async (
    appId: string,
    decision: 'Approve' | 'Request More Info' | 'Sanction',
    remarks: string
  ): Promise<ScholarshipApplication> => {
    const updated = await applicationService.adminResolveReview(appId, decision, remarks);
    refreshApplications();
    refreshNotifications();
    return updated;
  };

  const uploadDocument = async (file: File, type: any, title: string, issuingAuthority: string): Promise<StudentDocument> => {
    const newDoc = await documentService.uploadDocument(user?.id || 'usr-st-9021', file, type, title, issuingAuthority);
    refreshDocuments();
    return newDoc;
  };

  const syncWithDigiLocker = async (onStepChange?: (step: any) => void): Promise<StudentDocument[]> => {
    const synced = await documentService.syncWithDigiLocker(user?.id || 'usr-st-9021', onStepChange);
    refreshDocuments();
    notificationService.createNotification({
      userId: user?.id || 'usr-st-9021',
      title: 'DigiLocker Documents Verified',
      message: 'DigiLocker credentials have been synchronized and cryptographically validated.',
      type: 'info',
      linkUrl: '/student/documents'
    });
    refreshNotifications();
    return synced;
  };

  const markNotificationAsRead = (id: string) => {
    notificationService.markAsRead(id);
    refreshNotifications();
  };

  const markAllNotificationsAsRead = () => {
    notificationService.markAllAsRead(user?.id);
    refreshNotifications();
  };

  const openJagoWithPrompt = (promptText: string) => {
    setPendingJagoPrompt(promptText);
    setIsJagoOpen(true);
  };

  // Find the primary demo application (APP-MOTA-2025-0982) or latest
  const activeDemoApplication = applications.find((a) => a.id === 'APP-MOTA-2025-0982') || applications[0];

  return (
    <AppContext.Provider
      value={{
        applications,
        documents,
        notifications,
        schemes,
        unreadNotificationCount,
        isJagoOpen,
        setIsJagoOpen,
        openJagoWithPrompt,
        pendingJagoPrompt,
        setPendingJagoPrompt,
        refreshApplications,
        refreshDocuments,
        refreshNotifications,
        createApplication,
        requestManualReview,
        adminResolveReview,
        uploadDocument,
        syncWithDigiLocker,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeDemoApplication
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
