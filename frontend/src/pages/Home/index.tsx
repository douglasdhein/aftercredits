import { useEffect, useState } from 'react';

export function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://localhost:7092/api/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch API');
        }

        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <h1>{message}</h1>;
}
