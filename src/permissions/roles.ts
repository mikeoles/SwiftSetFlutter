import { Permissions } from './permissions';

export const Roles = {
  bossanova:
    [Permissions.topStock, Permissions.sectionLabels, Permissions.sectionBreaks, Permissions.QA, Permissions.misreadBarcodes],
  loblaws:
    [Permissions.topStock, Permissions.QA],
};
