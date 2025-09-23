import Gif from "./Untitled design.gif";
import React from "react";

/**
 *
 * @param {Omit<React.ComponentProps<"div">,'children'>} props
 * @returns {React.JSX.Element}
 * @constructor
 */
const GiF = (props) => {
  return (
    <div {...props}>
      <img src={Gif} alt={"WELCOME"} />
    </div>
  );
};
export default GiF;
