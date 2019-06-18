import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgxPermissionsConfigurationStore, NgxPermissionsModule, NgxPermissionsStore, NgxRolesStore} from 'ngx-permissions';
import {SidenavComponent} from '..';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forChild()],
      declarations: [SidenavComponent],
      providers: [NgxPermissionsStore, NgxPermissionsConfigurationStore, NgxRolesStore]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
