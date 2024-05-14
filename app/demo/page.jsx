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
    <div className="bg-black" style={{
      backgroundImage: "url('demo.png')",
      backgroundSize: 'cover', // Cover the entire area of the container
      //backgroundPosition: 'center', // Center the background image
      minHeight: '100vh', // Minimum height of 100% of the viewport height
      //color: 'white' // Assuming you need a light text color for visibility against a dark background
    }}>
      <div style={{ padding: '200px 300px' }}> {/* This div wraps the table and applies the padding */}
        <h1 className= "font-bold" style={{ fontSize: '2rem', marginLeft:'2rem', marginBottom: '1rem' }}> {/* Adjust font size and margin as needed */}

        Classement Demo</h1>
        <table style={{ borderSpacing: '10px', borderCollapse: 'separate' }}>  {/* Adjusting space between columns */}
          <thead>
            <tr>
              <th style={{ padding: '0 20px' }}>Demo ID</th> {/* Adding padding to header cells */}
              <th style={{ padding: '0 20px' }}>Pseudo</th>
              <th style={{ padding: '0 20px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {demos.map((demo) => (
              <tr key={demo.demo_id}>
                <td style={{ padding: '10px 20px' }}>{demo.demo_id}</td> {/* Adding padding to data cells */}
                <td style={{ padding: '10pleasepx 20px' }}>{demo.pseudo}</td>
                <td style={{ padding: '10px 20px' }}>{demo.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassementDemo;
