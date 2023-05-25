const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnect = require("./config/database");
const morgan = require("morgan");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const category = require("./routes/categoryRoute");

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 4001;

//Configuration Cloud Platform
cloudinary.config({
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

const origin = process.env.ORIGIN;
//Middlewares 
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "20mb" }));
app.use(morgan("common"));
app.use(
  cors({
    credentials: true,
    origin,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", category);
//
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
