import { Route, Routes } from 'react-router';
import { Home } from '../../pages/Home';
import { Movies } from '../../pages/Movies';
import { TvShows } from '../../pages/TvShows';

export function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tv-shows" element={<TvShows />} />
    </Routes>
  );
}
