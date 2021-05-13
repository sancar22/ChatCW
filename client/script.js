'use strict';


const socket = io();
socket.on('message', (data) => {
  showMessage(data.msg);
  scrollToBottom();
});
class Message {
  constructor (content, authorId, timestamp, authorName) {
    this.content = content;
    this.authorId = authorId;
    this.timestamp = timestamp;
    this.authorName = authorName;
  }
}
let myId;
let myName;

function getCookie (cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function genRandomMs () {
  // Returns a random number between 0 and 10 seconds, in milliseconds
  return Math.floor(Math.random() * 1e4);
}

function prettifyDate (timestamp) {
  // Returns the date in hh:mm am/pm format
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(timestamp).toLocaleTimeString('en-US', options);
}

function showMessage (msg) {
  const { content, authorId, timestamp, authorName } = msg;
  const $HtmlMsg = $(`
    <div class="message ${authorId === myId  ? 'right' : 'left'}">
    <div class="message-time bold">${authorId === myId ? 'Me' : authorName}</div>
      <div class="message-text">${content}</div>
      <div class="message-time">${prettifyDate(timestamp)}</div>
    </div>
  `);
  $('.messages-container').append($HtmlMsg);
}

function loadMessages (userID) {
  $.get(`http://localhost:3000/message/${userID}`, data => {
    for (let message of data) {
      const msg = new Message(message.content, message.UserId, parseInt(message.timestamp), message.authorName);

      showMessage(msg);
      scrollToBottom();
    }
  });
}

function scrollToBottom () {
  const $messages = $('.messages-container');
  $messages.animate({
    scrollTop: $messages[0].scrollHeight
  });
}

async function handleLogin () {
  const username = $('#username').val();
  const password = $('#password').val();
  const body = {
    username, 
    password
  };
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };

  const res = await axios.post('http://localhost:3000/auth/login', body, config);
  if (typeof res.data === 'number') {
    document.cookie = `userId=${res.data}`;
    $('.container').css('display', 'flex');
    $('.login-view').css('display', 'none');
    loadMessages(res.data);
    myId = res.data;
    const userData = await axios.get(`http://localhost:3000/auth/userInfo/${myId}`);
    myName = userData.data.username;
  } else {
    alert(res.data);
  }
}

function goToRegister () {
  $('.login-view').css('display', 'none');
  $('.register-view').css('display', 'flex');
}


function handleBack () {
  $('.login-view').css('display', 'flex');
  $('.register-view').css('display', 'none');
}

function logoutUser () {
  document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  $('.container').css('display', 'none');
  $('.login-view').css('display', 'flex');
  $('.messages-container').empty();
}

async function registerUser () {
  const username = $('#username-register').val();
  const password = $('#password-register').val();
  const body = {
    username, 
    password
  };
  const config = {
    headers: {
      'content-type': 'application/json',
    },
  };
  const res = await axios.post('http://localhost:3000/auth/register', body, config);
  alert(res.data);
  $('#username-register').val('');
  $('#password-register').val('');
}

$(async () => {
  $('#register').on('click', goToRegister);
  $('#register-user').on('click', registerUser);
  $('#login').on('click', handleLogin);
  $('#back').on('click', handleBack);
  $('.logout').on('click', logoutUser);
  const userId = getCookie('userId');
  if (userId.length>0) {
    $('.container').css('display', 'flex');
    $('.login-view').css('display', 'none');
    myId = parseInt(userId);
    loadMessages(parseInt(userId));
    const userData = await axios.get(`http://localhost:3000/auth/userInfo/${myId}`);
    myName = userData.data.username;
  }
  $('#msg-form').on('submit',async (e) => {
    e.preventDefault();
    const content = $('#text').val();
    if (content) {
     
      $('#text').val('');
      const msg = new Message(content, myId, Date.now(), myName);
      const body = {
        msg, 
        myId
      };
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      try {
        const res = await axios.post('http://localhost:3000/message', JSON.stringify(body), config);
        socket.emit('message', {msg: res.data});
        scrollToBottom ();
      } catch (e) {
        console.log(e);
      }
    }
  });
 
});
