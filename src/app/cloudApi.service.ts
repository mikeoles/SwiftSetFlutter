import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import { Observable, forkJoin, of } from 'rxjs';
import Store from './store.model';
import DaySummary from './daySummary.model';
import CustomField from './customField.model';
import { ApiService } from './api.service';
import { EnvironmentService } from './environment.service';
import ProductCoordinate from './productCoordinate.model';
import keys from './keys.json';
import AnnotationCategory from './annotationCategory.model';

@Injectable({
  providedIn: 'root'
})
export class CloudApiService implements ApiService {
  apiUrl: String;
  coverageDisplayType = 'Description';
  private labelId = 0;


  constructor(private http: HttpClient, private environment: EnvironmentService) {
    this.apiUrl = environment.config.apiUrl;
    this.coverageDisplayType = environment.config.coverageDisplayType;
  }

  createAisle(aisle: any): Aisle {
    let aisleCoverage = 'Low';
    if (aisle.coveragePercent >= 70) {
      aisleCoverage = 'High';
    } else if (aisle.coveragePercent >= 40) {
      aisleCoverage = 'Medium';
    }

    if (this.coverageDisplayType.toLowerCase() === 'percent') {
      aisleCoverage = aisle.coveragePercent;
    }

    return {
      aisleId: aisle.aisleId,
      aisleName: aisle.aisleName,
      panoramaUrl: aisle.panoramaUrl,
      createDateTime: aisle.createDate,
      labelsCount: aisle.labelsCount,
      labels: (aisle.labels || []).map(l => this.createLabel(l)),
      outsCount: aisle.outsCount,
      outs: (aisle.outs || []).map(l => this.createLabel(l)),
      sectionLabels: ([600, 4500, 10000]).map(l => this.createSectionLabelFake(l)),
      // sectionLabels: (aisle.sectionLabels || []).map(l => this.createSectionLabel(l)),
      // topStock: (aisle.topStock || []).map(l => this.createSectionLabel(l)),
      topStock: ([500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]).map(l => this.createTopStock(l)),
      sectionBreaks: [600, 4500, 10000],
      coveragePercent: aisle.coveragePercent,
      aisleCoverage: aisleCoverage,
    };
  }

  createSectionLabelFake(l: number): any {
    return {
      labelId: this.labelId++,
      labelName: 'Section Label',
      barcode: '000000' + l.toString(),
      productId: '',
      price: 0.0,
      department: '',
      onHand: 0,
      bounds: {
        top: 2000,
        left: l - 130,
        width: 100,
        height: 30,
      },
      productCoordinates: [],
      section: '',
      customFields: [],
      misreadType: '',
    };
  }

  createTopStock(l: number): Label {
    return {
      labelId: this.labelId++,
      labelName: 'Section Label',
      barcode: '000000' + l.toString(),
      productId: '',
      price: 0.0,
      department: '',
      onHand: 0,
      bounds: {
        top: 900,
        left: l * 2.5,
        width: 100,
        height: 30,
      },
      productCoordinates: [],
      section: '',
      customFields: [],
      misreadType: '',
    };
  }

    // Section label and top stock only contains a barcode and bound
  createSectionLabel(label: any): Label {
    return {
      labelId: this.labelId++,
      labelName: 'Section Label',
      barcode: label.barcode || '000000000000',
      productId: '',
      price: label.price || 0.0,
      department: '',
      onHand: 0,
      bounds: {
        top: label.bounds.top,
        left: label.bounds.left,
        width: label.bounds.width,
        height: label.bounds.height,
      },
      productCoordinates: [],
      section: '',
      customFields: [],
      misreadType: '',
    };
  }

  createLabel(label: any): Label {
    const customFields = [];
    if (label.custom_fields) {
      Object.entries(label.custom_fields).forEach(
        ([key, value]) => {
          const customField = {
            name: key,
            value: value
          };
          customFields.push(customField);
        }
      );
    }

    const prc = [0, 120];


    return {
      labelId: this.labelId++,
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
      productCoordinates: (prc || []).map(pc => this.createProductCoordinate(label.bounds, pc)),
      section: label.section,
      customFields: (customFields || []).map(cf => this.createCustomField(cf)),
      misreadType: '',
    };
  }

  createProductCoordinate(productCoordinate: any, rightoffset: number): ProductCoordinate {
    return{
      top: productCoordinate.top - 160,
      left: productCoordinate.left + rightoffset,
      width: productCoordinate.width / 2,
      height: productCoordinate.height * 3.5
    };
  }

  createCustomField(customField: any): CustomField {
    return{
      name: customField.name,
      value: customField.value
    };
  }

  createMission(mission: any, timezone: string): Mission {
    const adjStartDateString = new Date(mission.startDateTime).toLocaleString('en-US', {timeZone: timezone});
    const adjEndDateString = new Date(mission.endDateTime).toLocaleString('en-US', {timeZone: timezone});
    const adjCreateDateString = new Date(mission.createDateTime).toLocaleString('en-US', {timeZone: timezone});

    return {
      missionId: mission.id,
      missionName: mission.name,
      storeId: mission.store.id,
      startDateTime: new Date(adjStartDateString),
      endDateTime: new Date(adjEndDateString),
      createDateTime: new Date(adjCreateDateString),
      aisleCount: mission.aisleCount,
      labels: mission.labels,
      outs: mission.outs,
      readLabelsMatchingProduct: mission.readLabelsMatchingProduct,
      readLabelsMissingProduct: mission.readLabelsMissingProduct,
      unreadLabels: mission.unreadLabels,
      percentageUnread: mission.percentageUnread,
      percentageRead: mission.percentageRead,
      aisles: (mission.aisles || []).map(a => this.createAisle(a)),
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
      timezone: store.timezone,
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
      timezone: store.timezone,
      totalAverageOuts: 0,
      totalAverageLabels: 0,
      summaryOuts: [],
      summaryLabels: [],
    };
  }

  createDaySummary(daySummary: any): DaySummary {
    return {
      date: daySummary.date,
      dailyAverage: daySummary.dailyAverage
    };
  }

  getStores(): Observable<Store[]> {
    return this.http.get(
      `${this.apiUrl}/stores`,
      { params: {token: localStorage.getItem('token')} }
    ).pipe(map<any, Store[]>(o => o.map(s => this.createStore(s))), );
  }

  getStore(storeId: string, start: Date, end: Date): Observable<Store> {
    return this.http.get(
      `${this.apiUrl}/stores/${storeId}`,
      { params: {token: localStorage.getItem('token')} }
    ).pipe(
      switchMap((store: Store) =>
        forkJoin(
        this.getMissions(storeId, start, end, store.timezone),
        this.http.get(
          `${this.apiUrl}/stores/${storeId}`,
          { params: {token: localStorage.getItem('token')}})
        )
      ),
      map<any, Store>(a => this.createSingleStore(a))
    );
  }

  getMissions(storeId: string, start: Date, end: Date, timezone: string): Observable<Mission[]> {
    // Call api for missions on date of stores local timezone
    const adjTZStartString = new Date(start).toLocaleString('en-US', {timeZone: timezone});
    const adjTZStartDate = new Date(adjTZStartString);
    let timezoneDiff = start.getTime() - adjTZStartDate.getTime();
    start.setTime(start.getTime() + timezoneDiff);

    const adjTZEndString = new Date(end).toLocaleString('en-US', {timeZone: timezone});
    const adjTZEndDate = new Date(adjTZEndString);
    timezoneDiff = end.getTime() - adjTZEndDate.getTime();
    end.setTime(end.getTime() + timezoneDiff);

    return this.http.get(
        `${this.apiUrl}/stores/${storeId}/missions?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
        { params: {token: localStorage.getItem('token')} }
      ).pipe(
      map<any, Mission[]>(o => o.map(m => this.createMission(m, timezone))), // Map the result to an array of Mission objects
      map(missions => missions.sort((a, b) => (b.createDateTime.getTime() - a.createDateTime.getTime()))), // Sort by create date time
    );
  }

  getMission(storeId: string, missionId: string, timezone: string): Observable<Mission> {
    return this.http.get(
        `${this.apiUrl}/stores/${storeId}/missions/${missionId}`,
        { params: {token: localStorage.getItem('token')} }
      ).pipe(
      // Map the result to a Mission object
      map<any, Mission>(m => this.createMission(m, timezone)),
      map(mission => {
        mission.aisles = mission.aisles.sort((a, b) => a.aisleName.localeCompare(b.aisleName));
        return mission;
      }),
    );
  }

  getAisle(storeId: string, missionId: string, aisleId: string): Observable<Aisle> {
    return this.http.get(
        `${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}`,
        { params: {token: localStorage.getItem('token')} }
      ).pipe(
      // Map the result to an Aisle object
      map<any, Aisle>(a => this.createAisle(a)),
    );
  }

  getHistorialData(startDate: Date, endDate: Date): any {
    return this.http.get(
      `${this.apiUrl}/historicalData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      { params: {token: localStorage.getItem('token')} }
    );
  }

  getTokens(accessCode: string): any {
    return of(keys);
  }

  getRoles(idToken: string): Observable<string> {
    return of('bossanova');
  }

  getMissedCategories(): Observable<AnnotationCategory[]> {
    return this.http.get('http://localhost:4200/assets/mock/categoriesmissed.json').pipe(
      map<any, AnnotationCategory[]>(o => o.map(c => this.createAnnotationCategory(c))),
    );
  }

  getMisreadCategories(): Observable<AnnotationCategory[]> {
    return this.http.get('http://localhost:4200/assets/mock/categories.json').pipe(
      map<any, AnnotationCategory[]>(o => o.map(c => this.createAnnotationCategory(c))),
    );
  }

  createAnnotationCategory(category: any): AnnotationCategory {
    return {
      category: category.category,
      color: category.color,
      hotkey: category.hotkey,
    };
  }

  getAnnotations(storeId: string, missionId: string, aisleId: string) {
    throw new Error('Method not implemented.');
  }

  createMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string, category: string) {
    throw new Error('Method not implemented.');
  }

  updateMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string, category: string) {
    throw new Error('Method not implemented.');
  }

  deleteMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string) {
    throw new Error('Method not implemented.');
  }

  createMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    throw new Error('Method not implemented.');
  }

  updateMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    throw new Error('Method not implemented.');
  }

  deleteMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string) {
    throw new Error('Method not implemented.');
  }
}
