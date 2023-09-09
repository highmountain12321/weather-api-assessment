import axios from 'axios';
import localForage from 'localforage';

// const apiUrl = 'https://api.openmeteo.com/v1/forecast?...';
const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2023-01-01&end_date=2023-01-10"

export const fetchData = async () => {
  try {
    const response = await axios.get(apiUrl);
    await localForage.setItem('weatherData', response.data);
    return response.data;
  } catch (error) {
    return await localForage.getItem('weatherData');
  }
};