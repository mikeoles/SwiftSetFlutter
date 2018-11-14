import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';
import { By } from '@angular/platform-browser';
import outs from '../../mock/outs.json';
import { of } from 'rxjs';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let secondRowEl: HTMLElement;
  let gridEl: HTMLElement;
  const data = of(outs);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    data.subscribe(products => component.products = products);
    fixture.detectChanges();
    spyOn(component.gridClicked, 'emit');
    secondRowEl = fixture.debugElement.query(By.css('div > table > tbody > tr:nth-child(2)')).nativeElement;
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
