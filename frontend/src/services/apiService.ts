import { BACKEND_MOCK_REVIEWS } from '../data/backendMockData';
import { ReviewBackend } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';
const USE_MOCK_FALLBACK = true;
const TIMEOUT_MS = 5000;

/**
 * Fetches reviews from the FastAPI backend.
 * Includes a timeout and fallback to mock data if configured.
 */
export const fetchReviews = async (): Promise<ReviewBackend[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if data is valid and not empty
        if (!Array.isArray(data) || data.length === 0) {
            console.warn("API returned empty or invalid data, attempting fallback...");
            return handleFallback("Empty or invalid API response");
        }

        console.log("Using real backend data");
        return data;
    } catch (error: any) {
        clearTimeout(timeoutId);

        let message = error.message;
        if (error.name === 'AbortError') {
            message = "Request timed out after 5 seconds";
        }

        console.error(`API Fetch Error: ${message}`);

        if (USE_MOCK_FALLBACK) {
            return handleFallback(message);
        }

        throw new Error(`Failed to fetch reviews: ${message}`);
    }
};

/**
 * Handles the fallback to mock data.
 * @param reason The reason for the fallback (logs to console)
 */
const handleFallback = (reason: string): ReviewBackend[] => {
    console.log(`Using mock fallback data. Reason: ${reason}`);
    return BACKEND_MOCK_REVIEWS;
};
