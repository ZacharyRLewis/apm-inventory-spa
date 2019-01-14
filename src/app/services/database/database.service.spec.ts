import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed, inject} from '@angular/core/testing';
import {Database, WinResponse} from '../../model';
import {TestDomain} from '../../model/test-domain';
import {DatabaseService} from './database.service';

describe('DatabaseService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let databaseService: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatabaseService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    databaseService = TestBed.get(DatabaseService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([DatabaseService], (service: DatabaseService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<Database[]> = {meta: null, data: [TestDomain.DATABASE]};
    const noResults: WinResponse<Database[]> = {meta: null, data: []};

    it('should return expected databases', () => {
      databaseService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected databases');
        });

      const req = httpTester.expectOne(databaseService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no databases are returned', () => {
      databaseService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(databaseService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected databases (called multiple times)', () => {
      databaseService.findAll().subscribe();
      databaseService.findAll().subscribe();
      databaseService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected heroes');
        });

      const requests = httpTester.match(databaseService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });

  describe('#findOne()', () => {
    const database: Database = TestDomain.DATABASE;
    const expected: WinResponse<Database> = {meta: null, data: database};

    it('should find one database and return it', () => {
      databaseService.findOne(database.id)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the database');
          }
        );

      const req = httpTester.expectOne(databaseService.url + '/' + database.id);
      expect(req.request.method).toEqual('GET');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      databaseService.findOne(database.id)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(databaseService.url + '/' + database.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#create()', () => {
    const database: Database = TestDomain.DATABASE;
    const expected: WinResponse<Database> = {meta: null, data: database};

    it('should create an database and return it', () => {
      databaseService.create(database)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the created database');
          });

      const req = httpTester.expectOne(databaseService.url);
      expect(req.request.method).toEqual('POST');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });
  });

  describe('#update()', () => {
    const database: Database = TestDomain.DATABASE;
    const expected: WinResponse<Database> = {meta: null, data: database};

    it('should update an database and return it', () => {
      databaseService.update(database)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return the updated database');
          });

      const req = httpTester.expectOne(databaseService.url + '/' + database.id);
      expect(req.request.method).toEqual('PUT');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      databaseService.update(database)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(databaseService.url + '/' + database.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });

  describe('#delete()', () => {
    const database: Database = TestDomain.DATABASE;
    const expected: WinResponse<Database> = {meta: null, data: null};

    it('should delete an database', () => {
      databaseService.delete(database)
        .subscribe(
          res => {
            expect(res).toEqual(expected, 'should return no database');
          });

      const req = httpTester.expectOne(databaseService.url + '/' + database.id);
      expect(req.request.method).toEqual('DELETE');

      const expectedResponse = new HttpResponse({status: 200, statusText: 'OK', body: expected});
      req.event(expectedResponse);
    });

    it('should handle 404', () => {
      databaseService.delete(database)
        .subscribe(res => {
            expect(res.data).toEqual({}, 'should be empty');
          },
          err => {
          });

      const req = httpTester.expectOne(databaseService.url + '/' + database.id);

      req.flush({}, {status: 404, statusText: 'Not Found'});
    });
  });
});
