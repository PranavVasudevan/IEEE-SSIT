import httpx
import sys

BASE_URL = "http://127.0.0.1:8000"
DEV_AUTH_TOKEN = "mock.eyJlbWFpbCI6ICJ2YXJ1bjI0MTAxNThAc3NuLmVkdS5pbiIsICJuYW1lIjogIlZhcnVuIFN1ZGhlZXIifQ==.dev"
HEADERS = {"Authorization": f"Bearer {DEV_AUTH_TOKEN}"}


def run_tests():
    print("\n--- 1. Health Checks ---")
    r = httpx.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("[PASS] /health:", r.json())

    r = httpx.get(f"{BASE_URL}/health/db")
    assert r.status_code == 200 and r.json().get("status") == "connected", f"DB health check failed: {r.text}"
    print("[PASS] /health/db:", r.json())

    print("\n--- 2. Team Directory API ---")
    r = httpx.get(f"{BASE_URL}/api/team")
    assert r.status_code == 200
    team = r.json()
    print(f"[PASS] GET /api/team returned {len(team)} members")
    assert len(team) >= 11, "Expected at least 11 team members"

    # Create temporary member
    r = httpx.post(
        f"{BASE_URL}/api/team",
        json={
            "name": "Integration Test Member",
            "role": "QA Specialist",
            "team_type": "Web Development",
            "year": "CSE III Year",
            "email": "testmember@ssn.edu.in",
            "quote": "Testing end-to-end integration.",
            "order": 99,
        },
        headers=HEADERS,
    )
    assert r.status_code == 201, f"Create team member failed: {r.text}"
    new_member_id = r.json()["id"]
    print(f"[PASS] POST /api/team created member {new_member_id}")

    # Update member
    r = httpx.put(
        f"{BASE_URL}/api/team/{new_member_id}",
        json={"quote": "Updated quote for testing."},
        headers=HEADERS,
    )
    assert r.status_code == 200 and r.json()["quote"] == "Updated quote for testing."
    print("[PASS] PUT /api/team/{id} updated successfully")

    # Delete member
    r = httpx.delete(f"{BASE_URL}/api/team/{new_member_id}", headers=HEADERS)
    assert r.status_code == 200
    print("[PASS] DELETE /api/team/{id} deleted successfully")

    print("\n--- 3. Events API ---")
    r = httpx.get(f"{BASE_URL}/api/events")
    assert r.status_code == 200
    print(f"[PASS] GET /api/events returned {len(r.json())} events")

    # Create event
    r = httpx.post(
        f"{BASE_URL}/api/events",
        json={
            "title": "Integration Test Event",
            "category": "Workshop",
            "date": "October 10, 2026",
            "time": "10:00 AM - 1:00 PM",
            "location": "SSN ECE Hall",
            "mode": "In-Person",
            "description": "Automated verification test event.",
            "status": "upcoming",
        },
        headers=HEADERS,
    )
    assert r.status_code == 201
    event_id = r.json()["id"]
    print(f"[PASS] POST /api/events created event {event_id}")

    # Duplicate event
    r = httpx.post(f"{BASE_URL}/api/events/{event_id}/duplicate", headers=HEADERS)
    assert r.status_code == 201
    cloned_id = r.json()["id"]
    print(f"[PASS] POST /api/events/{event_id}/duplicate created clone {cloned_id}")

    # Delete events
    httpx.delete(f"{BASE_URL}/api/events/{event_id}", headers=HEADERS)
    httpx.delete(f"{BASE_URL}/api/events/{cloned_id}", headers=HEADERS)
    print("[PASS] Cleaned up test events")

    print("\n--- 4. Gallery API ---")
    r = httpx.get(f"{BASE_URL}/api/gallery")
    assert r.status_code == 200
    print(f"[PASS] GET /api/gallery returned {len(r.json())} photos")

    # Create photo
    r = httpx.post(
        f"{BASE_URL}/api/gallery",
        json={
            "url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
            "label": "Test Photo",
            "category": "Campus",
        },
        headers=HEADERS,
    )
    assert r.status_code == 201
    photo_id = r.json()["id"]
    print(f"[PASS] POST /api/gallery created {photo_id}")
    httpx.delete(f"{BASE_URL}/api/gallery/{photo_id}", headers=HEADERS)
    print("[PASS] Cleaned up test gallery photo")

    print("\n--- 5. Announcements API ---")
    r = httpx.get(f"{BASE_URL}/api/announcements")
    assert r.status_code == 200
    print(f"[PASS] GET /api/announcements returned {len(r.json())} items")

    print("\n--- 6. Contact Inquiries & Membership Applications ---")
    r = httpx.post(
        f"{BASE_URL}/api/contact",
        json={
            "name": "Integration Contact",
            "email": "contact@ssn.edu.in",
            "department": "IT",
            "message": "Automated verification contact message.",
        },
    )
    assert r.status_code == 201
    inquiry_id = r.json()["id"]
    print(f"[PASS] POST /api/contact created inquiry {inquiry_id}")

    r = httpx.put(
        f"{BASE_URL}/api/contact/inquiries/{inquiry_id}/status",
        json={"status": "resolved"},
        headers=HEADERS,
    )
    assert r.status_code == 200 and r.json()["status"] == "resolved"
    print("[PASS] PUT /api/contact/inquiries/{id}/status updated status")
    httpx.delete(f"{BASE_URL}/api/contact/inquiries/{inquiry_id}", headers=HEADERS)

    # Membership application
    r = httpx.post(
        f"{BASE_URL}/api/membership/apply",
        json={
            "name": "Integration Applicant",
            "register_number": "312224000000",
            "email": "applicant@ssn.edu.in",
            "phone": "9876543210",
            "department": "CSE",
            "year": "3rd",
        },
    )
    assert r.status_code == 201
    app_id = r.json()["id"]
    print(f"[PASS] POST /api/membership/apply created application {app_id}")
    httpx.delete(f"{BASE_URL}/api/membership/applications/{app_id}", headers=HEADERS)

    print("\n--- 7. Chapter Settings API ---")
    r = httpx.get(f"{BASE_URL}/api/settings/chapter_info")
    assert r.status_code == 200
    print("[PASS] GET /api/settings/chapter_info -> Chair:", r.json()["value"]["chairName"])

    print("\n--- 8. Storage Upload API (Supabase Storage) ---")
    files = {"file": ("test_verify.png", b"VERIFICATION_SAMPLE_IMAGE_DATA", "image/png")}
    r = httpx.post(f"{BASE_URL}/api/storage/upload?folder=branding", files=files, headers=HEADERS)
    assert r.status_code == 201, f"Storage upload failed: {r.text}"
    print("[PASS] POST /api/storage/upload ->", r.json()["url"])

    print("\n=======================================================")
    print("ALL BACKEND, DATABASE & STORAGE INTEGRATION TESTS PASSED!")
    print("=======================================================")


if __name__ == "__main__":
    run_tests()
