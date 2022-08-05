
const getEndpoints = require("../endpoints.json");
const {
    selectTopics, selectArticleById, changeArticleById, selectUsers, selectArticles, selectArticleComments, createArticleComments, discardCommentById
  } = require("../model/model");
  

  exports.getTopics = (req, res) => {
     selectTopics().then((topics) => {
      res.status(200).send({topics});
    });
  };
  
  exports.getArticleById = (req,res,next)=>{
    const ID = req.params.article_id
    selectArticleById(ID).then((article)=>{
        res.status(200).send ({article}); 
      }
    ).catch(next);
  }

  exports.patchArticleById = (req,res,next) =>{
    const articleId = req.params.article_id;
    const votes = req.body.inc_votes
    changeArticleById(articleId,votes ).then((article)=>{
      res.status(200).send({article});
    }).catch(next);
  }


  exports.getUsers = (req,res,next)=>{
    selectUsers().then((users) => {
      res.status(200).send({users});
    }).catch(next);
  };


  exports.getArticles = (req,res,next) =>{
    const sortBy = req.query.sort_by
    const order = req.query.order
    const topic = req.query.topic
    selectArticles(sortBy, order, topic).then((articles) => {
      res.status(200).send({articles});
    }).catch(next);
  }



  exports.getArticleComments= (req,res,next) => {
    const ID = req.params.article_id
    selectArticleComments(ID).then((comments)=>{
      res.status(200).send({comments});
    }).catch(next);
  }

  exports.postArticleComments = (req,res,next) => {
    const body = req.body.body
   const username = req.body.username
    const ID= req.params.article_id
    createArticleComments(ID,body,username).then((comments)=>{
      res.status(201).send({comments});
    }).catch(next);
  }

  exports.deleteCommentById = (req,res,next) => {
const comment = req.params.comment_id

discardCommentById(comment). then(()=>{
  res.status(204).send();
}).catch(next);
  }

  exports.getApi = (req,res,next) => {
res.status(200).send(getEndpoints);
  }

 