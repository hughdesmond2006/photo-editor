import React, { useState } from "react";
import {
  IoMdDownload,
  IoMdResize,
  IoIosArrowDown,
  IoIosArrowUp,
} from "react-icons/io";
import { FaEye, FaUserCircle, FaTags } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import "./PhotoDetails.css";
import { useNavigate } from "react-router-dom";

// custom expandable view to show photo details in single photo mode
// -----------------------------------------------------------------
// expanded/collapsed state persists while swiping through photos
// icons with tooltips used for minimal design
// rem sizing for different displays
const PhotoDetails = (props) => {
  const [isExpanded, setExpanded] = useState(false);
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
              <IoMdDownload
                className={"icon"}
                data-testid={"iconDownloads"}
                size={"1rem"}
                data-tip="Downloads"
              />
              <p className={"infoItem"} data-testid={"downloads"}>
                {currentView.downloads.toLocaleString()}
              </p>
              <FaEye
                className={"icon"}
                data-testid={"iconViews"}
                size={"1rem"}
                data-tip="Views"
              />

              {/* <p className={"infoItem"} data-testid={"views"}>
                {currentView.views.toLocaleString()}
              </p> */}
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
          <FaTags
            className={"icon"}
            data-testid={"iconTags"}
            size={"1rem"}
            data-tip="Tags"
          />
          <div
            className={"infoItem tagsContainer"}
            data-testid={"tagsContainer"}
          >
            <button
              onClick={() => {
                navigate(
                  `edit/${currentView.id}/${currentView.owidth}/${currentView.oheight}`,
                  { replace: true }
                );
              }}
            >
              edit
            </button>
            |
            {currentView.tags &&
              currentView.tags.split(",").map((tag, index) => {
                return (
                  <div className={"tag"} data-testid={"tag"} key={index}>
                    {tag}
                  </div>
                );
              })}
          </div>
          <ReactTooltip />
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
