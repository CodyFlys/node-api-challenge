const express = require("express");
const actionsRouter = require("./actionsRouter");
const projectsRouter = require("./projectsRouter");

// creating our server using express
const server = express();

// telling our server to use express json
server.use(express.json());

// telling our server to route to these routers when the endpoints in the "" is hit.
server.use("/api/projects", projectsRouter);
server.use("/api/actions", actionsRouter);



// ENDPOINTS!

server.get("/", (req, res) => {
    res.status(200).json({MESSAGE: "ROOT /"})
})


module.exports = server;