import { render, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import NewListing from "../components/NewListing";
import { BrowserRouter as Router } from "react-router-dom";


test("renders NewListing and checks form submission", async () => {
  const { getByText } = render(
    <Router>
      <NewListing />
    </Router>
  );

  // Check if form elements are present
  expect(getByText(/Job title:/i)).to.exist;
  expect(getByText(/Department:/i)).to.exist;
  expect(getByText(/Salary:/i)).to.exist;
  expect(getByText(/Posting date:/i)).to.exist;
  expect(getByText(/Closing date:/i)).to.exist;
  expect(getByText(/Role Basis:/i)).to.exist;
  expect(getByText(/Role type:/i)).to.exist;
  expect(getByText(/Role location:/i)).to.exist;
  expect(getByText(/Full description:/i)).to.exist;

  // Simulate form submission
  const submitButton = getByText(/Save/i);
  fireEvent.click(submitButton);
});