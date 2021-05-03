/*load tested functions*/
var functions = require('./main');
var secsTotime = functions['secsTotime'];

/*function to test a function many times with changing the input and out put*/
function testAll(fun,data){
  let i=0,arg=[],result,functionOutput;
  while(i<data.length){
    arg = data[i][0];
    result = data[i][1];
    functionOutput = fun(...arg);
    test(result+' // '+functionOutput+'                       =>'+fun.name+'(board '+i+(arg.length == 0 ? '' : ', ')+String(...arg)+')', function(){expect(functionOutput).toEqual(result)});
    i++;
  }
}

/*test converting seconds(integers) to minutes(string as 'mm:ss')*/
testAll(secsTotime,
  [
    [[60],'01:00'],
    [[150],'02:30'],
    [[0],'00:00'],
    [[61],'01:01'],
    [[3600],'invalidArg'],
    [[1.5],'invalidArg']
  ]

);

/*testing function to control timing*/
/*testAll(functions['secondTick'],
  [
    [[12],11],
    [[1],'timeOver'],

  ]

);

/*time to secs & mins*/
testAll(functions.timeGetSecs,
  [
    [['01:50'],'50'],
    [['00:02'],'02']
  ]

);

testAll(functions.timeGetMins,
  [
    [['01:50'],'01'],
    [['00:02'],'00']
  ]

);

/*test template
testAll(,
  [
    [[],],

  ]

);
*/
