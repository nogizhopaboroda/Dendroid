var assert = require("assert");

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


describe('Dendroid', function(){

  describe('Common', function(){

		var target = lib.Dendroid(stub_object);

		it('Does not modificate object', function(){
			assert.equal(JSON.stringify(stub_object), JSON.stringify(target));
    });

		it('Does not modificate types of properties', function(){
			assert.equal(typeof stub_object.b, 'object');
			assert.equal(stub_object.c instanceof Array, true);
			assert.equal(typeof stub_object.a, 'number');
		});

		it('Chainable', function(){
			assert.equal(target.watch(), target);
			assert.equal(target.watch().watch().watch().watch(), target);
		});

		it('Can return parent of each node', function(){
			assert.equal(target.b.parent, target);
			assert.equal(target.b.c.parent, target.b);
			assert.equal(target.c[3].a.parent, target.c[3]);
		});

		it('Can return path of each node', function(){
			assert.equal(target.b.c.d.e.get_path(), 'b.c.d.e');
			assert.equal(target.c[3].a.get_path(), 'c.3.a');
		});

  });


	describe('Watchers', function(){

		it('Can observe properties', function(){

			var target = lib.Dendroid(stub_object);

			target.c.watch(function(path){
				assert.equal(path, 'c.0');
			});
			target.c[0] = 345;
			assert.equal(target.c[0], 345);
		});

		it('Watch method returns current level', function(){

			var target = lib.Dendroid(stub_object);

			assert.equal(target.b.watch(), target.b);
			assert.equal(target.b.c.d.e.watch(), target.b.c.d.e);
			assert.equal(target.c[3].a.watch(), target.c[3].a);
		});

	});


	describe('API', function(){

		var target = lib.Dendroid(stub_object);

		it('Can dumps to json', function(){
			assert.equal(target.to_json(), JSON.stringify(stub_object));
			assert.equal(target.c.to_json(), JSON.stringify(stub_object.c));
			assert.equal(target.b.c.to_json(), JSON.stringify(stub_object.b.c));
		});

	});

})
