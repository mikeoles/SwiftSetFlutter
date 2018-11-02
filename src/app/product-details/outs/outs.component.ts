import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.scss', '../grid-styles.scss']
})
export class OutsComponent implements OnInit {

  @Output() outsGridClicked = new EventEmitter();
  @Input() outs: any[];
  @Input() selectedId: number;

  ngOnInit() {}

  setClickedRow(id) {
    this.outsGridClicked.emit(id);
  }
}
