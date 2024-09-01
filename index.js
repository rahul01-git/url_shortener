const express = require("express");
const { Client } = require("pg");
const dotenv = require("dotenv");
const shortid = require("shortid");

const {
  createTableQuery,
  insertQuery,
  fetchAllQuery,
  fetchSingleQuery,
  updateQuery,
} = require("./helpers");

const port = 3000;
const app = express();
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

(async function(maxAttempts = 5, delay = 5000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.connect();
      console.log("Postgres DB connected !!");
      await client.query(createTableQuery);
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  console.error("Max attempts reached. Could not connect to the database.");
  process.exit(1);
})()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (_req, res) => {
  const { rows } = await client.query(fetchAllQuery);
  res.render("index", { urls: rows });
});

app.get("/:shorturl", async (req, res) => {
  try {
    const { shorturl } = req.params;

    const { rows } = await client.query(fetchSingleQuery([shorturl]));
    if (!rows.length) return res.status(404).send("URL not found");
    const data = rows[0];
    await client.query(updateQuery(data.id, [(data.clicks += 1)]));

    res.redirect(data.original_url);
  } catch (error) {
    console.log(error);
  }
});

app.post("/shorten", async (req, res) => {
  const { url } = req.body;
  const short_url = shortid.generate();
  const query = insertQuery([url, short_url]);
  await client.query(query);
  res.redirect("/");
});

app.listen(port, async () => console.log(`Server running at port: ${port}`));
