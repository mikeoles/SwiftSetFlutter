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
import { EnvironmentService } from './environment.service';
import ProductCoordinate from './productCoordinate.model';
import AnnotationCategory from './annotationCategory.model';
import AuthData from './auth.model';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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

    if (this.coverageDisplayType && this.coverageDisplayType.toLowerCase() === 'percent') {
      aisleCoverage = aisle.coveragePercent;
    }

    return {
      aisleId: aisle.id,
      aisleName: aisle.name,
      panoramaUrl: aisle.panoramaUrl,
      createDateTime: aisle.createDateTime,
      labelsCount: aisle.labelCount,
      labels: (aisle.labels || []).map(l => this.createLabel(l)),
      outsCount: aisle.outCount,
      outs: (aisle.outs || []).map(l => this.createLabel(l)),
      sectionLabels: (aisle.sectionLabels || []).map(l => this.createSectionLabel(l)),
      topStock: (aisle.topStock || []).map(l => this.createSectionLabel(l)),
      sectionBreaks: aisle.sectionBreaks,
      // sectionLabels: ([600, 4500, 10000]).map(l => this.createSectionLabelFake(l)),
      // topStock: ([500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]).map(l => this.createTopStock(l)),
      // sectionBreaks: [600, 4500, 10000],
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
      annotations: {},
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
      annotations: {},
      annotationColor: ''
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
      annotations: {},
      annotationColor: ''
    };
  }

  createLabel(label: any): Label {
    const product = label.product || {
      description: 'Missing Product Data',
      price: 0.0,
      onHand: null,
      itemId: '000000',
    };

    const customFields = [];
    if (label.product) {
      Object.entries(label.product).forEach(
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
      labelName: product.description,
      barcode: label.barcode || '000000000000',
      productId: product.itemId || '000000',
      price: label.price || product.price,
      department: '',
      onHand: product.onHand,
      bounds: {
        top: label.bounds.top,
        left: label.bounds.left,
        width: label.bounds.width,
        height: label.bounds.height,
      },
      productCoordinates: (prc || []).map(pc => this.createProductCoordinate(label.bounds, pc)),
      section: label.section,
      customFields: (customFields || []).map(cf => this.createCustomField(cf)),
      annotations: {},
      annotationColor: ''
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
      labels: mission.labelCount,
      outs: mission.outCount,
      readLabelsMatchingProduct: mission.labelMatchingProductCount,
      readLabelsMissingProduct: mission.labelMissingProductCount,
      unreadLabels: mission.labelUnreadCount,
      percentageUnread: mission.labelUnreadPercentage,
      percentageRead: mission.labelReadPercentage,
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
    return this.http.get(`${this.apiUrl}/stores`)
      .pipe(map<any, Store[]>(o => o.map(s => this.createStore(s))), );
  }

  getStore(storeId: string, start: Date, end: Date): Observable<Store> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}`)
      .pipe(
        switchMap((store: Store) =>
          forkJoin([
            this.getMissions(storeId, start, end, store.timezone),
            this.http.get(`${this.apiUrl}/stores/${storeId}`)
          ])
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

    return this.http.get(`${this.apiUrl}/stores/${storeId}/missions?startDate=${start.toISOString()}&endDate=${end.toISOString()}`)
      .pipe(
        map<any, Mission[]>(o => o.map(m => this.createMission(m, timezone))), // Map the result to an array of Mission objects
        map(missions => missions.sort((a, b) => (b.createDateTime.getTime() - a.createDateTime.getTime()))), // Sort by create date time
      );
  }

  getMission(storeId: string, missionId: string, timezone: string): Observable<Mission> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/missions/${missionId}`)
      .pipe(
        // Map the result to a Mission object
        map<any, Mission>(m => this.createMission(m, timezone)),
        map(mission => {
          mission.aisles = mission.aisles.sort((a, b) => a.aisleName.localeCompare(b.aisleName));
          return mission;
        }),
      );
  }

  getAisle(storeId: string, missionId: string, aisleId: string): Observable<Aisle> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}`)
      .pipe(
        // Map the result to an Aisle object
        map<any, Aisle>(a => this.createAisle(a)),
      );
  }

  getHistorialData(startDate: Date, endDate: Date): any {
    return this.http.get(`${this.apiUrl}/historicalData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
  }

  getToken(accessCode: string, reduirectUrl: string): Observable<AuthData> {
    const formData = new FormData();
    formData.set('code', accessCode);
    formData.set('redirectUri', reduirectUrl);
    return this.tokenEndpoint(formData);
  }

  refreshToken(refreshToken: string): Observable<AuthData> {
    const formData = new FormData();
    formData.set('refreshToken', refreshToken);
    return this.tokenEndpoint(formData);
  }

  private tokenEndpoint(formData: FormData): Observable<AuthData> {
    return this.http.post(`${this.apiUrl}/token`, formData)
        .pipe(map(this.createAuthData));
  }

  private createAuthData(data: any): AuthData {
    return {
      tokenType: data.token_type,
      expiresAt: moment().add(data.expires_in, 'second'),
      idToken: data.id_token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  }

  getRoles(idToken: string): Observable<string> {
    return of('bossanova');
  }

  getMissedCategories(): Observable<AnnotationCategory[]> {
    return this.http.get(`${this.apiUrl}/categories/missed`)
    .pipe(
      map<any, AnnotationCategory[]>(o => o.categories.map(c => this.createAnnotationCategory(c))),
    );
  }

  getMisreadCategories(): Observable<AnnotationCategory[]> {
    return this.http.get(`${this.apiUrl}/categories/misread`)
    .pipe(
      map<any, AnnotationCategory[]>(o => o.categories.map(c => this.createAnnotationCategory(c))),
    );
  }

  getFalsePositiveCategories(): Observable<AnnotationCategory[]> {
    return this.http.get(`${this.apiUrl}/categories/falsePositive`)
    .pipe(
      map<any, AnnotationCategory[]>(o => o.categories.map(c => this.createAnnotationCategory(c))),
    );
  }

  getFalseNegativeCategories(): Observable<AnnotationCategory[]> {
    return this.http.get(`${this.apiUrl}/categories/falseNegative`)
    .pipe(
      map<any, AnnotationCategory[]>(o => o.categories.map(c => this.createAnnotationCategory(c))),
    );
  }

  createAnnotationCategory(category: any): AnnotationCategory {
    return {
      categoryName: category.category,
      color: category.color,
      hotkey: category.hotkey,
    };
  }

  getAnnotations(storeId: string, missionId: string, aisleId: string): any {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations`);
  }


    // Missed

  createMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string, category: string) {
    const data = new FormData();
    data.set('top', top);
    data.set('left', left);
    data.set('category', category);
    this.http.post(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/missed`,
    data).subscribe();
  }

  updateMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string, category: string) {
    const data = new FormData();
    data.set('top', top);
    data.set('left', left);
    data.set('category', category);
    this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/missed`,
    data).subscribe();
  }

  deleteMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string) {
    this.http.delete(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/missed`,
      {params: {'top': top, 'left': left}}).subscribe();
  }


  // Misread

  createMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    const data = new FormData();
    data.set('labelId', labelId);
    data.set('category', category);
    this.http.post(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/misread`,
    data).subscribe();
  }

  updateMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    const data = new FormData();
    data.set('category', category);
    this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/misread/${labelId}`,
    data).subscribe();
  }

  deleteMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string) {
    this.http.delete(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/misread/${labelId}`)
    .subscribe();
  }


  // False Negative

  createFalseNegativeAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    const data = new FormData();
    data.set('labelId', labelId);
    data.set('category', category);
    this.http.post(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/falseNegative`,
    data).subscribe();
  }

  updateFalseNegativeAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    const data = new FormData();
    data.set('category', category);
    this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/falseNegative/${labelId}`,
    data).subscribe();
  }

  deleteFalseNegativeAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string) {
    this.http.delete(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/falseNegative/${labelId}`)
    .subscribe();
  }


  // False Positive

  createFalsePositiveAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    const data = new FormData();
    data.set('category', category);
    data.set('labelId', labelId);
    this.http.post(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/falsePositive`,
    data).subscribe();
  }

  updateFalsePositiveAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string) {
    const data = new FormData();
    data.set('category', category);
    this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/falsePositive/${labelId}`,
    data).subscribe();
  }

  deleteFalsePositiveAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string) {
    this.http.delete(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/falsePositive/${labelId}`)
    .subscribe();
  }
}
