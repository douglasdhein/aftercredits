import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { MainRouter } from './routers/MainRouter';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MainRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
