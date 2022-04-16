import React from "react";
import { useState } from "react";

function App() {
  const [address, setAddress] = useState();
  const [transactionHash, setTXHash] = useState();
  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");
    console.log(address);

    fetch("http://localhost:5000/receivetoken", {
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
        setTXHash(data.message.transactionHash);
      })

      .catch((err) => {
        console.log("fetch error" + err);
      });
    // sendErcToken();
  }

  // function sendErcToken() {

  // }
  return (
    <div className="App">
      <h2>Testnet faucet</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter your address here"
          onChange={(e) => setAddress(e.target.value)}
        ></input>
        <input type="submit" value="Submit" />
      </form>

      <h3>{transactionHash}</h3>
    </div>
  );
}

export default App;
