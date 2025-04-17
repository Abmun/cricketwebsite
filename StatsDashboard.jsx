// components/stats/StatsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';
import './StatsDashboard.css';

const StatsDashboard = ({ playerId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFormat, setActiveFormat] = useState('Test');
  const [statsType, setStatsType] = useState('batting');
  
  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/players/${playerId}/stats`);
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (playerId) {
      fetchPlayerStats();
    }
  }, [playerId]);
  
  if (loading) return <div className="stats-loading">Loading stats...</div>;
  if (!stats) return <div className="stats-error">No stats available</div>;
  
  // Prepare data for charts based on statsType and activeFormat
  const getChartData = () => {
    if (statsType === 'batting') {
      const statKey = activeFormat.toLowerCase() + 'Stats';
      return {
        labels: ['Runs', 'Average', 'Strike Rate', '100s', '50s'],
        datasets: [
          {
            label: `${activeFormat} Batting Statistics`,
            data: [
              stats[statKey]?.runs || 0,
              stats[statKey]?.average || 0,
              stats[statKey]?.strikeRate || 0,
              stats[statKey]?.hundreds || 0,
              stats[statKey]?.fifties || 0
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ]
          }
        ]
      };
    } else {
      const statKey = activeFormat.toLowerCase() + 'BowlingStats';
      return {
        labels: ['Wickets', 'Average', 'Economy', 'Strike Rate', '5W'],
        datasets: [
          {
            label: `${activeFormat} Bowling Statistics`,
            data: [
              stats[statKey]?.wickets || 0,
              stats[statKey]?.average || 0,
              stats[statKey]?.economy || 0,
              stats[statKey]?.strikeRate || 0,
              stats[statKey]?.fiveWickets || 0
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ]
          }
        ]
      };
    }
  };
  
  return (
    <div className="stats-dashboard">
      <div className="stats-controls">
        <div className="format-selector">
          <button 
            className={activeFormat === 'Test' ? 'active' : ''} 
            onClick={() => setActiveFormat('Test')}
          >
            Test
          </button>
          <button 
            className={activeFormat === 'ODI' ? 'active' : ''} 
            onClick={() => setActiveFormat('ODI')}
          >
            ODI
          </button>
          <button 
            className={activeFormat === 'T20I' ? 'active' : ''} 
            onClick={() => setActiveFormat('T20I')}
          >
            T20I
          </button>
        </div>
        
        <div className="stats-type-selector">
          <button 
            className={statsType === 'batting' ? 'active' : ''} 
            onClick={() => setStatsType('batting')}
          >
            Batting
          </button>
          <button 
            className={statsType === 'bowling' ? 'active' : ''} 
            onClick={() => setStatsType('bowling')}
          >
            Bowling
          </button>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-box">
          <h3>Performance Overview</h3>
          <Bar data={getChartData()} options={{ responsive: true }} />
        </div>
        
        {/* Additional charts could go here */}
      </div>
      
      <div className="stats-details">
        {/* Detailed stats table */}
      </div>
    </div>
  );
};

export default StatsDashboard;