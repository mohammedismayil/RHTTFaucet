import React from "react";
import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./App.css";
export default function Home() {
  const [address, setAddress] = useState();
  const [isMetaMaskEnabled, setMetaMask] = useState(false);
  const [transactionHash, setTXHash] = useState();
  // Similar to componentDidMount and componentDidUpdate:

  useEffect(() => {
    console.log("use effect has been called");
    connectToMetamask();
  });

  function connectToMetamask() {
    if (window.ethereum) {
      // Do something
      console.log("Ethereum enabled");
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        // Return the address of the wallet
        console.log(res[0]);

        setMetaMask(true);
        setAddress(res[0]);
      });
    } else {
      alert("install metamask extension!!");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");
    console.log(address);
  }

  function sendErcToken() {
    fetch("/receivetoken", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded", // <-- Specifying the Content-Type
      }),
      body: "toAddress=" + address, // <-- Post parameters
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        return responseData;
      })
      .then((data) => {
        setTXHash(data.transactionHash);
      })

      .catch((err) => {
        console.log("fetch error" + err);
      });
    // sendErcToken();
  }
  return (
    <div className=" flex-col flex  m-auto items-center bg-slate-200 h-screen ">
      <div className="bg-white p-10 rounded font-bold m-10 items-center w-1/2 ">
        <h2 className="font-bold text-3xl text-center">
          RHTT(ERC20) Testnet faucet
        </h2>

        {isMetaMaskEnabled ? (
          <div className="flex justify-center content-center p-10">
            <h2>Wallet connected:{address}</h2>
          </div>
        ) : (
          <div className="flex justify-center content-center p-10">
            Wallet Not connected
          </div>
        )}
        <div className="flex justify-center content-center ">
          <button
            type="submit"
            onClick={isMetaMaskEnabled ? sendErcToken : connectToMetamask}
            className=" w-1/4 flex justify-center content-center py-2   border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isMetaMaskEnabled ? "Send RHTT" : "Connect Wallet"}
          </button>
        </div>
        {transactionHash ? (
          <div className="flex justify-center content-center ">
            <h3 className="pt-10  mx-5 justify-center content-center text-center">
              Transaction Hash: {transactionHash}
            </h3>
          </div>
        ) : null}
      </div>
    </div>
  );
}
