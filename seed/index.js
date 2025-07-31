const Campground= require('../models/campground.js');
const mongoose= require('mongoose');
const {descriptors,places}= require('./seedhelpers.js');
const cities= require('./cities.js');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection error:"));
db.once("open",()=>{
    console.log("successfully connected to db");
});
const sample=(array)=>{
    return array[Math.floor(Math.random()*array.length)];
}
const seeddb=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const price=Math.floor(Math.random()*20)+10;
        randind=Math.floor(Math.random()*1000);
        const camp= new Campground({author:'686f3c94c936263016ca017d',location:`${cities[randind].city},${cities[randind].state}`,images:[    {
      url: 'https://res.cloudinary.com/dns73hsc9/image/upload/v1752216784/yelpcamp/l5wyprtnbobifedw634t.png',
      filename: 'yelpcamp/l5wyprtnbobifedw634t'
    },
    {
      url: 'https://res.cloudinary.com/dns73hsc9/image/upload/v1752216786/yelpcamp/kx3dpaaticf4hqltb9hf.png',
      filename: 'yelpcamp/kx3dpaaticf4hqltb9hf'
    }],price:price,title:`${sample(descriptors)},${sample(places)}`,description:"i am not in danger skyler i am the danger a guy opens the door and gets shot you think of me no noo nooo i am the one who knocks"});
        await camp.save();
    }
};
seeddb().then(()=>console.log("successfully inserted")).catch((err)=>{
    console.log("successfully failed inserting:",err);
});
