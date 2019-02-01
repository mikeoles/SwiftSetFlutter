import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';
import { By } from '@angular/platform-browser';
import Label from 'src/app/label.model';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let secondRowEl: HTMLElement;
  let gridEl: HTMLElement;
  const labels: Label[] = [
    { id: 1, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 2, name: 'label name', barcode: '550376332', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 3, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 4, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
    { id: 5, name: 'label name', barcode: '12345', productId: '12345', price: 0.0, bounds: { top: 0, left: 0, width: 0, height: 0 } },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.products = labels;
    fixture.detectChanges();
    spyOn(component.gridClicked, 'emit');
    secondRowEl = fixture.debugElement.query(By.css('div > table > tbody > tr:nth-child(2)')).nativeElement;
    console.log(secondRowEl);
    gridEl = fixture.debugElement.query(By.css('div > table > tbody')).nativeElement;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits id when row is clicked', () => {
    secondRowEl.click();
    expect(component.gridClicked.emit).toHaveBeenCalledWith(2);
  });

  it('highlights row when clicked', () => {
    component.selectedId = 2;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')).toEqual('selected');
  });

  it('doesn\'t highlight when different row when clicked', () => {
    component.selectedId = 1;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class') === 'selected').toBeFalsy();
  });

  it('doesn\'t highlight when no row is selected', () => {
    component.selectedId = 2;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class')).toEqual('selected');

    component.selectedId = -1;
    fixture.detectChanges();
    expect(secondRowEl.getAttribute('class') === 'selected').toBeFalsy();
  });

  it('displays correct number of rows', () => {
    expect(gridEl.childElementCount).toEqual(5);
  });

  it('displays correct number of columns', () => {
    expect(secondRowEl.childElementCount).toEqual(4);
  });

  it('displays outs data', () => {
    expect(secondRowEl.innerHTML.includes('550376332')).toBeTruthy();
  });

});
