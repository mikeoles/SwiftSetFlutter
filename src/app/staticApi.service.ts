import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Store from './store.model';
import { map } from 'rxjs/internal/operators/map';
import DaySummary from './daySummary.model';
import MissionSummary from './missionSummary.model';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import CustomField from './customField.model';
import { switchMap } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class StaticApiService implements ApiService {

  showCoverageAsPercent = false;

  constructor(private http: HttpClient, private environment: EnvironmentService) {
    this.showCoverageAsPercent = environment.config.showCoverageAsPercent;
  }

  getStores(): Observable<Store[]> {
    return this.http.get('../data/stores.json').pipe(
      map<any, Store[]>(o => o.Stores.map(s => this.createSimpleStore(s))),
    );
  }

  createSimpleStore(store: any): Store {
    return {
      storeId: store.id,
      storeNumber: store.number,
      storeName: store.name,
      storeAddress: store.address,
      totalAverageOuts: 0,
      totalAverageLabels: 0,
      summaryOuts: [],
      summaryLabels: [],
    };
  }

  createStore(store: any, startDate: Date): Store {
    const endDate: Date = new Date(startDate.toString());
    endDate.setDate(endDate.getDate() + 14);
    store.Missions.sort(missionDateSort);

    const outsSummaries: DaySummary[] = [], labelsSummaries: DaySummary[] = [];
    let lastMission = null, curLabelCount = 0, curOutCount = 0, missionCount = 0, lastDate: Date = null,
      daysAdded = 0, totalOuts = 0, totalLabels = 0;

    for (let i = 0; i < store.Missions.length; i++) {
      const missionDate: Date = new Date(store.Missions[i].missionDateTime);
      if (missionDate >= startDate && missionDate < endDate) {
        if (lastMission === null) {
          lastMission = store.Missions[i];
          lastDate = new Date(lastMission.missionDateTime);
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
      storeId: store.id,
      storeNumber: store.number,
      storeName: store.name,
      storeAddress: store.address,
      totalAverageOuts: totalOuts / daysAdded,
      totalAverageLabels: totalLabels / daysAdded,
      summaryOuts: outsSummaries,
      summaryLabels: labelsSummaries,
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

  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, Store>(storeJson => this.createStore(storeJson, startDate)),
    );
  }

  getMissionSummaries(date: Date, storeId: string, timezone: string): Observable<MissionSummary[]> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, MissionSummary[]>(storeJson => this.createMissionSummaries(storeJson, date)),
    );
  }

  createMissionSummaries(store: any, currentDay: Date): MissionSummary[] {
    const summaries: MissionSummary[] = [];
    for (let i = 0; i < store.Missions.length; i++) {
      const nextDay: Date = new Date(currentDay.toString());
      nextDay.setDate(nextDay.getDate() + 1);
      const missionDate: Date = new Date(store.Missions[i].missionDateTime);
        if (missionDate >= currentDay && missionDate < nextDay) {
        summaries.push({
          missionId: store.Missions[i].missionId,
          mission: store.Missions[i].mission,
          storeId: store.storeId,
          missionDateTime: new Date(store.Missions[i].missionDateTime),
          outs: store.Missions[i].outs,
          labels: store.Missions[i].labels,
          aislesScanned: store.Missions[i].aislesScanned,
          percentageRead: store.Missions[i].percentageRead,
          percentageUnread: store.Missions[i].percentageUnread,
          unreadLabels: store.Missions[i].unreadLabels || 0,
          readLabelsMatchingProduct: store.Missions[i].readLabelsMatchingProduct || 0,
          readLabelsMissingProduct: store.Missions[i].readLabelsMissingProduct || 0
        });
      }
    }
    return summaries;
  }

  createMissionSummariesRange(store: any, startDate: Date, endDate: Date): MissionSummary[] {
    const summaries: MissionSummary[] = [];
    for (let i = 0; i < store.Missions.length; i++) {
      const missionDate: Date = new Date(store.Missions[i].missionDateTime);
        if (missionDate >= startDate && missionDate <= endDate) {
        summaries.push({
          missionId: store.Missions[i].missionId,
          mission: store.Missions[i].mission,
          storeId: store.storeId,
          missionDateTime: new Date(store.Missions[i].missionDateTime),
          outs: store.Missions[i].outs,
          labels: store.Missions[i].labels,
          aislesScanned: store.Missions[i].aislesScanned,
          percentageRead: store.Missions[i].percentageRead,
          percentageUnread: store.Missions[i].percentageUnread,
          unreadLabels: store.Missions[i].unreadLabels || 0,
          readLabelsMatchingProduct: store.Missions[i].readLabelsMatchingProduct || 0,
          readLabelsMissingProduct: store.Missions[i].readLabelsMissingProduct || 0
        });
      }
    }
    return summaries;
  }

  getRangeMissionSummaries(startDate: Date, endDate: Date, storeId: string, timezone: string): Observable<MissionSummary[]> {
    const afterEndDate: Date = new Date();
    afterEndDate.setDate(endDate.getDate() + 1);
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, MissionSummary[]>(storeJson => this.createMissionSummariesRange(storeJson, startDate, afterEndDate)),
    );
  }

  getMissionSummary(storeId: string, mission: number): Observable<MissionSummary> {
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
          aislesScanned: store.Missions[i].aislesScanned,
          percentageRead: store.Missions[i].PercentageReadLabels,
          percentageUnread: store.Missions[i].PercentageUnreadLabels,
          unreadLabels: store.Missions[i].UnreadLabels,
          readLabelsMatchingProduct: store.Missions[i].ReadLabelsMatchingProduct,
          readLabelsMissingProduct: store.Missions[i].ReadLabelsMissingProduct
        };
      }
    }
  }

  getMissions(storeId: string): Observable<Mission[]> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, Mission[]>(o => o.Missions.map(m => this.createMission(m, storeId))),
    );
  }

  getMission(storeId: string, missionId: number): Observable<Mission> {
    return this.http.get('../data/Store-' + storeId + '/Mission-' + missionId + '/mission-' + missionId + '.json').pipe(
      map<any, Mission>(missionJson => this.createMission(missionJson, storeId)),
    );
  }

  createMission(mission: any, storeId: string): Mission {
    return {
      missionId: mission.missionId,
      missionName: mission.missionName,
      storeId: storeId,
      missionDateTime: new Date(mission.missionDateTime),
      createDateTime: new Date(mission.createDateTime)
    };
  }

  getAisles(storeId: string, missionId: number): Observable<Aisle[]> {
    return this.http.get('../data/Store-' + storeId + '/Mission-' + missionId + '/mission-' + missionId + '.json').pipe(
      map<any, Aisle[]>(o => o.Aisles.map(a => this.createAisle(a, storeId, missionId))),
      map(aisles => aisles.sort((a, b) => a.aisleName.localeCompare(b.aisleName))),
    );
  }

  getAisle(storeId: string, missionId: number, aisleId: number): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get('../data/Store-' + storeId + '/Mission-' + missionId + '/Aisle-' + aisleId + '/aisle-' + aisleId + '.json').pipe(
      map<any, Aisle>(aisleJson => this.createAisle(aisleJson, storeId, missionId)),
    );
  }

  createAisle(aisle: any, storeId: string, missionId: number): Aisle {
    let aisleCoverage = 'Low';
    if (aisle.coveragePercent >= 70) {
      aisleCoverage = 'High';
    } else if (aisle.coveragePercent >= 40) {
      aisleCoverage = 'Medium';
    }

    if (this.showCoverageAsPercent) {
      aisleCoverage = aisle.coveragePercent;
    }

    return {
      aisleId: aisle.aisleId,
      aisleName: aisle.aisleName,
      createDateTime: aisle.createDate,
      panoramaUrl: '../data/Store-' + storeId + '/' + aisle.panoramaUrl,
      labelsCount: aisle.labelsCount,
      labels: (aisle.labels || []).map(l => this.createLabel(l)),
      outsCount: aisle.outsCount,
      outs: (aisle.outs || []).map(l => this.createLabel(l)),
      coveragePercent: aisle.coveragePercent,
      aisleCoverage: aisleCoverage,
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
      onHand: label.onHand,
      bounds: {
        top: label.bounds.top,
        left: label.bounds.left,
        width: label.bounds.width,
        height: label.bounds.height,
      },
      section: label.section,
      customFields: (label.custom_fields || []).map(cf => this.createCustomField(cf)),
    };
  }

  createCustomField(customField: any): CustomField {
    return{
      name: customField.name,
      value: customField.field
    };
  }

  getRangeAisles(startDate: Date, endDate: Date, storeId: string, timezone: string): Observable<Aisle[]> {
    return this.http.get('../data/Store-' + storeId + '/index.json').pipe(
      map<any, MissionSummary[]>(storeJson => this.createMissionSummariesRange(storeJson, startDate, endDate)),
      map<MissionSummary[], Observable<any>[]>(missionSummaries =>
        missionSummaries.map(missionSummary =>
          this.http.get('../data/Store-' + storeId + '/Mission-' + missionSummary.missionId +
                        '/mission-' + missionSummary.missionId  + '.json').pipe(
            map<any, Aisle[]>(o => o.Aisles.map(a => this.createAisle(a, storeId, 0)))
          )
        )
      ),
      switchMap<Observable<any>[], Aisle[][]>(aisleRequests => forkJoin(aisleRequests)),
      map(as => [].concat.apply([], as))
    );
  }
}
