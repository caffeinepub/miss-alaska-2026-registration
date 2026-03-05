# Miss Alaska 2026 Registration

## Current State
The project exists but has no backend canister code and no frontend application components. Previous build attempts failed. Only the scaffold (system IDL, frontend lib/hooks/ui) is present.

## Requested Changes (Diff)

### Add
- Public registration form for Miss Alaska 2026 (Alakple Beauty Pageant)
- Admin dashboard (login-protected) to view all submitted registrations
- Backend canister to store registration submissions

**Registration form sections:**

**Section 1: Personal Information**
- Full Name (text)
- Date of Birth (date)
- Age (number)
- Address (text)
- Contact Number (text)
- Emergency Contact Name (text)
- Emergency Contact Phone (text)

**Section 2: Physical and Background Details**
- Height (text, e.g. feet/inches or cm)
- Weight (text, e.g. lbs or kg)
- Measurements: Bust, Waist, Hips (optional text fields)
- Education Level (text)
- Occupation/School (text)
- Hobbies/Interests (textarea)
- Talent/Skills (textarea)
- Previous Pageant Experience (textarea)

**Section 3: Media and Attachments**
- Headshot Photo (file upload, professional photo required)
- Full-Body Photo (file upload, evening wear or swimsuit)
- Bio/Platform Statement (textarea, 100-200 words)

### Modify
- Nothing existing to modify.

### Remove
- Nothing to remove.

## Implementation Plan
1. Select `authorization` and `blob-storage` components for admin login and file uploads.
2. Generate Motoko backend with:
   - `submitRegistration` -- stores all form fields + blob references for photos
   - `getRegistrations` -- admin-only, returns all submitted registrations
   - `getRegistration` -- get a single registration by ID
3. Build frontend:
   - Public page: colorful, multi-section registration form with file upload for photos
   - Admin page: login with Internet Identity, table/list view of all registrations
   - Navigation between public form and admin login
