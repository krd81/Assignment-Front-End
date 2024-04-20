import { render, fireEvent, screen } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import { act } from "react-dom/test-utils";
import { expect, it } from "vitest";
import { AppContext } from "../authentication/AppContext";
import { MemoryRouter as Router } from "react-router-dom";

const mockAllUsers = [
  {
    firstName: "Test",
    lastName: "User",
    role: "Test Role",
    aboutMe: {
      text: "Test text",
      careerDevelopment: "Senior Engineer",
    },
  },
];

const mockProfile = [{}];

function SearchBarWrapper() {
  return (
    <AppContext.Provider value={{ allUsers: mockAllUsers, profile: mockProfile }}>
      <Router>
        <SearchBar />
      </Router>
    </AppContext.Provider>
  );
}

  it("should render without crashing", () => {
    render(<SearchBarWrapper />);
  });

  it("should update query state when typing in search input", () => {
    render(<SearchBarWrapper />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "John" } });
    expect(searchInput.value).toBe("John");
  });

  it("should not display search results when query length is less than 3", async () => {
    render(<SearchBarWrapper />);
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "Jo" } });
    // Wait for state update and re-render
    await act(async () => {});
    expect(screen.queryByText(/John Doe/i)).not.to.exist;
  });

