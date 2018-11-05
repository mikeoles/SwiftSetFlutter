import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-plugs-spreads',
  templateUrl: './plugs-spreads.component.html',
  styleUrls: ['./plugs-spreads.component.scss','../grid-styles.scss']
})

export class PlugsSpreadsComponent implements OnInit {

  @Output() plugsGridClicked = new EventEmitter();
  @Input() plugs: any[];
  @Input() selectedId: number;

  ngOnInit() {
  }

  setClickedRow(id) {
    this.plugsGridClicked.emit(id);
  }
}