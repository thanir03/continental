export function validatePassword(password: string) {
  password = password.trim();
  let hasLowerCase = false,
    hasUpperCase = false,
    hasDigit = false,
    hasSpecialCharacter = false,
    satisfyMinLength = false;

  satisfyMinLength = password.length > 4;

  for (const char of password) {
    if (/[a-z]/.test(char)) {
      hasLowerCase = true;
    }
    if (/[A-Z]/.test(char)) {
      hasUpperCase = true;
    }
    if (/[0-9]/.test(char)) {
      hasDigit = true;
    }
    if (["@", "$", "!", "%", "*", "?", "&", "/"].includes(char)) {
      hasSpecialCharacter = true;
    }
  }

  return (
    hasUpperCase &&
    hasLowerCase &&
    hasDigit &&
    hasSpecialCharacter &&
    satisfyMinLength
  );
}

export const parseDecimals = (obj: Record<string, any>) => {
  for (const key in obj) {
    if (
      typeof obj[key] === "string" &&
      !isNaN(parseFloat(obj[key])) &&
      obj[key].includes(".")
    ) {
      obj[key] = parseFloat(obj[key]);
    }
  }
  return obj;
};

export const calculateInitialRegion = (
  coords: {
    latitude: number;
    longitude: number;
  }[]
) => {
  let minLat = coords[0].latitude;
  let maxLat = coords[0].latitude;
  let minLon = coords[0].longitude;
  let maxLon = coords[0].longitude;

  // Loop through coordinates to find min/max latitudes and longitudes
  coords.forEach(({ latitude, longitude }) => {
    minLat = Math.min(minLat, latitude);
    maxLat = Math.max(maxLat, latitude);
    minLon = Math.min(minLon, longitude);
    maxLon = Math.max(maxLon, longitude);
  });

  // Calculate center point
  const midLat = (minLat + maxLat) / 2;
  const midLon = (minLon + maxLon) / 2;

  // Calculate delta (span) values for zoom
  const deltaLat = maxLat - minLat;
  const deltaLon = maxLon - minLon;

  // Return the region object
  return {
    latitude: midLat,
    longitude: midLon,
    latitudeDelta: deltaLat + 0.05, // Add some padding to the delta
    longitudeDelta: deltaLon + 0.05,
  };
};
