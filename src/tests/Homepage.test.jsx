// FILEPATH: /home/mattbryant/projects/talentforge/Talent-Forge-Front-End/TalentForge-React-Front-End/src/tests/HomePage.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter as Router } from "react-router-dom";
import HomePage from "../components/HomePage";
import { describe, expect, it, beforeEach } from "vitest";
import { AppContextProvider } from "../authentication/AppContext"

describe("HomePage Component", () => {
  beforeEach(() => {
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({ firstName: "Test" }), 
      });
  });

  it("renders without crashing", () => {
    render(
      <Router>
        <AppContextProvider>
          <HomePage />
        </AppContextProvider>
      </Router>
    );
    const homePage = screen.getByRole("main");
    expect(homePage).to.exist;
  });

 it("renders the welcome message", async () => {
   render(
     <Router>
       <AppContextProvider>
         <HomePage />
       </AppContextProvider>
     </Router>
   );
   await waitFor(() => screen.getByText(/Welcome/i));
 });

  it("renders the logo", () => {
    render(
      <Router>
        <AppContextProvider>
          <HomePage />
        </AppContextProvider>
      </Router>
    );
    const logo = screen.getByAltText("Talent Forge Logo");
    expect(logo).to.exist;
  });

  it("renders the navigation links", () => {
    render(
      <Router>
        <AppContextProvider>
          <HomePage />
        </AppContextProvider>
      </Router>
    );
    const latestJobsLink = screen.getByText("Latest Jobs");
    const myProfileLink = screen.getByText("My Profile");
    const companyNetworkLink = screen.getByText("Company Network");
    expect(latestJobsLink).to.exist;
    expect(myProfileLink).to.exist;
    expect(companyNetworkLink).to.exist;
  });
});
