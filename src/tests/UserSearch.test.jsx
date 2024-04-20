import { render, screen } from "@testing-library/react";
import UserSearch from "../components/UserSearch";
import { test, describe, expect, beforeEach } from "vitest";
import { AppContext } from "../authentication/AppContext";

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

function UserSearchWrapper() {
  return (
    <AppContext.Provider value={{ allUsers: mockAllUsers, profile: mockProfile }}>
      <UserSearch />
    </AppContext.Provider>
  );
}

describe("UserSearch Component", () => {
  beforeEach(() => {
    render(<UserSearchWrapper />);
  });

  test("renders correct departments", () => {
    const departments = ["marketing", "engineering", "human resources", "sales", "information technology", "board"];
    departments.forEach((department) => {
      expect(screen.getByText(new RegExp(department, "i"))).to.exist;
    });
  });
});
