const express = require("express");
const app = express();
const dotenv = require("dotenv");
const dbConnect = require("./config/database");
const morgan = require("morgan");
const cors = require("cors");
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const category = require("./routes/categoryRoute");

dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 4001;
const origin = "http://localhost:3000";
//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
