import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {DeploymentService} from '..';
import {Deployment, TestDomain, WinResponse} from '../../model';

describe('DeploymentService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let deploymentService: DeploymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeploymentService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    deploymentService = TestBed.get(DeploymentService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([DeploymentService], (service: DeploymentService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<Deployment[]> = {meta: null, data: [TestDomain.DEPLOYMENT]};
    const noResults: WinResponse<Deployment[]> = {meta: null, data: []};

    it('should return expected deployments', () => {
      deploymentService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected deployments');
        });

      const req = httpTester.expectOne(deploymentService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no deployments are returned', () => {
      deploymentService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(deploymentService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected deployments (called multiple times)', () => {
      deploymentService.findAll().subscribe();
      deploymentService.findAll().subscribe();
      deploymentService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(deploymentService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const deployment: Deployment = TestDomain.DEPLOYMENT;
    const expected: WinResponse<Deployment> = {meta: null, data: deployment};

    it('should find one deployment and return it', () => {
      deploymentService.findOne(deployment.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the deployment');
          }
        );

      const req = httpTester.expectOne(deploymentService.url + '/' + deployment.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      deploymentService.findOne(deployment.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(deploymentService.url + '/' + deployment.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const deployment: Deployment = TestDomain.DEPLOYMENT;
    const expected: WinResponse<Deployment> = {meta: null, data: deployment};

    it('should create a deployment and return it', () => {
      deploymentService.create(deployment)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created deployment');
          });

      const req = httpTester.expectOne(deploymentService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const deployment: Deployment = TestDomain.DEPLOYMENT;
    const expected: WinResponse<Deployment> = {meta: null, data: deployment};

    it('should update a deployment and return it', () => {
      deploymentService.update(deployment)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated deployment');
          });

      const req = httpTester.expectOne(deploymentService.url + '/' + deployment.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      deploymentService.update(deployment)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(deploymentService.url + '/' + deployment.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const deployment: Deployment = TestDomain.DEPLOYMENT;
    const expected: WinResponse<Deployment> = {meta: null, data: null};

    it('should delete a deployment', () => {
      deploymentService.delete(deployment)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no deployment');
          });

      const req = httpTester.expectOne(deploymentService.url + '/' + deployment.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      deploymentService.delete(deployment)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(deploymentService.url + '/' + deployment.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
