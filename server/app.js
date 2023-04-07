const express = require("express");
const app = express();
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("1f07289d472949b4a478c20dd282293e");
const axios = require("axios");

const cors = require("cors");
app.use(cors());
app.use(express.json());

// Enable CORS for all routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.get("/", (req, res) => {
  res.redirect("/verify");
});

app.post("/verify", async (req, res) => {
  //   To query top headlines
  //   All options passed to topHeadlines are optional, but you need to include at least one of them
  //   newsapi.v2
  //     .topHeadlines({
  //       q: `${req.body.data}`,
  //       category: "politics",
  //       language: "en",
  //       country: "us",
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       console.log(req.body.data);
  //       /*
  //           {
  //             status: "ok",
  //             articles: [...]
  //           }
  //           */
  //       res.send(JSON.stringify(response));
  //     });

  if (!req.body.source) {
    await newsapi.v2
      .everything({
        q: req.body.data,
        // sources: "google-news-in,bbc-news",

        sortBy: "relevancy",
      })
      .then((response) => {
        console.log(response);
        /*
            {
              status: "ok",
              articles: [...]
            }
          */
        res.status(200).send(JSON.stringify(response));
      });
  } else {
    let s = req.body.sources;
    console.log("Sources:" + s);
    await newsapi.v2
      .everything({
        q: req.body.data,
        sources: s,

        sortBy: "relevancy",
      })
      .then((response) => {
        console.log(response);
        /*
            {
              status: "ok",
              articles: [...]
            }
          */
        res.status(200).send(JSON.stringify(response));
      });
  }

  //   To query sources
  //   All options are optional
  //   newsapi.v2
  //     .sources({
  //       category: "business",
  //       language: "en",
  //       country: "in",
  //       page: 1,
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       /*
  //       {
  //         status: "ok",
  //         sources: [...]
  //       }
  //     */
  //       res.send(JSON.stringify(response));
  //     });
});

app.post("/headlines", async (req, res) => {
  //   To query top headlines
  //   All options passed to topHeadlines are optional, but you need to include at least one of them
  await newsapi.v2
    .topHeadlines({
      q: `${req.body.data}`,

      language: "en",
      country: "in",
    })
    .then((response) => {
      console.log(response);
      console.log(req.body.data);
      /*
            {
              status: "ok",
              articles: [...]
            }
            */
      res.status(200).send(JSON.stringify(response));
    });
});

app.post("/gnews", async (req, res) => {
  const q = req.body.data;
  await axios
    .get(
      `https://gnews.io/api/v4/search?q=${q}&lang=en&country=in&max=10&apikey=8ae272b8b99507b8fe28f5cd8583f192`
    )
    .then((response) => {
      console.log(response.data.articles);

      res.status(200).send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Start the server on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
