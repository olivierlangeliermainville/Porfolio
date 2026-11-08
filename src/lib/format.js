/** A number on two digits, ex: `03` for 3 */
export const padNumber = (number) => String(number).padStart(2, '0');

/** The number shown for an item of a list, from its index: `01` for the first one */
export const formatIndex = (index) => padNumber(index + 1);

/** The time in `timeZone`, ex: `14:05` */
export const formatTime = (date, timeZone) =>
  new Intl.DateTimeFormat('en-CA', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).format(date);
