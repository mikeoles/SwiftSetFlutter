import { labelScrollOptions } from 'src/app/labelScrollOptions';
import config from './../assets/config.json';

export const environment = {
  production: true,
  showPlugs: false,
  showSuppliers: false,
  departments: true,
  sections: true,
  exportFields: config.exportFields,
  labelScrolling: labelScrollOptions.vertical
};
