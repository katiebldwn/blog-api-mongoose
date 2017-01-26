const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const blogRouter = require('./blogRouter');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const blogPost = new Schema ({
  title: String,
  content: String,
  author: String
});

mongoose.connect('mongodb://user1:user1@ds127439.mlab.com:27439/blog');

const blogEntry = mongoose.model('blog', blogPost);

// app.use(morgan('common'));
app.get('/', (req, res) => {
  // res.json(BlogPosts.get());
  blogEntry.find(function(err, blog) {
    console.log(blog);
    if (err)
      res.send(err);
    res.json(blog)
    console.log('got here');
  })
});
// app.use('/', blogRouter);

//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
    .on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};



