import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {MulesoftApiService} from '..';
import {MulesoftApi, TestDomain, WinResponse} from '../../model';

describe('MulesoftApiService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let mulesoftApiService: MulesoftApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MulesoftApiService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    mulesoftApiService = TestBed.get(MulesoftApiService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([MulesoftApiService], (service: MulesoftApiService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<MulesoftApi[]> = {meta: null, data: [TestDomain.MULESOFT_API]};
    const noResults: WinResponse<MulesoftApi[]> = {meta: null, data: []};

    it('should return expected mulesoft apis', () => {
      mulesoftApiService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected mulesoft apis');
        });

      const req = httpTester.expectOne(mulesoftApiService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no mulesoft apis are returned', () => {
      mulesoftApiService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(mulesoftApiService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected mulesoft apis (called multiple times)', () => {
      mulesoftApiService.findAll().subscribe();
      mulesoftApiService.findAll().subscribe();
      mulesoftApiService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected mulesoft apis');
        });

      const requests = httpTester.match(mulesoftApiService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });
});
