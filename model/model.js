const { rawListeners } = require("../db/connection");
const db = require("../db/connection");


exports.selectTopics = ()=> {
    return db.query("SELECT * FROM topics").then(({rows}) => {
        return rows;
    })
}

exports.selectArticleById =(id)=>{
    return db.query("SELECT * FROM articles WHERE article_id = $1; ", [id]).then((res)=>{
      if (res.rows.length === 0) {  
                 return Promise.reject({ status: 404, msg: 'path not found' });
          }
        return res.rows[0];
    })
}

