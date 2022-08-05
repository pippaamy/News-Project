const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index");


beforeEach(() => seed(data));
afterAll(() => {
  if (db.end) db.end();
});
describe("GET topics", ()=> {
    test ("return 200 status, returns length", ()=> {
        return request(app).get("/api/topics").expect(200).then(({body})=>
        {expect(body.topics.length).toBeGreaterThanOrEqual(1)
            body.topics.forEach((topic)=> {expect (topic).toEqual(expect.objectContaining({
slug : expect.any(String),
description : expect.any(String)
    
              }))})
  })
} )
});

describe("GET articles by ID",
()=> {
    test("return status 200", ()=>{
        return request(app).get("/api/articles/2").expect(200).then(({body})=> {
        const {article} = body;
           expect(article).toHaveProperty("author");
           expect(article).toHaveProperty("title")
           expect(article).toHaveProperty("article_id")
           expect(article).toHaveProperty("body")
           expect(article).toHaveProperty("topic")
           expect(article).toHaveProperty("created_at")
           expect(article).toHaveProperty("votes")
        })
    })

    test("returns a 404  when invalid request", ()=>{
      return request(app).get("/api/articles/123546").expect(404).then (({body})=>{
    expect(body.msg).toBe("path not found")
      })
    })
    test("returns a 400 when invalid request", ()=>{
      return request(app).get("/api/articles/baaaaaanana").expect(400).then (({body})=>{
    expect(body.msg).toBe("bad request")
      })
    })

});

describe("PATCH article", ()=> {
  test ("change an article by positive number",()=>{
    return request(app).patch("/api/articles/1") .send({
      inc_votes : 1 
    }).expect(200).then(({body})=>{
      expect(body.article).toHaveProperty("votes")
     expect(body.article.votes).toBe(101);
    })
  })
  test ("change an article by negative number",()=>{
    return request(app).patch("/api/articles/1") .send({
      inc_votes : -20
    }).expect(200).then(({body})=>{
      expect(body.article).toHaveProperty("votes")
     expect(body.article.votes).toBe(80);
    })
  })
  test("does not add item in incorrect form",()=> {
    return request(app).patch("/api/articles/1") .send("hello"
) .expect(400).then(({body})=>{
  expect(body.msg).toBe("bad request")
  })
})
test("have not added item in incorrect form",()=> {
  return request(app).patch("/api/articles/1") .send({inc_votes:"hello"}
) .expect(400).then(({body})=>{
expect(body.msg).toBe("bad request")
})
})
test("throw err when key of object spelt wrong",()=> {
  return request(app).patch("/api/articles/1") .send({in_votes:"hello"}
) .expect(400).then(({body})=>{
expect(body.msg).toBe("bad request")
})
})
test("returns a 404  when invalid request",()=> {
  return request(app).patch("/api/articles/990971") .send({
    inc_votes : -20
  })
 .expect(404).then(({body})=>{
expect(body.msg).toBe("path not found")
})
})

})



describe("GET users",()=>{
  test("returns users as an array of object",()=>{
    return request(app).get("/api/users").expect(200).then(({body})=>
        {expect(body.users.length).toBeGreaterThanOrEqual(1)
            body.users.forEach((user)=> {expect (user).toEqual(expect.objectContaining({
username : expect.any(String),
name : expect.any(String),
avatar_url :expect.any(String)
    
            }))})
  })
})
})

describe("GET articles by ID",
()=> {
    test("return status 200", ()=>{
        return request(app).get("/api/articles/2").expect(200).then(({body})=> {
        const {article} = body;
           expect(article).toHaveProperty("comment_count")
        })
    })
  });

  describe("GET articles (with comments)", ()=>{
test("returns articles in array of objects with properties needed", ()=>{
  return request(app).get("/api/articles").expect(200).then(({body})=>
  { expect(body.articles.length).toBe(12) 
      body.articles.forEach((article)=> { expect (article).toEqual(expect.objectContaining({
author : expect.any(String),
title : expect.any(String),
article_id : expect.any(Number),
body : expect.any(String),
topic: expect.any(String),
created_at :expect.any(String),
votes : expect.any(Number),
comment_count: expect.any(String)   
 }))})
})
})

test("returns in descending order",()=> {
  return request(app).get("/api/articles").expect(200).then(({body})=> {const article = body.articles; 
    expect(article).toBeSortedBy("created_at",{descending:true})} )

  });
});
  
describe("GET article's comments", ()=>{
  test("returns comments of article received by article id", ()=> {
return request(app).get("/api/articles/1/comments").expect(200).then(({body})=> { 
   expect(body.comments.length).toBeGreaterThanOrEqual(1) 
    body.comments.forEach((comments)=> { expect (comments).toEqual(expect.objectContaining({
comment_id : expect.any(Number),
votes: expect.any(Number),
created_at: expect.any(String),
author :expect.any(String),
body : expect.any(String), 
}))})
})
  })

  test("returns a 404  when invalid request", ()=>{
    return request(app).get("/api/articles/123546/comments").expect(404).then (({body})=>{
  expect(body.msg).toBe("path not found")
    })
  })
  test("returns a 400 when invalid request", ()=>{
    return request(app).get("/api/articles/baaaaaanana/comments").expect(400).then (({body})=>{
  expect(body.msg).toBe("bad request")
    })
  })
})


describe("POST comment", ()=>{
  test("post comment when given an object", ()=>{return request(app).post("/api/articles/1/comments") .send({
    username: "butter_bridge",
    body: "this is my favourite article EVER!!!"
  }).expect(201).then(({body})=>{ const comments =body.comments[0];
    expect(comments).toHaveProperty("author")
   expect(comments).toHaveProperty("body")
   expect(comments).toHaveProperty("article_id")
   expect(comments).toHaveProperty("votes")
   expect(comments).toHaveProperty("created_at")
  })

  })
  test("returns a 404  when invalid request", ()=>{
    return request(app).post("/api/articles/123546/comments").send({
      username: "butter_bridge",
      body: "this is my favourite article EVER!!!"
    }).expect(404).then (({body})=>{
  expect(body.msg).toBe("path not found")
    })
  })
  test("returns a 400 when invalid request", ()=>{
    return request(app).post("/api/articles/baanana/comments") .send({
      username: "butter_bridge",
      body: "this is my favourite article EVER!!!"
    }).expect(400).then (({body})=>{
  expect(body.msg).toBe("bad request")
    })
  })
  test("returns a 400 when username spelt incorrectly", ()=>{
    return request(app).post("/api/articles/1/comments").send ({usename: "butterbridge", body: "this is cool!"}).expect(400).then (({body})=>{
  expect(body.msg).toBe("bad request")
    })
  })
  test("returns a 400 when key spelt incorrectly", ()=>{
    return request(app).post("/api/articles/1/comments").send({username: "butterbridge", bdy : "this is fine!"}).expect(400).then (({body})=>{
  expect(body.msg).toBe("bad request")
    })
  })
  test("returns a 400 when key spelt incorrectly", ()=>{
    return request(app).post("/api/articles/1/comments").send("hello").expect(400).then (({body})=>{
  expect(body.msg).toBe("bad request")
    })
  })
})

describe("GET article with features", () => {

  test(" sorts by column inserted", ()=>{
return request(app).get("/api/articles?sortby=author").expect(200).then(({body})=> {const articles = body.articles; 
  expect(articles).toBeSortedBy(articles.author,{descending:true})} )
  })

  test(" defaults to sort by date", ()=> {
    return request(app).get("/api/articles").expect(200).then(({body})=> {const articles = body.articles;
      expect(articles).toBeSortedBy(articles.created_at,{descending:true})} )
  })

  test("returns in ascending order", ()=> {
    return request(app).get("/api/articles?order=ASC").expect(200).then(({body})=> {const articles = body.articles; 
      expect(articles).toBeSortedBy("created_at",{descending:false})} )
    

  })
  test("defaults to descending order & default date", ()=> { return request(app).get("/api/articles").expect(200).then(({body})=> {const articles = body.articles; 
    expect(articles).toBeSortedBy(articles.created_at,{descending:true})} )

  })
  test("filters out query by topic wanted", ()=> {

    return request(app).get("/api/articles?topic=cats").expect(200).then(({body})=> 
    
    {const articles = body.articles;

      expect(articles).toBeSortedBy("created_at",{descending:true});
      expect(articles.length).toBeGreaterThanOrEqual(1);
      body.articles.forEach((article)=> {expect(article.topic).toEqual("cats")
    } )
      })
  })
    
  
  test("tests all functionality at once", ()=> {
    return request(app).get("/api/articles?sortby=author&order=ASC&topic=mitch").expect(200).then(({body})=> {const articles = body.articles;  
      expect(articles).toBeSortedBy(articles.author,{descending:false});
    expect(articles[0].topic).toBe("mitch");} )
      })
});

  
test("if passed an invalid order returns default 200 ", () => {
  return request(app)
    .get("/api/articles?sortb=bananas")
    .expect(200).then(({body})=> {const articles = body.articles;  
      expect(articles).toBeSortedBy(articles.created_at,{descending:true});
    
      })
  
    });
  

    describe("delete comment by ID", ()=> {
    test("deletes the comment by comment_id", ()=> {
      return request(app).delete("/api/comments/2").expect(204);
    })

    test("test should return 404 with a valid id but non-existent", () => {
      return request(app)
        .delete("/api/comments/89734562")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    })

    test("should return 400 when id is invalid", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  })

  describe("GET /api", ()=> {
    test("returns object containing endpoints", ()=>{
      return request(app).get("/api").expect(200).then(({body})=> {  
        console.log(body)  
           expect(body).toHaveProperty("GET /api");
           expect(body).toHaveProperty("GET /api/topics")
           expect(body).toHaveProperty("GET /api/articles")
           expect(body).toHaveProperty("GET /api/articles/article:id")
           expect(body).toHaveProperty("GET /api/users")
           expect(body).toHaveProperty("GET /api/articles/article:id/comments")
        })
      })
    })
  

describe("handle all bad URLs", () => {
  test("should handle all bad URLs", () => {
    return request(app)
      .get("/api/123143535")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
}) 
