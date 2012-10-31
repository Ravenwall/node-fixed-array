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

install
=======

with [npm](http://npmjs.org), do:

    npm install fixed-array

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
