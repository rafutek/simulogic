import React from 'react';
import { render } from '@testing-library/react';

import { UploadEntity } from './UploadEntity';

describe(' Compo', () => {
  it('UploadEntity should render successfully', () => {
    const { baseElement } = render(<UploadEntity entity="simulation" onUpload={null} />);
    expect(baseElement).toBeTruthy();
  });
});
