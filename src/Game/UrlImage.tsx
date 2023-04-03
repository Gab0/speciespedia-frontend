import React, { useState, useEffect, useRef, MouseEvent, MutableRefObject } from 'react';
import { Image } from 'react-konva';
import Konva from 'konva';

interface URLImageProps {
  x: number,
  y: number,
  src: string,
  onDragStart: any,
  onDragEnd: any,
}

const URLImage = (props: URLImageProps) => {
  const [image, setImage] = useState(null);
  const imageRef: MutableRefObject<HTMLImageElement | null> = useRef(null);

  const loadImage = () => {
    const img = new window.Image();
    img.src = props.src;
    img.addEventListener('load', handleLoad);
    imageRef.current = img;
  };

  const handleLoad = () => {
    setImage(imageRef.current);
  };

  useEffect(() => {
    loadImage();
    return () => {
      //imageRef.current.removeEventListener('load', handleLoad);
    };
  }, [props.src]);

  const handleClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
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
    <Image
      x={props.x}
      y={props.y}
      image={image}
      fill={'gray'}
      ref={imageRef}
      cornerRadius={70}
      width={100}
      height={100}
      shadowBlur={10}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onClick={handleClick}
    />
  );
};

export default URLImage;
