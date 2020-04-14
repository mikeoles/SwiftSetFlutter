import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EnvironmentService } from 'src/app/services/environment.service';

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
  displayedDays = 0;
  max = 0;

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
          max : 100,
        },
      }],
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItems) {
          return tooltipItems.yLabel;
        },
        title: function(tooltipItems) {
          return '';
        },
      },
    }
  };
  public barChartData: Array<Array<number>> = [];
  public mainColor = [{ backgroundColor: '#2baae1' }];
  public selectedColor = [{ backgroundColor: '#FFD54A' }];


  constructor(private environment: EnvironmentService) { }

  ngOnInit() {
    this.barChartOptions.scales.yAxes = [{
      display: false,
      ticks: {
        beginAtZero: true,
        max : this.max,
      },
    }];
    this.displayedDays = this.environment.config.missionHistoryLength;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentIndex']) {
      if (this.currentIndex) {
        this.todaysAverage = this.data[this.currentIndex].dailyAverage;
      } else {
        this.todaysAverage = null;
      }
    }
    if (changes['data']) {
      this.barChartData = [];
      this.max = 0;
      this.data.forEach((data: any) => {
        this.max = data.dailyAverage > this.max ? data.dailyAverage : this.max;
      });
      this.barChartOptions.scales.yAxes = [{
        display: false,
        ticks: {
          beginAtZero: true,
          max : this.max,
        },
      }];
      for (let i = 0; i < this.data.length; i++) {
        this.barChartData.push([this.data[i].dailyAverage]);
      }
    }
  }

  public chartClicked(e: any): void {
    const index = Number(e.event.currentTarget.id);
    this.selectedIndex.emit({index: index, date: this.data[index].date});
  }

}
