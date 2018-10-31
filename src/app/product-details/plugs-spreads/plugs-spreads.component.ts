import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-plugs-spreads',
  templateUrl: './plugs-spreads.component.html',
  styleUrls: ['./plugs-spreads.component.scss','../grid-styles.scss']
})

export class PlugsSpreadsComponent implements OnInit {

    @Output() plugsGridClicked = new EventEmitter();
    @Input() selectedId: number;
    selectedRow : number;
    plugs: any[];

  constructor(private apiService: ApiService) {
    this.apiService.getLabels().subscribe(plugs => this.plugs = plugs);

  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(this.selectedId){
      this.setClickedRow(this.selectedId);
    }
  }

  setClickedRow(id){
    let i: number;
    this.selectedRow = -1;
    for(i=0; i<this.plugs.length;i++){
      if(this.plugs[i].Id==id){
        this.selectedRow = i;
      }
    }
    this.plugsGridClicked.emit(id);
  }

}