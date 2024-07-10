import React, { useState } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
  const [numberId, setNumberId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const authHeader = {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNTg2NDA5LCJpYXQiOjE3MjA1ODYxMDksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijc4NWJjODNkLTI1M2MtNGQ1OS04MWYwLWZlNDA1MGY4MjBjMCIsInN1YiI6ImFzaHVmYXppbDIwMDRAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiTXltYXJ0IiwiY2xpZW50SUQiOiI3ODViYzgzZC0yNTNjLTRkNTktODFmMC1mZTQwNTBmODIwYzAiLCJjbGllbnRTZWNyZXQiOiJUQmtzS2ZIdWVtYlZpdG9YIiwib3duZXJOYW1lIjoiRmF6aWwgQWhhbWVkIEYiLCJvd25lckVtYWlsIjoiYXNodWZhemlsMjAwNEBnbWFpbC5jb20iLCJyb2xsTm8iOiI0MTA2MjExMDQwMjcifQ.2ZhtjMnM5f4lYCG4SQMOy_yJ0NCdwwkBfqj-npxn9Vk'
    }
  };

  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`http://20.244.56.144/test/${endpoint}`, authHeader);
      return response.data.numbers;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setData(null);

    const endpointMap = {
      p: 'primes',
      f: 'fibo',
      e: 'even',
      r: 'rand'
    };

    const endpoint = endpointMap[numberId];

    if (!endpoint) {
      setError('Invalid number ID');
      return;
    }

    const numbers = await fetchData(endpoint);

    if (!numbers.length) {
      setError('Failed to fetch numbers');
      return;
    }

    // Calculate the average
    const windowPrevState = data ? [...data.windowCurrState] : [];
    const windowCurrState = [...windowPrevState, ...numbers].slice(-10);
    const sum = windowCurrState.reduce((sum, num) => sum + num, 0);
    const avg = sum / windowCurrState.length;

    setData({
      windowPrevState,
      windowCurrState,
      numbers,
      avg: avg.toFixed(2) // Round to 2 decimal places
    });
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Number ID:
          <input
            type="text"
            value={numberId}
            onChange={(e) => setNumberId(e.target.value)}
          />
        </label>
        <button type="submit">Fetch Data</button>
      </form>
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>Results</h2>
          <p>Previous State: {JSON.stringify(data.windowPrevState)}</p>
          <p>Current State: {JSON.stringify(data.windowCurrState)}</p>
          <p>Numbers: {JSON.stringify(data.numbers)}</p>
          <p>Average: {data.avg}</p>
        </div>
      )}
    </div>
  );
};

export default AverageCalculator;
