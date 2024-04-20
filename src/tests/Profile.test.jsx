import { render, fireEvent, screen } from "@testing-library/react";
import Profile from "../components/Profile";
import { describe, expect, it } from "vitest";
import { AuthContext } from "../authentication/AuthContext";
import { AppContext } from "../authentication/AppContext";
import { MemoryRouter as Router } from "react-router-dom";

const mockProfileUser = {
  firstName: "Test",
  lastName: "User",
  role: "Test Role",
  aboutMe: {
    text: "Test text",
    careerDevelopment: "Test career development",
  },
  // Add other necessary properties
};

// Mock other context values
const mockAllUsers = [mockProfileUser];
const mockAllListings = [];
const mockLoggedInUser = [{}];
const mockProfile = [mockProfileUser];

function ProfileWrapper() {
  return (
    <AuthContext.Provider value={{ token: "test" }}>
      <AppContext.Provider
        value={{
          allUsers: mockAllUsers,
          allListings: mockAllListings,
          loggedInUser: mockLoggedInUser,
          profile: mockProfile,
        }}
      >
        <Router>
          <Profile />
        </Router>
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}

describe("Profile Component", () => {
  it("should render without crashing", () => {
    render(<ProfileWrapper />);
    // Test code here
  });


  it("should add a skill", () => {
    render(<ProfileWrapper />);
    const editButton = screen.getByRole("button", { name: /edit profile/i });
    fireEvent.click(editButton);
    const addSkillInput = screen.getByPlaceholderText(/15 character max/i);
    const addSkillButton = screen.getByRole("button", { name: /add skill/i });
    fireEvent.change(addSkillInput, { target: { value: "New Skill" } });
    fireEvent.click(addSkillButton);
    expect(screen.getByText(/new skill/i)).to.exist;
  });
});
