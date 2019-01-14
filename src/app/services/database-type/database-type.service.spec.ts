import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed, inject} from '@angular/core/testing';
import {DatabaseType, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {DatabaseTypeService} from './database-type.service';

describe('DatabaseTypeService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let databaseTypeService: DatabaseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatabaseTypeService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    databaseTypeService = TestBed.get(DatabaseTypeService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([DatabaseTypeService], (service: DatabaseTypeService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<DatabaseType[]> = {meta: null, data: [TestDomain.DATABASE_TYPE]};
    const noResults: WinResponse<DatabaseType[]> = {meta: null, data: []};

    it('should return expected databaseTypes', () => {
      databaseTypeService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected databaseTypes');
        });

      const req = httpTester.expectOne(databaseTypeService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no databaseTypes are returned', () => {
      databaseTypeService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(databaseTypeService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected databaseTypes (called multiple times)', () => {
      databaseTypeService.findAll().subscribe();
      databaseTypeService.findAll().subscribe();
      databaseTypeService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(databaseTypeService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const databaseType: DatabaseType = TestDomain.DATABASE_TYPE;
    const expected: WinResponse<DatabaseType> = {meta: null, data: databaseType};

    it('should find one databaseType and return it', () => {
      databaseTypeService.findOne(databaseType.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the databaseType');
          }
        );

      const req = httpTester.expectOne(databaseTypeService.url + '/' + databaseType.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      databaseTypeService.findOne(databaseType.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(databaseTypeService.url + '/' + databaseType.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const databaseType: DatabaseType = TestDomain.DATABASE_TYPE;
    const expected: WinResponse<DatabaseType> = {meta: null, data: databaseType};

    it('should create an databaseType and return it', () => {
      databaseTypeService.create(databaseType)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created databaseType');
          });

      const req = httpTester.expectOne(databaseTypeService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const databaseType: DatabaseType = TestDomain.DATABASE_TYPE;
    const expected: WinResponse<DatabaseType> = {meta: null, data: databaseType};

    it('should update an databaseType and return it', () => {
      databaseTypeService.update(databaseType)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated databaseType');
          });

      const req = httpTester.expectOne(databaseTypeService.url + '/' + databaseType.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      databaseTypeService.update(databaseType)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(databaseTypeService.url + '/' + databaseType.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const databaseType: DatabaseType = TestDomain.DATABASE_TYPE;
    const expected: WinResponse<DatabaseType> = {meta: null, data: null};

    it('should delete an databaseType', () => {
      databaseTypeService.delete(databaseType)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no databaseType');
          });

      const req = httpTester.expectOne(databaseTypeService.url + '/' + databaseType.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      databaseTypeService.delete(databaseType)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(databaseTypeService.url + '/' + databaseType.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
