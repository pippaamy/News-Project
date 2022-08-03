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

exports.selectArticles = ()=>{
    return db.query("SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;").then(({rows})=> {
        //console.log(rows);
        return rows;
    })

}
