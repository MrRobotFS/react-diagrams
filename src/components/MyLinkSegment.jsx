import React from "react";

export class MyLinkSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  // MyLinkSegment
  render() {
    console.log('Rendering MyLinkSegment');
    const { color } = this.props.model.getOptions();
    return (
      <g>
        <path
  fill="none"
  ref={path => (this.path = path)}
  {...this.props.extraProps}
  strokeWidth={this.props.width}
  stroke="black"
  d={this.props.path}
/>


      </g>
    );
  }

}
