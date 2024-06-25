import React, { useState } from "react";
import JokeCard from "./JokeCard";

function JokeList() {
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
          <JokeCard key={joke.id} joke={joke} />
        ))}
      </ul>
    </div>
  );
}

export default JokeList;
