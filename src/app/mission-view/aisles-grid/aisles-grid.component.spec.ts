import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AislesGridComponent } from './aisles-grid.component';
import { Router } from '@angular/router';

describe('AislesGridComponent', () => {
  let component: AislesGridComponent;
  let fixture: ComponentFixture<AislesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AislesGridComponent ],
      imports: [
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AislesGridComponent);
    component = fixture.componentInstance;
    component.missionId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to an aisle', () => {
    const navigateSpy = spyOn(TestBed.get(Router), 'navigate');

    component.viewAisle('2');

    expect(navigateSpy).toHaveBeenCalledWith(['mission/1/aisle/2']);
  });
});
