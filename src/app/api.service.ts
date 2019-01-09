import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';
import { Observable, of } from 'rxjs';
import outs from './mock/outs.json';
import labels from './mock/labels.json';
import store from './mock/store.json';
import randomMissions from './mock/missions.json';
import singleMission from './mock/mission.json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: String;

  constructor(private environment: EnvironmentService, private http: HttpClient) {
    this.apiUrl = environment.config.apiUrl;
  }
  getOuts(selectedAisle: string): Observable<Array<any>> {
    return of(outs);
  }

  getLabels(selectedAisle: string): Observable<Array<any>> {
    return of(labels);
  }

  getStore(id: number) {
    return of(store);
  }

  getDateMissions(date: string): Observable<Array<any>> {
    return of(randomMissions);
  }

  getMission(missionId: number) {
    return of(singleMission);
  }

  createAisle(aisle: any): Aisle {
    return {
      id: aisle.Id,
      name: `${aisle.Zone}${aisle.Aisle}`,
      panoramaUrl: `${aisle.FilePath}`,
      labels: (aisle.Labels || []).map(l => this.createLabel(l)),
      outs: (aisle.Outs || []).map(l => this.createLabel(l)),
    };
  }

  createLabel(label: any): Label {
    return {
      id: label.Id,
      name: label.Product.Description || 'Unknown Product Name',
      barcode: label.Barcode || label.Product.Barcode || '000000000000',
      productId: label.Product.ItemId || '',
      price: label.Product.Price || 0,
      bounds: {
        top: label.Z1 - 10,
        left: label.X1 - 10,
        width: label.X2 - label.X1,
        height: label.Z2 - label.Z1,
      }
    };
  }

  createMission(mission: any): Mission {
    return {
      id: mission.Id,
      name: mission.Mission,
      missionDateTime: new Date(mission.MissionDate),
      createDateTime: new Date(mission.CreateDate),
    };
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
      map(aisles => aisles.sort((a, b) => a.name.localeCompare(b.name))),
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
