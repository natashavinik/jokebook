import React, { useState, useEffect, useCallback } from "react";

const JokeCard = ({ joke: initialJoke, allTopics, onNewTopic }) => {
  const [joke, setJoke] = useState(initialJoke);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState(initialJoke.topics);
  const [newTopic, setNewTopic] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [length, setLength] = useState(initialJoke.length || 0);

  const minutes = Math.floor(length / 60);
  const seconds = length % 60;

  useEffect(() => {
    setLength(joke.length || 0);
  }, [joke.length]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(async () => {
    const url = "http://localhost:8000/graphql/"; // Your GraphQL endpoint
    const mutation = `
      mutation UpdateJoke($id: ID!, $text: String!, $length: Int, $newTopics: [String!], $existingTopicIds: [ID!], $topicsToAdd: [ID!], $topicsToRemove: [ID!]) {
        updateJoke(id: $id, text: $text, length: $length, newTopics: $newTopics, existingTopicIds: $existingTopicIds, topicsToAdd: $topicsToAdd, topicsToRemove: $topicsToRemove) {
          joke {
            id
            text
            length
            title
            topics {
              id
              name
            }
          }
        }
      }
    `;

    const newTopics = [
      ...selectedTopics
        .filter((topic) => !allTopics.includes(topic))
        .map((topic) => topic.name),
      newTopic,
    ].filter(Boolean);
    const existingTopicIds = selectedTopics
      .filter((topic) => allTopics.includes(topic))
      .map((topic) => topic.id);
    const topicsToAdd = selectedTopics
      .filter((topic) => !joke.topics.includes(topic))
      .map((topic) => topic.id);
    const topicsToRemove = joke.topics
      .filter((topic) => !selectedTopics.includes(topic))
      .map((topic) => topic.id);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          id: joke.id,
          text: joke.text,
          length: Math.round(Number(minutes) * 60 + Number(seconds)),
          newTopics: newTopics,
          existingTopicIds: existingTopicIds,
          topicsToAdd: topicsToAdd,
          topicsToRemove: topicsToRemove,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data.updateJoke && data.data.updateJoke.joke) {
        setJoke(data.data.updateJoke.joke);
        setIsEditing(false);
        setNewTopic("");
        if (newTopic) {
          // Pass the entire new topic object to the onNewTopic function
          onNewTopic(
            data.data.updateJoke.joke.topics.find(
              (topic) => topic.name === newTopic
            )
          );
        }
      } else {
        console.error("Error: response does not include joke:", data);
      }
    } else {
      console.error("Error updating joke:", await response.text());
    }
  }, [joke, minutes, seconds, selectedTopics, newTopic]);

  const handleTextChange = useCallback(
    (e) => {
      setJoke({ ...joke, text: e.target.value });
    },
    [joke]
  );

  const handleNewTopicChange = useCallback((e) => {
    setNewTopic(e.target.value);
  }, []);

  const handleTopicClick = useCallback((topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.some((t) => t.id === topic.id)
        ? prevTopics.filter((t) => t.id !== topic.id)
        : [...prevTopics, topic]
    );
  }, []);

  const handleLengthChange = useCallback(
    (e, type) => {
      const value = Number(e.target.value);
      if (type === "minutes") {
        setLength(value * 60 + seconds);
      } else {
        setLength(minutes * 60 + value);
      }
    },
    [minutes, seconds]
  );
  const handleCardClick = (e) => {
    // Prevent the event from bubbling up to the parent elements
    e.stopPropagation();

    // Toggle the isExpanded state
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  return (
    <div onClick={handleCardClick}>
      <h2>{joke.title}</h2>
      {isExpanded && (
        <>
          {isEditing ? (
            <>
              <textarea
                value={joke.text}
                onChange={handleTextChange}
                onClick={(e) => e.stopPropagation()}
              />
              <div>
                {allTopics.map((topic) => (
                  <button
                    key={topic.id}
                    style={{
                      backgroundColor: selectedTopics.some(
                        (t) => t.id === topic.id
                      )
                        ? "lightblue"
                        : "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicClick(topic);
                    }}
                  >
                    {topic.name}
                  </button>
                ))}{" "}
              </div>
              <div>
                <input
                  type="text"
                  value={newTopic}
                  onChange={handleNewTopicChange}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="New topic"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleLengthChange(e, "minutes");
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Minutes"
                />
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleLengthChange(e, "seconds");
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Seconds"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p>{joke.text}</p>
              <div>
                {joke.topics.map((topic) => (
                  <span key={topic.id}>{topic.name}</span>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
              >
                Edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default JokeCard;
