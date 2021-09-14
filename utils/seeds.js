const mongoose = require('mongoose');
const Restaurant = require('../models/restaurants');
const yelp = require('yelp-fusion');

mongoose.connect('mongodb://localhost:27017/restaurants');

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log('Database Connected')
});

const apiKey = 'RdIL_KG-iIeNMFev3vZmh2PicEf3Lwy7E1PMFxlYA5iFVSuW8g99jb8B1mD7pk0qijTZkEfomAYPRukhT7p7cGmguRatNEPXFvMg49oJ0sSDSeMRyfkra705RuUnYXYx';

const searchRequest = {
  term:'Restaurants',
  location: 'Tennessee'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const res = response.jsonBody.businesses;
  const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 40; i++) {
      console.log(res[i])
      const restaurant = new Restaurant({
        alias: res[i].alias,
        name: res[i].name,
        url: res[i].url,
        image: res[i].image_url,
        location: res[i].location,
        geometry: {
          type: 'Point',
          coordinates: [res[i].coordinates.longitude, res[i].coordinates.latitude]
        },
        closed: res[i].is_closed,
        rating: res[i].rating,
        ratingCount: res[i].ratingCount
      })
      await restaurant.save();
    }
  }
  seedDB().then(() => {
    console.log("Database seeded! :)");
    mongoose.connection.close();
  }).catch(e => {
    console.log(e);
  });
})