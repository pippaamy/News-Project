const {
    selectTopics
  } = require("../model/model");

  exports.getTopics = (req, res) => {
     selectTopics().then((topics) => {
      res.send(topics);
    });
  };
  



  