
export const getLocationFromGeolocation = async (coords) => {
    try {
      const { latitude, longitude } = coords;
      const res = await fetch(
        `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await res.json();
      console.log(data)
      return {
        data
      };
    } catch (err) {
      alert('Some error ocurred while getting location details.')
      return null;
    }
  };