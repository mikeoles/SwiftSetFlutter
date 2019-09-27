import { labelScrollOptions } from 'src/app/labelScrollOptions';

export const environment = {
  production: true,
  coveragePercent: true,
  onHand: true,
  pdfExport: true,
  exportingPDF: true,
  exportFields: ['Barcode', 'Product Id', 'Description', 'Department', 'On Hand', 'Layout', 'S. Loc', 'Size', 'SRQ', 'PR', 'Status',
  'Last Recvd', 'DNO'],
  labelScrolling: labelScrollOptions.vertical,
  productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price', 'On Hand'],
  missionHistoryDays: 14, // Number of days to display missions for
  showTopStock: true,
  showSectionLabels: true,
  showSectionBreaks: true,
};
