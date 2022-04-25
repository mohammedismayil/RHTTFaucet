const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = 5000;
main().catch((err) => console.log(err));
const Web3 = require("web3");
const { contractABI } = require("./contract");
const cron = require("node-cron");

// let Mongodb_url = ;
async function main() {
  await mongoose.connect(
    "mongodb+srv://ismayil:ismayilmi@cluster0.maogj.mongodb.net/rhhtfaucet?retryWrites=true&w=majority"
  );
}
const kittySchema = new mongoose.Schema({
  address: String,
});
const Kitten = mongoose.model("addresses", kittySchema);

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env["Ropsten_url"])
);
const privateKey = process.env["Private_key"];

//Your Private key environment variable

let tokenAddress = "0x907cCf3732AcA4ED271A9b71F679901AbfB8c1C9"; // Demo Token contract address
let fromAddress = "0xd565a55b83fd384894f1165a69b649fd9372fc65"; // your wallet

let contract = new web3.eth.Contract(contractABI, tokenAddress, {
  from: fromAddress,
});

let amount = web3.utils.toHex(web3.utils.toWei("5")); //1 DEMO Token

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
app.post("/receivetoken", (req, res) => {
  let data = contract.methods.transfer(req.body.toAddress, amount).encodeABI();
  let txObj = {
    gas: web3.utils.toHex(100000),

    to: tokenAddress,

    value: "0x00",

    data: data,

    from: fromAddress,
  };

  searchAddress(req.body.toAddress, res, txObj);
});
// ADD THIS LINE
app.use(express.static("../build"));
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function searchAddress(address, res, txObj) {
  const kittens = await Kitten.find({
    address: address,
  });

  console.log("given address is " + address);
  console.log("txobj is " + txObj);
  if (kittens.length > 0) {
    console.log("i am here");

    res.json({
      message: "Address has been already present",
    });
  } else {
    web3.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
      if (err) {
        // return callback(err);
        console.log(err);
        res.json({
          message: "sign transaction not completed",
        });
      } else {
        console.log(signedTx);

        return web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          (err, respo) => {
            if (err) {
              console.log(err);
              // res.json({ message: err });
              res.json({
                message:
                  "looks like sometheing has happened.Mostly it should be the pending transaction",
              });
            } else {
              console.log(respo);
              const kittens = new Kitten({
                address: address,
              }).save();
              res.json({ transactionHash: respo });
            }
          }
        );
      }
    });
  }
}

// cron job to clear the stored address everyday
cron.schedule("0 0 0 * * *", async function () {
  console.log("running a task everyday at 12:00am");

  return deleteOldData();
});

const deleteOldData = async () => {
  await Kitten.deleteMany({});
};