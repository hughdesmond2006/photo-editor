import React, { useState } from "react";
import { IoMdResize, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import "./PhotoDetails.css";
import { useNavigate } from "react-router-dom";

const PhotoDetails = (props) => {
  const [isExpanded, setExpanded] = useState(true);
  const { currentView } = props;

  let navigate = useNavigate();

  return (
    <div>
      <div className={"infoBox"} data-testid={"infoBox"}>
        <div
          className={"infoButton"}
          data-testid={"infoButton"}
          onClick={() => setExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <IoIosArrowDown
              className={"arrow"}
              data-testid={"arrowdown"}
              size={"1rem"}
            />
          ) : (
            <IoIosArrowUp
              className={"arrow"}
              data-testid={"arrowup"}
              size={"1rem"}
            />
          )}
        </div>
        <div className={"infoGrid"} data-testid={"infoGrid"}>
          {isExpanded && (
            <>
              <IoMdResize
                data-testid={"iconPhotoSize"}
                className={"icon"}
                size={"1rem"}
                data-tip="Dimensions"
              />
              <p className={"infoItem"} data-testid={"photoSize"}>
                {currentView.owidth} x {currentView.oheight}
              </p>
              <FaUserCircle
                className={"icon"}
                data-testid={"iconUser"}
                size={"1rem"}
                data-tip="Uploader"
              />
              <p className={"infoItem"} data-testid={"user"}>
                {currentView.user}
              </p>
              <ReactTooltip />
            </>
          )}
          <div />
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100px",
              marginTop: "8px",
            }}
            onClick={() => {
              // clear local storage after last edit..
              localStorage.removeItem("size");
              localStorage.removeItem("pos");
              localStorage.removeItem("blur");
              localStorage.removeItem("grayscale");

              navigate(
                `edit/${currentView.id}/${currentView.owidth}/${currentView.oheight}`
              );
            }}
          >
            edit
          </button>
        </div>
      </div>
    </div>
  );
};

PhotoDetails.defaultProps = {
  currentView: {
    tags: "",
    views: 0,
    downloads: 0,
    user: "",
    owidth: 0,
    oheight: 0,
  },
};

export default PhotoDetails;
