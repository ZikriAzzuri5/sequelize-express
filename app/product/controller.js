const connection = require("../../config/mysql");
const fs = require("fs");
const path = require("path");

const index = (req, res) => {
  const { search } = req.query;
  let exec = {};

  if (search) {
    exec = {
      sql: "SELECT * FROM products WHERE name LIKE ?",
      values: [`%${search}%`],
    };
  } else {
    exec = {
      sql: "SELECT * FROM products",
    };
  }

  connection.query(exec, _response(res));
};

const view = (req, res) => {
  connection.query(
    {
      sql: "SELECT * FROM products where id = ?",
      values: [req.params.id],
    },
    _response(res)
  );
};

const store = (req, res) => {
  const { users_id, name, price, stock } = req.body;
  const image = req.file;
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    connection.query(
      {
        sql: "INSERT INTO products ( users_id, name, price, stock, url_image) VALUES (?,?,?,?,?)",
        values: [
          parseInt(users_id),
          name,
          price,
          stock,
          `http://localhost:4000/public/${image.originalname}`,
        ],
      },
      _response(res)
    );
  }
};

const update = (req, res) => {
  const { users_id, name, price, stock } = req.body;
  const image = req.file;
  let sql = "";
  let values = [];
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    sql =
      "UPDATE products  SET users_id = ?, name = ?, price = ?, stock = ?, url_image = ?  WHERE id = ?";
    values = [
      parseInt(users_id),
      name,
      price,
      stock,
      `http://localhost:4000/public/${image.originalname}`,
      req.params.id,
    ];
  } else {
    (sql =
      "UPDATE products  SET users_id = ?, name = ?, price = ?, stock = ? WHERE id = ?"),
      (values = [parseInt(users_id), name, price, stock, req.params.id]);
  }
  connection.query(
    {
      sql: "UPDATE products  SET users_id = ?, name = ?, price = ?, stock = ?, url_image = ? WHERE id = ?",
      values: [
        parseInt(users_id),
        name,
        price,
        stock,
        `http://localhost:4000/public/${image.originalname}`,
        req.params.id,
      ],
    },
    _response(res)
  );
};

const destroy = (req, res) => {
  connection.query(
    {
      sql: "DELETE FROM products where id = ?",
      values: [req.params.id],
    },
    _response(res)
  );
};

const _response = (res) => {
  return (error, result) => {
    if (error) {
      res.send({
        status: "failed",
        response: error,
      });
    } else {
      res.send({
        status: "success",
        response: result,
      });
    }
  };
};

module.exports = { index, view, store, update, destroy };
