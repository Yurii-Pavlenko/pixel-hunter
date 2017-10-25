const gameStats = (data) => {
  return `
  <div class="stats">
      <ul class="stats">
        ${[...data.answers].map((level) => `<li class="stats__result stats__result--${level}"></li>`)}
      </ul>
    </div>
`;
};

export default gameStats;