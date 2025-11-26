# 🍽️ ChefKit - Restaurant-Quality Meal Kits Delivered

ChefKit is a modern full-stack Next.js application that brings restaurant-quality meal kits to your doorstep. Built with Next.js 16 App Router, featuring authentication, protected routes, and a polished responsive UI.

## 📋 Project Description

A meal kit marketplace where users can browse curated meal kits, view detailed recipes, and manage their own meal kit offerings. The application features social authentication (Google OAuth), protected pages for content management, and a beautiful artify-inspired design pattern.

## ✨ Features

### Landing Page (7 Sections)
1. **Navbar** - Logo, 5 routes, login/register buttons, sticky positioning, fully responsive
   - After login: Shows dropdown with user info, Add Meal Kit, Manage Meal Kits
2. **Hero Section** - Auto-rotating slider with 3 slides (6s transitions), headline, subtitle, CTA button
3. **Featured Meal Kits** - Grid of 6 meal kit cards with hover effects
4. **Why Choose ChefKit** - Benefits section with icons
5. **How It Works** - 4-step process cards
6. **Meet Our Chefs** - Chef profiles with avatars
7. **Footer** - Links, social icons, copyright, consistent spacing

### Public Pages
- **Meal Kits List** (/meal-kits) - Search bar, cuisine filter, sorting, grid of 6+ cards
- **Meal Kit Details** (/meal-kits/[id]) - Large image, full description, ingredients, chef info, back button
- **Login/Register** - Google OAuth + credentials authentication

### Protected Pages (Auth Required)
- **Add Meal Kit** (/add-meal-kit) - Form with title, descriptions, price, prep time, servings, difficulty, cuisine, dietary tags, chef name, image URL, ingredients
- **Manage Meal Kits** (/manage-meal-kits) - Table/grid view with View and Delete actions

## 🛠️ Technologies

### Frontend
- **Next.js 16** (App Router with JavaScript/JSX)
- **React 19** - Hooks (useState, useEffect, useSession)
- **Tailwind CSS 4** - Modern CSS with @import syntax
- **DaisyUI** - Component library for consistent UI
- **NextAuth.js v4** - Authentication (Google OAuth + Credentials)
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Next/Image** - Optimized image loading

### Backend
- **Express.js 4** - REST API server
- **MongoDB Atlas** - Cloud database
- **MongoDB Driver 6** - Database operations
- **CORS** - Cross-origin resource sharing

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials

### Client Setup

1. Clone the repository:
```bash
git clone https://github.com/Nafiz001/chefkit-client-side.git
cd chefkit-client-side
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

### Server Setup

1. Clone the server repository:
```bash
git clone https://github.com/Nafiz001/chefkit-server-side.git
cd chefkit-server-side
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
PORT=5000
DB_USER=your-mongodb-username
DB_PASS=your-mongodb-password
```

4. Seed the database (optional):
```bash
node seed.js
```

5. Run development server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## 🗺️ Route Summary

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, meal kits, testimonials |
| `/meal-kits` | Browse all meal kits with search/filter/sort |
| `/meal-kits/[id]` | Detailed view of specific meal kit |
| `/about` | About ChefKit page |
| `/login` | Login page (Google OAuth + credentials) |
| `/register` | Registration page |

### Protected Routes (Requires Authentication)
| Route | Description |
|-------|-------------|
| `/add-meal-kit` | Form to add new meal kit (redirects to /login if not authenticated) |
| `/manage-meal-kits` | Manage user's meal kits with delete functionality |

### API Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | Various | NextAuth authentication endpoints |

## 🎨 UI Guidelines Implementation

### Layout & Responsiveness
- ✅ Consistent spacing using Tailwind utilities (py-16, py-20, gap-8)
- ✅ Clean layouts with proper section containers
- ✅ Fully responsive (mobile, tablet, desktop breakpoints)

### Typography & Colors
- ✅ Clear hierarchy (text-4xl, text-2xl, text-lg)
- ✅ Readable fonts (system font stack)
- ✅ Consistent color palette (orange-600, red-600, neutral tones)

### Cards, Lists & Forms
- ✅ Uniform cards with hover/focus states (hover:shadow-xl, transition-all)
- ✅ Responsive grids (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- ✅ Clean forms with validation and loading states

### Interactions & Consistency
- ✅ Hover/focus effects on all interactive elements
- ✅ Visual consistency across all pages
- ✅ Smooth transitions and animations

## 🚀 Deployment

### Client (Vercel)
1. Push code to GitHub
2. Import repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Live Demo:** [https://chefkit-client-side.vercel.app](https://chefkit-client-side.vercel.app)

### Server (Vercel)
1. Push server code to GitHub
2. Import repository to Vercel
3. Add environment variables (DB_USER, DB_PASS)
4. Configure Network Access in MongoDB Atlas (allow 0.0.0.0/0)
5. Deploy!

**Server URL:** [https://chefkit-server-side.vercel.app](https://chefkit-server-side.vercel.app)

## 📚 API Documentation

### User Endpoints
- `POST /users` - Create new user or check if exists
- `GET /users` - Get all users
- `GET /users/:email` - Get user by email

### Meal Kit Endpoints
- `GET /meal-kits` - Get all meal kits (supports ?cuisine=, ?search=, ?sort=)
- `GET /meal-kits/:id` - Get specific meal kit
- `POST /meal-kits` - Create new meal kit (requires authentication)
- `PUT /meal-kits/:id` - Update meal kit
- `DELETE /meal-kits/:id` - Delete meal kit
- `GET /my-meal-kits/:email` - Get user's meal kits

## 🔐 Authentication

- **Google OAuth 2.0** - One-click login with Google account
- **Credentials Provider** - Email/password authentication
- **Session Management** - JWT-based sessions with NextAuth
- **Protected Routes** - Middleware redirects unauthenticated users to /login

## 🏗️ Project Structure

```
chefkit-client-side/
├── src/
│   ├── app/
│   │   ├── about/page.jsx
│   │   ├── add-meal-kit/page.jsx
│   │   ├── api/auth/[...nextauth]/route.js
│   │   ├── login/page.jsx
│   │   ├── manage-meal-kits/page.jsx
│   │   ├── meal-kits/
│   │   │   ├── page.jsx
│   │   │   └── [id]/page.jsx
│   │   ├── register/page.jsx
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.jsx
│   │   └── providers.jsx
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── MealKitCard.jsx
│   │   └── Navbar.jsx
│   ├── lib/
│   │   ├── api.js
│   │   └── auth.js
│   └── proxy.js
├── .env.local
├── next.config.mjs
├── package.json
└── tailwind.config.js
```

## 📝 Notes

- All meal kit cards have uniform styling with hover effects
- Form validation with inline error messages
- Toast notifications for user feedback
- Responsive navbar with dropdown menu after login
- Image optimization using Next.js Image component
- SEO-friendly with proper meta tags

## 👨‍💻 Author

**Nafiz**
- GitHub: [@Nafiz001](https://github.com/Nafiz001)

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ for ChefKit - Making Restaurant-Quality Cooking Accessible to Everyone
