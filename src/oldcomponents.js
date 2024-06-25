import React, { useState } from "react";

export function JokeForm() {
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

export function JokeList() {
  const [jokes, setJokes] = useState([]);

  const fetchJokes = async () => {
    const query = `
    query {
      allJokes {
        id
        title
        text
      }
    }
    `;

    try {
      const response = await fetch("http://localhost:8000/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const responseBody = await response.text();
        const message = `An error has occurred: ${response.status}, ${responseBody}`;
        throw new Error(message);
      }

      const data = await response.json();
      setJokes(data.data.allJokes);
      console.log(data.data.allJokes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={fetchJokes}>Fetch Jokes</button>
      <ul>
        {jokes.map((joke) => (
          <li key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
