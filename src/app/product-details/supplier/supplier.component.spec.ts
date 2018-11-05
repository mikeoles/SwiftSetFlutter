import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierComponent } from './supplier.component';
import { By } from '@angular/platform-browser';
import labels from '../../mock/labels.json';
import { of } from 'rxjs';

describe('SupplierComponent', () => {
  let component: SupplierComponent;
  let fixture: ComponentFixture<SupplierComponent>;
  let secondRowEl: HTMLElement;
  let gridEl: HTMLElement;
  let data = of(labels);
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierComponent);
    component = fixture.componentInstance;
    data.subscribe(suppliers => component.suppliers = suppliers);
    fixture.detectChanges();
    spyOn(component.suppliersGridClicked, 'emit');
    secondRowEl = fixture.debugElement.query(By.css('div > table > tbody > tr:nth-child(2)')).nativeElement;
    gridEl = fixture.debugElement.query(By.css('div > table > tbody')).nativeElement;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits id when row is clicked', () => {
    secondRowEl.click();
    expect(component.suppliersGridClicked.emit).toHaveBeenCalledWith(2);
  })

  it('highlights row when clicked', () => {
    component.selectedId = 2;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')).toEqual('selected');
  })

  it('doesn\'t highlight when different row when clicked', () => {
    component.selectedId = 1;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')==='selected').toBeFalsy();
  })

  it('doesn\'t highlight when no row is selected', () => {
    component.selectedId = 2;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')).toEqual('selected');
    
    component.selectedId = -1;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')==='selected').toBeFalsy();
  })

  it('displays correct number of rows', () => {
    expect(gridEl.childElementCount).toEqual(5);
  })

});