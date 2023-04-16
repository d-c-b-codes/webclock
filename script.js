var doc = document;
var clockInButton = doc.getElementById('clockin');
var clockOutButton = doc.getElementById('clockout');
var timeLog = doc.getElementById('time-log');
var datePrint = doc.getElementById('date');
var inputForm = doc.getElementById('input-form');
var clearButton = doc.getElementById('clear-button');
var sumTable = doc.getElementById('sum-table');
var projectReport = doc.getElementById('project-report');
var clockState = localStorage.getItem('state');
var settings = doc.getElementById('settings');
var topBar = doc.getElementById('top-bar');
var quote = doc.getElementById('quote');
var settingsButton = doc.getElementById('settings-button');

settingsButton.addEventListener("change", event => {
    let selection = event.target.value;
    switch(selection){
        case 'settings':
            window.location.reload()
            break;
        default:
            createSettings(selection);
            break;
    };
});

clearButton.addEventListener('click', clearLocalStorage);
function clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
};

onLoad();
function onLoad() {
    createTimeString();
    createQuote();
    let projects = unlockProjects();
    if (projects.length == 0) {
        // pass
    } else {
        showProjects(projects);
        showGrandTotal(projects);
        showTotals(projects);
    };
    setColors();
    setFonts();
};

function createQuote(){
    let quotes = [];
    quotes.push('i\'m late for a very important date');
    quotes.push('it\'s only a matter of time');
    quotes.push('could be blue');
    quotes.push('doesn\'t that just squish your beans?');
    quotes.push('without you it\'s a waste of time');
    quotes.push('you live in the physical world');
    quotes.push('hope you\'re having a nice day!');
    quotes.push('is that really how long things take?');
    quotes.push('i know i stand in line \n until you think you have the time \n to spend an evening with me...');
    quotes.push('music alone shall live (never to die)');
    quotes.push('(c)lock in, dude');
    let rando = getRandomInt(quotes.length);
    quote.innerText = quotes[rando];
}
function getRandomInt(max) {
    let rando = Math.random();
    let adjustedRando = rando * max;
    let intRando = Math.floor(adjustedRando)
    return intRando;
  }

function showProjects(projects) {
    for (let i = (projects.length -1); i>=0; i--) {
        addToHTML(projects[i]);
    };
};

function showGrandTotal(projects) {
    let rawGrandTotal = 0;
    projects.map(function(project) {
        rawGrandTotal += project.rawDuration;
    });
    for (let i = 0; i<3; i++) {
        sumTable.innerHTML += `<div class="grid-item"></div>`
    };
    let cleanGrandTotal = parseTime(rawGrandTotal/1000);
    if (clockState == 'clocked-out') {
        sumTable.innerHTML += `<div class="grid-item">${cleanGrandTotal}</div>`;
    };
};

function showTotals(projects) {
    let projectNamesArray = projects.map( project => project.name);
    let projectNamesSet = new Set(projectNamesArray);
    for (let name of projectNamesSet.values()) {
        projectReport.innerHTML += `<div class="grid-item">${name}</div>`;
        projectReport.innerHTML += `<div class="grid-item">${sumTotal(name)}</div>`;
    };
};

function projectDelete(id) {
    let deleteButton = doc.createElement("button");
    deleteButton.innerText = 'delete';
    deleteButton.id = id;
    deleteButton.classList = 'delete-button';
    deleteButton.classList += ' button';
    return deleteButton;
}

let deleteButtons = doc.querySelectorAll('.delete-button');
deleteButtons.forEach(button => {
    button.addEventListener('click', deleteByID);
});

function deleteByID(event) {
    event.preventDefault();
    let id = parseInt(event.target.id);
    let projects = unlockProjects();
    let idArray = projects.map(project => project.startTime);
    let index = idArray.indexOf(id);
    if (projects[0].startTime == id) {
        localStorage.setItem('state','clocked-out');
    };
    projects.splice(index, 1);
    if (projects.length == 0) {
        localStorage.setItem('state','clocked-out');
    };
    lockProjects(projects);
    window.location.reload();
};

function sumTotal(projectName) {
    let projects = unlockProjects();
    let projectTotal = 0;
    let sameProjects = projects.filter(project => project.name == projectName);
    for (let project of sameProjects) {
        projectTotal += project.rawDuration;
    };
    return parseTime(projectTotal/1000);
};


function addToHTML(project) {
    timeLog.innerHTML += `<div class="grid-item">${project.name}</div>`;
    timeLog.innerHTML += `<div class="grid-item">${project.startInfo}</div>`;
    if (project.duration !== '') {
        timeLog.innerHTML += `<div class="grid-item">${project.endInfo}</div>`;
        timeLog.innerHTML += `<div class="grid-item">${project.cleanDuration}</div>`;
        timeLog.appendChild(projectDelete(project.startTime));
    };
};



function createTimeString() {
    let today = new Date();
    datePrint.innerHTML = `it is currently ${today.toLocaleString()}`
};

setInterval(createTimeString, 1000);


clockInButton.addEventListener('click', clockIn);

function clockIn(event) {
    event.preventDefault();
    if (localStorage.getItem('state') == 'clocked-in') {
        alert('already clocked in!');
    } else {
        let date = new Date;
        let formData = new FormData(inputForm);
        let timeEntry = createProjectObject(date, formData);
        let projects = unlockProjects();
        projects.unshift(timeEntry);
        lockProjects(projects);
        localStorage.setItem('state','clocked-in');
        window.location.reload();
    };
};


function createProjectObject(date, formData) {
    let project = {
    //start
        startTime: Date.now(),
        startInfo: date.toLocaleString(),
    //end
        endInfo: '',
    //overall        
        name: formData.get('project'),
        rawDuration: '',
        cleanDuration: '',
    };
    return project;
};

function zeroFill(number) {
    let zeroFilled = ('00'+number).slice(-2);
    return(zeroFilled);
};

function closeProject(date, project) {
    project.endTime = Date.now();
    project.endInfo = date.toLocaleString();

    let duration = project.endTime - project.startTime;
    project.rawDuration = duration;
    project.cleanDuration = parseTime(duration/1000);
    return project;
};


clockOutButton.addEventListener('click', clockOut);
    
function clockOut(event) {
    event.preventDefault();
    if (localStorage.getItem('state') == 'clocked-in') {
        let date = new Date;
        let projects = unlockProjects();
        let currentProject = projects[0];
        let updatedProject = closeProject(date, currentProject);
        projects[0] = updatedProject;
        lockProjects(projects);
        localStorage.setItem('state','clocked-out');
        window.location.reload();
        
    }
    else {
        alert('not clocked in!');
    };
};

function unlockProjects() {
    let projectsArray = [];
    let projectsJSON = localStorage.getItem('projects');
    let projects = JSON.parse(projectsJSON);
    if (projects !== null) {
        for (let project of projects) {
            projectsArray.push(project);
        };
    };
    return projectsArray;
};

function lockProjects(projects) {
    let projectsJSON = JSON.stringify(projects);
    localStorage.setItem('projects', projectsJSON);
    };

function parseTime(rawTimeElapsed) {
    let timeString = '';
    let hrs = Math.floor(rawTimeElapsed/3600);
    if (hrs !== 0) {
        timeString += `${hrs}h `;
    };
    let hoursRemainder = rawTimeElapsed % 3600;
    let mins = Math.floor(hoursRemainder/60);
    if (mins !== 0) {
        timeString += `${mins}m `;
    };
    let secs = (hoursRemainder % 60).toFixed(1);
    if (secs !== 0) {
        timeString += `${secs}s`;
    };
    return timeString;
};

function createSettings(selection){
    settings.innerHTML = '';
    let colors = createColorArray();
    let elements = ['headers','text','background','buttonText','buttonColor','clockIn','clockOut'];
    let fonts = ['caveat bold','caveat regular','indie flower','pecita'];
    for (let element of elements) {
        switch(selection){
            case 'fonts':
                for (let font of fonts){
                    let fontButton = createFontButton(element, font);
                    settings.appendChild(fontButton);
                };
                break;
            case 'colors':
                settings.innerHTML += element;
                for (let color of colors){
                    let colorButton = createColorButton(element, color);
                    settings.appendChild(colorButton);
                };
                break;
        };
        settings.innerHTML += '<br>';
    };
    createFontButtonFunctions();
    createColorButtonFunctions();
};

function createColorArray(){
    let colorArray = ['red','orange','yellow','green','blue','purple','black','white'];
    let darkColorArray = [];
    for (let color of colorArray) {
        color.toUpperCase();
        let darkColor = `dark${color}`;
        darkColorArray.push(darkColor);
    };
    for (let darkColor of darkColorArray) {
        colorArray.push(darkColor);
    };
    let colorArrayCaps = [];
    for (let color of colorArray) {
        colorArrayCaps.push(color.toUpperCase());
    }
    return colorArrayCaps;
};

function createColorButton(element, color){
    let colorButton = doc.createElement('button');
    colorButton.classList += element;
    colorButton.classList += ' color-button';
    colorButton.id = color;
    colorButton.style.display = 'inline';
    colorButton.style.backgroundColor = `var(--${color})`;
    colorButton.innerText = ' ';
    return colorButton;
};

function createFontButton(element, font){
//settings.innerHTML += `<button class="font-button" display="inline" style="font-family:${font}">${element}</button>`;
    let fontButton = doc.createElement('button');
    fontButton.classList += element;
    fontButton.classList += ' font-button';
    fontButton.id = font;
    fontButton.style.display = 'inline';
    fontButton.style.fontFamily = font;
    fontButton.innerText = element;
    return fontButton;
};

function createFontButtonFunctions(){
    let buttons = settings.querySelectorAll('.font-button');
    buttons.forEach(button => {
        button.addEventListener('click', changeFont);
    });
};

function createColorButtonFunctions(){
    let buttons = settings.querySelectorAll('.color-button');
    buttons.forEach(button => {
        button.addEventListener('click', changeColor);
    });
};

function changeFont(event){
    event.preventDefault();
    let element = event.target.classList[0];
    let font = event.target.id;
    let fontsObject = unlockFonts();
    if (fontsObject !== null) {
        switch(element){
            case 'headers':
                fontsObject.headers = font;
                break;
            case 'text':
                fontsObject.text = font;
                break;
            case 'background':
                fontsObject.background = font;
                break;
            case 'buttonText':
                fontsObject.buttonText = font;
                break;
            case 'buttonColor':
                fontsObject.buttonColor = font;            break;         
            case 'clockIn':
                fontsObject.clockIn = font;
                break;
            case 'clockOut':
                fontsObject.clockOut = font;
                break;                 
        };
        lockFonts(fontsObject);
    } else {
        localStorage.setItem('fonts', `{"${element}":"${font}"}`)
    };
    setFonts();
};


function unlockFonts(){
    let fontString = localStorage.getItem('fonts');
    let fontObject = JSON.parse(fontString);
    return fontObject;
};

function lockFonts(fontObject){
    let fontString = JSON.stringify(fontObject);
    localStorage.setItem('fonts', fontString);
};

function setFonts(){
    let fonts = unlockFonts();
    if (fonts !== null) {
        let keys = Object.keys(fonts);
        for (let key of keys) {
            switch(key){
                case 'headers':
                    doc.querySelectorAll('h3').forEach(header => {
                        header.style.fontFamily = fonts.headers;
                    });
                    break;
                case 'text':
                    doc.body.style.fontFamily = fonts.text;
                    break;
                case 'background':
                    doc.body.style.fontFamily = fonts.background;
                    break;
                case 'buttonText':
                    doc.querySelectorAll('.button').forEach(button => {
                        button.style.fontFamily = fonts.buttonText;
                    });
                    break;
                case 'buttonColor':
                    doc.querySelectorAll('.button').forEach(button => {
                        button.style.fontFamily = fonts.buttonColor;
                    });
                    break;         
                case 'clockIn':
                    clockInButton.style.fontFamily = fonts.clockIn;
                    break;
                case 'clockOut':
                    clockOutButton.style.fontFamily = fonts.clockOut;
                    break;  
            };
        };
    };
};


function changeColor(event){
    event.preventDefault();
    let element = event.target.classList[0];
    let color = event.target.id;
    let colorsObject = unlockColors();
    if (colorsObject !== null) {
        switch(element){
            case 'headers':
                colorsObject.headers = color;
                break;
            case 'text':
                colorsObject.text = color;
                break;
            case 'background':
                colorsObject.background = color;
                break;
            case 'buttonText':
                colorsObject.buttonText = color;
                break;
            case 'buttonColor':
                colorsObject.buttonColor = color;            break;         
            case 'clockIn':
                colorsObject.clockIn = color;
                break;
            case 'clockOut':
                colorsObject.clockOut = color;
                break;                 
        };
        lockColors(colorsObject);
    } else {
        localStorage.setItem('colors', `{"${element}":"${color}"}`)
    };
    setColors();
};


function unlockColors(){
    let colorString = localStorage.getItem('colors');
    let colorObject = JSON.parse(colorString);
    return colorObject;
};

function lockColors(colorObject){
    let colorString = JSON.stringify(colorObject);
    localStorage.setItem('colors', colorString);
};

function setColors(){
    let colors = unlockColors();
    if (colors !== null) {
        let keys = Object.keys(colors);
        for (let key of keys) {
            switch(key){
                case 'headers':
                    doc.querySelectorAll('h3').forEach(header => {
                        header.style.color = `var(--${colors.headers})`;
                    });
                    break;
                case 'text':
                    doc.body.style.color = `var(--${colors.text})`;
                    break;
                case 'background':
                    doc.body.style.backgroundColor = `var(--${colors.background})`;
                    break;
                case 'buttonText':
                    doc.querySelectorAll('.button').forEach(button => {
                        button.style.color = `var(--${colors.buttonText})`;
                    });
                    break;
                case 'buttonColor':
                    doc.querySelectorAll('.button').forEach(button => {
                        button.style.backgroundColor = `var(--${colors.buttonColor})`;
                    });
                    break;         
                case 'clockIn':
                    clockInButton.style.backgroundColor = `var(--${colors.clockIn})`;
                    break;
                case 'clockOut':
                    clockOutButton.style.backgroundColor = `var(--${colors.clockOut})`;
                    break;  
            };
        };
    };
};

