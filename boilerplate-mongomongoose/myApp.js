require('dotenv').config();
var mongoose = require('mongoose');
const { Schema } = mongoose;

// var uri = 'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase';
var uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const personSchema = new Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});
const Person = mongoose.model('Person', personSchema);


const createAndSavePerson = (done) => {
  const randomPerson = new Person({ name: "Mary Dope", age: 20, favoriteFoods: ["burrito", "hamburger"] });
  randomPerson.save((err) => {
    if (err) {
      done(err);
    } else {
      done(null, randomPerson);
    }
  }
  );
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err) => {
    if (err) {
      done(err);
    } else {
      done(null, arrayOfPeople);
    }
  }
  );
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => {
    if (err) {
      done(err);
    } else {
      done(null, people);
    }
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) {
      done(err);
    } else {
      done(null, person);
    }
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) {
      done(err);
    } else {
      done(null, person);
    }
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  findPersonById(personId, (err, person) => {
    person.favoriteFoods.push(foodToAdd);
    person.markModified('favoriteFoods');
    person.save((err) => {
      if (err) {
        done(err);
      } else {
        done(null, person);
      }
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  // should be find one 
  findPeopleByName(personName, (err, people) => {
    people.forEach((person) => {
      person.age = ageToSet;
      person.save((err) => {
        if (err) {
          done(err);
        } else {
          done(null, person);
        }
      });
    });
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) {
      console.log(err);
      done(err);
    } else {
      done(null, data);
    };
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, (err, data) => {
    if (err) {
      done(err);
    } else {
      done(null, data);
    }
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  let chainedQuery = Person.find({ favoriteFoods: foodToSearch });
  chainedQuery.sort({ name: 1 }).limit(2).select({ name: 1, favoriteFoods: 1 })
  .exec((err, people) => {
    if (err) {
      done(err);
    } else {
      done(null, people);
    }
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
