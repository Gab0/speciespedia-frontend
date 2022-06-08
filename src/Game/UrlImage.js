import React, { Component } from 'react';

import { Image } from 'react-konva';

// Handles dynamic image loading for species cards,
// so they show up when ready without loading halts.
// Stolen from https://konvajs.org/docs/react/Images.html;
export default class URLImage extends Component {
  state = {
    image: null,
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image,
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {

    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        fill={'gray'}
        ref={(node) => {
          this.imageNode = node;
        }}
        cornerRadius={70}
        width={100}
        height={100}
        shadowBlur={10}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    );
  }
}

