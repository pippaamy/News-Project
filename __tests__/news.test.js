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

describe("handle all bad URLs", () => {
  test("should handle all bad URLs", () => {
    return request(app)
      .get("/api/nottopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
