import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aisles-grid',
  templateUrl: './aisles-grid.component.html',
  styleUrls: ['./aisles-grid.component.scss']
})
export class AislesGridComponent implements OnInit {

  @Input() aisles: any[];
  @Input() missionId: number;

  constructor( private router: Router) {}

  ngOnInit() {
  }

  viewAisle(aisleId: string) {
    this.router.navigate(['mission/' + this.missionId + '/aisle/' + aisleId]);
  }

}
