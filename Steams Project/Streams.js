


// sempty: Stream<T>
let sempty = { isEmpty: () => true,
  toString: () => 'sempty' };

// snode<T>(head: T, tail: Memo<Stream<T>>): Stream<T>
function snode(head, tail) {
  return { isEmpty: () => false,
  head: () => head, 
  tail: tail.get,
  map : f => snode(f(head), memo0(() => tail.get().map(f))),
  toString: () => "snode(" + head.toString() + ", " + tail.toString() + ")" }
}


function memo0(f) {
  let r = { evaluated: false };
  return { get: function() {
    if (!r.evaluated) {
      r = { evaluated: true, v: f() }
    }
    return r.v;
  },
  toString: function() {
  return r.evaluated ? r.v.toString()
  : '<unevaluated>';
  } };
}


function addSeries(ser1, ser2){
  if(ser1.isEmpty() && ser2.isEmpty()){
    return;
  }
  else if(ser1.isEmpty() && !ser2.isEmpty() ){ //if ser1 and ser2 are different lengths
    return snode(ser1.head, memo0( addSeries(ser1.tail(), ser2)) );
  } else if(ser2.isEmpty() && !ser1.isEmpty() ){ //if ser1 and ser2 are different lengths
    return snode(ser2.head, memo0( addSeries(ser2.tail(), ser1)) );
  }
  let newStream = snode(ser1.head() + ser2.head() , memo0( () => addSeries(ser1.tail(),ser2.tail()) ));
  return newStream;
}

function prodSeries(ser1, ser2){
  if(ser1.isEmpty()){
    return sempty;
  }
  let newStream1 = ser2.map((num) => num*ser1.head());
  let newStream2 = snode(ser1.tail().head() * ser2.head(), memo0( () => prodSeries(ser1.tail().tail(),ser2.tail()) ));
  
  return addSeries(newStream1, newStream2);
}

// function derivSeries(ser1){
//   //if( ser1.isEmpty() ){ return; }
//   let tempSer = ser1;
//   let len = 0;
//   while(!tempSer.isEmpty()){
//     len = len+1;
//     tempSer = tempSer.tail();
//   }
//   if(len===0){ return derivSeriesHelper(ser1, 0);} 
//   else{ return derivSeriesHelper(ser1.tail(), 1);}
// }
// function derivSeriesHelper(ser1, exp){
//   if(ser1.isEmpty()){ return sempty; }
//   let newSer = snode(ser1.head()*exp, memo0( () => derivSeriesHelper(ser1.tail(), exp+1) ));
//   return newSer;
// }


function derivSeries(ser1){
  if(ser1.tail().isEmpty()){
    return derivSeriesHelper(ser1,0);
  }
  //if( ser1.isEmpty() ){ return; }
  return derivSeriesHelper(ser1.tail(),1);
}
function derivSeriesHelper(ser1, exp){
  if(ser1.isEmpty()){ return sempty; }
  let newSer = snode(ser1.head()*exp, memo0( () => derivSeriesHelper(ser1.tail(), exp+1) ));
  return newSer;
}



function coeff(ser1, n){
  let newArr = [];
  let newSer = ser1;
  for(let i=0; i<=n; ++i){
    let data = newSer.head();
    newArr.push(data);
    newSer = newSer.tail();
    if( newSer.isEmpty() ){
      break;
    }
  }
  return newArr;
}


function evalSeries(str1, n){
  let arr = coeff(str1, n);
  return function(x){
    return evalHelper(x, 0, arr,n);
  }
}

function evalHelper(x, count, arr,n){
  if(count===n+1){ return 0; }
  return arr[count]*(Math.pow(x,count)) + evalHelper(x, count+1, arr,n);
}

function rec1Series(f, v){
  return snode(v, memo0( () => rec1Series(f, f(v))) );
}

function expSeries(){
  return expSeriesHelper(0);
}
function expSeriesHelper(k){
  return snode((1.0/( fact(k))), memo0( () => expSeriesHelper(k+1) ));
}

function fact(n){
  if (n===0){return 1;}
  else{
    return n*(fact(n-1));
  }
}
let count = 0;
function recurSeries(coef, init){
  let k = coef.length;
  if(count < k){
    let oldCount = count;
    count = count+1;
    // console.log(oldCount);
    // console.log(count);
    return snode(init[oldCount] , memo0( () => recurSeries(coef, init) ));
  }
  let prod = multiply(coef, init);
  return snode(prod, memo0( ()=> recurSeries(coef, newInit(coef, init, prod))));
}

function multiply(coef, init){
  let len = coef.length;
  let sum = 0;
  for(let i=0; i<len; ++i){
    sum = (coef[i]*init[i]) + sum;
  }
  return sum;
}

function newInit(coef, init, prod){
  let len = coef.length;
  for(let i=0; i<len; ++i){
    if(i+1 < len){
      init[i] = init[i+1];
    }
    else {
      init[i] = prod;
    }
  }
  return init;
}


function smap(stream, f) {
  if (stream.isEmpty()) { return sempty; }
  return snode(f(stream.head()),
  memo0(() => smap(stream.tail(), f)));
}

function snode1(data, next) { // next is a function!
  return { head: () => data,
    tail: () => next() }
} // or just tail: next
const from = n => snode1(n, () => from(n + 1));
const nats = from(1);
// let temp = evalSeries(nats, 3);
// console.log(temp(5));
//smap(expSeries(), (arg) => console.log(arg));
//console.log(prodSeries(expSeries(), expSeries()));

//console.log(recurSeries([1,2,3],[4,5,6]).tail().tail().tail().tail().tail().head());
