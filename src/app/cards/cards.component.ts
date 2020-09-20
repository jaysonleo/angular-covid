import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Chart } from 'chart.js';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() deviceXs: Boolean;

  paddingVal;

  activeCount;

  totalConfirmedCount;
  totalRecoveredCount;
  totalDeceasedCount;
  totalCriticalCount;
  fatalityRateCount;
  recoveryRateCount;
  dailyConfirmedCount;
  dailyDeceasedCount;

  currDataJson;
  lastUpdate;

  dailyData;

  newsData = [];
  chart = [];
  bar = [];

  chartProgressBar = new Subject<boolean>();
  barProgressBar = new Subject<boolean>();
  constructor(private service: CovidService) {
    this.chartProgressBar.subscribe();
    this.barProgressBar.subscribe();
  }

  ngOnInit() {
    this.getLineGraphData();
    this.getBarGraphData();
    this.getCount();
    this.getDailyData();
    this.getLatestNewsData();
  }

  async getCount() {
    this.currDataJson = await this.service.getCurrentDataService();
    this.lastUpdate = this.formatDate(this.currDataJson.lastUpdated);

    this.activeCount = this.currDataJson.activeCases;
    this.totalCriticalCount = this.currDataJson.totalCritical;
    this.totalConfirmedCount = (this.currDataJson.totalConfirmed).toLocaleString('en');

    this.totalRecoveredCount = this.currDataJson.totalRecovered;
    this.recoveryRateCount = this.currDataJson.PR;

    this.fatalityRateCount = this.currDataJson.FR;
    this.totalDeceasedCount = this.currDataJson.totalDeaths;

    const activeCounter = document.getElementById('active-counter');
    // const totalConfirmedCounter = document.getElementById('totalConfirmed-counter');
    const totalRecoveredCount = document.getElementById('totalRecovered-counter');
    const totalDeceasedCount = document.getElementById('totalDeceased-counter');
    const totalCriticalCount = document.getElementById('totalCritical-counter');
    const fatalityRateCount = document.getElementById('fr-counter');
    const recoveryRateCount = document.getElementById('rr-counter');

    this.animateValue(activeCounter, 0, this.activeCount, 1000);
    // this.animateValue(totalConfirmedCounter, 0, this.totalConfirmedCount, 1000);
    this.animateValue(totalRecoveredCount, 0, this.totalRecoveredCount, 1000);
    this.animateValue(totalDeceasedCount, 0, this.totalDeceasedCount, 1000);
    this.animateValue(totalCriticalCount, 0, this.totalCriticalCount, 1000);

    this.animateValuePercentage(
      recoveryRateCount,
      0,
      this.recoveryRateCount,
      1000
    );
    this.animateValuePercentage(
      fatalityRateCount,
      0,
      this.fatalityRateCount,
      1000
    );
  }

  animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = this.numberWithCommas(
        Math.floor(progress * (end - start) + start)
      );

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  animateValuePercentage(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = this.numberWithCommasPercentage(progress * (end - start));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  numberWithCommasPercentage(x) {
    return (
      x
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '') + '%'
    );
  }

  formatDate(date) {
    let d = new Date(date);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  async getDailyData() {
    await this.service.getBarGraphDataService().subscribe(data => {
      this.dailyData = data[data.length -1];
      // const dailyInfectionsCount = document.getElementById('dailyInfections-counter');
      const dailyRecoveredCount = document.getElementById('dailyRecovered-counter');
      const dailyDeceasedCount = document.getElementById('dailyDeceased-counter');

      // this.animateValue(dailyInfectionsCount, 0, this.dailyData.new_infections, 1000);
      this.animateValue(dailyRecoveredCount, 0, this.dailyData.new_recovered, 1000);
      this.animateValue(dailyDeceasedCount, 0, this.dailyData.new_deaths, 1000);

    });
  }

  async getLatestNewsData() {
    let today = new Date();
    await this.service.getNewsDataService().subscribe((data) => {
      Object.values(data)[1].map(x => {
        let newsDate = '';
        if(today.getDate() - new Date(x.addedOn).getDate() === 1)
          newsDate = 'Yesterday'
        else if(today.getDate() - new Date(x.addedOn).getDate() === 0)
          newsDate = 'Today'
        else
          newsDate = today.getDate() - new Date(x.addedOn).getDate() + ' days ago'

        this.newsData.push({
          title: x.title,
          siteName: x.siteName,
          description: x.description,
          photoUrl: x.urlToImage,
          url: x.url,
          publishedDaysAgo:newsDate
        })
      });
    });
  }

  goToUrl(url) {
    window.open(url);
  }

  async getLineGraphData() {
    let deaths = [];
    let confirmed = [];
    let recovered = [];
    let date = [];
    await this.service.getLineGraphDataService().subscribe((data) => {
      data.forEach((e) => {
        deaths.push(e.total_deaths);
        confirmed.push(e.total_confirmed);
        recovered.push(e.total_recovered);
        date.push(new Date(e.last_updated).toLocaleDateString());
      });
      this.bar = new Chart('canvas', {
        type: 'line',
        data: {
          labels: date,
          datasets: [
            {
              label: 'Deceased Cases',
              data: deaths,
              borderColor: '#f81e00',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Recovered Cases',
              data: recovered,
              borderColor: '#0e8000',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Confirmed Cases',
              data: confirmed,
              borderColor: '#2c65c0',
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {},
        },
      });
      this.chartProgressBar.next(true);
    });
  }

  async getBarGraphData() {
    let deaths = [];
    let infections = [];
    let recovered = [];
    let date = [];
    await this.service.getBarGraphDataService().subscribe((data) => {
      data.forEach((e) => {
        deaths.push(e.new_deaths);
        infections.push(e.new_infections);
        recovered.push(e.new_recovered);
        date.push(new Date(e.last_updated).toLocaleDateString());
      });

      this.chart = new Chart('bar', {
        type: 'bar',
        data: {
          labels: date,
          datasets: [
            {
              label: 'Deceased Cases',
              data: deaths,
              borderColor: '#f81e00',
              borderWidth: 1,
              backgroundColor: '#f81e00',
              fill: true,
            },
            {
              label: 'Recovered Cases',
              data: recovered,
              borderColor: '#0e8000',
              borderWidth: 1,
              backgroundColor: '#0e8000',
              fill: true,
            },
            {
              label: 'Infections Cases',
              data: infections,
              borderColor: '#2c65c0',
              borderWidth: 1,
              backgroundColor: '#2c65c0',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                  beginAtZero: true,
                  min: 0
              }
          }]
          },
        },
      });
      this.barProgressBar.next(true);
    });
  }
}
