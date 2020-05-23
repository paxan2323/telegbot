const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api

const token = '1220356439:AAHkwX6XZPYNg9maWGzk_wUHpKKOevKZpjc'; // тут токен кторый мы получили от botFather

// включаем самого обота
const bot = new TelegramBot(token, {polling: true});
let writeHour = [0];
let recordHour = false;
let date = '';
let data = new Date();
let selectDate = false;
let showHoursCheck = false;
let selectWriteDate = '';
let deleteAllHours = false;
let userInfoFile = '/userInfo.txt';
let fileCount = '/count.txt';
let writeNewUser = false;
let changeStavka = false;
let idUser = '';
let countDay=false,countMonth=false,countYear = false;
let deleteHour = false;
date = '/date_' + data.getDate() + '.' + ( data.getMonth() + 1) + '.' + data.getFullYear();///////////////УДАЛИТЬ
let folderNames = '';
//File system, с помощью него получаем метозы ыизменения файллов
const fs = require('fs');
const path = require('path');
const async = require('async');
let folderUsers = './folderUsers';

// обработчик события присылания нам любого сообщения
bot.on('message', (msg) => {
      const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
      let folderName = "id" + msg.chat.id;
      idUser = folderName;
      folderNames = folderName;
      //ё
      if(!fs.existsSync(folderUsers + ('/' + folderName) + fileCount)){
        fs.mkdirSync(folderUsers);
        fs.mkdirSync(folderUsers + '/' + folderName);
      }
      fs.access(folderUsers + ('/' + folderName) + fileCount, function(error){
            if(error){
                fs.writeFileSync(folderUsers + '/' + folderName + fileCount,'');
            }
      });
      if(changeStavka){
        let dasds = /.*,/g;
            if(/\w/g.test(msg.text) && !dasds.test(msg.text) && msg.text.indexOf(',') > 0 ){
            bot.sendMessage(chatId,'Не так',{});
        }
        else{
            let as = msg.text.split(",");
            let gf = true;
            for(let i=0;i<as.length;i++)
            if(/[^0-9]+/g.test(as[i]) || as[i] == ''){
                gf=false;
            }
            else if(as.length == 0 && /[^0-9]+/g.test(msg.text)||as.length == 0 && msg.text ==''){
                gf=false;
            }
            if(gf){
                fs.writeFileSync(folderUsers + ('/' + folderName) + userInfoFile,msg.text,{});
                changeStavka = false;
                bot.sendMessage(chatId,'Универсальные числа успешно изменены!',{});
                }
            else{
                bot.sendMessage(chatId,'Введите ваши универсальные числа в формате "123,123.."',{});
            }
        }
      }
      else if(deleteAllHours){
          if(msg.text === "ДА"){
        fs.writeFileSync(folderUsers + ('/' + folderName) + fileCount,'',{});
        bot.sendMessage(chatId,'Все часы успешно очищены!',{});
        deleteAllHours = false;
          }
          else{
            bot.sendMessage(chatId,'Очистка всех часов отменена',{});
            deleteAllHours = false;
        }
      }
      else if(deleteHour){
        let pattern =/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/;
        if (pattern.test(msg.text)){
            let dir = folderUsers + ('/' + folderName) + fileCount;
            let dateSplit = msg.text.split('.');
            let d = dateSplit[0];
            let m = dateSplit[1];
            let y = dateSplit[2];
            if(y > 2018 && y <= data.getFullYear()){
            deleteHours(chatId,dir,Number(d),Number(m),y);
            cancelAll();
            }
            else {
                bot.sendMessage(chatId,'Укажите верный год')
            }
        }
        else{
            bot.sendMessage(chatId,'Напишите дату в формате "04.02.2020"',{});
        }
      }
      else if(showHoursCheck){
          if(/^([0-9]{2})\.([0-9]{4})$/.test(msg.text)){
            let dir = folderUsers + ('/' + folderName) + fileCount;
            let dateSplit = msg.text.split('.');
            let m = dateSplit[0];
            let y = dateSplit[1];
            if(y > 2018 && y <= data.getFullYear()){
            showHours(chatId,dir,Number(m),y);
            cancelAll();
            }
            else {
                bot.sendMessage(chatId,'Укажите верный год',{});
            }
          }
          else {
              bot.sendMessage(chatId,'Укажите дату в формате 05.2020',{});
          }
      }
      else if(countDay){
          let pattern =/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/;
          if (pattern.test(msg.text)){
          let dateSplit = msg.text.split('.');
          let d = dateSplit[0];
          let m = dateSplit[1];
          let y = dateSplit[2];
          if(y > 2018 && y <= data.getFullYear()){
            translateHour(chatId,Number(d),Number(m),Number(y),false,true,false,false,idUser);
          cancelAll();
          }
          else {
            bot.sendMessage(chatId,'Укажите верный год',{});
          }
          }
          else{
              bot.sendMessage(chatId,'Напишите дату в формате "04.02.2020"',{});
          }
      }
      else if(countMonth){
          let pattern =/^([0-9]{2})\.([0-9]{4})$/;
          if (pattern.test(msg.text)){
              let dateSplit = msg.text.split('.');
              let m = dateSplit[0];
              let y = dateSplit[1];
              if(y > 2018 && y <= data.getFullYear()){
                translateHour(chatId,0,Number(m),Number(y),false,false,false,true,idUser);
              cancelAll();
              }
              else {
                  bot.sendMessage(chatId,'Укажите верный год',{});
              }
              }
          else{
              bot.sendMessage(chatId,'Напишите дату в формате "02.2020"', {
              });
          }
      }
      else if(countYear){
          let pattern =/^([0-9]{4})$/;
          if (pattern.test(msg.text)){
              let dateSplit = msg.text;
              let y = Number(dateSplit);
              if(y > 2018 && y <= data.getFullYear()){
              translateHour(chatId,0,0,y,false,false,true,false,idUser);
              cancelAll();
              }
              else {
                bot.sendMessage(chatId,'Укажите верный год',{});
              }
              }
          else{
              bot.sendMessage(chatId,'Напишите год в формате "2020"', {
              });
          }
      }
     // отправляем сообщение
    else if (!recordHour && !selectDate && !changeStavka) {
        fs.access(folderUsers + ('/' + folderName) + userInfoFile, function(error){
            if(error){
            }
            else{
                bot.sendMessage(chatId, 'Привет!\nЯ могу помочь тебе с подсчётом з/п!\nДля этого просто выбери нужную функцию на клавиатуре ниже!', {
                  reply_markup: {
                      inline_keyboard: keyboard
                  }
              });
                }});}
    else if (recordHour) {
        let readUserFile = fs.readFileSync(folderUsers + ('/' + folderName) + userInfoFile,'utf8');
        let gs = readUserFile.split(',');
        let dasd = /.*,/g;
        if(/\w/g.test(msg.text) && !dasd.test(msg.text) && msg.text.indexOf(',') > 0){
            bot.sendMessage(chatId, 'Напишите свои записанные числа цифрами, в формате 123' +
            '\n\nВнимание! Если вы указывали ранее несколько чисел, то укажите через запятую количество наборов чисел которые вы записали ранее в формате "35,24.."', {
            });
        }
        else {
            let msgTestSplit = msg.text.split(',');
            let dy = true;
            let lasd = msg.text.split(',');
            if(msgTestSplit.length < gs.length || msgTestSplit.length > gs.length)dy=false;
            let jas = true;
            if(dy){
            for(let i=0;i<lasd.length;i++){
                if(/\W/.test(lasd[i]) || /\D/.test(lasd[i])){
                    jas=false;
                }
            }
            if(jas){
                let dir = folderUsers + ('/' + folderName) + fileCount;
                for(let i=0;i<msg.text.split(',').length;i++){
                    let l = msg.text.split(',');
                writeHour[i] = Number(l[i]);
                }
                writeHours(chatId,writeHour,dir);
            }
            else bot.sendMessage(chatId,'Напишите свои записанные числа цифрами, в формате 123' +
            '\n\nВнимание! Если вы указывали ранее несколько чисел, то укажите через запятую количество наборов чисел которые вы записали ранее в формате "35,24.."');
        }
        else {
            bot.sendMessage(chatId,'Ранее вы записывали ' + gs.length + ' числа');
        }
    }
    }
    else if(selectDate){
        let pattern =/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/;
        if (pattern.test(msg.text))
    {
      var values = msg.text.split('.');
      var d = values[0] - 0;
      var m = values[1] - 0;
      var y = values[2] - 0;
      var daysInMonth = 31;

      if ( m < 1 || m > 12 || y < 1 || y > 9999 )
      {
        bot.sendMessage(chatId, 'Введите дату правильно, к примеру 14.03.2020', {
            reply_markup: {
                inline_keyboard: keyboardCancel
            }
        });
      }
        else if (m == 2)
        {
            daysInMonth = ( ( y % 4 ) == 0 ) ? 29 : 28;
        }
        else if (m == 4 || m == 6 || m == 9 || m == 11)
        {
          daysInMonth = 30;
        }
        else daysInMonth = 31;
        if(d <= daysInMonth && y <= data.getFullYear()){
            bot.sendMessage(chatId, 'Введите количество отработанных часов', {
                reply_markup: {
                    keyboard: keyboardHours
                }
            });
            cancelAll();
            recordHour = true;
            selectWriteDate = 'date_' + msg.text;
            date = 'date_' + msg.text;
        }
        else if(d < daysInMonth && y <= data.getFullYear()){ bot.sendMessage(chatId, 'Кажется вы ошиблись, проверьте заного дату', {
            reply_markup: {
                inline_keyboard: keyboardCancel
            }
        });}
        else if (y > data.getFullYear()){
            bot.sendMessage(chatId,'Укажите верный год',{});
        }
}
else{
    bot.sendMessage(chatId, 'Введите дату правильно, к примеру 14.03.2020', {
        reply_markup: {
            inline_keyboard: keyboardCancel
        }
    });
}
    }
    
    if(!writeNewUser){
        fs.access(folderUsers + ('/' + folderName) + userInfoFile, function(error){
                    if(error){
                        bot.sendMessage(chatId,'Здравствуйте! Я могу помочь вам с подсчётом з/п!'
                        + '\nДля начала работы напишите свои числа в формате 123'
                        + '\n\nВнимание! Я могу принимать сразу несколько чисел и потом их считать'
                        + '\nДля этого введите свои числа через запятую в формате "123,321..", максимум до 4 чисел,'
                        + ' а потом я смогу их посчитать',{});
                        writeNewUser = true;
                    }
                    else{
                    }
            });
        }
  //let msgF = msg.text.replace(',','.');
  if(writeNewUser){
    let dasds = /.*,/g;
    if(/\w/g.test(msg.text) && !dasds.test(msg.text) && msg.text.indexOf(',') > 0 ){
        bot.sendMessage(chatId,'Напишите свои числа в формате "123,55,32"',{});
    }else {
    let as = msg.text.split(",");
    let gf = true;
    for(let i=0;i<as.length;i++)
      if(/[^0-9]+/g.test(as[i]) || as[i] == ''){
          gf=false;
      }
      else if(as.length == 0 && /[^0-9]+/g.test(msg.text)||as.length == 0 && msg.text ==''){
          gf=false;
      }
    if(gf){
  fs.writeFileSync(folderUsers + ('/' + folderName) + userInfoFile,msg.text,{});
  writeNewUser = false;
  bot.sendMessage(chatId,'Ваши универсальные числа записаны!\nЧтобы продолжить выберите нужную функцию ниже',{
      reply_markup:
      {
          inline_keyboard:keyboard
      }
  });
    }
    else bot.sendMessage(chatId,'Ошибка',{});
}
  
}
    countYear = false;
    countDay = false;
    countMonth = false;
});
// обработчик событий нажатий на клавиатуру
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    let img = '';
    const folderName = "id" + query.message.chat.id;
    let d = '';
    if (query.data === 'cancelRec') { // запись часов
        bot.sendMessage(chatId, 'Запись отменена', {
        });
        cancelAll();
    }
    if(query.data === 'uniNumb'){
        bot.sendMessage(chatId, 'Универсальное число - это ваше счетовое измерение, тоесть это могут быть ваши часы, либо какие-либо дополнительные измерения, которые вы хотите посчитать' +
        '\nПри первом использовании бота он просит вас указать универсальные числа, это то, на что в будущем будет умножать ваш бот следующие указанные универсальные числа'+
        '\nЭто очень хорошо может пригодиться если у вас на работе содержиться несколько измерений, которые вам надо посчитать, к примеру часы,заказы, и тд', {
            reply_markup: {
                inline_keyboard: keyboardDate
            }
        });
        cancelAll();
    }
    if (query.data === 'recordHours') { // запись часов
        bot.sendMessage(chatId, 'Выберите день, когда вам надо записать часы\nВы можете написать сами дату в формате день.месяц.год к примеру 14.03.2020', {
            reply_markup: {
                inline_keyboard: keyboardDate
            }
        });
        cancelAll();
        selectDate = true;
    }
    if (query.data === 'today') { // запись часов
        cancelAll();
        bot.sendMessage(chatId, 'Введите количество отработанных часов', {
            reply_markup:{
                keyboard:keyboardHours,
                one_time_keyboard: true
            }
        });
        recordHour = true;
        selectDate = false;
        date = 'date_' + data.getDate() + '.' + (data.getMonth() + 1) + '.' + data.getFullYear();
        selectWriteDate=date;
    }
    if (query.data === 'translateHour') { // если пёс   
         //let dir = folderUsers + ('/' + folderName) + fileCount;
         idUser = 'id' + query.message.chat.id;
         cancelAll();
         bot.sendMessage(chatId, 'Выберите срок, за который вам надо посчитать часы', {
             reply_markup:{
             inline_keyboard: keyboardDates
             }
        });
        //translateHour(chatId,12,4,2020,false,true,false,idUser);
    }
    if(query.data === 'showHours'){
        // let dir = folderUsers + ('/' + folderName) + fileCount;
        // showHours(dir,)
        bot.sendMessage(chatId,'Укажите за какой месяц вы хотите узнать сколько часов вы записали в формате "05.2020" без кавычек',{
            
        });
        showHoursCheck = true;
    }
    if (query.data === 'deleteHours') {
        //fs.unlinkSync(folderUsers + '/' + folderName + '/' + userInfoFile);
        bot.sendMessage(chatId, 'Напишите дату, в которой надо очистить часы в формате 22.06.2020', {
        });
        deleteHour = true;
        
    }
    if (query.data === 'deleteAllHours') {
        //fs.unlinkSync(folderUsers + '/' + folderName + '/' + userInfoFile);
        bot.sendMessage(chatId, 'Чтобы подтвердить действие напишите "ДА", без кавычек и большими буквами\nЕсли хотите отменить операцию то введите любое что-либо другое', {
        });
        deleteAllHours = true;
        
    }
    if(query.data ==='changeStavka'){
        bot.sendMessage(chatId, 'Введите свою ставку', {
        });
        changeStavka = true;
    }
    if(query.data === 'countDay'){
        bot.sendMessage(chatId, 'Укажите за какой день хотите узнать количество заработанных денег в формате "04.02.2020"',{
            parse_mode: 'Markdown'
        });
        cancelAll();
        countDay = true;
    }
    if(query.data === 'countMonth'){
        bot.sendMessage(chatId, 'Укажите за какой месяц хотите узнать количество заработанных денег в формате "02.2020"', {
        });
        cancelAll();
        countMonth = true;
    }
    if(query.data === 'countYear'){
        bot.sendMessage(chatId, 'Укажите за какой год хотите узнать количество заработанных денег к примеру "2020"', {
        });
        cancelAll();
        countYear=true;
    }
    if(query.data === 'countPeriod'){
        bot.sendMessage(chatId, 'Простите, но я пока не умею считать часы за период', {
        });
        cancelAll();
    }
});
function cancelAll(){
    countDay = false;
    countMonth = false;
    countYear = false;
    recordHour = false;
    selectDate = false;
    showHoursCheck = false;
    deleteHour = false;
    deleteAllHours = false;
}
function translateHour(chatId,d,m,y,countAllHours=false,countOneDay=false,countAllYear=false,countOneMonth=false,idUser){
    let dir = folderUsers + ('/' + idUser) + fileCount;
    let count = '';
    let sps = [''];
    let ds = [''];
    fs.readFile(dir,'utf8', (err,data)=>{
        if(err){
            bot.sendMessage(chatId,"ошибка", {});
        }
        else {sps = data.split('\n');
    for(let sp of sps){
        // console.log(sp);
        ds = sp.split('=');
        let countFiles = 0;
        //console.log(ds[1]);
        if(!countAllHours && !countOneDay && !countAllYear && countOneMonth)
            for(let day=1;day<32;day++){// i - это день
                if(day < 10 && m < 10){
                    countFiles = sp.indexOf("date_" + '0' + day + '.' + '0' + m + '.' + y);
                }
                    if(day > 9 && m < 10) {
                    countFiles = sp.indexOf("date_" + day + '.' + ('0' + m) + '.' + y);
                }
                    if(day < 10 && m > 9) {
                    countFiles = sp.indexOf("date_" + '0' + day + '.' + m+ y);
                }
                    if(day > 9 && m > 9) {
                    countFiles = sp.indexOf("date_" + day + '.' + m+ y);
                }
                if(countFiles != -1){
                    count+= ds[1];
                        //console.log(countFiles);
                }
        }
        else if(!countOneDay && !countAllYear && !countOneMonth){
            for(let mon=1;mon<13;mon++){//m - это месяц
                for(let day=1;day<32;day++){// i - это день
                    if(day < 10 && mon < 10){
                        countFiles = sp.indexOf("date_" + '0' + day + '.' + '0' + mon);
                    }
                        if(day > 9 && mon < 10) {
                        countFiles = sp.indexOf("date_" + day + '.' + '0' + mon);
                    }
                        if(day < 10 && mon > 9) {
                        countFiles = sp.indexOf("date_" + '0' + day + '.' + mon);
                    }
                        if(day > 9 && mon > 9) {
                        countFiles = sp.indexOf("date_" + day + '.' + mon);
                    }
                    if(countFiles != -1){
                        count+= ds[1];
                        //console.log(countFiles);
                    }
                }
            }
        }
        else if(countOneDay && !countAllYear && !countOneMonth){
            if(d < 10 && m < 10){
                countFiles = sp.indexOf("date_" + '0' + d + '.' + '0' + m + '.' + y);
            }
            if(d > 9 && m < 10) {
                countFiles = sp.indexOf("date_" + d + '.' + '0' + m + '.' + y);
            }
            if(d < 10 && m > 9) {
                countFiles = sp.indexOf("date_" + '0' + d + '.' + m + '.' + y);
            }
            if(d > 9 && m > 9) {
                countFiles = sp.indexOf("date_" + d + '.' + m + '.' + y);
            }
            if(countFiles != -1){
                count+= ds[1];
                    //console.log(countFiles);
            }
        }
        else if(countAllYear && !countOneMonth) {
            for(let mon=1;mon<13;mon++){//m - это месяц
                for(let day=1;day<32;day++){// i - это день
                    if(day < 10 && mon < 10){
                        countFiles = sp.indexOf("date_" + '0' + day + '.' + '0' + mon + '.' + y);
                    }
                        if(day > 9 && mon < 10) {
                        countFiles = sp.indexOf("date_" + day + '.' + '0' + mon + '.' + y);
                    }
                        if(day < 10 && mon > 9) {
                        countFiles = sp.indexOf("date_" + '0' + day + '.' + mon + '.' + y);
                    }
                        if(day > 9 && mon > 9) {
                        countFiles = sp.indexOf("date_" + day + '.' + mon + '.' + y);
                    }
                    if(countFiles != -1){
                        count+= ds[1];
                        //console.log(countFiles);
                    }
                }
            }
        }
        else if(countOneMonth){
                for(let day=1;day<32;day++){// i - это день
                    if(day < 10 && m < 10){
                        countFiles = sp.indexOf("date_" + '0' + day + '.' + '0' + m + '.' + y);
                    }
                        if(day > 9 && m < 10) {
                        countFiles = sp.indexOf("date_" + day + '.' + '0' + m + '.' + y);
                    }
                        if(day < 10 && m > 9) {
                        countFiles = sp.indexOf("date_" + '0' + day + '.' + m + '.' + y);
                    }
                        if(day > 9 && m > 9) {
                        countFiles = sp.indexOf("date_" + day + '.' + m  + '.' + y);
                    }
                    if(countFiles != -1){
                        count+= ds[1];
                        //console.log(countFiles);
                    }
                }
            }
        }
    let userStavk = fs.readFileSync(folderUsers + ('/' + folderNames) + userInfoFile,'utf8');
    let us = [''];
    let dsa = '';
    if(userStavk.split(',').length!=0)
    us = userStavk.split(',');
    else us[0] = userStavk;
    let c = count.split(',');
    if(c.length <= us.length){
    if(c.length > 0){
        for(let i=0;i<c.length;i++){
            if(i!=0)
        dsa += '' + '\n' + (i + 1) + '. '  + Math.round(Number(c[i]) * Number(us[i]));
        else dsa += '' + (i + 1) + '. '  + Math.round(Number(c[i]) * Number(us[i]));
        }
    }
    else{
        dsa = + '' (i + 1) + '. '  + Math.round(Number(c[i]) * Number(us[0]));
    }
}
else if(c.length >= us.length){
    if(us.length > 0){
        for(let i=0;i<us.length;i++){
            if(i!=0)
        dsa += '' + '\n' + (i + 1) + '. '  + Math.round(Number(c[i]) * Number(us[i]));
        else dsa += '' + (i + 1) + '. '  + Math.round(Number(c[i]) * Number(us[i]));
        }
    }
    else{
        dsa = + '' (i + 1) + '. '  + Math.round(Number(c[i]) * Number(us[0]));
    }

}
    bot.sendMessage(chatId, dsa, {
    });


    // bot.sendMessage(chatId, count * 147.8, {
    // });
}
})};
function writeHours(chatId,selectHours=[0],dir){
        let checkRetry = 0;
        let readFile = fs.readFileSync(dir,'utf8');
        let sps = readFile.split('\n');
        let needSp = selectWriteDate.replace("date_",'');
        let splitPoint = needSp.split('.');
        let d = Number(splitPoint[0]);
        let m = Number(splitPoint[1]);
        let y = Number(splitPoint[2]);
        let write = '';
            for(let i=0;i<selectHours.length;i++){
                if(i != selectHours.length - 1)
                write += '' + selectHours[i] + ',';
                else write += '' + selectHours[i];
            }
            if(y > 2018 && y <= data.getFullYear()){
                for(let sp of sps){
                    if(d >= 10 && m >= 10){
                        if(sp.indexOf('date_' + d + '.' + m + '.' + y + '=') != -1){
                        checkRetry += 1;
                        }
                    }
                    if(d < 10 && m >= 10){
                        if(sp.indexOf('date_' + '0' +  d + '.' + m + '.' + y + '=') != -1){
                            checkRetry += 1;
                        }
                    }
                    if(d < 10 && m < 10){
                        if(sp.indexOf('date_' + '0' +  d + '.' + '0' +  m + '.' + y + '=') != -1){
                            checkRetry += 1;
                        }
                    }
                    if(d >= 10 && m < 10){
                        if(sp.indexOf('date_' + d + '.' + '0'  + m + '.' + y + '=') != -1){
                            checkRetry += 1;
                        }
                    }
                }
                if(checkRetry == 0){
                    if(d >= 10 && m >= 10)
                        fs.appendFileSync(dir, '\ndate_' + d + '.' + m + '.' + y + '=' + write);
                    else if(d < 10 && m >= 10)
                        fs.appendFileSync(dir, '\ndate_' + '0' + d + '.' + m + '.' + y + '=' + write);
                    else if(d >= 10 && m < 10)
                        fs.appendFileSync(dir, '\ndate_'  + d + '.' + '0' + m + '.' + y + '=' + write);
                    else if(d < 10 && m < 10)
                        {fs.appendFileSync(dir, '\ndate_' + '0' + d + '.' + '0' + m + '.' + y + '=' + write);}
                        bot.sendMessage(chatId,'✔️ Часы записаны! ✔️',{
                            reply_markup:{
                              remove_keyboard:true
                            }});
                }
            
                else {
                        fs.readFile(dir,'utf-8' ,(err, data) => {
                            if (err) {
                            console.error(err)
                            return
                            }
                            let nData = data.split('\n');
                            let  newData = '';
                            for(let i=0;i<nData.length;i++){
                            let c = nData[i].split('=');
                                if(d >= 10 && m >= 10){
                                if(nData[i] != 'date_'  + d + '.' + m + '.' + y + '=' + c[1])
                                    newData +=  nData[i] +'\n';
                                }
                                else if(d < 10 && m >= 10){
                                if(nData[i] != 'date_' + '0' + d + '.'  + m + '.' + y + '=' + c[1])
                                    newData +=  nData[i] +'\n';}
                                else if(d >= 10 && m < 10){
                                    if(nData[i] != 'date_' + d + '.' + '0' + m + '.' + y + '=' + c[1])
                                    newData +=  nData[i] +'\n';}
                                else if(d < 10 && m < 10){
                                if(nData[i] != 'date_' + '0' + d + '.' + '0' + m + '.' + y + '=' + c[1])
                                    newData +=  nData[i] +'\n';}
                            }
                            fs.writeFileSync(dir,newData);
                            if(d >= 10 && m >= 10)
                            fs.appendFileSync(dir,'date_' + d + '.' + m + '.' + y + '=' + write);
                            else if(d < 10 && m >= 10)
                            fs.appendFileSync(dir,'date_' + '0' + d + '.'  + m + '.' + y + '=' + write);
                            else if(d >= 10 && m < 10)
                            fs.appendFileSync(dir,'date_'  + d + '.' + '0' + m + '.' + y + '=' + write);
                            else if(d < 10 && m < 10)
                            fs.appendFileSync(dir,'date_' + '0' + d + '.' + '0' + m + '.' + y + '=' + write);
                        });
                    console.log('no');
                    bot.sendMessage(chatId,'✔️ Часы перезаписаны! ✔️',{
                        reply_markup:
                        {
                            remove_keyboard:true
                        }
                    });
                }
            cancelAll();
            }
            else {
                bot.sendMessage(chatId,'❌ Укажите верный год ❌',{});
            }
          
}
function showHours(chatId,dir,m,y){
    fs.readFile(dir,'utf8',(err,data) =>{
        if(err)throw err;
        else {
            let nDAta = '';
            let retry = 0;
            let newData = '';
            let splitDatas = data.split('\n');
            for(let splitData of splitDatas){
                for(let d = 1;d<32;d++){
                        if(d >= 10 && m >= 10)
                            retry = splitData.indexOf('date_' + d + '.' + m + '.' + y);
                    else if(d < 10 && m >= 10)
                            retry = splitData.indexOf('date_' + '0' + d + '.'  + m + '.' + y);
                    else if(d >= 10 && m < 10)
                            retry = splitData.indexOf('date_'  + d + '.' + '0' + m + '.' + y);
                    else if(d < 10 && m < 10)
                            retry = splitData.indexOf('date_' + '0' + d + '.' + '0' + m + '.' + y);
                            if(retry != -1){
                                nDAta = splitData.split('_');
                                let noRavnoData = nDAta[1].split('=');
                                newData += '\n' + noRavnoData[0] + ' ' + noRavnoData[1] + ' ' + 'часов';
                            }
                    }
            }
            if(newData != null){
            bot.sendMessage(chatId,newData,{

            });
        }
        else{
            bot.sendMessage(chatId,'За этот месяц нет записанных часов',{});
        }
            cancelAll();
        }
    });
}
function deleteHours(chatId,dir,d,m,y){
    fs.readFile(dir,'utf-8' ,(err, data) => {
        if (err) {
        console.error(err)
        return
        }
        let retry = 0;
        let nData = data.split('\n');
        let newData = '';
        let newD = '';
        for(let i=0;i<nData.length;i++){
            if(d >= 10 && m >= 10)
            retry = nData[i].indexOf('date_' + d + '.' + m + '.' + y);
        else if(d < 10 && m >= 10)
            retry = nData[i].indexOf('date_' + '0' + d + '.'  + m + '.' + y);
        else if(d >= 10 && m < 10)
            retry = nData[i].indexOf('date_'  + d + '.' + '0' + m + '.' + y);
        else if(d < 10 && m < 10)
            retry = nData[i].indexOf('date_' + '0' + d + '.' + '0' + m + '.' + y);
            if(retry != -1){
                newD += nData[i]
            }
            if(nData[i] != newD){
                newData += nData[i] + '\n';
            }
                }
            fs.writeFileSync(dir,newData);
            bot.sendMessage(chatId,'Часы очищены!',{

            });
});
}
//конфиг клавиатуры
const keyboard = [
    [
      {
        text: '🕑 Записать часы 🕑',
        callback_data: 'recordHours' // данные для обработчика событий
      }
    ],
    [
        {
          text: '⏱ Перевести часы в рубли ⏱',
          callback_data: 'translateHour'
          //fileHandler();
        }
    ],
    [
        {
            text: '📃 Показать записанные часы 📃',
            callback_data: 'showHours'
        }
    ],
    [
        {
            text:'↩️ Изменить ставку в час ↩️',
            callback_data: 'changeStavka'
        }
    ],
    [
        {
            text: '❌ Удалить часы за выбранный день ❌',
            callback_data: 'deleteHours'
        }
    ],
    [
        {
            text: '❌ Очистить все мои часы ❌',
            callback_data: 'deleteAllHours'
            //fileHandler();
        }
    ],
    [
        {
            text: 'Что такое универсальное число?',
            callback_data: 'uniNumb'
        }
    ]
  ];
  const keyboardHours = [
      [
        {
          text: '6',
          callback_data: '6' // данные для обработчика событий
        }
      ],
      [
        {
          text: '8',
          callback_data: '8' // данные для обработчика событий
        }
      ],
      [
        {
          text: '10',
          callback_data: '10' // данные для обработчика событий
        }
      ],
      [
        {
          text: '12',
          callback_data: '12' // данные для обработчика событий
        }
      ],
      [
          {
            text: 'Отменить запись часов',
            callback_data: 'cancelRec' // данные для обработчика событий
          }
        ]
  ];
  const keyboardDate = [
    [
      {
        text: 'Сегодня',
        callback_data: 'today' // данные для обработчика событий
      }
    ],
    [
        {
            text: 'Отмена',
            callback_data: 'cancelRec'
            //fileHandler();
        }
    ]
    /*[
        {
          text: 'Хочу проходить курсы',
          url: 'https://htmlacademy.ru/continue' //внешняя ссылка
        }
      ]*/

  ];
  const keyboardCancel = [
    [
      {
        text: '❌ Отменить запись часов ❌',
        callback_data: 'cancelRec' // данные для обработчика событий
      }
    ]
];
const keyboardDates = [
    [
        {
            text: 'Посчитать за день',
            callback_data: 'countDay'
        }
    ],
    [
        {
            text: 'Посчитать за месяц',
            callback_data: 'countMonth'
        }
    ],
    [
        {
            text: 'Посчитать за год',
            callback_data: 'countYear'
        }
    ]/*,
    [
        {
            text:'Посчитать за выбранный срок',
            callback_data: 'countPeriod'
        }
    ]*/
];