import createTimer from "./create-timer";
import assert from "assert";

describe(`TIMER FUNCTION`, () => {
  const timeValue = 30;

  it(`should return the "TIMER" object with type 'object' at the output`, () => {
    assert.equal(createTimer(timeValue) instanceof Object, true);
  });

  it(`should return the time decrised by one(1) every time the timer is updated(calling the "tick" method)`, () => {
    assert.equal(createTimer(30).tick().time, 29);
    assert.equal(createTimer(29).tick().time, 28);
    assert.equal(createTimer(28).tick().time, 27);
    assert.equal(createTimer(27).tick().time, 26);
    assert.equal(createTimer(26).tick().time, 25);
    assert.equal(createTimer(25).tick().time, 24);
  });
  it(`should return "TIME IS OVER" if time < 0`, () => {
    assert.equal(createTimer(1).tick().time, 0);
    assert.equal(createTimer(0).tick(), `time is over`);
  });
});
