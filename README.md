# IEEE SSIT · SSN Student Branch Chapter Portal & Admin CMS

A high-performance React 19 + TypeScript web application and Content Management System (CMS) for the **IEEE Society on Social Implications of Technology (SSIT), SSN College of Engineering Student Branch Chapter**.

---

## 🏛 Multi-Admin Architecture & Role-Based Access Control (RBAC)

```
                               ┌─────────────────────────────┐
                               │   Public IEEE-SSIT Portal   │
                               └──────────────┬──────────────┘
                                              │
             ┌─────────────┬──────────────────┼──────────────────┬─────────────┐
             │             │                  │                  │             │
          / (Home)      /about           /activities        /membership    /gallery & /contact
        • Hero & Stats • Mission & Vision • 2025 Calendar    • Benefits     • Filterable Gallery
        • Announcements• Focus Areas      • Publications     • How to Join  • Interactive Inquiries
        • Quick Tabs   • Student Team     • Past & Upcoming  • FAQs         • Lightbox Viewer
                                              │
                                              ▼
                                  ┌───────────────────────┐
                                  │     /admin/login      │
                                  └───────────┬───────────┘
                                              │ Google Sign-In (Firebase Auth)
                                              ▼
                                  ┌───────────────────────┐
                                  │   Role Determination  │
                                  └─────┬───────────┬─────┘
                     Is @ssn.edu.in     │           │ Non-Admin Account /
                     AND in Admin List? │           │ Non-SSN Domain
                                  YES ↙               ↘ NO
              ┌─────────────────────────┐       ┌─────────────────────────┐
              │    /admin/dashboard     │       │      Access Denied      │
              │       (Role: Admin)     │       │       (Role: User)      │
              └────────────┬────────────┘       └─────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬──────────────────┐
        │                  │                  │                  │
     Events Manager    Gallery Manager    Admin Roster      Contact Inbox
     • Add/Edit/Delete • Photo Uploads   • Central Config   • Submissions
     • Upcoming/Past   • Categorization  • Student Team     • Status Management
```

---

## 👥 Approved Core Admin / Developer Team

The following SSN student accounts are configured with **Admin / Developer** permissions:

1. **`nathaniel2470009@ssn.edu.in`** (Nathaniel)
2. **`sharruk2470048@ssn.edu.in`** (Sharruk)
3. **`shriram2410046@ssn.edu.in`** (Shriram)
4. **`varun2410158@ssn.edu.in`** (Varun)
5. **`harshika2410326@ssn.edu.in`** (Harshika)
6. **`vedika2410432@ssn.edu.in`** (Vedika)
7. **`harshini2410197@ssn.edu.in`** (Harshini)
8. **`pranav2410328@ssn.edu.in`** (Pranav)

---

## 🚀 Environment Setup & Security

1. **Copy the example configuration**:
   ```bash
   cp .env.example .env
   ```
2. **Add your Firebase Web App credentials** in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
3. **Security Best Practices**:
   - Never commit `.env` or service-account JSON keys to version control.
   - Client-side code requires only standard Firebase Web configuration (API key, Project ID).
   - Server-level security is enforced by Cloud Firestore Security Rules.

---

## ➕ How to Add Additional Admins in the Future

The multi-admin architecture uses a centralized configuration system (`src/firebase/adminConfig.ts`).

To add more student admins later:
1. Open [`src/firebase/adminConfig.ts`](file:///d:/CLUB/IEEE-SSIT/src/firebase/adminConfig.ts).
2. Append the new student's official `@ssn.edu.in` email to the `DEFAULT_ADMIN_EMAILS` array:
   ```typescript
   export const DEFAULT_ADMIN_EMAILS: string[] = [
     "nathaniel2470009@ssn.edu.in",
     "sharruk2470048@ssn.edu.in",
     "shriram2410046@ssn.edu.in",
     "varun2410158@ssn.edu.in",
     "harshika2410326@ssn.edu.in",
     "vedika2410432@ssn.edu.in",
     "newstudent24xxxxx@ssn.edu.in", // <-- Add new student email here
   ]
   ```
3. *(Optional)* You can also dynamically add or remove admin emails directly inside the running CMS via the **Admins & Team** tab on `/admin/dashboard`!

---

## 🔐 3-Tier Security & Role Distinction

The portal enforces three distinct user access tiers:

| Tier | Status | Access Level | UI Experience |
|---|---|---|---|
| **Unauthenticated Visitor** | Public guest browsing the site | Read-only public pages | Standard navigation; "Admin" lock button in header |
| **Normal Authenticated User** | Signed in with Google / SSN, but not on Admin list | Read-only public pages | Email chip & Sign-out button in header; `/admin/dashboard` and database writes strictly blocked |
| **Authorized Admin** | Signed in with approved `@ssn.edu.in` account | Full CMS read & write permissions | "Admin CMS" badge with active emerald dot; full access to `/admin/dashboard` |

---

## 🔒 Firestore Security Rules

Deploy [`firestore.rules`](./firestore.rules) to your Firebase project:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null && request.auth.token.email != null;
    }

    function isSSNEmail() {
      return isAuthenticated() && request.auth.token.email.matches('.*@ssn[.]edu[.]in$');
    }

    function isHardcodedAdmin() {
      return request.auth.token.email in [
        'nathaniel2470009@ssn.edu.in',
        'sharruk2470048@ssn.edu.in',
        'shriram2410046@ssn.edu.in',
        'varun2410158@ssn.edu.in',
        'harshika2410326@ssn.edu.in',
        'vedika2410432@ssn.edu.in',
        'harshini2410197@ssn.edu.in',
        'pranav2410328@ssn.edu.in'
      ];
    }

    function isApprovedAdmin() {
      return isSSNEmail() && (
        isHardcodedAdmin() ||
        (
          exists(/databases/$(database)/documents/admins/allowlist) &&
          request.auth.token.email in get(/databases/$(database)/documents/admins/allowlist).data.emails
        )
      );
    }

    match /admins/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isApprovedAdmin();
    }

    match /activity_logs/{logId} {
      allow read, create: if isApprovedAdmin();
      allow update, delete: if false;
    }

    match /settings/{document=**} {
      allow read: if true;
      allow write: if isApprovedAdmin();
    }

    match /events/{eventId} {
      allow read: if true;
      allow write: if isApprovedAdmin();
    }

    match /gallery/{photoId} {
      allow read: if true;
      allow write: if isApprovedAdmin();
    }

    match /team/{memberId} {
      allow read: if true;
      allow write: if isApprovedAdmin();
    }

    match /announcements/{announcementId} {
      allow read: if true;
      allow write: if isApprovedAdmin();
    }

    match /contact_inquiries/{inquiryId} {
      allow create: if true;
      allow read, update, delete: if isApprovedAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🛠 How to Test Locally

```bash
# 1. Start the Vite development server
npm run dev

# 2. Open http://localhost:5173/admin/login in your browser
# 3. In development mode (import.meta.env.DEV), use the quick test simulator:
#    - Any of the 6 approved admins (Granted access to /admin/dashboard)
#    - A normal SSN student (Access Restricted message)
#    - A non-SSN account (Non-SSN rejected message)
```
