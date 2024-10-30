let recorder = null;
let recordedChunks = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    startRecording(message.tabId, message.userId);
  } else if (message.action === 'stopRecording') {
    stopRecording(message.userId);
  }
});

async function startRecording(tabId, userId) {
  try {
    const stream = await chrome.tabs.captureTab(tabId, { format: 'webm' });
    recordedChunks = [];
    
    recorder = new MediaRecorder(stream);
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    
    recorder.onstop = () => saveRecording(userId);
    
    recorder.start();
  } catch (error) {
    console.error('Error starting recording:', error);
  }
}

function stopRecording(userId) {
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop();
  }
}

function saveRecording(userId) {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  chrome.downloads.download({
    url: url,
    filename: `test-recording-${userId}-${timestamp}.webm`
  });
  
  recordedChunks = [];
  
  // Store recording metadata in chrome.storage
  chrome.storage.local.get('recordings', (data) => {
    const recordings = data.recordings || [];
    recordings.push({
      userId,
      timestamp,
      filename: `test-recording-${userId}-${timestamp}.webm`
    });
    chrome.storage.local.set({ recordings });
  });
}