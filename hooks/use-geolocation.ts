import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook to get the user's current geolocation
 *
 * How it works:
 * 1. Uses the browser's Geolocation API (navigator.geolocation)
 * 2. Requests user's permission to access location
 * 3. Returns coordinates (latitude, longitude) once permission is granted
 * 4. Handles errors (permission denied, unavailable, timeout)
 *
 * Usage:
 * const { latitude, longitude, error, loading } = useGeolocation();
 *
 * @returns {GeolocationState} - Object with latitude, longitude, error, and loading state
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      });
      return;
    }

    // Get the user's current position
    navigator.geolocation.getCurrentPosition(
      // Success callback - receives position object
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      // Error callback - handles various error cases
      (error) => {
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
        });
      },
      // Options for getCurrentPosition
      {
        enableHighAccuracy: true, // Use GPS if available for better accuracy
        timeout: 5000, // Maximum time to wait for location (5 seconds)
        maximumAge: 0, // Don't use cached location, always get fresh data
      }
    );
  }, []);

  return state;
}
