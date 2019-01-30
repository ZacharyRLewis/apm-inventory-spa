import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {ApplicationService} from '..';
import {Application, TestDomain, WinResponse} from '../../model';

describe('ApplicationService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let applicationService: ApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    applicationService = TestBed.get(ApplicationService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([ApplicationService], (service: ApplicationService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<Application[]> = {meta: null, data: [TestDomain.APPLICATION]};
    const noResults: WinResponse<Application[]> = {meta: null, data: []};

    it('should return expected applications', () => {
      applicationService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected applications');
        });

      const req = httpTester.expectOne(applicationService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no applications are returned', () => {
      applicationService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(applicationService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected applications (called multiple times)', () => {
      applicationService.findAll().subscribe();
      applicationService.findAll().subscribe();
      applicationService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(applicationService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const application: Application = TestDomain.APPLICATION;
    const expected: WinResponse<Application> = {meta: null, data: application};

    it('should find one application and return it', () => {
      applicationService.findOne(application.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the application');
          }
        );

      const req = httpTester.expectOne(applicationService.url + '/' + application.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationService.findOne(application.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationService.url + '/' + application.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const application: Application = TestDomain.APPLICATION;
    const expected: WinResponse<Application> = {meta: null, data: application};

    it('should create an application and return it', () => {
      applicationService.create(application)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created application');
          });

      const req = httpTester.expectOne(applicationService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const application: Application = TestDomain.APPLICATION;
    const expected: WinResponse<Application> = {meta: null, data: application};

    it('should update an application and return it', () => {
      applicationService.update(application)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated application');
          });

      const req = httpTester.expectOne(applicationService.url + '/' + application.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationService.update(application)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationService.url + '/' + application.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const application: Application = TestDomain.APPLICATION;
    const expected: WinResponse<Application> = {meta: null, data: null};

    it('should delete an application', () => {
      applicationService.delete(application)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no application');
          });

      const req = httpTester.expectOne(applicationService.url + '/' + application.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationService.delete(application)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationService.url + '/' + application.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
