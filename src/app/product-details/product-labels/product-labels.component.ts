import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-labels',
  templateUrl: './product-labels.component.html',
  styleUrls: ['./product-labels.component.scss','../table-styles.scss']
})
export class ProductLabelsComponent implements OnInit {

  selectedRow : Number;
  aboveSelectedRow: Number;

  data = [
    {
        "Id": 1,
        "MissionId": "044429UTC",
        "StoreId": "1851",
        "AisleId": "AA.7",
        "LabelType": "PRODUCT",
        "Barcode": "681131972147",
        "Zone": "AA",
        "Aisle": "7",
        "Section": null,
        "X1": 0.07676457614,
        "Z1": 2.054120779,
        "X2": 0.07676457614,
        "Z2": 2.054120779
    },
    {
        "Id": 2,
        "MissionId": "044429UTC",
        "StoreId": "1851",
        "AisleId": "AA.7",
        "LabelType": "PRODUCT",
        "Barcode": "681131972147",
        "Zone": "AA",
        "Aisle": "7",
        "Section": null,
        "X1": 0.08110443503,
        "Z1": 2.060744286,
        "X2": 0.08110443503,
        "Z2": 2.060744286
    },
    {
        "Id": 3,
        "MissionId": "044429UTC",
        "StoreId": "1851",
        "AisleId": "AA.7",
        "LabelType": "PRODUCT",
        "Barcode": "681131026420",
        "Zone": "AA",
        "Aisle": "7",
        "Section": null,
        "X1": 0.3073472083,
        "Z1": 2.074207783,
        "X2": 0.3073472083,
        "Z2": 2.074207783
    },
    {
        "Id": 4,
        "MissionId": "044429UTC",
        "StoreId": "1851",
        "AisleId": "AA.7",
        "LabelType": "PRODUCT",
        "Barcode": "337000018736",
        "Zone": "AA",
        "Aisle": "7",
        "Section": null,
        "X1": 0.1732911766,
        "Z1": 2.164726973,
        "X2": 0.1732911766,
        "Z2": 2.164726973
    },
    {
        "Id": 5,
        "MissionId": "044429UTC",
        "StoreId": "1851",
        "AisleId": "AA.7",
        "LabelType": "PRODUCT",
        "Barcode": "681131026420",
        "Zone": "AA",
        "Aisle": "7",
        "Section": null,
        "X1": 0.2867245674,
        "Z1": 2.18255353,
        "X2": 0.2867245674,
        "Z2": 2.18255353
    }
]

  constructor() {}

  ngOnInit() {
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.aboveSelectedRow = index-1;
  }

}
