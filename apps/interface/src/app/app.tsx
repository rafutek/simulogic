import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeDiagramTest } from '@simulogic/ui'

axios.defaults.baseURL = 'http://localhost:8080'; // server url

export const App = () => {

  const [show, setShow] = useState(true);

  const onClick = () => {
    setShow(!show);
  }
  const UpButton = () => {
    return <button onClick={onClick}>
      click me
    </button>
  }
  
  return (
    <div>
      <h1>Welcome to interface!</h1>
      <UpButton />
      {show ? <TimeDiagramTest /> : null}
    </div>
  )
}
