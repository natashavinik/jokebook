import React, { useState } from "react";

const JokeCard = ({ joke: initialJoke }) => {
  const [joke, setJoke] = useState(initialJoke);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const url = "http://localhost:8000/graphql/"; // Your GraphQL endpoint
    const mutation = `
      mutation UpdateJoke($id: ID!, $text: String!) {
        updateJoke(id: $id, text: $text) {
          joke {
            id
          text
          title
          }
        }
      }
    `;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            id: joke.id,
            text: joke.text, // newText is the state variable where you're storing the updated joke text
          },
        }),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        console.error("Response body:", responseBody);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If the response was successful, update the joke text in the component state
      const data = await response.json();
      setJoke(data.data.updateJoke.joke);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating joke:", error.message);
      console.error("Stack trace:", error.stack);
    }
  };

  return (
    <div>
      <p>Title: {joke.title}</p>
      {isEditing ? (
        <textarea
          value={joke.text}
          onChange={(e) => setJoke({ ...joke, text: e.target.value })}
        />
      ) : (
        <p>Text: {joke.text}</p>
      )}
      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
};

export default JokeCard;
