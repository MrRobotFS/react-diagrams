import { useState } from "react";

const useUndoRedo = (initialState) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const set = (data) => {
    if (currentIndex < history.length - 1) {
       setHistory(history.slice(0, currentIndex + 1));
    }
    const newHistory = [...history, data];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1); 
 };
 

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return [history[currentIndex], set, undo, redo, history, currentIndex];
};

export default useUndoRedo;
