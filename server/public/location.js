
export const getLocationFromGeolocation = async (coords) => {
    try {
      const { latitude, longitude } = coords;
      const res = await fetch(
        `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await res.json();
      return {
        latitude,
        longitude,
        city: data.locality || null,
        state: data.principalSubdivision || null,
        countryName: data.countryName || null,
        countryCode: data.countryCode || null,
      };
    } catch (err) {
      console.log('getLocationFromGeolocation', err);
      return null;
    }
  };