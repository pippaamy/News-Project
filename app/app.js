const express = require("express");
const {
    getTopics, getArticleById, patchArticleById, getUsers, getArticles, getArticleComments, postArticleComments, deleteCommentById, getApi
  } = require("../controller/controller");
  
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComments);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getApi);
app.all("*", (req, res) => {
  
  res.status(404).send({ msg: "path not found" });
});
//////////////////////////////////////////////////////////////////////
  app.use((err, req, res, next) => {
  
    if (err.code === "22P02") {
      res.status(400).send({ msg: 'bad request' });
    } else if ( err.code === "23503") {
      res.status(404).send({msg: "path not found"})
    } 
     
      next(err);
    } );

    

    app.use((err,req,res,next)=> {
      if (err.status) {
        res.status(err.status).send({msg:err.msg});
      } next(err);
    })

    app.use((err,req,res)=> {
      console.log(err, "unhandled error")
    });

    

module.exports = app;