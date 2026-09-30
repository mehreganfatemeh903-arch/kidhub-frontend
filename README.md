# KidHub

### Smart Child Development & Parenting Guide

KidHub is a modern web platform designed to help parents discover age-appropriate **books, toys, and educational content** based on a child's age, interests, and developmental needs.

The platform combines curated content, child profiles, age-based recommendations, affiliate-ready product information, and a modern server-rendered web experience.

## Live Demo

**Production:**
https://kidhub-frontend.mehreganfatemeh903.workers.dev

## What KidHub Provides

* 👶 Child profiles with age information
* 📚 Curated children's books
* 🧸 Age-appropriate toys
* 🧠 Educational articles for parents and children
* 🎯 Age-based content filtering
* ❤️ Development-oriented recommendations
* 🖼️ Product and content images
* 🔗 Affiliate-ready product links
* 🔐 User registration and authentication
* 📱 Responsive modern interface
* 🌐 Persian-language content
* ⚡ Server-side rendering with Cloudflare deployment

## Main Sections

### Books

Parents can browse children's books and filter content according to the child's age.

The production application currently renders the available book catalog through the backend API and Cloudflare service binding.

### Toys

The toy catalog provides:

* Product titles
* Descriptions
* Development areas
* Recommended age groups
* Product images
* Price ranges
* Affiliate links

### Articles

KidHub provides educational articles covering parenting and child development topics, with age-based filtering.

## Technology Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Next.js App Router
* Server-side rendering

### Deployment

* Cloudflare Workers
* OpenNext for Cloudflare
* Cloudflare Worker Service Bindings
* Cloudflare Assets

### Backend Integration

The frontend communicates with the KidHub API through a dedicated Cloudflare API Proxy Worker.

For server-side rendering, the production frontend uses a Cloudflare Worker Service Binding instead of relying on public Worker-to-Worker HTTP requests.

This architecture improves reliability for server-rendered catalog pages.

## Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │   Web / Mobile      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    KidHub Frontend  │
                    │ Next.js + OpenNext  │
                    └──────────┬──────────┘
                               │
                     Cloudflare Service
                           Binding
                               │
                               ▼
                    ┌─────────────────────┐
                    │   API Proxy Worker  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    KidHub Backend   │
                    │       REST API      │
                    └─────────────────────┘
```

## Production Verification

The current production deployment has been verified for the primary catalog pages:

| Page     | Production Status |
| -------- | ----------------- |
| Books    | ✅ HTTP 200        |
| Articles | ✅ HTTP 200        |
| Toys     | ✅ HTTP 200        |

The production HTML was also verified to contain real Persian content and catalog data.

## Project Structure

```text
kidhub-frontend/
├── app/
│   ├── articles/
│   ├── books/
│   ├── toys/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── about/
│   └── contact/
├── components/
├── lib/
├── public/
├── next.config.ts
├── wrangler.jsonc
├── package.json
└── README.md
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Build the Next.js application for Cloudflare:

```bash
npx opennextjs-cloudflare build
```

Deploy:

```bash
npx wrangler deploy
```

## Cloudflare Configuration

The frontend uses a Cloudflare Worker Service Binding:

```text
API_PROXY → kidhub-api-proxy
```

This binding is used by server-rendered Books, Articles, and Toys pages to communicate with the API Proxy Worker reliably in the Cloudflare runtime.

## Current Production Status

**Status: Production-ready frontend**

The current repository contains the production frontend deployment and the Cloudflare SSR integration required for the main content sections.

Latest production fix:

```text
b6ab0bf Fix Cloudflare SSR API bindings
```

## Product Direction

KidHub is designed as a foundation for a larger child-development platform.

Potential future extensions include:

* Personalized recommendation algorithms
* Expanded educational content
* More product categories
* Parent dashboards
* Advanced child-development insights
* Additional affiliate partnerships
* Analytics and personalization
* Multilingual support

## License

This project is proprietary software unless otherwise specified by the project owner.

---

**KidHub — Helping parents make better-informed choices for their children's learning and development.**
