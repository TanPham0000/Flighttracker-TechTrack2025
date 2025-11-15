/**
 * getFlightDuration
 * Berekent de duur van een vlucht op basis van departure/arrival tijden.
 * We proberen eerst "estimated", anders "scheduled".
 *
 * @param {any} flight - complete flight object
 * @returns {string} - bijv. "2 uur 15 min" of "Onbekend"
 */
export function getFlightDuration(flight) {
  if (!flight || !flight.departure || !flight.arrival) {
    return "Onbekend";
  }

  const depStr = flight.departure.estimated || flight.departure.scheduled;
  const arrStr = flight.arrival.estimated || flight.arrival.scheduled;

  if (!depStr || !arrStr) return "Onbekend";

  const dep = new Date(depStr);
  const arr = new Date(arrStr);

  if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return "Onbekend";

  const diffMs = arr.getTime() - dep.getTime();
  if (diffMs <= 0) return "Onbekend";

  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let result = "";
  if (hours > 0) result += `${hours} uur `;
  result += `${minutes} min`;

  return result;
}