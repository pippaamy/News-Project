const {
    selectTopics, selectArticleById
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



  