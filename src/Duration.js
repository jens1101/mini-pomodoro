import { Fragment } from "react";

/**
 * An object representing a formatted duration.
 * @typedef {Object} DurationDisplay
 * @property {boolean} isNegative Whether or not the duration is negative.
 * @property {string} hours The hours left in this duration.
 * @property {string} minutes The minutes left in this duration.
 * @property {string} seconds The seconds left in this duration.
 */

/**
 * Converts the given duration into hours, minutes, and seconds strings.
 * @nosideeffects
 * @param {number} durationMs The duration in milliseconds.
 * @return {DurationDisplay}
 */
function durationToDisplayStrings(durationMs) {
  const isNegative = durationMs < 0;
  durationMs = Math.abs(durationMs);

  const durationSeconds = durationMs / 1000;
  const seconds = `${Math.floor(durationSeconds % 60)}`.padStart(2, "0");

  const durationMinutes = durationSeconds / 60;
  const minutes = `${Math.floor(durationMinutes % 60)}`.padStart(2, "0");

  const hours = `${Math.floor(durationMinutes / 60)}`.padStart(2, "0");

  return {
    isNegative,
    hours,
    minutes,
    seconds,
  };
}

/**
 * Component that displays the specified duration as a formatted string.
 * @param {number} durationMs The duration (in milliseconds) that needs to be
 * displayed.
 * @return {JSX.Element}
 */
export function Duration({ durationMs }) {
  const { isNegative, hours, minutes, seconds } =
    durationToDisplayStrings(durationMs);

  return (
    <Fragment>
      <span className={"text-nowrap"}>
        {isNegative ? "-" : ""}
        {hours}
      </span>
      <span className={"text-nowrap"}>:{minutes}</span>
      <span className={"text-nowrap"}>:{seconds}</span>
    </Fragment>
  );
}
