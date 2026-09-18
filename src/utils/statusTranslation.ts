export const getTranslatedStatus = (
  status: string,
  t: (key: string, fallback?: string) => string
): string => {
  if (!status) return '';
  
  switch (status.trim()) {
    case 'Draft':
      return t('status.draft', 'Draft');
    case 'Submitted':
      return t('status.submitted', 'Submitted');
    case 'Under Verification':
      return t('status.underVerification', 'Under Verification');
    case 'Information Required':
      return t('status.infoRequired', 'Information Required');
    case 'Under Manual Review':
      return t('status.underManualReview', 'Under Manual Review');
    case 'Sanctioned':
      return t('status.sanctioned', 'Sanctioned');
    case 'Disbursed':
      return t('status.disbursed', 'Disbursed');
    case 'Rejected':
      return t('status.rejected', 'Rejected');
    case 'Closed':
      return t('status.closed', 'Closed');
    case 'Verified':
      return t('status.verified', 'Verified');
    case 'Mismatch Found':
    case 'Deficiency Found':
      return t('status.mismatchFound', 'Mismatch Found');
    case 'Pending Verification':
    case 'Verification Pending':
      return t('status.pendingVerification', 'Pending Verification');
    default:
      return status;
  }
};
