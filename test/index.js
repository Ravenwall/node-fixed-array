var test = require("tape").test
var fa

test("load", function (t) {
  t.plan(1)

  fa = require("../fixed-array")
  t.ok(fa, "loaded module")

  t.end()
})

// create
test("create-empty", function (t) {
  t.plan(8)

  var fvh = fa(100)
  t.ok(fvh instanceof fa, "Type should be a FixedValueHistory")
  t.equal(fvh.length(), 0, "Initial length is 0")
  t.equal(fvh.sum, 0, "Initial sum is 0")
  t.ok(isNaN(fvh.min()), "Initial min is NaN")
  t.ok(isNaN(fvh.max()), "Initial max is NaN")
  t.ok(isNaN(fvh.mean()), "Initial mean is NaN")
  t.ok(isNaN(fvh.variance()), "Initial variance is NaN")

  var expected = []
  t.deepEqual(fvh.values(), expected)

  t.end()
})
test("create-populated", function (t) {
  t.plan(7)

  var initial = [10, 0, 3, 11, 20, 22, 2, 99, 19]
  var fvh = fa(100, initial)
  t.ok(fvh instanceof fa, "Type should be a FixedValueHistory")
  t.equal(fvh.length(), initial.length, "Initial length is matches initial input")
  t.equal(fvh.sum, 186, "Initial sum is 186")
  t.equal(fvh.min(), 0, "Initial min is 0")
  t.equal(fvh.max(), 99, "Initial max is 99")
  t.equal(fvh.mean(), 186/9, "Initial mean is 186 / 9")
  t.equal(fvh.variance(), 7436/9, "Initial variance is 7436 / 9")

  t.end()
})
test("create-overpopulated", function (t) {
  t.plan(8)

  var initial = [10, 0, 3, 11, 20, 22, 2, 99, 19]
  var max_length = 5
  var fvh = fa(max_length, initial)
  t.ok(fvh instanceof fa, "Type should be a FixedValueHistory")
  t.equal(fvh.length(), max_length, "Initial length is truncated to max_length")
  t.equal(fvh.sum, 162, "Initial sum is 162")
  t.equal(fvh.min(), 2, "Initial min is 2")
  t.equal(fvh.max(), 99, "Initial max is 99")
  t.equal(fvh.mean(), 162/5, "Initial mean is 162 / 5")
  t.equal(fvh.variance(), 5801.2/5, "Initial variance is 5801.2 / 5")

  var expected = [20, 22, 2, 99, 19]
  t.deepEqual(fvh.values(), expected)

  t.end()
})

// push
test("push", function (t) {
  t.plan(31)

  var max_length = 5
  var fvh = fa(max_length)
  fvh.push(1)
  t.equal(fvh.length(), 1, "Length shows value pushed")
  t.equal(fvh.sum, 1)
  t.equal(fvh.min(), 1)
  t.equal(fvh.max(), 1)
  t.equal(fvh.mean(), 1)
  t.equal(fvh.variance(), 0)

  fvh.push(9)
  t.equal(fvh.length(), 2, "Length shows value pushed")
  t.equal(fvh.sum, 10)
  t.equal(fvh.min(), 1)
  t.equal(fvh.max(), 9)
  t.equal(fvh.mean(), 5)
  t.equal(fvh.variance(), 16)

  fvh.push([5, 5])
  t.equal(fvh.length(), 4, "Length shows values pushed")
  t.equal(fvh.sum, 20)
  t.equal(fvh.min(), 1)
  t.equal(fvh.max(), 9)
  t.equal(fvh.mean(), 5)
  t.equal(fvh.variance(), 8, "variance " + fvh.variance() + " should equal 8")

  fvh.push([5, 5])
  t.equal(fvh.length(), max_length, "Length shows values pushed and one expired")
  t.equal(fvh.sum, 29)
  t.equal(fvh.min(), 5)
  t.equal(fvh.max(), 9)
  t.equal(fvh.mean(), 29/5)
  t.equal(fvh.variance().toFixed(6), "2.560000") //javascript is unable to accurately store 2.56 due to floating point issues.

  // Pushing on more than max_length
  fvh.push([1, 1, 1, 1, 1, 1])
  t.equal(fvh.length(), max_length, "Length shows values pushed and one expired")
  t.equal(fvh.sum, 5)
  t.equal(fvh.min(), 1)
  t.equal(fvh.max(), 1)
  t.equal(fvh.mean(), 1)
  t.equal(fvh.variance(), 0)

  var expected = [1, 1, 1, 1, 1]
  t.deepEqual(fvh.values(), expected)

  t.end()
})

// non-numeric input
test("non-numeric", function (t) {
  t.plan(13)

  var max_length = 5
  var fvh = fa(max_length)
  fvh.push("cat")
  t.equal(fvh.length(), 1, "Length shows value pushed")
  t.equal(fvh.sum, 0)
  t.ok(isNaN(fvh.min()), "Initial min is NaN")
  t.ok(isNaN(fvh.max()), "Initial max is NaN")
  t.equal(fvh.mean(), 0, "Mean adjusted for NaN values as NULL")
  t.equal(fvh.variance(), 0, "Variance adjusted for NaN values as NULL")

  fvh.push(1)
  t.equal(fvh.length(), 2, "Length shows value pushed")
  t.equal(fvh.sum, 1)
  t.ok(isNaN(fvh.min()), "min when there is a NaN is NaN")
  t.ok(isNaN(fvh.max()), "max when there is a NaN is NaN")
  t.equal(fvh.mean(), 1/2, "Mean adjusted for NaN values as NULL")
  t.equal(fvh.variance(), 0.25, "Variance adjusted for NaN values as NULL ("+fvh.variance()+" == 0.25)")

  var expected = ["cat", 1]
  t.deepEqual(fvh.values(), expected)

  t.end()
})
