
import React, { Component } from 'react';
import URLImage from './UrlImage'

import { Group,
         Text
       } from 'react-konva';


export default class SpeciesCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: this.props.x,
      y: this.props.y
    };

    this.updateTracker();
  }
  onDragEnd = (e) => {
    this.setState({
      x: e.target.x(),
      y: e.target.y()
    })

    this.updateTracker();
  }

  updateTracker () {
    this.props.tracker[this.props.species] = this.posX();
  }

  selectImage (imgData) {
    console.log(imgData.tag)
    if (imgData.tag !== "Retrieved") return null;
    try {
      console.log("IMG OK.")
      return imgData.contents[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  posX () {
    return this.state.x;
  }

  stylizeSpeciesName (name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  labelOffset (name) {
    return (name.length - 14) * -2;
  }

  render () {
    const name = this.stylizeSpeciesName(this.props.species);

    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        id={this.props.species}
        draggable
        onDragEnd={this.onDragEnd}
        key={this.props.species}
      >
        <URLImage
          src={this.selectImage(this.props.images)}
        />
        <Text
          text={name}
          fontSize={15}
          x={this.labelOffset(name)}
          y={110}
        />
      </Group>
    )
  }

}
