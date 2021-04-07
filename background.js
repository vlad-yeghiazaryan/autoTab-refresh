// defaults
const defaults = {
  min: 10,
  max: 17,
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ defaults })
  chrome.storage.sync.get('defaults', ({ defaults }) => {
    console.log('defaults:', defaults)
  })
})
