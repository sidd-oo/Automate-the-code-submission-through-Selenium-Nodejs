let sd = require(`selenium-webdriver`);
let cd = require('chromedriver');
let fs = require('fs');
let bldr = new sd.Builder();
let driver = bldr.forBrowser('chrome').build();

let cfile = process.argv[2];
let mfile = process.argv[3];
let cname = process.argv[4];

let userName, pwd;

let cfileWillBeReadPromise = fs.promises.readFile(cfile);
cfileWillBeReadPromise.then(function (content) {
    let credentials = JSON.parse(content);
    userName = credentials.un;
    pwd = credentials.pwd;

    let loginPageWillBeLoadedPromise = driver.get(`https://www.pepcoding.com/login`);
    return loginPageWillBeLoadedPromise;
}).then(function(){
    let unWillBeFoundPromise = driver.findElement(sd.By.css("input[type=email]"));
    let pwdWillBeFoundPromise = driver.findElement(sd.By.css("input[type=password]"));
    let bothElementsWillBeFoundPromise = Promise.all([unWillBeFoundPromise,pwdWillBeFoundPromise]);
    return bothElementsWillBeFoundPromise;
})


