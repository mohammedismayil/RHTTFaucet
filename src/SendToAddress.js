import React from "react";

import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
export default function SendToAddress() {
  const [address, setAddress] = useState();
  const [transactionHash, setTXHash] = useState();
  // Similar to componentDidMount and componentDidUpdate:

  //   useEffect(() => {
  //     console.log("use effect has been called");
  //   });

  function handleSubmit(e) {
    e.preventDefault();

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

  // function sendErcToken() {

  // }
  return (
    <div className=" flex-col flex  m-auto items-center bg-slate-200 h-screen ">
      <div className="bg-white p-10 rounded font-bold m-10 items-center w-1/2 ">
        <Link to="/">
          <h2 className="font-bold text-3xl text-center">
            RHTT(ERC20) Testnet faucet
          </h2>
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center content-center pt-5 pb-5">
            <input
              className="shadow appearance-none border-2 w-1/2 border-indigo-500/100 rounded  py-2  my-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your address here"
              onChange={(e) => setAddress(e.target.value)}
            ></input>
          </div>
          <div className="flex justify-center content-center ">
            <button
              type="submit"
              className=" w-1/4 flex justify-center content-center py-2   border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send RHTT
            </button>
          </div>
        </form>
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
