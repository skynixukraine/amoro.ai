import React from 'react';

import styles from '../styles/Home.module.css';

interface ResizableImageProps {
  file: File | Blob | String | null;
  imageWidth: number;
  setImageWidth: (width: number) => void;
}

const ResizableImage: React.FC<ResizableImageProps> = ({
  file,
  imageWidth,
  setImageWidth,
}) => {
  const parentDivRef = React.useRef<HTMLDivElement>(null);
  const [tempWidth, setTempWidth] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      const div = parentDivRef.current;
      if (!div) return;
      setTempWidth(div.offsetWidth - 60);
    }, 20);

    return () => clearInterval(timer);
  }, []);
  //console.log('file__', file)
  React.useEffect(() => {
    const div = parentDivRef.current;
    if (!div) return;
    setImageWidth(div.offsetWidth - 60);
  }, [tempWidth]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div
        ref={parentDivRef}
        className={styles.resizable}
        style={{ backgroundColor: '#F9FAFB' }}
      >
        <img
          src={
            (file instanceof File || file instanceof Blob) ? URL.createObjectURL(file) : String(file) 
          }
          width={imageWidth}
          height={'auto'}
          alt="image"
        />
      </div>
    </div>
  );
};

export default ResizableImage;
