

//generateInput(n: number): number[][]
function generateInput(n){
  let numArr = [];
  // Returns a random int i where min <= i < max
  function randomInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
  }
  for(let i=0; i<n; ++i){
    numArr.push([]);
    while(numArr[i].length < n){
      let randInt = randomInt(0,n);
      if (numArr[i].includes(randInt)===false) {
        numArr[i].push(randInt);
      }
    }
  }
  return numArr;
}
//console.log(generateInput(3));


//oracle(f: (companies: number[][], candidates: number[][]) => Hire[]): void
function oracle(f) {
  let numTests = 20; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 6; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
    }); // Write more tests like this one

    test('Check all length' , function() {
      for(let i = 0; i<hires.length; ++i){
        assert(companies[i].length === hires.length);
        assert(candidates[i].length === hires.length);
     }
    });

      test('check for double assignments', function(){  
        let double = companies.reduce(function(acc, curr){
          let arr = []
          for(let i = 0; i < n; ++i){
           arr.push(false);
          }  
          let count = 0;
          while(!acc && count < n){ ++count;}
        }, false)
       assert(!double);
      });

      test('candidates are within element bounds', function(){
      let isTrue = true;
      for(let i = 0; i < hires.length; ++i){
        if(hires[i].candidate > hires.length - 1 || hires[i].candidate < 0){
          isTrue = false;
        }
      }
      assert(isTrue);
    });

    test('check match functionality', function(){
      let candidatesArr = hires.map(x => x.candidate);
      let companiesArr = hires.map(x => companiesArr);
      let functionality = hires.map(function(x){
        let compNum = companies[x.company].indexOf(x.candidate);   
        let candNum = candidates[x.candidate].indexOf(x.company);
        let isTrue = true;
        for(let k = 0; k < companies.length; ++k){
          let compCheck = companies[x.company].indexOf(k);
          let candCheck = candidates[k].indexOf(x.company);
            if (compCheck < compNum && candCheck < candNum ){
            if (candCheck < candidates[k].indexOf(hires[candidatesArr.indexOf(k)].company)){
                isTrue = false;
            }
          } 
        } 
          assert(isTrue);
      })
    });
  }
}

oracle(wheat1);
oracle(chaff1);



//runOracle(f: (companies: number[][], candidates: number[][]) => Run): void
function runOracle(f){
  let numTests = 10;
  for (let i = 0; i < numTests; ++i) {
    let n = 10; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let run = f(companies, candidates);
    let trace = run.trace;
    let hire = run.out;
    
    let matches = []; //array of current matches


    test('Each proposal is unique', function(){
      assert(traceUnique(trace) === true);
    });

    test('Trace sequence valid', function() {
      assert(traceSequence(trace) === true);
    });

    test('Produced matching is result of trace sequence', function(){
      assert(outMatches(matches) === true);
    });

    //traceSequence(trace: Offer[]): boolean
    function traceSequence(trace){
      for(let i = 0; i < trace.length; ++i){
        //terminates sequence if offer is invalid
        if(offerNotFree(trace[i],matches)){return false;} 
        if(offerNotPrio(trace[i], i)){return false;}
        //converts all valid offers into hire objects and pushes them to matches list
        if(partyFree(trace[i])){matches.push(generateMatch(trace[i]));} 
        else if(betterOffer(trace[i])){
          matches = matches.filter(elem => (trace[i].fromCo ? (elem.candidate !== trace[i].to) : (elem.company !== trace[i].to)));
          matches.push(generateMatch(trace[i]));
        }
      }
      return true;
    }

    //checks if each offer in trace is unique
    //traceUnique(trace: Offer[]): boolean
    function traceUnique(trace){
      let offersSoFar = [];
      for(let i = 0; i < trace.length; ++i){
        if(offersSoFar.some(offer => (offer.fromCo === trace[i].fromCo && offer.from === trace[i].from && offer.to === trace[i].to))){return false;}
        offersSoFar.push(trace[i]); 
      }
      return true;
    }

    //checks if out has same hire objects as matches, returns false if out differs from matches 
    //outMatches(matches: Hire[]): boolean
    function outMatches(matches){
      if(hire.length !== matches.length){return false;}
      for(let i = 0; i < hire.length; ++i){
        let outComp = hire[i].company;
        let outCand = hire[i].candidate;
        let compIndex = matches.findIndex(elem => elem.company === outComp);
        if(compIndex !== -1 && matches[compIndex].candidate !== outCand){return false;}
      }
      return true;
    }



    //ALL FUNCTIONS BELOW ARE HELPERS FOR TESTS

    //constructs array of previous offers sent by offering party, returns false if not offering to next party on priority list
    //offerNotPrio(offer: Offer, index: number): boolean
    function offerNotPrio(offer, index){
      let prevOff = [];
      for(let i = 0; i < index; ++i){
        if(trace[i].fromCo === offer.fromCo && trace[i].from === offer.from){prevOff.push(trace[i]);}
      }
      //if this is the first offer made, ensure that the offer is being sent to the top of priority list
      if(prevOff.length === 0){ 
        if(offer.fromCo){
          return companies[offer.from][0] !== offer.to;
        }
        else{
          return candidates[offer.from][0] !== offer.to;
        }
      }
      //if the index following the last offer on priority list equals the offer, returns false
      let lastOff = prevOff[prevOff.length - 1];
      if(lastOff.fromCo){
        let cand = lastOff.to;
        let comp = lastOff.from;
        let prevIndex = companies[comp].indexOf(cand);
        return companies[comp][prevIndex+1] !== offer.to;
      }
      else{
        let cand = lastOff.from;
        let comp = lastOff.to;
        let prevIndex = candidates[cand].indexOf(comp);
        return candidates[cand][prevIndex+1] !== offer.to;
      }
    }

    //generates match object for a specific offer
    //generateMatch(offer: Offer): Hire
    function generateMatch(offer){
      if(offer.fromCo){return ({company: offer.from, candidate: offer.to});}
      return ({company: offer.to, candidate: offer.from});
    }

    //if offering party already has a match, returns true
    //offerNotFree(offer: Offer, matches: Hire[]): boolean
    function offerNotFree(offer, matches){ 
      if(offer.fromCo){return matches.some(i => i.company === offer.from);}
      return matches.some(i => i.candidate === offer.from);
    }

    //checks if recieving party is unmatched
    //partyFree(offer: Offer): boolean
    function partyFree(offer){
      if(offer.fromCo){return matches.some(i => i.candidate === offer.to) === false;}
      return matches.some(i => i.company === offer.to) === false;
    }

    //checks if offering party is better match for recieving party than their current match 
    //betterOffer(offer: Offer): boolean
    function betterOffer(offer){
      if(offer.fromCo){
        let cand = offer.to;
        let comp = offer.from;
        let currMatch = matches.find(i => i.candidate === cand);
        return candidates[cand].indexOf(comp) < candidates[cand].indexOf(currMatch.company);
      }
      else{
        let cand = offer.from;
        let comp = offer.to;
        let currMatch = matches.find(i => i.company === comp);
        return companies[comp].indexOf(cand) < companies[comp].indexOf(currMatch.candidate);
      }
    }

  }
}
const oracleLib = require('oracle');
runOracle(oracleLib.traceWheat1);
runOracle(oracleLib.traceChaff1);