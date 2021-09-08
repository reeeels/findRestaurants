const mongoose = require('mongoose');

const Restaurant = require('../models/restaurants');


mongoose.connect('mongodb://localhost:27017/restaurants');

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log('Database Connected')
});

const yelp = require('yelp-fusion');

const apiKey = 'RdIL_KG-iIeNMFev3vZmh2PicEf3Lwy7E1PMFxlYA5iFVSuW8g99jb8B1mD7pk0qijTZkEfomAYPRukhT7p7cGmguRatNEPXFvMg49oJ0sSDSeMRyfkra705RuUnYXYx';

const searchRequest = {
  term:'restaurants',
  location: 'Tennessee'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const res = response.jsonBody.businesses;
  const prettyJson = JSON.stringify(res, null, 4);
  const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 20; i++) {
      console.log(res)
      const restaurant = new Restaurant({
        alias: res[i].alias,
        name: res[i].name,
        url: res[i].url,
        image: res[i].image_url,
        categories: res[i].categories,
        location: res[i].location,
        coordinates: res[i].coordinates,
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