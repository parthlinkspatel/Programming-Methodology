class FluentRestaurants{

  constructor(jsonData){
    this.data = jsonData;
  }

  //fromState(stateStr: string): FluentRestaurants
  fromState(stateStr){
    return new FluentRestaurants(this.data.filter(function(object) {
    if (lib220.getProperty(object, 'state').found === false){
      return false;
    } 
    return object.state === stateStr}));
  }

  //ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating){
    function f(obj){
      if(lib220.getProperty(obj,"stars").found === false){
        return false;
      }
      else {return lib220.getProperty(obj,"stars").value <= rating;}
    }
    let result = this.data.filter(f);
    return new FluentRestaurants(result);
  }

  //ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating){
    function func(object){
      if(lib220.getProperty(object, "stars").found === false){
        return false;
      }
      else { return lib220.getProperty(object, "stars").value >= rating;}
    }
      let result = this.data.filter(func);
      return new FluentRestaurants(result);
  }

  //category(categoryStr: string): FluentRestaurants
  category(categoryStr){
    let result = [];
    result = this.data.filter(function(object) {
      if (lib220.getProperty(object, 'categories').found) {
        let store = lib220.getProperty(object, 'categories').value;
        store.includes(categoryStr);
        return store.includes(categoryStr);
      }
      else { return false;}
    });
    return new FluentRestaurants(result);
  }

  //hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr){
    let res = [];
    res = this.data.filter(function(object) {
      if (lib220.getProperty(object, 'attributes').found) {
        let store = lib220.getProperty(object, 'attributes').value;
        if (lib220.getProperty(store, 'Ambience').found) {
          if (lib220.getProperty(lib220.getProperty(store, 'Ambience').value, ambienceStr).found) {
            return lib220.getProperty(lib220.getProperty(store, 'Ambience').value, ambienceStr).value;
          }
          else { return false; }
        }
        else { return false; }
      }
      else { return false;}
    });
    return new FluentRestaurants(res);
  }

  //bestPlace() : Restaurant | {}
  bestPlace(){
    let object = new FluentRestaurants(this.data);
    return object.data.reduce(function(acc, curr){
    if (lib220.getProperty(acc, 'stars').found === false) {
      return curr;
    }
    else if (lib220.getProperty(curr, 'stars').value > lib220.getProperty(acc, 'stars').value){
      return curr;
    }
    else if( (lib220.getProperty(curr, 'stars').value === lib220.getProperty(acc, 'stars').value) && (lib220.getProperty(curr, 'review_count').value > lib220.getProperty(acc, 'review_count').value)){
      return curr;
    }
    else {
      return acc;
    }
  }, {});
  }

  //mostReviews(): Restaurant | {}
  mostReviews(){
    let object = new FluentRestaurants(this.data);
    return object.data.reduce(function(acc,curr){
      if (lib220.getProperty(acc, 'review_count').found === false) {
        return curr;
      }
      else if (lib220.getProperty(curr, 'review_count').value > (lib220.getProperty(acc, 'review_count').value)){
        return curr;
      }
      else if ( (lib220.getProperty(curr, 'review_count').value === lib220.getProperty(acc, 'review_count').value) 
        && (lib220.getProperty(curr, 'stars').value > lib220.getProperty(acc, 'stars').value)){
      return curr;
    }
      else{
        return acc;
      }
    }, {})
  }
}

///tests:

const testJSON = [
  {
  name: "Taco Bell",
  state: "MA",
  stars: 4,
  review_count: 3,
  },
  {
  name: "Chik-fil-A",
  state: "MA",
  stars: 4,
  review_count: 10,
  },
  {
  name: "Blaze Pizza",
  state: "NH",
  stars: 4,
  review_count: 30,
  },
  {
  name: "Brothers Pizza",
  state: "MA",
  stars: 3,
  review_count: 30,
  }
];
test('fromState method', function() {
  let tObj = new FluentRestaurants(testJSON);
  let list = tObj.fromState("MA").data;
  assert(list.length === 3);
  assert(list[0].name === "Taco Bell");
  assert(list[1].name === "Chik-fil-A");
  assert(list[2].name === "Brothers Pizza");
});
test('bestPlace method', function() {
  let list = new FluentRestaurants(testJSON);
  let rest = list.fromState('MA').bestPlace();
  assert(rest.name === 'Chik-fil-A');
});

const testData = [
{
name: "Applebee's",
state: "NC",
stars: 4,
review_count: 6,
},
{
name: "China Garden",
state: "NC",
stars: 4,
review_count: 10,
},
{
name: "Beach Ventures Roofing",
state: "AZ",
stars: 3,
review_count: 30,
},
{
name: "Alpaul Automobile Wash",
state: "NC",
stars: 3,
review_count: 30,
}
]
test('fromState filters correctly', function() {
let tObj = new FluentRestaurants(testData);
let list = tObj.fromState('NC').data;
assert(list.length === 3);
assert(list[0].name === "Applebee's");
assert(list[1].name === "China Garden");
assert(list[2].name === "Alpaul Automobile Wash");
});
test('bestPlace tie-breaking', function() {
let tObj = new FluentRestaurants(testData);
let place = tObj.fromState('NC').bestPlace();
assert(place.name === 'China Garden');
});


let data = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');

test("Usage for getProperty", function() {
  let obj = { x: 492, y: "Parth"};
  assert(lib220.getProperty(obj, 'x').found === true);
  assert(lib220.getProperty(obj, 'x').value === 492);
  assert(lib220.getProperty(obj, 'y').value === "Parth");
});

test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
  let numResult = tObj.fromState(5).data;
  assert(numResult.length === 0);
});

test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');
});

test('mostReviews tie-breaker', function() {
  let testObj = new FluentRestaurants(testData);
  let place = testObj.mostReviews();
  assert(place.name === 'Beach Ventures Roofing');
});

test('rating, category, hasAmbience, fromState method', function()  {
  let fi = new FluentRestaurants(data);
  assert(fi.ratingLeq(4).ratingGeq(2).category('Restaurants').hasAmbience('romantic').fromState('AZ').bestPlace().name === 'Verona Chophouse');
});

test('ratingLeq method', function(){
  let testObj = new FluentRestaurants(testData);
  let arr = testObj.ratingLeq(4).data;
  assert(arr.length === 4);
  assert(arr[0].name === "Applebee's");
  assert(arr[1].name === "China Garden");
  assert(arr[2].name === "Beach Ventures Roofing");
  assert(arr[3].name === "Alpaul Automobile Wash");
  let arrNeg = testObj.ratingLeq(-1).data;
  assert(arrNeg.length === 0);
});

test('ratingGeq method', function(){
  let testObj = new FluentRestaurants(testData);
  let arr = testObj.ratingGeq(4).data;
  assert(arr.length === 2);
  assert(arr[0].name === "Applebee's");
  assert(arr[1].name === "China Garden");
  let arrNeg = testObj.ratingGeq(-1).data;
  assert(arrNeg.length === 4);
});

test('category, fromState, hasAmbience methods', function(){
  let testObj = new FluentRestaurants(data);
  let result = testObj.category('Chinese').fromState('ON').hasAmbience('casual').bestPlace().name;
  console.log(result);
  assert(result === "Chatime - Yonge & College");
  let noResult = testObj.category('no result').data;
  assert(noResult.length === 0);
  let numResult = testObj.category(5).data;
  assert(numResult.length === 0);
});

test('hasAmbience method', function(){
  let testObj = new FluentRestaurants(data);
  let result = testObj.hasAmbience('casual').bestPlace().name;
  assert(result === "Defalco's Italian Grocery");
  let noResult = testObj.hasAmbience('no result').data;
  assert(noResult.length === 0);
});


// let f = new FluentRestaurants(data);
// console.log(f.ratingLeq(5)
// .ratingGeq(3)
// .category("Restaurants")
// .hasAmbience('casual')
// .bestPlace()
// .name);