import requests
import json
import time

BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

def print_header(msg):
    print(f"\n{'='*20} {msg} {'='*20}")

def test_endpoints():
    try:
        # 1. Health Check
        print_header("Testing Health Check")
        r = requests.get(f"{BASE_URL}/health")
        print(f"Status: {r.status_code}, Body: {r.json()}")
        if r.status_code != 200: return

        # 2. Create Branch
        print_header("Creating Test Branch")
        branch_data = {
            "branch_name": "Test Branch Alpha",
            "location": "123 Test St, Tech City",
            "manager_name": "Alice Tester",
            "manager_contact": "alice@test.com"
        }
        r = requests.post(f"{API_V1}/branches", json=branch_data)
        print(f"Status: {r.status_code}")
        if r.status_code != 201:
            print(f"Error: {r.text}")
            return
        branch_id = r.json()["id"]
        print(f"Created Branch ID: {branch_id}")

        # 3. List Branches
        print_header("Listing Branches")
        r = requests.get(f"{API_V1}/branches")
        print(f"Status: {r.status_code}, Count: {len(r.json())}")

        # 4. Create Staff
        print_header("Creating Test Staff")
        staff_data = {
            "branch_id": branch_id,
            "staff_name": "Bob Developer",
            "role": "Senior Engineer",
            "active_status": True
        }
        r = requests.post(f"{API_V1}/staff", json=staff_data)
        staff_id = r.json()["id"]
        print(f"Created Staff ID: {staff_id}")

        # 5. Create Review
        print_header("Creating Test Review")
        review_data = {
            "platform": "Internal",
            "branch_id": branch_id,
            "rating": 2,
            "review_text": "The service was a bit slow today, but the food was okay. I spoke with Bob who was helpful.",
            "reviewer_name": "Charlie Customer",
            "staff_tagged": staff_id
        }
        r = requests.post(f"{API_V1}/reviews", json=review_data)
        review_id = r.json()["id"]
        print(f"Created Review ID: {review_id}")

        # 6. List Reviews
        print_header("Listing Reviews")
        r = requests.get(f"{API_V1}/reviews", params={"branch_id": branch_id})
        print(f"Status: {r.status_code}, Count: {len(r.json())}")

        # 7. Ingestion
        print_header("Testing Google Ingestion")
        r = requests.post(f"{API_V1}/ingest/google", params={"branch_id": branch_id})
        print(f"Status: {r.status_code}, Message: {r.json().get('message')}")

        # 8. Wait for AI
        print("\nWaiting 5 seconds for AI processing...")
        time.sleep(5)

        # 9. Analytics
        print_header("Analytics: Branch Overview")
        r = requests.get(f"{API_V1}/analytics/branch-overview", params={"branch_id": branch_id})
        print(f"Status: {r.status_code}, Body: {r.json()}")

        # 10. Escalations
        print_header("Checking Escalations")
        r = requests.get(f"{API_V1}/escalations", params={"branch_id": branch_id})
        escalations = r.json()
        print(f"Found {len(escalations)} escalations")
        if escalations:
            esc_id = escalations[0]["id"]
            print(f"Updating Escalation: {esc_id}")
            r = requests.patch(f"{API_V1}/escalations/{esc_id}", json={"status": "Resolved", "resolution_notes": "Tested via script"})
            print(f"Status: {r.status_code}")

        # 11. Insights
        print_header("Insights: Branch")
        r = requests.get(f"{API_V1}/insights/branch", params={"branch_id": branch_id})
        print(f"Status: {r.status_code}, Summary: {r.json().get('summary')}")

        print("\nAll Python tests completed!")

    except Exception as e:
        print(f"\nTest failed with error: {e}")

if __name__ == "__main__":
    test_endpoints()
