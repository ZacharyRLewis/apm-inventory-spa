import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {ApplicationDependencyService} from '..';
import {ApplicationDependency, TestDomain, WinResponse} from '../../model';

describe('ApplicationDependencyService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let applicationDependencyService: ApplicationDependencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationDependencyService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    applicationDependencyService = TestBed.get(ApplicationDependencyService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([ApplicationDependencyService], (service: ApplicationDependencyService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<ApplicationDependency[]> = {meta: null, data: [TestDomain.DATABASE]};
    const noResults: WinResponse<ApplicationDependency[]> = {meta: null, data: []};

    it('should return expected application dependencies', () => {
      applicationDependencyService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected application dependencies');
        });

      const req = httpTester.expectOne(applicationDependencyService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no application dependencies are returned', () => {
      applicationDependencyService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(applicationDependencyService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected application dependencies (called multiple times)', () => {
      applicationDependencyService.findAll().subscribe();
      applicationDependencyService.findAll().subscribe();
      applicationDependencyService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(applicationDependencyService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const applicationDependency: ApplicationDependency = TestDomain.DATABASE;
    const expected: WinResponse<ApplicationDependency> = {meta: null, data: applicationDependency};

    it('should find one applicationDependency and return it', () => {
      applicationDependencyService.findOne(applicationDependency.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the application applicationDependency');
          }
        );

      const req = httpTester.expectOne(applicationDependencyService.url + '/' + applicationDependency.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationDependencyService.findOne(applicationDependency.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationDependencyService.url + '/' + applicationDependency.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const applicationDependency: ApplicationDependency = TestDomain.DATABASE;
    const expected: WinResponse<ApplicationDependency> = {meta: null, data: applicationDependency};

    it('should create an applicationDependency and return it', () => {
      applicationDependencyService.create(applicationDependency)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created applicationDependency');
          });

      const req = httpTester.expectOne(applicationDependencyService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const applicationDependency: ApplicationDependency = TestDomain.DATABASE;
    const expected: WinResponse<ApplicationDependency> = {meta: null, data: applicationDependency};

    it('should update an application dependency and return it', () => {
      applicationDependencyService.update(applicationDependency)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated application dependency');
          });

      const req = httpTester.expectOne(applicationDependencyService.url + '/' + applicationDependency.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationDependencyService.update(applicationDependency)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationDependencyService.url + '/' + applicationDependency.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const applicationDependency: ApplicationDependency = TestDomain.DATABASE;
    const expected: WinResponse<ApplicationDependency> = {meta: null, data: null};

    it('should delete an application dependency', () => {
      applicationDependencyService.delete(applicationDependency)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no application dependency');
          });

      const req = httpTester.expectOne(applicationDependencyService.url + '/' + applicationDependency.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationDependencyService.delete(applicationDependency)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationDependencyService.url + '/' + applicationDependency.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
