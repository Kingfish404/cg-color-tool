import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/index.module.scss'

const regHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/g;
const regRGB = /^(\d|(\d{2})|(1\d{2})|(2[0-5]{2})),(\d|(\d{2})|(1\d{2})|(2[0-5]{2})),(\d|(\d{2})|(1\d{2})|(2[0-5]{2}))$/g;
const regRG = /^(0|1|(0\.\d+)),(0|1|(0\.\d+)),(0|1|(0\.\d+))$/g

function rgbToHexArr(rgb: string): Array<string> {
  const arr: Array<number> = rgb.substring(4, rgb.length - 1).split(',').map(v => (Number(v)));
  const out: Array<string> = new Array(3).fill("");
  arr.forEach((v, index) => {
    let nv = v.toString(16);
    if (nv.length == 1) {
      nv = "0" + v;
    }
    out[index] = nv;
  });
  return out;
}

function hexToRgbArr(hex: string): Array<number> {
  const result = /^#?([A-Za-f\d]{1,2})([A-Za-f\d]{1,2})([A-Za-f\d]{1,2})/i.exec(hex);
  let out = [];
  if (!result) {
    return [255, 255, 255];
  } else if (result[1].length === 1) {
    out = result.map(v => (v + v));
  } else {
    out = result;
  }
  return [parseInt(out[1], 16), parseInt(out[2], 16), parseInt(out[3], 16)];
}

const Home: NextPage = () => {
  const [backgroundColor, setBackgroundColor] = useState('#66ccff');
  const [backgroundColorNext, setBackgroundColorNext] = useState('');
  const [backgroundColorRG, setBackgroundColorRG] = useState('');
  const [color, setColor] = useState('#111');

  useEffect(() => {
    let rgbArr;
    if (backgroundColor[0] === '#') {
      rgbArr = hexToRgbArr(backgroundColor);
      setBackgroundColorNext(`rgb(${rgbArr[0]},${rgbArr[1]},${rgbArr[2]})`);
    } else {
      const hexArr = rgbToHexArr(backgroundColor);
      rgbArr = hexToRgbArr(`#${hexArr[0]}${hexArr[1]}${hexArr[2]})`);
      setBackgroundColorNext(`#${hexArr[0]}${hexArr[1]}${hexArr[2]})`);
    }

    setBackgroundColorRG(`rg(${rgbArr[0] / 255},${rgbArr[1] / 255},${rgbArr[2] / 255})`);

    if ((rgbArr[0] + rgbArr[1] + rgbArr[2]) < 270) {
      setColor('#eee');
    } else {
      setColor('#111');
    }

    return () => { }
  }, [backgroundColor])

  return (
    <div className={styles.container}>
      <Head>
        <title>Tools for Computer Graphics</title>
        <meta name="description" content="Online tools for Computer Graphics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          backgroundColor: backgroundColor,
          color: color
        }}
        className={styles.main}>
        <div
          style={{
            color: color
          }}
          className={styles.label}>
          <span>{backgroundColor}</span>
          <span>{backgroundColorNext}</span>
          <br />
          <span>{backgroundColorRG}</span>
        </div>
        <input
          style={{
            color: color
          }}
          id='hex' type="text"
          placeholder='hex'
          onChange={(e) => {
            const value = e.target.value.charAt(0) === '#' ?
              e.target.value :
              `#${e.target.value}`;
            if (value.match(regHex)) {
              setBackgroundColor(value);
            };
          }}
        />
        <input
          style={{
            color: color
          }}
          id='rgb' type="text"
          placeholder='rgb'
          onChange={(e) => {
            const value = e.target.value;
            if (value.match(regRGB)) {
              setBackgroundColor(`rgb(${value})`);
            };
          }}
        />
        <input
          style={{
            color: color
          }}
          id='rg' type="text"
          placeholder='rg'
          onChange={(e) => {
            const value = e.target.value;
            if (value.match(regRG)) {
              const arr = value.split(',').map(v => (Number(v) * 255));
              const v = arr.join(',');
              setBackgroundColor(`rgb(${v})`);
            };
          }}
        />
        <div
          style={{
            color: color
          }}
        >
          <p>hex is like #66ccff or #6cf</p>
          <p>rgb is like rgb(102,204,255)</p>
          <p>rg is like rg(0.182,0.364,0.455)</p>
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
