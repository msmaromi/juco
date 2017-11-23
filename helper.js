const fishesType = ['bandeng', 'cakalang', 'gurami', 'kembung', 'layang', 'lele', 'nila', 'patin', 'tongkol', 'udang putih'];

// google maps client
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCqvsPzGBffJrucM6GM8YCMbdBnNpJdOjY'
});

const geocodePromise = (city) => {
  return new Promise((resolve, reject) => {
    googleMapsClient.geocode({ address: city }, (error, response) => {
      if (!error) {
        resolve(response.json.results)
      }

      reject(error);
    });
  });
}

const getGeocode = async (city) => {
  let geocode = null;
    
  try {
    geocode = await geocodePromise(city);
  } catch (error) {
    console.log(error);
  }

  return geocode;
}

const getCoordinate = async (city) => {
  let coordinate = null;
  let geocode = await getGeocode(city);
  if (geocode) {
    coordinate = geocode[0].geometry.location;
  }

  return coordinate;
}

module.exports = {
  // create new object from response of WPI API
  recreateData: async function(data) {
    const createdData = {};
    
    const city = data[0];
    
    createdData['city'] = city;
    createdData['fishes'] = [];
    createdData['coordinate'] = await getCoordinate(city);    
  
    fishesType.map((type, index) => {
      createdData['fishes'].push({
        type: type,
        price: data[index + 1]
      });
    });
  
    return createdData;
  }
}