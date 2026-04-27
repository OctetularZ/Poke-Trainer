# Project Log

## ProjectLog was stored elsewhere so is unfortunately only being committed now. It was being updated every week

## Week 1 [w/c 25 August 2025]

- Created the initial Next.js application for Poke Trainer.
- Set up the base project structure and began experimenting with Pokémon data.
- Added some styling elements including Tailwind variables, fonts, and a global navbar.
- Started fetching Pokémon data from PokéAPI to prepare for the Pokédex feature.

## Week 2 [w/c 1 September 2025]

- Continued development of the Pokédex page.
- Implemented Pokémon cards with basic Pokémon info, fallback images and incremental loading.
- Added type, name, and ability filtering.
- Set up Prisma, Better Auth and social sign-ins such as Google and Github.
- Started building the homepage.

## Week 3 [w/c 8 September 2025]

- Developed some of home page, including hero section animations and a Pokédex preview.
- Developed login/register pages and added Discord login option.
- Started implementing individual Pokémon pages.
- Added sprites, official artwork, flavour text, Pokémon descriptions and evolution chain.
- Refactored API route files and moved shared types/functions into organised folders.
- Added error handling and fixed issues with Pokémon names/forms not being fetched correctly.

## Week 4 [w/c 15 September 2025]

- Added Pokémon forms, shiny/normal sprite switching and improvements to Pokémon display pages.
- Added scroll indicators for clarity.
- Added base stats and Pokémon stat types.

## Week 5 [w/c 22 September 2025]

- Continued improving Pokémon information pages.
- Added type effectiveness chart and base stats to Pokémon pages.
- Fixed bugs with specific Pokémon, such as Deoxys, not fetching correctly.
- Began adding Pokémon move data, including backend types and API functions.

## Week 6 [w/c 29 September 2025]

- Implemented Pokémon move fetching and began displaying moves on Pokémon pages.
- Added move learn methods and filtering of moves.
- Fixed move-machine fetching bugs.
- Started investigating more reliable data sources/methods due to limitations with PokéAPI.

## Week 7 [w/c 6 October 2025]

- Began using Node.js with Cheerio and Axios to scrape PokémonDatabase.
- Completed scripts for scraping core Pokémon data such as stats and moves.
- Fixed issues with distinguishing Pokémon forms during scraping.
- Started planning database storage for scraped Pokémon data.

## Week 8 [w/c 13 October 2025]

- Designed the initial database schema for Pokémon data.
- Created TypeScript types/interfaces for scraped Pokémon data.
- Began inserting scraped data into PostgreSQL DB using Prisma.
- Made database columns unique where appropriate.

## Week 9 [w/c 27 October 2025]

- Started adding move data to the database.
- Identified PokéAPI server errors affecting some Pokémon, reinforcing the need for a custom database/API.

## Week 10 [w/c 15 December 2025]

- Returned to database work.
- Fixed some issues with adding move and type data into the database.
- Successfully inserted initial Pokémon data into DB.

## Week 11 [w/c 22 December 2025]

- Expanded database seeding with more scraped Pokémon data.
- Added game descriptions, Pokémon translations and evolution chain data.
- Improved database insertion speed using parallel upserts.
- Migrated successfully to Prisma 7.
- Added PokéAPI IDs to fetch sprites/images from PokéAPI.
- Added all Pokémon to the database after resolving issues with forms, duplicate data and evolution links.

## Week 12 [w/c 29 December 2025]

- Refactored the app to use the my own database rather than mainly relying on PokéAPI.
- Reimplemented Pokédex, Pokémon cards, Pokémon display pages and stats sections.
- Added slug name lookups for Pokémon pages.
- Fixed issues with Pokémon forms, routes, type charts and game descriptions.
- Re-added Pokémon data to the database after schema and scraping fixes.
- Began displaying evolution chains from the database.

## Week 13 [w/c 5 January 2026]

- Improved evolution chain display, especially for complex Pokémon such as Eevee.
- Grouped evolutions by similar evolution methods to make the UI cleaner.
- Fixed text and arrow sizing issues in evolution UI.
- Continued improving Pokémon pages and move display.

## Week 14 [w/c 12 January 2026]

- Re-added Pokémon move data on Pokémon pages.
- Added filters for moves by game and learn method.
- Improved move filter headings and fixed type styling issues.
- Continued polishing Pokémon page UI.

## Week 15 [w/c 26 January 2026]

- Started building the “Guess the Pokémon” mini-game.
- Created the game page, silhouette image component and random Pokémon fetch route.
- Implemented letter grid, selected letter tracking and guess display.
- Added frontend logic for handling guesses and preventing repeated button clicks.

## Week 16 [w/c 2 February 2026]

- Completed the first version of Guess the Pokémon.
- Added hints, random letter reveals, incorrect guess tracking and image reveal after a correct answer.
- Added coin and username fields to the user database schema.
- Managed behaviour for logged-in and non-logged-in users.
- Fixed a bug where points were being awarded incorrectly.
- Added a profile page where users can update basic account information.

## Week 17 [w/c 9 February 2026]

- Fixed a bug caused by missing Pokémon descriptions in the Guess the Pokémon game.
- Continued adding to the mini-game and user-related functionality.

## Week 18 [w/c 23 February 2026]

- Began developing the team builder feature.
- Created a Pokémon selection table list.
- Started implementing `PokemonStatSetter`, allowing users to modify Pokémon before adding them to a team.
- Added EV sliders and began planning for nature, ability and move selection.

## Week 19 [w/c 2 March 2026]

- Added nature calculations to Pokémon stat calculations.
- Implemented nature selection and move selection UI.
- Added ability selection and moved related components into organised folders.
- Added filters to the Pokémon list table, including name, type and ability filters.
- Added “load more” functionality to support browsing more Pokémon.

## Week 20 [w/c 9 March 2026]

- Added team display for Pokémon team currently being assembled.
- Added validation to prevent incomplete Pokémon being added.
- Updated database schema to store team information.
- Added team naming, confirmation and team capacity limit of six Pokémon.
- Fixed bugs with selected moves, EVs, nature resetting and overflowing UI elements.
- Added error handling for non-logged-in users trying to create teams.

## Week 21 [w/c 16 March 2026]

- Implemented fetching and displaying user teams from the database.
- Added loading indicators and edit buttons for teams.
- Began developing Pokémon battle functionality.
- Added base battle logic using damage calculations.
- Added battle mappers for Pokémon stats and moves.
- Fetched user teams from the database and converted them into battle-ready Pokémon.
- Started building the battle UI, including stage, sprites and health bars.

## Week 22 [w/c 23 March 2026]

- Continued developing the battle interface.
- Added switch buttons and switching logic.
- Added battle log functionality.
- Improved UI for battle progress and interactions.

## Week 23 [w/c 30 March 2026]

- Fixed winner display issues on the frontend.
- Updated battle log UI.
- Scraped move data from PokémonDatabase.
- Successfully added move data to the database.
- Added new database columns for moves such as priority and PP.
- Updated PP to change when a move is selected.
- Added switch-in and switch-out animations.

## Week 24 [w/c 6 April 2026]

- Added hover popups for moves to show more info.
- Refactored move and switch buttons into separate component folders.
- Fixed hydration issues in the navbar.
- Added attack animations using sprite sheets and motion.
- Improved battle log sequencing.
- Added winner messages.
- Added battle engine mechanics for forced switching after fainting.
- Began implementing some status ailments and move effects such as flinching.

## Week 25 [w/c 13 April 2026]

- Continued improving battle mechanics and status effects.
- Added poison and burn damage end of turn effects.
- Added paralysis, freeze and sleep end of turn effects.
- Added indicator badges for stat changes.
- Fixed end-of-turn timeline issues so status effects apply correctly.
- Added animations for status-up and status-down effects.
- Refactored the battle engine by moving functions into separate files to improve maintainability.

## Week 26 [w/c 20 April 2026]

- Finalised the homepage with more feature descriptions, images and links to features.
- Added an `active` column in the team table so user can set a team to active for battling.
- Fixed team updates when creating new teams.
- Added error handling for team/battle edge cases and protected pages requiring login.
- Made major responsiveness improvements across the website:
  - Home page and navbar
  - Pokédex
  - Pokémon pages
  - Guess the Pokémon
  - Team builder
  - Battle page partially responsive
- Added fixes for deployment including Prisma generate script, auth URL updates and trusted URLs.
- Added more comments across files and improved documentation.
- Fixed dropdown behaviour when navigating home using the title.
