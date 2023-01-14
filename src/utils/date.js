export function parseDateTime (date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  var h = date.getHours()
  var mm = date.getMinutes()
  var s = date.getSeconds()
  if (m <= 9) m = "0" + m
  if (d <= 9) d = "0" + d
  if (h <= 9) h = "0" + h
  if (mm <= 9) mm = "0" + mm
  if (s <= 9) s = "0" + s
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
}

export function parseDate (date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  if (m <= 9) m = "0" + m
  if (d <= 9) d = "0" + d
  var cdate = y + "-" + m + "-" + d
  return cdate
}
export function addDays (date, days) {
  var nd = new Date(date)
  nd = nd.valueOf()
  nd = nd + days * 24 * 60 * 60 * 1000
  nd = new Date(nd)
  return parseDate(nd)
}

export function getToday () {
  return parseDate(new Date())
}

export function getYesterday () {
  var today = parseDate(new Date())
  today = addDays(today, -1)
  return parseDate(new Date(today))
}
export function getCurrentYearMonth () {
  var date = new Date()
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  if (m <= 9) m = "0" + m
  var cdate = y + "-" + m
  return cdate
}

export function getLastYearMonth () {
  var date = new Date()
  var y = date.getFullYear()
  var m = date.getMonth()
  if (m <= 9) m = "0" + m
  var cdate = y + "-" + m
  return cdate
}