import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import axios from 'axios';

addDecorator(withKnobs);
configure(require.context('../src/lib', true, /\.stories\.(j|t)sx?$/), module);
axios.defaults.baseURL = 'http://localhost:3333';