import asyncio
import httpx

async def submit_pwa_review():
    url = "http://localhost:8000/api/v1/reviews"
    
    # Payload simulating SubmitReviewScreen.tsx
    payload = {
        "platform": "Internal",
        "branch_id": "b4",  # Default Powai branch from PWA
        "rating": 5,
        "review_text": "The food was incredible but the service was a bit slow.",
        "reviewer_name": "Test PWA User",
        "categories": ["Food Quality", "Service"]  # The PWA tags
    }
    
    print(f"Submitting PWA review with categories to {url}...")
    
    async with httpx.AsyncClient() as client:
        # 1. Submit review
        response = await client.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        review_id = data["id"]
        print(f"✅ Review submitted successfully. ID: {review_id}")
        
        # 2. Give AI a few seconds to process
        print("Waiting 5 seconds for AI processing...")
        await asyncio.sleep(5)
        
        # 3. Fetch the processed review back to verify categories were preserved
        print(f"Fetching processed review ID {review_id} from backend...")
        # Get all reviews for the branch and find ours
        get_url = f"http://localhost:8000/api/v1/reviews?branch_id=b4"
        get_resp = await client.get(get_url)
        all_reviews = get_resp.json()
        
        our_review = next((r for r in all_reviews if r["id"] == review_id), None)
        
        if our_review:
            print(f"✅ Review found.")
            print(f"Processed: {our_review.get('processed')}")
            
            ai_analysis = our_review.get("ai_analysis")
            if ai_analysis:
                final_categories = ai_analysis.get("categories", [])
                print(f"Final Categories in AI Analysis: {final_categories}")
                
                # Check if our original categories are still there
                original_preserved = all(cat in final_categories for cat in payload["categories"])
                if original_preserved:
                    print("✅ SUCCESS: PWA custom categories were successfully merged and preserved after AI analysis!")
                else:
                    print("❌ FAILED: PWA custom categories were LOST during AI analysis.")
            else:
                print("❌ FAILED: AI Analysis is missing.")
        else:
            print("❌ FAILED: Review not found.")

if __name__ == "__main__":
    asyncio.run(submit_pwa_review())
