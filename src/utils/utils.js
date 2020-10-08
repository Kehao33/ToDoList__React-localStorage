// format timestamp
const formatTimeStamp = (number) => {
  if (isNaN(number)) {
    throw new TypeError(`{number} is not a timestamp!`)
  }
  // 1601916734934
  var date = new Date(number); // 将时间戳还原为一个日期对象
  var year = date.getFullYear(); //获取整年
  var month = date.getMonth() + 1; // 获取月
  month = month < 10 ? '0' + month : month;
  var dat = date.getDate(); //获取日
  dat = dat < 10 ? '0' + dat : dat;
  var day = date.getDay(); //获取周几， 0 周日，1 周1， 2 周二，3 周三， 4 周四， 5 周五， 6, 周6
  var weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  var week = weeks[day]
  var hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour;
  var min = date.getMinutes()
  min = min < 10 ? '0' + min : min;
  var sec = date.getSeconds()
  sec = sec < 10 ? '0' + sec : sec;


  return `${year}年/${month}月/${dat}日 ${week} ${hour}:${min}:${sec}`
}

// 根据key从本地get Data
const getDataFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [{
    id: 0
  }]
}
// 根据key将data设置到本地
const setDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
  return true
}

export {
  formatTimeStamp,
  getDataFromLocalStorage,
  setDataToLocalStorage
}