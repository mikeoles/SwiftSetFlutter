import { labelScrollOptions } from 'src/app/labelScrollOptions';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/',
  showPlugs: false,
  coveragePercent: true,
  showCoverageAsPercent: true,
  onHand: true,
  exportingPDF: true,
  exportFields: ['Barcode', '"MIN"', '"ITEM_DESCRIPTION"', '"BASE_PRICE"', '"PROMO_PRICE"', 'top', 'left', 'width', 'height'],
  productGridFields: ['Barcode', '"MIN"', '"ITEM_DESCRIPTION"', '"BASE_PRICE"', '"PROMO_PRICE"', 'top', 'left', 'width', 'height'],
  labelScrolling: labelScrollOptions.vertical,
  apiType: 'cloud' // Options: cloud or static
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
