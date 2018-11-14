import { Component, OnInit, Input } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-count-graph',
  templateUrl: './count-graph.component.html',
  styleUrls: ['./count-graph.component.scss']
})
export class CountGraphComponent implements OnInit {
  @Input() type: string;
  @Input() total: number;
  @Input() average: number;
  public barChartLabels: string[] = ['', '', '', '', '', '', '', ''];
  public barChartType: 'bar';
  public barChartLegend: false;
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        display: false,
        categoryPercentage: 1.0,
        barPercentage: 1.0,
      }],
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true
        },
        gridLines: { lineWidth: 5 },
      }],
    },
    animation: {
      onProgress: function () {
          const chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = 'white';
          ctx.font = '8px Arial';
          this.data.datasets.forEach(function (dataset, i) {
              const meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  const data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, 50);
              });
          });
      }
    }
  };
  public barChartData: any[] = [
    {data: [65, 59, 55, 81, 56, 55, 40, 99]},
  ];
  public colors = [{
    backgroundColor: '#467df3',
  }];

  constructor() { }

  ngOnInit() {
  }

}
