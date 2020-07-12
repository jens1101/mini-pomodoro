import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

export function CountdownTimer({
  id = "",
  startButton = <FontAwesomeIcon icon={faPlay} />,
  stopButton = <FontAwesomeIcon icon={faStop} />,
  durationMs = 25 * 60 * 1000,
  timeLeftMs = durationMs,
  isRunning = false,
  onStart = () => {},
  onStop = () => {},
  onComplete = () => {},
}) {
  const [_timeLeftMs, setTimeLeftMs] = useState(timeLeftMs);
  const [countdownReference, setCountdownReference] = useState(null);

  async function startCountdown() {
    const startTimestamp = Date.now();
    const countdownReference = countdown(startTimestamp, _timeLeftMs);
    setCountdownReference(countdownReference);

    onStart({ id, startTimestamp });

    for await (const { timeLeftMs } of countdownReference) {
      setTimeLeftMs(timeLeftMs);
    }

    await reset();
    onComplete({ id });
  }

  async function stopCountdown() {
    await reset();
    onStop();
  }

  async function reset() {
    if (countdownReference) await countdownReference.return(undefined);
    setCountdownReference(null);
    setTimeLeftMs(durationMs);
  }

  return (
    <Card className={"text-center bg-dark text-light"}>
      <Card.Body>
        <Card.Title>{durationToDisplayString(_timeLeftMs)}</Card.Title>
        <ProgressBar now={(_timeLeftMs / durationMs) * 100} />
      </Card.Body>
      <Card.Footer>
        <Button
          onClick={startCountdown}
          variant={"primary"}
          type="button"
          disabled={countdownReference != null}
        >
          {startButton}
        </Button>
        <Button
          onClick={stopCountdown}
          variant={"primary"}
          type="button"
          disabled={countdownReference == null}
        >
          {stopButton}
        </Button>
      </Card.Footer>
    </Card>
  );
}

async function* countdown(startTimestamp, durationMs, tickSize = 1000) {
  let elapsedMs = 0;

  while (elapsedMs < durationMs) {
    let inaccuracy = Date.now() - startTimestamp - elapsedMs;

    if (inaccuracy > tickSize) {
      const mod = inaccuracy % tickSize;
      elapsedMs = elapsedMs + inaccuracy - mod;
      inaccuracy = mod;
    }

    const nextTickSize = tickSize - inaccuracy;

    await new Promise((resolve) => setTimeout(resolve, nextTickSize));

    elapsedMs += tickSize;

    yield {
      timeLeftMs: durationMs - elapsedMs,
      elapsedMs,
      durationMs,
    };
  }
}

/**
 * Converts the given number of milliseconds into a timer display string.
 * Hours, minutes, and seconds are separated by colons.
 * @nosideeffects
 * @param {number} durationMs The duration in milliseconds.
 * @return {string} A human readable string representing the specified
 * duration.
 */
function durationToDisplayString(durationMs) {
  const durationSeconds = durationMs / 1000;
  const seconds = `${Math.floor(durationSeconds % 60)}`.padStart(2, "0");

  const durationMinutes = durationSeconds / 60;
  const minutes = `${Math.floor(durationMinutes % 60)}`.padStart(2, "0");

  const hours = `${Math.floor(minutes / 60)}`.padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
