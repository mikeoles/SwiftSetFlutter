import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import Mission from './mission.model';
import Aisle from './aisle.model';
import Label from './label.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Mission[]> {
    return this.http.get(`${environment.apiUrl}/DemoService/Missions`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Missions",
      //   "value": [
      //     {
      //       "Id": 1,
      //       "MissionId": "044429UTC",
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
    return this.http.get(`${environment.apiUrl}/DemoService/Missions(${missionId})/Panos`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Panos",
      //   "value": [
      //     {
      //       "Id": 4,
      //       "MissionId": "165839UTC",
      //       "Zone": "AA",
      //       "Aisle": "3",
      //       "FilePath": "165839UTC/AA/3/AA03_color_panorama.jpg"
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
    return this.http.get(`${environment.apiUrl}/DemoService/Panos(${aisleId})?$expand=Labels,Outs`).pipe(
      // API result
      // {
      //   "@odata.context": "$metadata#Panos(Labels(),Outs())/$entity",
      //   "Id": 1,
      //   "MissionId": "044429UTC",
      //   "Zone": "AA",
      //   "Aisle": "3",
      //   "FilePath": "04429UTC/AA/3/AA03_color_panorama.jpg",
      //   "Labels": [
      //     {
      //       "Id": 3,
      //       "MissionId": "044429UTC",
      //       "StoreId": "1851",
      //       "AisleId": "AA.3",
      //       "LabelType": "PRODUCT",
      //       "Barcode": "681131026420",
      //       "Zone": "AA",
      //       "Aisle": "3",
      //       "Section": null,
      //       "X1": 0.3073472083,
      //       "Z1": 2.074207783,
      //       "X2": 0.3073472083,
      //       "Z2": 2.074207783
      //     }
      //   ],
      //   "Outs": []
      // }

      // Map the result to an Aisle object
      map<any, Aisle>(a => this.createAisle(a)),
    );
  }

  createMission(mission: any): Mission {
    return {
      id: mission.Id,
      name: mission.MissionId,
      createDateTime: new Date(mission.CreateDate),
    };
  }

  createAisle(aisle: any): Aisle {
    return {
      id: aisle.Id,
      name: `${aisle.Zone}${aisle.Aisle}`,
      panoramaUrl: `${environment.apiUrl}/resources/${aisle.FilePath}`,
      labels: (aisle.Labels || []).map(l => this.createLabel(l)),
      outs: (aisle.Outs || []).map(l => this.createLabel(l)),
    };
  }

  createLabel(label: any): Label {
    return {
      id: label.Id,
      name: label.ProductName || 'Unknown Product Name',
      barcode: label.Barcode || '000000000000',
      productId: label.ProductId || 'A0000',
      price: label.Price || 0,
      bounds: {
        top: label.Z1,
        left: label.X1,
        width: label.X2 - label.X1,
        height: label.Z2 - label.Z1,
      }
    };
  }
}
