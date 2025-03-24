const T_INDEX = 8;
const Z_INDEX = 15;

/**
 * Parse a stringly typed iCal formatted date as a native JS date object
 * @param {string} date
 * @param {string} timezone
 * @return {Date}
 */
export default function iCalDateParser(date, timezone) {
  if (!_validateFormat(date, timezone)) {
    throw new Error('Not a valid iCal date format');
  }

  const year = date.substr(0, 4);
  const month = parseInt(date.substr(4, 2), 10) - 1;
  const day = date.substr(6, 2);
  const hour = date.substr(9, 2);
  const minute = date.substr(11, 2);
  const second = date.substr(13, 2);

  let timezoneOffset = 0;
  if (timezone) {
    const offsetInMinutes = _getTimeZoneOffset(timezone) * -1;
    timezoneOffset = offsetInMinutes * 60000;
  }

  return new Date(Date.UTC(year, month, day, hour, minute, second) + timezoneOffset);
}

/**
 * Check whether or not a given date is a valid iCal formatted date
 * @param {string} date
 * @param {string} timezone
 * @return {boolean}
 * @private
 */
function _validateFormat(date, timezone) {
  const d = date.split('');

  if (d[T_INDEX] !== 'T') return false;

  if (!timezone) {
    if (d.length !== 16) return false;
    if (d[Z_INDEX] !== 'Z') return false;
  } else {
    if (d.length !== 15) return false;
  }

  return d
    .filter((x, i) => i !== T_INDEX && i !== Z_INDEX)
    .every(x => !isNaN(parseInt(x)));
}

/**
 * Get the time zone offset in minutes for a given time zone
 * @param {string} timezone
 * @returns {number}
 * @private
 */
function _getTimeZoneOffset(timezone) {
  const str = new Date().toLocaleString('en', {
    timeZone: timezone,
    timeZoneName: 'longOffset'
  });

  const [_,h,m] = str.match(/([+-]\d+):(\d+)$/) || [, '+00', '00'];

  return h * 60 + (h > 0 ? +m : -m);
}