import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import JokeForm from "./components/JokeForm";
import JokeList from "./components/JokeList";
// import { JokeForm, JokeList } from "./components";
// import { ShowJokes } from "./components";
// import { NewJoke } from "./components";
// import { ShowJokes } from "./components";

function App() {
  return (
    <div className="App">
      <JokeForm />
      <JokeList />
      {/* <NewJoke /> */}
      {/* <ShowJokes /> */}
    </div>
  );
}

export default App;
