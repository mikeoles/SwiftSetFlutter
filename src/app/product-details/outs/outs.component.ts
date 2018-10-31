import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.scss','../grid-styles.scss']
})
export class OutsComponent implements OnInit {

  @Output() outsGridClicked = new EventEmitter();
  @Input() selectedId: number;
  selectedRow : number;
  outs: any[];

  constructor(private apiService: ApiService) {
    this.apiService.getOuts().subscribe(outs => this.outs = outs);
  }

  ngOnInit() {}

  ngOnChanges(changes) {
    if(this.selectedId){
      this.setClickedRow(this.selectedId);
    }
  }

  setClickedRow(id){
    let i: number;
    this.selectedRow = -1;
    for(i=0; i<this.outs.length;i++){
      if(this.outs[i].Id==id){
        this.selectedRow = i;
      }
    }
    this.outsGridClicked.emit(id);
  }

}
