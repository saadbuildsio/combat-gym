# Combat Gym

Learn boxing from home: short daily sessions, real scores, XP, levels and an honest coach.
Boxing is the MVP. Kickboxing, Wrestling and MMA are designed in but locked.

## Run it on your computer

1. Install Node.js 20 or newer from nodejs.org.
2. Open a terminal in this folder and run `npm install`.
3. Run `npm run dev` and open http://localhost:3000.

## Check it

- `npm test` runs the game-rule tests.
- `npm run typecheck` and `npm run lint` check the code.
- `npm run build` makes a production build.

## Where things live

| Folder | What is inside |
| --- | --- |
| `src/content/` | What we teach: sports, Boxing levels, lessons, drills, opponents, achievements, safety copy. Edit this to change content. |
| `src/domain/` | Game rules: XP, levels, skills, streaks, daily session builder, coach rules, onboarding. No screens. |
| `src/services/` | Outside world: saving progress, analytics events, coach service, future camera analysis. |
| `src/app/` | Screens. Phase 1 has a placeholder home; Phase 2 builds the real UI. |
| `tests/` | Checks for the game rules. |

## Honest scoring

Without a camera the app scores only what a phone can measure: Reaction, Combo Recall, Fight IQ,
Knowledge, Consistency and Conditioning. Technique, Accuracy and Footwork stay locked until camera
coaching exists. See `src/services/vision/pose-analyzer.ts`.

## Secrets

Copy `.env.example` to `.env.local`. Never commit real keys. Server-only keys never start with `NEXT_PUBLIC_`.

## Safety

Lesson content is a draft and must be reviewed by a qualified boxing coach before public launch.
