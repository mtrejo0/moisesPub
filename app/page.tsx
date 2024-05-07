"use client";

import axios from "axios";

export default function Home() {
  const send = async () => {
    axios
      .get("/api/post")
      .then((res) => {
        alert("Tweet sent!");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <button onClick={() => send()}>Press to post</button>
    </div>
  );
}
