import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed, inject} from '@angular/core/testing';
import {ApplicationType, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {ApplicationTypeService} from './application-type.service';

describe('ApplicationTypeService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let applicationTypeService: ApplicationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationTypeService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    applicationTypeService = TestBed.get(ApplicationTypeService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([ApplicationTypeService], (service: ApplicationTypeService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<ApplicationType[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};
    const noResults: WinResponse<ApplicationType[]> = {meta: null, data: []};

    it('should return expected applicationTypes', () => {
      applicationTypeService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected applicationTypes');
        });

      const req = httpTester.expectOne(applicationTypeService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no applicationTypes are returned', () => {
      applicationTypeService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(applicationTypeService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected applicationTypes (called multiple times)', () => {
      applicationTypeService.findAll().subscribe();
      applicationTypeService.findAll().subscribe();
      applicationTypeService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(applicationTypeService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const applicationType: ApplicationType = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationType> = {meta: null, data: applicationType};

    it('should find one applicationType and return it', () => {
      applicationTypeService.findOne(applicationType.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the applicationType');
          }
        );

      const req = httpTester.expectOne(applicationTypeService.url + '/' + applicationType.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationTypeService.findOne(applicationType.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationTypeService.url + '/' + applicationType.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const applicationType: ApplicationType = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationType> = {meta: null, data: applicationType};

    it('should create an applicationType and return it', () => {
      applicationTypeService.create(applicationType)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created applicationType');
          });

      const req = httpTester.expectOne(applicationTypeService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const applicationType: ApplicationType = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationType> = {meta: null, data: applicationType};

    it('should update an applicationType and return it', () => {
      applicationTypeService.update(applicationType)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated applicationType');
          });

      const req = httpTester.expectOne(applicationTypeService.url + '/' + applicationType.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationTypeService.update(applicationType)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationTypeService.url + '/' + applicationType.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const applicationType: ApplicationType = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationType> = {meta: null, data: null};

    it('should delete an applicationType', () => {
      applicationTypeService.delete(applicationType)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no applicationType');
          });

      const req = httpTester.expectOne(applicationTypeService.url + '/' + applicationType.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationTypeService.delete(applicationType)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationTypeService.url + '/' + applicationType.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
