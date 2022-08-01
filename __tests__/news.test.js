const app = require("../app/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")

beforeEach(() => seed(data));
afterAll(() => {
  if (db.end) db.end();
});
describe("GET array of topic objects", ()=> {
    test ("return property slug & description ", ()=> {
        return request(app).get("/api/topics").expect(200).then(({body})=>
        {expect(body.msg).toEqual(
        [
            {
              description: 'The man, the Mitch, the legend',
              slug: 'mitch'
            },
            {
              description: 'Not dogs',
              slug: 'cats'
            },
            {
              description: 'what books are made of',
              slug: 'paper'
            }
          ]
          )
  })
} ) 
});

describe("handle all bad URLs", () => {
  test("should handle all bad URLs", () => {
    return request(app)
      .get("/api/nottopics")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
