import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import { Observable } from 'rxjs';
import MissionSummary from './missionSummary.model';
import Store from './store.model';
import { formatDate } from '@angular/common';
import DaySummary from './daySummary.model';
import CustomField from './customField.model';
import { ApiService } from './api.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ODataApiService implements ApiService {
  apiUrl: String;
  showCoverageAsPercent = false;

  constructor(private http: HttpClient, private environment: EnvironmentService) {
    this.apiUrl = environment.config.apiUrl;
    this.showCoverageAsPercent = environment.config.showCoverageAsPercent;
  }

  createAisle(aisle: any): Aisle {
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
      aisleName: aisle.name,
      panoramaUrl: aisle.panoramaUrl,
      createDateTime: aisle.createDate,
      labelsCount: aisle.labelsCount,
      labels: (aisle.labels || []).map(l => this.createLabel(l)),
      outsCount: aisle.outsCount,
      outs: (aisle.outs || []).map(l => this.createLabel(l)),
      coveragePercent: aisle.coveragePercent,
      aisleCoverage: aisleCoverage,
    };
  }

  createLabel(label: any): Label {
    const customFields = [];
    Object.entries(label.custom_fields).forEach(
      ([key, value]) => {
        const customField = {
          name: key,
          value: value
        };
        customFields.push(customField);
      }
    );

    return {
      labelId: 0,
      labelName: label.labelName || 'Missing Product Data',
      barcode: label.barcode || '000000000000',
      productId: label.productId || '000000',
      price: label.price || 0.0,
      department: '',
      onHand: label.onHand,
      bounds: {
        top: label.bounds.top,
        left: label.bounds.left,
        width: label.bounds.width,
        height: label.bounds.height,
      },
      section: label.section,
      customFields: (customFields || []).map(cf => this.createCustomField(cf)),
    };
  }

  createCustomField(customField: any): CustomField {
    return{
      name: customField.name,
      value: customField.value
    };
  }

  createMission(mission: any): Mission {
    return {
      missionId: mission.Id,
      missionName: mission.Mission,
      storeId: mission.StoreId,
      missionDateTime: new Date(mission.MissionDate),
      createDateTime: new Date(mission.CreateDate),
    };
  }

  createMissionSummary(missionSummary: any): MissionSummary {
    return {
      missionId: missionSummary.MissionId,
      mission: missionSummary.Mission,
      storeId: missionSummary.StoreId,
      missionDateTime: new Date(missionSummary.MissionDateTime),
      outs: missionSummary.Outs,
      labels: missionSummary.Labels,
      aislesScanned: missionSummary.AislesScanned,
      percentageRead: missionSummary.PercentageReadLabels,
      percentageUnread: missionSummary.PercentageUnreadLabels,
      unreadLabels: missionSummary.UnreadLabels,
      readLabelsMatchingProduct: missionSummary.ReadLabelsMatchingProduct,
      readLabelsMissingProduct: missionSummary.ReadLabelsMissingProduct
    };
  }

  createSingleStore(store: any): Store {
    return {
      storeId: store.value[0].id,
      storeNumber: store.value[0].number,
      storeName: store.value[0].name,
      storeAddress: store.value[0].address,
      totalAverageOuts: store.value[0].TotalAverageOuts,
      totalAverageLabels: store.value[0].TotalAverageLabels,
      summaryOuts: (store.value[0].SummaryOuts || []).map(o => this.createDaySummary(o)),
      summaryLabels: (store.value[0].SummaryLabels || []).map(l => this.createDaySummary(l)),
    };
  }

  createStore(store: any): Store {
    return {
      storeId: store.id,
      storeNumber: store.number,
      storeName: store.name,
      storeAddress: store.address,
      totalAverageOuts: store.TotalAverageOuts,
      totalAverageLabels: store.TotalAverageLabels,
      summaryOuts: (store.SummaryOuts || []).map(o => this.createDaySummary(o)),
      summaryLabels: (store.SummaryLabels || []).map(l => this.createDaySummary(l)),
    };
  }

  createDaySummary(daySummary: any): DaySummary {
    return {
      date: daySummary.Date,
      dailyAverage: daySummary.DailyAverage
    };
  }

  getStores(): Observable<Store[]> {
    return this.http.get('../assets/mock/stores.json').pipe(map<any, Store[]>(o => o.map(s => this.createStore(s))), );
  }

  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`../assets/mock/store.json`)
    .pipe(
      map<any, Store>(m => this.createSingleStore(m)),
    );
  }

  getMissionSummaries(date: Date, storeId: string, timezone: string): Observable<MissionSummary[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.apiUrl}/DemoService/MissionSummaries?$filter=MissionDate eq ${formatDate(date, 'yyyy-MM-dd', 'en-US')} and StoreId eq '${storeId}' and TimeZone eq '${timezone}'`)
      .pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#MissionSummaries",
      //   "value": [
      //     {
      //        "Mission": "044429UTC",
      //        "StoreId": "1851"
      //        "MissionDate": 2018-11-10T01:00:04-05:00,
      //        "Outs": 60,
      //        "Labels": 725,
      //        "AislesScanned": 50
      //     }
      //   ]
      // }

      // Map the result to an array of MissionSummary objects
      map<any, MissionSummary[]>(o => o.value.map(m => this.createMissionSummary(m))),
    );
  }

  getRangeMissionSummaries(startDate: Date, endDate: Date, storeId: string, timezone: string): Observable<MissionSummary[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.apiUrl}/DemoService/MissionSummaries?$filter=MissionDate eq ${formatDate(startDate, 'yyyy-MM-dd', 'en-US')} and StoreId eq '${storeId}' and TimeZone eq '${timezone}' and EndDate eq ${formatDate(endDate, 'yyyy-MM-dd', 'en-US')}`)
      .pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#MissionSummaries",
      //   "value": [
      //     {
      //        "Mission": "044429UTC",
      //        "StoreId": "1851"
      //        "MissionDate": 2018-11-10T01:00:04-05:00,
      //        "Outs": 60,
      //        "Labels": 725,
      //        "AislesScanned": 50
      //     }
      //   ]
      // }

      // Map the result to an array of MissionSummary objects
      map<any, MissionSummary[]>(o => o.value.map(m => this.createMissionSummary(m))),
    );
  }

  getRangeAisles(startDate: Date, endDate: Date, storeId: string, timezone: string): Observable<Aisle[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.apiUrl}/DemoService/Panos?$filter=StartDate eq ${formatDate(startDate, 'yyyy-MM-dd', 'en-US')} and StoreId eq '${storeId}' and TimeZone eq '${timezone}' and EndDate eq ${formatDate(endDate, 'yyyy-MM-dd', 'en-US')}`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Panos",
      //   "value": [
      //     {
      //       "Id": 4,
      //       "Zone": "AA",
      //       "Aisle": "3",
      //       "FilePath": "165839UTC/AA/3/AA03_color_panorama.jpg",
      //       "CreateDate": "2018-11-09T02:10:25Z"
      //     }
      //   ]
      // }

      // Map the result to an array of Aisle objects
      map<any, Aisle[]>(o => o.value.map(a => this.createAisle(a))),

      // Sort by name
      map(aisles => aisles.sort((a, b) => a.aisleName.localeCompare(b.aisleName))),
    );
  }

  getMissionSummary(storeId: string, mission: number): Observable<MissionSummary> {
    return this.http.get(`${this.apiUrl}/DemoService/MissionSummaries(${mission})`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#MissionSummaries",
      //   "value": [
      //     {
      //        "Mission": "044429UTC",
      //        "StoreId": "1851"
      //        "MissionDate": 2018-11-10T01:00:04-05:00,
      //        "Outs": 60,
      //        "Labels": 725,
      //        "AislesScanned": 50
      //     }
      //   ]
      // }

      // Map the result to an MissionSummary object
      map<any, MissionSummary>(a => this.createMissionSummary(a)),
    );
  }

  getMissions(storeId: string): Observable<Mission[]> {
    return this.http.get(`${this.apiUrl}/DemoService/Missions`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Missions",
      //   "value": [
      //     {
            // "Id": 1,
            // "StoreId": "1851",
            // "Mission": "044429UTC",
            // "MissionDate": "2018-11-09T02:10:25Z",
            // "CreateDate": "2018-11-09T02:10:25Z"
      //     }
      //   ]
      // }

      // Map the result to an array of Mission objects
      map<any, Mission[]>(o => o.value.map(m => this.createMission(m))),

      // Sort by create date time
      map(missions => missions.sort((a, b) => (b.createDateTime.getTime() - a.createDateTime.getTime()))),
    );
  }

  getMission(storeId: string, missionId: number): Observable<Mission> {
    return this.http.get(`${this.apiUrl}/DemoService/Missions(${missionId})`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Missions",
      //   "value":
      //     {
      //       "Id": 1,
      //       "StoreId": "1851",
      //       "Mission": "044429UTC",
      //       "MissionDate": "2018-11-09T02:10:25Z",
      //       "CreateDate": "2018-11-09T02:10:25Z"
      //     }
      // }

      // Map the result to a Mission object
      map<any, Mission>(m => this.createMission(m)),
    );
  }

  getAisles(storeId: string, missionId: number): Observable<Aisle[]> {
    return this.http.get(`${this.apiUrl}/DemoService/Missions(${missionId})/Panos`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Panos",
      //   "value": [
      //     {
      //       "Id": 4,
      //       "Zone": "AA",
      //       "Aisle": "3",
      //       "FilePath": "165839UTC/AA/3/AA03_color_panorama.jpg",
      //       "CreateDate": "2018-11-09T02:10:25Z"
      //     }
      //   ]
      // }

      // Map the result to an array of Aisle objects
      map<any, Aisle[]>(o => o.value.map(a => this.createAisle(a))),

      // Sort by name
      map(aisles => aisles.sort((a, b) => a.aisleName.localeCompare(b.aisleName))),
    );
  }

  getAisle(storeId: string, missionId: number, aisleId: number): Observable<Aisle> {
    return this.http.get(`../assets/mock/aisle.json`).pipe(
      // Map the result to an Aisle object
      map<any, Aisle>(a => this.createAisle(a)),
    );
  }
}
