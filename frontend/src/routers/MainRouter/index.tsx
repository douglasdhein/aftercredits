import { Route, Routes } from 'react-router';
import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { MovieDetails } from '../../pages/MovieDetails';
import { Movies } from '../../pages/Movies';
import { Register } from '../../pages/Register';
import { Search } from '../../pages/Search';
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
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
