(function(root) {
  var gbbox = {};

  gbbox.API = function(endPoint, token) {
    this._endPoint = endPoint;
    this._token = token;
  };

  gbbox.API.prototype.sendPageview = function(path) {
    path = path || location.href.match(/https?:\/\/[^/]+(.*)/)[1];
    var apiUrl =
      this._endPoint +
      '/logs/' + this._token +
      '?tid=' + getTID(this._endPoint) +
      '&q=' + encodeURIComponent(path) +
      '&dummy=' + (Date.now() * 100 + (Math.random() * 100)|0);
    var beacon = new Image();
    beacon.src = apiUrl;
  };

  gbbox.API.prototype.route = function(expIds, callback) {
    var assignmentsStr = getCookie(this._endPoint, '_gb_routes');
    if(assignmentsStr) {
      callback(JSON.parse(assignmentsStr));
    } else {
      this._route(expIds, callback);
    }
  };

  gbbox.API.prototype._route = function(expIds, callback) {
    var self = this;
    root._gb_route_callback = function(assignments, minTtl) {
        // Parse arm-id string
        for(var expId in assignments) {
          var assignment = assignments[expId];
          var armId = assignment['arm_id'];
          assignment.arms = {};

          var pairs = armId.split(',');
          for(var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var tokens = pair.split('/');
            assignment.arms[tokens[0]] = tokens[1];
          }
        }

        // Save assignments to cookie
        var expires = new Date(Date.now() + minTtl * 1000);
        setCookie(self._endPoint, '_gb_routes', JSON.stringify(assignments), expires)

        // Done
        callback(assignments);
    };

    // Call /routes_by_token
    var jsonpScript = document.createElement('script')
    jsonpScript.src = this._endPoint +
      '/routes_by_token/' + this._token +
      '?_accept=text/javascript' +
      '&exp_ids=' + encodeURIComponent(expIds.join(',')) +
      '&tid=' + getTID(this._endPoint);
    document.head.appendChild(jsonpScript);
  }

  function getTID(endPoint) {
    var tid = getCookie(endPoint, '_gb_tid');
    if(tid) return tid;

    // Generate tid
    var chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var len = 16;
    var tidChars = ['_'];
    for(var i = 0; i < len; i++) {
      tidChars.push(chars[(Math.random() * chars.length)|0]);
    }
    var tid = tidChars.join('');
    setCookie(endPoint, '_gb_tid', tid, new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000));
    return tid;
  }

  function setCookie(endPoint, key, value, expires) {
    key = key + '_' + hash(endPoint);
    cookie = key + '=' + value + '; path=/; expires=' + expires.toUTCString();
    document.cookie = cookie;
  }

  function getCookie(endPoint, key) {
    key = key + '_' + hash(endPoint);
    var pairs = document.cookie.split(';');
    for(var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].trim();
      var splitIndex = pair.indexOf('=');
      var k = pair.substr(0, splitIndex);
      var v = pair.substr(splitIndex + 1);
      if(key === k) return v;
    }
    return null;
  }

  function hash(value) {
    var state = 5381;
    for(var i = 0; i < value.length; i++) {
      state = ((state << 5) + state + value.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return Math.abs(state);
  }

  root._gbbox = gbbox;
})(window);

