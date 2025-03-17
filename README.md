# GetScambo

GetScambo is a web-based game where players determine if an image is a scam or not. The game fetches images from a database and validates user answers. The project consists of a backend API built with Express and a frontend built with React and Vite.

## Prerequisites

-   Node.js (version 18 or higher)
-   pnpm (version 7 or higher)
-   MySQL

## Setup

1. **Clone the repository:**

```sh
git clone https://github.com/yourusername/getscambo.git
cd getscambo
```

2. **Install dependencies:**

cd backend
pnpm install

cd ../frontend
pnpm install

3. **Set up the database**

Create a MySQL database and import the db.sql file to set up the schema and initial data.

4. **Set up the env file**

Create a .env file in the backend directory

DB_HOST=127.0.0.1
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=getscambo

5. **Start the backend server:**

cd backend
pnpm dev

6. **Start the frontend server:**

cd frontend
pnpm dev
