import { UserProfile, UserRole } from '../types';
import { DEMO_STUDENT_PROFILE, DEMO_ADMIN_PROFILE } from '../data/mockData';

const CURRENT_USER_KEY = 'scholarsetu_current_user';

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    // Return null for unauthenticated guests so public homepage is rendered first
    return null;
  },

  async login(email: string, pass: string): Promise<UserProfile> {
    // Simulate realistic network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'admin@demo.com' && pass === 'Admin@123') {
      const adminUser: UserProfile = { ...DEMO_ADMIN_PROFILE };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    if (cleanEmail === 'student@demo.com' && pass === 'Student@123') {
      const studentUser: UserProfile = { ...DEMO_STUDENT_PROFILE };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(studentUser));
      return studentUser;
    }

    // Allow registering or custom credentials for demo flexibility
    if (cleanEmail.includes('admin')) {
      const customAdmin: UserProfile = {
        ...DEMO_ADMIN_PROFILE,
        id: `usr-adm-${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].toUpperCase() + ' (Ministry Admin)'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(customAdmin));
      return customAdmin;
    }

    if (pass.length >= 6) {
      const customStudent: UserProfile = {
        ...DEMO_STUDENT_PROFILE,
        id: `usr-st-${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(customStudent));
      return customStudent;
    }

    throw new Error('Invalid credentials. Please use the Demo Credentials provided or enter a valid password.');
  },

  async registerStudent(data: {
    name: string;
    aadhaarNumber: string;
    mobileNumber: string;
    state: string;
    district?: string;
    dateOfBirth?: string;
    category?: string;
    subTribe: string;
    stCertificateNumber?: string;
    email: string;
  }): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanAadhaar = data.aadhaarNumber.replace(/\D/g, '');
    const maskedAadhaar = cleanAadhaar.length >= 4 
      ? `XXXX-XXXX-${cleanAadhaar.slice(-4)}`
      : 'XXXX-XXXX-XXXX';

    const newProfile: UserProfile = {
      id: `usr-st-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      aadhaarNumber: maskedAadhaar,
      mobileNumber: data.mobileNumber,
      dateOfBirth: data.dateOfBirth || '2004-08-14',
      state: data.state,
      district: data.district || 'Ranchi',
      category: 'ST',
      subTribe: data.subTribe,
      stCertificateNumber: data.stCertificateNumber || `JH-ST-${Math.floor(100000 + Math.random() * 900000)}`,
      profileCompletionPercentage: 90,
      activeSchemeId: null
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));
    return newProfile;
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser() || DEMO_STUDENT_PROFILE;
    const updated = { ...current, ...updates };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    return updated;
  }
};
