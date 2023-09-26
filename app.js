require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');

// Connect to MongoDB
require("./config/database").connect();
require("./utils/swagger/swagger")

const app = express();
const port = process.env.PORT || 3000;


const User = require('./models/User');
const Worker = require('./models/Worker');
const Schedule = require('./models/Schedule');

app.use(bodyParser.json());

//routes
const userRouter = require("./routes/users");
const workerRouter = require("./routes/worker");

app.use("/user", userRouter)
app.use("/worker", workerRouter)
app.use("/test", async (req, res) => { res.status(200).json({ message: 'Success', success: true, data: {} }) })


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
