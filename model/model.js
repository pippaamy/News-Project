const db = require("../db/connection");



exports.selectTopics = ()=> {
    return db.query("SELECT * FROM topics").then(({rows}) => {
        return rows;
    })
}

exports.selectArticleById =(id)=>{
    return db.query("SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;", [id]).then((res)=>{ 
      if (res.rows.length === 0) {  
                 return Promise.reject({ status: 404, msg: 'path not found' });
          }
          
        return res.rows[0];
    })
}


exports.changeArticleById = (id,votes) => {
    if (votes === undefined){
        return Promise.reject({ status: 400, msg: 'bad request' })
    }
    return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [id,votes]
    )
    .then(({ rows }) => { 
        if (rows.length === 0 ) {  
            return Promise.reject({ status: 404, msg: 'path not found' });
     }
   return rows[0];
})
}


exports.selectUsers = ()=>{
    return db.query("SELECT * FROM users").then(({rows}) => {
        return rows;
    })

}


exports.selectArticles = (sortby = "created_at", order = "DESC", topic) => {
    const sortByArray = [
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "author",
      "body",
    ];
    const orderArray = ["ASC", "DESC"];
    const topicArray = [];
    
  
    if (!sortByArray.includes(sortby) || !orderArray.includes(order)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
  
    let queryString = `SELECT articles.*,
  COUNT(comment_id) as comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  
    if (topic) {
      queryString += ` WHERE topic = $1`;
      topicArray.push(topic);
    }
  
    queryString += ` GROUP BY articles.article_id ORDER BY ${sortby} ${order};`;
  
    return db.query(queryString, topicArray).then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "path not found",
        });
      }

      return result.rows;
    })
  };




exports.selectArticleComments = (id) =>{ 
    return db.query("SELECT * FROM comments WHERE article_id = $1", [id]).then(({rows}) => {
        if (rows.length ===0) {  
            return Promise.reject({ status: 404, msg: 'path not found' });
     }
        return rows;
    })

}

exports.createArticleComments = (id,body,username) => { 
    if (body === undefined || username === undefined){
        return Promise.reject({ status: 400, msg: 'bad request' })
    } 
    return db.query("INSERT INTO comments (body,votes,author, article_id, created_at) VALUES ($2,0, $3,$1, NOW()) RETURNING *;", [id,body,username]).then(({rows})=> { 
        if (rows.length === 0){
            return Promise.reject({status: 404, msg :"path not found"})
        }

        return rows;
    })
}

