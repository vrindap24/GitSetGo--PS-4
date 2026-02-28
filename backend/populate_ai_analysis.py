"""Pre-populate AI analysis for all reviews in Firestore.

Writes realistic AI analysis data directly, bypassing Gemini API.
This makes the dashboard analytics come alive immediately.
"""

import os
import sys
import random

sys.path.insert(0, os.getcwd())

from app.firebase import init_firebase, get_db

# ─── Realistic AI analysis templates ─────────────────────────────────────
POSITIVE_ANALYSES = [
    {
        "sentiment_label": "Positive",
        "sentiment_score": 0.9,
        "categories": ["Food", "Service"],
        "risk_score": 5,
        "urgency_level": "Low",
        "detected_intent": "Appreciation",
        "emotional_intensity": 3.5,
        "response_suggestion": "Thank the customer warmly and invite them to return.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "Thank you so much for your wonderful review! We're thrilled that you enjoyed your meal and our service. We look forward to welcoming you back soon. 🙏",
        "brand_tone_reply": "Namaste! Your kind words warm our hearts at Prasad Divine. We pour love into every dish, and it makes our day knowing you felt it. See you soon! 🌿",
        "apology_compensation_reply": "",
        "escalation_triggers": [],
        "escalation_priority": "None",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Positive",
        "sentiment_score": 0.85,
        "categories": ["Food", "Ambience"],
        "risk_score": 3,
        "urgency_level": "Low",
        "detected_intent": "Recommendation",
        "emotional_intensity": 3.0,
        "response_suggestion": "Thank the customer and highlight the mentioned dish.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "Thank you for dining with us! We're delighted to hear you loved our food and ambience. Your recommendation means the world to us!",
        "brand_tone_reply": "Namaste! At Prasad Divine, we believe great food should be enjoyed in a beautiful setting. So happy we delivered on both. Come again soon! 🙏",
        "apology_compensation_reply": "",
        "escalation_triggers": [],
        "escalation_priority": "None",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Positive",
        "sentiment_score": 0.8,
        "categories": ["Staff Behavior", "Food"],
        "risk_score": 2,
        "urgency_level": "Low",
        "detected_intent": "Staff Praise",
        "emotional_intensity": 3.2,
        "response_suggestion": "Acknowledge staff performance and thank the customer.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "Thank you for recognizing our team's efforts! We'll make sure to pass along your kind words. Great service is what we strive for every day.",
        "brand_tone_reply": "Namaste! Our team is our family, and your appreciation fuels their passion. We'll share your lovely feedback with them. See you again soon! 🌟",
        "apology_compensation_reply": "",
        "escalation_triggers": [],
        "escalation_priority": "None",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Positive",
        "sentiment_score": 0.75,
        "categories": ["Cleanliness", "Food"],
        "risk_score": 5,
        "urgency_level": "Low",
        "detected_intent": "Satisfaction",
        "emotional_intensity": 2.8,
        "response_suggestion": "Appreciate the hygiene feedback and invite them back.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "Thank you for noticing our commitment to cleanliness! We take hygiene very seriously and are glad it shows. We hope to see you again soon.",
        "brand_tone_reply": "Namaste! Purity and cleanliness are the foundation of Prasad Divine. Thank you for acknowledging our efforts. We look forward to your next visit! 🙏",
        "apology_compensation_reply": "",
        "escalation_triggers": [],
        "escalation_priority": "None",
        "staff_mentioned": None,
    },
]

NEGATIVE_ANALYSES = [
    {
        "sentiment_label": "Negative",
        "sentiment_score": -0.85,
        "categories": ["Food", "Service"],
        "risk_score": 75,
        "urgency_level": "High",
        "detected_intent": "Complaint",
        "emotional_intensity": 4.2,
        "response_suggestion": "Apologize sincerely, offer compensation, and escalate to manager.",
        "escalation_required": True,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": True, "repeat_complaint": False},
        "polite_reply": "We're deeply sorry for your disappointing experience. This is not the standard we hold ourselves to. Our manager will personally reach out to make this right.",
        "brand_tone_reply": "Namaste. We sincerely apologize. At Prasad Divine, every guest's experience matters deeply to us. Our branch manager has been notified and will contact you directly.",
        "apology_compensation_reply": "We sincerely apologize for the poor service and food quality. We'd like to offer you a complimentary meal on your next visit as a gesture of goodwill.",
        "escalation_triggers": ["low_rating", "service_complaint"],
        "escalation_priority": "High",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Negative",
        "sentiment_score": -0.95,
        "categories": ["Cleanliness", "Food"],
        "risk_score": 92,
        "urgency_level": "High",
        "detected_intent": "Hygiene Complaint",
        "emotional_intensity": 4.8,
        "response_suggestion": "Immediate escalation for hygiene issue. Apologize and investigate.",
        "escalation_required": True,
        "detected_intents": {"refund_intent": True, "legal_threat": False, "viral_risk": True, "repeat_complaint": False},
        "polite_reply": "We are extremely sorry about this. Hygiene is our top priority and we are launching an immediate investigation. Our manager will contact you within the hour.",
        "brand_tone_reply": "This is unacceptable by our standards. Purity is at the core of Prasad Divine. We have flagged this for an urgent internal audit.",
        "apology_compensation_reply": "We sincerely apologize for this serious hygiene lapse. A full refund has been initiated and our quality team will investigate immediately.",
        "escalation_triggers": ["hygiene_issue", "refund_intent", "viral_risk"],
        "escalation_priority": "Critical",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Negative",
        "sentiment_score": -0.7,
        "categories": ["Pricing", "Food"],
        "risk_score": 55,
        "urgency_level": "Medium",
        "detected_intent": "Value Complaint",
        "emotional_intensity": 3.5,
        "response_suggestion": "Acknowledge pricing concern, highlight value propositions.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "We're sorry to hear you felt the value wasn't up to expectations. We use only the freshest ingredients and would love another chance to impress you.",
        "brand_tone_reply": "Namaste. We value your feedback. At Prasad Divine, we source premium ingredients to ensure quality. We'd love to discuss our value offerings with you.",
        "apology_compensation_reply": "We understand your concern about pricing. We'd like to offer 15% off your next visit to show our appreciation for your honest feedback.",
        "escalation_triggers": ["value_complaint"],
        "escalation_priority": "Low",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Negative",
        "sentiment_score": -0.98,
        "categories": ["Food", "Cleanliness"],
        "risk_score": 95,
        "urgency_level": "High",
        "detected_intent": "Legal Threat",
        "emotional_intensity": 5.0,
        "response_suggestion": "Immediate escalation. Legal team notification. Full refund and personal follow-up.",
        "escalation_required": True,
        "detected_intents": {"refund_intent": True, "legal_threat": True, "viral_risk": True, "repeat_complaint": False},
        "polite_reply": "We are deeply alarmed by your experience and take this extremely seriously. Our senior management has been notified and will personally handle this case.",
        "brand_tone_reply": "This is a matter of utmost priority for Prasad Divine. We are immediately investigating and our leadership team will be in direct contact with you.",
        "apology_compensation_reply": "We sincerely apologize. A full refund is being processed immediately. Our quality assurance team will conduct a thorough investigation.",
        "escalation_triggers": ["food_safety", "legal_threat", "viral_risk", "health_hazard"],
        "escalation_priority": "Critical",
        "staff_mentioned": None,
    },
]

NEUTRAL_ANALYSES = [
    {
        "sentiment_label": "Neutral",
        "sentiment_score": 0.1,
        "categories": ["Food"],
        "risk_score": 15,
        "urgency_level": "Low",
        "detected_intent": "General Feedback",
        "emotional_intensity": 1.5,
        "response_suggestion": "Thank for feedback, invite them to try signature dishes next time.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "Thank you for your feedback! We're always looking to improve. We'd love for you to try our signature dishes on your next visit.",
        "brand_tone_reply": "Namaste! We appreciate your honest feedback. Next time, do ask our staff for our chef's special recommendations – we're sure you'll love them! 🙏",
        "apology_compensation_reply": "",
        "escalation_triggers": [],
        "escalation_priority": "None",
        "staff_mentioned": None,
    },
    {
        "sentiment_label": "Neutral",
        "sentiment_score": 0.2,
        "categories": ["Ambience", "Food"],
        "risk_score": 10,
        "urgency_level": "Low",
        "detected_intent": "Mixed Feedback",
        "emotional_intensity": 1.8,
        "response_suggestion": "Acknowledge both positive and areas for improvement.",
        "escalation_required": False,
        "detected_intents": {"refund_intent": False, "legal_threat": False, "viral_risk": False, "repeat_complaint": False},
        "polite_reply": "Thank you for dining with us! We're glad you enjoyed the ambience. We'll work on making the food experience equally memorable next time.",
        "brand_tone_reply": "Namaste! We appreciate you sharing both what worked and what didn't. Continuous improvement is our promise. See you again soon! 🌿",
        "apology_compensation_reply": "",
        "escalation_triggers": [],
        "escalation_priority": "None",
        "staff_mentioned": None,
    },
]


def populate():
    print("🔄 Initializing Firebase...")
    init_firebase()
    db = get_db()

    print("📊 Fetching all reviews...")
    reviews = list(db.collection("reviews").stream())
    print(f"   Found {len(reviews)} reviews")

    updated = 0
    for doc in reviews:
        data = doc.to_dict()
        rating = data.get("rating", 3)
        review_text = data.get("review_text", "")

        # Assign analysis based on rating
        if rating >= 4:
            analysis = random.choice(POSITIVE_ANALYSES).copy()
        elif rating <= 2:
            analysis = random.choice(NEGATIVE_ANALYSES).copy()
        else:
            analysis = random.choice(NEUTRAL_ANALYSES).copy()

        # Try to extract staff name from review text
        staff_tagged = data.get("staff_tagged")
        if staff_tagged:
            # Look up staff name
            staff_doc = db.collection("staff").document(staff_tagged).get()
            if staff_doc.exists:
                analysis["staff_mentioned"] = staff_doc.to_dict().get("staff_name")

        # Write to Firestore
        doc.reference.update({
            "ai_analysis": analysis,
            "processed": True,
        })
        updated += 1

        emoji = "✅" if rating >= 4 else ("⚠️" if rating <= 2 else "➖")
        print(f"   {emoji} {analysis['sentiment_label']:8s} | risk={analysis['risk_score']:3d} | cats={analysis['categories']} | \"{review_text[:50]}...\"")

    print(f"\n🎉 Updated {updated} reviews with realistic AI analysis!")
    print("   Dashboard analytics should now be fully populated.")


if __name__ == "__main__":
    populate()
