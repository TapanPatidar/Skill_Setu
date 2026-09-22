import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ClientApp from '../client/src/App.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ClientApp />
    </BrowserRouter>
  );
}
