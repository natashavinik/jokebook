import React, { useState, useEffect } from "react";

function JokeForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      const query = `
      query {
        allTopics {
          id
          name
        }
      }
      `;

      const response = await fetch("http://localhost:8000/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            title,
            text,
            existingTopicIds: selectedTopics,
            newTopics: newTopic ? [newTopic] : [], // Only add newTopic to newTopics array if it's not an empty string
          },
        }),
      });

      const data = await response.json();
      if (data.data && data.data.allTopics) {
        setTopics(data.data.allTopics);
      } else {
        console.error("Unexpected response", data);
      }
    };
    fetchTopics();
  }, []);

  const submitJoke = async () => {
    const query = `
        mutation CreateJoke($title: String!, $text: String!, $existingTopicIds: [ID!], $newTopics: [String!]) {
          createJoke(title: $title, text: $text, existingTopicIds: $existingTopicIds, newTopics: $newTopics) {
            joke {
              id
              title
              text
              topics {
                id
                name
              }
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
      body: JSON.stringify({
        query,
        variables: {
          title,
          text,
          existingTopicIds: selectedTopics,
          newTopics: newTopic ? [newTopic] : [],
        },
      }),
    });
    console.log(response);

    const data = await response.json();
    console.log("data returned:", data);
    if (data.data && data.data.createJoke && newTopic) {
      const newTopicInResponse = data.data.createJoke.joke.topics.find(
        (topic) => topic.name === newTopic
      );

      if (newTopicInResponse) {
        setTopics((prevTopics) => {
          // Check if the new topic exists in the prevTopics array
          if (!prevTopics.find((topic) => topic.id === newTopicInResponse.id)) {
            // If it doesn't exist, add it to the array
            return [...prevTopics, newTopicInResponse];
          } else {
            // If it exists, return the prevTopics array as is
            return prevTopics;
          }
        });
      }
    }
    setTitle("");
    setText("");
    setSelectedTopics([]);
    setNewTopic("");
  };

  return (
    <div>
      <button
        onClick={() =>
          setIsFormVisible((prevIsFormVisible) => !prevIsFormVisible)
        }
      >
        New Joke
      </button>
      {isFormVisible && (
        <>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Joke title"
            />
          </div>
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Joke text"
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {topics.map((topic) => (
              <button
                key={topic.id}
                style={{
                  margin: "5px",
                  backgroundColor: selectedTopics.includes(topic.id)
                    ? "lightblue"
                    : "white",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedTopics.includes(topic.id)) {
                    setSelectedTopics((prevTopics) =>
                      prevTopics.filter((topicId) => topicId !== topic.id)
                    );
                  } else {
                    setSelectedTopics((prevTopics) => [
                      ...prevTopics,
                      topic.id,
                    ]);
                  }
                }}
              >
                {topic.name}
              </button>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="New topic"
            />
          </div>
          <div>
            <button onClick={submitJoke}>Submit Joke</button>
          </div>
        </>
      )}
    </div>
  );
}

export default JokeForm;
