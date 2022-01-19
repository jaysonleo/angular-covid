import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidService {
  getCurrentDataUrl = 'https://api.coronatracker.com/v3/stats/worldometer/country?countryCode=PH'
  constructor(private http: HttpClient) { }

  async getCurrentDataService() {
    let jsonData;
    await this.http.get(this.getCurrentDataUrl)
    .toPromise()
    .then(data => jsonData = data[0]);
    return jsonData;
  }

  getLineGraphDataService() {
    let beforeDate = new Date(Date.now() - 12096e5).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    let todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');

    let startDate = beforeDate[2] + "-" + beforeDate[0] + "-" + beforeDate[1];
    let endDate = todayDate[2] + "-" + todayDate[0] + "-" + todayDate[1];

    return this.http.get<any[]>('https://api.coronatracker.com/v5/analytics/trend/country?countryCode=PH&startDate='+ startDate +'&endDate=' + endDate)
  }                              

  getBarGraphDataService() {
    let beforeDate = new Date(Date.now() - 12096e5).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    let todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');

    let startDate = beforeDate[2] + "-" + beforeDate[0] + "-" + beforeDate[1];
    let endDate = todayDate[2] + "-" + todayDate[0] + "-" + todayDate[1];

    return this.http.get<any[]>('https://api.coronatracker.com/v5/analytics/newcases/country?countryCode=PH&startDate='+ startDate +'&endDate=' + endDate)
  }

  getNewsDataService() {
    return this.http.get<any[]>('https://api.coronatracker.com/news/trending?limit=10&offset=0&countryCode=PH&country=Philippines&language=en');
  }
}
