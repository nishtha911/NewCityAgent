import { useState, useEffect } from 'react';

export function useSSE(url) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setEvents((prev) => [...prev, parsedData]);
    };

    return () => {
      eventSource.close();
    };
  }, [url]);

  return events;
}
