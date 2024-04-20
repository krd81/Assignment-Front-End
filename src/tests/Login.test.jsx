import { expect, test } from "vitest";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import { unmountComponentAtNode } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../components/Login";
import { AuthContext } from "../authentication/AuthContext";
import { fireEvent } from "@testing-library/react";
import { AppContextProvider } from "../authentication/AppContext";

let container = null;

test("renders Login component", () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  act(() => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <AppContextProvider>
          <Router>
            <Login />
          </Router>
        </AppContextProvider>
      </AuthContext.Provider>,
      container
    );
  });
  expect(container.textContent).toContain("Login");

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("username and password inputs are empty initially", () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  act(() => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <AppContextProvider>
          <Router>
            <Login />
          </Router>
        </AppContextProvider>
      </AuthContext.Provider>,
      container
    );
  });

  const usernameInput = container.querySelector("#username");
  const passwordInput = container.querySelector("#password");

  expect(usernameInput.value).toBe("");
  expect(passwordInput.value).toBe("");

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("username and password inputs accept input", () => {
  container = document.createElement("div");
  document.body.appendChild(container);

  act(() => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <AppContextProvider>
          <Router>
            <Login />
          </Router>
        </AppContextProvider>
      </AuthContext.Provider>,
      container
    );
  });
  const usernameInput = container.querySelector("#username");
  const passwordInput = container.querySelector("#password");

  fireEvent.change(usernameInput, { target: { value: "testuser" } });
  fireEvent.change(passwordInput, { target: { value: "testpassword" } });

  expect(usernameInput.value).toBe("testuser");
  expect(passwordInput.value).toBe("testpassword");

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
