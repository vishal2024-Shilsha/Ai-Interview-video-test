import { useState, useEffect, useCallback } from 'react';
import { getStatesByCountry, getCitiesByState, getIndianStates } from '../services/locationApi';

/**
 * Custom hook for managing location data (states and cities)
 * @param {string} defaultCountryCode - Default country code (default: 'IN')
 * @returns {Object} Location data and functions
 */
export const useLocationData = (defaultCountryCode = 'IN') => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [statesError, setStatesError] = useState('');
  const [citiesError, setCitiesError] = useState('');

  // Load states on component mount
  useEffect(() => {
    loadStates(defaultCountryCode);
  }, [defaultCountryCode]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      loadCities(defaultCountryCode, selectedState);
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedState, defaultCountryCode]);

  const loadStates = async (countryCode) => {
    setLoadingStates(true);
    setStatesError('');
    
    try {
      const statesData = countryCode === 'IN' 
        ? await getIndianStates() 
        : await getStatesByCountry(countryCode);
      
      setStates(statesData);
    } catch (error) {
      setStatesError('Failed to load states');
      console.error('Error loading states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryCode, stateCode) => {
    setLoadingCities(true);
    setCitiesError('');
    
    try {
      const citiesData = await getCitiesByState(countryCode, stateCode);
      setCities(citiesData);
    } catch (error) {
      setCitiesError('Failed to load cities');
      console.error('Error loading cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleStateChange = useCallback((stateCode) => {
    setSelectedState(stateCode);
    setSelectedCity(''); // Reset city when state changes
  }, []);

  const handleCityChange = useCallback((cityName) => {
    setSelectedCity(cityName);
  }, []);

  const resetLocation = () => {
    setSelectedState('');
    setSelectedCity('');
    setCities([]);
  };

  // Get state object by code
  const getStateByName = (stateName) => {
    return states.find(state => state.name === stateName);
  };

  // Get state code by name
  const getStateCodeByName = useCallback((stateName) => {
    const state = getStateByName(stateName);
    return state ? state.iso2 : '';
  }, [states]);

  return {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    statesError,
    citiesError,
    handleStateChange,
    handleCityChange,
    resetLocation,
    getStateByName,
    getStateCodeByName,
    loadStates
  };
};
