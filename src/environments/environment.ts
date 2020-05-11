import { labelScrollOptions } from 'src/app/aisle-view/product-details/product-grid/labelScrollOptions';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auditReportUrl: '',
  apiUrl: 'http://localhost/api',
  authUrl: 'http://localhost/dex/auth?',
  authClientId: 'data-products-viewer',
  classificationColors: ['peg:#0000FF', 'top:#FFFF00' , 'shelf:#FF0000'],
  coverageIssueDateSpan: 3,
  detectionTypeColors: ['label:#00FF00' , 'product:#00FFFF'],
  exportFields: ['Barcode', 'top', 'left', 'width', 'height'],
  labelScrolling: labelScrollOptions.vertical,
  missionHistoryDays: 14, // Number of days to display missions for
  permissions: ['topStock', 'QA', 'sectionLabels', 'sectionBreaks', 'misreadBarcodes'],
  productGridFields: ['Barcode', 'Price'],
  onHand: true,
  showDebugButton: true,
  showExportButtons: false, // Hides: Request Data, Aisle Scan Data, Mission Export, Aisle Export (besides pano)
  showMisreadBarcodes: true,
  showSectionBreaks: true,
  showSectionLabels: true,
  showTopStock: true,
  tagColors: ['outOfStock:#FFFFFF' , 'special:#FF00FF'],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
