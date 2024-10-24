import React from "react";
import { useSnapshot } from "valtio";

import state from "../store";
//function to automatically customize contrast of button against shirt color
import { getContrastingColor } from "../config/helpers";

const CustomButton = ({ title, type, customStyles, handleClick }) => {
  const snap = useSnapshot(state);
  const generateStyle = () => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color, // from Valtio
        color: getContrastingColor(snap.color),
      };
    } else if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: snap.color,
        color: snap.color,
      };
    }
  };
  return (
    <button
      className={`px-2 py-1.2 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
