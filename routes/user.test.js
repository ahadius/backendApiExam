const request = require("supertest");
const express = require("express");
const router = require("./user.js");
const Activity = require('../model/Activity.js'); 
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyauth.js")
const app = express();

app.use(express.json());
app.use("/", router);

describe("route that should logg inn the users", () => {
  it("if the credentials are correct it should logg inn the user", async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      email: "admin1",
      password: "admin123",
      _id: "64d499c49bf51dfa2226c944",
      role: "admin",
    });

    jwt.sign = jest.fn().mockReturnValueOnce("mock-token");

    const response = await request(app)
      .post("/login")
      .send({ email: "admin1", password: "admin123" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBe("mock-token");
    expect(response.body.userdata.email).toBe("admin1");
    expect(response.body.userdata.role).toBe("admin");
  });

  it("should give error code if user not found", async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "johnatan", password: "deffenetlynotcorrect" });
    expect(response.status).toBe(405);
  });

  it("should give error code if a wrong password for a user is provided", async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      email: "admin1",
      password: "admin123",
    });

    const response = await request(app)
      .post("/login")
      .send({ email: "admin1", password: "admin122" });

    expect(response.status).toBe(405);
  });
  //below are the tests for activitys for the users
  const mockToken = jwt.sign({ id: 'mockUserId' }, 'ahadjwtsecret');

  it("should successfully book available hours for a user", async () => {
    const saveMock = jest.fn();
    Activity.prototype.save = saveMock;

    const response = await request(app)
      .post("/bookhours")
      .set('Authentication', `Bearer ${mockToken}`)
      .send({ id: '64d564ad28e0a9afb3875be3', hours: 2 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.bookedHours).toHaveLength(2);
    expect(saveMock).toHaveBeenCalled();
  });
  
});
