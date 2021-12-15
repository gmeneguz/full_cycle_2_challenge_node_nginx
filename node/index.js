const express = require("express");
const mysql = require("mysql");
const { promisify } = require("util");
const faker = require("faker");

const app = express();

const db = mysql.createConnection({
  host: "db",
  user: "node",
  password: "node",
  database: "nodedb",
});
db.query = promisify(db.query);

function startExpressServer() {
  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
  app.get("/", async (_, res) => {
    const randomName = faker.name.findName();
    await db.query(`insert into people(name) VALUES('${randomName}')`);
    const users = await db.query("select * from people");

    res.send(
      `<h1>Full Cycle Rocks!</h1><ul>${users
        .map((u) => `<li>${u.name}</li>`)
        .join("")}</ul>`
    );
  });
}

function startServer() {
  db.connect(async (err) => {
    if (err) throw err;
    console.log("DB connected!");

    await db.query(
      "CREATE TABLE IF NOT EXISTS people(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);"
    );
    await startExpressServer();
  });
}

startServer();
