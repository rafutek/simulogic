import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeDiagramTest } from '@simulogic/ui'

axios.defaults.baseURL = 'http://localhost:8080'; // server url

export const App = () => {
  
  const WaveDrom = window["WaveDrom"];
  const [show, setShow] = useState(false);

  const onClick = () => {
    setShow(!show);
  }

  const UpButton = () => {
    console.log()
    return <button onClick={onClick}>
      click me
    </button>
  }

  useEffect(() => {
    if (show) {
      WaveDrom.ProcessAll();
    }
  }, [show]);

  return (
    <div>
      <h1>Welcome to interface!</h1>
      <UpButton />
      {show ? <TimeDiagramTest /> : null}
    </div>
  )
}
