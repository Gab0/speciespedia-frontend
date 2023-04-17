import React, { useEffect } from 'react';
import URLImage from './UrlImage';
import { Group, Text } from 'react-konva';

import { RemoteResult } from '../Types';

interface SpeciesProps {
  x: number,
  y: number,
  tracker: any,
  species: RemoteResult,
  images: string[],
  debug: boolean
}

const SpeciesCard = (props: SpeciesProps) => {

  const onDragEnd = (event: any) => {
    updateTracker(event.target.x());
  };

  const updateTracker = (pX: number) => {
    props.tracker[speciesName] = pX;
  };

  useEffect(() => {
    console.log("Updating tracker.")
    updateTracker(props.x);
  });

  const selectImage = (imgData: any) => {
    if (imgData.tag !== 'Retrieved') return null;
    try {
      return imgData.contents[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const stylizeSpeciesName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const extractSpeciesName = (species: any) => {
    return species.remoteResultScientificName
  }

  const extractSpeciesNameDebug = (species: RemoteResult) => {
    return species.remoteResultScientificName
      + "\n"
      + species.remoteResultInformation.speciesInformationPhylum;
  }

  const labelOffset = (name: string) => {
    return (name.length - 14) * -2;
  };

  const speciesName: string = extractSpeciesName(props.species);
  const shownSpeciesNameDebug: string = stylizeSpeciesName(extractSpeciesNameDebug(props.species));
  const shownSpeciesName: string = stylizeSpeciesName(extractSpeciesName(props.species));

  const handleClick = (event: any) => {
    switch (event.detail) {
      case 2: {
        console.log('double click');
        break;
      }
      default: {
        break;
      }
  }
  };

  return (
    <Group x={props.x} y={props.y} id={speciesName} draggable onDragEnd={onDragEnd} key={speciesName} onClick={handleClick}>
       <URLImage x={0} y={0} src={selectImage(props.images)} onDragEnd={onDragEnd} />
       <Text text={props.debug ? shownSpeciesNameDebug : shownSpeciesName} fontSize={15} x={labelOffset(shownSpeciesName)} y={110} />
    </Group>
  );

};

export default SpeciesCard;
