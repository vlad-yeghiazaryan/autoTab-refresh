function gotMessage(message, sender, sendResponse) {
  if (message === 'start') {
    const time = startTime()
    sendResponse(time)
  }
  else if (message === 'stop') {
    stopTime()
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  var timeout, promise;
  promise = new Promise(function (resolve) {
    timeout = setTimeout(function () {
      resolve('Timer Finished');
    }, ms);
  });
  return {
    promise: promise,
    cancel: function () { clearTimeout(timeout); } //return a canceller as well
  }
}

async function startTime() {
  chrome.storage.sync.get('defaults', ({ defaults }) => {
    oneSecond = 1000
    oneMinute = 60000
    variation = getRandomInt(0, 30) * oneSecond
    timeToSleep = getRandomInt(defaults.min, defaults.max) * oneMinute + variation
    // Save time
    time = {
      'timeToSleep': timeToSleep,
      'startDate': Date.now()
    }
    chrome.storage.sync.set({ time })
    window.sleppingObj = sleep(timeToSleep)
    console.log('Timer Started')
    window.sleppingObj.promise.then(function (result) {
      window.location.reload(false)
      console.log(result)
    })
  })
}

function stopTime() {
  if (window.sleppingObj !== undefined){
    window.sleppingObj.cancel()
    time = {
      'timeToSleep': 0,
      'startDate': Date.now()
    }
    chrome.storage.sync.set({ time })
    console.log('Timer stopped')
  }
}

// gotMessage responds by either starting or stoping the timer
chrome.runtime.onMessage.addListener(gotMessage)
