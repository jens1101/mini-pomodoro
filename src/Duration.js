import { Fragment } from "react";

/**
 * Converts the given duration into hours, minutes, and seconds strings.
 * @nosideeffects
 * @param {number} durationMs The duration in milliseconds.
 * @return {{hours: string, seconds: string, minutes: string}}
 */
function durationToDisplayStrings(durationMs) {
  const durationSeconds = durationMs / 1000;
  const seconds = `${Math.floor(durationSeconds % 60)}`.padStart(2, "0");

  const durationMinutes = durationSeconds / 60;
  const minutes = `${Math.floor(durationMinutes % 60)}`.padStart(2, "0");

  const hours = `${Math.floor(minutes / 60)}`.padStart(2, "0");

  return {
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
  const { hours, minutes, seconds } = durationToDisplayStrings(durationMs);

  return (
    <Fragment>
      <span className={"text-nowrap"}>{hours}</span>
      <span className={"text-nowrap"}>:{minutes}</span>
      <span className={"text-nowrap"}>:{seconds}</span>
    </Fragment>
  );
}
