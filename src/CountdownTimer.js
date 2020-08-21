import React, { useEffect, useState } from "react";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

export function CountdownTimer({
  id = "",
  startButton = <FontAwesomeIcon icon={faPlay} />,
  stopButton = <FontAwesomeIcon icon={faStop} />,
  durationMs = 25 * 60 * 1000,
  startTimestamp = null,
  onStart = () => {},
  onStop = () => {},
  onComplete = () => {},
}) {
  const [_startTimestamp, setStartTimestamp] = useState(startTimestamp);
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);

  useEffect(() => {
    if (_startTimestamp == null) {
      setTimeLeftMs(durationMs);
      onStop({ id });
      return;
    }

    const countdownReference = countdown(_startTimestamp, durationMs);
    let countdownAborted = false;

    onStart({ id, _startTimestamp });

    (async () => {
      for await (const { timeLeftMs } of countdownReference) {
        if (countdownAborted) return;

        setTimeLeftMs(timeLeftMs);
      }
    })().then(() => {
      if (countdownAborted) return;

      setStartTimestamp(null);
      setTimeLeftMs(durationMs);

      onComplete({ id });
    });

    return () => {
      void countdownReference.return(undefined);
      countdownAborted = true;
    };
  }, [_startTimestamp, durationMs, id, onComplete, onStart, onStop]);

  return (
    <Card className={"text-center bg-dark text-light"}>
      <Card.Body>
        <Card.Title>{durationToDisplayString(timeLeftMs)}</Card.Title>
        <ProgressBar now={(timeLeftMs / durationMs) * 100} />
      </Card.Body>

      <Card.Footer>
        <Button
          onClick={() => setStartTimestamp(Date.now())}
          variant={"primary"}
          type="button"
          disabled={_startTimestamp != null}
        >
          {startButton}
        </Button>

        <Button
          onClick={() => setStartTimestamp(null)}
          variant={"primary"}
          type="button"
          disabled={_startTimestamp == null}
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
