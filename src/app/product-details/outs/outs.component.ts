import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.scss','../table-styles.scss']
})
export class OutsComponent implements OnInit {

  @Output() outsTableClicked = new EventEmitter();
  @Input() selectedIndex: Number;
  selectedRow : Number;
  aboveSelectedRow: Number;
  outs: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getOuts().subscribe(outs => this.outs = outs);
  }

  ngOnChanges(changes) {
    //update the current index when the user selects a row from one of the tables
    if(this.selectedIndex) this.selectedRow = this.selectedIndex;
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.aboveSelectedRow = index-1;
    this.outsTableClicked.emit(index);
  }

}
