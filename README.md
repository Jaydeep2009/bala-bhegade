# Bala Bhegade Official Public Website & Admin Dashboard

A production-quality, responsive website and administrative content management dashboard for **Bala Bhegade**, designed with inspiration from premier political leader web portals (narendramodi.in, pmindia.gov.in, amitshah.co.in).

---

## 🏛️ Design Identity & Architecture

- **Color Palette:** Deep Forest Green (`#1e5a2e`, `#0a2112`), Warm Ivory (`#fdf9f0`, `#faf3e1`), Muted Gold (`#d4a94e`, `#c07c17`), and Charcoal (`#3d3d3d`, `#1a1a1a`).
- **Typography:**
  - Headings: *Playfair Display* (Editorial, authoritative serif)
  - Body: *Inter* (Clean, legible modern sans-serif)
  - Marathi / Devanagari: *Noto Sans Devanagari*
- **Multilingual Support:** Seamless live switching between English (`en`) and Marathi (`mr`) across all public views and admin forms.
- **Frontend Architecture:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion animations, React Router v6, Lucide React icons, and React Helmet Async for SEO.
- **Backend & Persistence:** Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) policies, and Supabase Storage for media uploads.
- **Development Preview Mode:** Automatically activates when Supabase environment variables are unset, providing structured, clearly-marked mock data and mock auth without throwing errors or breaking the UI.

---

## 🚀 Routes & Information Architecture

### Public Website
| Route | Description |
|---|---|
| `/` | **Homepage** — Hero with customizable focal point, Bio intro, Public Work highlights, News grid, Events preview, Photo gallery, Instagram curated feed, Contact snippet, and footer. |
| `/about` | **Biography & Profile** — Full bio, service principles, interactive timeline of milestones. |
| `/public-work` | **Public Activities & Initiatives** — Filterable initiatives across infrastructure, education, healthcare, and water. |
| `/news` | **News & Media Updates** — Categorized articles with live search and bilingual support. |
| `/news/:slug` | **Article Detail** — Editorial layout with social share, reading time, and related updates. |
| `/gallery` | **Photo Gallery** — Responsive image grid with full-screen animated lightbox, keyboard navigation, and categories. |
| `/events` | **Public Events & Engagements** — Upcoming and past schedule filter, date badges, venue info. |
| `/contact` | **Contact & Office Details** — Headquarters information, hours, telephone, email, citizen message form. |
| `/privacy` | **Privacy Policy** — Data handling, cookies, and citizen privacy terms. |

### Admin Dashboard (Protected)
| Route | Description |
|---|---|
| `/admin/login` | **Admin Authentication** — Secure Supabase Auth with dev credentials fallback (`admin@example.com` / `admin123`). |
| `/admin` | **Overview Dashboard** — Key metrics, article statuses, event counts, quick actions. |
| `/admin/homepage` | **Homepage Section Editor** — Reorder sections, toggle visibility, edit hero titles/buttons/backgrounds. |
| `/admin/news` | **News Manager** — Publish/draft toggle, create, edit, search, and delete articles with confirmation dialogs. |
| `/admin/news/new` | **Article Creator** — Bilingual fields, slug generator, cover image upload, tags, and Zod validation. |
| `/admin/news/:id/edit` | **Article Editor** — Update existing news content with unsaved change tracking. |
| `/admin/gallery` | **Gallery Manager** — Image upload, inline caption editing, categories, featured toggles. |
| `/admin/events` | **Events Manager** — Schedule upcoming engagements, specify venues, dates, and times. |
| `/admin/instagram` | **Social Posts Manager** — Curate official Instagram posts with URLs, preview cards, and order controls. |
| `/admin/settings` | **Profile & Contact Settings** — Manage office address, contact phone/email, and official social links. |

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or pnpm / yarn

### 2. Installation
```bash
# Clone the repository
cd Bala-Bhegade-website

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Inside `.env`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
> *Note:* If you don't supply Supabase credentials right away, the site runs in **Development Preview Mode** with sample data and mock authentication.

### 4. Running the Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🗄️ Supabase Setup & Migrations

To connect your own Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the migrations located in `./supabase/migrations/` in sequential order:
   - `001_initial_schema.sql` (Tables, relations, timestamps)
   - `002_rls_policies.sql` (Row Level Security & admin checks)
   - `003_storage.sql` (Public media bucket and upload policies)
   - `004_seed_data.sql` (Initial placeholder content and homepage structure)
3. Copy your project's **API URL** and **anon public key** from `Settings > API` into your `.env` file.

---

## 🔐 Provisioning Administrator Accounts

To ensure strict security, authenticated Supabase users are **not** granted admin permissions by default. You must explicitly link their Supabase `auth.users` ID in the `admin_profiles` table:

1. Sign up a new user via Supabase Auth or create an account in **Authentication > Users** in the Supabase Dashboard (e.g., `admin@balabhegade.com`).
2. Copy the resulting `User UID` (UUID).
3. In the Supabase **SQL Editor**, execute:
   ```sql
   INSERT INTO public.admin_profiles (user_id, display_name, role, is_active)
   VALUES (
     'YOUR_COPIED_USER_UID_HERE',
     'Official Administrator',
     'super_admin',
     true
   );
   ```
4. Now, this user can log in at `/admin/login` and access all administrative capabilities.

---

## 📸 Instagram Feed Integration

The website includes a modular Instagram integration:
- Administrators can curate posts via `/admin/instagram` by inputting public post URLs, captions, and thumbnails.
- The component displays interactive preview cards and official Instagram links.
- **Future Instagram Graph API Upgrade:** The architecture is designed so a webhook or scheduled Supabase Edge Function can periodically sync posts from the official Instagram Graph API into the `social_posts` table without modifying frontend components.

---

## 🏗️ Production Build & Deployment

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploying to Vercel / Netlify
1. Connect the Git repository.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. For single-page app routing on Netlify/Vercel, redirect all traffic to `/index.html`.
