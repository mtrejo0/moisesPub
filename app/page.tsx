"use client"

import axios from "axios";

export default function Home() {

  const send = async () => {


    axios.get("/api/test")
    .then(() => {
      console.log("sent")
    })
    .catch((err) => {
      console.log(err)
    })
  }
  return (
    <div>
      
      <button onClick={() => send()}>Press</button>
    </div>
  );
}
