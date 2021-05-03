function start() {
  window.textbook = document.querySelector(".textbook-mode");
  window.app = document.querySelector(".pomodoro-app");
  window.appSettings = document.querySelector(".pomodoro-settings")
  window.minimalMode = false
  window.appMinimalMode = document.querySelector(".minimal-mode");
  window.currentPage = document.querySelector(".current-Page");
  document.querySelectorAll("input").forEach((item)=>{
    item.addEventListener('change',getSettings);
  })
  document.addEventListener('keyup', function(e) {
    if (e.keyCode == 32) {
      toggleMinimalMode();
    }
  })
  document.addEventListener('keyup', function(e) {
    if (e.keyCode == 13) {
      toggleTimer();
    }
  })
  window.settings = {
    'pomodoro': '25:00',
    'break': '05:00',
    'longBreak': '10:00',
    'longBreakInterval': '4',
    'autoStart': false,
    'defaultPomodoro': '25:00',
    'defaultBreak': '05:00',
    'defaultLongBreak': '10:00',
    'textbook-settings': {
      'pomodoro': '05:00',
      'break': '00:00',
      'longBreak': '10:00',
      'longBreakInterval': '5',
      'defaultPomodoro': '05:00',
      'defaultBreak': '00:00',
      'defaultLongBreak': '10:00'
    }
  };
  window.currentVariables = {
    'mins': timeGetMins(settings['pomodoro']),
    'secs': timeGetSecs(settings['pomodoro']),
    'state': 'stop',
    'interval': '',
    'mode': 'pomodoro',
    'finishedPomodoros': 0,
    'system': 'default',
    'elapsedTime': '00:00',
    'leftTime':'20:00',
    'firstPage':1,
    'lastPage':5
  };
  defineInputs();
  highlightMode();
  setSettingsDefault();
  update();
  listenToSettingsChange();
}
/*common functions*/
function twoDigit(number) {
  if (String(number).length < 2) {
    return '0'.repeat(2 - String(number).length) + String(number);
  } else {
    return String(number)
  }
}

function addTimes(a, b) {
  let aMins = Number.parseInt(timeGetMins(a));
  let bMins = Number.parseInt(timeGetMins(b));
  let aSecs = Number.parseInt(timeGetSecs(a));
  let bSecs = Number.parseInt(timeGetSecs(b));
  let cSecs = aSecs + bSecs;
  let cMins = aMins + bMins + (cSecs - (cSecs % 60)) / 60;
  return twoDigit(cMins) + ':' + twoDigit(cSecs % 60);
}
function subtractTimes(a, b) {
  let aMins = Number.parseInt(timeGetMins(a));
  let bMins = Number.parseInt(timeGetMins(b));
  let aSecs = Number.parseInt(timeGetSecs(a));
  let bSecs = Number.parseInt(timeGetSecs(b));
  let cSecs = aSecs - bSecs;
  let cMins = aMins + bMins ;
  if(cSecs < 0){
    cSecs += 60 ;
    cMins -= 1;
  }
  return twoDigit(cMins) + ':' + twoDigit(cSecs % 60);
}

function secsTotime(seconds) {
  if (Number.isInteger(seconds) && seconds < 3600) {
    let secs = seconds % 60;
    let mins = (seconds - secs) / 60;
    return twoDigit(mins) + twoDigit(secs);
  } else {
    return 'invalidArg';
  }
}

function timeGetSecs(time) {
  return twoDigit(time.split(':')[1]);
}

function timeGetMins(time) {
  return twoDigit(time.split(':')[0]);
}

function defineInputs() {
  window.firstPageInput = document.querySelector('.textbook-mode > div > div.first-page > input[type=number]');
  window.lastPageInput = document.querySelector('.textbook-mode > div > div.last-page > input[type=number]');
  window.currentPageInput = document.querySelector('.textbook-mode > div > div.current-page > input[type=number]');
  window.estimatedTimeDiv = document.querySelector('.textbook-mode > div > div.estimated-time > div');
  window.pomodoroInput = document.querySelector('#settings-pomodoro-time-value');
  window.breakInput = document.querySelector('#settings-break-time-value');
  window.longBreakInput = document.querySelector('#settings-long-break-time-value');
  window.autoStartInput = document.querySelector('#settings-auto-start-value');
}

/*textbook mode*/
function enableTextbook() {
  document.querySelector('.textbook-mode').style['display'] = 'grid';
  firstPageInput.value = 1;
  lastPageInput.value = 5;
  currentPageInput.value = firstPageInput.value;
  window.estimatedTimeDiv.innerText = estimateTimeLeft('00:00');
  currentVariables['system'] = 'textbook';
  window.pomodoroInput.value = 5;
  window.breakInput.value = 0;
  window.longBreakInput.value = 10;
  window.autoStartInput.checked = true;
  window.currentPage.innerText = currentPageInput.value;
  getSettings();
}

function disableTextbook() {
  document.querySelector('.textbook-mode').style['display'] = 'none';
  currentVariables['system'] = 'default';
}

function toggleTextbook() {
  if (currentVariables['system'] == 'default') {
    enableTextbook();
  } else {
    disableTextbook();
  }
}

function estimateTimeLeft(timeDiff) {
  let value = (lastPageInput.value - firstPageInput.value) * (Number.parseInt(timeGetMins(settings['pomodoro'])))
  value = subtractTimes(value+':00',timeDiff);
  if(parseInt(timeGetMins(value)) > 0){
    return  value;}
  return '00:00';
}

function setTextbookTimes(){
  let leftTimeDiv = document.querySelector("div.estimated-time>div");
  let elapsed = addTimes(window.currentVariables['elapsedTime'] , '00:01');
  let left = subtractTimes(leftTimeDiv.innerText,'00:01');
  window.currentVariables['elapsedTime'] = elapsed;
  window.currentVariables['timeLeft'] = left;
  leftTimeDiv.innerText = left;
  document.querySelector("div.elapsed-time > div").innerText = elapsed;
}

function addPage() {
  currentPageInput.value++;
  window.currentPage.innerText = currentPageInput.value;
}
/*navigation functions*/
function pomodoroClick() {
  setTime(settings['pomodoro']);
  selectMode('pomodoro');
}

function breakClick() {
  setTime(settings['break']);
  selectMode('break');
}

function longBreakClick() {
  setTime(settings['longBreak']);
  selectMode('longBreak')
}

function selectMode(mode) {
  currentVariables['mode'] = mode;
  highlightMode();
}

function highlightMode() {
  let mode = currentVariables['mode'];
  if (mode == 'pomodoro') {
    document.querySelector('.pomodoro-button').classList.add('selected');
    document.querySelector('.break-button').classList.remove('selected');
    document.querySelector('.long-break-button').classList.remove('selected');
    setColor(getComputedStyle(document.documentElement).getPropertyValue('--light-red'));
  } else if (mode == 'break') {
    document.querySelector('.pomodoro-button').classList.remove('selected');
    document.querySelector('.break-button').classList.add('selected');
    document.querySelector('.long-break-button').classList.remove('selected');
    setColor(getComputedStyle(document.documentElement).getPropertyValue('--light-green'));
  } else if (mode == 'longBreak') {
    document.querySelector('.pomodoro-button').classList.remove('selected');
    document.querySelector('.break-button').classList.remove('selected');
    document.querySelector('.long-break-button').classList.add('selected');
    setColor(getComputedStyle(document.documentElement).getPropertyValue('--light-blue'));
  }
}

function setColor(value) {
  document.documentElement.style.setProperty('--back-color', value);
}

function timeOver() {
  if (currentVariables['mode'] == 'pomodoro') {
    if (settings['break'] != '00:00') {
      breakClick();
      if (settings['autoStart'] == false) {
        stopTimer();
      }
    } else {
      pomodoroClick();
      if (settings['autoStart'] == false) {
        stopTimer();
      }
    }
  } else if (currentVariables['mode'] == 'break') {
    pomodoroClick();
    if (settings['autoStart'] == false) {
      stopTimer();
    }
  }
  if (currentVariables['system'] == 'textbook') {
    addPage();
  }
  done = new Audio('done.wav');
  done.play();
}

/*timer functions*/
function update() {
  document.querySelectorAll('.minutes-div').forEach((item) => {
    item.innerText = window.currentVariables['mins'];
  });
  document.querySelectorAll('.seconds-div').forEach((item) => {
    item.innerText = window.currentVariables['secs'];
  });
}

function setTime(time) {
  window.currentVariables['mins'] = timeGetMins(time);
  window.currentVariables['secs'] = timeGetSecs(time);
  update();
}

function startTimer() {
  currentVariables['interval'] = setInterval(secondTick, 1000);
  currentVariables['state'] = 'start';
  document.querySelector('.pomodoro-app > div.toggle-start-div > button').innerText = 'Stop';
}

function stopTimer() {
  if (currentVariables['interval'] != '') {
    clearInterval(currentVariables['interval']);
    currentVariables['state'] = 'stop';
    currentVariables['interval'] = '';
  }
  document.querySelector('.pomodoro-app > div.toggle-start-div > button').innerText = 'Start';
}

function toggleTimer() {
  if (currentVariables['state'] == 'stop') {
    startTimer();
  } else {
    stopTimer();
  }
}

/*timing functions*/
function secondTick() {
  let mins = currentVariables['mins'];
  let secs = currentVariables['secs'];

  if (mins == '00' && secs == '01') {
    timeOver();
  } else {
    reduceTimeByASec();
  }
  update();
  setTextbookTimes();
}

function reduceTimeByASec() {
  let mins = currentVariables['mins'];
  let secs = currentVariables['secs'];
  if (secs != '00') {
    currentVariables['secs'] = twoDigit(Number.parseInt(secs) - 1);
  } else if (mins != '00') {
    currentVariables['secs'] = '59';
    currentVariables['mins'] = twoDigit(Number.parseInt(mins) - 1);
  }
}
/*settings-related functions*/
function setSettingsDefault() {
  document.querySelector('#settings-pomodoro-time-value').value = 25;
  document.querySelector('#settings-break-time-value').value = 5;
  document.querySelector('#settings-long-break-time-value').value = 10;
}

function getSettings() {
  let timeDiff = currentVariables['elapsedTime']
  settings['pomodoro'] = twoDigit(pomodoroInput.value) + ':' + twoDigit(0);
  settings['break'] = twoDigit(breakInput.value) + ':' + twoDigit(0);
  settings['longBreak'] = twoDigit(longBreakInput.value) + ':' + twoDigit(0);
  settings['autoStart'] = autoStartInput.checked;
  setTime(settings[currentVariables['mode']]);
  estimatedTimeDiv.innerText = estimateTimeLeft(timeDiff);
}

function listenToSettingsChange() {
  let values = document.querySelectorAll('.pomodoro-settings .value'),
    i = 0;
  while (i < values.length) {
    values[i].addEventListener('change', getSettings);
    i++;
  }
}

/*settings functions*/

/*toggleMinimalMode*/
function toggleMinimalMode() {
  if (!minimalMode) {
    app.style["display"] = 'none';
    textbook.style["display"] = 'none';
    appSettings.style["display"] = 'none';
    minimalMode = true;
    appMinimalMode.style['display'] = 'grid';
  } else {
    app.style["display"] = 'grid';
    textbook.style["display"] = 'grid';
    appSettings.style["display"] = 'grid';
    minimalMode = false;
    appMinimalMode.style['display'] = 'none';
  }
}

//module.exports = {secsTotime,secondTick,timeGetSecs,timeGetMins};
