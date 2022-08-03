const { formatComments } = require("../db/seeds/utils");
const {
    selectTopics, selectArticleById, changeArticleById, selectUsers, selectArticles, selectArticleComments
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
    selectArticles().then((articles) => {
      res.status(200).send({articles});
    }).catch(next);
  }

  exports.getArticleComments= (req,res,next) => {
    const ID = req.params.article_id
    selectArticleComments(ID).then((comments)=>{
      res.status(200).send({comments});
    }).catch(next);
  }