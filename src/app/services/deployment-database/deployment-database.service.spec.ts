import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {DeploymentDatabaseService} from '..';
import {DeploymentDatabase, TestDomain, WinResponse} from '../../model';

describe('DeploymentDatabaseService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let deploymentDatabaseService: DeploymentDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeploymentDatabaseService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    deploymentDatabaseService = TestBed.get(DeploymentDatabaseService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([DeploymentDatabaseService], (service: DeploymentDatabaseService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<DeploymentDatabase[]> = {meta: null, data: [TestDomain.DEPLOYMENT]};
    const noResults: WinResponse<DeploymentDatabase[]> = {meta: null, data: []};

    it('should return expected deployment databases', () => {
      deploymentDatabaseService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected deployment databases');
        });

      const req = httpTester.expectOne(deploymentDatabaseService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no deployment databases are returned', () => {
      deploymentDatabaseService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(deploymentDatabaseService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected deployment databases (called multiple times)', () => {
      deploymentDatabaseService.findAll().subscribe();
      deploymentDatabaseService.findAll().subscribe();
      deploymentDatabaseService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(deploymentDatabaseService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const deploymentDatabase: DeploymentDatabase = TestDomain.DEPLOYMENT;
    const expected: WinResponse<DeploymentDatabase> = {meta: null, data: deploymentDatabase};

    it('should find one deployment database and return it', () => {
      deploymentDatabaseService.findOne(deploymentDatabase.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the deployment database');
          }
        );

      const req = httpTester.expectOne(deploymentDatabaseService.url + '/' + deploymentDatabase.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      deploymentDatabaseService.findOne(deploymentDatabase.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(deploymentDatabaseService.url + '/' + deploymentDatabase.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const deploymentDatabase: DeploymentDatabase = TestDomain.DEPLOYMENT;
    const expected: WinResponse<DeploymentDatabase> = {meta: null, data: deploymentDatabase};

    it('should create a deployment database and return it', () => {
      deploymentDatabaseService.create(deploymentDatabase)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created deployment database');
          });

      const req = httpTester.expectOne(deploymentDatabaseService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const deploymentDatabase: DeploymentDatabase = TestDomain.DEPLOYMENT;
    const expected: WinResponse<DeploymentDatabase> = {meta: null, data: deploymentDatabase};

    it('should update a deployment database and return it', () => {
      deploymentDatabaseService.update(deploymentDatabase)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated deployment database');
          });

      const req = httpTester.expectOne(deploymentDatabaseService.url + '/' + deploymentDatabase.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      deploymentDatabaseService.update(deploymentDatabase)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(deploymentDatabaseService.url + '/' + deploymentDatabase.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const deploymentDatabase: DeploymentDatabase = TestDomain.DEPLOYMENT;
    const expected: WinResponse<DeploymentDatabase> = {meta: null, data: null};

    it('should delete a deployment database', () => {
      deploymentDatabaseService.delete(deploymentDatabase)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no deployment database');
          });

      const req = httpTester.expectOne(deploymentDatabaseService.url + '/' + deploymentDatabase.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      deploymentDatabaseService.delete(deploymentDatabase)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(deploymentDatabaseService.url + '/' + deploymentDatabase.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
