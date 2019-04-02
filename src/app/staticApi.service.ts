import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Store from './store.model';
import { map } from 'rxjs/internal/operators/map';
import DaySummary from './daySummary.model';
import MissionSummary from './missionSummary.model';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import CustomField from './customField.model';

@Injectable({
  providedIn: 'root'
})
export class StaticApiService implements ApiService {

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http.get('../data/stores.json').pipe(
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

  createStore(store: any, startDate: Date): Store {
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

    if (lastDate != null) {
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
    }

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
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, Store>(storeJson => this.createStore(storeJson, startDate)),
    );
  }

  getMissionSummaries(date: Date, storeId: number, timezone: string): Observable<MissionSummary[]> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, MissionSummary[]>(storeJson => this.createMissionSummaries(storeJson, date)),
    );
  }

  createMissionSummaries(store: any, date: Date): MissionSummary[] {
    const summaries: MissionSummary[] = [];
    for (let i = 0; i < store.Missions.length; i++) {
      summaries.push({
        missionId: store.Missions[i].missionId,
        mission: store.Missions[i].mission,
        storeId: store.storeId,
        missionDateTime: new Date(store.Missions[i].missionDateTime),
        outs: store.Missions[i].outs,
        labels: store.Missions[i].labels,
        spreads: 0,
        aislesScanned: store.Missions[i].coveragePercent
      });
    }
    return summaries;
  }

  getMissionSummary(storeId: number, mission: number): Observable<MissionSummary> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, MissionSummary>(storeJson => this.createMissionSummary(storeJson, mission)),
    );
  }

  createMissionSummary(store: any, missionId: number): MissionSummary {
    for (let i = 0; i < store.Missions.length; i++) {
      if (store.Missions[i].missionId === missionId) {
        return {
          missionId: store.Missions[i].missionId,
          mission: store.Missions[i].mission,
          storeId: store.storeId,
          missionDateTime: new Date(store.Missions[i].missionDateTime),
          outs: store.Missions[i].outs,
          labels: store.Missions[i].labels,
          spreads: 0,
          aislesScanned: store.Missions[i].coveragePercent
        };
      }
    }
  }

  getMissions(storeId: number): Observable<Mission[]> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, Mission[]>(o => o.Missions.map(m => this.createMission(m, storeId))),
    );
  }

  getMission(storeId: number, missionId: number): Observable<Mission> {
    return this.http.get('../data/Store-' + storeId + '/Mission-' + missionId + '/mission.json').pipe(
      map<any, Mission>(missionJson => this.createMission(missionJson, storeId)),
    );
  }

  createMission(mission: any, storeId: number): Mission {
    return {
      missionId: mission.missionId,
      missionName: mission.missionName,
      storeId: storeId,
      missionDateTime: new Date(mission.missionDateTime),
      createDateTime: new Date(mission.createDateTime)
    };
  }

  getAisles(storeId: number, missionId: number): Observable<Aisle[]> {
    return this.http.get('../data/Store-' + storeId + '/Mission-' + missionId + '/mission.json').pipe(
      map<any, Aisle[]>(o => o.Aisles.map(a => this.createAisle(a, storeId, missionId))),
    );
  }

  getAisle(storeId: number, missionId: number, aisleId: number): Observable<any> {
    return this.http.get('../data/Store-' + storeId + '/Mission-' + missionId + '/Aisle-' + aisleId + '/aisle.json').pipe(
      map<any, Aisle>(aisleJson => this.createAisle(aisleJson, storeId, missionId)),
    );
  }

  createAisle(aisle: any, storeId: number, missionId: number): Aisle {
    return {
      aisleId: aisle.aisleId,
      aisleName: aisle.aisleName,
      panoramaUrl: '../data/Store-' + storeId + '/Mission-' + missionId + '/Aisle-' + aisle.aisleId + '/pano.jpg',
      zone: aisle.zone,
      labels: (aisle.labels || []).map(l => this.createLabel(l)),
      outs: (aisle.outs || []).map(l => this.createLabel(l)),
      spreads: [],
      coveragePercent: aisle.coveragePercent
    };
  }

  createLabel(label: any): Label {
    return {
      labelId: label.labelId,
      labelName: label.labelName,
      barcode: label.barcode,
      productId: label.productId,
      price: label.price,
      department: label.department,
      bounds: {
        top: label.top,
        left: label.left,
        width: label.width,
        height: label.height,
        topMeters: label.topMeters,
        leftMeters: label.leftMeters,
        widthMeters: label.widthMeters,
        heightMeters: label.heightMeters,
      },
      section: label.section,
      customFields: (label.customFields || []).map(cf => this.createCustomField(cf)),
    };
  }

  createCustomField(customField: any): CustomField {
    return{
      name: customField.name,
      value: customField.field
    };
  }
}