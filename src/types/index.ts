export type UserRole = "admin" | "counselor" | "student";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Counselling"
  | "Interested"
  | "Documents Pending"
  | "Converted"
  | "Lost";

export type ApplicationStatus =
  | "Draft"
  | "Documents Pending"
  | "Ready to Apply"
  | "Submitted"
  | "Under Review"
  | "Conditional Offer"
  | "Unconditional Offer"
  | "Rejected"
  | "Withdrawn";

export type DocumentStatus =
  | "Uploaded"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Correction Required";

export type DocumentCategory = string;

export type VisaStatus =
  | "Document Preparation"
  | "Ready to Submit"
  | "Submitted"
  | "Biometrics"
  | "Under Review"
  | "Decision"
  | "Approved"
  | "Refused";

export type OfferType = "Conditional" | "Unconditional";

export type OfferAcceptanceStatus = "Pending" | "Accepted" | "Declined";

export type TaskPriority = "High" | "Medium" | "Low";

export type TaskStatus = "Todo" | "In Progress" | "Completed";

export type AppointmentType =
  | "Counselling"
  | "Document Review"
  | "Application Review"
  | "Visa Consultation"
  | "Follow-up";

export type PaymentStatus = "Paid" | "Partial" | "Due" | "Overdue";

export type CommissionStatus = "Expected" | "Received" | "Paid";

// Lead Interface
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  countryInterest: string[];
  studyLevel: string;
  preferredCourse: string;
  intake: string;
  assignedCounselorId: string;
  assignedCounselorName: string;
  status: LeadStatus;
  leadSource: "Website Form" | "Walk-in" | "Facebook Ad" | "Referral" | "Education Expo" | "WhatsApp";
  createdAt: string;
  lastContactDate: string;
  gpa: string;
  ieltsScore?: string;
  notes: Array<{
    id: string;
    author: string;
    date: string;
    text: string;
  }>;
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: "status_change" | "call" | "email" | "meeting" | "note";
  }>;
}

// Student Interface
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  nationality: string;
  currentAddress: string;
  passportNumber: string;
  passportExpiry: string;
  targetDegree: string;
  preferredCountries: string[];
  preferredCourse: string;
  intake: string;
  budgetRange: string;
  assignedCounselorId?: string;
  assignedCounselorName?: string;
  assignedCounselor?: any;
  assignedCounselors?: any[];
  assignedCounselorIds?: string[];
  isBlocked?: boolean;
  isDeleted?: boolean;
  currentStage: "Lead" | "Counselling" | "Documents" | "Application" | "Offer" | "Visa" | "Enrollment";
  journeyProgress: number; // percentage 0-100
  applicationStatus: ApplicationStatus;
  visaStatus: VisaStatus;
  lastActivity: string;
  enrollmentYear: number;
  academicHistory: Array<{
    degree: string;
    institution: string;
    passingYear: number;
    gpa: string;
    country: string;
  }>;
  englishProficiency: {
    testType: "IELTS" | "PTE" | "TOEFL" | "Duolingo" | "None";
    overallScore: string;
    reading?: string;
    writing?: string;
    listening?: string;
    speaking?: string;
    testDate: string;
  };
  workExperience: Array<{
    title: string;
    company: string;
    duration: string;
    roleSummary: string;
  }>;
  sponsorDetails: {
    name: string;
    relationship: string;
    occupation: string;
    estimatedFunds: string;
    bankName: string;
  };
}

// Document Interface
export interface DocumentItem {
  id: string;
  studentId: string;
  studentName: string;
  name: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  category: string;
  uploadDate: string;
  status: DocumentStatus;
  reviewer?: string;
  reviewNotes?: string;
  expiryDate?: string;
  fileUrl?: string;
  requiredForCountry?: string[];
}

// University Interface
export interface University {
  id: string;
  name: string;
  logo: string;
  country: string;
  city: string;
  website: string;
  ranking: string;
  agentStatus: "Direct Partner" | "Aggregator Agreement" | "Sub-Agent" | "Pending Contract";
  activeCoursesCount: number;
  applicationFee: number;
  currency: string;
  status: "Active" | "Inactive";
  overview: string;
  requirementsSummary: string;
  avgTuition: string;
  degrees?: string[];
  intakes: string[];
  scholarshipsSummary: string;
  commissionRate: string;
}

// Course Interface
export interface Course {
  id: string;
  universityId: string;
  universityName: string;
  universityLogo?: string;
  courseName: string;
  country: string;
  studyLevel: "Bachelor's" | "Master's" | "Doctorate" | "Diploma";
  subjectArea: string;
  duration: string;
  tuitionFee: number;
  currency: string;
  ieltsRequirement: string;
  gpaRequirement: string;
  intakes: string[];
  deadline: string;
  scholarshipAvailable: boolean;
  scholarshipDetails?: string;
  description: string;
  careerOutcomes: string[];
}

// Application Interface
export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  universityId: string;
  universityName: string;
  universityLogo: string;
  courseId: string;
  courseName: string;
  country: string;
  intake: string;
  studyLevel: string;
  applicationDate: string;
  submissionDeadline: string;
  applicationFee: number;
  currency: string;
  feePaid: boolean;
  status: ApplicationStatus;
  counselorId: string;
  counselorName: string;
  trackingNumber: string;
  attachedDocumentIds: string[];
  notes: string;
  timeline: Array<{
    title: string;
    date: string;
    completed: boolean;
    description?: string;
  }>;
}

// Offer Interface
export interface Offer {
  id: string;
  applicationId?: string;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  universityName?: string;
  universityLogo?: string;
  courseName?: string;
  country?: string;
  intake?: string;
  type?: OfferType | string;
  offerType?: OfferType | string;
  offerDate?: string;
  deadline?: string;
  conditionsDeadline?: string;
  depositDeadline?: string;
  tuitionFee?: number;
  currency?: string;
  depositAmount?: number;
  depositPaid?: boolean;
  conditions?: Array<{
    id: string;
    text: string;
    fulfilled: boolean;
  }>;
  conditionsSummary?: string;
  acceptanceStatus: OfferAcceptanceStatus | string;
  offerLetterUrl?: string;
  offerLetterFileName?: string;
  offerLetterStoragePath?: string;
  offerLetterMimeType?: string;
  offerLetterSize?: string;
}

export type VisaDocumentStatus = "Pending" | "Submitted" | "Approved";

export interface VisaFeaturedDocument {
  id: string;
  name: string;
  description?: string;
  status: VisaDocumentStatus;
  required?: boolean;
}

// Visa Case Interface
export interface VisaCase {
  id: string;
  studentId: string;
  studentName?: string;
  studentAvatar?: string;
  country: string;
  visaType: string;
  applicationDate?: string;
  submissionDate?: string;
  status: VisaStatus;
  targetIntake?: string;
  institutionName?: string;
  casNumber?: string;
  casOrCoeNumber?: string;
  biometricsDate?: string;
  decisionDate?: string;
  counselorName?: string;
  checklist?: Array<{
    id: string;
    item: string;
    completed: boolean;
    required: boolean;
    documentId?: string;
  }>;
  featuredDocuments?: VisaFeaturedDocument[];
  timeline?: Array<{
    stage: string;
    date: string;
    status: "done" | "current" | "upcoming";
    notes?: string;
  }>;
  notes?: string;
}

// Task Interface
export interface TaskItem {
  id: string;
  title: string;
  description: string;
  studentId?: string;
  studentName?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
  status?: TaskStatus;
  category?: string;
}

// Appointment Interface
export interface Appointment {
  id: string;
  title: string;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  counselorName?: string;
  date: string;
  time: string;
  duration?: string;
  type: AppointmentType | string;
  location?: string;
  status?: string;
  notes?: string;
}

// Payment Interface
export interface PaymentRecord {
  id: string;
  invoiceNumber?: string;
  studentId?: string;
  studentName?: string;
  type: string;
  amount: number;
  currency?: string;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionRef?: string;
}

// Commission Interface
export interface CommissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  universityName: string;
  applicationId: string;
  country: string;
  intake: string;
  tuitionFee: number;
  expectedCommission: number;
  receivedCommission: number;
  agencySharePercentage: number;
  counselorSharePercentage: number;
  counselorName: string;
  status: CommissionStatus;
  payoutDate?: string;
  currency: string;
}

// Team Member Interface
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  userRole?: string;
  avatar?: string;
  branch?: string;
  activeStudents?: number;
  assignedStudentsCount?: number;
  activeApplicationsCount?: number;
  conversionRate?: string;
  status?: "Active" | "On Leave" | "Inactive";
  joinedDate?: string;
  phone?: string;
}

// Message Interface
export interface ChatMessage {
  id?: string;
  _id?: string;
  student?: string;
  studentId?: string;
  sender?: string;
  senderId?: string;
  senderName?: string;
  senderRole?: string;
  senderAvatar?: string;
  recipientId?: string;
  timestamp?: string;
  createdAt?: string;
  text?: string;
  message?: string;
  read?: boolean;
  isDeleted?: boolean;
  attachment?: {
    name: string;
    size?: string;
    type?: string;
    url?: string;
    fileUrl?: string;
  };
}
