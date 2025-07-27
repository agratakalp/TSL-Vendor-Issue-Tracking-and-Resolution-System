import React from "react";
import "./pop-up.css";

function popUp(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <div className="flex justify-end">
          <div>
            <button className="absolute ml-1 z-10" onClick={() => props.setTrigger(false)}>Close</button>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
}

export default popUp;
