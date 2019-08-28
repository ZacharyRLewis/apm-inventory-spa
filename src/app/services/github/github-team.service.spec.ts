import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {GithubTeamService} from '..';
import {GithubTeam, TestDomain, WinResponse} from '../../model';

describe('GithubTeamService', () => {
  let http: HttpClient;
  let httpTester: HttpTestingController;
  let githubTeamService: GithubTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubTeamService]
    });

    http = TestBed.get(HttpClient);
    httpTester = TestBed.get(HttpTestingController);
    githubTeamService = TestBed.get(GithubTeamService);
  });

  afterEach(() => {
    httpTester.verify();
  });

  it('should be created', inject([GithubTeamService], (service: GithubTeamService) => {
    expect(service).toBeTruthy();
  }));

  describe('#findAll()', () => {
    const expected: WinResponse<GithubTeam[]> = {meta: null, data: [TestDomain.GITHUB_TEAM]};
    const noResults: WinResponse<GithubTeam[]> = {meta: null, data: []};

    it('should return expected teams', () => {
      githubTeamService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(1, 'should return expected team');
        });

      const req = httpTester.expectOne(githubTeamService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(expected);
    });

    it('should be okay if no teams are returned', () => {
      githubTeamService.findAll()
        .subscribe(res => {
          expect(res.data.length).toEqual(0, 'should have empty array');
        });

      const req = httpTester.expectOne(githubTeamService.url);
      expect(req.request.method).toEqual('GET');

      req.flush(noResults);
    });

    it('should return expected teams (called multiple times)', () => {
      githubTeamService.findAll().subscribe();
      githubTeamService.findAll().subscribe();
      githubTeamService.findAll()
        .subscribe(res => {
          expect(res).toEqual(expected, 'should return expected teams');
        });

      const requests = httpTester.match(githubTeamService.url);
      expect(requests.length).toEqual(3, 'calls to findAll()');

      requests[0].flush(noResults);
      requests[1].flush(noResults);
      requests[2].flush(expected);
    });
  });
});
