import { Route, Routes } from 'react-router';
import { Home } from '../../pages/Home';
import { MovieDetails } from '../../pages/MovieDetails';
import { Movies } from '../../pages/Movies';
import { TvShowDetails } from '../../pages/TvShowDetails';
import { TvShows } from '../../pages/TvShows';

export function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/tv-shows" element={<TvShows />} />
      <Route path="/tv-shows/:id" element={<TvShowDetails />} />
    </Routes>
  );
}
