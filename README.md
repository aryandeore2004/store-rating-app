# Store Rating App

A full-stack web app where users rate stores (1–5). Three roles: System Administrator, Normal User, Store Owner.

**Stack:** Spring Boot (Java) + MySQL + React

---

## 1. Project Structure

```
store-rating-app/
  backend/    -> Spring Boot API (Maven project)
  frontend/   -> React app
```

---

## 2. Prerequisites (install these first)

1. **Java 17** — check with `java -version`
2. **Maven** — check with `mvn -version` (or use the `mvnw` wrapper if you add one)
3. **MySQL** (8.x) — check with `mysql --version`. Make sure the MySQL server is running.
4. **Node.js (v18+) and npm** — check with `node -v` and `npm -v`
5. **Git** — check with `git --version`

---

## 3. Backend Setup (Spring Boot)

### Step 1 — Configure the database
Open `backend/src/main/resources/application.properties` and set your MySQL username/password:

```
spring.datasource.username=root
spring.datasource.password=root
```
(The database `store_rating_db` is created automatically on first run — you don't need to create it manually.)

### Step 2 — Run the backend
```bash
cd backend
mvn spring-boot:run
```
This starts the API at **http://localhost:8080**.

On first startup, a default admin account is auto-created:
```
Email: admin@ratingapp.com
Password: Admin@123
```
Use this to log in as System Administrator the first time.

### Step 3 — Verify it's running
Visit `http://localhost:8080/api/auth/login` in a browser — you should get a 405/method-not-allowed page (which is fine, it means the server is up and that endpoint only accepts POST).

---

## 4. Frontend Setup (React)

Open a **new terminal** (keep the backend running in the first one):

```bash
cd frontend
npm install
npm start
```
This opens the app automatically at **http://localhost:3000**.

---

## 5. Using the App

1. Go to `http://localhost:3000/login`
2. Log in as admin (`admin@ratingapp.com` / `Admin@123`)
3. As admin:
   - Go to **Add User** tab → create a Normal User and/or a Store Owner.
   - Go to **Add Store** tab → create a store. If you want to link a Store Owner to it, first find their ID in the **Users** tab, then paste it into "Store Owner User ID" when creating the store.
4. Log out, then log in as the Normal User you created (or sign up a new one via the Sign Up page) to browse stores and submit ratings.
5. Log in as the Store Owner to see their dashboard (average rating + list of raters).

### Password rules (enforced on signup/add-user/change-password)
- 8–16 characters
- At least 1 uppercase letter
- At least 1 special character

### Name rule
- 20–60 characters (this applies to signup and admin "Add User" forms)

### Address rule
- Max 400 characters

---

## 6. How to Upload This Project to GitHub

### Step 1 — Create a new repository on GitHub
1. Go to https://github.com and log in.
2. Click the **+** icon (top right) → **New repository**.
3. Name it (e.g. `store-rating-app`), leave it **empty** (don't add a README/.gitignore on GitHub itself), click **Create repository**.
4. Copy the repository URL shown, e.g. `https://github.com/<your-username>/store-rating-app.git`

### Step 2 — Push your local project
Open a terminal **in the `store-rating-app` folder** (the one containing `backend/` and `frontend/`) and run:

```bash
git init
git add .
git commit -m "Initial commit: store rating app"
git branch -M main
git remote add origin https://github.com/<your-username>/store-rating-app.git
git push -u origin main
```

If prompted, log in with your GitHub username and a **Personal Access Token** (GitHub no longer accepts plain passwords for git push — create one under GitHub → Settings → Developer settings → Personal access tokens).

### Step 3 — Done
Refresh your GitHub repository page — all your code should now be there.

---

## 7. Notes
- `.gitignore` is already set up to exclude `node_modules/`, `target/`, and build artifacts, so your repo stays clean.
- Never commit real database passwords for a real deployment — for this learning project it's fine since it runs locally.
- The JWT secret in `application.properties` is for local development; change it before deploying anywhere public.
