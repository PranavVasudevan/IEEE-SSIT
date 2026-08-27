import base64
import json
import httpx
import os
import subprocess
from sqlalchemy import create_engine, text

BASE_URL = "http://127.0.0.1:8000"
SUPABASE_STORAGE_URL = "https://qxagvmkczvhupkrhyyaj.supabase.co"
BUCKET = "ieee-ssit-assets"
DATABASE_URL = "postgresql://postgres.qxagvmkczvhupkrhyyaj:ieee-ssit-ssn-2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"


def make_dev_token(email: str, name: str = "Test User") -> str:
    payload = base64.b64encode(json.dumps({"email": email, "name": name, "uid": "test-uid"}).encode()).decode()
    return f"mock.{payload}.dev"


ADMIN_TOKEN = make_dev_token("varun2410158@ssn.edu.in", "Varun Sudheer")
UNAUTHORIZED_TOKEN = make_dev_token("student@ssn.edu.in", "Regular Student")
NON_SSN_TOKEN = make_dev_token("attacker@gmail.com", "Attacker")
ADMIN_HEADERS = {"Authorization": f"Bearer {ADMIN_TOKEN}"}


def run_full_verification():
    print("=" * 80)
    print("IEEE SSIT SSN — FINAL END-TO-END ADMIN CMS & BACKEND VERIFICATION")
    print("=" * 80)

    results = {}

    # -------------------------------------------------------------
    # 1. ADMIN LOGIN & AUTHENTICATION
    # -------------------------------------------------------------
    print("\n--- 1. Admin Login & Authorization ---")
    # Missing token
    r = httpx.post(f"{BASE_URL}/api/team", json={"name": "X"})
    assert r.status_code == 401, f"Expected 401, got {r.status_code}"
    # Non SSN
    r = httpx.post(f"{BASE_URL}/api/team", json={"name": "X"}, headers={"Authorization": f"Bearer {NON_SSN_TOKEN}"})
    assert r.status_code == 403, f"Expected 403, got {r.status_code}"
    # Unauthorized SSN
    r = httpx.post(f"{BASE_URL}/api/team", json={"name": "X"}, headers={"Authorization": f"Bearer {UNAUTHORIZED_TOKEN}"})
    assert r.status_code == 403, f"Expected 403, got {r.status_code}"
    print("[PASS] Unauthorized requests strictly rejected (401 / 403)")
    results["Admin Login"] = "PASS"

    # -------------------------------------------------------------
    # 2. TEAM MANAGEMENT
    # -------------------------------------------------------------
    print("\n--- 2. Team Management ---")
    # View all members
    r = httpx.get(f"{BASE_URL}/api/team")
    assert r.status_code == 200
    initial_team = r.json()
    print(f" -> Initial team count: {len(initial_team)} members (11 official)")
    assert len(initial_team) == 11, f"Expected 11, got {len(initial_team)}"

    # Upload test profile photo through FastAPI
    files = {"file": ("team_test_avatar.jpg", b"FAKE_AVATAR_IMAGE_BYTES_2026", "image/jpeg")}
    r = httpx.post(f"{BASE_URL}/api/storage/upload?folder=team", files=files, headers=ADMIN_HEADERS)
    assert r.status_code == 201
    photo_url = r.json()["url"]
    print(f" -> Photo uploaded through FastAPI -> Supabase Storage: {photo_url}")
    assert f"{SUPABASE_STORAGE_URL}/storage/v1/object/public/{BUCKET}/team/" in photo_url

    # Add test member
    r = httpx.post(
        f"{BASE_URL}/api/team",
        json={
            "name": "E2E Test Member",
            "role": "QA Specialist",
            "team_type": "Web Development",
            "year": "CSE III Year",
            "email": "e2etest@ssn.edu.in",
            "photo": photo_url,
            "quote": "E2E test quote.",
            "order": 12,
        },
        headers=ADMIN_HEADERS,
    )
    assert r.status_code == 201
    test_member_id = r.json()["id"]
    print(f" -> Created team member in PostgreSQL: {test_member_id}")

    # Verify persistence by refetching
    r = httpx.get(f"{BASE_URL}/api/team")
    assert len(r.json()) == 12

    # Edit member
    r = httpx.put(f"{BASE_URL}/api/team/{test_member_id}", json={"quote": "Updated E2E quote."}, headers=ADMIN_HEADERS)
    assert r.status_code == 200 and r.json()["quote"] == "Updated E2E quote."

    # Reorder members
    r = httpx.put(
        f"{BASE_URL}/api/team/reorder",
        json={"items": [{"id": test_member_id, "order": 1}]},
        headers=ADMIN_HEADERS,
    )
    assert r.status_code == 200

    # Delete test member
    r = httpx.delete(f"{BASE_URL}/api/team/{test_member_id}", headers=ADMIN_HEADERS)
    assert r.status_code == 200
    r = httpx.get(f"{BASE_URL}/api/team")
    assert len(r.json()) == 11
    print("[PASS] Team CRUD, Upload & Reorder verified and cleaned up")
    results["Team Management"] = "PASS"

    # -------------------------------------------------------------
    # 3. EVENTS
    # -------------------------------------------------------------
    print("\n--- 3. Events Management ---")
    files = {"file": ("event_poster.jpg", b"EVENT_POSTER_IMAGE_DATA_BYTES", "image/jpeg")}
    r = httpx.post(f"{BASE_URL}/api/storage/upload?folder=events", files=files, headers=ADMIN_HEADERS)
    assert r.status_code == 201
    event_image_url = r.json()["url"]

    # Create event
    r = httpx.post(
        f"{BASE_URL}/api/events",
        json={
            "title": "E2E Test Workshop",
            "category": "Workshop",
            "date": "November 15, 2026",
            "time": "2:00 PM - 5:00 PM",
            "location": "SSN Central Audi",
            "mode": "In-Person",
            "image": event_image_url,
            "description": "E2E automated test event.",
            "status": "upcoming",
        },
        headers=ADMIN_HEADERS,
    )
    assert r.status_code == 201
    test_event_id = r.json()["id"]

    # Duplicate event
    r = httpx.post(f"{BASE_URL}/api/events/{test_event_id}/duplicate", headers=ADMIN_HEADERS)
    assert r.status_code == 201
    cloned_id = r.json()["id"]

    # Edit event
    r = httpx.put(f"{BASE_URL}/api/events/{test_event_id}", json={"title": "Updated E2E Workshop"}, headers=ADMIN_HEADERS)
    assert r.status_code == 200 and r.json()["title"] == "Updated E2E Workshop"

    # Delete both events
    httpx.delete(f"{BASE_URL}/api/events/{test_event_id}", headers=ADMIN_HEADERS)
    httpx.delete(f"{BASE_URL}/api/events/{cloned_id}", headers=ADMIN_HEADERS)
    print("[PASS] Events CRUD, Image Upload & Duplicate verified and cleaned up")
    results["Events Management"] = "PASS"

    # -------------------------------------------------------------
    # 4. GALLERY
    # -------------------------------------------------------------
    print("\n--- 4. Gallery Management ---")
    files = {"file": ("gallery_snap.jpg", b"GALLERY_PHOTO_IMAGE_DATA_BYTES", "image/jpeg")}
    r = httpx.post(f"{BASE_URL}/api/storage/upload?folder=gallery", files=files, headers=ADMIN_HEADERS)
    assert r.status_code == 201
    gallery_url = r.json()["url"]

    # Add photo to PostgreSQL
    r = httpx.post(
        f"{BASE_URL}/api/gallery",
        json={
            "url": gallery_url,
            "label": "E2E Gallery Test",
            "caption": "Testing Gallery upload flow",
            "category": "Workshop",
        },
        headers=ADMIN_HEADERS,
    )
    assert r.status_code == 201
    test_photo_id = r.json()["id"]

    # Verify appears in public gallery
    r = httpx.get(f"{BASE_URL}/api/gallery")
    assert any(p["id"] == test_photo_id for p in r.json())

    # Delete photo
    r = httpx.delete(f"{BASE_URL}/api/gallery/{test_photo_id}", headers=ADMIN_HEADERS)
    assert r.status_code == 200
    print("[PASS] Gallery Upload, PostgreSQL Save & Delete verified")
    results["Gallery Management"] = "PASS"

    # -------------------------------------------------------------
    # 5. ANNOUNCEMENTS
    # -------------------------------------------------------------
    print("\n--- 5. Announcements Management ---")
    r = httpx.post(
        f"{BASE_URL}/api/announcements",
        json={
            "text": "E2E Test Announcement Alert",
            "cta_text": "View Details",
            "cta_url": "https://ssn.edu.in",
            "priority": "urgent",
            "active": True,
        },
        headers=ADMIN_HEADERS,
    )
    assert r.status_code == 201
    test_ann_id = r.json()["id"]

    # Edit announcement
    r = httpx.put(f"{BASE_URL}/api/announcements/{test_ann_id}", json={"priority": "normal"}, headers=ADMIN_HEADERS)
    assert r.status_code == 200

    # Delete announcement
    r = httpx.delete(f"{BASE_URL}/api/announcements/{test_ann_id}", headers=ADMIN_HEADERS)
    assert r.status_code == 200
    print("[PASS] Announcements CRUD verified")
    results["Announcements"] = "PASS"

    # -------------------------------------------------------------
    # 6. CONTACT INQUIRIES
    # -------------------------------------------------------------
    print("\n--- 6. Contact Inquiries ---")
    r = httpx.post(
        f"{BASE_URL}/api/contact",
        json={
            "name": "Jane Student",
            "email": "jane@ssn.edu.in",
            "department": "BME",
            "message": "Interested in joining SSIT.",
        },
    )
    assert r.status_code == 201
    inquiry_id = r.json()["id"]

    # View in admin
    r = httpx.get(f"{BASE_URL}/api/contact/inquiries", headers=ADMIN_HEADERS)
    assert any(i["id"] == inquiry_id for i in r.json())

    # Update status
    r = httpx.put(f"{BASE_URL}/api/contact/inquiries/{inquiry_id}/status", json={"status": "resolved"}, headers=ADMIN_HEADERS)
    assert r.status_code == 200 and r.json()["status"] == "resolved"

    # Delete inquiry
    r = httpx.delete(f"{BASE_URL}/api/contact/inquiries/{inquiry_id}", headers=ADMIN_HEADERS)
    assert r.status_code == 200
    print("[PASS] Contact Intake, Admin View, Status Update & Delete verified")
    results["Contact Inquiries"] = "PASS"

    # -------------------------------------------------------------
    # 7. MEMBERSHIP APPLICATIONS
    # -------------------------------------------------------------
    print("\n--- 7. Membership Applications ---")
    r = httpx.post(
        f"{BASE_URL}/api/membership/apply",
        json={
            "name": "Alex Applicant",
            "register_number": "312224101000",
            "email": "alex@ssn.edu.in",
            "phone": "9988776655",
            "department": "EEE",
            "year": "3rd",
        },
    )
    assert r.status_code == 201
    app_id = r.json()["id"]

    # View in admin
    r = httpx.get(f"{BASE_URL}/api/membership/applications", headers=ADMIN_HEADERS)
    assert any(a["id"] == app_id for a in r.json())

    # Update status
    r = httpx.put(f"{BASE_URL}/api/membership/applications/{app_id}/status", json={"status": "approved"}, headers=ADMIN_HEADERS)
    assert r.status_code == 200 and r.json()["status"] == "approved"

    # Delete application
    r = httpx.delete(f"{BASE_URL}/api/membership/applications/{app_id}", headers=ADMIN_HEADERS)
    assert r.status_code == 200
    print("[PASS] Membership Intake, Admin View, Status Update & Delete verified")
    results["Membership Applications"] = "PASS"

    # -------------------------------------------------------------
    # 8. SETTINGS
    # -------------------------------------------------------------
    print("\n--- 8. Chapter Settings ---")
    r = httpx.get(f"{BASE_URL}/api/settings/chapter_info")
    assert r.status_code == 200
    original_info = r.json()["value"]
    original_tagline = original_info["tagline"]

    # Update tagline
    updated_info = dict(original_info)
    updated_info["tagline"] = "Updated test tagline for verification."
    r = httpx.put(f"{BASE_URL}/api/settings/chapter_info", json={"value": updated_info}, headers=ADMIN_HEADERS)
    assert r.status_code == 200

    # Refetch to confirm loaded from PostgreSQL
    r = httpx.get(f"{BASE_URL}/api/settings/chapter_info")
    assert r.json()["value"]["tagline"] == "Updated test tagline for verification."

    # Restore original tagline
    updated_info["tagline"] = original_tagline
    r = httpx.put(f"{BASE_URL}/api/settings/chapter_info", json={"value": updated_info}, headers=ADMIN_HEADERS)
    assert r.status_code == 200
    print("[PASS] Chapter Settings update, persistence & restoration verified")
    results["Settings"] = "PASS"

    # -------------------------------------------------------------
    # 9. DIRECT DATABASE CHECK (SQLAlchemy against PostgreSQL)
    # -------------------------------------------------------------
    print("\n--- 9. Direct PostgreSQL Database Verification ---")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        team_count = conn.execute(text("SELECT count(*) FROM team_members")).scalar()
        events_count = conn.execute(text("SELECT count(*) FROM events")).scalar()
        gallery_count = conn.execute(text("SELECT count(*) FROM gallery_photos")).scalar()
        announcements_count = conn.execute(text("SELECT count(*) FROM announcements")).scalar()
        settings_count = conn.execute(text("SELECT count(*) FROM chapter_settings")).scalar()
        print(f" -> PostgreSQL Database Table Counts:")
        print(f"    - team_members: {team_count}")
        print(f"    - events: {events_count}")
        print(f"    - gallery_photos: {gallery_count}")
        print(f"    - announcements: {announcements_count}")
        print(f"    - chapter_settings: {settings_count}")
        assert team_count == 11, f"Expected 11 team members in PostgreSQL, got {team_count}"
        assert events_count >= 1, "Expected events in PostgreSQL"
        assert settings_count >= 1, "Expected settings in PostgreSQL"
    print("[PASS] Direct PostgreSQL database records verified")
    results["PostgreSQL Direct Check"] = "PASS"

    print("\n" + "=" * 80)
    print("ALL 9 VERIFICATION PHASES EXECUTED WITH ZERO ERRORS!")
    print("=" * 80)
    return results


if __name__ == "__main__":
    run_full_verification()
