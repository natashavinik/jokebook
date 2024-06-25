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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <JokeForm />
        <JokeList />
        {/* <NewJoke /> */}
        {/* <ShowJokes /> */}
      </header>
    </div>
  );
}

export default App;
