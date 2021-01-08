"use strict";

module.exports = function (app) {
  var mongoose = require("mongoose");
  var User = mongoose.model("User");
  const crypto = require("crypto");
  const { check, validationResult } = require("express-validator");
  const bjs = require("bitcoinjs-lib");
  const bip32 = require("bip32");
  var nodemailer = require("nodemailer");
  var QRCode = require("qrcode");
  var event = require("./Events.js");
  var subscriptionBTC = 0.001;
  const Binance = require("binance-api-node").default;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
  };

  const generateAuthToken = () => {
    return crypto.randomBytes(30).toString("hex");
  };

  app.post("/register", [check("email").isEmail()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var token = Math.random().toString(36).substr(2);
    var url =
      process.env.REACT_APP_URL +
      "/confirm?email=" +
      req.body.email +
      "&token=" +
      token;
    var Subject = "Registration";
    Customer.updateOne(
      { email: req.body.email },
      {
        token: token,
      },
      { upsert: true }
    )
      .then(async (result) => {
        Customer.find({ email: req.body.email })
          .then((result) => {
            var confirmed = false;
            if (result[0].name.length > 0) confirmed = true;
            if (!!result.upserted || !confirmed)
              res
                .status(200)
                .json({ msg: "Check your email to confirm your account" });
            else {
              Subject = "Telegram Name Change";
              res.status(200).json({
                msg:
                  "Check your email if you would like to change your Telegram name",
              });
            }
          })
          .catch((er) => {
            console.log(er);
          })
          .finally(() => {
            var mailOptions = {
              from: process.env.EMAIL,
              to: req.body.email,
              subject: "AlgoSats " + Subject,
              text: url,
            };

            transporter
              .sendMail(mailOptions)
              .then((info) => console.log(info.response))
              .catch((err) => console.log(err));
          });
      })
      .catch((er) => {
        console.log(er);
      });
  });

  app.get(
    "/confirm",
    [check("email").isEmail(), check("token").not().isEmpty().trim().escape()],
    (req, res) => {
      const errors = validationResult(req);
      var addressIndex;
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      res.render("confirm", { title: "Confirm Registration" });
    }
  );
  app.post(
    "/confirm",
    [
      check("email").isEmail(),
      check("token").not().isEmpty().trim().escape(),
      check("name").not().isEmpty().trim().escape(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      Customer.updateOne(
        { email: req.body.email, token: req.body.token },
        {
          token: Math.random().toString(36).substr(2),
          $push: { name: req.body.name },
        }
      ).then((result) => {
        if (result.n == 0) res.status(422).json({ msg: "Form expired" });
        else if (result.n == 1)
          res.status(200).json({
            msg: "Your Telegram name has been set to " + req.body.name,
          });
      });
    }
  );

  app.post("/pay", [check("email").isEmail()], (req, res) => {
    var addressIndex;
    var BTCaddress;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Customer.find({ email: req.body.email }).then(async (result) => {
      if (result.length == 1 && result[0].name.length > 0) {
        if (
          result[0].transactions.length > 0 &&
          result[0].transactions[result[0].transactions.length - 1].received <
            subscriptionBTC
        ) {
          BTCaddress =
            result[0].transactions[result[0].transactions.length - 1].address;
          let img = await QRCode.toFile(
            "../algosats/public/images/" + BTCaddress + ".png",
            BTCaddress
          );

          var mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "AlgoSats Order",
            html:
              "Bitcoin Address: " + BTCaddress + '</br> <img src="cid:image1">',
            attachments: [
              {
                filename: BTCaddress + ".png",
                path: "../algosats/public/images/" + BTCaddress + ".png",
                cid: "image1",
              },
            ],
          };

          res
            .status(200)
            .json({ msg: "Check your email for payment instructions" });

          transporter
            .sendMail(mailOptions)
            .then((info) => console.log(info.response))
            .catch((err) => console.log(err));
        } else {
          Customer.aggregate([
            {
              $project: {
                transactions: 1,
              },
            },
            { $unwind: "$transactions" },
            {
              $group: {
                _id: "transactions",
                totalTransactions: { $sum: 1 },
              },
            },
          ]).then(async (count) => {
            if (count[0] == undefined) addressIndex = 0;
            else addressIndex = count[0].totalTransactions;

            var address = bjs.payments.p2sh({
              redeem: bjs.payments.p2wpkh({
                pubkey: bip32
                  .fromBase58(process.env.XPUB)
                  .derive(0)
                  .derive(addressIndex).publicKey,
              }),
            });

            Customer.updateOne(
              { email: req.body.email },
              {
                $push: {
                  transactions: {
                    index: addressIndex,
                    address: address.address,
                  },
                },
              }
            ).then(async (data) => {
              BTCaddress = address.address;
              event.emit("new", BTCaddress);
              let img = await QRCode.toFile(
                "../algosats/public/images/" + BTCaddress + ".png",
                BTCaddress
              );

              if (result[0].transactions.length > 0)
                event.emit(
                  "old",
                  result[0].transactions[result[0].transactions.length - 1]
                    .address
                );
              if (data.n == 0) res.status(422).json({ msg: "Error occured" });
              else if (data.n == 1)
                res
                  .status(200)
                  .json({ msg: "Check your email for payment instructions" });

              var mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: "AlgoSats Order",
                html:
                  "Bitcoin Address: " +
                  BTCaddress +
                  '</br> <img src="cid:image1">',
                attachments: [
                  {
                    filename: BTCaddress + ".png",
                    path: "../algosats/public/images/" + BTCaddress + ".png",
                    cid: "image1",
                  },
                ],
              };

              transporter
                .sendMail(mailOptions)
                .then((info) => console.log(info.response))
                .catch((err) => console.log(err));
            });
          });
        }
      } else {
        if (result.length == 1 && result[0].name.length == 0)
          res.status(422).json({
            errors: "Please check your email to confirm your account!",
          });
        else
          res.status(422).json({
            errors: "Please join first!",
          });
      }
    });
  });

  app.post(
    "/signup",
    [
      check("user.email").isEmail(),
      check("user.password").not().isEmpty().trim().escape(),
    ],
    (req, res) => {
      const { email, password, password_confirmation } = req.body.user;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else if (password === password_confirmation) {
        User.find({ email: email }).then((response) => {
          const authToken = generateAuthToken();
          const hash = getHashedPassword(password);

          if (response.length == 0) {
            var user = new User({
              email: email,
              hash: hash,
              token: authToken,
            });
            user.save();
            res.cookie("AuthToken", authToken);
            res.status(200).json({
              user: email,
              status: "created",
            });
          } else {
            res.status(200).json({
              error: {
                email_error: "Email is already in use!",
              },
            });
          }
        });
      } else {
        res.status(200).json({
          error: {
            password_error:
              "Passwords do not match! Please only use letters, numbers and ~!@#$.?:",
          },
        });
      }
    }
  );

  app.post(
    "/login",
    [
      check("user.email").isEmail(),
      check("user.password").not().isEmpty().trim().escape(),
    ],
    (req, res) => {
      const { email, password } = req.body.user;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const hash = getHashedPassword(password);
      const authToken = generateAuthToken();

      User.updateOne(
        { email: email, hash: hash },
        {
          token: authToken,
        },
        { upsert: false }
      ).then((result) => {
        if (result.n == 1) {
          // Setting the auth token in cookies
          res.cookie("AuthToken", authToken);

          res.status(200).json({
            user: email,
            status: "created",
          });
        } else {
          res.status(200).json({
            error: {
              password_error: "Wrong email or password",
            },
          });
        }
      });
    }
  );

  app.get("/logged_in", (req, res) => {
    User.find({ token: req.cookies["AuthToken"] }).then((response) => {
      if (response.length == 1) {
        res.status(200).json({
          user: response[0].email,
          logged_in: true,
        });
      }
    });
  });
  app.post(
    "/connect",
    [
      check("api.exchange").not().isEmpty().trim().escape(),
      check("api.key").not().isEmpty().trim().escape(),
      check("api.secret").not().isEmpty().trim().escape(),
    ],
    (req, res) => {
      const { exchange, key, secret } = req.body.api;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const api = Binance({
        apiKey: key,
        apiSecret: secret,
      });

      api
        .accountInfo()
        .then((result) => {
          var field = "keys." + exchange;
          User.updateOne(
            { token: req.cookies["AuthToken"] },
            {
              $set: {
                [field]: { key: key, secret: secret, status: "Connected" },
              },
            },
            { upsert: false }
          ).then((result) => {
            if (result.n == 1) {
              res.status(200).json({
                msg: exchange + " has been added.",
              });
            }
          });
        })
        .catch((err) => {
          res.status(422).json({ message: "invalid" });
        });
    }
  );
  app.post("/connections", (req, res) => {
    User.find({ token: req.cookies["AuthToken"] }, { keys: 1 }).then(
      (result) => {
        if (result.length == 1) {
          var exchanges = [];
          result[0].keys.forEach((array, key) => {
            exchanges.push({ exchange: key, status: array.status });
          });
          res.status(200).json({
            exchanges: exchanges,
          });
        }
      }
    );
  });
  app.post(
    "/connection",
    [
      check("api.exchange").not().isEmpty().trim().escape(),
      check("api.action").not().isEmpty().trim().escape(),
    ],
    (req, res) => {
      const { exchange, action } = req.body.api;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      var field = "keys." + exchange + ".status";
      var fieldObj = "keys." + exchange;
      if (action == "delete") {
        User.updateOne(
          { token: req.cookies["AuthToken"] },
          {
            $unset: { [fieldObj]: "" },
          },
          { upsert: false }
        ).then((result) => {
          if (result.n == 1) {
            if (action == false)
              res.status(200).json({
                msg: exchange + " has been disconnected.",
              });
            else
              res.status(200).json({
                msg: exchange + " has been connected.",
              });
          }
        });
      } else {
        User.updateOne(
          { token: req.cookies["AuthToken"] },
          {
            $set: { [field]: action },
          },
          { upsert: false }
        ).then((result) => {
          if (result.n == 1) {
            if (action == false)
              res.status(200).json({
                msg: exchange + " has been disconnected.",
              });
            else
              res.status(200).json({
                msg: exchange + " has been connected.",
              });
          }
        });
      }
    }
  );
};
