const { ObjectId } = require("bson");
const db = require("../../config/mongodb");
const fs = require("fs");
const path = require("path");

const index = (req, res) => {
  db.collection("products")
    .find()
    .toArray()
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
};

const view = (req, res) => {
  const { id } = req.params;
  db.collection("products")
    .findOne({ _id: new ObjectId(id) })
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
};

const create = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    db.collection("products")
      .insertOne({
        name,
        price,
        stock,
        status,
        image_url: `http://localhost:4000/public/${image.originalname}`,
      })
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  }
};

const update = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;
  const { id } = req.params;

  const updateData = {
    name,
    price,
    stock,
    status,
  };

  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    updateData.image_url = `http://localhost:4000/public/${image.originalname}`;
  }

  db.collection("products")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateData,
      }
    )
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
};

const destroy = (req, res) => {
  const { id } = req.params;

  db.collection("products")
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
};

module.exports = { index, view, create, update, destroy };
