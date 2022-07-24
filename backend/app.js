const path = require("path");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Datastore = require("nedb");
const messages = new Datastore({
  filename: path.join(__dirname, "db", "messages.db"),
  autoload: true,
  timestampData: true,
});

// curl -H "Content-Type: application/json" -X POST -d '{"content":"hello world!"}' localhost:3000/api/messages/
app.post("/api/messages/", function (req, res, next) {
  messages.insert(
    { content: req.body.content, author: req.body.username },
    function (err, message) {
      if (err) return res.status(500).end(err);
      return res.json(message);
    }
  );
});

// curl localhost:3000/api/messages/
app.get("/api/messages/", function (req, res, next) {
  messages
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .exec(function (err, messages) {
      if (err) return res.status(500).end(err);
      return res.json(messages.reverse());
    });
});

// curl -H "Content-Type: application/json" -X PATCH -d '{"action":"upvote"}' localhost:3000/api/messages/a66mKb0o3pnnYig4/
app.patch("/api/messages/:id/", function (req, res, next) {
  if (["upvote", "downvote"].indexOf(req.body.action) == -1)
    return res.status(400).end("unknown action" + req.body.action);
  messages.findOne({ _id: req.params.id }, function (err, message) {
    if (err) return res.status(500).end(err);
    if (!message)
      return res
        .status(404)
        .end("Message id #" + req.params.id + " does not exists");
    let update = {};
    message[req.body.action] += 1;
    update[req.body.action] = 1;
    messages.update(
      { _id: message._id },
      { $inc: update },
      { multi: false },
      function (err, num) {
        res.json(message);
      }
    );
  });
});

// curl -X DELETE localhost:3000/api/messages/a66mKb0o3pnnYig4/
app.delete("/api/messages/:id/", function (req, res, next) {
  messages.findOne({ _id: req.params.id }, function (err, message) {
    if (err) return res.status(500).end(err);
    if (!message)
      return res
        .status(404)
        .end("Message id #" + req.params.id + " does not exists");
    messages.remove(
      { _id: message._id },
      { multi: false },
      function (err, num) {
        res.json(message);
      }
    );
  });
});

const http = require("http");
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
