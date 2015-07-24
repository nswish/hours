(function(){
  var doc = document.getElementsByName('Main')[0].contentWindow.document;
  var tables = doc.getElementsByTagName('table');
  var cards = [];
  var result = "";
  var table, card, tokens, i, l, rating, avg;
  var yestday = new Date() - 3600*24*1000;
  var sum = 0, count = 0, workingCount = 0, extraWorkingCount = 0, count10 = 0;
  var specialDays = {
    '2015-06-22': false,
    '2015-09-03': false,
    '2015-09-04': false,
    '2015-09-06': true,
    '2015-10-01': false,
    '2015-10-02': false,
    '2015-10-05': false,
    '2015-10-06': false,
    '2015-10-07': false,
    '2015-10-10': true
  }

  function strToDate(str) {
    var tokens = str.split('-');
    return new Date(Number(tokens[0]), Number(tokens[1]) - 1, Number(tokens[2]));
  }

  for(i = 0, l = tables.length; i < l; i++) {
    table = tables[i];

    if(table.getAttribute('className') === 'listAC' || table.getAttribute('class') === 'listAC') {
      card = {};
      card['date'] = table.rows[2].cells[0].childNodes[0].href.split('?')[1].replace(/\D*/,"");
      card['content'] = table.rows[1].cells[0].innerHTML;
      card['leave'] = table.rows[2].cells[0].firstChild.innerText;

      if(card['content'] === '无刷卡记录') {
        card['hours'] = (card['leave'] === '无' ? 0 : 8);
      } else {
        tokens = card['content'].split('~');
        card['hours'] = (new Date(2000,1,1,tokens[1].split(':')[0],tokens[1].split(':')[1]) - new Date(2000,1,1,tokens[0].split(':')[0],tokens[0].split(':')[1])) / 1000 / 3600 - 1
      }

      cards.push(card);
    }
  }

  for(i = 0, l = cards.length; i < l; i++) {
    card = cards[i];

    if(strToDate(card.date) > yestday)
      break;

    if(specialDays[card.date] !== undefined) {
      card['isWorkingDay'] = specialDays[card.date];
    } else {
      card['isWorkingDay'] = strToDate(card.date).getDay() !== 0 && strToDate(card.date).getDay() !== 6;
    }

    sum += card.hours;

    if(card.hours > 0) {
      card.isWorkingDay ? workingCount++ : extraWorkingCount++;
    }

    if(card.isWorkingDay) {
      count++;
      
      if(card.hours >= 10) {
        count10++
      }
    }
  }

  avg = sum /count;

  if(avg >= 10) {
    rating = "鞠躬精粹，死而后已！ ★★★★★";
  } else if (avg >= 9.5) {
    rating = "优秀劳模！ ★★★★☆";
  } else if (avg >= 9) {
    rating = "热爱工作！ ★★★☆☆";
  } else if (avg >= 8.5) {
    rating = "工作努力！ ★★☆☆☆";
  } else if (avg >= 8) {
    rating = "合格员工！ ★☆☆☆☆";
  } else {
    rating = "小心被扣钱！ ☆☆☆☆☆";
  }

  result += '累计出勤 ' + (workingCount+extraWorkingCount) + ' 天' + (extraWorkingCount>0?'(其中节假日加班 ' + extraWorkingCount + ' 天)' : '') +'，共 ' + sum.toFixed(2) + ' 工时。\n\n'
  // result += '累计出勤 ' + (workingCount+extraWorkingCount) + ' 天(节假日加班 ' + extraWorkingCount + ' 天)，共 ' + sum.toFixed(2) + ' 工时。\n\n'
          + '平均每个工作日 ' + avg.toFixed(2) + ' 工时。\n\n'
          + '工作日加班2小时以上 ' + count10 + ' 天，可领餐贴 ' + count10*20 + ' 元。\n\n'
          + '对您的评价：' + rating;

  alert(result);
})();
