const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json( repositories );
});


app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {id: uuid(), title, url, techs, likes: 0 };
  
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  let { url, title, techs } = request.body;

  const repoIndex = repositories.findIndex( repo => repo.id == id);

  if(repoIndex < 0){
    return response.status(400).json({error: 'Repositorie Not Found'});
  }

  title = (title) ? title : repositories[repoIndex].title;
  url   = (url)   ? url   : repositories[repoIndex].url;
  techs = (techs) ? techs : repositories[repoIndex].techs;

  let repo = { title, url, techs };

  repo = { ...repositories[repoIndex], ...repo };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repo => repo.id == id );

  if( repoIndex < 0){
    return response.status(400).json({error: 'Repositorie Not Found'});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id == id );

  if(repoIndex < 0){
    return response.status(400).json({error: 'Repositorie Not Found'});
  }

  ++repositories[repoIndex].likes;

  return response.json( repositories[repoIndex] );


});

module.exports = app;
