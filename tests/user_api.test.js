const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
jest.setTimeout(10000);
const api = supertest(app);

const User = require("../models/user");
const helper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUser);
});

describe("when there is initially some users saved", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get("/api/users");

    expect(response.body).toHaveLength(helper.initialUser.length);
  });

  test("a specific user is within the returned users", async () => {
    const response = await api.get("/api/users");
    const names = response.body.map((r) => r.name);

    expect(names).toContain("Aegon Talgalen");
  });
});

describe("viewing a specific user", () => {
  test("succeeds with a valid id", async () => {
    const usersAtStart = await helper.usersInDb();

    const userToView = usersAtStart[0];

    const resultUser = await api
      .get(`/api/users/${userToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedUserToView = JSON.parse(JSON.stringify(userToView));
    expect(resultUser.body).toEqual(processedUserToView);
  });

  test("fails with statuscode 404 if user does not exist", async () => {
    const validNonexistingID = await helper.nonExistingId();

    console.log(validNonexistingID);

    await api.get(`/api/users/${validNonexistingID}`).expect(404);
  });

  test("fails with statuscode 400 if id is invalid", async () => {
    const invalidId = "671111aaaa";

    await api.get(`/api/users/${invalidId}`).expect(400);
  });
});

describe("addition of a new note", () => {
  test("succeeds with valid data", async () => {
    const newUser = {
      name: "Harry Potter",
      dob: new Date(1983, 6, 23),
      address: "Hogwarts School of Witchcraft and Wizardry",
      description: "I think you know who I am",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUser.length + 1);

    const names = usersAtEnd.map((u) => u.name);
    expect(names).toContain("Harry Potter");
  });

  test("fails with status code 400 if data is invalid", async () => {
    const newUser = {
      address: "knowhere",
      description: "hmmmm..., I don't like it",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(helper.initialUser.length);
  });
});

describe("deletion of a user", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const usersAtStart = await helper.usersInDb();
    const userToDelete = usersAtStart[0];

    await api.delete(`/api/users/${userToDelete.id}`).expect(204);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(helper.initialUser.length - 1);

    const names = usersAtEnd.map((u) => u.name);

    expect(names).not.toContain(userToDelete.name);
  });

  test("fail to delete with statuscode 404 if user does not exist", async () => {
    const validNonexistingID = await helper.nonExistingId();

    console.log(validNonexistingID);

    await api.delete(`/api/users/${validNonexistingID}`).expect(404);
  });
});

describe("modify or update a user", () => {
  test("succeeds updating a particular user", async () => {
    const usersAtStart = await helper.usersInDb();
    const userToUpdate = usersAtStart[0];

    const newDataForUser = {
      name: "Aegon The Conqueror",
      description: "This is the real deal",
    };

    await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(newDataForUser)
      .expect(200);

    const usersAtEnd = await helper.usersInDb();
    const names = usersAtEnd.map((u) => u.name);
    expect(names).toContain("Aegon The Conqueror");
  });

  test("Fails to update if data is invalid", async () => {
    const usersAtStart = await helper.usersInDb();
    const userToUpdate = usersAtStart[0];

    const newDataForUser = {};

    await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(newDataForUser)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
