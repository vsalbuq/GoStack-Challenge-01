const express = require("express");

const server = express();

server.use(express.json());

let projects = [];
let countRequests = 0;

/* 
  Middlewares
  ===========
  1 - Check if there is a project with the id specified in the request. If there is no equivalent id, return an error;
  2 - Global Middleware that prints a request count;
*/

function generateId(req, res, next) {
  req.newId = projects.length + 1;
  return next();
}

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res
      .status(400)
      .json({ message: `There is no project with id ${id} registered.` });
  }

  return next();
}

server.use((req, res, next) => {
  countRequests++;
  console.log(`Number of requests until now: ${countRequests}.`);

  return next();
});

/*
  Create
  ======
  POST: /projects
  Body: {
    id: 1,
    title: 'New Project',
    tasks: []
  }
*/

server.post("/projects", generateId, (req, res) => {
  const { title } = req.body;

  projects.push({
    id: req.newId,
    title,
    tasks: []
  });

  return res.json(projects);
});

/*
  Read
  ====
  GET: /projects
  List all projects and tasks
 */

server.get("/projects", (req, res) => {
  return res.json(projects);
});

/* 
  Update
  ======
  PUT: /projects/:id
  Body: {
    title: 'New project title'
  }
  Updates project's title getting it by id
 */

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(project => project.id == id).title = title;

  return res.json({ message: `Project's title updated to "${title}"` });
});

/*
  Delete
  ======
  DELETE: /projects/:id
  Deletes project got by id
  */

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(parseInt(id) - 1, 1);

  return res.json({ message: `Project ${id} deleted.` });
});

/* 
  Create task
  ===========
  POST: /projects/:id/tasks
  Body: {
    title: 'New task'
  }
  Inserts a new task in task array of the project specified by route param id
*/

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(project => project.id == id).tasks.push(title);

  return res.json({ message: `Task "${title}" created!` });
});

server.listen(3333);
