import asyncio
import os
import sys

# Add the app directory to the python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.config import get_settings
from app.services.whatsapp_service import send_whatsapp_alert

async def test():
    settings = get_settings()
    token = settings.whatsapp_access_token
    phone_id = settings.whatsapp_phone_number_id
    to = settings.escalation_whatsapp_recipients.split(',')[0]
    
    print(f"Token present: {bool(token)}, Phone ID: {phone_id}, To: {to}")
    
    res = await send_whatsapp_alert(
        phone_number_id=phone_id,
        access_token=token,
        to_phone=to,
        review_text="Test Review: Found a bug.",
        branch_name="Connaught Place",
        rating=1,
        triggers=["rating", "keywords"],
        priority="Critical"
    )
    print("Result:", res)

if __name__ == "__main__":
    asyncio.run(test())
