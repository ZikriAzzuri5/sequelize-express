require("./config/mongoose");
const express = require("express");
const path = require("path");
const app = express();
// const productRouter = require("./app/product/routes");
// const productRouterV2 = require("./app/product_v2/routes");
const productRouterV3 = require("./app/product_v3/routes");
const productRouterV4 = require("./app/product_v4/routes");
const logger = require("morgan");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
// app.use("/api/v1", productRouter);
// app.use("/api/v2", productRouterV2);
app.use("/api/v3", productRouterV3);
app.use("/api/v4", productRouterV4);
app.use((req, res, next) => {
  res.status(404);
  res.send({
    status: "failed",
    message: `Resource ${req.originalUrl} not found`,
  });
});
app.listen(4000, () => console.log("Server : http://localhost:4000"));
