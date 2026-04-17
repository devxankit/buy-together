 
# PRODUCT REQUIREMENT DOCUMENT (PRD) 
 --- 
 
## 1. PRODUCT VISION (WHY THIS EXISTS) 
 
Buy Together ek normal app nahi hai. 
Ye ek Demand Aggregation Engine + Social Buying Network hai. 
 
### Problem: 
 
* Individual buyer = zero negotiation power 
* Vendor = high marketing cost, low conversion 
* Market fragmented hai 
 
### Solution: 
 
* Buyers ko group me convert karo 
* Demand ko visible aur measurable banao 
* Vendors ko ready buyers do 
 
### Result: 
 
* Buyers → discount 
* Vendors → bulk sale 
* Platform → control + data + revenue 
 --- 
 
## 2. PRODUCT GOAL (PHASE WISE) 
 
### Phase 1 (0 → 50K Users) 
 
* Viral growth 
* Group creation 
* Engagement 
 
### Phase 2 (50K → 2L Users) 
 
* Vendor onboarding 
* Deal execution 
 
### Phase 3 (2L+ Users) 
 
* Monetization 
* Data intelligence 
* Vendor ecosystem 
 --- 
 
## 3. CORE PRODUCT DNA 
 
Ye 5 pillars kabhi break nahi hone chahiye: 
 
* Trust 
* Real Buyers (Fake nahi) 
* Simple UX 
 --- 
 
## 4. USER TYPES (DETAILED BEHAVIOR) 
 
### 4.1 Buyer 
 
**Actions:** 
 
* Browse groups 
* Join groups 
* Create groups 
* Chat 
* Participate in polls 
* Confirm deals 
 
**Behavior:** 
 
* Curious → Join → Observe → Engage → Decide 
 --- 
 
### 4.2 Vendor 
 
**Actions:** 
 
* Register 
* Create offer groups 
* Submit deals 
* Monitor demand 
 
**Behavior:** 
 
* Lead hungry → Demand-driven selling 
 --- 
 
### 4.3 Admin 
 
**Actions:** 
 
* Monitor everything 
* Control groups 
* Approve vendors 
* Track analytics 
 --- 
 
## 5. SYSTEM ARCHITECTURE (HIGH LEVEL) 
 
**Modules:** 
 
* User System 
* Group Engine 
* Chat Engine 
* Vendor Engine 
* Deal Engine 
 --- 
 
## 6. CORE FLOW (ULTRA DETAILED) 
 
### FLOW 1: USER SIDE 
 
* User installs app 
* OTP login 
* Location permission 
* Home screen loads 
 
**User sees:** 
 
* Nearby groups 
 
* Trending groups 
 
* Vendor offers 
 
* User clicks group 
 
* Group detail screen opens 
 
* User joins group 
 
**System:** 
 
* Adds user to count 
* Assigns intent score 
 
**User:** 
 
* Chat 
* Poll participate 
* Target complete 
* Group locked 
* Vendor interaction 
* Offer broadcast 
 
**User chooses:** 
 
* Interested / Not 
 
### FLOW 2: VENDOR SIDE 
 
* Vendor registers 
* Profile verification 
* Creates group 
 
**Example:** 
“Baleno @ 8L (10 buyers needed)” 
 
* Users join 
* Target complete 
* Vendor submits final deal 
 --- 
 
### FLOW 3: ADMIN 
 
* Monitor groups 
* Detect fake users 
* Approve vendors 
* Track demand 
 --- 
 
## 7. AI + AUTOMATION SYSTEM 
 
### 7.1 Auto Category Detection 
 
User group create kare: 
“iPhone 15 bulk buy” 
 
**AI:** 
 
* Detect category → Electronics 
* Auto assign tag 
 --- 
 
### 7.2 Smart Suggestions 
 
User search kare: 
 
**System suggest:** 
 
* Existing groups 
* Create new group 
 --- 
 
### 7.3 AI Chat Summary 
 
Group chat analyze: 
 
**Output:** 
“Most users want 9L under deal” 
 --- 
 
## 8. GROUP ENGINE (CORE TECH) 
 
### Group Attributes: 
 
* ID 
* Name 
* Category 
* Location 
* Target count 
* Current count 
* Status 
* Creator 
* Type (User / Vendor) 
 
### Group States: 
* Active 
* Near Completion 
* Locked 
* Deal Stage 
* Completed 
## 9. CHAT ENGINE (ADVANCED) 
 
### Chat Types: 
 
* Open chat 
* Structured chat 
* Admin broadcast 
 
### Features: 
 
* No phone number 
* Message limit 
* Poll system 
* Thread replies 
* Topic tags 
 --- 
 
## 10. INTENT ENGINE 
 
Each user ka score: 
 
**Action Score:** 
 
* Join 20 
 
* Chat 20 
 
* Poll 30 
 
* Confirm 30 
 
* Vendor ko filtered data milega 
 --- 
 
## 11. VENDOR GROUP FEATURE (ULTRA DETAIL) 
 
### Vendor Group Creation Flow: 
 
* Vendor login 
* Select category 
 
**Enter offer:** 
 
* Product name 
 
* Price 
 
* Target users 
 
* Submit group 
 --- 
 
### User Experience: 
 
* Home → Nearby Vendor Offers 
* User joins 
* Poll participate 
 --- 
 
### Deal Flow: 
 
* Target reached 
* Group locked 
* Vendor final deal 
* Users confirm 
 --- 
 
## 12. ENGAGEMENT SYSTEM 
 
### Gamification: 
 
* Badges 
* Leaderboard 
* Top contributors 
 
### FOMO System: 
 
* “5 seats left” 
* “12 joined today” 
 --- 
 
## 13. LOCATION SYSTEM 
 
* GPS-based groups 
* Radius filter 
* Area tagging 
 --- 
 
## 14. ANALYTICS ENGINE 
 
### Data Collected: 
 
* User interest 
* Category demand 
* Location demand 
 --- 
 
## 15. SECURITY SYSTEM 
 
* OTP login 
* Device tracking 
* Fake detection 
* Spam control 
 --- 
 
## 16. LOOPHOLES + SOLUTIONS 
 
### 1. Fake users 
 
**Solution:** 
 
* OTP 
* Activity tracking 
 --- 
 
### 2. Spam 
 
**Solution:** 
 
* Message limit 
* Structured chat 
 --- 
 
### 3. Duplicate groups 
 
**Solution:** 
 
* Merge system 
* AI suggestion 
 --- 
 
### 4. No trust 
 
**Solution:** 
 
* Verified badge 
* Deal history 
 --- 
 
### 5. Vendor fraud 
 
**Solution:** 
 
* Ratings 
* Admin approval 
## 17. DEVELOPER SCOPE (DETAILED) 
 
### Backend: 
 
* Node / Express
 
### Tech: 
 
* Mongo db  
* Redis 
* Firebase 
 --- 
 
### APIs: 
 
* Auth APIs 
* Group APIs 
* Chat APIs 
* Vendor APIs 
* Deal APIs 
 --- 
 
### Database Tables: 
 
* Users 
* Groups 
* Messages 
* Vendors 
* Deals 
* Analytics 
 --- 
 
## 18. SCREEN ARCHITECTURE (100+ SCREENS BREAKDOWN) 
 
### AUTH SCREENS 
 
* Splash 
* Login 
* OTP 
* Profile setup 
 --- 
 
### HOME FLOW 
 
* Home 
* Category page 
* Nearby groups 
* Trending groups 
* Vendor offers 
 --- 
 
### GROUP FLOW 
 
* Group detail 
* Join confirmation 
* Chat screen 
* Poll screen 
* Members list 
 --- 
 
### CREATE GROUP FLOW 
 
* Create group 
* Category select 
* Target input 
* Location select 
* Review screen 
 
— 
 
 
 
 
### VENDOR FLOW 
 
* Vendor login 
* Vendor dashboard 
* Create offer 
* Offer analytics 
 --- 
 
### DEAL FLOW 
 
* Deal screen 
* Offer screen 
* Confirmation screen 
 --- 
 
### PROFILE FLOW 
 
* Profile 
* My groups 
* My activity 
 --- 
 
## 19. ADMIN PANEL (MASTER CONTROL) 
 
### Must Features: 
 
* All groups list 
* Real-time data 
 --- 
 
## ADMIN PANEL (EXTENDED) 
 
(50+ internal screens) 
 
* Dashboard 
* User management 
* Group management 
* Vendor management 
* Analytics 
* Fraud detection 
* Deal tracking 
 --- 
 
## Additional Tracking 
 
* User behavior 
* Vendor performance 
* Demand heatmap 
 --- 
 
### Super Features: 
 
* Fake detection 
* Group merging 
* Deal monitoring 
* Revenue tracking 
 --- 
 
## 20. FUTURE REVENUE SYSTEM 
 
* Commission 
* Subscription 
* Featured groups 
* Data selling 
 