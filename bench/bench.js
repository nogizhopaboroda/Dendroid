var Benchmark = require('benchmark');

var lib = require("./../dist/dendroid");

var stub_object = {
        a: 1,
        b: {
                c: {
                        d: {
                                e: {
                                        f: 23
                                }
                        }
                }
        },
        c: [1,2,[1,2], {a: [1,2,34]}]
};



/**/
var suite = new Benchmark.Suite;

suite.add('Simple copy', function() {
  var a = JSON.parse(JSON.stringify(stub_object))
})
.add('Dendroid initialize', function() {
  var a = lib.Dendroid(stub_object);
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': false });


var target = lib.Dendroid(stub_object);

/**/
var suite2 = new Benchmark.Suite;

suite2.add('Native access first level', function() {
  stub_object.a
})
.add('Dendroid access first level', function() {
  target.a
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': false });



/**/
var suite3 = new Benchmark.Suite;
suite3.add('Native access 5th level', function() {
  stub_object.b.c.d.e.f
})
.add('Dendroid access 5th level', function() {
  target.b.c.d.e.f
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': false });
