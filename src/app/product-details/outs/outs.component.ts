import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.scss','../table-styles.scss']
})
export class OutsComponent implements OnInit {

  @Output() productClicked = new EventEmitter();
  selectedRow : Number;
  aboveSelectedRow: Number;

  data = [
    {
        "Id": 1,
        "MissionId": "044429UTC",
        "ProductId": "554021648",
        "Zone": "AA",
        "Aisle": "7",
        "Section": "1",
        "X1": 3.011000156,
        "Z1": 1.477000117,
        "X2": 3.06400013,
        "Z2": 1.444000125
    },
    {
        "Id": 2,
        "MissionId": "044429UTC",
        "ProductId": "550376332",
        "Zone": "AA",
        "Aisle": "7",
        "Section": "1",
        "X1": 5.438400269,
        "Z1": 1.24699986,
        "X2": 5.495399952,
        "Z2": 1.213999867
    },
    {
        "Id": 3,
        "MissionId": "044429UTC",
        "ProductId": "552808986",
        "Zone": "AA",
        "Aisle": "7",
        "Section": "1",
        "X1": 6.454600334,
        "Z1": 1.250999808,
        "X2": 6.513600349,
        "Z2": 1.218999863
    },
    {
        "Id": 4,
        "MissionId": "044429UTC",
        "ProductId": "552131970",
        "Zone": "AA",
        "Aisle": "7",
        "Section": "1",
        "X1": 5.751399994,
        "Z1": 1.24699986,
        "X2": 5.812400341,
        "Z2": 1.216999888
    },
    {
        "Id": 5,
        "MissionId": "044429UTC",
        "ProductId": "293399",
        "Zone": "AA",
        "Aisle": "7",
        "Section": "1",
        "X1": 2.185800076,
        "Z1": 1.430999875,
        "X2": 2.239799976,
        "Z2": 1.400999784
    }
]

  constructor() {}

  ngOnInit() {}

  setClickedRow(index){
    this.selectedRow = index;
    this.aboveSelectedRow = index-1;
    this.productClicked.emit(index);
  }

}
