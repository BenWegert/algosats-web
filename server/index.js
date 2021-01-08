require("dotenv").config();

var express = require("express"),
  app = express(),
  port = process.env.BPORT || 80,
  db = require("mongoose"),
  influencer = require("./api/models/Influencer"),
  kline = require("./api/models/Kline"),
  trade = require("./api/models/Trade"),
  user = require("./api/models/User"),
  device = require("./api/models/device"),
  http = require("http"),
  bodyParser = require("body-parser"),
  Pages = require("./api/routes/Page"),
  Influencer = require("./api/routes/Influencer"),
  Kline = require("./api/routes/Kline"),
  Trade = require("./api/routes/Trade"),
  cookieParser = require("cookie-parser"),
  crypto = require("crypto");

const WebSocket = require("ws");

const Binance = require("binance-api-node").default;

db.Promise = global.Promise;
db.set("useCreateIndex", true);
db.connect("mongodb://localhost/algosats", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static("build"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

Pages(app);
Influencer(app);
Kline(app);
Trade(app);

Trade = db.model("Trade");
Influencer = db.model("Influencer");
Kline = db.model("Kline");

http.createServer(app).listen(port, () => {
  console.log(port);
});

//***************************************************************************
//***************************************************************************

const api = Binance();

server = http.createServer().listen(process.env.WSPORT, () => {
  console.log(port);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws, req) {
  ws.on("message", function incoming(data) {
    data = JSON.parse(data);

    var { exchange, type, from, symbol, interval, start, end } = data;

    switch (type) {
      case "get":
        console.log("get");
        break;
      default:
        console.log("default");
    }

    api
      .candles({ symbol: symbol, interval: interval, limit: 1000 }) //, startTime: start, endTime: end })
      .then((result) => {
        ws.send(JSON.stringify(result));
      })
      .catch((err) => console.log(err));
  });
});
