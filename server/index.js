const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const qs = require("qs");


const plimit = require("p-limit");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

//Routes
const categoryRoutes = require("./routes/categories.js");
const productRoutes = require("./routes/products.js");
const imageUploadRoutes = require("./helper/imageUpload.js");

app.use("/uploads", express.static("uploads"));
app.use(`/api/category`, categoryRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/imageUpload`, imageUploadRoutes);

// APP INFO
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

app.post("/payment", async (req, res) => {
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: "user123",
    app_time: Date.now(),
    item: JSON.stringify([{}]),
    embed_data: JSON.stringify({}),
    amount: 10000, // Using the passed totalAmount
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "zalopayapp",
    callback_url: "https://6c2a-14-186-238-62.ngrok-free.app/callback",
  };

  // Generate MAC
  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log("Order URL:", result.data.order_url);

    // Trả `order_url` và `app_trans_id` về client
    res.status(200).json({
      success: true,
      order_url: result.data.order_url,
      app_trans_id: order.app_trans_id, // Thêm app_trans_id
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Error while creating payment.",
    });
  }
});

app.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});
app.post("/order-status/:app_trans_id", async (req, res) => {
  const app_trans_id = req.params.app_trans_id;

  if (!app_trans_id) {
    return res.status(400).json({
      success: false,
      message: "app_trans_id is missing.",
    });
  }

  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id,
  };

  const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/query",
      qs.stringify(postData),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    res.status(200).json(result.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to query order status.",
    });
  }
});

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection is ready...");
    //server
    app.listen(process.env.PORT, () => {
      console.log(`server is running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
