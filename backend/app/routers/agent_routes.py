from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

# In-memory storage for demo purposes (should be Firestore in production)
agent_activities: List[Dict[str, Any]] = [
    {
        "id": "1",
        "agent": "Ingestion Agent",
        "action": "Successfully pulled 15 reviews from Google & Zomato",
        "status": "completed",
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "2",
        "agent": "Sentiment & Risk Agent",
        "action": "Processing 5 new reviews; 2 flagged for immediate attention",
        "status": "working",
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "3",
        "agent": "Categorization Agent",
        "action": "Deep-parsing menu feedback for 'Powai' branch launch",
        "status": "completed",
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "4",
        "agent": "Escalation Agent",
        "action": "Triggering red alert for high-risk incident #821",
        "status": "working",
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "5",
        "agent": "Response Agent",
        "action": "Drafting personalized apology for 'Worst experience' review",
        "status": "completed",
        "timestamp": datetime.now().isoformat()
    }
]

@router.get("/activity")
async def get_agent_activity():
    """Returns the latest activity from the AI agent pipeline."""
    return agent_activities

@router.post("/log")
async def log_agent_activity(activity: Dict[str, Any]):
    """Internal endpoint to log agent activity."""
    activity["id"] = str(len(agent_activities) + 1)
    activity["timestamp"] = datetime.now().isoformat()
    agent_activities.insert(0, activity) # Add to top
    if len(agent_activities) > 20:
        agent_activities.pop()
    return {"status": "ok"}
