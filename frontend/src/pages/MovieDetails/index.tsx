import { useParams } from 'react-router';

export function MovieDetails() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-light text-[#F2EEF0]">Movie Details</h1>

      <p className="mt-4 text-[#99949C]">Movie ID: {id}</p>
    </section>
  );
}
