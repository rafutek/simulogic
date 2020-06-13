import React from 'react';
import { render } from '@testing-library/react';

import Compo from './compo';

describe(' Compo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Compo />);
    expect(baseElement).toBeTruthy();
  });
});
