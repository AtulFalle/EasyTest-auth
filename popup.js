let recording = false;
let currentUser = null;

// Check authentication status on popup open
document.addEventListener('DOMContentLoaded', async () => {
  const user = await chrome.storage.local.get('user');
  if (user.user) {
    currentUser = user.user;
    showAuthenticatedUI(currentUser);
  }
});

document.getElementById('loginButton').addEventListener('click', async () => {
  try {
    const token = await chrome.identity.getAuthToken({ interactive: true });
    const userInfo = await fetchUserInfo(token);
    currentUser = userInfo;
    await chrome.storage.local.set({ user: userInfo });
    showAuthenticatedUI(userInfo);
  } catch (error) {
    console.error('Authentication failed:', error);
    document.getElementById('status').textContent = 'Authentication failed';
  }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
  try {
    const token = await chrome.identity.getAuthToken({ interactive: false });
    await chrome.identity.removeCachedAuthToken({ token });
    await chrome.storage.local.remove('user');
    showLoginUI();
  } catch (error) {
    console.error('Logout failed:', error);
  }
});

document.getElementById('startRecord').addEventListener('click', async () => {
  if (!currentUser) return;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.runtime.sendMessage({ 
    action: 'startRecording', 
    tabId: tab.id,
    userId: currentUser.id
  });
  
  document.getElementById('startRecord').disabled = true;
  document.getElementById('stopRecord').disabled = false;
  document.getElementById('status').textContent = 'Recording...';
  recording = true;
});

document.getElementById('stopRecord').addEventListener('click', async () => {
  chrome.runtime.sendMessage({ 
    action: 'stopRecording',
    userId: currentUser.id
  });
  
  document.getElementById('startRecord').disabled = false;
  document.getElementById('stopRecord').disabled = true;
  document.getElementById('status').textContent = 'Recording saved!';
  recording = false;
});

async function fetchUserInfo(token) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
}

function showAuthenticatedUI(user) {
  document.getElementById('loginContainer').classList.add('hidden');
  document.getElementById('mainContainer').classList.remove('hidden');
  document.getElementById('userAvatar').src = user.picture;
  document.getElementById('userName').textContent = user.name;
}

function showLoginUI() {
  document.getElementById('loginContainer').classList.remove('hidden');
  document.getElementById('mainContainer').classList.add('hidden');
  currentUser = null;
}