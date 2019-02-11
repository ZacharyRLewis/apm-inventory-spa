import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {DependencyService} from '..';
import {Dependency, TestDomain, WinResponse} from '../../model';

describe('DependencyService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let dependencyService: DependencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DependencyService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    dependencyService = TestBed.get(DependencyService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([DependencyService], (service: DependencyService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<Dependency[]> = {meta: null, data: [TestDomain.DATABASE]};
    const noResults: WinResponse<Dependency[]> = {meta: null, data: []};

    it('should return expected dependencies', () => {
      dependencyService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected dependencies');
        });

      const req = httpTester.expectOne(dependencyService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no dependencies are returned', () => {
      dependencyService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(dependencyService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected dependencies (called multiple times)', () => {
      dependencyService.findAll().subscribe();
      dependencyService.findAll().subscribe();
      dependencyService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(dependencyService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const dependency: Dependency = TestDomain.DATABASE;
    const expected: WinResponse<Dependency> = {meta: null, data: dependency};

    it('should find one dependency and return it', () => {
      dependencyService.findOne(dependency.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the dependency');
          }
        );

      const req = httpTester.expectOne(dependencyService.url + '/' + dependency.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      dependencyService.findOne(dependency.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(dependencyService.url + '/' + dependency.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const dependency: Dependency = TestDomain.DATABASE;
    const expected: WinResponse<Dependency> = {meta: null, data: dependency};

    it('should create an dependency and return it', () => {
      dependencyService.create(dependency)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created dependency');
          });

      const req = httpTester.expectOne(dependencyService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const dependency: Dependency = TestDomain.DATABASE;
    const expected: WinResponse<Dependency> = {meta: null, data: dependency};

    it('should update an dependency and return it', () => {
      dependencyService.update(dependency)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated dependency');
          });

      const req = httpTester.expectOne(dependencyService.url + '/' + dependency.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      dependencyService.update(dependency)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(dependencyService.url + '/' + dependency.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const dependency: Dependency = TestDomain.DATABASE;
    const expected: WinResponse<Dependency> = {meta: null, data: null};

    it('should delete an dependency', () => {
      dependencyService.delete(dependency)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no dependency');
          });

      const req = httpTester.expectOne(dependencyService.url + '/' + dependency.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      dependencyService.delete(dependency)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(dependencyService.url + '/' + dependency.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  it('should attempt to upload dependencies', () => {
    const event = {files: [{name: 'test'}]};

    dependencyService.uploadDependencies(event, '1')
      .then(response => {
        const dependencies: Dependency[] = response.data;
        expect(dependencies).toBeTruthy();
      })
      .catch(error => {
        const json = JSON.parse(error);
        expect(json.status).not.toEqual(200);
      });
  });
});
