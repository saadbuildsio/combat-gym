# Combat Gym: Android launch guide (ads + Pro)

Plain steps for Saad. Nothing here needs coding. Do them in order; tell Claude when each is done.

## 1. Let GitHub build the app (needed first)
1. Install the Claude GitHub App on `saadbuildsio/combat-gym`: https://github.com/apps/claude/installations/select_target
2. Tell Claude. Claude pushes the code; GitHub then builds the app automatically.
3. To get the test app: GitHub → combat-gym → **Actions** → latest "Android app" run → download **combat-gym-test-apk** → open it on an Android phone (allow "install unknown apps").
   This test app shows Google **test ads** and Pro says "coming soon". That is expected.

## 2. Google Play developer account
- https://play.google.com/console → sign up (one-time **$25**). Identity check can take a few days, so start early.
- Create the app: name **Combat Gym**, default language English, App, Free.

## 3. AdMob (ads that pay you)
1. https://admob.google.com → sign up with the same Google account → add payment details.
2. Add app → Android → "not published yet" → name Combat Gym.
3. Create two ad units: **Banner** and **Interstitial**.
4. You now have 3 IDs: the **App ID** (`ca-app-pub-…~…`) and two **ad unit IDs** (`ca-app-pub-…/…`).
5. Blocking controls → **Sensitive categories**: block Gambling, Dating, Alcohol, Sexual & suggestive content, Religion & politics (recommended for our audience).
6. Put the IDs in GitHub → combat-gym → Settings → Secrets and variables → Actions → **Variables**:
   - `ADMOB_APP_ID` = App ID
   - `NEXT_PUBLIC_ADMOB_BANNER_ID` = banner ad unit ID
   - `NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID` = interstitial ad unit ID
   These are not secret; they ship inside every app.

## 4. Pro subscription
1. Play Console → your app → Monetize → **Subscriptions** → create `combat_gym_pro` with a monthly base plan and your price (Google converts it to PKR, USD, etc.).
2. https://www.revenuecat.com → free account → new project → add Android app (package name `com.combatgym.app`) → connect Google Play (RevenueCat shows the steps).
3. In RevenueCat: create entitlement **`pro`**, attach the `combat_gym_pro` product, put it in the **current offering**.
4. Copy RevenueCat's **public Android SDK key** (starts with `goog_`) into GitHub Variables as `NEXT_PUBLIC_REVENUECAT_ANDROID_KEY`.
5. Add your Google account as a **license tester** in Play Console so you can test buying without being charged.

## 5. Signing key (lets Google Play accept uploads)
Ask Claude to generate the upload key and tell you exactly which 4 GitHub **Secrets** to add (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`). Keep a backup of the key file: losing it blocks future updates.
After that each GitHub build also produces **combat-gym-play-bundle** (the `.aab` file you upload to Play Console).

## 6. Store listing checklist
- Privacy policy URL: `https://combat-gym-prototype.netlify.app/privacy/` (update the contact email first, in `src/content/privacy.ts`).
- Content rating questionnaire; target audience **16+** (not designed for children).
- Data safety form: ads (advertising ID, approximate location via AdMob), purchases (via Google Play/RevenueCat). Progress stays on device.
- Screenshots (Claude can make them), short and full description in English and Urdu.
- Start with **Internal testing** → **Closed testing** with 12+ testers for 14 days (Google requires this for new personal accounts) → Production.

## How ads behave (already built)
- Free players: a banner on Home, Missions, Progress, Profile and the results screen; one full-screen ad after every 2nd session, starting from the 5th session, never twice within 15 minutes.
- Never during lessons, rounds or fights. Never after a pain report.
- Pro players: no ads anywhere. Website: no ads, and Pro points to the Android app.
