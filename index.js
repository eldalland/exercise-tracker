const express = require('express')
const app = express()
module.exports = app;
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const personSchema = new mongoose.Schema({
  username:{
    type: String, required: true
  },
  count:{
    type: Number, default: 0
  },
 log:[{
    
      description: {type: String, required: true},
      duration: {type: Number, required: true},
      date: {type: String, required: true}
    
  }]
});

const Person = mongoose.model("Person", personSchema);
  app.post("/api/users", async (req, res)=>{
    try{
    let name  = req.body;
    const testPerson = new Person({
    username:name.username
  });

 

  const savedPerson= await testPerson.save();
  res.json({username : savedPerson.username, _id : savedPerson._id})
} catch(err){
  return console.error(err);
}
  })

  app.get("/api/users", async (req, res)=>{
    try{
      const users = await Person.find({});
     
      res.json(users.map((user)=>({
      username: user.username,
      _id: user._id.toString(),
      })))
    } catch(err){
      console.error(err)
    }
  })
  app.post("/api/users/:_id/exercises", async (req, res)=>{
    try{
    const { _id } = req.params;
    const { description, duration, date } = req.body;
    let selectedPerson = await Person.findById(_id)
    const exercise = {
      description,
      duration: parseInt(duration),
      date: date ? (new Date(date)).toDateString() : (new Date()).toDateString(),
    };

    
    selectedPerson.log.push(exercise);
    selectedPerson.count = selectedPerson.log.length;
    await selectedPerson.save();
  
      
    res.json({
  
      username: selectedPerson.username, // Return the user's username
      description: exercise.description.toString(),
      duration: parseInt(exercise.duration), // Return the duration of the exercise
      date: new Date(exercise.date).toDateString(), // Return the date of the exercise
      _id: selectedPerson._id.toString(), // Return the user's _id
      });
    } catch(err){
      return console.error(err);
    }
  })
  /*
  app.get(("/api/users/:_id/logs"), async (req, res)=>{
    
    const {from, to, limit} = req.query;
    try{
    const selectedPerson = await Person.findById(req.params._id);
    if(from){
      selectedPerson.log = selectedPerson.log.filter((exercise)=>
       new Date(exercise.date)  >= new Date(from)
      );
    }
    if(to){
      selectedPerson.log = selectedPerson.log.filter((exercise)=>
    new Date(exercise.date) <= new Date(to)
      );
    }
    if(limit){
      selectedPerson.log = selectedPerson.log.slice(0 ,limit);
      
    }

    res.json({
      _id: selectedPerson._id.toString(),
      username: selectedPerson.username,
      count: selectedPerson.count,
      log: selectedPerson.log.map((exercise)=>({
    
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),}
      ))
    })
  }
 catch (err){
   return console.error(err);
  }
  });
*/