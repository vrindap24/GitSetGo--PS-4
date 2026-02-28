"""Seed script – Populates Firestore with realistic data for Prasad Divine.

Creates:
  • 5 branches (Powai, Dombivli, Virar, Kalyan, Pune)
  • 4 staff per branch (20 total)
  • ~6 reviews per branch (30 total) across Google, Zomato, Internal

Usage:
    python seed_data.py
"""

import random
import time

import requests

BASE = "http://localhost:8000/api/v1"

# ───────────────────────────────────────────────────────────────────────── #
#  Branch data                                                              #
# ───────────────────────────────────────────────────────────────────────── #
BRANCHES = [
    {"branch_name": "Prasad Divine - Powai", "location": "Powai", "manager_name": "Vikram Singh", "manager_contact": "vikram@prasaddivine.com", "lat": 19.1176, "lng": 72.9060},
    {"branch_name": "Prasad Divine - Dombivli", "location": "Dombivli", "manager_name": "Anita Patil", "manager_contact": "anita@prasaddivine.com", "lat": 19.2183, "lng": 73.0867},
    {"branch_name": "Prasad Divine - Virar", "location": "Virar", "manager_name": "Rajesh Deshmukh", "manager_contact": "rajesh@prasaddivine.com", "lat": 19.4559, "lng": 72.8111},
    {"branch_name": "Prasad Divine - Kalyan", "location": "Kalyan", "manager_name": "Priya Sharma", "manager_contact": "priya@prasaddivine.com", "lat": 19.2437, "lng": 73.1355},
    {"branch_name": "Prasad Divine - Pune", "location": "Pune", "manager_name": "Suresh Kulkarni", "manager_contact": "suresh@prasaddivine.com", "lat": 18.5204, "lng": 73.8567},
]

# ───────────────────────────────────────────────────────────────────────── #
#  Staff per branch (index matches BRANCHES)                                #
# ───────────────────────────────────────────────────────────────────────── #
STAFF_PER_BRANCH = [
    # Powai
    [
        {"staff_name": "Raju Patil", "role": "Server"},
        {"staff_name": "Kiran Vyas", "role": "Chef"},
        {"staff_name": "Deepika Rao", "role": "Host"},
        {"staff_name": "Amit Kumar", "role": "Server"},
    ],
    # Dombivli
    [
        {"staff_name": "Pooja Nair", "role": "Manager"},
        {"staff_name": "Priya Singh", "role": "Chef"},
        {"staff_name": "Anjali Desai", "role": "Server"},
        {"staff_name": "Arun Nair", "role": "Server"},
    ],
    # Virar
    [
        {"staff_name": "Rahul Verma", "role": "Manager"},
        {"staff_name": "Kavita Iyer", "role": "Chef"},
        {"staff_name": "Sanjay D.", "role": "Server"},
        {"staff_name": "Sneha Patel", "role": "Server"},
    ],
    # Kalyan
    [
        {"staff_name": "Suresh Reddy", "role": "Chef"},
        {"staff_name": "Rohit Sharma", "role": "Manager"},
        {"staff_name": "Meena K.", "role": "Server"},
        {"staff_name": "Simran L.", "role": "Server"},
    ],
    # Pune
    [
        {"staff_name": "Vikram S.", "role": "Chef"},
        {"staff_name": "Manoj Gupta", "role": "Server"},
        {"staff_name": "Neha B.", "role": "Host"},
        {"staff_name": "Rajesh M.", "role": "Manager"},
    ],
]

# ───────────────────────────────────────────────────────────────────────── #
#  Reviews – realistic, covering Food, Service, Ambiance, Hygiene           #
# ───────────────────────────────────────────────────────────────────────── #
POSITIVE_REVIEWS = [
    {"rating": 5, "text": "The paneer tikka masala was absolutely divine! Best I've had in Maharashtra. {staff} was incredibly attentive and made our anniversary dinner special.", "platform": "Google", "reviewer": "Meera Joshi"},
    {"rating": 5, "text": "Amazing dal tadka and butter naan. Authentic flavors that remind me of home-cooked food. The ambiance is so peaceful.", "platform": "Zomato", "reviewer": "Rohit M."},
    {"rating": 4, "text": "Really enjoyed the veg pulao and misal pav today. Fresh ingredients and great spice balance. {staff} recommended the combo and it was perfect.", "platform": "Google", "reviewer": "Sneha K."},
    {"rating": 5, "text": "Outstanding kaju masala! Creamy, rich, and perfectly spiced. The restaurant was spotlessly clean – hygiene standards are clearly top-notch here.", "platform": "Zomato", "reviewer": "Amit T."},
    {"rating": 4, "text": "Family dinner was wonderful. Kids loved the butter naan and paneer tikka. {staff} was patient with our little ones. Will definitely return!", "platform": "Google", "reviewer": "Priya S."},
    {"rating": 5, "text": "Best pure veg restaurant in the area! The thali is value for money and every dish is prepared with love. {staff} greeted us warmly.", "platform": "Internal", "reviewer": "Anand P."},
    {"rating": 4, "text": "Quick service, tasty food. The dal tadka and jeera rice combo is my go-to lunch. Consistent quality every time I visit.", "platform": "Zomato", "reviewer": "Kavita R."},
    {"rating": 5, "text": "Celebrated my birthday here and {staff} arranged a surprise cake cutting. The paneer tikka was excellent as always. Love this place!", "platform": "Google", "reviewer": "Rahul V."},
    {"rating": 4, "text": "The misal pav here is the real deal – spicy, tangy, and authentic. Perfect breakfast spot. Clean washrooms too, which is rare.", "platform": "Internal", "reviewer": "Deepak S."},
    {"rating": 5, "text": "Absolutely loved the kaju masala and butter naan. The veg pulao was fragrant and flavorful. Best dining experience this month!", "platform": "Zomato", "reviewer": "Sunita M."},
]

NEGATIVE_REVIEWS = [
    {"rating": 2, "text": "Very disappointed with the paneer tikka today. It was dry and overcooked. We waited 40 minutes for our order. Service needs serious improvement.", "platform": "Google", "reviewer": "Vikram B."},
    {"rating": 1, "text": "Found a hair in my dal tadka! Absolutely disgusting. The manager {staff} didn't seem to care much about our complaint. Will never come back.", "platform": "Zomato", "reviewer": "Pooja D."},
    {"rating": 2, "text": "Overpriced for what you get. The veg pulao was bland and the misal pav lacked the punch. AC wasn't working either. Very uncomfortable.", "platform": "Google", "reviewer": "Rajesh K."},
    {"rating": 1, "text": "Worst experience ever! Cockroach spotted near the kitchen entrance. The staff looked untrained. I want a full refund for this terrible meal.", "platform": "Zomato", "reviewer": "Neha G."},
    {"rating": 2, "text": "The butter naan was stale and the kaju masala tasted like yesterday's leftovers. Been coming here for years but quality has dropped. Extremely unhappy.", "platform": "Internal", "reviewer": "Suresh P."},
    {"rating": 1, "text": "I'm going to post this everywhere! Food poisoning after eating here. My whole family fell sick. This is a serious health hazard and I may take legal action.", "platform": "Google", "reviewer": "Anil S."},
]

NEUTRAL_REVIEWS = [
    {"rating": 3, "text": "Food was okay, nothing special. The paneer tikka was decent but not memorable. Service was average. Might try again.", "platform": "Google", "reviewer": "Kiran T."},
    {"rating": 3, "text": "Average experience. The dal tadka was fine but the butter naan was a bit cold. Ambiance is nice though. {staff} was helpful.", "platform": "Zomato", "reviewer": "Manish R."},
    {"rating": 3, "text": "Decent restaurant for a quick meal. The misal pav was okay. Prices are reasonable. Nothing to complain about but nothing outstanding either.", "platform": "Internal", "reviewer": "Divya L."},
    {"rating": 3, "text": "Had the veg pulao and kaju masala. Both were average. The place was crowded and a bit noisy. Staff seemed overworked.", "platform": "Zomato", "reviewer": "Tanvi M."},
]


def seed():
    print("=" * 60)
    print("  SEED SCRIPT – Populating Firestore for Prasad Divine")
    print("=" * 60)

    # Check health
    r = requests.get("http://localhost:8000/health")
    if r.status_code != 200:
        print("❌ Backend is not healthy! Aborting.")
        return
    print("✅ Backend is healthy\n")

    branch_ids = []
    staff_map = {}  # branch_index -> [staff_ids]

    # ── Create Branches ──────────────────────────────────────────────────
    print("📍 Creating 5 branches...")
    for b in BRANCHES:
        r = requests.post(f"{BASE}/branches", json=b)
        if r.status_code == 201:
            bid = r.json()["id"]
            branch_ids.append(bid)
            print(f"   ✅ {b['branch_name']} → {bid}")
        else:
            print(f"   ❌ Failed to create {b['branch_name']}: {r.text}")
            return

    # ── Create Staff ─────────────────────────────────────────────────────
    print("\n👥 Creating 20 staff members...")
    for i, staff_list in enumerate(STAFF_PER_BRANCH):
        staff_map[i] = []
        for s in staff_list:
            payload = {
                "branch_id": branch_ids[i],
                "staff_name": s["staff_name"],
                "role": s["role"],
                "active_status": True,
            }
            r = requests.post(f"{BASE}/staff", json=payload)
            if r.status_code == 201:
                sid = r.json()["id"]
                staff_map[i].append({"id": sid, "name": s["staff_name"]})
                print(f"   ✅ {s['staff_name']} ({s['role']}) @ {BRANCHES[i]['location']} → {sid}")
            else:
                print(f"   ❌ Failed to create {s['staff_name']}: {r.text}")

    # ── Create Reviews ───────────────────────────────────────────────────
    print("\n📝 Creating reviews (AI processing runs in background)...")
    review_count = 0

    for branch_idx in range(5):
        branch_id = branch_ids[branch_idx]
        staff_list = staff_map[branch_idx]
        location = BRANCHES[branch_idx]["location"]

        # Pick reviews for this branch
        # Each branch gets: 2 positive, 1 negative, 1 neutral (minimum)
        # Plus random extras for variety
        pos_sample = random.sample(POSITIVE_REVIEWS, min(3, len(POSITIVE_REVIEWS)))
        neg_sample = random.sample(NEGATIVE_REVIEWS, min(2, len(NEGATIVE_REVIEWS)))
        neu_sample = random.sample(NEUTRAL_REVIEWS, min(1, len(NEUTRAL_REVIEWS)))

        all_reviews = pos_sample + neg_sample + neu_sample
        random.shuffle(all_reviews)

        for rev in all_reviews:
            # Replace {staff} placeholder with a random staff name
            staff = random.choice(staff_list)
            text = rev["text"].replace("{staff}", staff["name"])

            payload = {
                "platform": rev["platform"],
                "branch_id": branch_id,
                "rating": rev["rating"],
                "review_text": text,
                "reviewer_name": rev["reviewer"],
                "staff_tagged": staff["id"],
            }

            r = requests.post(f"{BASE}/reviews", json=payload)
            if r.status_code == 201:
                review_count += 1
                emoji = "⭐" * rev["rating"]
                print(f"   {emoji} [{rev['platform']}] {location}: \"{text[:60]}...\"")
            else:
                print(f"   ❌ Review failed: {r.text}")

            # Small delay to avoid overwhelming the AI pipeline
            time.sleep(0.3)

    # ── Summary ──────────────────────────────────────────────────────────
    print(f"\n{'=' * 60}")
    print(f"  ✅ SEEDING COMPLETE!")
    print(f"     • {len(branch_ids)} branches created")
    print(f"     • {sum(len(v) for v in staff_map.values())} staff members created")
    print(f"     • {review_count} reviews created (AI processing in background)")
    print(f"{'=' * 60}")
    print("\n⏳ AI agents are processing reviews in the background.")
    print("   Wait ~30 seconds, then check the analytics endpoints:")
    print(f"   • {BASE}/analytics/network-map")
    print(f"   • {BASE}/analytics/branch-comparison")
    print(f"   • {BASE}/analytics/sentiment-categories")
    print(f"   • {BASE}/analytics/menu-intelligence")


if __name__ == "__main__":
    seed()
