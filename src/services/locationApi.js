// Location API service for country-state-city data
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

/**
 * Fetch states by country code
 * @param {string} countryCode - ISO country code (e.g., 'IN' for India)
 * @returns {Promise<Array>} Array of states
 */
export const getStatesByCountry = async (countryCode = 'IN') => {
  try {
    const response = await fetch(API_ENDPOINTS.STATES(countryCode), {
      headers: { 'X-CSCAPI-KEY': API_CONFIG.CSC_API_KEY }
    });

    if (response.ok) {
      const states = await response.json();
      console.log(`Found ${states.length} states in ${countryCode}`);
      return states.map(state => ({
        name: state.name,
        iso2: state.iso2,
        id: state.id
      }));
    } else {
      console.error('Country not found or no states available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

/**
 * Fetch cities by state code
 * @param {string} countryCode - ISO country code (e.g., 'IN' for India)
 * @param {string} stateCode - ISO state code (e.g., 'MH' for Maharashtra)
 * @returns {Promise<Array>} Array of cities
 */
export const getCitiesByState = async (countryCode = 'IN', stateCode) => {
  try {
    const response = await fetch(
      API_ENDPOINTS.CITIES(countryCode, stateCode), 
      {
        headers: { 'X-CSCAPI-KEY': API_CONFIG.CSC_API_KEY }
      }
    );

    if (response.ok) {
      const cities = await response.json();
      console.log(`Found ${cities.length} cities in ${stateCode}, ${countryCode}`);
      return cities.map(city => ({
        name: city.name,
        id: city.id
      }));
    } else {
      console.error('State not found or no cities available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

/**
 * Get Indian states with common ones first
 * @returns {Promise<Array>} Array of Indian states
 */
export const getIndianStates = async () => {
  const states = await getStatesByCountry('IN');
  
  // Common states to show first
  const commonStates = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Andhra Pradesh', 'Telangana', 'Madhya Pradesh'];
  
  const sortedStates = states.sort((a, b) => {
    const aIndex = commonStates.indexOf(a.name);
    const bIndex = commonStates.indexOf(b.name);
    
    if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  
  return sortedStates;
};
