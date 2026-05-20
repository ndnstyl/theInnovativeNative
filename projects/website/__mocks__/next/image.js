const React = require('react');

const MockImage = (props) => {
  return React.createElement('img', {
    ...props,
    src: typeof props.src === 'object' ? props.src.src : props.src,
  });
};

module.exports = MockImage;
