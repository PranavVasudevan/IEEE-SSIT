import base64
import json
import httpx
import sys

BASE_URL = "http://127.0.0.1:8000"


def make_dev_token(email: str, name: str = "Test User") -> str:
    payload = base64.b64encode(json.dumps({"email": email, "name": name, "uid": "test-uid"}).encode()).decode()
    return f"mock.{payload}.dev"


VALID_ADMIN_TOKEN = make_dev_token("varun2410158@ssn.edu.in", "Varun Sudheer")
UNAUTHORIZED_SSN_USER_TOKEN = make_dev_token("student2410000@ssn.edu.in", "Regular Student")
NON_SSN_TOKEN = make_dev_token("outsider@gmail.com", "Outsider")


def test_audit():
    print("=" * 70)
    print("IEEE SSIT SSN — BACKEND ARCHITECTURE & SECURITY AUDIT")
    print("=" * 70)

    # 1. Health & Database
    print("\n[1] Verifying System Health & Database Connectivity...")
    r = httpx.get(f"{BASE_URL}/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print(" -> /health OK:", r.json())

    r = httpx.get(f"{BASE_URL}/health/db")
    assert r.status_code == 200 and r.json().get("status") == "connected", "DB health check failed"
    print(" -> /health/db OK:", r.json())

    # 2. Public Read Data from PostgreSQL via FastAPI
    print("\n[2] Verifying Public API Data from PostgreSQL via FastAPI...")
    r = httpx.get(f"{BASE_URL}/api/team")
    assert r.status_code == 200
    team = r.json()
    print(f" -> GET /api/team: {len(team)} members returned from PostgreSQL")
    assert len(team) == 11, f"Expected 11 official 2026 members, got {len(team)}"
    chair = next((m for m in team if m["role"] == "Chair"), None)
    assert chair and chair["name"] == "Varun Sudheer", "Chair verification failed"
    print(f" -> Verified Chair: {chair['name']} ({chair['year']})")

    # 3. Security: Admin Authentication & Authorization Checks
    print("\n[3] Verifying Server-Side Security & Token Verification on Protected Routes...")
    # 3a. No token -> 401 Unauthorized
    r = httpx.post(f"{BASE_URL}/api/team", json={"name": "Attacker", "role": "Hacker", "year": "1st"})
    assert r.status_code == 401, f"Expected 401 Unauthorized, got {r.status_code}"
    print(" -> [PASS] Request with NO token rejected with 401 Unauthorized")

    # 3b. Non-SSN email token -> 403 Forbidden
    r = httpx.post(
        f"{BASE_URL}/api/team",
        json={"name": "Attacker", "role": "Hacker", "year": "1st"},
        headers={"Authorization": f"Bearer {NON_SSN_TOKEN}"},
    )
    assert r.status_code == 403, f"Expected 403 Forbidden, got {r.status_code}"
    print(" -> [PASS] Request with Non-SSN token rejected with 403 Forbidden")

    # 3c. SSN email not in admin allowlist -> 403 Forbidden
    r = httpx.post(
        f"{BASE_URL}/api/team",
        json={"name": "Attacker", "role": "Hacker", "year": "1st"},
        headers={"Authorization": f"Bearer {UNAUTHORIZED_SSN_USER_TOKEN}"},
    )
    assert r.status_code == 403, f"Expected 403 Forbidden, got {r.status_code}"
    print(" -> [PASS] Request with Unauthorized SSN user rejected with 403 Forbidden")

    # 3d. Valid Admin token -> 201 Created
    r = httpx.post(
        f"{BASE_URL}/api/team",
        json={
            "name": "Audit Test Member",
            "role": "Security Auditor",
            "team_type": "Web Development",
            "year": "IT III Year",
            "email": "audit@ssn.edu.in",
            "quote": "Audited and verified.",
            "order": 99,
        },
        headers={"Authorization": f"Bearer {VALID_ADMIN_TOKEN}"},
    )
    assert r.status_code == 201, f"Expected 201 Created, got {r.status_code}"
    test_member = r.json()
    test_id = test_member["id"]
    print(f" -> [PASS] Valid Admin created team member '{test_member['name']}' ({test_id})")

    # 4. Storage Architecture Verification
    print("\n[4] Verifying Storage Architecture (React -> FastAPI -> Supabase Storage -> PostgreSQL)...")
    # Upload test image through FastAPI
    files = {"file": ("audit_team_avatar.png", b"AUDIT_IMAGE_BINARY_DATA_TEST", "image/png")}
    r = httpx.post(
        f"{BASE_URL}/api/storage/upload?folder=team",
        files=files,
        headers={"Authorization": f"Bearer {VALID_ADMIN_TOKEN}"},
    )
    assert r.status_code == 201, f"Storage upload failed: {r.text}"
    upload_res = r.json()
    uploaded_url = upload_res["url"]
    print(" -> [PASS] FastAPI uploaded asset to Supabase Storage bucket 'ieee-ssit-assets'")
    print(f" -> Public Storage URL returned: {uploaded_url}")
    assert "https://qxagvmkczvhupkrhyyaj.supabase.co" in uploaded_url
    assert "team/" in uploaded_url

    # Assign uploaded photo to team member via FastAPI
    r = httpx.put(
        f"{BASE_URL}/api/team/{test_id}",
        json={"photo": uploaded_url},
        headers={"Authorization": f"Bearer {VALID_ADMIN_TOKEN}"},
    )
    assert r.status_code == 200 and r.json()["photo"] == uploaded_url
    print(" -> [PASS] Photo URL successfully persisted in PostgreSQL database")

    # Clean up test member
    r = httpx.delete(f"{BASE_URL}/api/team/{test_id}", headers={"Authorization": f"Bearer {VALID_ADMIN_TOKEN}"})
    assert r.status_code == 200
    print(" -> [PASS] Cleaned up audit test member from PostgreSQL")

    # 5. Git & Secret Leak Checks
    print("\n[5] Verifying Git & Secret Isolation...")
    with open(".gitignore", "r") as f:
        gitignore_content = f.read()
    assert "backend/.env" in gitignore_content or ".env" in gitignore_content
    print(" -> [PASS] .env is strictly included in .gitignore")

    with open("backend/.env.example", "r") as f:
        example_content = f.read()
    assert "ieee-ssit-ssn-2026" not in example_content
    assert "eyJhbGciOi" not in example_content
    print(" -> [PASS] backend/.env.example contains placeholder values with no real secrets")

    print("\n" + "=" * 70)
    print("ALL AUDIT CHECKS PASSED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    test_audit()
