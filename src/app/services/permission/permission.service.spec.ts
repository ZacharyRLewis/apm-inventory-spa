import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {TestDomain, WinResponse} from '../../model';
import {Permissions} from '../../model/permissions';
import {PermissionsService} from './permission.service';

describe('PermissionsService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let permissionsService: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PermissionsService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    permissionsService = TestBed.get(PermissionsService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([PermissionsService], (service: PermissionsService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findUserPermissions()', () => {
    const expected: WinResponse<Permissions> = {meta: null, data: TestDomain.PERMISSIONS};

    it('should return expected permissions', () => {
      permissionsService.findUserPermissions()
        .subscribe(res => {
          expect(res.data.permissions[0]).toEqual('test', 'should return expected permissions');
        });

      const req = httpTester.expectOne(permissionsService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });
  });
});
