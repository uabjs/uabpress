const term = require('terminal-kit').terminal

const progressBar = term.progressBar({
  width: 40,
  percent: true,
  title: '加载中...',
  barChar: '█',
  barHeadChar: '█',
  barStyle: term.green,
})

let progress = 0
function init() {
  progress = 0
}

function step() {
  progress += 0.1
  progressBar.update(progress)
  if (progress < 1) {
    setTimeout(step, 100)
  }
}

module.exports = {
  init,
  step
}
