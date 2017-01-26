const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// use 'should' style syntax in our tests
const should = chai.should();

// use http requires in our tests
chai.use(chaiHttp);

describe('blog', function() {
	before(function() {
    	return runServer();
  	});

  	after(function() {
    	return closeServer();
  	});

  	// GET
  	it('should list blog posts on GET', function() {
  		return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        // because we create three items on app load
        res.body.length.should.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ['author', 'content', 'id', 'title'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  	});

  	// POST
  	it('should add a blog post on POST', function() {
    const newItem = {
    	title: 'About Me', 
    	content: 'I\'m an aspriing full stack web developer.', 
    	author: 'Dana',
    	publishDate: Date.now()
    };
    return chai.request(app)
      .post('/')
      .send(newItem)
      .then(function(res) {
      	console.log(res.body);
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('author', 'content', 'id', 'title');
        res.body.id.should.not.be.null;
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  	// PUT
  	it('should update items on PUT', function() {
    // we initialize our updateData here and then after the initial
    // request to the app, we update it with an `id` property so
    // we can make a second, PUT call to the app.
    const updateData = {
      	title: 'New title',
      	content: "Some content.",
      	author: "Aristole",
      	publishDate: Date.now()
    };

    return chai.request(app)
      .get('/')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/${updateData.id}`)
          .send(updateData);
      })
      // prove that the PUT request has right status code
      // and returns updated item
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });
    //Delete
  	it('should delete blog posts on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/')
      .then(function(res) {
        return chai.request(app)
          .delete(`/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});