import { labelScrollOptions } from 'src/app/labelScrollOptions';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost/api',
  authUrl: 'http://localhost/dex/auth?',
  authClientId: 'data-products-viewer',
  coverageDisplayType: 'description', // description or percent
  coveragePercent: false,
  exportFields: ['Barcode', 'top', 'left', 'width', 'height'],
  labelScrolling: labelScrollOptions.vertical,
  missionHistoryDays: 14, // Number of days to display missions for
  permissions: ['topStock', 'QA', 'sectionLabels', 'sectionBreaks', 'misreadBarcodes'],
  productGridFields: ['Barcode', 'Price'],
  onHand: true,
  showExportButtons: false, // Hides: Request Data, Aisle Scan Data, Mission Export, Aisle Export (besides pano)
  showMisreadBarcodes: false, // Hides misread barcodes button on pano view
  showSectionBreaks: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
