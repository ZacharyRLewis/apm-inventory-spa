import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {HostServerService} from '..';
import {HostServer, TestDomain, WinResponse} from '../../model';

describe('HostServerService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let hostServerService: HostServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HostServerService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    hostServerService = TestBed.get(HostServerService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([HostServerService], (service: HostServerService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<HostServer[]> = {meta: null, data: [TestDomain.APPLICATION_TYPE]};
    const noResults: WinResponse<HostServer[]> = {meta: null, data: []};

    it('should return expected hostServers', () => {
      hostServerService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected hostServers');
        });

      const req = httpTester.expectOne(hostServerService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no hostServers are returned', () => {
      hostServerService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(hostServerService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected hostServers (called multiple times)', () => {
      hostServerService.findAll().subscribe();
      hostServerService.findAll().subscribe();
      hostServerService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected hostServers');
        });

      const requests = httpTester.match(hostServerService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const hostServer: HostServer = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<HostServer> = {meta: null, data: hostServer};

    it('should find one hostServer and return it', () => {
      hostServerService.findOne(hostServer.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the hostServer');
          }
        );

      const req = httpTester.expectOne(hostServerService.url + '/' + hostServer.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      hostServerService.findOne(hostServer.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(hostServerService.url + '/' + hostServer.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const hostServer: HostServer = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<HostServer> = {meta: null, data: hostServer};

    it('should create a hostServer and return it', () => {
      hostServerService.create(hostServer)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created hostServer');
          });

      const req = httpTester.expectOne(hostServerService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const hostServer: HostServer = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<HostServer> = {meta: null, data: hostServer};

    it('should update a hostServer and return it', () => {
      hostServerService.update(hostServer)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated hostServer');
          });

      const req = httpTester.expectOne(hostServerService.url + '/' + hostServer.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      hostServerService.update(hostServer)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(hostServerService.url + '/' + hostServer.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const hostServer: HostServer = TestDomain.APPLICATION_TYPE;
    const expected: WinResponse<HostServer> = {meta: null, data: null};

    it('should delete a hostServer', () => {
      hostServerService.delete(hostServer)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no hostServer');
          });

      const req = httpTester.expectOne(hostServerService.url + '/' + hostServer.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      hostServerService.delete(hostServer)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(hostServerService.url + '/' + hostServer.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
