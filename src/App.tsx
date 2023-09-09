import React, { useEffect, useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { fetchData } from './WeatherService';
import { Button } from '@mui/material';
import { CategoryScale, Chart, registerables } from "chart.js";
import './App.css';

Chart.register(...registerables, CategoryScale);
const App: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('C');

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };
    getData();
  }, []);

  const celsiusToFahrenheit = (celsius: number) => (celsius * 9 / 5) + 32;

  const toggleTemperatureUnit = () => {
    setTempUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  if (!data) return <p>Loading...</p>;

  const columnChartData = {
    labels: data.hourly.time,
    datasets: [
      {
        label: 'Relative Humidity 2m (%)',
        data: data.hourly.relativehumidity_2m,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
    ]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: false,
      }
    }
  };
  const lineChartData = {
    labels: data.daily.time,
    datasets: [
      {
        label: `Temperature Max (${tempUnit})`,
        data: tempUnit === 'C' ? data.daily.temperature_2m_max : data.daily.temperature_2m_max.map(celsiusToFahrenheit),
        borderColor: 'red',
        fill: false
      },
      {
        label: `Temperature Min (${tempUnit})`,
        data: tempUnit === 'C' ? data.daily.temperature_2m_min : data.daily.temperature_2m_min.map(celsiusToFahrenheit),
        borderColor: 'blue',
        fill: false
      }
    ]
  };

  const areaChartData = {
    labels: data.hourly.time.map((timeSlot:string, index:number) => index % 6 === 0 ? timeSlot : ''),
    datasets: [{
      label: 'Direct Radiation',
      data: data.hourly.direct_radiation,
      backgroundColor: 'rgba(75,192,192,0.4)'
    }]
  };
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: {
          myCustomScale: 10 // Replace "myCustomScale" with your desired scale ID and 10 with the desired number
        },
      },
      title: {
        display: false,
        text: "Radar Chart"
      }
    },
    scales: {
      r: {
        grid: {
          display: false
        },
        angleLines: {
          display: false
        },
        ticks: {
          // ...
        }
      }
    }
  };
  
  
  
  return (
    <div className="app-container">
      

      <div className="chart-container">
        <h3>Relative Humidity 2m (%)</h3>
        <Bar
          data={columnChartData}
          options={options}
        />
      </div>

      <div className="chart-container">
        <h3>Temperature Min and Max</h3>
        <Line data={lineChartData} options={options} />
        <Button onClick={toggleTemperatureUnit}>Switch to {tempUnit === 'C' ? 'Fahrenheit' : 'Celsius'}</Button>
      </div>

      <div className="chart-container">
        <h3>Direct Radiation</h3>
        <Radar data={areaChartData} options={radarOptions} />
      </div>
    </div>
  );
};

export default App;
