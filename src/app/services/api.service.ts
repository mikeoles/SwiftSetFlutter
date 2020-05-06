import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import Mission from '../models/mission.model';
import Aisle from '../models/aisle.model';
import Label from '../models/label.model';
import { Observable, forkJoin, of } from 'rxjs';
import Store from '../models/store.model';
import DaySummary from '../models/daySummary.model';
import CustomField from '../models/customField.model';
import { EnvironmentService } from './environment.service';
import ProductCoordinate from '../models/productCoordinate.model';
import AnnotationCategory from '../models/annotationCategory.model';
import AuthData from '../models/auth.model';
import moment from 'moment';
import Detection from '../models/detection.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: String;
  coverageDisplayType = 'Description';

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
      scanDateTime: aisle.scanDateTime,
      createDateTime: aisle.createDateTime,
      labelsCount: aisle.labelCount,
      labels: (aisle.labels || []).map(l => this.createLabel(l)),
      outsCount: aisle.outCount,
      outs: (aisle.outs || []).map(l => this.createLabel(l)),
      sectionLabels: (aisle.sectionLabels || []).map(l => this.createSectionLabel(l)),
      topStock: (aisle.topStock || []).map(l => this.createSectionLabel(l)),
      sectionBreaks: aisle.sectionBreaks,
      coveragePercent: aisle.coveragePercent,
      aisleCoverage: aisleCoverage,
      auditQueueStatus: aisle.auditQueueStatus || 'not-queued'
    };
  }

    // Section label and top stock only contains a barcode and bound
  createSectionLabel(label: any): Label {
    return {
      labelId: label.id,
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
      section: '',
      customFields: [],
      color: ''
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

    return {
      labelId: label.id,
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
      section: label.section,
      customFields: (customFields || []).map(cf => this.createCustomField(cf)),
      color: ''
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
      storeNumber: mission.store.number,
      storeName: mission.store.name,
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
      zoneId: this.getValidTimezone(store.zoneId),
      robots: store.robots,
      canary: (store.canary || false),
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
      zoneId: this.getValidTimezone(store.zoneId),
      robots: store.robots,
      canary: (store.canary || false),
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
      .pipe(
        map<any, Store[]>(o => o.map(s => this.createStore(s))),
        map(stores => stores.sort((a, b) => a.storeName.localeCompare(b.storeName))) // Sort by create date time
      );
  }

  getStore(storeId: string, start: Date, end: Date): Observable<Store> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}`)
      .pipe(
        switchMap((store: Store) =>
          forkJoin([
            this.getMissions(storeId, start, end, this.getValidTimezone(store.zoneId)),
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

  getAislesByLabels(storeId: string, missionId: string, searchFor: string, term: string): Observable<Aisle[]> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/?${searchFor}=${term}`)
      .pipe(
        map<any, Aisle[]>(o => o.map(a => this.createAisle(a))), // Map the result to an array of Aisle objects
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
      roles: data.roles,
    };
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

  getDetections(storeId: string, missionId: string, aisleId: string): Observable<Detection[]> {
    return this.http.get(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/detections`)
    .pipe(map<any, Detection[]>(o => o.detections.map(d => this.createDetection(d))), );
  }

  createDetection(detection: any): Detection {
    return {
      detectionId: detection.id,
      bounds: {
        top: detection.bounds.top,
        left: detection.bounds.left,
        width: detection.bounds.width,
        height: detection.bounds.height,
      },
      detectionType: detection.detectionType,
      tags: detection.tags,
      classifications: detection.classifications,
      associations: detection.associations,
      color: ''
    };
  }

  updateMissedAnnotation(storeId: string, missionId: string, aisleId: string,
    top: string, left: string, category: string, action: string): void {
    const data = new FormData();
    data.set('top', top);
    data.set('left', left);
    data.set('category', category);
    if (action === 'update') {
      this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/missed`,
      data).subscribe();
    }
    if (action === 'delete') {
      this.http.delete(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/missed`,
      {params: {top, left}}).subscribe();
    }
    if (action === 'create') {
      this.http.post(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/missed`,
      data).subscribe();
    }
  }

  updateLabelAnnotation(storeId: string, missionId: string, aisleId: string,
    labelId: string, category: string, typeOfAnnotation: string, action: string): void {
    if (action === 'update') {
      const data = new FormData();
      data.set('category', category);
      this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/${typeOfAnnotation}/${labelId}`,
      data).subscribe();
    }
    if (action === 'create') {
      const data = new FormData();
      data.set('labelId', labelId);
      data.set('category', category);
      this.http.post(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/${typeOfAnnotation}`,
      data).subscribe();
    }
    if (action === 'delete') {
      this.http.delete(
        `${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/annotations/${typeOfAnnotation}/${labelId}`
      )
      .subscribe();
    }
  }

  // checks for valid timezone, if not return browsers local timezone
  getValidTimezone(tz: string): string {
    try {
        Intl.DateTimeFormat(undefined, {timeZone: tz});
        return tz;
    } catch (ex) {
      console.error('Invalid timezone configured for store: ' + tz +
      ' timezone set to : ' + new Intl.DateTimeFormat().resolvedOptions().timeZone);
      return new Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  // Add an aisle to the audit queue
  queueAisle(storeId: number, missionId: number, aisleId: string): any {
    return this.http.put(`${this.apiUrl}/stores/${storeId}/missions/${missionId}/aisles/${aisleId}/queueAisle`,
    new FormData());
  }
}
