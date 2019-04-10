import { environment as envProject } from '../../../environtment.project';

let project = {};

try {
  project = envProject;
} catch (err) {
  console.error('>', err);
}

export const environment = {
  ...{
    production: true,
    project: {},
    theme: {},
    firebase: {},
    backgroundImage: ''
  },
  ...project
};
