# EI Survival Kit

A small browser game that works as an emotional survival kit, made as the final project for the Emotional Intelligence course.

The player opens a 3D tactical field case with 6 compartments. Each compartment is a level based on one unit of the course, and finishing it unlocks a tool card that is saved in My Kit.

## How to run it

Open `index.html` in any modern browser. It works offline, it does not need a server, an account or any permission.

## Folders

- `index.html` main page
- `css/base.css` colors, fonts and general layout
- `css/components.css` buttons, box, tool cards, badges and forms
- `data/content.js` all the visible text of the game, in one place for spell checking
- `js/storage.js` saves progress only in this browser, with a memory backup if saving is blocked
- `js/ui.js` helpers, icons and the tool card
- `js/scene3d.js` the 3D field case drawn with Three.js, on the welcome screen and the box
- `js/vendor/` Three.js r147 and RoundedBoxGeometry, saved locally so the game works offline, MIT license in `LICENSE-three.txt`
- `js/intro.js` and `css/intro.css` the 30 second intro with title and credits, it can be skipped with the button or the Escape key
- `img/intro-logo.png` the intro logo designed by Carlos, with a transparent background
- `js/intro-music.js` loads `audio/Intro_style.mp3`; it only plays if the player chooses the intro with sound
- `audio/Intro_style.mp3` music track used for the intro
- `js/app.js` routes and main screens: welcome, check-in, box, My Kit
- `js/mission.js` shared mission engine: steps, progress dots, questions and the final tool card
- `js/level1.js` to `js/level6.js` one file per mission
- `css/mission.css` styles of the mission screens

## Updating files

Every css and js file in `index.html` ends with `?v=` and a version number. When you change a file, change that number so browsers download the new version instead of an old saved copy.

## Privacy

All answers are saved with localStorage on the same device. Nothing is sent to any server. The Download my kit button creates a text file inside the browser.

## Status

- Phase 1: skeleton, design system, 3D box hub, My Kit, save and load. Done.
- Intro with credits and original music. Done.
- Phases 2 to 4: 6 short missions, about 90 seconds each. Done.
- Phase 5: references, QA and deploy instructions. Done.

## Live link

The game is published with GitHub Pages at https://carlosbernabb.github.io/ei-survival-kit/

Anyone with the link can open it, no account needed. Every push to the `main` branch updates the page in a minute or two.

The `audio` folder is not published, it is listed in `.gitignore`. Without it the intro plays with no sound.

## QA checklist

- Spelling: all visible text lives in `data/content.js` and was reviewed.
- Links: the two DOI links on the References screen open.
- Access: no login, no camera, no microphone, no location, no notifications, no cookies and no network calls. It opens offline from `index.html` in a fresh browser profile.
- Tested at desktop and mobile width.
- Every mission has a visual and ends with a tool card.
- EI applications are labeled on the box and in each mission.
- References are on the References screen in APA 7 style.
