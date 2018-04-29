import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

//      otpauth://topt/Efreitech?secret=Gomugomunocoding&issuer=Majdi

//      /^otpauth\/\/totp\/(.+)\?secret=(.+)&issuer=(.*)$/
