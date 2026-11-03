# E-BookStore.com — AI Specialist Capstone Project

A modern, responsive e-commerce web platform for browsing, discovering, and purchasing books, built using **React**, **Vite**, **TypeScript**, **React Router v6**, **Redux Toolkit**, and **Tailwind CSS** in accordance with the capstone specifications.

---

## 🌟 Key Features & Customer Journeys Implemented

### 1. User Authentication & Profile
- Seamless authentication flow with **Sign In** and **Sign Up** modes.
- Instant 1-click **Demo Profiles** (`Sophia Montgomery` with 1,250 points, `Alex Rivera` with 850 points).
- Saved address book management (Home & Work delivery addresses).
- Reward / Gift Points wallet integration ($1 per 100 points).

### 2. E-Store Home & Landing Page
- **Hero Promotional Banner** highlighting AI and tech books with instant CTA.
- **Order History 'Buy It Again' Section**: Instant 1-click reorder from past purchases.
- **AI Recommendation Engine**: Personalized recommendations dynamically tailored to reading interests and purchase history.
- **Category Browsing Cards**: Technology & AI, Business & Finance, Fiction, Non-Fiction, Science, Self-Help, Mystery, Biography.
- **Publisher & Brand Showcase**: O'Reilly Media, Penguin Random House, HarperCollins, Packt, Simon & Schuster, MIT Press.

### 3. Product Catalogue & Smart Filtering
- Multi-dimensional filters: **Category**, **Publisher / Brand**, **Price Slider ($10 - $100)**, **Customer Rating (4★+)**, and **In-Stock Only**.
- Dynamic sorting: *Featured*, *Price: Low to High*, *Price: High to Low*, *Customer Rating*, *Biggest Discount*, *New Releases*.
- Responsive **Grid View** and **List View** toggles.
- Real-time search query matching titles, authors, publishers, ISBNs, and tags.
- **Interactive Quick View Modal** for rapid exploration.

### 4. Product Details & Real-Time Logistics
- Detailed book metadata (ISBN-13, pages, format options, language, publication date).
- **Tentative Delivery Date Tag**: Real-time arrival date prediction (e.g., *Arrives by Thu, Nov 6*).
- Book Format selection: Paperback, Hardcover, E-Book / Kindle, Audiobook.
- Customer reviews with verified purchase badges and an interactive review submission form.
- **Related Books Carousel**: Intelligent cross-category recommendations.

### 5. Shopping Basket & Rewards Redemption
- Quantity increment / decrement / item deletion.
- **Free Shipping Progress Tracker** towards the $35 threshold.
- **Gift Points Redemption Widget**: Slider / input to redeem reward points for instant discounts.
- **Promo Coupon System**: Apply coupon codes like `WELCOME10` (10% off) or `BOOKWORM` (15% off).
- Live order calculations for Subtotal, Estimated Tax (8%), Discounts, and Total.

### 6. Checkout & Delivery Address Selection
- Select from saved delivery addresses or add new addresses on the fly with validation.
- Delivery speed options with tentative delivery dates:
  - *Standard Ground Delivery* (FREE)
  - *Tentative Express 2-Day Delivery* ($4.99)
  - *Priority Next-Day Air* ($9.99)

### 7. Payment Screen
- Multiple payment gateways supported:
  - **Credit & Debit Cards** (Visa / Mastercard / Amex with validation)
  - **UPI & QR Code** (Google Pay / PhonePe / Paytm / BHIM)
  - **Net Banking** (Major national & international banks)
  - **Cash on Delivery (COD)**
- Real-time simulated payment authorization with processing spinner and security badges.

### 8. Purchase Confirmation & 48-Hour Order Cancellation
- Order confirmation banner with unique Order ID and Tracking Number.
- **48-Hour Order Cancellation Guarantee**:
  - Live real-time countdown timer (`XXh XXm XXs left to cancel`).
  - Interactive cancellation modal with reason selection and instant refund status update.
- Printable Invoice and delivery progress tracker.

### 9. Order Tracking & Order History
- Comprehensive order history list with status badges (*Placed*, *Processing*, *Shipped*, *Delivered*, *Cancelled*).
- 1-click **Buy It Again** for every item in past orders.
- 48-hour cancellation trigger for recent orders.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Persistence**: LocalStorage for Cart, User, and Order History

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone <your-repo-link>
cd E-BookStoreCom

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
npm run build
```

---

## 🤖 BookBot (AI Chat Assistant)

A floating chat widget that answers questions about the catalogue.

- **Local dev** → uses your local [Ollama](https://ollama.com) (default model `llama3.2`; override with `VITE_OLLAMA_MODEL`). Vite proxies `/ollama` → `http://localhost:11434`.
- **Production (Vercel)** → uses the serverless function [`api/chat.ts`](api/chat.ts), which calls any OpenAI-compatible hosted LLM API. The API key stays on the server.

Set these in **Vercel → Project Settings → Environment Variables** (see [`.env.example`](.env.example)):

| Variable | Example |
|---|---|
| `LLM_API_KEY` | your provider key (do **not** prefix with `VITE_`) |
| `LLM_API_URL` | `https://api.openai.com/v1/chat/completions` |
| `LLM_MODEL` | `gpt-4o-mini` |

Redeploy after adding variables. Local `npm run dev` does not run `api/`; use `npx vercel dev` to test the serverless function locally.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── auth/          # AuthModal (Sign In / Sign Up / Demo Accounts)
│   ├── book/          # BookCard, QuickViewModal
│   ├── catalogue/     # FilterSidebar (Category, Brand, Rating, Price)
│   ├── common/        # Navbar, CategoryBar, Footer, ToastContainer, RatingStars, Badge
│   └── home/          # HeroBanner, BuyAgainSection, RecommendationSection
├── data/              # Mock Books, Categories, Brands, Orders, User Profiles
├── pages/             # HomePage, CataloguePage, ProductDetailsPage, CartPage, CheckoutPage, PaymentPage, OrderConfirmationPage, OrdersPage, NotFoundPage
├── store/             # Redux Store & Slices (auth, cart, products, orders, ui)
├── types/             # TypeScript type definitions (book, cart, order, user)
├── utils/             # Delivery calculator, 48h countdown, currency formatters
├── App.tsx            # Main router & modal wrapper
└── main.tsx           # React & Redux entrypoint
```
