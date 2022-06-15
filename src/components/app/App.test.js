import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

afterEach(cleanup);

it("renders without errors", () => {
  render(<App />);
});

it("renders mock api data", async () => {
  const fakePhoto = {
    id: 2758962,
    fullHDURL:
      "https://pixabay.com/get/54e7d04b4354ae14ea898279c02b327f1422dfe05b537441712f73d7_640.jpg",
    imageWidth: 2000,
    imageHeight: 1000,
    tags: "boats, yacht, ship",
    views: 238420,
    downloads: 164277,
    user: "Tester"
  };

  // generate 3 fake photos to be passed as a result array
  const fakePhoto1 = { ...fakePhoto, id: 1000 };
  const fakePhoto2 = { ...fakePhoto, id: 1001 };
  const fakePhoto3 = { ...fakePhoto, id: 1002 };

  const fakePhotos = { hits: [fakePhoto1, fakePhoto2, fakePhoto3] };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakePhotos)
    })
  );

  await act(async () => {
    const { getByTestId } = render(<App />);
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);

  expect(document.getElementsByClassName("loader")[0]).toHaveTextContent(
    "Loading ..."
  );

  // remove mock for isolation
  global.fetch.mockRestore();
});
