/**
 * Reflo Backend API Service
 * Connects the PWA to the FastAPI backend at localhost:8000
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// ─── Types ───────────────────────────────────────────────────────────
export interface ReviewSubmission {
    platform: 'Internal' | 'Google' | 'Zomato';
    branch_id: string;
    rating: number;
    review_text: string;
    reviewer_name?: string;
    staff_tagged?: string;
    categories?: string[];
}

export interface ReviewResponse {
    id: string;
    platform: string;
    branch_id: string;
    rating: number;
    review_text: string;
    reviewer_name?: string;
    staff_tagged?: string;
    timestamp: string;
    processed: boolean;
    ai_analysis?: {
        sentiment_label: string;
        sentiment_score: number;
        risk_score: number;
        categories: string[];
        responses?: {
            polite_reply: string;
            brand_tone_reply: string;
            apology_compensation_reply: string;
        };
    };
}

export interface BranchInfo {
    id: string;
    name: string;
    location: string;
    manager: string;
}

// ─── API Methods ─────────────────────────────────────────────────────

/**
 * Submit a new review from the customer mobile app.
 * This triggers the full 6-agent AI pipeline on the backend.
 */
export async function submitReview(review: ReviewSubmission): Promise<ReviewResponse> {
    const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err.detail || `HTTP ${res.status}`);
    }

    return res.json();
}

/**
 * Fetch reviews, optionally filtered by branch.
 */
export async function fetchReviews(branchId?: string): Promise<ReviewResponse[]> {
    const url = new URL(`${API_BASE}/reviews`);
    if (branchId) url.searchParams.set('branch_id', branchId);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch reviews: HTTP ${res.status}`);
    return res.json();
}

/**
 * Fetch all branches.
 */
export async function fetchBranches(): Promise<BranchInfo[]> {
    const res = await fetch(`${API_BASE}/branches`);
    if (!res.ok) throw new Error(`Failed to fetch branches: HTTP ${res.status}`);
    return res.json();
}

/**
 * Health check
 */
export async function healthCheck(): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
        return res.ok;
    } catch {
        return false;
    }
}
