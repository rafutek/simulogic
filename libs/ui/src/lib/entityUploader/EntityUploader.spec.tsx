import React from 'react';
import { render } from '@testing-library/react';

import { EntityUploader } from './EntityUploader';

describe(' Compo', () => {
  it('UploadEntity should render successfully', () => {
    const { baseElement } = render(<EntityUploader entity="simulation" onUpload={null} />);
    expect(baseElement).toBeTruthy();
  });
});
