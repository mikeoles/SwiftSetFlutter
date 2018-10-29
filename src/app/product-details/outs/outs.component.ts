import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.scss','../grid-styles.scss']
})
export class OutsComponent implements OnInit {

  @Output() outsGridClicked = new EventEmitter();
  @Input() selectedIndex: number;
  selectedRow : number;
  outs: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getOuts().subscribe(outs => this.outs = outs);
  }

  ngOnChanges(changes) {
    if(this.selectedIndex){
      this.selectedRow = this.selectedIndex;
    }
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.outsGridClicked.emit(index);
  }

}
