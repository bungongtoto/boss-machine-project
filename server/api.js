const express = require("express");
const apiRouter = express.Router();

const { getAllFromDatabase, addToDatabase, getFromDatabaseById } = require("./db.js");

//parameter validation middlewares
apiRouter.param('minionId', (req, res , next, id) => {
    const minion = getFromDatabaseById('minions', id)
    if (minion){
        req.minion = minion;
        next();
    }else {
        const err = new Error(`No minion with Id: ${id}`);
        err.status = 404;
        next(err);
    }
})

apiRouter.param('ideaId', (req, res , next, id) => {
    const idea = getFromDatabaseById('ideas', id)
    if (idea){
        req.idea = idea;
        next();
    }else {
        const err = new Error(`No idea with Id: ${id}`);
        err.status = 404;
        next(err);
    }
})

//middleware to get model for get and post request
const getModel = (req, res, next) => {
  const model = req.url.split("/").filter(Boolean).pop();
  req.model = model;
  next();
};

const validateModalInput = (req, res, next) => {
  if (
    (req.body.name &&
      req.body.title &&
      req.body.salary &&
      req.body.weaknesses) ||
    (req.body.name &&
      req.body.description &&
      req.body.numWeeks &&
      req.body.weeklyRevenue) ||
    (req.body.time && req.body.date && req.body.note)
  ) {
    next();
  } else {
    const err = new Error("Invalid Input");
    err.status = 400;
    next(err);
  }
};

// get routes for all the models
apiRouter.get(
  ["/minions", "/ideas", "/meetings"],
  getModel,
  (req, res, next) => {
    const modelData = getAllFromDatabase(req.model);
    res.send(modelData);
  }
);

// post routes for all the models
apiRouter.post(
  ["/minions", "/ideas", "/meetings"],
  getModel,
  validateModalInput,
  (req, res, next) => {
    const createdModel = addToDatabase(req.model, req.body);
    res.send(createdModel);
  }
);

//get by Id routes for minions and routes

apiRouter.get('/minions/:minionId', (req, res, next) => {
  res.send(req.minion);
});

apiRouter.get('/ideas/:ideaId', (req,res, next)=> {
  res.send(req.idea);
})
module.exports = apiRouter;
