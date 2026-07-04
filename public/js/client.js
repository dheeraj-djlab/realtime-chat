// client.js - frontend real-time logic

const socket = io(); // connects to same host/port that served this page

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messagesEl = document.getElementById('messages');
const onlineList = document.getElementById('online-list');
const onlineCount = document.getElementById('online-count');
const typingIndicator = document.getElementById('typing-indicator');

const joinOverlay = document.getElementById('join-overlay');
const joinForm = document.getElementById('join-form');
const joinNameInp = document.getElementById('joinNameInp');
const appEl = document.getElementById('app');

let myName = '';

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = joinNameInp.value.trim();
  if (!name) return;

  myName = name;
  socket.emit('new-user-joined', myName);

  joinOverlay.style.display = 'none';
  appEl.style.display = 'flex';
  messageInput.focus();
});

function appendMessage({ name, message, time, id }) {
  const div = document.createElement('div');
  div.classList.add('message');

  if (id === socket.id) {
    div.classList.add('right');
  } else {
    div.classList.add('left');
  }

  div.innerHTML = `<span class="meta">${escapeHtml(name)} • ${time || ''}</span>${escapeHtml(message)}`;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function appendSystemMessage(text) {
  const div = document.createElement('div');
  div.classList.add('message', 'system');
  div.textContent = text;
  messagesEl.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

// ----- Sending messages -----
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit('send', message);
  socket.emit('stop-typing');
  messageInput.value = '';
});

// Typing indicator (debounced)
let typingTimeout;
messageInput.addEventListener('input', () => {
  socket.emit('typing');
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => socket.emit('stop-typing'), 1200);
});

// ----- Socket event listeners -----
socket.on('receive', (data) => {
  appendMessage(data);
});

socket.on('user-joined', (name) => {
  appendSystemMessage(`${name} joined the chat`);
});

socket.on('left', (name) => {
  appendSystemMessage(`${name} left the chat`);
});

socket.on('online-users', (list) => {
  onlineCount.textContent = list.length;
  onlineList.innerHTML = '';
  list.forEach((name) => {
    const li = document.createElement('li');
    li.textContent = name === myName ? `${name} (you)` : name;
    onlineList.appendChild(li);
  });
});

socket.on('typing', (name) => {
  typingIndicator.textContent = `${name} is typing...`;
});

socket.on('stop-typing', () => {
  typingIndicator.textContent = '';
});