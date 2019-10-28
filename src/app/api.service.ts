import Mission from './mission.model';
import Aisle from './aisle.model';
import { Observable } from 'rxjs';
import Store from './store.model';
import { EnvironmentService } from './environment.service';
import { CloudApiService } from './cloudApi.service';
import { HttpClient } from '@angular/common/http';
import AnnotationCategory from './annotationCategory.model';

export interface ApiService {
  getStores();
  getStore(storeId: string, startDate: Date, endDate: Date): Observable<Store>;
  getMissions(storeId: string, startDate: Date, endDate: Date, timezone: string): Observable<Mission[]> ;
  getMission(storeId: string, missionId: string, timezone: string): Observable<Mission>;
  getAisle(storeId: string, missionId: string, aisleId: string): Observable<Aisle>;
  getHistorialData(startDate: Date, endDate: Date);
  getTokens(accessCode: string): any;
  getRoles(idToken: string): Observable<string>;
  getMissedCategories(): Observable<AnnotationCategory[]>;
  getMisreadCategories(): Observable<AnnotationCategory[]>;
  getFalseNegativeCategories(): Observable<AnnotationCategory[]>;
  getFalsePositiveCategories(): Observable<AnnotationCategory[]>;
  getAnnotations(storeId: string, missionId: string, aisleId: string);
  createMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string, category: string);
  updateMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string, category: string);
  deleteMissedLabelAnnotation(storeId: string, missionId: string, aisleId: string, top: string, left: string);
  createMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string);
  updateMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string);
  deleteMisreadLabelAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string);
  createFalsePositiveAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string);
  updateFalsePositiveAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string);
  deleteFalsePositiveAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string);
  createFalseNegativeAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string);
  updateFalseNegativeAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string, category: string);
  deleteFalseNegativeAnnotation(storeId: string, missionId: string, aisleId: string, labelId: string);
}

export function apiFactory(environment: EnvironmentService, http: HttpClient) {
  return new CloudApiService(http, environment);
}
