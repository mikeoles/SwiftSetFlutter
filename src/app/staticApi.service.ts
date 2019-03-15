import { Injectable } from '@angular/core';
import { IApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Store from './store.model';
import { map } from 'rxjs/internal/operators/map';
import DaySummary from './daySummary.model';

@Injectable({
  providedIn: 'root'
})
export class StaticApiService implements IApiService {

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http.get('../assets/stores.json').pipe(
      map<any, Store[]>(o => o.Stores.map(s => this.createSimpleStore(s))),
    );
  }

  createSimpleStore(store: any): Store {
    return {
      storeId: store.storeId,
      storeName: store.storeName,
      storeAddress: store.storeAddress,
      totalAverageOuts: 0,
      totalAverageLabels: 0,
      totalAverageSpreads: 0,
      summaryOuts: [],
      summaryLabels: [],
      summarySpreads: [],
    };
  }


  createStore(store: any, startDate: Date, timezone: String): Store {
    const endDate: Date = new Date(startDate.toString());
    endDate.setDate(endDate.getDate() + 14);
    store.Missions.sort(missionDateSort);

    const outsSummaries: DaySummary[] = [], labelsSummaries: DaySummary[] = [], spreadsSummaries: DaySummary[] = [];
    let lastMission = null, curLabelCount = 0, curOutCount = 0, missionCount = 0, lastDate: Date = null,
      daysAdded = 0, totalOuts = 0, totalLabels = 0;

    for (let i = 0; i < store.Missions.length; i++) {
      const missionDate: Date = new Date(store.Missions[i].missionDateTime);
      if (missionDate >= startDate && missionDate < endDate) {
        if (lastMission === null) {
          lastMission = store.Missions[i];
        } else {
          lastDate = new Date(lastMission.missionDateTime);
          missionCount++;
          curLabelCount += lastMission.labels;
          curOutCount += lastMission.outs;
          if (lastDate.toDateString() !== missionDate.toDateString()) {
            daysAdded++;
            totalLabels += curLabelCount / missionCount;
            totalOuts += curOutCount / missionCount;
            labelsSummaries.push({
              date: lastDate,
              dailyAverage: curLabelCount / missionCount
            });
            outsSummaries.push({
              date: lastDate,
              dailyAverage: curOutCount / missionCount
            });
            missionCount = 0;
            curLabelCount = 0;
            curOutCount = 0;
          }
          lastMission = store.Missions[i];
        }
      }
    }

    lastDate = new Date(lastMission.missionDateTime);
    missionCount++;
    curLabelCount += lastMission.labels;
    curOutCount += lastMission.outs;
    daysAdded++;
    totalLabels += curLabelCount / missionCount;
    totalOuts += curOutCount / missionCount;
    labelsSummaries.push({
      date: lastDate,
      dailyAverage: curLabelCount / missionCount
    });
    outsSummaries.push({
      date: lastDate,
      dailyAverage: curOutCount / missionCount
    });

    return {
      storeId: store.storeId,
      storeName: store.storeName,
      storeAddress: store.storeAddress,
      totalAverageOuts: totalOuts / daysAdded,
      totalAverageLabels: totalLabels / daysAdded,
      totalAverageSpreads: 0,
      summaryOuts: outsSummaries,
      summaryLabels: labelsSummaries,
      summarySpreads: spreadsSummaries,
    };

    function missionDateSort(a, b) {
      if (a.missionDateTime < b.missionDateTime) {
        return -1;
      } else if (a.last_nom > b.last_nom) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  getStore(storeId: number, startDate: Date, timezone: String): Observable<Store> {
      return this.http.get('../assets/Store-' + storeId + '/index.json').pipe(
        map<any, Store>(s => this.createStore(s, startDate, timezone)),
      );
    }

  getMissionSummaries(date: Date, storeId: number, timezone: string): Observable<any> {
    return of('');
  }

  getMissionSummary(storeId: number, mission: number): Observable<any> {
    return of('');
  }

  getMissions(storeId: number): Observable<any> {
    return of('');
  }

  getMission(storeId: number, missionId: number): Observable<any> {
    return of('');
  }

  getAisles(storeId: number, missionId: number): Observable<any> {
    return of('');

  }

  getAisle(storeId: number, missionId: number, aisleId: number): Observable<any> {
    return of('');

  }
}
