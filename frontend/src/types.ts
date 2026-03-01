export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type UserRole = 'HQ' | 'BRANCH' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string; // Optional, for branch/staff users
}

export type Category =
  | 'Food Quality'
  | 'Staff Behavior'
  | 'Ambience'
  | 'Delivery'
  | 'Hygiene'
  | 'Comfort'
  | 'Service'
  | 'Service Speed'
  | 'Value'
  | 'Health'
  | 'Menu Variety'
  | 'Facilities'
  | 'Experience'
  | 'General'
  | 'Food Safety';

export interface Review {
  id: string;
  branchId: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  sentiment: Sentiment;
  categories: Category[];
  isRecovered: boolean;
  recoveryTime?: number; // in minutes
  staffMentioned?: string[];
  response?: string;
  translation?: string; // For regional languages
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  coordinates: { lat: number; lng: number };
}

export interface Staff {
  id: string;
  name: string;
  branchId: string;
  role: string;
  credits: number;
  positiveMentions: number;
  rank: number;
}

// Backend-aligned Review Types
export interface DetectedIntents {
  refund_intent: boolean;
  legal_threat: boolean;
  viral_risk: boolean;
  repeat_complaint: boolean;
}

export interface AIAnalysisResponse {
  sentiment_label: string;
  sentiment_score: number;
  categories: string[];
  risk_score: number;
  urgency_level: string;
  detected_intent: string;
  emotional_intensity: number;
  response_suggestion: string;
  escalation_required: boolean;
  detected_intents?: DetectedIntents;
  staff_mentioned?: string;
  polite_reply: string;
  brand_tone_reply: string;
  apology_compensation_reply: string;
  escalation_triggers: string[];
  escalation_priority: string;
}

export interface ReviewBackend {
  id: string;
  platform: string;
  branch_id: string;
  rating: number;
  review_text: string;
  reviewer_name?: string;
  staff_tagged?: string;
  timestamp?: string;
  processed: boolean;
  ai_analysis?: AIAnalysisResponse;
  escalation_id?: string;
}
