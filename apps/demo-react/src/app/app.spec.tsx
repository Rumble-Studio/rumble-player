import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

describe('App', () => {
  it('should render App successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(baseElement).toBeTruthy();
  });

  it('Should render player element', () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(container.querySelector('rs-player')).toBeDefined();
  });
});
