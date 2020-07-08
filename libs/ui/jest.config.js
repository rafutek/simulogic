export const name = 'ui';
export const preset = '../../jest.config.js';
export const transform = {
  '^.+\\.[tj]sx?$': [
    'babel-jest',
    { cwd: __dirname, configFile: './babel-jest.config.json' },
  ],
};
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'html'];
export const coverageDirectory = '../../coverage/libs/ui';
