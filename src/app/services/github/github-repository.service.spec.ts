import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {GithubRepositoryService} from '..';
import {GithubRepository, TestDomain, WinResponse} from '../../model';

describe('GithubRepositoryService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let githubRepositoryService: GithubRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubRepositoryService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    githubRepositoryService = TestBed.get(GithubRepositoryService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([GithubRepositoryService], (service: GithubRepositoryService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<GithubRepository[]> = {meta: null, data: [TestDomain.GITHUB_REPO]};
    const noResults: WinResponse<GithubRepository[]> = {meta: null, data: []};

    it('should return expected repositories', () => {
      githubRepositoryService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected repositories');
        });

      const req = httpTester.expectOne(githubRepositoryService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no repositories are returned', () => {
      githubRepositoryService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(githubRepositoryService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected repositories (called multiple times)', () => {
      githubRepositoryService.findAll().subscribe();
      githubRepositoryService.findAll().subscribe();
      githubRepositoryService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected repositories');
        });

      const requests = httpTester.match(githubRepositoryService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });
});
