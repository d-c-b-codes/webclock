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


onLoad();
function onLoad() {
    setColors();
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
    console.log('setting fonts!')
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
/*
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
*/  
            };
        };
    };
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
/*
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
*/  
            };
        };
    };
};

