const React = require('react');

const MockLink = ({ children, href, ...props }) => {
  return React.createElement('a', { href, ...props }, children);
};

module.exports = MockLink;
