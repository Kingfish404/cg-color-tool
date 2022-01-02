import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/index.module.scss'

const regHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g;
const regRGBValue = /^(\d|(\d{2})|(1\d{2})|(2[0-5]{2})),(\d|(\d{2})|(1\d{2})|(2[0-5]{2})),(\d|(\d{2})|(1\d{2})|(2[0-5]{2}))$/g;
const regRGValue = /^(0|1|(0\.\d+)),(0|1|(0\.\d+)),(0|1|(0\.\d+))$/g

function rgbToHexArr(rgb: string): Array<string> {
  if (!rgb.substring(4, rgb.length - 1).match(regRGBValue)) {
    return ["ff", "ff", "ff"];
  }
  const arr: Array<string> = rgb
    .substring(4, rgb.length - 1)
    .split(",")
    .map((v) => {
      const n = parseInt(v).toString(16);
      return n.length == 1 ? n + n : n;
    });
  return arr;
}

function hexToRgbArr(hex: string): Array<number> {
  if (!hex.match(regHex)) {
    return [255, 255, 255];
  }
  const result = hex.length == 4 ?
    hex.substring(1, 4).split("").map(v => v + v) :
    [hex.substring(1, 3), hex.substring(3, 5), hex.substring(5)];
  return [parseInt(result[0], 16), parseInt(result[1], 16), parseInt(result[2], 16)];
}

const Home: NextPage = () => {
  const [backgroundColorRGB, setBackgroundColorRGB] = useState("rgb(102,204,255)");
  const [backgroundColorHex, setBackgroundColorHex] = useState('');
  const [backgroundColorRG, setBackgroundColorRG] = useState('');
  const [color, setColor] = useState('#111');

  useEffect(() => {
    const hexArr = rgbToHexArr(backgroundColorRGB);
    const hexStr = `#${hexArr.join("")}`;
    const rgbArr = backgroundColorRGB.substring(4, backgroundColorRGB.length - 1).split(",").map(v => parseFloat(v));
    setBackgroundColorHex(hexStr);
    setBackgroundColorRG(`rg(${(rgbArr.map(v => Math.round(v / 255 * 1000) / 1000).join(","))})`);

    if ((rgbArr[0] + rgbArr[1] + rgbArr[2]) < 270) {
      setColor('#eee');
    } else {
      setColor('#111');
    }

    return () => { }
  }, [backgroundColorRGB]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Tools for Computer Graphics</title>
        <meta name="description" content="Online tools for Computer Graphics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}
        style={{
          ['--color' as any]: color,
          backgroundColor: backgroundColorRGB,
        }}>
        <header>
          <h1>Color Tool</h1>
        </header>
        <div className={styles.label}>
          <span>{backgroundColorRGB}</span>
          <span>{backgroundColorHex}</span>
          <br />
          <span>{backgroundColorRG}</span>
        </div>
        <div>
          <input className={styles.colorPicker}
            type="color"
            value={(() => {
              const hexArr = rgbToHexArr(backgroundColorRGB);
              const hex = `#${hexArr.join('')}`;
              return hex;
            })()}
            onChange={(e) => {
              const value = e.target.value;
              const rgbArr = hexToRgbArr(value);
              setBackgroundColorRGB(`rgb(${rgbArr.join(',')})`);
            }} />
          <input
            id='hex' type="text"
            placeholder='hex'
            onChange={(e) => {
              const value = e.target.value.charAt(0) === '#' ?
                e.target.value :
                `#${e.target.value}`;
              if (value.match(regHex)) {
                const rgbArr = hexToRgbArr(value);
                setBackgroundColorRGB(`rgb(${rgbArr.join(',')}`);
              };
            }}
          />
          <input
            id='rgb' type="text"
            placeholder='rgb'
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(regRGBValue)) {
                setBackgroundColorRGB(`rgb(${value})`);
              };
            }}
          />
          <input
            id='rg' type="text"
            placeholder='rg'
            onChange={(e) => {
              const value = e.target.value;
              if (value.match(regRGValue)) {
                const arr = value.split(',').map(v => (parseFloat(v) * 255));
                const v = arr.join(',');
                setBackgroundColorRGB(`rgb(${v})`);
              };
            }}
          />
        </div>
        <div
        >
          <p>hex is like #66ccff or #6cf</p>
          <p>rgb is like rgb(102,204,255)</p>
          <p>rg is like rg(0.4,0.8,1)</p>
          <p>just input 6cf or 102,204,255</p>
        </div>
        <footer
          style={{
            color: color
          }}>
          <span>Copyright©<a href="https://kingfish404.cn/">Jin Yu</a></span>
        </footer>
      </main>
    </div>
  )
}

export default Home
