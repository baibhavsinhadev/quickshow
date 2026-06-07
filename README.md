# QuickShow

**QuickShow** is a full-stack movie ticket booking platform built with a production-focused architecture.

It allows users to explore movies, select show timings, book seats, and complete payments seamlessly — while providing admins full control over shows and bookings.

This project is designed as a **real-world scalable system**, not just a CRUD app.

---

## Live Demo

Frontend: https://quickshow-frontend-virid.vercel.app/

---

## Features

### User

* Browse now playing movies (TMDB API)
* View movie details (cast, rating, runtime)
* Select show date & time
* Interactive seat selection system
* Real-time seat availability
* Secure booking system
* Stripe payment integration
* View booking history
* Add / remove favorite movies
* Email confirmation after successful booking

---

### Admin

* Add new shows (movie + multiple date/time slots)
* View all shows
* Track total bookings & revenue
* View all user bookings
* Dashboard with analytics

---

### System Features

* Role-based access (Admin / User via Clerk metadata)
* Auto seat release if payment not completed (Inngest)
* Event-driven workflows (booking, payment, cleanup)
* Stripe checkout + webhook verification
* Email notifications via Nodemailer
* Secure backend with:

  * Helmet
  * HPP
  * Mongo Sanitize
  * Rate Limiting
* Logging using Pino
* Optimized API structure

---

## Architecture Highlights

* **Event-driven backend (Inngest)**

  * Auto cleanup of unpaid bookings
  * Email triggers
* **Decoupled payment flow**

  * Booking created → Stripe session → webhook → update DB
* **Optimized DB queries**

  * Lean queries
  * Population control
* **Seat locking mechanism**

  * Prevents double booking

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios
* Clerk Authentication

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose

### Integrations

* TMDB API (movies data)
* Stripe (payments)
* Inngest (background jobs & workflows)
* Nodemailer (emails)
* Cloudinary (media handling)

---

## Project Structure

### Backend (`server/`)

```
server/
├── config/
├── controllers/
├── inngest/
├── middleware/
├── models/
├── routes/
├── .env
└── server.js
```

### Frontend (`client/`)

```
client/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
```

---

## Environment Variables

### Backend (`.env`)

```
PORT=
NODE_ENV=
CLIENT_URL=

MONGODB_URI=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

INNGEST_EVENT_KEY=
INNGEST_SIGNIN_KEY=

TMDP_READ_ACCESS_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

SMTP_USER=
SMTP_PASS=
SENDER_EMAIL=
```

---

### Frontend (`.env`)

```
VITE_SERVER_URL=
VITE_CURRENCY=
VITE_TMDB_BASE_URL=
```

---

## Getting Started

### 1. Clone Repository

```
git clone https://github.com/baibhavsinhadev/quickshow.git
cd quickshow
```

---

### 2. Setup Backend

```
cd server
npm install
npm run dev
```

---

### 3. Setup Frontend

```
cd client
npm install
npm run dev
```

---

## API Structure

Base URL:

```
/api
```

### Core Routes

* `/show` → Movies & shows
* `/booking` → Booking system
* `/admin` → Admin dashboard APIs
* `/user` → User data & favorites

---

## Payment Flow

1. User selects seats
2. Booking created in DB
3. Stripe checkout session created
4. User completes payment
5. Stripe webhook verifies payment
6. Booking marked as paid

---

## Background Jobs (Inngest)

* Auto release seats after 10 minutes (if unpaid)
* Delete unpaid bookings
* Send booking confirmation emails

---

## Email System

* Booking confirmation email sent after successful booking
* Includes:

  * Movie name
  * Date & time
  * Seats
  * Amount

---

## Security

* Helmet for secure headers
* HPP for HTTP parameter pollution
* Mongo Sanitize for NoSQL injection
* Rate limiting for API protection
* Clerk authentication for user management

---

## Future Improvements

* Multi-theatre support
* Real-time seat locking (WebSockets)
* Advanced analytics dashboard
* Refund & cancellation system
* Mobile responsiveness improvements

---

## Important Notes

* Use MongoDB Atlas or local DB
* Configure Stripe webhooks properly
* Clerk role must be set manually (`admin`)
* Backend must be running for full functionality

---

## Author

Built as a portfolio project with focus on **real-world architecture, scalability, and clean system design**.

---

## Inspiration

This project is inspired by real-world ticket booking platforms and built independently with additional features like:

* Event-driven workflows
* Payment integration
* Auto cleanup systems

The goal was to move beyond basic CRUD apps and build something closer to production-level systems.