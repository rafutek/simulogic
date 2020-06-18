import React from 'react';
import axios from 'axios';
import { SelectGetAndDisplaySimu } from '@simulogic/ui'

axios.defaults.baseURL = 'http://server.localhost'; // server url

export const App = () => {
  return (
    <div>
      <h1>Welcome to interface!</h1>
      <SelectGetAndDisplaySimu />
    </div>
  )
}
