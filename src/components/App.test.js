import React from 'react';
import { shallow, render, mount } from 'enzyme';
import App from './App';

describe('App', () => {
  let props;
  let shallowApp;
  let renderedApp;
  let mountedApp;

  const shallowTestComponent = () => {
    if (!shallowApp) {
      shallowApp = shallow(<App {...props} />);
    }
    return shallowApp;
  };

  const renderTestComponent = () => {
    if (!renderedApp) {
      renderedApp = render(<App {...props} />);
    }
    return renderedApp;
  };

  const mountTestComponent = () => {
    if (!mountedApp) {
      mountedApp = mount(<App {...props} />);
    }
    return mountedApp;
  };  

  beforeEach(() => {
    props = {};
    shallowApp = undefined;
    renderedApp = undefined;
    mountedApp = undefined;
  });

  // Shallow / unit tests begin here
 
  // Render / mount / integration tests begin here
  
});
