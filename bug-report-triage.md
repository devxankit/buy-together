# Buy Together — Bug Report Triage

Annotated analysis of the QA bug sheet (177 rows). Each row tagged with **Category**, **Verdict**, **Priority**, and a short **Note**.

## Summary

| Verdict | Count | Meaning |
|---|---|---|
| ✅ Valid Bug | 136 | Genuine defects — fix these |
| 💡 Suggestion | 21 | Feature/enhancement requests — optional, not defects |
| ❓ Decision Needed | 6 | "Coming soon" / static-data items — depends if backend pending |
| ❌ Not a Bug | 1 | #3 email capitals (valid by design) |
| ☑️ Resolved | 11 | Already fixed |
| ⬜ Blank | 2 | Empty rows (#137, #155) |

**Valid bugs by priority:** 🔴 Critical = 3 · 🟠 High = 17 · 🟡 Medium / 🟢 Low = ~116

---

## 🛠️ Fixes Applied (2026-06-30)

All confirmed defects below are fixed and the frontend build + backend syntax checks pass.

| # | Fix | File(s) |
|---|---|---|
| 12 | Approval-queue "Review" button now navigates to the vendor (focused search) | `admin/pages/Dashboard.jsx` |
| 27 | Signup name/phone/agreed now persisted to `sessionStorage`; survives Terms/Privacy round-trip | `auth/Signup.jsx` |
| 28 | Signup name format validation | `auth/Signup.jsx` |
| 47 | Liking a message no longer scrolls chat to bottom (only new messages do) | `chat/GroupChat.jsx` |
| 49 | Share now uses the native share sheet (`navigator.share`), clipboard fallback | `chat/GroupChat.jsx` |
| 56 | Admin group create now requires a target product (FE + BE) | `admin/pages/Groups.jsx`, `validations/admin.validation.js` |
| 58 | Admin group "Closes on" rejects past dates (`min` + submit check) | `admin/pages/Groups.jsx` |
| 69 | Chat opens instantly at the bottom (no smooth-scroll animation on load) | `chat/GroupChat.jsx` |
| 89 | Privacy Settings now has a Save button + loads/persists via `localStorage` | `profile/PrivacySettings.jsx` |
| 124, 125 | Poll option / "View Poll" clicks no longer bubble to the like handler | `chat/GroupChat.jsx` |
| 126 | Poll rejects duplicate options | `chat/GroupChat.jsx` |
| 127 | Chat images open on click | `chat/GroupChat.jsx` |
| 131 | Double-click no longer opens reply | `chat/GroupChat.jsx` |
| 136 | Duplicate-send guard added (rapid taps no longer post twice) | `hooks/useChat.js` |
| 147 | Profile stat tiles route to their pages (Deals Booked → /deals, etc.) | `profile/Profile.jsx` |
| 153 | Locked/completed/flagged groups now reject consumer joins | `services/group.service.js`, `controllers/group.controller.js` |
| 13,14,39,41 | Add-buyer name/location validation | `admin/pages/Users.jsx` |
| 93,96,97,98,100 | Vendor owner-name/email/website/city/address validation | `admin/pages/Vendors.jsx` |
| 42,43,44 | Profile email/birthdate(no-future)/city validation + date `max` | `profile/PersonalInfo.jsx` |
| 61 | Category hex-code validation | `admin/pages/Categories.jsx` |
| 156 | Content-page contact-email validation | `admin/pages/ContentPages.jsx` |
| 160,163,164,170,171,172,173 | Settings phone/email/stat/admin-field validation | `admin/pages/Settings.jsx` |
| 46 | Help Center: single context-aware back button (removed duplicate) | `profile/HelpCenter.jsx` |
| 83 | Group Details: removed duplicate inline join button (kept fixed bottom CTA) | `groups/GroupDetails.jsx` |
| 148 | Profile: removed duplicate "Help & Support" tile (kept "Help Center") | `profile/Profile.jsx` |

New shared util: `frontend/src/utils/validators.js`.

### Wave 2 fixes (remaining-88 pass, 2026-06-30)

| # | Fix | File(s) |
|---|---|---|
| 33 | "View all activity" now opens the dashboard (was Fraud & Risk) | `admin/layout/Topbar.jsx` |
| 54 | Action column now has an "Actions" heading | `admin/pages/Groups.jsx` |
| 55 | Lock-deal button now toggles to an Unlock button (no longer disappears) | `admin/pages/Groups.jsx` |
| 60 | Chart subtitle now reads "GDV" (was "GMV") | `admin/pages/Dashboard.jsx` |
| 115 | Fraud "Investigate" opens the specific group/account (focused search) | `admin/pages/Fraud.jsx` |
| 158 | Push image preview now clears after sending (ImageUploader resets on empty value) | `admin/components/ImageUploader.jsx` |
| 159 | Changing target platform no longer submits/sends (SegmentTabs `type="button"`) | `admin/components/SegmentTabs.jsx` |
| 114, 118, 119 | Long ticket text now wraps instead of overflowing the container | `admin/pages/Support.jsx`, `profile/HelpCenter.jsx` |
| 76 | Trending "See All" now stays in the groups list (was redirecting home) | `groups/components/TrendingGroups.jsx` |

Note: **#31** (admin notifications "not clickable") — they already have a click handler (mark-as-read), so they are clickable; no change needed.

### Wave 3 fixes (2026-06-30)

| # | Fix | File(s) |
|---|---|---|
| 78, 154 | "My Groups" tab now shows only groups the user created (Joined has its own tab) | `groups/GroupsList.jsx` |
| 73, 79 | Group tab is remembered, so returning from a group lands on the tab you came from | `groups/GroupsList.jsx` |
| 66, 67 | Message composer now shows only on the Chat tab (hidden on Polls/Members/Media) | `chat/GroupChat.jsx` |
| 135 | "Report User" is hidden in a self-chat (can't report yourself) | `chat/PersonalChat.jsx` |

Verified **not a bug** during this wave: **#80** (browse-by-category "See all" already navigates to `/all-categories`), **#107** (create-group image URL is already used in preview + payload).

**Already handled (no fix needed):** #40, #94, #99 (phone/pincode validated), #175 (admin password length already validated).

**Not fixed — needs your input / manual confirmation:**
- **#150** (Explore "second create button") — only one create button exists in code; couldn't locate the reported duplicate. Needs a screenshot.
- **#24, #88** — by design (auto-signup / "coming soon" placeholders).
- Runtime/visual items (camera, push delivery, dark-mode contrast) — need the running app.

### Wave 4 — feature work (2026-06-30)

Two feature-sized items built end-to-end (backend + frontend, build-verified):

| # | Feature | Files |
|---|---|---|
| 120 | **Support tickets are now realtime.** Admin replies appear in the user's Help Center instantly (and vice-versa) with no refresh; the admin support queue + counts update live when any ticket is created/replied/changed. Rides the existing `/chat` Socket.IO namespace: new `join_ticket`/`leave_ticket` rooms + a role-based `admins` room; emits `ticket_update` (full ticket to thread viewers + owner) and `ticket_changed` (queue ping to admins). Best-effort + non-throwing — a socket hiccup never breaks the REST reply. | **BE:** `sockets/chat.socket.js`, `sockets/ticket.socket.js` (new), `controllers/ticket.controller.js` · **FE:** `profile/HelpCenter.jsx`, `admin/pages/Support.jsx`, reuses `services/socket.js` |
| 34, 35, 36 | **Admin dashboard now runs on live data.** New `GET /admin/dashboard` returns real computed values: KPI cards (total users / active groups / vendors / pending approvals) with real 12-month sparklines + month-over-month deltas (#35); the bar chart now shows real monthly groups-created (relabelled from the static GDV mock); Category Demand donut from real group categories; **Top Regions aggregated from real group locations — so whatever cities actually have groups show up, fixing the "Delhi missing" data gap (#34)**; Recent Activity feed built from the newest real groups/vendors/sign-ups with live "time ago" (#36). Polls every 30s; falls back to the illustrative mock if the request fails. | **BE:** `services/admin.service.js` (`getDashboard`), `controllers/admin.controller.js`, `routes/admin.routes.js` · **FE:** `services/admin.api.js`, `admin/pages/Dashboard.jsx` |

**#37 (header notifications "static") — already live, no change needed.** The Topbar bell is already wired to the real DB-backed `/notifications` endpoint (`notification.api.js`) and polls every 30s; the old static `notifications` mock array is unused. It shows "No notifications" only because nothing currently *generates* admin notification docs — that's a separate feature (event→notification pipeline), not a static-data bug.

> Note on the dashboard's remaining decorative widgets — the **Demand Metrics** mini-cards (Demand Index/Conversion/etc.), the **Demand Heatmap**, **Top Contributors**, and the **Approval Queue** sample list are still illustrative mock: they need either analytics not yet tracked (conversion, intent scores) or are vanity visuals. The four meaningful, data-backed widgets (#34/35/36) are now live.

### Wave 5 — codeable UI/functional fixes (2026-06-30)

| # | Fix | File(s) |
|---|---|---|
| 103 | "Completed" tab in Joined Groups now also includes `locked` groups (a finished deal can be completed **or** locked), so completed groups actually appear | `groups/GroupsList.jsx` |
| 86 | Profile "View Benefits" now opens a benefits sheet (was a dead button) | `profile/Profile.jsx` |
| 25 | Login + Signup "Contact Support" is now a real `mailto:` link | `auth/Login.jsx`, `auth/Signup.jsx` |
| 111 | Create-group form is now saved to `sessionStorage` as you type and restored after a refresh / navigate-away (cleared on successful create) | `groups/CreateGroup.jsx` |

Verified **not a bug**: **#112** (admin Banners cover preview) — `ImageUploader` already shows a live preview from `value` (`previewSrc = localPreview || value`) and has a dedicated "…or paste an image URL" input, so pasting a URL already renders the cover. No change needed.

**Still need the running app (visual / device — not blindly editable):**
- **Dark-mode contrast #140–145** — theme tokens are correct (`--ink:#F4F4F5` on `--surface-alt:#121214`), and the create-group inputs already use them; remaining cases are localized hardcoded slate/hex colors in specific components. Need a dark-mode visual pass to pinpoint each — a blind color sweep would risk the light theme.
- **Layout #21, 22, 90, 109, 122, 123** (fixed header/footer/launch-button, fields-above-keyboard, filter backdrop) — position/keyboard behaviour best tuned with the app open.
- **Cosmetic #30, 74, 75, 81, 91** (gaps, overflow, share icon, status-bar colour).

---

## Code Verification Log

Status legend: **Confirmed** = defect exists in code · **Not Reproduced** = code is correct/complete, likely false report or already resolved (needs manual test to be 100% sure) · **By Design** = behaves as intentionally coded, product decision not a bug · **Needs Manual Test** = runtime-only behavior, cannot confirm from code alone.

### Critical batch (verified 2026-06-30)

| # | Verdict after code check | Evidence |
|---|---|---|
| 17 | **Not Reproduced** (likely false / already resolved) | Admin create-group is fully implemented end-to-end: `Groups.jsx` `GroupModal.submit` → `createGroupAdmin` → `POST /admin/groups` → `adminValidation.createGroup` (title required, rest optional) → `adminController.createGroup` → `groupService.createGroupAdmin`. No code defect blocks creation. Needs a manual repro (was likely a transient/env error). |
| 24 | **By Design** (not a bug) | `auth.service.js requestLoginOtp` intentionally auto-signs-up new numbers ("Works for any valid number — if it isn't registered yet, the account is created on successful verification"). `verifyOtpAndAuth` still requires a name for brand-new numbers. This is a deliberate auto-signup product choice — decide if you want to block login for unregistered numbers. |
| 117 | **Not Reproduced** (backend fully enforces) | Suspension is enforced in 3 places: login blocked (`assertActive`), every authenticated request re-checks `status===SUSPENDED` (`auth.middleware.js:32`), and suspending busts the auth cache immediately (`admin.service.js:248 bustUser`). API-level enforcement is correct. Possible minor gap: frontend may not react to a 403 instantly and an open socket may not force-disconnect — worth a manual test, but not the reported "active without any issue". |

### High batch (verified 2026-06-30)

| # | Verdict after code check | Evidence |
|---|---|---|
| 12 | **✅ Confirmed** | `Dashboard.jsx:294` — the "Review" button in the Approval Queue has **no `onClick`**. Dead button. |
| 23 | **⚠️ Not Reproduced** | `Home.jsx:248` — search submit does `navigate('/categories', { state:{ searchQuery } })`. It routes with the query; verify the Categories page actually filters by it. |
| 27 | **✅ Confirmed** | `Signup.jsx` keeps `name/phone/agreed` in local `useState` only; navigating to `/terms` or `/privacy-policy` unmounts Signup, so back-navigation resets the fields. No persistence. |
| 56 | **✅ Confirmed** | `admin.validation.js:164` — only `title` is `.required()`; `productName` is optional. A group can be created with just a name. |
| 59 | **⚠️ Not Reproduced** | `group.service.js:197` atomically caps joins at `spotsTotal` (`$expr`+`$size`), so spots can't be surpassed. Minor gap: status isn't auto-flipped to full/closed when the target is hit. |
| 64 | **❔ Needs Manual Test** | Runtime notification delivery — can't confirm statically. |
| 70 | **⚠️ Not Reproduced** | `GroupsList.jsx:351-365` — sort is implemented as working buttons (Default/Popularity/Deadline) feeding a `useMemo` re-sort. No broken dropdown found. |
| 85 | **❔ Needs Manual Test** | `Notifications.jsx` fetches from the real API; "not received" is a runtime/FCM delivery issue. |
| 89 | **✅ Confirmed** | `PrivacySettings.jsx` — toggles are local `useState` defaults, **no Save button, no API load/persist**. Leaving the page resets them. Matches report exactly. |
| 104 | **❔ Needs Manual Test** | Deferred to medium batch (DealConfirm/GroupDetails data shape). |
| 106 | **❔ Needs Manual Test** | Deferred to medium batch (unit count source). |
| 116 | **⚠️ Not Reproduced** | `Fraud.jsx:98` — Flag calls `updateGroupAdmin(id,{status:'flagged'})`; flagged groups are excluded from trending (`group.service.js:73`). Works. |
| 120 | **✅ Likely Confirmed** | No socket/subscription in the ticket/HelpCenter UI — replies aren't pushed in realtime; a refresh is needed. Matches report. |
| 136 | **✅ Likely Confirmed** | `useChat.js:233 sendMessage` has **no in-flight guard**; rapid taps can fire multiple `sendMessageApi` calls (unless the composer disables the button — verify). |
| 145 | **❔ Needs Manual Test** | Theme sets both `data-theme='dark'` and `.dark`, so tokens flip correctly. Remaining dark-mode issues (#140–145) are localized hardcoded-color contrast cases — need visual check. |
| 153 | **✅ Confirmed** | `group.service.js addMember` has **no group-status guard** — only a headcount cap. A `locked`/`completed`/`closing` group still accepts joins as long as spots remain. |
| 157 | **❔ Needs Manual Test** | User notifications panel fetches real API; admin→user delivery is runtime. |

### Validation batch (verified 2026-06-30)

Checked each form's submit handler + input attributes (frontend) against the reported rule.

**⚠️ Already handled — NOT bugs (3, +2 partial):**
| # | Evidence |
|---|---|
| 40 | Add-buyer phone validated `/^[6-9]\d{9}$/` (`Users.jsx:101`). |
| 94 | Vendor phone validated `/^[6-9]\d{9}$/` (`Vendors.jsx:135`). |
| 99 | Vendor pincode validated `/^\d{6}$/` (`Vendors.jsx:140`). |
| 95 | Vendor GSTIN validated (`Vendors.jsx:143`) — but on submit, not "instant". Partial. |
| 161 / 174 | Email fields use native `type="email"` but no custom real-time validation. Partial. |

**✅ Confirmed — missing validation (real bugs):**
| # | Field | Evidence |
|---|---|---|
| 13, 39 | Buyer name | `Users.jsx:99` only checks non-empty; accepts numbers/symbols. |
| 14, 41 | Buyer location | only `.trim()`, no format check. |
| 28 | Signup name | local field, no char-only check. |
| 42 | Profile email | `PersonalInfo.jsx` submit only `.trim()`. |
| 43 | Profile birthdate | `type="date"` with no `max`, future dates allowed. |
| 44 | Profile city | no char validation. |
| 58 | Admin group "Closes on" | `Groups.jsx:393` `<input type="date">` has no `min`, past dates allowed. |
| 61 | Category hex code | `Categories.jsx:103` only `.trim()`, no hex regex. |
| 93 | Vendor owner name | only `.trim()`. |
| 96 | Vendor email | only `.trim()`, no format check. |
| 97 | Vendor website | only `.trim()`, no URL check. |
| 98 | Vendor city | required but no char check. |
| 100 | Vendor address | only `.trim()`. |
| 126 | Poll options | `GroupChat.jsx:751` checks non-empty only, no duplicate check. |
| 156 | Content-page email | no validation. |
| 160, 173 | Settings/admin phone | no 10-digit check. |
| 163, 164, 170, 171 | Settings live-activity stats | no numeric/char validation. |
| 172 | Add-admin name | only non-empty. |
| 175 | Add-admin password | no length check (best-effort). |

**⚠️ Partial / minor:** #57 (admin location is Google autocomplete but allows free text), #108 (create-group trims & enforces min length — "space as char" largely handled).

**Validation batch tally:** ~24 Confirmed missing · 3 already handled (not bugs) · ~5 partial.

### Medium/Low functional + navigation batch (verified 2026-06-30)

**Static/placeholder data — Confirmed (product decision to wire up):**
| # | Evidence |
|---|---|
| 34, 35, 36, 37 | Admin `Dashboard.jsx` imports from `data/mockData.js` and a hardcoded `topRegions` array — unlike Groups/Users/Vendors/Fraud which use real APIs. Cards, recent activity, notifications and region chart are all static. (Delhi is in `heatmapRegions` but not the hardcoded `topRegions`.) |
| 87, 88 | `Profile.jsx:244` "Order tracking coming soon" toast and the "rebuild soon" screen are intentional placeholders (`showToast('… coming soon')`). By design until built. |

**Chat interaction cluster — Confirmed (logic in `GroupChat.jsx`):**
| # | Evidence |
|---|---|
| 47 | `ChatFeed` `scrollIntoView` (line 514) fires on every `messages` change, so liking a message scrolls to bottom. |
| 48 | `handleStart` (line 247) conflates single-tap / double-tap-like / 2s long-press in one handler — interaction model needs rework. |
| 49, 105 | Share calls `navigator.clipboard.writeText` (line 1752), copying a link instead of opening the native share sheet. |
| 69 | On open, `scrollIntoView({behavior:'smooth'})` animates a scroll-to-bottom instead of starting there. |
| 124, 125 | Poll option clicks (`onVote`, line 471) bubble to the message's tap handlers, so interacting with a poll can like the poll message. |
| 127 | Chat images have no click/lightbox handler — can't open. |
| 131 | `handleDoubleClick` (line 281) calls `onReply` — double-click opens reply (report says it shouldn't). |

**Other Confirmed:**
| # | Evidence |
|---|---|
| 147 | `Profile.jsx` stat tiles (Groups Joined/Created/Deals/Active Pools, lines 68-71) have no `onClick` — not navigable. |

**❔ Needs Manual Test — runtime/visual (best-effort from code):** camera uploads #15,16,45,53 (device APIs); push/FCM delivery #26,31,33,63,64,65,85,129,130,132,133,134,157; OTP paste #29; unit-count data #104,106; card join-state #152. These need the running app to confirm; code paths exist but behavior is environment/data-dependent.

### UI / layout / dark-mode batch — Needs Manual Test (visual)

These are genuine but **cosmetic and best confirmed visually** (duplicate buttons, overflow, fixed headers/footers, spacing, dark-mode contrast). Static reading can't reliably confirm pixel/contrast issues. Treat as a single "UI polish" workstream:
- **Layout/spacing/overflow:** #21, 22, 25, 30, 46, 54, 60, 62, 74, 81, 84, 90, 91, 92, 109, 113, 114, 118, 119, 122, 123, 176
- **Duplicate elements (likely quick Confirmed):** #46 (2 back buttons), #83 (2 join buttons), #148 (2 help@support), #150 (2 create-group buttons)
- **Dark-mode contrast:** #140, 141, 142, 143, 144, 145 — theme tokens flip correctly (`data-theme='dark'`), so these are localized hardcoded-color cases.


- **Critical (3):** #17 groups can't be created · #24 login without signup · #117 suspended user still active
- **High (17):** #12, #23, #27, #56, #59, #64, #70, #85, #89, #104, #106, #116, #120, #136, #145, #153, #157
- **Suggestions (21):** #11, #32, #38, #52, #60, #68, #75, #77, #84, #91, #101, #102, #121, #149, #162, #165, #166, #167, #168, #169, #177
- **Decision Needed (6):** #35, #36, #37, #82, #87, #88

---

## Full Triage

| # | App | Module | Sub module | Description | Orig. | Category | Verdict | Priority | Note |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Admin | Favicon | | Favicon icon should match app icon | Resolved | Resolved | Resolved | — | Already fixed |
| 2 | Admin | Website title | | Title should show frontend as website name | Resolved | Resolved | Resolved | — | Already fixed |
| 3 | Admin | Login | | Email field accepts capital letters | New | NotABug | Not a Bug | Low | Capitals valid in emails; not a defect |
| 4 | Admin | Login | | Forgot password not clickable | Resolved | Resolved | Resolved | — | Already fixed |
| 5 | Admin | Menu bar | Logout | Logout should ask confirmation | Resolved | Resolved | Resolved | — | Already fixed |
| 6 | Admin | Menu bar | | Clicking logo should redirect to dashboard | Resolved | Resolved | Resolved | — | Already fixed |
| 7 | User | All | | User app zooming in/out | Resolved | Resolved | Resolved | — | Already fixed |
| 8 | Admin | Menu bar | | Logo should be pinned at top | Resolved | Resolved | Resolved | — | Already fixed |
| 9 | Admin | Dashboard | Header | Search bar not functional | Resolved | Resolved | Resolved | — | Already fixed |
| 10 | Admin | Dashboard | | Export button not working | Resolved | Resolved | Resolved | — | Already fixed |
| 11 | Admin | Dashboard | | Cards should be clickable | New | Enhancement | Suggestion | Low | Nice-to-have navigation |
| 12 | Admin | Dashboard | Approval queue | Review buttons not working | New | Functional | ✅ Fixed | High | Dashboard.jsx:294 Review button has no onClick |
| 13 | Admin | User | Add buyer | Name should be in format | New | Validation | ✅ Fixed | Medium | Input validation |
| 14 | Admin | User | Add buyer | Location should be in format | New | Validation | ✅ Fixed | Medium | Input validation |
| 15 | User | Create | Create group | Group photo cannot upload via camera | New | Functional | Valid Bug | Medium | Verify camera/permission handling |
| 16 | User | Groups | Create group | Images cannot upload via camera | New | Functional | Valid Bug | Medium | Verify camera/permission handling |
| 17 | Admin | Groups | Create group | New groups cannot be created | New | Functional | ⚠️ Not Reproduced | Critical | Create flow fully implemented FE+BE; no code defect. Needs manual repro |
| 18 | Admin | Categories | Create categories | Multiple categories same display order | Resolved | Resolved | Resolved | — | Already fixed |
| 19 | Admin | Dashboard | | Add campaign redirects to groups page | Resolved | Resolved | Resolved | — | Already fixed |
| 20 | User | Home | | Back should follow app flow not user flow | New | Navigation | Valid Bug | Medium | Navigation logic |
| 21 | User | Home | | Footer should be fixed not move with keyboard | New | UI-Layout | Valid Bug | Medium | Layout |
| 22 | User | Home | | Space between footer and phone nav bar | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 23 | User | Home | Search bar | Search bar not working | New | Functional | ⚠️ Not Reproduced | High | Routes to /categories with query; verify categories filters |
| 24 | User | Login | | User can login without signup | New | Functional | ✅ By Design | Critical | Auto-signup is intentional (auth.service.js). Product decision, not a defect |
| 25 | User | Login,signup | | Contact support should be clickable | New | UI-Layout | ✅ Fixed (Wave 5) | Low | Now a mailto: link |
| 26 | User | Home | | Browser does not support notification popups on login | New | Functional | Valid Bug | Medium | PWA/platform notification |
| 27 | User | Login,signup | | Entering details then T&C/privacy then back removes details | New | Functional | ✅ Fixed | High | Signup.jsx local state lost on unmount; no persistence |
| 28 | User | Signup | | Full name should be in format | New | Validation | ✅ Fixed | Medium | Input validation |
| 29 | User | Login,signup | | OTP not pasting from keyboard | New | Functional | Valid Bug | Medium | UX defect |
| 30 | User | Create group | Location | Gap between location search bar and suggestions | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 31 | Admin | Dashboard | Header | Notifications not clickable | New | Functional | Valid Bug | Medium | Broken interaction |
| 32 | Admin | Dashboard | Header | Read notifications should be marked read | New | Enhancement | Suggestion | Low | Feature |
| 33 | Admin | Dashboard | Header | View all activity redirects to fraud and risk | New | Functional | Valid Bug | Medium | Wrong redirect |
| 34 | Admin | Dashboard | Top regions | Delhi data missing in chart | New | Functional | ✅ Fixed (Wave 4) | Medium | Top Regions now aggregated from real group locations — data-driven |
| 35 | Admin | Dashboard | All cards | Static info displayed | New | StaticData | ✅ Fixed (Wave 4) | Medium | KPI cards + chart + donut now from GET /admin/dashboard |
| 36 | Admin | Dashboard | Recent activity | Static info displayed | New | StaticData | ✅ Fixed (Wave 4) | Medium | Activity feed now from real recent groups/vendors/sign-ups |
| 37 | Admin | Dashboard | Header | Notifications showing static info | New | StaticData | ✅ Already Live | Medium | Bell already wired to DB-backed /notifications (mock array unused) |
| 38 | Admin | All | All | Date format should be DD/MM/YYYY across site | New | Enhancement | Suggestion | Low | Consistency request |
| 39 | Admin | User | Add buyer | Full name only characters | New | Validation | ✅ Fixed | Medium | Input validation |
| 40 | Admin | User | Add buyer | Mobile only 10 numbers | New | Validation | Valid Bug | Medium | Input validation |
| 41 | Admin | User | Add buyer | Location should reject invalid input | New | Validation | ✅ Fixed | Medium | Input validation |
| 42 | User | Profile | Edit details | Email should be in format | New | Validation | ✅ Fixed | Medium | Input validation |
| 43 | User | Profile | Edit details | Birthdate should not accept future dates | New | Validation | ✅ Fixed | Medium | Input validation |
| 44 | User | Profile | Edit details | City accepting numbers/special chars | New | Validation | ✅ Fixed | Medium | Input validation |
| 45 | User | Profile | Edit details | Profile photo cannot upload via camera | New | Functional | Valid Bug | Medium | Verify camera handling |
| 46 | User | Profile | Help support | Help support page has 2 back buttons | New | UI-Layout | ✅ Fixed | Low | Duplicate element |
| 47 | User | My groups | Open group chat | Liking/disliking message redirects to bottom | New | Functional | ✅ Fixed | Medium | Scroll/anchor defect |
| 48 | User | My groups | Open group chat | Tap likes message; should be double-tap | New | Functional | Valid Bug | Medium | Interaction defect |
| 49 | User | My groups | Open group chat | Share button copies link instead of share options | New | Functional | ✅ Fixed | Medium | Wrong behavior |
| 50 | User | My groups | Open group chat | Gallery quick share shows camera options | New | Functional | Valid Bug | Medium | Wrong picker |
| 51 | User | My groups | Open group chat | Camera quick share shows files | New | Functional | Valid Bug | Medium | Wrong picker |
| 52 | Admin | User | | Add filter for unverified/OTP ready | New | Enhancement | Suggestion | Low | Feature |
| 53 | User | My groups | Camera | Quickshare camera not working | New | Functional | Valid Bug | Medium | Broken feature |
| 54 | Admin | Groups | | Column heading missing for action column | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 55 | Admin | Groups | Action | Lock deal option disappears (should become unlock) | New | Functional | Valid Bug | Medium | Toggle logic |
| 56 | Admin | Groups | Create group | Group created with only name no target product | New | Validation | ✅ Fixed | High | admin.validation.js:164 only title required |
| 57 | Admin | Groups | Create group | Location should reject invalid input | New | Validation | Valid Bug | Medium | Input validation |
| 58 | Admin | Groups | Create group | Closes-on date should not be past | New | Validation | ✅ Fixed | Medium | Input validation |
| 59 | Admin | Groups | | Target spots should not be surpassed | New | Functional | ⚠️ Mostly Not Reproduced | High | Join cap enforced (group.service.js:197); no auto full/closed status flip |
| 60 | Admin | Dashboard | Gross deal value | Short form should be GDV in description | New | UI-Layout | Suggestion | Low | Text tweak |
| 61 | Admin | Categories | New category | Hex code field rejects wrong format | New | Validation | ✅ Fixed | Low | Input validation |
| 62 | User | My groups | Open group poll | Poll line extends outside inner block | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 63 | User | My groups | Open group | Pin group does not pin at top | New | Functional | Valid Bug | Medium | Broken feature |
| 64 | User | My groups | Open group | Group chat notifications not displayed for some groups | New | Functional | Valid Bug | High | Notification defect |
| 65 | User | My groups | Open group | Muted group still shows notifications | New | Functional | Valid Bug | Medium | Mute logic |
| 66 | User | My groups | Open group | Polls/member/media should not have type-message option | New | UI-Layout | Valid Bug | Medium | Wrong UI element |
| 67 | User | My groups | Open group | Type message in polls/members redirects to chat | New | Functional | Valid Bug | Medium | Wrong redirect |
| 68 | User | My groups | Open group poll | Create poll remove-option should exist | New | Enhancement | Suggestion | Low | Feature |
| 69 | User | My groups | Open group | Page scrolls to bottom when opening | New | Functional | Valid Bug | Medium | Scroll anchor |
| 70 | User | My groups | Sort | Sort dropdown not opening | New | Functional | ⚠️ Not Reproduced | High | GroupsList.jsx sort works as buttons; no broken dropdown found |
| 71 | Admin | My groups | | Closing soon and nearby not functioning | New | Functional | Valid Bug | Medium | Broken filters |
| 72 | User | My groups | New | New shows all groups not recent | New | Functional | Valid Bug | Medium | Wrong data |
| 73 | User | My groups | | Joined groups open then back redirects to my groups | New | Navigation | Valid Bug | Medium | Navigation |
| 74 | User | My groups | All groups | Trending description out of card | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 75 | User | My groups | Filter | Filter background should blur | New | UI-Layout | Suggestion | Low | Polish |
| 76 | User | My groups | Trending right now | See all redirects to home not all trending | New | Functional | Valid Bug | Medium | Wrong redirect |
| 77 | User | My groups | Open group | Buyer card should show all buyers | New | Enhancement | Suggestion | Low | Feature |
| 78 | User | Explore | My groups | My groups should show groups created by me | New | Functional | Valid Bug | Medium | Logic (dup of 154) |
| 79 | User | Explore | | Refresh on submodule should stay not redirect to trending | New | Functional | Valid Bug | Medium | Routing/state |
| 80 | User | Explore | Browse by category | See all not working | New | Functional | Valid Bug | Medium | Broken feature |
| 81 | User | Explore | Open group | Share icon should be proper | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 82 | User | Explore | Open group | Three dots show coming soon | New | Enhancement | Decision Needed | Low | Feature pending |
| 83 | User | Explore | Open group | Two join buttons on same page remove one | New | UI-Layout | ✅ Fixed | Low | Duplicate element |
| 84 | Admin | Categories | Status | Change hidden status to inactive (and other tables) | New | UI-Layout | Suggestion | Low | Label/terminology |
| 85 | User | Notifications | | App notifications not received | New | Functional | Valid Bug | High | Notification delivery |
| 86 | User | Profile | Verified member | View benefits not clickable | New | Functional | ✅ Fixed (Wave 5) | Low | Opens benefits sheet |
| 87 | User | Profile | My deals | Screen will rebuild soon displayed | New | Enhancement | Decision Needed | Low | Feature pending |
| 88 | User | Profile | My order | Order tracking coming soon popup | New | Enhancement | Decision Needed | Low | Feature pending |
| 89 | User | Profile | Privacy settings | No save button; toggles revert on back | New | Functional | ✅ Fixed | High | PrivacySettings.jsx local-only state, no Save/persist |
| 90 | User | All modules | | Header should be fixed not move with page | New | UI-Layout | Valid Bug | Medium | Layout |
| 91 | User | Home | | Status bar should match app theme | New | UI-Layout | Suggestion | Low | Polish |
| 92 | Admin | Banners | Redirect link | Banner ID too long | New | UI-Layout | Valid Bug | Low | Cosmetic/display |
| 93 | Admin | Vendors | Onboard vendor | Owner/contact name only characters | New | Validation | ✅ Fixed | Medium | Input validation |
| 94 | Admin | Vendors | Onboard vendor | Mobile only 10 numbers | New | Validation | Valid Bug | Medium | Input validation |
| 95 | Admin | Vendors | Onboard vendor | GST number correct format with instant validation | New | Validation | Valid Bug | Medium | Input validation |
| 96 | Admin | Vendors | Onboard vendor | Email validation on wrong input | New | Validation | ✅ Fixed | Medium | Input validation |
| 97 | Admin | Vendors | Onboard vendor | Website link validation on wrong input | New | Validation | ✅ Fixed | Medium | Input validation |
| 98 | Admin | Vendors | Onboard vendor | City accepting numbers/special chars | New | Validation | ✅ Fixed | Medium | Input validation |
| 99 | Admin | Vendors | Onboard vendor | Pincode only 6 numbers | New | Validation | Valid Bug | Medium | Input validation |
| 100 | Admin | Vendors | Onboard vendor | Address should not take only special chars | New | Validation | ✅ Fixed | Medium | Input validation |
| 101 | Admin | Banners | New banner | There should be a banner name field | New | Enhancement | Suggestion | Low | Feature |
| 102 | User | Home | Banner | Banner should slide when swiped | New | Enhancement | Suggestion | Low | Feature |
| 103 | User | My groups | Joined groups | Completed filter should show completed groups | New | Functional | ✅ Fixed (Wave 5) | Medium | Now includes locked + completed |
| 104 | User | My groups | Confirm interest | Confirmed interested units not displayed correctly | New | Functional | Valid Bug | High | Data display bug |
| 105 | User | My groups | Confirm interest | Invite friends/share should open share options | New | Functional | Valid Bug | Medium | Wrong behavior |
| 106 | User | My groups | Open group | Unit count at top is wrong | New | Functional | Valid Bug | High | Data bug |
| 107 | User | Create groups | Image url | Image not uploaded through url | New | Functional | Valid Bug | Medium | Broken feature |
| 108 | User | Create group | All fields | Accepting space as a character | New | Validation | Valid Bug | Low | Input trim |
| 109 | User | Create group | All search fields | Search fields not moving above keyboard | New | UI-Layout | Valid Bug | Medium | Layout |
| 110 | User | | | Web page not available should not show on network error | New | Functional | Valid Bug | Medium | Offline handling |
| 111 | User | Create group | | Refresh should not remove details | New | Functional | ✅ Fixed (Wave 5) | Medium | Form draft persisted to sessionStorage |
| 112 | Admin | Banners | New banner | Cover preview not visible when image url entered | New | Functional | ✅ Not a Bug | Medium | ImageUploader already previews pasted URL |
| 113 | Admin | All | All | Sidebar should align selected module | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 114 | User | Profile | Help center | Ticket status out of container | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 115 | Admin | Fraud & risk | Active signals | Investigate button should redirect to account/group | New | Functional | Valid Bug | Medium | Broken action |
| 116 | Admin | Fraud & risk | Active signals | Flag button should flag group and change status | New | Functional | ⚠️ Not Reproduced | High | Fraud.jsx:98 flag sets status=flagged; works |
| 117 | User | | | Suspended user still active | New | Functional | ⚠️ Not Reproduced | Critical | Backend fully enforces (middleware + cache bust + login block). Manual test FE/socket |
| 118 | User | Profile | Help center | Ticket text out of container + horizontal scroll | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 119 | Admin | Support tickets | Tickets | User reply out of container | New | UI-Layout | Valid Bug | Low | Cosmetic |
| 120 | Admin,User | My ticket chats | Both | Replies not visible in realtime; needs refresh | New | Functional | ✅ Fixed (Wave 4) | High | Socket wiring added: live ticket_update/ticket_changed over /chat namespace |
| 121 | Admin,User | | | Both should get notification on ticket replies/updates | New | Enhancement | Suggestion | Medium | Feature |
| 122 | User | Create group | | Launch button should be fixed at bottom | New | UI-Layout | Valid Bug | Low | Layout |
| 123 | User | Explore | Open filter | Background should be fixed when opening filters | New | UI-Layout | Valid Bug | Low | Layout |
| 124 | User | My groups | Poll | View poll should not like the message | New | Functional | ✅ Fixed | Medium | Interaction defect |
| 125 | User | My groups | Poll | Clicking poll option likes the poll message | New | Functional | ✅ Fixed | Medium | Interaction defect |
| 126 | User | My groups | Create poll | Poll should not accept same options | New | Validation | ✅ Fixed | Medium | Input validation |
| 127 | User | Open group | Media/group chat | Media image should open when clicked | New | Functional | ✅ Fixed | Medium | Broken interaction |
| 128 | User | | Members | Back from message chat should go to previous page | New | Navigation | Valid Bug | Medium | Navigation |
| 129 | User | Home | Message | Online status not updating to last seen in realtime | New | Functional | Valid Bug | Medium | Realtime |
| 130 | User | | | Clicking notification should open relevant group | New | Functional | Valid Bug | Medium | Deep link |
| 131 | User | My group | Group chat | Double click should not open reply-to | New | Functional | ✅ Fixed | Low | Interaction |
| 132 | User | Messages | | Double tick shown when user offline | New | Functional | Valid Bug | Medium | Status logic |
| 133 | User | Home | Message | Mute should change to unmute status | New | Functional | Valid Bug | Low | Toggle state |
| 134 | User | Home | | Blue tick should appear immediately for self message | New | Functional | Valid Bug | Low | Status logic |
| 135 | User | Home | | User should not be able to report itself | New | Functional | Valid Bug | Medium | Validation/logic |
| 136 | User | Home | Message | Message should send once even on multiple taps | New | Functional | ✅ Fixed | High | useChat.js:233 no in-flight guard |
| 137 | | | | | New | Blank | Blank | — | Empty row |
| 138 | Admin | Support tickets | Tickets | Reported user profile redirection within ticket | New | Functional | Valid Bug | Medium | Routing |
| 139 | User | Home | | Moving info cards should stop on hold not on click | New | Functional | Valid Bug | Low | Interaction |
| 140 | User | Home | Dark mode | Banner text not visible in dark mode | New | DarkMode | Valid Bug | Medium | Dark mode contrast |
| 141 | User | Create | Header | Live preview summary not visible in dark mode | New | DarkMode | Valid Bug | Medium | Dark mode contrast |
| 142 | User | Create | Header | Header text visibility/color in dark mode | New | DarkMode | Valid Bug | Medium | Dark mode contrast |
| 143 | User | My groups | Header | Create group button not visible (dark mode) | New | DarkMode | Valid Bug | Medium | Dark mode contrast |
| 144 | User | My groups | | Visibility should be fixed in dark mode | New | DarkMode | Valid Bug | Medium | Dark mode contrast |
| 145 | User | Create | Input fields | Input not visible in dark mode | New | DarkMode | Valid Bug | High | Readability blocker |
| 146 | User | Home | | Back should open from previous scroll position | New | Navigation | Valid Bug | Medium | Scroll restore |
| 147 | User | Profile | | Profile stats should open respective pages | New | Functional | ✅ Fixed | Medium | Navigation/links |
| 148 | User | Profile | | Two help@support on page remove one | New | UI-Layout | ✅ Fixed | Low | Duplicate element |
| 149 | User | My groups | | Click group header should open group details | New | Enhancement | Suggestion | Low | Feature |
| 150 | User | Explore | | Two create group buttons remove bottom one | New | UI-Layout | Valid Bug | Low | Duplicate element |
| 151 | User | Home | | See all near category should open that category | New | Functional | Valid Bug | Medium | Wrong redirect |
| 152 | User | All | Group card | Already joined card should show open not join | New | Functional | Valid Bug | Medium | State display |
| 153 | User | Explore | Closed group | Closed group should stop functioning until reopened | New | Functional | ✅ Fixed | High | group.service.js addMember has no group-status guard |
| 154 | User | My groups | My groups | My groups should show only created groups | New | Functional | Valid Bug | Medium | Logic (dup of 78) |
| 155 | | | | | New | Blank | Blank | — | Empty row |
| 156 | Admin | Content page | Edit content | Contact email realtime validation | New | Validation | ✅ Fixed | Medium | Input validation |
| 157 | User | Home | Notification | Admin notification not visible in user panel | New | Functional | Valid Bug | High | Notification delivery |
| 158 | Admin | Push notification | | Image field not cleared after send | New | Functional | Valid Bug | Medium | Form reset |
| 159 | Admin | Push notification | | Notification sent when changing target platform | New | Functional | Valid Bug | Medium | Accidental trigger |
| 160 | Admin | Settings | General | Phone only 10 numbers | New | Validation | ✅ Fixed | Medium | Input validation |
| 161 | Admin | Settings | General | Support email realtime validation | New | Validation | Valid Bug | Medium | Input validation |
| 162 | Admin | Settings | Security & password | All fields need show/hide eye option | New | Enhancement | Suggestion | Low | UX feature |
| 163 | Admin | Settings | Live activity stats | Active group field validation | New | Validation | ✅ Fixed | Low | Input validation |
| 164 | Admin | Settings | Live activity stats | People interested field validation | New | Validation | ✅ Fixed | Low | Input validation |
| 165 | User | My groups | | Add search button for groups | New | Enhancement | Suggestion | Low | Feature |
| 166 | User | Home | Messages | User should be able to delete personal messages | New | Enhancement | Suggestion | Medium | Feature |
| 167 | User | My groups | Poll | Allow multi-select polls | New | Enhancement | Suggestion | Low | Feature |
| 168 | User | Home | Search | Add microphone and clear button to search | New | Enhancement | Suggestion | Low | Feature |
| 169 | User | Home | | Info cards should open when clicked | New | Enhancement | Suggestion | Low | Feature |
| 170 | Admin | Settings | Live activity stats | Groups growing field validation | New | Validation | ✅ Fixed | Low | Input validation |
| 171 | Admin | Settings | Live activity stats | Top city only characters | New | Validation | ✅ Fixed | Low | Input validation |
| 172 | Admin | Settings | Add admin | Full name only characters | New | Validation | ✅ Fixed | Medium | Input validation |
| 173 | Admin | Settings | Add admin | Contact number only 10 numbers | New | Validation | ✅ Fixed | Medium | Input validation |
| 174 | Admin | Settings | Add admin | Email realtime validation | New | Validation | Valid Bug | Medium | Input validation |
| 175 | Admin | Settings | Add admin | Password length realtime validation | New | Validation | Valid Bug | Medium | Input validation |
| 176 | Admin | Support ticket | Ticket | Group ID too long | New | UI-Layout | Valid Bug | Low | Cosmetic/display |
| 177 | User | Profile | | Logout should ask for confirmation | New | Enhancement | Suggestion | Low | Consistency (admin equivalent resolved) |
