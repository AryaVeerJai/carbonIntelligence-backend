const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:8000",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:5500",
    ],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
//Import all routes
const auth = require("./routes/auth");
const brands = require("./routes/brands");
const companies = require("./routes/companies");
const resources = require("./routes/resourcesRoutes");
const home = require("./routes/home");
const upload = require("./routes/uploadRoute");

const analyzeSentiment = require('./routes/sentimentAnalysis');
// Import the Bayes classifier function
const classifyText = require('./routes/bayesClassifier');

const path = require("path");

//Setting Up Config File
if (process.env.NODE_ENV !== "production")
  require("dotenv").config({ path: "backend/config/config.env" });

app.use("/api/v1", auth);
app.use("/api/v1", brands);
app.use("/api/v1", companies);
app.use("/api/v1", resources);
app.use("/api/v1", home);
app.use("/api/v1", upload);

// Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__basedir, '/uploads')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/v1/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/test-khado-backend', (req, res) => {
  res.send('Hello from backend!');
});

// Add a new route for sentiment analysis
app.post("/api/v1/analyze-sentiment", (req, res) => {
  const { text } = req.body;  // assuming text is sent in the body of the request
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: "Invalid input" });
  }

  const wordsArray = text.split(" ");  // Convert the text to an array of words
  const sentiment = analyzeSentiment(wordsArray);

  res.json({ sentiment });
});

// Add a new route for classifying text with BayesClassifier
app.post("/api/v1/classify-text", (req, res) => {
  const { text } = req.body;  // assuming text is sent in the body of the request
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: "Invalid input" });
  }

  const category = classifyText(text);  // Classify the text as 'spam' or 'regular'
  
  res.json({ category });
});

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );
  next();
});
__dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "user/out")));
  app.use(express.static(path.join(__dirname, "admin/build")));

  // // ...
  // // Right before your app.listen(), add this:
  // app.get("/admin", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "admin", "build", "index.html"));
  // });
  // // ...
  // // Right before your app.listen(), add this:
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "user", "out", "index.html"));
  // });

  
}
module.exports = app;
