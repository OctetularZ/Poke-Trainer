# Your project name here

## Information about this repository

This is the repository that you are going to use **individually** for developing your project. Please use the resources provided in the module to learn about **plagiarism** and how plagiarism awareness can foster your learning.

Regarding the use of this repository, once a feature (or part of it) is developed and **working** or parts of your system are integrated and **working**, define a commit and push it to the remote repository. You may find yourself making a commit after a productive hour of work (or even after 20 minutes!), for example. Choose commit message wisely and be concise.

Please choose the structure of the contents of this repository that suits the needs of your project but do indicate in this file where the main software artefacts are located.

<p align="center">
  <img src="/public/preview/Poke Trainer Banner.png" />
</p>

# Pokè Trainer

A **Next.js-powered companion website for Pokémon fans** — featuring a Pokédex, Pokémon info, fun mini-games, AI battle simulations, user accounts, and more.  
(**In active development**.)

---

## Preview

### Pokèdex (Complete)

<p align="center">
  <img src="/public/preview/Pokedex Complete.gif" />
</p>

### Pokemon Pages (In progress)

<p align="center">
  <img src="/public/preview/PokemonPages MK1.gif" />
</p>

---

## Features (Planned & In Progress)

- **Pokédex** – Browse detailed information on every Pokémon.
- **Pokémon Info** – Type, stats, abilities, evolutions, and more.
- **"Guess the Pokémon" Game** – A mini-game to test your Pokémon knowledge.
- **AI Battle Simulator** – Challenge an AI opponent to Pokémon battles.
- **User Authentication** – Secure login and registration using Zod and [Better Auth](https://www.better-auth.com/).
- **User Data & Profiles** – Managed with [Prisma](https://www.prisma.io/) on a PostgreSQL database.
- **Cloud Storage** – AWS S3 (might change) for user assets, saved data, or media files.
- **Responsive Design** – Optimized for desktop and mobile devices.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Authentication:** Zod and [Better Auth](https://www.better-auth.com/)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
- **Cloud Storage:** [AWS S3](https://aws.amazon.com/s3/) (might change)
- **Web Scraping:** Node.js, Cheerio, Axios
- **AI/ML:** Node.js (might change to Python)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

---

## Project Status

🚧 **Work in Progress** — Core pages and backend setup are underway.  
Expect frequent updates as features are added.

---

## Roadmap

- [x] Set up project structure with Next.js
- [x] Build Pokédex with dynamic routing for Pokémon pages
- [x] Configure BetterAuth for authentication
- [x] Integrate Prisma with PostgreSQL
- [ ] Connect AWS S3 for cloud storage
- [ ] Implement "Guess the Pokémon" mini-game
- [ ] Add Pokémon battle simulator with AI logic
- [x] Polish UI with Tailwind CSS
- [ ] Deploy to Vercel
