import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { Duration } from "./Duration";

export function CountdownTimer({
  startButtonText = "",
  stopButtonText = "",
  durationMs = 25 * 60 * 1000,
  startTimestamp = null,
  onStart = () => {},
  onStop = () => {},
  onComplete = () => {},
}) {
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);

  useEffect(() => {
    if (startTimestamp == null) {
      setTimeLeftMs(durationMs);
      return;
    }

    const countdownReference = countdown(startTimestamp, durationMs);
    let countdownAborted = false;

    (async () => {
      for await (const { timeLeftMs } of countdownReference) {
        if (countdownAborted) return;

        setTimeLeftMs(timeLeftMs);
      }

      if (countdownAborted) return;

      setTimeLeftMs(durationMs);
      onComplete();
    })();

    return () => {
      void countdownReference.return(undefined);
      countdownAborted = true;
    };
  }, [durationMs, onComplete, startTimestamp]);

  return (
    <Card className={"text-center bg-dark text-light"}>
      <Card.Body>
        <Card.Title>
          <div className={"display-1"}>
            <Duration durationMs={timeLeftMs} />
          </div>
        </Card.Title>
        <ProgressBar now={(timeLeftMs / durationMs) * 100} />
      </Card.Body>

      <Card.Footer>
        <Button
          className={"mx-2 my-1"}
          onClick={() => onStart(Date.now())}
          variant={"primary"}
          type={"button"}
          disabled={startTimestamp != null}
        >
          <FontAwesomeIcon icon={faPlay} />
          {` ${startButtonText}`}
        </Button>

        <Button
          className={"mx-2 my-1"}
          onClick={() => onStop()}
          variant={"primary"}
          type={"button"}
          disabled={startTimestamp == null}
        >
          <FontAwesomeIcon icon={faStop} />
          {` ${stopButtonText}`}
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

    yield {
      timeLeftMs: durationMs - elapsedMs,
      elapsedMs,
      durationMs,
    };

    const nextTickSize = tickSize - inaccuracy;

    await new Promise((resolve) => setTimeout(resolve, nextTickSize));

    elapsedMs += tickSize;
  }
}
