# MFLIX API Guide

## What You Need

- Node.js on your computer
- MongoDB access, with the `sample_mflix` database ready
- A way to make API requests (like a REST client or a browser)

## Setting Up

1. Download the code to your computer.
2. Open the project folder and run `npm install` to set up the necessary software.
3. Start the server with `npm run dev`. This opens the app on `http://localhost:3000`.

## Using the API

The API lets you do different things through specific web addresses, each with its own purpose:

- **Auth**:
    - POST `/api/auth/login`: Log in.
    - POST `/api/auth/logout`: Log out.
    - POST `/api/auth/refresh-token`: Get new tokens.

- **Users**:
    - POST `/api/auth/register`: Sign up a new user.

- **Movies**:
    - GET `/api/movie/{idMovie}`: Get details of a specific movie.
    - PUT `/api/movie/{idMovie}`: Change details of a specific movie.
    - DELETE `/api/movie/{idMovie}`: Remove a movie.
    - POST `/api/movie`: Add a new movie.
    - GET `/api/movies`: List all movies, with an option to limit the number shown.

- **Comments**:
    - GET `/api/movies/{idMovie}/comments/{idComment}`: Get a specific comment on a movie.
    - PUT `/api/movies/{idMovie}/comments/{idComment}`: Edit a comment on a movie.
    - DELETE `/api/movies/{idMovie}/comments/{idComment}`: Delete a comment on a movie.
    - GET `/api/movies/{idMovie}/comments`: Get all comments on a specific movie.
    - POST `/api/movies/{idMovie}/comments`: Add a new comment on a movie.

## Conception
  - **Services**: These are the parts of the app that manage data (like adding or getting movies). You'll find them in the `lib/services` folder.
  - **Pages**: These are the pages of the app, made with Next.js, found in the `pages` folder.
    - **API Routes**: These are the specific addresses that the app uses to handle requests, located in the `pages/api` folder.
  - **Types and Interfaces**: These are used to define the shape of data in the app. They're in the `types` folder. Interfaces are preferred over types for a few reasons: