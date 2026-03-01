import { ReviewBackend } from '../types';

export const BACKEND_MOCK_REVIEWS: ReviewBackend[] = [
    {
        id: "rev_001",
        platform: "Internal",
        branch_id: "branch_001",
        rating: 1,
        review_text: "The food was cold and the service was extremely slow. I'm very disappointed.",
        reviewer_name: "Amit Kumar",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        processed: true,
        ai_analysis: {
            sentiment_label: "Negative",
            sentiment_score: -0.8,
            categories: ["Food Quality", "Service Speed"],
            risk_score: 75,
            urgency_level: "High",
            detected_intent: "Complaint",
            emotional_intensity: 4.2,
            response_suggestion: "Apologize for the cold food and slow service, offer a discount on the next visit.",
            escalation_required: true,
            detected_intents: {
                refund_intent: true,
                legal_threat: false,
                viral_risk: true,
                repeat_complaint: false
            },
            polite_reply: "Dear Amit, we are truly sorry for the experience you had. This is not the standard we strive for.",
            brand_tone_reply: "Namaste Amit. We regret that your meal at Prasad Food Divine was not up to our standards today. Quality is our priority.",
            apology_compensation_reply: "We'd like to make this right. Please use code REFLO20 for a complimentary appetizer on your next visit.",
            escalation_triggers: ["Cold food", "Extremely slow"],
            escalation_priority: "High"
        }
    },
    {
        id: "rev_002",
        platform: "Google",
        branch_id: "branch_003",
        rating: 5,
        review_text: "Amazing experience! The Paneer Tikka Masala was to die for and the staff was so friendly.",
        reviewer_name: "Sneha Rao",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        processed: true,
        ai_analysis: {
            sentiment_label: "Positive",
            sentiment_score: 0.95,
            categories: ["Food Quality", "Staff Behavior"],
            risk_score: 5,
            urgency_level: "Low",
            detected_intent: "Praises",
            emotional_intensity: 4.8,
            response_suggestion: "Thank the customer for the kind words and invite them back.",
            escalation_required: false,
            polite_reply: "Dear Sneha, thank you so much for your wonderful feedback! We're glad you enjoyed the Paneer Tikka Masala.",
            brand_tone_reply: "Namaste Sneha! We are delighted to have served you an excellent meal. See you again soon!",
            apology_compensation_reply: "",
            escalation_triggers: [],
            escalation_priority: "None"
        }
    },
    {
        id: "rev_003",
        platform: "Zomato",
        branch_id: "branch_001",
        rating: 3,
        review_text: "Average food, but the delivery was on time. Could be better.",
        reviewer_name: "Rahul M.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        processed: true,
        ai_analysis: {
            sentiment_label: "Neutral",
            sentiment_score: 0.1,
            categories: ["Food Quality", "Delivery"],
            risk_score: 20,
            urgency_level: "Medium",
            detected_intent: "Feedback",
            emotional_intensity: 2.1,
            response_suggestion: "Acknowledge the feedback on food quality and thank them for the delivery comment.",
            escalation_required: false,
            polite_reply: "Thank you for your feedback, Rahul. We're glad the delivery was prompt and will work on our food quality.",
            brand_tone_reply: "Namaste Rahul. Thank you for choosing Prasad Food Divine. We welcome your feedback to make our service even better.",
            apology_compensation_reply: "",
            escalation_triggers: [],
            escalation_priority: "None"
        }
    }
];
