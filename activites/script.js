let sd = require(`selenium-webdriver`);
let cd = require('chromedriver');
let fs = require('fs');

let bldr = new sd.Builder();
let driver = bldr.forBrowser('chrome').build();

let cfile = process.argv[2];
let mfile = process.argv[3];
let cname = process.argv[4];

let userName, pwd;
let globalCourseElements, globalCourseIndex = 0;

let cfileWillBeReadPromise = fs.promises.readFile(cfile);
cfileWillBeReadPromise.then(function (content) {
    // Parsing/Analysing the content of cfile
    let credentials = JSON.parse(content);
    //Grabing the credentials i.e (username, password) by analysing the content of credential.json file 
    userName = credentials.un;
    pwd = credentials.pwd;
    //This will allow us to navigate to the pepcoding's website and give a promise for further use.
    let loginPageWillBeLoadedPromise = driver.get(`https://www.pepcoding.com/login`);
    return loginPageWillBeLoadedPromise;
}).then(function(){
    //This will grab username and passwaord input elements and give a promise for further use.
    let unWillBeFoundPromise = driver.findElement(sd.By.css("input[type=email]"));
    let pwdWillBeFoundPromise = driver.findElement(sd.By.css("input[type=password]"));
    let bothElementsWillBeFoundPromise = Promise.all([unWillBeFoundPromise,pwdWillBeFoundPromise]);
    return bothElementsWillBeFoundPromise;
}).then(function(elements){
    //Username and password will be entered in the input fields of the login panel.
    let userNameWillBeEnteredPromise = elements[0].sendKeys(userName);
    let pwdWillBeEnteredPromise = elements[1].sendKeys(pwd);
    let bothValueWillBeEnteredPromise = Promise.all([userNameWillBeEnteredPromise,pwdWillBeEnteredPromise]);
    return bothValueWillBeEnteredPromise;
}).then(function(){
    //This will grab the submit button element give a promise for further use.
    let submitButtonWillBeFoundPromise = driver.findElement(sd.By.css("button[type=submit]"));
    return submitButtonWillBeFoundPromise;
}).then(function(submitButton){
    //This will click on the submit button element to login.
    let submitButtonWillBeClickedPromise = submitButton.click();
    return submitButtonWillBeClickedPromise;
}).then(function(){
    // Finding the resourse link element Promise
    let resourceLinkWillBeFoundPromise = driver.findElement(sd.By.css('div.resource a'));
    return resourceLinkWillBeFoundPromise;
}).then(function(resLinkElement){
    //Extracting the href attribribute from anchor tag
    let resLinkHrefWillBeFoundPromise = resLinkElement.getAttribute('href');
    return resLinkHrefWillBeFoundPromise;
}).then(function(resLinkHref){
    //Resource Page will be loaded Promise
    let resPageWillBeLoadedPromise = driver.get(resLinkHref);
    return resPageWillBeLoadedPromise;
}).then(function(){
    //Handling the SiteOverlay
    let siteOverlayElementWillBeFoundPromise = driver.findElement(sd.By.css("div#siteOverlay"));
    return siteOverlayElementWillBeFoundPromise;
}).then(function(siteOverlayElement){
    //Waiting till the page loads completely and the siteoverlay vanishes.
    let willWaitForSiteoverlayToHidePromise = driver.wait(sd.until.elementIsNotVisible(siteOverlayElement),10000);
    return willWaitForSiteoverlayToHidePromise;
}).then(function(){
    //Course elements found Promise
    let courseElementWillBeFoundPromise = driver.findElements(sd.By.css('h2.courseInput'));
    return courseElementWillBeFoundPromise;
}).then(function(courseElements){
    // Text of all the courses that are taken with the help of courseElements
    globalCourseElements = courseElements;
    let courseElementsTextPromises = [];
    for(let i = 0; i < globalCourseElements.length; i++){
        courseElementsTextPromises.push(globalCourseElements[i].getText());
    }
    let combinedTextPromiseForAllCourseElements = Promise.all(courseElementsTextPromises);
    return combinedTextPromiseForAllCourseElements;
}).then(function(courseElementsTexts){
    //Comparing the coursename i.e cname from the courseElementTexts to proceed further with desired Course Tile
    for(let i = 0; i < courseElementsTexts.length; i++){
        if(cname === courseElementsTexts[i]){
            globalCourseIndex = i;
            break;
        }
    }
    let courseElementsWillBeClickedPromise = globalCourseElements[globalCourseIndex].click();
    return courseElementsWillBeClickedPromise;
}).then(function(){
    //Retrieving the current Course URL Promise
    let urlWillBeRetrievedPromise = driver.getCurrentUrl();
    return urlWillBeRetrievedPromise;
}).catch(function(err){
    console.log(err);
})


