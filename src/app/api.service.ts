import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import { Observable } from 'rxjs';
import MissionSummary from './missionSummary.model';
import Store from './store.model';
import { formatDate } from '@angular/common';
import DaySummary from './daySummary.model';
import CustomField from './customField.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: String;

  constructor(private environment: EnvironmentService, private http: HttpClient) {
    this.apiUrl = environment.config.apiUrl;
  }

  createAisle(aisle: any): Aisle {
    return {
      aisleId: aisle.Id,
      aisleName: `${aisle.Zone}${aisle.Aisle}`,
      panoramaUrl: `${aisle.FilePath}`,
      zone: aisle.Zone,
      labels: (aisle.Labels || []).map(l => this.createLabel(l)),
      outs: (aisle.Outs || []).map(l => this.createLabel(l)),
      spreads: []
    };
  }

  createLabel(label: any): Label {
    let dept = '';
    for (let i = 0; i < label.Product.CustomFields.length; i++) {
      const field = label.Product.CustomFields[i];
      if (field['Name'] === 'Department') {
        dept = field['Value'];
      }
    }

    return {
      labelId: label.Id,
      labelName: label.Product.Description || 'Unknown Product Name',
      barcode: label.Product.Barcode || '000000000000',
      productId: label.Product.ItemId || '',
      price: label.Product.Price || 0,
      department: dept,
      bounds: {
        top: label.Z1 - 10,
        left: label.X1 - 10,
        width: label.X2 - label.X1,
        height: label.Z2 - label.Z1,
        topMeters: label.Z1M,
        leftMeters: label.X1M,
        widthMeters: label.X2M - label.X1M,
        heightMeters: label.Z2M - label.Z1M,
      },
      section: label.Section,
      customFields: (label.Product.CustomFields || []).map(cf => this.createCustomField(cf)),
    };
  }

  createCustomField(customField: any): CustomField {
    return{
      name: customField.Name,
      value: customField.Value
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
      spreads: missionSummary.Spreads,
      aislesScanned: missionSummary.AislesScanned
    };
  }

  createStore(store: any): Store {
    return {
      id: store.Id,
      storeName: store.StoreName,
      storeAddress: store.StoreAddress,
      totalAverageOuts: store.TotalAverageOuts,
      totalAverageLabels: store.TotalAverageLabels,
      totalAverageSpreads: store.TotalAverageSpreads,
      summaryOuts: (store.SummaryOuts || []).map(o => this.createDaySummary(o)),
      summaryLabels: (store.SummaryLabels || []).map(l => this.createDaySummary(l)),
      summarySpreads: (store.SummarySpreads || []).map(s => this.createDaySummary(s)),
    };
  }

  createDaySummary(daySummary: any): DaySummary {
    return {
      date: daySummary.Date,
      dailyAverage: daySummary.DailyAverage
    };
  }

  getStore(storeId: string, startDate: Date): Observable<Store[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.apiUrl}/DemoService/Stores?$filter=SummaryDate eq ${formatDate(startDate, 'yyyy-MM-dd', 'en-US')} and Id eq ${storeId}`).pipe(
      // API result
      // {
      //   "Id": 1,
      //   "StoreName": "Store 0054",
      //   "StoreAddress": "3201 E Platte Ave, Colorado Springs, CO 80909",
      //   "TotalAverageOuts": 124,
      //   "TotalAverageLabels": 4521,
      //   "TotalAverageSpreads": 31,
      //   "SummaryOuts":
      //     [
      //       {
      //         "Date": "2018-11-8",
      //         "DailyAverage": "190"
      //       }
      //     ]
      //   "SummaryLabels":
      //     [
      //       {
      //         "Date": "2018-11-8",
      //         "DailyAverage": "4600"
      //       }
      //     ]
      //   "SummarySpreads":
      //     [
      //       {
      //         "Date": "2018-11-8",
      //         "DailyAverage": "33"
      //       }
      //     ]
      // }

      // Map the result to an MissionSummary object
      map<any, Store[]>(o => o.value.map(m => this.createStore(m))),
    );
  }

  getMissionSummaries(date: Date, storeId: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.apiUrl}/DemoService/MissionSummaries?$filter=MissionDate eq ${formatDate(date, 'yyyy-MM-dd', 'en-US')} and StoreId eq '${storeId}'`)
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

  getMissionSummary(mission: number): Observable<MissionSummary> {
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

  getMissions(): Observable<Mission[]> {
    return this.http.get(`${this.apiUrl}/DemoService/Missions`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Missions",
      //   "value": [
      //     {
      //       "Id": 1,
      //       "StoreId": "1851",
      //       "Mission": "044429UTC",
      //       "MissionDate": "2018-11-09T02:10:25Z",
      //       "CreateDate": "2018-11-09T02:10:25Z"
      //     }
      //   ]
      // }

      // Map the result to an array of Mission objects
      map<any, Mission[]>(o => o.value.map(m => this.createMission(m))),

      // Sort by create date time
      map(missions => missions.sort((a, b) => (b.createDateTime.getTime() - a.createDateTime.getTime()))),
    );
  }

  getMission(missionId: number): Observable<Mission> {
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

  getAisles(missionId: number): Observable<Aisle[]> {
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

  getAisle(aisleId: number): Observable<Aisle> {
    return this.http.get(`${this.apiUrl}/DemoService/Panos(${aisleId})?$expand=Labels,Outs`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Panos(Labels(),Outs())/$entity",
      //   "Id": 1,
      //   "Aisle": "3",
      //   "FilePath": "04429UTC/AA/3/AA03_color_panorama.jpg",
      //   "CreateDate": "2018-11-09T02:10:25Z",
      //   "Labels": [
      //     {
      //       "Id": 3,
      //       "AisleId": "AA.3",
      //       "LabelType": "PRODUCT",
      //       "Barcode": "681131026420",
      //       "Aisle": "3",
      //       "Section": null,
      //       "X1": 0.3073472083,
      //       "Z1": 2.074207783,
      //       "X2": 0.3073472083,
      //       "Z2": 2.074207783,
      //       "CreateDate": "2018-11-09T02:10:25Z",
      //     }
      //   ],
      //   "Outs": []
      // }

      // Map the result to an Aisle object
      map<any, Aisle>(a => this.createAisle(a)),
    );
  }
}
