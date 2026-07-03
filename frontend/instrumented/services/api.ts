function cov_1uynqkhgmq() {
  var path = "/home/titi/projects/formation/projet4/DFSJS-Testez-et-am-liorez-une-application-full-stack-JavaScript/frontend/src/services/api.ts";
  var hash = "871e68ea160d9378233c5f9bd30b36f605dfe864";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/home/titi/projects/formation/projet4/DFSJS-Testez-et-am-liorez-une-application-full-stack-JavaScript/frontend/src/services/api.ts",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 12
        },
        end: {
          line: 9,
          column: 2
        }
      },
      "1": {
        start: {
          line: 11,
          column: 0
        },
        end: {
          line: 22,
          column: 2
        }
      },
      "2": {
        start: {
          line: 13,
          column: 24
        },
        end: {
          line: 13,
          column: 46
        }
      },
      "3": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 16,
          column: 5
        }
      },
      "4": {
        start: {
          line: 15,
          column: 6
        },
        end: {
          line: 15,
          column: 65
        }
      },
      "5": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 19
        }
      },
      "6": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 33
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        },
        loc: {
          start: {
            line: 12,
            column: 15
          },
          end: {
            line: 18,
            column: 3
          }
        },
        line: 12
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 19,
            column: 3
          }
        },
        loc: {
          start: {
            line: 19,
            column: 13
          },
          end: {
            line: 21,
            column: 3
          }
        },
        line: 19
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 14,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        }, {
          start: {
            line: undefined,
            column: undefined
          },
          end: {
            line: undefined,
            column: undefined
          }
        }],
        line: 14
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "871e68ea160d9378233c5f9bd30b36f605dfe864"
  };
  var coverage = global[gcv] || (global[gcv] = {});
  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }
  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1uynqkhgmq = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}
cov_1uynqkhgmq();
import axios from 'axios';
import { authService } from './auth.service';
const api = (cov_1uynqkhgmq().s[0]++, axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
}));
cov_1uynqkhgmq().s[1]++;
api.interceptors.request.use(request => {
  cov_1uynqkhgmq().f[0]++;
  const accessToken = (cov_1uynqkhgmq().s[2]++, authService.getToken());
  cov_1uynqkhgmq().s[3]++;
  if (accessToken) {
    cov_1uynqkhgmq().b[0][0]++;
    cov_1uynqkhgmq().s[4]++;
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    cov_1uynqkhgmq().b[0][1]++;
  }
  cov_1uynqkhgmq().s[5]++;
  return request;
}, error => {
  cov_1uynqkhgmq().f[1]++;
  cov_1uynqkhgmq().s[6]++;
  return Promise.reject(error);
});
export default api;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb3ZfMXV5bnFraGdtcSIsImFjdHVhbENvdmVyYWdlIiwiYXhpb3MiLCJhdXRoU2VydmljZSIsImFwaSIsInMiLCJjcmVhdGUiLCJiYXNlVVJMIiwiaGVhZGVycyIsImludGVyY2VwdG9ycyIsInJlcXVlc3QiLCJ1c2UiLCJmIiwiYWNjZXNzVG9rZW4iLCJnZXRUb2tlbiIsImIiLCJlcnJvciIsIlByb21pc2UiLCJyZWplY3QiXSwic291cmNlcyI6WyJhcGkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IGF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoLnNlcnZpY2UnO1xuXG5jb25zdCBhcGkgPSBheGlvcy5jcmVhdGUoe1xuICBiYXNlVVJMOiAnL2FwaScsXG4gIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB9LFxufSk7XG5cbmFwaS5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoXG4gIChyZXF1ZXN0KSA9PiB7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgIGlmIChhY2Nlc3NUb2tlbikge1xuICAgICAgcmVxdWVzdC5oZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7YWNjZXNzVG9rZW59YDtcbiAgICB9XG4gICAgcmV0dXJuIHJlcXVlc3Q7XG4gIH0sXG4gIChlcnJvcikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gIH0sXG4pO1xuXG5leHBvcnQgZGVmYXVsdCBhcGk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWVZO0lBQUFBLGNBQUEsWUFBQUEsQ0FBQTtNQUFBLE9BQUFDLGNBQUE7SUFBQTtFQUFBO0VBQUEsT0FBQUEsY0FBQTtBQUFBO0FBQUFELGNBQUE7QUFmWixPQUFPRSxLQUFLLE1BQU0sT0FBTztBQUN6QixTQUFTQyxXQUFXLFFBQVEsZ0JBQWdCO0FBRTVDLE1BQU1DLEdBQUcsSUFBQUosY0FBQSxHQUFBSyxDQUFBLE9BQUdILEtBQUssQ0FBQ0ksTUFBTSxDQUFDO0VBQ3ZCQyxPQUFPLEVBQUUsTUFBTTtFQUNmQyxPQUFPLEVBQUU7SUFDUCxjQUFjLEVBQUU7RUFDbEI7QUFDRixDQUFDLENBQUM7QUFBQ1IsY0FBQSxHQUFBSyxDQUFBO0FBRUhELEdBQUcsQ0FBQ0ssWUFBWSxDQUFDQyxPQUFPLENBQUNDLEdBQUcsQ0FDekJELE9BQU8sSUFBSztFQUFBVixjQUFBLEdBQUFZLENBQUE7RUFDWCxNQUFNQyxXQUFXLElBQUFiLGNBQUEsR0FBQUssQ0FBQSxPQUFHRixXQUFXLENBQUNXLFFBQVEsQ0FBQyxDQUFDO0VBQUNkLGNBQUEsR0FBQUssQ0FBQTtFQUMzQyxJQUFJUSxXQUFXLEVBQUU7SUFBQWIsY0FBQSxHQUFBZSxDQUFBO0lBQUFmLGNBQUEsR0FBQUssQ0FBQTtJQUNmSyxPQUFPLENBQUNGLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxVQUFVSyxXQUFXLEVBQUU7RUFDNUQsQ0FBQztJQUFBYixjQUFBLEdBQUFlLENBQUE7RUFBQTtFQUFBZixjQUFBLEdBQUFLLENBQUE7RUFDRCxPQUFPSyxPQUFPO0FBQ2hCLENBQUMsRUFDQU0sS0FBSyxJQUFLO0VBQUFoQixjQUFBLEdBQUFZLENBQUE7RUFBQVosY0FBQSxHQUFBSyxDQUFBO0VBQ1QsT0FBT1ksT0FBTyxDQUFDQyxNQUFNLENBQUNGLEtBQUssQ0FBQztBQUM5QixDQUNGLENBQUM7QUFFRCxlQUFlWixHQUFHIiwiaWdub3JlTGlzdCI6W119