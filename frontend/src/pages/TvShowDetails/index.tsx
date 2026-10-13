import { useParams } from 'react-router';

export function TvShowDetails() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-light text-[#F2EEF0]">TV Show Details</h1>

      <p className="mt-4 text-[#99949C]">TV Show ID: {id}</p>
    </section>
  );
}
