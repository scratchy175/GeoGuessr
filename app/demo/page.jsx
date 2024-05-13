"use client";
import React, { useEffect, useState } from 'react';
import { getDemo } from '@/services/getDemo';  // Ensure the path matches where you have your service function

const ClassementDemo = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear previous error states and set loading before fetching new data
    setError(null);
    setLoading(true);
    getDemo()
      .then(data => {
        // Ensure you reference the 'demos' array from the response object
        setDemos(data.demos);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Fetching error:', err);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Classement Demo</h1>
      <table>
        <thead>
          <tr>
            <th>Demo ID</th>
            <th>Pseudo</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {demos.map((demo) => (
            <tr key={demo.demo_id}>
              <td>{demo.demo_id}</td>
              <td>{demo.pseudo}</td>
              <td>{demo.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassementDemo;
