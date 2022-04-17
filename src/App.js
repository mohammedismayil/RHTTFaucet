import React from "react";
import { useState } from "react";

import "./App.css";
function App() {
  const [address, setAddress] = useState();
  const [transactionHash, setTXHash] = useState();
  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");
    console.log(address);

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
    <div className=" flex-col flex  m-auto items-center bg-slate-200 h-screen">
      <div className="bg-white p-10 rounded font-bold m-10 items-center ">
        <h2 className="font-bold text-3xl text-center">
          RHTT(ERC20) Testnet faucet
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            className="shadow appearance-none border-2 border-indigo-500/100 rounded w-full py-2  my-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Enter your address here"
            onChange={(e) => setAddress(e.target.value)}
          ></input>
          <button
            type="submit"
            className=" w-full flex justify-center py-2   border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send RHTT
          </button>
        </form>
        {transactionHash ? (
          <h3 className="pt-5">Transaction Hash: {transactionHash}</h3>
        ) : null}
      </div>
    </div>
  );
}

export default App;
