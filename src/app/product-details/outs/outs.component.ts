import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.scss','../table-styles.scss']
})
export class OutsComponent implements OnInit {

  @Output() productClicked = new EventEmitter();
  selectedRow : Number;
  aboveSelectedRow: Number;
  outs: any[];


  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getOuts().subscribe(outs => this.outs = outs);
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.aboveSelectedRow = index-1;
    this.productClicked.emit(index);
  }

}
