import React, { useState } from "react";

function JokeForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const submitJoke = async () => {
    const query = `
    mutation CreateJoke($title: String!, $text: String!) {
      createJoke(title: $title, text: $text) {
        joke {
          id
          title
          text
        }
      }
      }
    `;

    const response = await fetch("http://localhost:8000/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables: { title, text } }),
    });
    console.log(response);

    const data = await response.json();
    console.log("data returned:", data);
    setTitle("");
    setText("");
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Joke title"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Joke text"
      />
      <button onClick={submitJoke}>Submit Joke</button>
    </div>
  );
}

export default JokeForm;
