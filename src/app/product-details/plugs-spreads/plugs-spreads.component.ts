import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-plugs-spreads',
  templateUrl: './plugs-spreads.component.html',
  styleUrls: ['./plugs-spreads.component.scss','../grid-styles.scss']
})

export class PlugsSpreadsComponent implements OnInit {

    @Output() plugsGridClicked = new EventEmitter();
    @Input() selectedIndex: number;
    selectedRow : number;
    spreads: any[];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getLabels().subscribe(spreads => this.spreads = spreads);
  }

  ngOnChanges(changes) {
    if(this.selectedIndex){
      this.selectedRow = this.selectedIndex;
    }
  }

  setClickedRow(index){
    this.selectedRow = index;
    this.plugsGridClicked.emit(index);
  }

}