const createTimer = (timeValue) => {
  return {
    time: timeValue,
    tick() {
      return this.time <= 0 ? `time is over` : createTimer(this.time - 1);
    }
  };
};

export default createTimer;


