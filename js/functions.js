function lenStr(str, maxlength)  {
  if (str.length <= maxlength) {
    return true;
  }
  else {
    return false;
  }
}
console.log(lenStr('проверяемая строка', 20))
console.log(lenStr('проверяемая строка', 18))
console.log(lenStr('проверяемая строка', 10))



function palimdrome(str) {
  str = str.replaceAll(' ', '');
  str = str.toLowerCase();
  return str === str.split('').reverse().join('');
}

console.log(palimdrome('Лёша на полке клопа нашёл '))


function workTime(beginTime, endTime, startTime, durationTime) {
  function toMinutes(time) {
    if (typeof time === 'number') {
      return time; // если это уже число (продолжительность в минутах), возвращаем как есть
    }
    if (typeof time !== 'string') {
      time = String(time);
    }
    // Если время не содержит двоеточия, значит это продолжительность в минутах
    if (!time.includes(':')) {
      return Number(time);
    }
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const beginTimeMinutes = toMinutes(beginTime);
  const endTimeMinutes = toMinutes(endTime);
  const startTimeMinutes = toMinutes(startTime);
  const durationTimeMinutes = toMinutes(durationTime);

  const meetingEndMinutes = startTimeMinutes + durationTimeMinutes;

  return startTimeMinutes >= beginTimeMinutes && meetingEndMinutes <= endTimeMinutes;
}

// Тестовые случаи
console.log(workTime('08:00', '17:30', '14:00', 90)) // true
console.log(workTime('8:0', '10:0', '8:0', 120))   // true
console.log(workTime('08:00', '14:30', '14:00', 90)) // false
console.log(workTime('14:00', '17:30', '08:0', 90)) // false
console.log(workTime('8:00', '17:30', '08:00', 900)) // false
