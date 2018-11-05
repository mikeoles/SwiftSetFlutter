import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductLabelsComponent } from './product-labels.component';
import { By } from '@angular/platform-browser';
import labels from '../../mock/labels.json';
import { of } from 'rxjs';

describe('ProductLabelsComponent', () => {
  let component: ProductLabelsComponent;
  let fixture: ComponentFixture<ProductLabelsComponent>;
  let secondRowEl: HTMLElement;
  let gridEl: HTMLElement;
  let data = of(labels);
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLabelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelsComponent);
    component = fixture.componentInstance;
    data.subscribe(labels => component.labels = labels);
    fixture.detectChanges();
    spyOn(component.labelsGridClicked, 'emit');
    secondRowEl = fixture.debugElement.query(By.css('div > table > tbody > tr:nth-child(2)')).nativeElement;
    gridEl = fixture.debugElement.query(By.css('div > table > tbody')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits id when row is clicked', () => {
    secondRowEl.click();
    expect(component.labelsGridClicked.emit).toHaveBeenCalledWith(2);
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

  it('displays labels data', () => {
    expect(secondRowEl.innerHTML.includes('681131972147')).toBeTruthy();
  })

});