# fixed-array

A simple fixed-size array/history for node.js with some light statistical methods. Intended for use with numeric values, e.g. what were the response times for the last 100 requests processed, and what were their min, max, and mean.

```javascript
var fa = require("fixed-array");

var request_log = fa.newFixedValueHistory(100);

// ... in your http server after processing your requests:
  request_log.push(request_time);

// ... later, when you're interested in looking at stats:
  var min = request_log.min();
  var max = request_log.max();
  var mean = request_log.mean();
```

Another example use it to easily track the min and max values of a series:
```javascript
  var ts_range = newFixedValueHistory(2);
  var db_results = ...;
  for (var i = 0; i < db_results.length; i++) {
    // do something with the results...
    ts_range.push(db_results[i].timestamp);
  }

  some_function(ts_range.min(), ts_range.max());
```

Versus:
```javascript
  var min, max;
  var db_results = ...;
  for (var i = 0; i < db_results.length; i++) {
    // do something with the results...
    if (isNaN(min) || db_results[i].timestamp < min) {
      if (!isNaN(db_results[i].timestamp)) {
        min = db_results[i].timestamp;
      }
    }
    if (isNaN(max) || db_results[i].timestamp > max) {
      if (!isNaN(db_results[i].timestamp)) {
        max = db_results[i].timestamp;
      }
    }
  }

  some_function(min, max);
```

install
=======

with [npm](http://npmjs.org), do:

    npm install fixed-array

browser version
===============

`fixed-array.min.js` is a minified version that should work in your browser. This has not been fully tested for compatibility, so please let me know if you run into any issues.

methods
=======

fa.newFixedValueHistory(length[, initial_values])
==========================================================

Create a new fixed-length value history of length `length` with optional `initial_values`

.push(value) .push([values])
============================

Push the specified value(s) onto the fixed array, removing any older values (in order) required to maintain the fixed-length.

.min()
=========

Return the smallest value in the current data. If any NaN entries are present, returns NaN.

.max()
=========

Return the largest value in the current data. If any NaN entries are present, returns NaN.

.mean()
==========

Calculate and return the mean of the current data. Any non-numeric items will be considered NULL during sum, affecting the mean.

.length()
============

Return the current length of the dataset.

.sum
=======

Return the sum of the current data. Any non-numeric items will be skipped in the sum.

.values()
============

Returns a *copy* of the values currently stored.
