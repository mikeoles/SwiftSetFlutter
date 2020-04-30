import { labelScrollOptions } from 'src/app/aisle-view/product-details/product-grid/labelScrollOptions';

export const environment = {
  production: true,
  auditReportUrl: '',
  authUrl: 'http://localhost:5556/auth?',
  authClientId: 'example-app',
  exportFields: ['Barcode', 'top', 'left', 'width', 'height'],
  labelScrolling: labelScrollOptions.vertical,
  missionHistoryDays: 14, // Number of days to display missions for
  permissions: ['topStock', 'debugging', 'sectionLabels', 'sectionBreaks'],
  productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price'],
  onHand: true,
  showDebugButton: false,
  showExportButtons: false, // Hides: Request Data, Aisle Scan Data, Mission Export, Aisle Export (besides pano)
  showMisreadBarcodes: false,
  showSectionBreaks: false,
  showSectionLabels: false,
  showTopStock: false,
};
