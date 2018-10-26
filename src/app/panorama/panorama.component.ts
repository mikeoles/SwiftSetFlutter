import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss']
})
export class PanoramaComponent implements OnInit {
  @Input() outs: Observable<any[]>;

  constructor() { }

  ngOnInit() {
    console.log(this.outs);
  }
}
