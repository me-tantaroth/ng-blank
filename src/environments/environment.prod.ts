import { environment as envProject } from '../../../environtment.project';

export const environment = {
  ...{
    production: true,
    project: {},
    theme: {},
    firebase: {},
    backgroundImage: ''
  },
  ...envProject
};
