const start = document.querySelector('#start')
const stopButton = document.querySelector('#stop')
const display = document.querySelector('#display')
const min = document.querySelector('#min')
const max = document.querySelector('#max')

function chnageAndSave(e) {
  const defaults = {
    min: min.value,
    max: max.value,
  }
  chrome.storage.sync.set({ defaults })
}

function updateTimer() {
  chrome.storage.sync.get('time', ({ time }) => {
    display.innerHTML = updateDisplay(time.startDate, time.timeToSleep)
  })
}

function updateDisplay(startDate, time) {
  if (startDate === undefined | time === undefined) {
    return 0
  }
  const timePassed = Date.now() - startDate
  const timeTogo = time - timePassed
  if ((time < 0) | (timeTogo < 0)) {
    return 0
  }
  const minutes = Math.floor(timeTogo / 60000);
  const seconds = ((timeTogo % 60000) / 1000).toFixed(0);
  return `${minutes}m:${(seconds < 10 ? "0" : "")}${seconds}s`
}

function sendOrder(order) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, order, function (response) { });
  })
  setTimeout(() => {
    updateTimer()
  }, 100)
  setInterval(updateTimer, 1000)
}

function startTime() {
  sendOrder('start')
}

function stopTime() {
  sendOrder('stop')
}

// Executions
start.addEventListener('click', startTime)
stopButton.addEventListener('click', stopTime)
min.addEventListener('change', chnageAndSave)
max.addEventListener('change', chnageAndSave)
updateTimer()

chrome.storage.sync.get('defaults', ({ defaults }) => {
  min.placeholder = defaults.min,
  max.placeholder = defaults.max
})

window.onload = function () {
  setInterval(updateTimer, 1000)
}