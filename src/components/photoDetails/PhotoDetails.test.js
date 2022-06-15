import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PhotoDetails from "./PhotoDetails";

afterEach(cleanup);

it("renders without errors", () => {
  render(<PhotoDetails />);
});

it("renders without errors w/ props", () => {
  render(<PhotoDetails currentView={{ tags: "bish,bash,bosh" }} />);
});

it("shows correct tags w/ props", () => {
  const { getAllByTestId } = render(
    <PhotoDetails currentView={{ tags: "bish,bash,bosh" }} />
  );

  expect(getAllByTestId("tag")[0]).toHaveTextContent("bish");
  expect(getAllByTestId("tag")[1]).toHaveTextContent("bash");
  expect(getAllByTestId("tag")[2]).toHaveTextContent("bosh");
});

it("shows correct details w/ props no tags", () => {
  const { getByTestId } = render(
    <PhotoDetails
      currentView={{
        views: 10293443,
        downloads: 4000,
        user: "jimmy",
        owidth: 350,
        oheight: 300
      }}
    />
  );

  // expand infobox to test contents..
  fireEvent(
    getByTestId("infoButton"),
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true
    })
  );

  expect(getByTestId("views")).toHaveTextContent("10,293,443");
  expect(getByTestId("downloads")).toHaveTextContent("4,000");
  expect(getByTestId("user")).toHaveTextContent("jimmy");
  expect(getByTestId("photoSize")).toHaveTextContent("350 x 300");
});
