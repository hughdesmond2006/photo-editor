import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Editor.css";
import { Rnd } from "react-rnd";
import styled from "styled-components";

const MAX_BLUR = 10;
const MAX_SCALE = 1;
const MIN_SCALE = 0.1;
const DEFAULT_WIDTH = 600;

export default function App() {
  let params = useParams();
  const aspectRatio = params.height / params.width;

  const savedSize = JSON.parse(localStorage.getItem("size"));
  const savedPos = JSON.parse(localStorage.getItem("pos"));
  const savedBlur = parseInt(localStorage.getItem("blur"));
  const savedGrayscale = parseInt(localStorage.getItem("grayscale"))
    ? true
    : false;

  console.log("saved", savedSize, savedPos, savedBlur, savedGrayscale);

  const [fetchError, setFetchError] = useState(null);
  const [url, setURL] = useState([]);
  const [blur, setBlur] = useState(savedBlur || 0);
  const [isGrayscale, setIsGreyscale] = useState(
    savedGrayscale ? savedGrayscale : false
  );
  const [pos, setPos] = useState(savedPos || { x: 100, y: 100 });
  const [size, setSize] = useState(
    savedSize || {
      w: DEFAULT_WIDTH,
      h: Math.round(DEFAULT_WIDTH * aspectRatio),
    }
  );
  const [scale, setScale] = useState(1);

  console.log("state", size, scale, blur, isGrayscale);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    localStorage.setItem("size", JSON.stringify(size));
    load(size);
  }, [size]);

  useEffect(() => {
    localStorage.setItem("pos", JSON.stringify(pos));
    load(size);
  }, [pos]);

  useEffect(() => {
    localStorage.setItem("blur", `${blur}`);
    load(size);
  }, [blur]);

  useEffect(() => {
    localStorage.setItem("grayscale", isGrayscale ? "1" : "0");
    load(size);
  }, [isGrayscale]);

  const load = (size) => {
    let URL = `https://picsum.photos/id/${params.id}/${
      size ? size.w : params.width
    }/${size ? size.h : params.height}?${isGrayscale ? "grayscale&" : ""}${
      blur ? `blur=${blur}` : ""
    }`;

    fetch(URL)
      .then((res) => res.url)
      .then(
        (result) => {
          console.log(result);

          setURL(result);
        },
        (error) => {
          setFetchError(error);
        }
      );
  };

  const download = () => {
    let URL = `https://picsum.photos/id/${params.id}/info`;

    fetch(URL)
      .then((res) => res)
      .then(
        (result) => {
          console.log("info", result);

          setURL(result);
        },
        (error) => {
          setFetchError(error);
        }
      );
  };

  return (
    <s.container>
      {fetchError ? (
        <p className={"fetchError"} data-testid={"fetchError"}>
          Failed to fetch photos, please try again later...
        </p>
      ) : (
        <>
          <div>EDITOR!!! for id: {params.id}</div>
          <div style={{ color: "red" }}>
            {size.w} x {size.h}
          </div>
        </>
      )}
      <Rnd
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        size={{ width: size.w, height: size.h }}
        position={{ x: pos.x, y: pos.y }}
        onDragStop={(e, d) => setPos({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, position) => {
          setSize({
            w: parseInt(ref.style.width.replace("px", "")),
            h: parseInt(ref.style.height.replace("px", "")),
          });
          setPos({
            ...position,
          });
        }}
        //scale={scale}
        lockAspectRatio
      >
        <s.photo style={{ backgroundImage: `url(${url})` }} />
      </Rnd>

      {/* <button onMouseDown={resizeHandler}>resize</button> */}
      <button onClick={() => setBlur(blur === MAX_BLUR ? 0 : blur + 1)}>
        blur+
      </button>
      <button onClick={() => setIsGreyscale(!isGrayscale)}>grayscale+</button>
      <button onClick={download}>Click to download</button>
      <button
        onClick={() => {
          if (scale !== MAX_SCALE) {
            setScale(scale + 0.1);
          }
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          if (scale !== MIN_SCALE) {
            setScale(scale - 0.1);
          }
        }}
      >
        -
      </button>
    </s.container>
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
  container: styled.div`
    overflow: hidden;
    background-color: #57597c;
    opacity: 1;
    background-image: linear-gradient(
        #676983 0.7000000000000001px,
        transparent 0.7000000000000001px
      ),
      linear-gradient(
        to right,
        #676983 0.7000000000000001px,
        #57597c 0.7000000000000001px
      );
    background-size: 14px 14px;
    height: 100vh;
    width: 100vw;
    color: gray;
  `,
};
