import os
import sys

# Add project root and backend to sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from api.index import app

print("==================================================")
print("VERCEL ENTRYPOINT VERIFICATION")
print("==================================================")
print(f"[OK] App object: {type(app).__name__}")
print(f"[OK] Title: {app.title}")

expected_routes = [
    "/health",
    "/health/db",
    "/api/team",
    "/api/team/{id}",
    "/api/team/reorder",
    "/api/team/{id}/photo",
    "/api/events",
    "/api/events/{id}",
    "/api/events/{id}/duplicate",
    "/api/gallery",
    "/api/gallery/{id}",
    "/api/announcements",
    "/api/announcements/{id}",
    "/api/contact",
    "/api/contact/inquiries",
    "/api/contact/inquiries/{id}/status",
    "/api/membership/apply",
    "/api/membership/applications",
    "/api/membership/applications/{id}/status",
    "/api/newsletter/subscribe",
    "/api/newsletter/subscribers",
    "/api/settings/{key}",
    "/api/admins",
    "/api/admins/{email}",
    "/api/activity-logs",
    "/api/storage/upload",
]

registered_paths = list(app.openapi()["paths"].keys())

missing_routes = []
for req_route in expected_routes:
    if req_route in registered_paths:
        print(f" [PASS] Route found: {req_route}")
    else:
        print(f" [FAIL] Route MISSING: {req_route}")
        missing_routes.append(req_route)

assert len(missing_routes) == 0, f"Missing routes: {missing_routes}"
print("\n[SUCCESS] ALL EXPECTED VERCEL FASTAPI ROUTES ARE PRESENT AND VERIFIED!")
