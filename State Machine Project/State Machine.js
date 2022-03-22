class FSA{
  constructor(){
    let currentState = undefined;
    let states = {};
    //let memento = undefined;

    class State{
      constructor(n){
        this.name = n;
        this.transitions = {};
    }
  
    getName(){
      return this.name;
    }

    setName(s){
      this.name = s;
      return this;
    }

    addTransition(e, s){
      if (lib220.getProperty(this.transitions, e).found) {
        let array = lib220.getProperty(this.transitions, e).value;
        array.push(s);
      }
      else {
        lib220.setProperty(this.transitions, e, [s]);
      }
      return this;
    }

    nextState(e){
        if (lib220.getProperty(this.transitions, e).found) {
          let a = lib220.getProperty(this.transitions, e).value;
          let rand = Math.floor(Math.random() * a.length);
          return a[rand];
        } else {
          return undefined;
        }
    }

    nextStates(e){
      let arr = [];
      if(lib220.getProperty(this.transitions, e).found){
        return lib220.getProperty(this.transitions, e).value;
      }
      else {return arr;}
    }
  }
  

  
  class Memento{
    constructor(state) {
      this.getState = () => state;
    }
    storeState(s){
      this.getState = () => s;
    }
  }

    this.nextState = (e) => {
      if(currentState === undefined){ 
        return this;
      }else{
        let state = currentState.nextState(e);
        currentState = state;
        return this;
      }
    }
  
  this.createState = (s, transitions) => {
    let sta = new State(s);
    if(currentState === undefined){
      currentState = sta;
    }
    for (let i=0; i<transitions.length; ++i){
      let event = Object.keys(transitions[i])[0];
      let stateEvent = Object.values(transitions[i])[0];
      if(lib220.getProperty(states, stateEvent).found){
        sta.addTransition(event, lib220.getProperty(states, stateEvent).value);
      } else{
        let newState = new State(stateEvent);
        lib220.setProperty(states, stateEvent, newState);
        sta.addTransition(event, newState);
      }
    }
    if(lib220.getProperty(states, s).found){
      Object.assign(lib220.getProperty(states, s).value, sta);
    } else{
      lib220.setProperty(states, s, sta);
    }
    return this;
  }

  this.addTransition = (s, t) => {
    state.addTransition(s, t);
    return this;
  }

  this.showState = () => {
    if(currentState === undefined){ return undefined;}
    else {return currentState.getName();}
  }

  this.renameState = (name, newName) => {
    if(currentState === undefined){
      return this;
    } else if( currentState.getName() === name){
      currentState.setName(newName);
    }
    return this;
  }

  this.createMemento = () => {
    let memento = new Memento(currentState);
    return memento;
  }

  this.restoreMemento = (m) => {
    currentState = m.getState();
    return this;
  }
}
// class State{
//   constructor(n){
//     this.name = n;
//     this.transitions = {};
//   }
  
//   getName(){
//     return this.name;
//   }

//   setName(s){
//     this.name = s;
//     return this;
//   }

//   addTransition(e, s){
//     if (lib220.getProperty(this.transitions, e).found) {
//       let array = lib220.getProperty(this.transitions, e).value;
//       array.push(s);
//     }
//     else {
//       lib220.setProperty(this.transitions, e, [s]);
//     }
//     return this;
//   }

//   nextState(e){
//       if (this.hasOwnProperty(e)) {
//         let a = lib220.getProperty(this.transitions, e).value;
//         let rand = Math.floor(Math.random() * a.length);
//         return a[rand];
//       } else {
//         return undefined;
//       }
//   }

//   nextStates(e){
//     let arr = [];
//     if(lib220.getProperty(this.transitions, e).found){
//       return lib220.getProperty(this.transitions, e).value;
//     }
//     else {return arr;}
//   }
// }

// class Memento{
//   constructer(){
//     this.state = undefined;
//   }
//   storeState(s){
//     this.state = s;
//   }
//   getState(){
//     return state;
//   }
// }
}

let myMachine = new FSA()
myMachine.createState("delicates, low", [{mode: "normal, low"}, {temp: "delicates, medium"}])
.createState("normal, low", [{mode: "delicates, low"}, {temp: "normal, medium"}])
.createState("delicates, medium", [{mode: "normal, medium"}, {temp: "delicates, low"}])
.createState("normal, medium", [{mode: "delicates, medium"},{temp: "normal, high"}])
.createState("normal, high", [{mode: "delicates, medium"},{temp: "normal, low"}]);


myMachine.nextState("temp") // moves the machine to delicates, medium
.nextState("mode") // moves the machine to normal, medium
.nextState("temp"); // moves the machine to normal, high
let restoreTo = myMachine.createMemento(); // creates memento from current state
console.log(myMachine.showState());
console.log(restoreTo.getState()); // prints name of state in memento
myMachine.nextState("mode") // moves the machine to delicates, medium
.nextState("temp") // moves the machine to delicates, low
.restoreMemento(restoreTo) // restores the machine to normal, high
console.log(restoreTo.getState()); // prints name of state in memento
console.log(myMachine.showState());