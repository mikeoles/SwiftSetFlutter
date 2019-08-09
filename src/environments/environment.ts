import { labelScrollOptions } from 'src/app/labelScrollOptions';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  coveragePercent: true,
  showCoverageAsPercent: true,
  onHand: true,
  exportingPDF: true,
  exportFields: ['Barcode', 'top', 'left', 'width', 'height'],
  productGridFields: ['Barcode', 'top', 'left', 'width', 'height'],
  labelScrolling: labelScrollOptions.vertical,
  apiType: 'cloud', // Options: cloud or static
  missionHistoryDays: 14, // Number of days to display missions for
  adalConfig: {
    tenant: 'caad7702-bb38-4deb-a052-d0d48724c18e',
    clientId: 'ed4f00e4-3da8-4d2e-a6ce-327373ddc307',
    redirectUri: 'http://localhost:4200',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
