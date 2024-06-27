import React, { useState, useEffect } from "react";
import JokeCard from "./JokeCard";

function JokeList() {
  const [jokes, setJokes] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  const fetchJokes = async () => {
    const query = `
      query {
        allJokes {
          id
          title
          text
          topics {
            id
            name
          }
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

  const fetchAllTopics = async () => {
    const query = `
      query {
        allTopics {
          id
          name
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
      setAllTopics(data.data.allTopics);
    } catch (error) {
      console.error(error);
    }
  };
  const handleNewTopic = (newTopic) => {
    setAllTopics((prevTopics) => {
      // Check if the new topic already exists in the array
      const existingTopic = prevTopics.find(
        (topic) => topic.name === newTopic.name
      );

      if (existingTopic) {
        // If the new topic already exists, return the previous array
        return prevTopics;
      } else {
        // If the new topic doesn't exist, add it to the array
        return [...prevTopics, newTopic];
      }
    });
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  return (
    <div>
      <button onClick={fetchJokes}>Fetch Jokes</button>
      <ul>
        {jokes.map((joke) => (
          <JokeCard
            key={joke.id}
            joke={joke}
            topics={joke.topics}
            allTopics={allTopics}
            onNewTopic={handleNewTopic}
          />
        ))}
      </ul>
    </div>
  );
}

export default JokeList;
