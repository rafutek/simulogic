import React, { useState } from 'react';
import axios from 'axios';
import { TimeDiagram } from '@simulogic/ui'

axios.defaults.baseURL = 'http://localhost:8080'; // server url

export const App = () => {

  const [show, setShow] = useState(false);

  const onClick = () => {
    setShow(!show);
  }

  const UpButton = () => {
    return <button onClick={onClick}>
      click me
    </button>
  }

  const data = {
    signal: [
      { name: "clk", wave: "p....x.." },
      { name: "bus", wave: "x.34.5xx" },
      { name: "wire", wave: "0.1..0.." },
    ]
  }

  return (
    <div>
      <h1>Welcome to interface!</h1>
      <UpButton />
      {show ? <TimeDiagram data={data} /> : null}
    </div>
  )
}
