import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import { Observable, forkJoin } from 'rxjs';
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
      missionId: mission.id,
      missionName: mission.missionName,
      storeId: mission.store.id,
      startDateTime: new Date(mission.startDateTime),
      endDateTime: new Date(mission.endDateTime),
      createDateTime: new Date(mission.createDateTime),
      aisleCount: mission.aisleCount,
      labels: mission.labels,
      outs: mission.outs,
      readLabelsMatchingProduct: mission.readLabelsMatchingProduct,
      readLabelsMissingProduct: mission.readLabelsMissingProduct,
      unreadLabels: mission.unreadLabels,
      percentageUnread: mission.percentageUnread,
      percentageRead: mission.percentageRead,
    };
  }

  createSingleStore(data: any): Store {
    const missions = data[0];
    const store = data[1];

    missions.sort(missionDateSort);

    const outsSummaries: DaySummary[] = [], labelsSummaries: DaySummary[] = [];
    let lastMission = null, curLabelCount = 0, curOutCount = 0, missionCount = 0, lastDate: Date = null,
      daysAdded = 0, totalOuts = 0, totalLabels = 0;

    // Loop through the missions and combine values for each date
    for (let i = 0; i < missions.length; i++) {
      const missionDate: Date = new Date(missions[i].startDateTime);
      if (lastMission === null) {
        lastMission = missions[i];
        lastDate = new Date(lastMission.startDateTime);
      } else {
        lastDate = new Date(lastMission.startDateTime);
        missionCount++;
        curLabelCount += lastMission.labels;
        curOutCount += lastMission.outs;
        // If its from a different date save all of the data from the previous date and reset the counts
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
        lastMission = missions[i];
      }
    }

    if (lastDate != null) {
      lastDate = new Date(lastMission.startDateTime);
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
      summaryOuts: (outsSummaries || []).map(o => this.createDaySummary(o)),
      summaryLabels: (labelsSummaries || []).map(l => this.createDaySummary(l)),
    };

    function missionDateSort(a, b) {
      if (a.startDateTime < b.startDateTime) {
        return -1;
      } else if (a.last_nom > b.last_nom) {
        return 1;
      } else {
        return 0;
      }
    }
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
      date: daySummary.date,
      dailyAverage: daySummary.dailyAverage
    };
  }

  getStores(): Observable<Store[]> {
    return this.http.get('../assets/mock/stores.json').pipe(map<any, Store[]>(o => o.map(s => this.createStore(s))), );
  }

  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store> {
    return forkJoin(
      this.http.get(`../assets/mock/missions.json`),
      this.http.get('../assets/mock/store.json'))
    .pipe(
      map<any, Store>(a => this.createSingleStore(a))
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

  getMissions(storeId: string, startDate: Date, endDate: Date): Observable<Mission[]> {
    return this.http.get(`../assets/mock/missions.json`).pipe(

      // Map the result to an array of Mission objects
      map<any, Mission[]>(o => o.map(m => this.createMission(m))),

      // Sort by create date time
      map(missions => missions.sort((a, b) => (b.createDateTime.getTime() - a.createDateTime.getTime()))),
    );
  }

  getMission(storeId: string, missionId: number): Observable<Mission> {
    return this.http.get(`../assets/mock/mission.json`).pipe(
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
