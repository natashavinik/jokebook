import React, { useState, useEffect } from "react";
import useInput from "../hooks/useInput";
import useArray from "../hooks/useArray";
import useFetch from "../hooks/useFetch";

function JokeForm() {
  const {
    value: title,
    handleChange: handleTitleChange,
    reset: resetTitle,
  } = useInput();
  const {
    value: text,
    handleChange: handleTextChange,
    reset: resetText,
  } = useInput();
  const selectedTopics = useArray([]);
  const {
    value: newTopic,
    handleChange: handleNewTopic,
    reset: resetNewTopic,
  } = useInput("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const fetchTopicsQuery = `
query {
  allTopics {
    id
    name
  }
}
`;
  const {
    data: topicsData,
    error: topicsError,
    loading: topicsLoading,
    refetch: refetchTopics,
  } = useFetch("http://localhost:8000/graphql/", fetchTopicsQuery);

  const submitJoke = async () => {
    const createJokeQuery = `
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

    const variables = {
      title,
      text,
      existingTopicIds: selectedTopics.array,
      newTopics: newTopic ? [newTopic] : [],
    };

    const response = await fetch("http://localhost:8000/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: createJokeQuery, variables }),
    });

    const jokeData = await response.json();

    console.log("data returned:", jokeData);
    if (jokeData.data && jokeData.data.createJoke) {
      // Refetch the allTopics query after a new joke is created
      await refetchTopics();
    }

    resetTitle();
    resetText();
    selectedTopics.clear([]);
    resetNewTopic();
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
              onChange={handleTitleChange}
              placeholder="Title"
            />
          </div>
          <div>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Joke Text"
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {topicsData?.allTopics.map((topic) => (
              <button
                key={topic.id}
                style={{
                  margin: "5px",
                  backgroundColor: selectedTopics.array.includes(topic.id)
                    ? "lightblue"
                    : "white",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedTopics.array.includes(topic.id)) {
                    selectedTopics.filter((topicId) => topicId !== topic.id);
                  } else {
                    selectedTopics.push(topic.id);
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
              onChange={handleNewTopic}
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
