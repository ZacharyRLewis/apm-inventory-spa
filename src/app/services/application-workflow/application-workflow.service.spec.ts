import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {ApplicationWorkflowService} from '..';
import {ApplicationWorkflow, TestDomain, WinResponse} from '../../model';

describe('ApplicationWorkflowService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let applicationWorkflowService: ApplicationWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationWorkflowService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    applicationWorkflowService = TestBed.get(ApplicationWorkflowService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([ApplicationWorkflowService], (service: ApplicationWorkflowService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<ApplicationWorkflow[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};
    const noResults: WinResponse<ApplicationWorkflow[]> = {meta: null, data: []};

    it('should return expected applicationWorkflows', () => {
      applicationWorkflowService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected applicationWorkflows');
        });

      const req = httpTester.expectOne(applicationWorkflowService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no applicationWorkflows are returned', () => {
      applicationWorkflowService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(applicationWorkflowService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected applicationWorkflows (called multiple times)', () => {
      applicationWorkflowService.findAll().subscribe();
      applicationWorkflowService.findAll().subscribe();
      applicationWorkflowService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected applicationWorkflows');
        });

      const requests = httpTester.match(applicationWorkflowService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const applicationWorkflow: ApplicationWorkflow = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationWorkflow> = {meta: null, data: applicationWorkflow};

    it('should find one applicationWorkflow and return it', () => {
      applicationWorkflowService.findOne(applicationWorkflow.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the applicationWorkflow');
          }
        );

      const req = httpTester.expectOne(applicationWorkflowService.url + '/' + applicationWorkflow.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationWorkflowService.findOne(applicationWorkflow.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationWorkflowService.url + '/' + applicationWorkflow.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const applicationWorkflow: ApplicationWorkflow = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationWorkflow> = {meta: null, data: applicationWorkflow};

    it('should create an applicationWorkflow and return it', () => {
      applicationWorkflowService.create(applicationWorkflow)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created applicationWorkflow');
          });

      const req = httpTester.expectOne(applicationWorkflowService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const applicationWorkflow: ApplicationWorkflow = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationWorkflow> = {meta: null, data: applicationWorkflow};

    it('should update an applicationWorkflow and return it', () => {
      applicationWorkflowService.update(applicationWorkflow)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated applicationWorkflow');
          });

      const req = httpTester.expectOne(applicationWorkflowService.url + '/' + applicationWorkflow.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationWorkflowService.update(applicationWorkflow)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationWorkflowService.url + '/' + applicationWorkflow.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const applicationWorkflow: ApplicationWorkflow = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<ApplicationWorkflow> = {meta: null, data: null};

    it('should delete an applicationWorkflow', () => {
      applicationWorkflowService.delete(applicationWorkflow)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no applicationWorkflow');
          });

      const req = httpTester.expectOne(applicationWorkflowService.url + '/' + applicationWorkflow.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      applicationWorkflowService.delete(applicationWorkflow)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(applicationWorkflowService.url + '/' + applicationWorkflow.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
