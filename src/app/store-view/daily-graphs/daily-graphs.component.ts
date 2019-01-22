import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-daily-graphs',
  templateUrl: './daily-graphs.component.html',
  styleUrls: ['./daily-graphs.component.scss']
})
export class DailyGraphsComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() title: string;
  @Input() overallAverage: number;
  @Output() selectedIndex = new EventEmitter();
  @Input() currentIndex: number;
  todaysAverage: number;
  displayedDays = 14;

  public barChartType: 'bar';
  public barChartLegend: false;
  public barChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        categoryPercentage: 1.0,
        barPercentage: 1.0,
      }],
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true,
          max : 1500,
        },
      }],
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItems) {
          return tooltipItems.yLabel;
        }
      }
    }
  };
  public barChartData: Array<Array<number>> = [];
  public mainColor = [{ backgroundColor: '#2baae1' }];
  public selectedColor = [{ backgroundColor: '#FFD54A' }];


  constructor() { }

  ngOnInit() {
    this.barChartData = this.data.map(d => [d.dailyAverage]);
  }

  ngOnChanges() {
    if (this.currentIndex) {
      this.todaysAverage = this.data[this.currentIndex].dailyAverage;
    } else {
      this.todaysAverage = null;
    }
  }

  public chartClicked(e: any): void {
    const index = Number(e.active[0]._chart.canvas.id);
    this.selectedIndex.emit({index: index, date: this.data[index].date});
  }

}
