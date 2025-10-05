# Book Reviews

A simple, clean full-stack app to signup/login, add books, review and rate them, and browse with search, filter, sort, and dark/light mode.

## Features
- **Auth**: Signup, Login, JWT stored in localStorage. Protected routes.
- **Books**:
  - Create/Edit/Delete your own books.
  - Genres (multi-select), published year validation.
  - List with pagination, search, filter by genre, sort by year/newest.
- **Reviews**:
  - Add reviews with star rating (1-5).
  - Book details page shows average rating and rating distribution chart.
- **UI/UX**:
  - Clean white dashboard with dark/light toggle.
  - Transparent glassy navbar, responsive pages.
  - Login/Signup full-screen card layout.
  - Footer credit:  @Taha Balapurwala · LinkedIn: https://www.linkedin.com/in/taha-balapurwala/

## Tech Stack
- Frontend: React (Vite), React Router, Axios, Recharts
- Backend: Node.js, Express, Mongoose (MongoDB)

## Project Structure
```
Book_Reviews/
  Backend/
    app.js
    server.js
    db/
      index.js            # single Mongo connection (dbConn)
    models/
      userModel.js
      bookModel.js        # genre: [String]
      reviewModel.js
    controllers/
      userController.js
      bookController.js   # normalizes genres, computes averages in details
      reviewController.js
    routes/
      userRoute.js
      bookRoute.js
      reviewRoute.js
  Frontend/
    index.html
    vite.config.js         # '@' alias -> src
    src/
      main.jsx, App.jsx
      App.css, index.css
      context/AuthContext.jsx
      services/api.js     # axios with baseURL and auth header
      components/
        Navbar.jsx, Footer.jsx, ThemeToggle.jsx
        SearchBar.jsx, Pagination.jsx, RatingStars.jsx, StarRating.jsx
        ui/button.jsx, ui/input.jsx, ui/label.jsx
      pages/
        Login.jsx, Signup.jsx
        Home.jsx, BookDetails.jsx, BookForm.jsx, Profile.jsx
```
## Prerequisites
- Node.js 18+
- MongoDB URI (Atlas or local)

## Backend Setup
1. Create `Backend/.env`:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   MONGO_URI_BOOK=mongodb+srv://<user>:<pass>@cluster/dbname
   FRONTEND_ORIGIN=http://localhost:5173
   ```
2. Install deps and start:
   ```bash
   cd Backend
   npm install
   npm start
   ```
3. Health check: http://localhost:3000/health -> `{ "status": "ok" }`

## Frontend Setup
1. Create `Frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
2. Install deps and run Vite dev server:
   ```bash
   cd Frontend
   npm install
   npm run dev
   # open the printed http://localhost:5173
   ```

## Using the App
- Visit `/` (Login) or `/signup`.
- After login you land on `/home`:
  - Search by title/author, filter by genre, sort by newest/year.
  - Click a book card for details, average rating, distribution chart, and reviews.
  - Add a review with star rating.
- Add/Edit Book (`/books/new`, `/books/:id/edit`) with multi-genre chips and year validation.
- Profile shows your books (matching Home card style) and your reviews (compact).

## API Overview
- Auth
  - `POST /api/users/signup`
  - `POST /api/users/login`
  - `GET  /api/users/me` (auth)
- Books
  - `GET  /api/books?page=1` (pagination)
  - `GET  /api/books/:id` (includes `averageRating` and reviews summary)
  - `POST /api/books` (auth)
  - `PATCH /api/books/:id` (auth, owner)
  - `DELETE /api/books/:id` (auth, owner)
- Reviews
  - `POST /api/reviews` (auth)
  - `PATCH /api/reviews/:id` (auth, owner)
  - `DELETE /api/reviews/:id` (auth, owner)

## Notes
- **Single DB**: The backend uses one Mongo URI (`MONGO_URI_BOOK` or `MONGO_URI`) for all collections.
- **Genres**: Backend accepts `genre` as an array or comma-separated string; stores arrays.
- **CORS**: Allowed origin defaults to `http://localhost:5173` (configurable via `FRONTEND_ORIGIN`).
- **Auth**: JWT stored in localStorage; `AuthContext` exposes `isAuthed` for protected routes.

## Scripts
- Backend: `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## License
MIT (or your choice). Add a LICENSE file if needed.

## Contact
-  @Taha Balapurwala · LinkedIn: https://www.linkedin.com/in/taha-balapurwala/