//parseExpression(str: string): Result<Expr>

//parseProgram(str: string): Result<Stmt[]>

// Given a state object and an AST of an expression as arguments,
// interpExpression returns the result of the expression (number or boolean)
//interpExpression(state: State, e: Expr): number | boolean
function interpExpression( state, e){
 let expr = e.kind;
 if(expr === 'boolean'){
   return e.value;
 } else if(expr === 'number'){
  return e.value;
 } else if(expr === 'variable'){
  return lib220.getProperty(state, e.name).value;
 } else{ //Operator
  let oper = e.op;
  if(e.op === '+'){
    return interpExpression(state, e.e1) + interpExpression(state,e.e2);
  } else if(oper === '-'){
    return interpExpression(state, e.e1) - interpExpression(state,e.e2);
  } else if(oper === '*'){
    return interpExpression(state, e.e1) * interpExpression(state,e.e2);
  } else if(oper === '/'){
    return interpExpression(state, e.e1) / interpExpression(state,e.e2);
  } else if(oper === '>'){
    return interpExpression(state, e.e1) > interpExpression(state,e.e2);
  } else if(oper === '<'){
    return interpExpression(state, e.e1) < interpExpression(state,e.e2);
  } else if(oper === '==='){
    return interpExpression(state, e.e1) === interpExpression(state,e.e2);
  } else if(oper === '&&'){
    return interpExpression(state, e.e1) && interpExpression(state,e.e2);
  } else if (oper === '||'){
    return interpExpression(state, e.e1) || interpExpression(state,e.e2);
  }
 }
}




// Given a state object and an AST of a statement,
// interpStatement updates the state object and returns nothing
//interpStatement(state: State, p: Stmt): void
function interpStatement(state, p){
  let stmt = p.kind;
  if(stmt === 'let' || stmt === 'assignment'){
    lib220.setProperty(state, p.name, interpExpression(state, p.expression));
  } 
  //IF
  else if(stmt ==='if'){
    if(interpExpression(state, p.test)) {
      p.truePart.forEach(i => {
        interpStatement(state, i);
      });
    } else {
      p.falsePart.forEach(i => {
        interpStatement(state, i);
      });
    }
  //PRINT
  } else if (stmt === 'print') {
    console.log(interpExpression(state, p.expression));
  } 
  //WHILE
  else if(stmt === 'while'){
    let obj = { kind: 'if',
      test: p.test,
      truePart: p.body.concat(p),
      falsePart: [] };
      for(let i=0; i< [obj].length; ++i){
        interpStatement(state, obj[i])
      }
  }
}

// interpProgram(p: Stmt[]): State
function interpProgram(p){
  let emptyState = {};
  for(let i=0; i< p.length; ++i){
    interpStatement(emptyState, p[i]);
  }
  return emptyState;
}

//given test
test("multiplication with a variable", function() {
let r = interpExpression({ x: 10 }, parser.parseExpression("x * 2").value);
assert(r === 20);
});
//given test
test("assignment", function() {
let st = interpProgram(parser.parseProgram("let x = 10; x = 20;").value);
assert(st.x === 20);
});

test("multiplication and addition", function() {
  let num = interpExpression({ a: 10, b:20 }, parser.parseExpression("a * 2 + b").value);
  assert(num === 40);
});

test("greater than and less than" , function() {
  let obj = { a:12 };
  let bool = interpExpression( obj, parser.parseExpression("a > 5").value);
  assert(bool);
  bool = interpExpression( obj, parser.parseExpression("a < 15").value);
  assert(bool);
});

test("boolean", function() {
  let bool = interpExpression({ a: 10, b:20 }, parser.parseExpression("10 === 10").value);
  assert(bool === true);
  bool = interpExpression({ a: 10, b:20 }, parser.parseExpression("10 === 20").value);
  assert(bool === false);
});

test("check obj assignment", function() {
  let numObj = { a: 11 };
  let state = interpStatement(numObj, parser.parseProgram("let a = 10;").value[0]);
  console.log(state);
  assert(numObj.a === 10);
});