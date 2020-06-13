import React from 'react';
import { Compo, CompoProps } from './compo';

export default {
  component: Compo,
  title: 'Compo',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: CompoProps = {};

  return <Compo />;
};
