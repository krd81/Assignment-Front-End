import "@testing-library/jest-dom"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { createMemoryHistory } from 'history'
import { MemoryRouter as Router } from 'react-router-dom';
import { describe, expect, it, beforeEach, test } from "vitest"
import Footer from "../components/Footer"

describe('Footer Component', () => {
    beforeEach(() => {
      render(<Footer />);
    });
      
    it('renders without crashing', () => {
      const footer = screen.getByRole('contentinfo');
      expect(footer).to.exist;
    });
  
    it('renders the logo', () => {
      const logo = screen.getByAltText('TalentForge Logo');
      expect(logo).to.exist;
    });
  
    it('renders the follow us section', () => {
      const followUs = screen.getByText('Follow us');
      expect(followUs).to.exist;
    });
  
    it('renders the legal section', () => {
      const legal = screen.getByText('Legal');
      expect(legal).to.exist;
    });
  
    it('renders the social media links', () => {
      const facebookLink = screen.getByLabelText('Facebook page');
      expect(facebookLink).to.exist;
    });
});

test('renders footer text', () => {
    render(<Footer />);
    
    const copyrightElement = screen.getByText(/© 2023/i);
    const linkElement = screen.getByText(/TalentForge™/i);
    const rightsElement = screen.getByText(/. All Rights Reserved./i);
  
    expect(copyrightElement).to.exist;
    expect(linkElement).to.exist;
    expect(rightsElement).to.exist;
});

test('clicks on TalentForge™ link', async () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <Footer />
      </Router>
    );
    const link = getByText('TalentForge™');
    fireEvent.click(link);
  
    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
    });
});
  
