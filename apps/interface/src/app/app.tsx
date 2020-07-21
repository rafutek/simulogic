import React, { useState } from 'react';
import axios from 'axios';
import { AppBar, theme, TabMenuAndWorkbench } from '@simulogic/ui'
import { ThemeProvider } from '@material-ui/core';

axios.defaults.baseURL = 'http://localhost:8080'; // server url

export const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <AppBar />
      <TabMenuAndWorkbench />
    </ThemeProvider>
  )
}
