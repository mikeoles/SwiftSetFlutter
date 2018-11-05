import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlugsSpreadsComponent } from './plugs-spreads.component';
import { By } from '@angular/platform-browser';
import outs from '../../mock/outs.json';
import { of } from 'rxjs';

describe('PlugsSpreadsComponent', () => {
  let component: PlugsSpreadsComponent;
  let fixture: ComponentFixture<PlugsSpreadsComponent>;
  let secondRowEl: HTMLElement;
  let gridEl: HTMLElement;
  let data = of(outs);
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlugsSpreadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlugsSpreadsComponent);
    component = fixture.componentInstance;
    data.subscribe(plugs => component.plugs = plugs);
    fixture.detectChanges();
    spyOn(component.plugsGridClicked, 'emit');
    secondRowEl = fixture.debugElement.query(By.css('div > table > tbody > tr:nth-child(2)')).nativeElement;
    gridEl = fixture.debugElement.query(By.css('div > table > tbody')).nativeElement;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits id when row is clicked', () => {
    secondRowEl.click();
    expect(component.plugsGridClicked.emit).toHaveBeenCalledWith(2);
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