import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { Duration } from "./Duration";

/**
 * An object representing the state of a countdown at a specific point in time.
 * @typedef {Object} CountdownTick
 * @property {number} timeLeftMs The number of milliseconds left for the
 * countdown timer to run.
 * @property {number} elapsedMs The number of milliseconds that have elapsed so
 * far.
 * @property {number} durationMs The total duration (in milliseconds) of the
 * current countdown timer.
 */

/**
 * @callback timerStartCallback
 * @param {number} startTimestamp The timestamp when the countdown timer was
 * started.
 */

/**
 * Countdown timer component that allows users to start and stop it at will.
 * @param {Object} params
 * @param {string|JSX.Element} params.startButtonText The text or component to
 * display in the start button.
 * @param {string|JSX.Element} params.stopButtonText The text or component to
 * display in the stop button.
 * @param {number} params.durationMs The number of milliseconds for how long
 * this countdown timer should run.
 * @param {number|null} params.startTimestamp The timestamp when this timer was
 * started, or `null` when the timer is not actively running.
 * @param {timerStartCallback} params.onStart Callback when the user manually
 * started the countdown timer.
 * @param {function()} params.onStop Callback then the user manually stopped the
 * countdown timer.
 * @param {function()} params.onComplete Callback after the timer completed
 * without interruption. This does not get triggered if the user stops the timer
 * midway.
 * @return {JSX.Element}
 */
export function CountdownTimer({
  startButtonText = "",
  stopButtonText = "",
  durationMs = 25 * 60 * 1000,
  startTimestamp = null,
  onStart = () => {},
  onStop = () => {},
  onComplete = () => {},
}) {
  /**
   * The number of milliseconds that are left for this countdown timer.
   * @type {[number, function(number)]}
   */
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);

  // Effect that is responsible for triggering the countdown algorithm once the
  // start timestamp is set.
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
            <Duration durationMs={Math.max(timeLeftMs, 0)} />
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

/**
 * Async generator that yields each time a tick has passed and returns after a
 * specified duration has passed.
 *
 * @generator
 * @async
 * @param {number} startTimestamp The timestamp when the countdown timer was
 * started.
 * @param {number} durationMs The duration (in milliseconds) for how long the
 * countdown timer should run.
 * @param {number} tickSizeMs The number of milliseconds that should elapse
 * before the generator will yield the current state of the countdown. This
 * value has no effect on the accuracy of the timer itself, but reducing this
 * will make the updates between the start and end of the timer more frequent.
 * @yields {CountdownTick}
 * @return {AsyncGenerator<CountdownTick, void>}
 */
async function* countdown(startTimestamp, durationMs, tickSizeMs = 1000) {
  let elapsedMs = 0;

  while (elapsedMs < durationMs) {
    let inaccuracy = Date.now() - startTimestamp - elapsedMs;

    if (inaccuracy > tickSizeMs) {
      const mod = inaccuracy % tickSizeMs;
      elapsedMs = elapsedMs + inaccuracy - mod;
      inaccuracy = mod;
    }

    yield {
      timeLeftMs: durationMs - elapsedMs,
      elapsedMs,
      durationMs,
    };

    const nextTickSize = tickSizeMs - inaccuracy;

    await new Promise((resolve) => setTimeout(resolve, nextTickSize));

    elapsedMs += tickSizeMs;
  }
}
