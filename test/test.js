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

		describe('One Level Watchers', function(){

			it('Can match all properties', function(){
				var target = lib.Dendroid(stub_object);
				target.c.watch('*', function(new_value, old_value, path){
					assert.equal(new_value, 345);
					assert.equal(old_value, 1);
				});
				target.c[0] = 345;
				assert.equal(target.c[0], 345);
			});

			it('Can match only one property', function(){
				var target = lib.Dendroid(stub_object);
				target.c.watch('1', function(new_value, old_value, path){
					assert.equal(new_value, 678);
					assert.equal(old_value, 2);
				});
				target.c[1] = 678;
				target.c[0] = 999;
				assert.equal(target.c[1], 678);
			});

			it('Pass path parameter correctly', function(){
				var target = lib.Dendroid(stub_object);
				target.c.watch('2', function(new_value, old_value, path){
					assert.equal(path, '2');
				});
				target.c[2] = 'test';
				assert.equal(target.c[2], 'test');
			});

		});

		describe('Child Watchers', function(){

			it('Can match all properties', function(){
				var target = lib.Dendroid(stub_object);
				target.c.watch('*', function(new_value, old_value, path){
					assert.equal(path, '3.a.0');
					assert.equal(new_value, 989);
					assert.equal(old_value, 1);
				});
				target.c[3].a[0] = 989;
				assert.equal(target.c[3].a[0], 989);
			});

			it('Can match only one property', function(){
				var target = lib.Dendroid(stub_object);
				target.c.watch('3.a.2', function(new_value, old_value, path){
					assert.equal(new_value, 256);
					assert.equal(old_value, 34);
				});
				target.c[3].a[2] = 256;
				target.c[3].a[1] = 777;
				assert.equal(target.c[3].a[2], 256);
			});

			it('Pass path parameter correctly', function(){
				var target = lib.Dendroid(stub_object);
				target.c.watch('3.a.1', function(new_value, old_value, path){
					assert.equal(path, '3.a.1');
				});
				target.c[3].a[1] = 'ok';
				assert.equal(target.c[3].a[1], 'ok');
			});

		});

		it('Watch method returns current level', function(){

			var target = lib.Dendroid(stub_object);

			assert.equal(target.b.watch(), target.b);
			assert.equal(target.b.c.d.e.watch(), target.b.c.d.e);
			assert.equal(target.c[3].a.watch(), target.c[3].a);
		});

		it('Correctly replaces hash', function(){

			var target = lib.Dendroid(stub_object);

			var new_hash_property = {
				e: 12,
				d: 21,
				f: {
					g: 23
				}
			};

			target.b.c = new_hash_property;
			assert.equal(target.b.c.to_json(), JSON.stringify(new_hash_property));
			assert.equal(target.b.c.parent, target.b);
			assert.equal(target.b.c.f.parent, target.b.c);
		});

		it('Correctly replaces array', function(){

			var target = lib.Dendroid(stub_object);

			var new_hash_property = [1,2, {
				f: {
					g: 23
				}
			}];

			target.b.c = new_hash_property;
			assert.equal(target.b.c.to_json(), JSON.stringify(new_hash_property));
			assert.equal(target.b.c.parent, target.b);
			assert.equal(target.b.c[2].f.parent, target.b.c[2]);
		});

	});


	describe('API', function(){

		var target = lib.Dendroid(stub_object);

		it('Can dumps to json', function(){
			assert.equal(target.to_json(), JSON.stringify(stub_object));
			assert.equal(target.c.to_json(), JSON.stringify(stub_object.c));
			assert.equal(target.b.c.to_json(), JSON.stringify(stub_object.b.c));
		});

		it('Returns array/hash property path', function(){
			assert.equal(target.b.c.d.e.get_path(), 'b.c.d.e');
			assert.equal(target.c[3].a.get_path(), 'c.3.a');
		});

	});

})
