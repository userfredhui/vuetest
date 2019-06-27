/**
 * 获得传入时间，上个月26日到本月25日的每天，和以周为单位的，比如第一周，第二周
 * @param {Date} date 传入一个日期
 */
export function getTime(date) {
  const monthNum = date.getMonth()
  const startDateTimes = new Date(date.setMonth(monthNum - 1, 26)).getTime()
  const endDateTimes = new Date(date.setMonth(monthNum, 25)).getTime()
  const oneDayTimes = 24 * 60 * 60 * 1000
  const dayArr = []
  const dayMap = {}
  let weekIndex = 1
  for (let i = startDateTimes; i <= endDateTimes; i += oneDayTimes) {
    const dayDate = new Date(i)
    const showDayDate = dayDate.toLocaleDateString()
    const week = dayDate.getDay()
    if (i !== startDateTimes && week === 1) { // 排除刚好第一天是截断点
      weekIndex ++
    }
    if (!dayMap[weekIndex]) {
      dayMap[weekIndex] = [{
        dayDate,
        showDayDate
      }]
    } else {
      dayMap[weekIndex].push({
        dayDate,
        showDayDate
      })
    }
    dayArr.push({
      weekIndex,
      dayDate,
      showDayDate
    })
  }
  const weekArr = []
  for (let key in dayMap) {
    const weekArray = dayMap[key]
    const weekItem = Object.values(weekArray).reduce((result, current, index) => {
      if (index === 0) {
        result.endDayDate = result.startDayDate = current.dayDate
        result.endDayDateStr = result.startDayDateStr = current.showDayDate
      } else {
        result.endDayDate = current.dayDate
        result.endDayDateStr = current.showDayDate
      }
      return result
    }, { startDayDate: '', endDayDate: '', startDayDateStr: '', endDayDateStr: '', title: `第${key}周` })
    weekArr.push(weekItem)
  }
  console.log('dayMap', dayMap)
  console.log('weekArr', weekArr)
  const formatedWeekArr = weekArr.map(item => ({
    label: item.title + '(' + item.startDayDateStr + '~' + item.endDayDateStr + ')',
    value: [item.startDayDate, item.endDayDate]
  }))
  const formatedDay = dayArr.map(item => ({
    label: item.showDayDate,
    value: item.dayDate
  }))
  const weekAndDayMap = {
    'WEEK': formatedWeekArr,
    'DAY': formatedDay
  }
  console.log('weekAndDayMap', weekAndDayMap)
}