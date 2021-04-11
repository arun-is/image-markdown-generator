const subSecondStops = [
  10,
  13,
  15,
  20,
  25,
  30,
  40,
  50,
  60,
  80,
  100,
  125,
  160,
  200,
  250,
  320,
  400,
  500,
  640,
  800,
  1000
]

const findClosest = (arr, search) => {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - search) < Math.abs(prev - search) ? curr : prev
  )
}

const exposureTimeToHuman = exposureTime => {
  // above 1s
  if (exposureTime >= 1) {
    return `${exposureTime}`
  }

  // no remainder, is an integer
  if ((1 / exposureTime) % 1 === 0) {
    return `1/${1 / exposureTime}`
  }

  // exact match in our table? use it
  const rounded = Math.round(1 / exposureTime)
  if (subSecondStops.includes(rounded)) {
    return `1/${rounded}`
  }

  // otherwise attempt for the closest
  const closest = findClosest(subSecondStops, 1 / exposureTime)
  if (closest) {
    return `1/${closest}`
  }

  throw "Error: No match - this should not happen"
}

module.exports = {
  exposureTimeToHuman
}
