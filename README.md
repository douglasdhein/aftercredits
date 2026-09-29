# AfterCredits

AfterCredits is a web application for discovering, rating, and reviewing movies and TV shows.

The project allows users to browse entertainment content, search for movies and TV shows, view detailed information, create an account, and publish reviews for titles they have watched.

Movie and TV show data will be provided by the [TMDB API](https://www.themoviedb.org/), while user accounts and reviews will be managed by the AfterCredits backend.

## Project Status

🚧 This project is currently under development.

AfterCredits is being developed as a learning and portfolio project, with a focus on building a full-stack application using React and ASP.NET Core.

## Planned Features

- Browse popular and trending movies;
- Browse trending TV shows;
- Search for movies and TV shows;
- View detailed information about movies and TV shows;
- Watch available trailers;
- View cast information;
- Discover similar movies and TV shows;
- User registration and authentication;
- Create, edit, and delete reviews;
- Rate movies and TV shows;
- View reviews from the AfterCredits community;
- Light and dark themes.

Additional features may be added as the project evolves.

## Technologies

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core

### Database

- PostgreSQL

### External Services

- TMDB API

### Tools

- Git
- GitHub
- Docker

## Architecture

AfterCredits follows a simple client-server architecture.

The React frontend communicates only with the ASP.NET Core API. The backend is responsible for application logic, database access, authentication, and communication with external services such as TMDB.

```text
┌─────────────────────┐
│      Frontend       │
│ React + TypeScript  │
└──────────┬──────────┘
           │
           │ HTTP / JSON
           ▼
┌─────────────────────┐
│       Backend       │
│ ASP.NET Core Web API│
└───────┬────────┬────┘
        │        │
        │        │
        ▼        ▼
┌────────────┐  ┌────────────┐
│ PostgreSQL │  │  TMDB API  │
└────────────┘  └────────────┘
```
