const app = require("../src/index");

describe("App", () => {
  let data = {
    text: "1",
    userID: "dummy",
    parameters: []
  };
  it("POST /api/df_text_query", () => {
    return supertest(app)
      .post("/api/df_text_query")
      .send(data)
      .expect(200);
  });
  let dataEvent = {
    event: "1",
    userID: "dummy",
    parameters: []
  };
  it("POST /api/df_event_query", () => {
    return supertest(app)
      .post("/api/df_event_query")
      .send(dataEvent)
      .expect(200);
  });
});
