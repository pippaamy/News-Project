const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

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
  test("doesnt add item in incorrect form",()=> {
    return request(app).patch("/api/articles/1") .send("hello"
) .expect(400).then(({body})=>{
  expect(body.msg).toBe("bad request")
  })
})
test("havent added item in incorrect form",()=> {
  return request(app).patch("/api/articles/1") .send({inc_votes:"hello"}
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





describe("handle all bad URLs", () => {
  test("should handle all bad URLs", () => {
    return request(app)
      .get("/api/123143535")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
