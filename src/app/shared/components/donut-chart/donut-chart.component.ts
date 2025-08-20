import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from "../../../features/admin/chart/apex-chart/apex-chart.component";
import { DemandecommunicationService } from "../../../core/services/demandecommunication.service";

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {
  donutChart: Partial<ChartOptions> = {};
  @Input() expertId!: number;
  isEmpty: boolean = false;


  constructor(private demandecommunicationService: DemandecommunicationService) {
    // Initialize with placeholder structure
    this.donutChart = {
      chart: { type: 'donut', width: '100%', height: 250 },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          customScale: 0.9,
          donut: { size: '70%' },
          offsetY: 0
        },
      },
      colors: ['#00D8B6', '#008FFB', '#FEB019'],
      series: [0, 0, 0],
      labels: ['En attente', 'Acceptée', 'Refusée'],
      legend: { position: 'bottom' }
    };
  }

  ngOnInit(): void {
    if (this.expertId) {
      this.demandecommunicationService.getCountsDemande(this.expertId)
        .subscribe({
          next: (data) => {
            this.updateChart(data);
          },
          error: (err) => {
            console.error('Error loading status counts:', err);
            this.isEmpty = true;
            console.error(err);
          }
        });
    }
  }
// if no demande yet graph doesn't show
  private updateChart(data: any): void {
    const total =
      (data.EN_ATTENTE ?? 0) +
      (data.ACCEPTEE ?? 0) +
      (data.REFUSEE ?? 0);

    if (total === 0) {
      this.isEmpty = true;
    } else {
      this.isEmpty = false;
      this.donutChart = {
        ...this.donutChart,
        series: [
          data.EN_ATTENTE ?? 0,
          data.ACCEPTEE ?? 0,
          data.REFUSEE ?? 0
        ]
      };
    }
  }

}
