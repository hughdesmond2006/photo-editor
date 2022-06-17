import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { saveAs } from "file-saver";

const MAX_BLUR = 10;
const DEFAULT_WIDTH = 600;
const DEFAULT_X = 60;
const DEFAULT_Y = 60;

export default function App() {
  let params = useParams();
  const aspectRatio = params.height / params.width;

  const savedSize = JSON.parse(localStorage.getItem("size"));
  const savedPos = JSON.parse(localStorage.getItem("pos"));
  const savedBlur = parseInt(localStorage.getItem("blur"));
  const savedGrayscale = parseInt(localStorage.getItem("grayscale"))
    ? true
    : false;

  const [fetchError, setFetchError] = useState(null);
  const [url, setURL] = useState([]);
  const [blur, setBlur] = useState(savedBlur || 0);
  const [isGrayscale, setIsGreyscale] = useState(
    savedGrayscale ? savedGrayscale : false
  );
  const [pos, setPos] = useState(savedPos || { x: DEFAULT_X, y: DEFAULT_Y });
  const [size, setSize] = useState(
    savedSize || {
      w: DEFAULT_WIDTH,
      h: Math.round(DEFAULT_WIDTH * aspectRatio),
    }
  );
  const [displaySize, setDisplaySize] = useState(size);

  useEffect(() => {
    load(size);
  }, []);

  useEffect(() => {
    setDisplaySize(size);
    localStorage.setItem("size", JSON.stringify(size));
  }, [size]);

  useEffect(() => {
    localStorage.setItem("pos", JSON.stringify(pos));
  }, [pos]);

  useEffect(() => {
    localStorage.setItem("blur", `${blur}`);
    load(size);
  }, [blur]);

  useEffect(() => {
    localStorage.setItem("grayscale", isGrayscale ? "1" : "0");
    load(size);
  }, [isGrayscale]);

  const load = async (size) => {
    let URL = `https://picsum.photos/id/${params.id}/${
      size ? size.w : params.width
    }/${size ? size.h : params.height}?${isGrayscale ? "grayscale&" : ""}${
      blur ? `blur=${blur}` : ""
    }`;

    fetch(URL)
      .then((res) => res.url)
      .then(
        (result) => {
          setURL(result);
        },
        (error) => {
          setFetchError(error);
        }
      );
  };

  const download = () => {
    saveAs(
      url,
      `${params.id}_${size.w}x${size.h}${isGrayscale ? "_grayscale" : ""}${
        blur ? `_blur${blur}` : ""
      }.jpg`
    );
  };

  const setOriginalSize = () => {
    const oSize = {
      w: params.width,
      h: params.height,
    };
    setSize(oSize);
    setPos({
      x: DEFAULT_X,
      y: DEFAULT_Y,
    });
    load(oSize);
  };

  const setDefaultSize = () => {
    const dSize = {
      w: DEFAULT_WIDTH,
      h: Math.round(DEFAULT_WIDTH * aspectRatio),
    };
    setSize(dSize);
    setPos({
      x: DEFAULT_X,
      y: DEFAULT_Y,
    });
    load(dSize);
  };

  const onResizeStop = (e, direction, ref, delta, position) => {
    const w = parseInt(ref.style.width.replace("px", ""));
    const h = parseInt(ref.style.height.replace("px", ""));
    setSize({ w, h });
    setPos({ ...position });
    load({ w, h });
  };

  const onResize = (e, direction, ref, delta, position) => {
    setDisplaySize({
      w: parseInt(ref.style.width.replace("px", "")),
      h: parseInt(ref.style.height.replace("px", "")),
    });
  };

  return (
    <>
      <s.controls>
        <div>
          <button
            disabled={fetchError}
            style={{ margin: "4px" }}
            onClick={setOriginalSize}
          >
            original size
          </button>
          <button
            disabled={fetchError}
            style={{ margin: "4px" }}
            onClick={setDefaultSize}
          >
            reset to default
          </button>
          <div
            style={{
              display: "inline-block",
              marginLeft: "16px",
              marginRight: "16px",
            }}
          >
            {displaySize.w} x {displaySize.h} pixels
          </div>
          <button
            disabled={fetchError}
            style={{ margin: "4px" }}
            onClick={() => setBlur(blur === MAX_BLUR ? 0 : blur + 1)}
          >
            blur {blur}
          </button>
          <button
            disabled={fetchError}
            style={{ margin: "4px" }}
            onClick={() => setIsGreyscale(!isGrayscale)}
          >
            {isGrayscale ? "to colour" : "to grayscale"}
          </button>
          <button
            disabled={fetchError}
            style={{ margin: "4px" }}
            onClick={download}
          >
            download
          </button>
        </div>
      </s.controls>
      <Rnd
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        size={{ width: size.w, height: size.h }}
        position={{ x: pos.x, y: pos.y }}
        onDragStop={(e, d) => setPos({ x: d.x, y: d.y })}
        onResizeStop={onResizeStop}
        onResize={onResize}
        lockAspectRatio
      >
        {fetchError ? (
          <s.errMsg>Failed to fetch photo, please try again later...</s.errMsg>
        ) : (
          <>
            <s.spinner />
            <s.photo style={{ backgroundImage: `url(${url})` }} />
          </>
        )}
      </Rnd>
    </>
  );
}

const s = {
  photo: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-size: cover;
  `,
  spinner: styled.div`
    background-image: url("https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif");
    width: 50px;
    height: 50px;
    background-size: contain;
  `,
  errMsg: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: lightgray;
    width: 100%;
    height: 100%;
    font-size: 1.5rem;
    text-align: center;
    color: darkred;
    padding: 1rem;
  `,
  controls: styled.div`
    background: rgb(0 0 0 / 46%);
    position: fixed;
    width: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
  `,
};
