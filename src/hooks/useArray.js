import { useState } from "react";

function useArray(initialValue = []) {
  const [array, setArray] = useState(initialValue);

  const push = (element) => {
    setArray((prev) => [...prev, element]);
  };

  const filter = (callback) => {
    setArray((prev) => prev.filter(callback));
  };

  const update = (index, newElement) => {
    setArray((prev) => [
      ...prev.slice(0, index),
      newElement,
      ...prev.slice(index + 1),
    ]);
  };

  const remove = (index) => {
    setArray((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  };

  const clear = () => {
    setArray([]);
  };

  return { array, set: setArray, push, filter, update, remove, clear };
}

export default useArray;
