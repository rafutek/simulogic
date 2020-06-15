import React from 'react';
import axios from 'axios';
import { SelectGetAndDisplaySimu } from '@simulogic/ui'

axios.defaults.baseURL = 'http://localhost:3333'; // server url

export const App = () => {
  return (
    <div>
      <h1>Welcome to interface!</h1>
      <SelectGetAndDisplaySimu />
    </div>
  )
}
