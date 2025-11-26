#  ChefKit - Restaurant-Quality Meal Kits Delivered

ChefKit is a modern Next.js web application that brings restaurant-quality meal kits to your doorstep.

##  Features

- Landing page with 7 sections (Navbar, Hero, How It Works, Chefs, Meal Kits, Testimonials, Footer)
- Browse meal kits with search and filter
- Detailed meal kit pages
- Authentication with NextAuth.js (Google OAuth + Credentials)
- Protected pages for adding and managing meal kits

##  Technologies

- Next.js 16 (App Router)
- JavaScript (JSX)
- Tailwind CSS 4
- NextAuth.js
- React Hook Form
- React Hot Toast
- Lucide React Icons

##  Setup

`ash
# Install dependencies
npm install

# Create .env.local and add:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

# Run development server
npm run dev
`

Open http://localhost:3000

##  Routes

### Public
- / - Landing page
- /meal-kits - Browse meal kits
- /meal-kits/[id] - Meal kit details
- /login - Login page
- /register - Register page

### Protected (Auth Required)
- /add-meal-kit - Add new meal kit
- /manage-meal-kits - Manage your meal kits

##  Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

---

Built with  for ChefKit
