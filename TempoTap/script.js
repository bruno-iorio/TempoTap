"use strict";


//declare initializing variables here:

    // HTML DOM ELEMENTS
    let body = document.querySelector('body');
    let all = document.querySelectorAll('.disap'); // just to remove the menu itens when starting the game
    let logo = document.querySelector('#logo');
    let startbutton = document.querySelector('#startbutton');
    
    body.classList.add('menu'); // Adds 'menu' class to body -> used for changing background picture of the page
    // Menu buttons for each song:
    let song1 = document.querySelector('#Song1');
    let song2 = document.querySelector('#Song2');
    let song3 = document.querySelector('#Song3');
    let song4 = document.querySelector('#Song4');
    let song5 = document.querySelector('#Song5');
    let song6 = document.querySelector('#Song6');
    // Game elements
    let grid = document.querySelector('#game'); // this is the grid
    let line1 = document.querySelector('#l1'); // this is line 1 of the grid
    let line2 = document.querySelector('#l2');
    let line3 = document.querySelector('#l3');
    let line4 = document.querySelector('#l4');
    
    let box1 = document.querySelector('#b1');
    let box2 = document.querySelector('#b2');
    let box3 = document.querySelector('#b3');
    let box4 = document.querySelector('#b4');

    let pointscreen = document.querySelector('#points');
    let restart = document.querySelector("#restart");
    let comboscreen = document.querySelector('#combo');
    let quitbutton = document.querySelector('#quit');
    let calibrate = document.querySelector('#calibrate');
    let showcombo = document.querySelector("#showcombo");
    let showpoints = document.querySelector("#showpoints");
    let calibscreen = document.querySelector("#calibratingscreen");
    

    // After menu: shows when the game ends
    let gotomenu = document.querySelector('#gotomenu');
    let playagain = document.querySelector('#play');
    let aftergame = document.querySelector('.aftergame');

// Game parameters for setup and play
let movetilesparameter = false; //this will indicate when we need the tiles to move
let playingmode = false;
let time = 0; 
// Tiles and game data
let atiles = []; // this is the set of tiles in the game, only initialized while the game is active
let closenotes = [];
let points = 0;
let combo = 0;
let sethold = [] ;
let realnotes = [];
let realpositions = [];
let reallong;
let song = '';
let notespeed = 0; // just the speed of the notes
let testingparameter = true;
let testingspeed;

let audio;
let startaudio
let stoptime;
let bestcombo = 0;
let finishgametime;
let stopmovingtime;
let calibrateclicked = false;
let startpressed = false;
let previewaudio = false;
let restartclicked = false;

//For lighting up the buttons when a key is pressed
let fPressed = false; 
let gPressed = false; 
let jPressed = false; 
let hPressed = false; 

//EVENT LISTENERS: 
    startbutton.addEventListener("click",pressStart);
    quitbutton.addEventListener("click", activateMenu);
    restart.addEventListener("click", RestartFunction);
    song1.addEventListener("click", activateGame); // this function will go to game when activated
    song2.addEventListener("click",activateGame);
    song3.addEventListener('click',activateGame);
    song4.addEventListener("click", activateGame);
    song5.addEventListener("click", activateGame);
    song6.addEventListener("click",activateGame);
    
    song1.addEventListener('mouseenter',PlaySongPreview);
    song1.addEventListener('mouseleave', StopSongPreview);
    song2.addEventListener('mouseenter',PlaySongPreview);
    song2.addEventListener('mouseleave', StopSongPreview);
    song3.addEventListener('mouseenter',PlaySongPreview);
    song3.addEventListener('mouseleave', StopSongPreview);
    song4.addEventListener('mouseenter',PlaySongPreview);
    song4.addEventListener('mouseleave', StopSongPreview);
    song5.addEventListener('mouseenter',PlaySongPreview);
    song5.addEventListener('mouseleave', StopSongPreview);
    song6.addEventListener('mouseenter',PlaySongPreview);
    song6.addEventListener('mouseleave', StopSongPreview);

    gotomenu.addEventListener("click", activateMenu);
    playagain.addEventListener("click",activateGame);
    document.addEventListener("keydown", HitNotes); 
    document.addEventListener("keydown",HoldlongTile);
    document.addEventListener("keyup",ReleaselongTile);
    calibrate.addEventListener("click",CalibrateTileSpeed);
    document.addEventListener('keydown',LightUpTheTile) 
    document.addEventListener('keyup', TurnOffTheTile) 
    setTimeout(FindBrowserSpeed,700); // this solves the problem when you have different computers or browsers with different speeds for the tiles...
    

let damedanepositions = [
    2811,2845,2890,2912,3255,3340,3435,3482,
    3521,3556,3975,4031,4060,4294,4357,4447,
    4516,4558,4646,4692,4732,5153,5187,
    5588,5655,5751,5813,5885,6040,6328,
    6355,6394,6446,6488,6596,6695,6829,6961,
    7079,7109,7552,7630,7688,7709,7822,7969,
    8087,8164,8322,8368,8439,8732,8765,8811,
    8853,8870,8974,9054,9160,9249,9300,9192,
    9426,9899,9977,10032,10262,10332,10414,10671,
    10971,11076,11094,11150,11409,11501,11598, 
    12084,12084,12115,12115,12151,12151,12208,12208, 
    12456,12480,12534,12671,12748,12837,12862,
    13283,13355,13365,13614,13659,13870,13939,
    14012,14048,14414,14414,14443,14443,14500,14500,
    14553,14553,14780,14824,14877,14942,15035,15157,
    15262,15262,15409,15409,15664,15701,15738,15774,
    15839,16245,16302,16323,16351,16432,16761,16785,
    16826,16895];

for(let i = 0; i < damedanepositions.length; i++){
    damedanepositions[i] -= 20;
}

let damedanenotes =[
1,2,3,4,1,2,1,3,4,4,3,4,
1,3,3,4,1,2,2,3,2,1,3,
3,4,1,2,2,3,1,2,2,1,3,
2,2,1,4,4,4,3,3,3,3,3,2,
3,4,2,1,1,2,2,2,2,2,1,1,
2,4,2,3,1,1,3,4,1,3,4,
2,3,2,1,3,1,2,4,1,3,
1,3,2,4,2,4,2,2,
1,2,2,3,3,3,3,2,1,1,
2,1,2,2,1,4,1,4,2,3,
2,3,1,1,3,2,4,3,1,3,
1,3,1,2,3,4,2,2,3,4,
2,4,1,2,3,4
];
       
let damedanelongnotes = [
    {line: 3, start:2965, end:3029},
    {line: 4, start:5241, end:5362},
    {line: 3, start:10486, end:10546},
    {line: 4, start:10697, end:10897},
    {line: 2, start:11744, end:11949},
    {line: 1, start:12881, end:13098},
    {line: 4, start:13691, end:13816},
    {line: 4, start:14065, end:14265},
];


let twinkletwinkleSong = [
1064,1157,1242,1341,1438,1523,1624,1801,
1889,2000,2090,2179,2269,2416,2653,2726,
2833,2911,3041,3133,3234,3390,3480,3605,
3709,3802,3906,4015,4255,4375,4471,4567,
4675,4770,4876,5054,5144,5264,5354,5455,
5557,5755,5892,5990,6098,6182,6290,6385,
6476,6668,6793,6889,6979,7070,7153,7316,
];

let twinklenotes =[
1,1,2,2,3,3,2,4,
4,3,3,2,2,1,1,1,
2,2,3,3,2,4,4,3,
3,2,2,1,4,4,3,3,
2,2,3,4,4,3,3,2,
2,3,1,1,2,2,3,3,
2,4,4,3,3,2,2,1,
];

let elisepositions = [686,733,768,816,857,907,953,996,
1042,1077,1129,1177,1231,1262,1309,1323,
1399,1446,1488,1535,1583,1622,1672,1718,
1755,1798,1842,1894,1940,1986,2029,2070,
2114,2138,2166,2209,2255,2299,2340,2400,
2437,2477,2516,2564,2611,2657,2833,2876,
2928,2972,3017,3055,3104,3150,3196,3240,
3288,3334,3379,3420,3462,3512,3555,3607,
3647,3688,3745,3912,3962,4001,4049,4093,
4145,4186,4229,4275,4320,4365,4409,4454,
4498,4543,4589,4639,4682,4724,4769,4812,
4950,4995,5039,5087,5134,5183,5224,5263,
5307,5358,5401,5443,5494,5489,5533,5579,
5621,5669,5687,5766,5804,5852,5719,5947,
6081,6124,6169,6211,6250,6250,6309,6352,
6393,6432,6476,6526,6572,6617,6658,6702,
6750,6795,6893,6885,6930,6972,7028,7072,
7108,7156,7199,7242,7293,7340,7378,7421,
7473,7507,7571,7610,7653,7692,7738,7786,
7829,7875,7920,7968,8020,8061,8104,8149,
8195,8241,8282,8327,8372,8422,8463,8502,
8552];

for(let i = 0; i< elisepositions.length; i++){
    elisepositions[i] += 20;
}

let elisenotes = [
3,2,3,2,3,1,4,3,2,1,2,3,4,3,3,1,
1,2,3,4,4,1,2,3,3,2,3,2,3,1,4,3,
2,1,2,3,4,3,3,3,1,1,2,4,3,1,3,2,
3,2,3,1,4,3,2,1,2,3,4,3,3,1,1,2,
3,4,4,3,2,3,2,3,1,4,3,2,1,2,3,4,
3,3,1,1,2,4,3,1,2,2,3,4,1,2,1,4,
3,2,1,2,3,3,2,1,1,2,2,3,2,1,1,2,
2,1,2,3,4,3,2,3,2,3,2,3,2,3,2,3,
2,3,4,3,2,1,1,2,3,4,3,3,1,1,2,3,
4,4,1,2,3,3,2,3,2,3,1,4,3,2,1,2,
3,4,3,3,1,1,2,4,3];

let longelise = [{line: 1, start:8620, end:8725}];

let doeadeerpositions = [
3692,4448,4795,5450,5797,6185,6778,7780,
8495,8808,9033,9339,9544,9830,11915,12712,
12998,13693,14041,14470,14981,16044,16841,17127,
17373,17557,17802,18124,20148,20945,21184,21470,
21685,22022,22287,24352,25088,25415,25660,25824,
26069,26376,28481,29258,29524,29789,29977,30242,
30529,32082,32389,32634,33104,33717,34126,34699,
35169,35762,36252,36763];

for(let i = 0; i< doeadeerpositions.length; i++){ //we forgot to convert time to left position -> this corrects it

    doeadeerpositions[i] = doeadeerpositions[i]*(180/1000) + 100;
}

let doeadeernotes = [
1,1,2,2,1,3,2,3,
2,2,3,3,3,4,4,1,
2,1,3,4,3,3,2,3,
3,4,3,4,2,1,2,2,
3,3,4,3,1,2,3,4,
4,3,4,1,2,3,2,3,
4,3,2,1,2,3,1,1,
2,3,2,1];

let glimpsepositions = [700,757,1093,1148,1576,2227,2287,2349,
    2541,3004,3068,3130,3505,3555,3621,3665,
    3732,3803,3831,3941,4161,4205,4224,4274,
    4362,4395,4411,5011,5083,5138,5177,5262,
    5306,5383,5460,5669,5718,5746,5773,5872,
    5917,6542,6636,6680,6730,6812,6928,7016,
    7115,7181,7242,7324,7407,7473,7508,8069,
    8140,8195,8267,8344,8394,8449,8542,8608,
    8663,8713,8757,9464,9519,9580,9778,9971,
    10367,10560,10758,10987,11053,11119,11246,11318,
    11370,11458,11515,11629,11691,11784,11841,11893,
    12017,12187,12509,12591,12648,12768,12845,12912,
    12959,13005,13187,13228,13290,13342,13409,13544,
    13714,14028,14079,14157,14348,14400,14462,14560,
    14742,14833,14875,14942,15004,15061,15128,15206,
    15268,15330,15506,15578,15655,15717,16033,16591];

let glimpsenotes = [2,3,1,4,1,2,3,4,1,3,2,3,2,3,3,3,
    3,2,2,1,2,3,3,2,4,4,3,2,2,2,2,2,
    3,3,1,2,4,4,2,1,1,3,3,2,2,1,1,3,
    3,4,4,4,4,3,2,2,3,3,2,2,3,4,3,1,
    1,2,3,2,1,1,2,3,4,3,3,4,1,2,3,1,
    2,3,2,4,2,1,1,2,3,2,2,2,2,3,2,1,
    3,2,2,1,2,3,3,1,2,2,1,3,4,2,3,3,
    4,1,2,3,2,3,3,4,3,2,1,2,2,1,1,2,2
];



let glimpselong = [{line: 1, start:449, end:606},{line: 2, start:827, end:1072},
    {line: 3, start:1220, end:1370},{line: 2, start:1413, end:1550},
    {line: 1, start:1979, end:2100},{line: 3, start:2740, end:2899},
    {line: 4, start:4461, end:4681},{line: 4, start:5983, end:6170},
    {line: 1, start:7543, end:7819},{line: 4, start:8856, end:9396},
    {line: 3, start:12074, end:12162},{line: 4, start:12074, end:12162},
    {line: 1, start:12238, end:12394},{line: 3, start:13600, end:13684},
    {line: 4, start:13600, end:13684},{line: 2, start:13780, end:13960},
    {line: 3, start:16079, end:16519},{line: 4, start:16079, end:16519},
    {line: 1, start:16623, end:16861}];

let moonpositions = [
    1629,1738,1817,1900,1968,2176,2235,2616,
    2650,2712,3055,3147,3255,3347,3435,3527,
    3586,3945,4024,4045,4093,4478,4486,4536,
    4591,5235,5921,5947,5964,6557,6633,7380,
    7485,7585,7652,7715,7857,7932,7994,8240,
    8369,8984,9063,9130,9194,9251,9391,
    9483,9546,9617,9780,9845,9874,10242,10267,
    10304,10710,10900,11675,11729,11762,11821,12138,12385
];

let moonnotes = [
    4,4,3,2,1,2,3,2,
    3,3,2,2,1,3,4,3,
    4,3,2,1,3,3,2,3,
    4,2,2,1,2,4,3,4,
    4,3,3,2,1,3,1,2,
    4,2,2,4,3,1,3,
    2,1,1,3,2,1,4,3,
    4,3,3,3,3,2,2,1,2
];

let moonlong = [
    {line: 1, start:2316, end:2555},{line: 1, start:3661, end:3774},
    {line: 2, start:4152, end:4332},{line: 4, start:5009, end:5176},
    {line: 1, start:5270, end:5654},{line: 3, start:6011, end:6194},
    {line: 4, start:6442, end:6524},{line: 3, start:6740, end:6894},
    {line: 3, start:8064, end:8224},{line: 3, start:8449, end:8684},
    {line: 1, start:8791, end:8948},{line: 3, start:10321, end:10538},
    {line: 2, start:10969, end:11207},{line: 3, start:12452, end:12753}
];
 

// This will give us time to compute the correct tile speed...
function pressStart(event){ 
if(startpressed == false){
    startpressed = true;
    let endcalibration = false;
    calibscreen.style.display = 'block';
    let loading = setInterval(function(){
        if(endcalibration == false){
            if(calibscreen.textContent == 'Tuning the keys...'){
                calibscreen.textContent = 'Polishing the piano...';
            }
            else if(calibscreen.textContent == 'Polishing the piano...'){
                calibscreen.textContent = 'Uploading music sheets...';
            }
            }
        else{
            clearInterval(loading);
        }
    },1700);
    
    setTimeout(function(){
        for(let i=0; i < all.length; i++){
            all[i].style.display = 'block';
        }
        calibscreen.style.display = 'none';
        endcalibration = true;
    },6500);
    startbutton.style.display = 'none';
    }
}

function activateGame(event){
    //go to the other screen 
    if(previewaudio){
        startaudio.pause();
        startaudio.currentTime = 0;
        startaudio = null;
        previewaudio = false;
    }
    if(startaudio !== null){
        startaudio.pause();
        startaudio.currentTime = 0;
        startaudio = null;
        previewaudio = false;
    }
    playingmode = true;
    bestcombo = 0;
    grid.className = '';
    box1.className = '';
    box2.className = '';
    box3.className = '';
    box4.className = '';
    box1.classList.add('box');
    box2.classList.add('box');
    box3.classList.add('box');
    box4.classList.add('box');
    pointscreen.textContent = 'Points:';
    comboscreen.textContent = 'Best Combo:';
    quitbutton.style.display = 'block';
    restart.style.display = 'block';
    calibrate.style.display = 'block';
    showpoints.style.display = 'inline-block';
    showcombo.style.display = 'inline-block';
    if(song =='damedane.mp3'){
        audio.pause();
        audio.currentTime = 0;
        aftergame.style.sh = '0';
        aftergame.style.display = 'none';
        combo = 0;
        points  =0;
        showpoints.textContent = `Points: ${points}`;
        showcombo.textContent = `Combo: ${combo}`;
        realpositions = damedanepositions;
        realnotes = damedanenotes;
        reallong = damedanelongnotes;
        grid.classList.add('song1');
        box1.classList.add('damedane');
        box2.classList.add('damedane');
        box3.classList.add('damedane');
        box4.classList.add('damedane');
        }
    else if(song == 'twinkle.mp3'){
        audio.pause();
        audio.currentTime = 0;
        aftergame.style.opacity = '0';
        aftergame.style.display = 'none';
        combo = 0;
        points  =0;
        showpoints.textContent = `Points: ${points}`;
        showcombo.textContent = `Combo: ${combo}`;
        realpositions = twinkletwinkleSong;
        realnotes = twinklenotes;
        reallong = [];
        grid.classList.add('twinkle');
        box1.classList.add('twinkle');
        box2.classList.add('twinkle');
        box3.classList.add('twinkle');
        box4.classList.add('twinkle');
    }
    else if(song ==='elise.mp3'){
        audio.pause();
        audio.currentTime = 0;
        aftergame.style.opacity = '0';
        aftergame.style.display = 'none';
        combo = 0;
        points  =0;
        showpoints.textContent = `Points: ${points}`;
        showcombo.textContent = `Combo: ${combo}`;
        realpositions = elisepositions;
        realnotes = elisenotes;
        reallong = longelise;
        grid.classList.add('elise');
        box1.classList.add('elise');
        box2.classList.add('elise');
        box3.classList.add('elise');
        box4.classList.add('elise');        
    }
    else if(song ==='doe.mp3'){
        audio.pause();
        audio.currentTime = 0;
        aftergame.style.opacity = '0';
        aftergame.style.display = 'none';
        combo = 0;
        points  =0;
        showpoints.textContent = `Points: ${points}`;
        showcombo.textContent = `Combo: ${combo}`;
        realpositions = doeadeerpositions;
        realnotes = doeadeernotes;
        reallong = [];
        grid.classList.add('doe');
        box1.classList.add('doe');
        box2.classList.add('doe');
        box3.classList.add('doe');
        box4.classList.add('doe');
    }
    else if(song ==='glimpse.mp3'){
        audio.pause();
        audio.currentTime = 0;
        aftergame.style.opacity = '0';
        aftergame.style.display = 'none';
        combo = 0;
        points  =0;
        showpoints.textContent = `Points: ${points}`;
        showcombo.textContent = `Combo: ${combo}`;
        realpositions = glimpsepositions;
        realnotes = glimpsenotes;
        reallong = glimpselong;
        grid.classList.add('glimpse');
        box1.classList.add('glimpse');
        box2.classList.add('glimpse');
        box3.classList.add('glimpse');
        box4.classList.add('glimpse');
    }
    else if(song ==='moon.mp3'){
        audio.pause();
        audio.currentTime = 0;
        aftergame.style.opacity = '0';
        aftergame.style.display = 'none';
        combo = 0;
        points  =0;
        showpoints.textContent = `Points: ${points}`;
        showcombo.textContent = `Combo: ${combo}`;
        realpositions = moonpositions;
        realnotes = moonnotes;
        reallong = moonlong;
        grid.classList.add('moon');
        box1.classList.add('moon');
        box2.classList.add('moon');
        box3.classList.add('moon');
        box4.classList.add('moon');
    }
    else{ 
        if(event.target.id == 'Song1'){
            realpositions = damedanepositions;
            realnotes = damedanenotes;
            reallong = damedanelongnotes;
            song = 'damedane.mp3';
            stoptime = 100000;
            showpoints.textContent = `Points: ${points}`;
            showcombo.textContent = `Combo: ${combo}`;
            document.body.classList.remove('menu');
            document.body.classList.add('bakamitai');
            grid.classList.add('song1');
            box1.classList.add('damedane');
            box2.classList.add('damedane');
            box3.classList.add('damedane');
            box4.classList.add('damedane');
        }
        else if(event.target.id == 'Song2'){
            realpositions = twinkletwinkleSong;
            realnotes = twinklenotes;
            reallong = [];
            song = 'twinkle.mp3';
            stoptime = 42000;
            showpoints.textContent = `Points: ${points}`;
            showcombo.textContent = `Combo: ${combo}`;
            document.body.classList.remove('menu');
            document.body.classList.add('twinkle');
            grid.classList.add('twinkle');
            box1.classList.add('twinkle');
            box2.classList.add('twinkle');
            box3.classList.add('twinkle');
            box4.classList.add('twinkle');
        }
        else if(event.target.id == 'Song3'){
            realpositions = elisepositions;
            realnotes = elisenotes;
            reallong = longelise;
            song = 'elise.mp3';
            stoptime = 50000;
            showpoints.textContent = `Points: ${points}`;
            showcombo.textContent = `Combo: ${combo}`;
            document.body.classList.remove('menu');
            document.body.classList.add('elise');
            grid.classList.add('elise');
            box1.classList.add('elise');
            box2.classList.add('elise');
            box3.classList.add('elise');
            box4.classList.add('elise');
        }
        else if(event.target.id == 'Song4'){
            realpositions = doeadeerpositions;
            realnotes = doeadeernotes;
            reallong = [];
            song = 'doe.mp3';
            stoptime = 42000;
            showpoints.textContent = `Points: ${points}`;
            showcombo.textContent = `Combo: ${combo}`;
            document.body.classList.remove('menu');
            document.body.classList.add('doe');
            grid.classList.add('doe');
            box1.classList.add('doe');
            box2.classList.add('doe');
            box3.classList.add('doe');
            box4.classList.add('doe');
        }        
        else if(event.target.id =='Song5'){
            realpositions = glimpsepositions;
            realnotes = glimpsenotes;
            reallong = glimpselong;
            song = 'glimpse.mp3';
            stoptime = 94000;
            showpoints.textContent = `Points: ${points}`;
            showcombo.textContent = `Combo: ${combo}`;
            document.body.classList.remove('menu');
            document.body.classList.add('glimpse');
            grid.classList.add('glimpse');
            box1.classList.add('glimpse');
            box2.classList.add('glimpse');
            box3.classList.add('glimpse');
            box4.classList.add('glimpse');
        }
        else if(event.target.id =='Song6'){
            realpositions = moonpositions;
            realnotes = moonnotes;
            reallong = moonlong;
            song = 'moon.mp3';
            stoptime = 70000;
            showpoints.textContent = `Points: ${points}`;
            showcombo.textContent = `Combo: ${combo}`;
            document.body.classList.remove('menu');
            document.body.classList.add('moon');
            grid.classList.add('moon');
            box1.classList.add('moon');
            box2.classList.add('moon');
            box3.classList.add('moon');
            box4.classList.add('moon');
        }
    }
    for(let i = 0; i < all.length; i++){
        all[i].style.display = 'none'; //removes the menu itens
    }

    grid.style.display = 'block'; //the grid appears

    for(let i = 0; i <  realpositions.length; i++){
        let a = document.createElement('div');
        a.classList.add('tiles');
        //a.textContent = `${i}, ${realpositions[i]}` //this is for testing purposes. Delete this later...
        if(song == 'damedane.mp3'){
            a.classList.add('damedane');
        }
        else if(song == 'twinkle.mp3'){
            a.classList.add('twinkle');
        }
        else if(song ==='elise.mp3'){
            a.classList.add('elise');
        }
        else if(song === 'doe.mp3'){
            a.classList.add('doe');
        }
        else if(song == 'glimpse.mp3'){
            a.classList.add('glimpse');
        }
        else if(song === 'moon.mp3'){
            a.classList.add('moon');
        }
        atiles.push({element: a, position: realpositions[i], line: realnotes[i], close: false, miss: true, far: true, check: true});
        //element is the html object, line is the line where it is placed, close indicates whether the note is close enought, 
        //far indicates if the note should be invisible when it is too far, check checks the combo condition
        a.style.left = `${atiles[i].position}px`;
        a.style.display = 'none';

        if(atiles[i].line == 1){
            line1.appendChild(a);
        }
        if(atiles[i].line == 2 ){
            line2.appendChild(a);
        }
        if(atiles[i].line == 3){
            line3.appendChild(a);
        }
        if( atiles[i].line == 4){
        line4.appendChild(a);
        }

    } // creates atiles with normal tiles
    
    for(let i = 0; i< reallong.length; i++){
        let t = document.createElement('div');
        t.classList.add('tiles');
        //t.textContent = `${i}, ${reallong[i].start}` this was to fix the timings manually
        if(song == 'damedane.mp3'){
            t.classList.add('damedane');
        }
        else if(song == 'twinkle.mp3'){
            t.classList.add('twinkle');
        }
        else if(song =='elise.mp3'){
            t.classList.add('elise');
        }
        else if(song == 'elise.mp3'){
            t.classList.add('doe');
        }
        else if(song === 'glimpse.mp3'){
            t.classList.add('glimpse');
        }
        else if(song === 'moon.mp3'){
            t.classList.add('moon');
        }

        t.style.width = `${reallong[i].end - reallong[i].start}px`;
        t.style.display = 'none';
        if(reallong[i].line == 1){
            line1.appendChild(t);
        }
        if(reallong[i].line == 2){
            line2.appendChild(t);
        }
        if(reallong[i].line == 3){
            line3.appendChild(t);
        }
        if(reallong[i].line == 4){
            line4.appendChild(t);
        }
        sethold.push({element: t, position: reallong[i].start, start: reallong[i].start, end: reallong[i].end, line: reallong[i].line,  hold: false, hitin: 0 , releasedin: 0, miss: true, check: true, far: true});
//same for normal tiles, adding: hitin is when you press and realeasedin is when you stop holding the key
    } //create long notes and add them to sethold

    movetilesparameter = true;
    stopmovingtime = setTimeout(function(){movetilesparameter = false;}, stoptime); 
    // after 100 seconds the tiles will stop the moving animation, if it finishes, we know that the player finished the song
    requestAnimationFrame(MoveTiles);
    audio = new Audio(song);
    audio.play();
    finishgametime = setTimeout(FinishGame, stoptime); //make a function that lower the volume when it is finished
}




function MoveTiles() { //this function updates the position of the tiles. We have to change the parameters...

    for(let i = 0; i< atiles.length; i++){
        if(atiles[i].far && atiles[i].position < 2000){ //checks if the tile is far
            atiles[i].far = false;
        }

        if (atiles[i].far == false && atiles[i].close == false){ //changes the display if it is not far
            atiles[i].element.style.display = 'inline-block';
        }

        if(atiles[i].position >-5){//this moves the tiles in atiles
            atiles[i].position -= notespeed; // multiply the number in the left-hand side by 60 and then we have the speed, in px/s, of the tiles 
            atiles[i].element.style.left =  `${atiles[i].position}px`;
        }
        
        else{
            atiles[i].element.style.display = 'none'; //makes notes disapear,changing the display
        }

        // put the tiles in closenotes, which will serve to know which tiles are hittable(this makes the funtion more efficient)
        if(atiles[i].position < 130 && (atiles[i].close == false)){ 
            atiles[i].close = true;
            closenotes.push(atiles[i]);
        }}
        
        if(closenotes.length >= 1){
            if(closenotes[0].position < 85){
                if(closenotes[0].miss && closenotes[0].check){
                    combo = 0;
                    showcombo.textContent = `Combo: ${combo}`;
                    closenotes[0].check = false;
                }
                closenotes.shift(); // removes from closenotes
            }
        }  

    for(let i = 0; i < sethold.length; i++){ //move the long notes
        if(sethold[i].far && sethold[i].position < 2000){ //checks if the longtile is far
            sethold[i].far = false;
        }

        if (sethold[i].far == false && sethold[i].hitin == 0){ //changes the display if it is not far
            sethold[i].element.style.display = 'inline-block';
        } 

        if(sethold[i].position >-800){
            sethold[i].position -= notespeed; // multiply the number in the left-hand side by 60 and then we have the speed, in px/s, of the tiles 
            sethold[i].element.style.left =  `${sethold[i].position}px`;
        }
        
        else{//makes it disapear if it is far on the other side
            sethold[i].element.style.display = 'none' ;
            if(sethold[i].miss && sethold[i].check){
                combo  = 0;
                showcombo.textContent = `Combo: ${combo}`;
                sethold[i].check = false;
            }
        }
    }

    if(movetilesparameter) {
        requestAnimationFrame(MoveTiles); //so we know when to finish the tiles movement
    }
} //function ends here, that was long


function HitNotes(event){ //only for normal notes  //  [117, 125] and [80, 87] -> ok, [109, 116] and [88, 92] -> good , [93, 108] -> perfect 
    if(playingmode){
        let b = event.key;
        for(let i = 0; i < closenotes.length; i++){
            let positionnow = closenotes[i].position;
            if(b == 'f' && closenotes[i].line == 1 && closenotes[i].miss == true){
                closenotes[i].element.style.display = 'none';
                closenotes[i].miss = false ; 
                    
                if((positionnow >= 122)|| (positionnow <= 92)){ //ok
                    points += 50*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;

                }    
                else if((positionnow >= 114 && positionnow <= 121) ||(positionnow >= 93 && positionnow <= 96)){ // good
                    points +=200*(1+ combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;

                }
                else if(positionnow >= 97 && positionnow <=113){ // perfect
                    points += 300*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }
                combo += 1  ; 
                showcombo.textContent = `Combo: ${combo}`;
                if(combo > bestcombo){
                    bestcombo = combo;
                }
            }

            else if(b == 'g' && closenotes[i].line == 2 && closenotes[i].miss == true){
                closenotes[i].element.style.display = 'none';
                closenotes[i].miss = false ;

                if((positionnow >= 122)|| (positionnow <= 92)){ //ok
                    points += 50*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;

                }    
                else if((positionnow >= 114 && positionnow <= 121) ||(positionnow >= 93 && positionnow <= 96)){ // good
                    points +=200*(1+ combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }
                else if(positionnow >= 97 && positionnow <=113){ // perfect
                    points += 300*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }
                combo += 1;
                showcombo.textContent = `Combo: ${combo}`;

                if(combo > bestcombo){
                    bestcombo = combo;
                }
            }

            else if(b == 'j' && closenotes[i].line ==3 && closenotes[i].miss == true){
                closenotes[i].element.style.display = 'none';
                closenotes[i].miss = false ;

                if((positionnow >= 122)|| (positionnow <= 92)){ //ok
                    points += 50*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }    
                else if((positionnow >= 114 && positionnow <= 121) ||(positionnow >= 93 && positionnow <= 96)){ // good
                    points +=200*(1+ combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }
                else if(positionnow >= 97 && positionnow <=113){ // perfect
                    points += 300*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }
                combo += 1;
                showcombo.textContent = `Combo: ${combo}`;
                if(combo > bestcombo){
                    bestcombo = combo;
                }
            }

            else if(b == 'k' && closenotes[i].line == 4 && closenotes[i].miss == true){
                closenotes[i].element.style.display = 'none';
                closenotes[i].miss = false ;

                if((positionnow >= 122)|| (positionnow <= 92)){ //ok
                    points += 50*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;

                }    
                else if((positionnow >= 114 && positionnow <= 121) ||(positionnow >= 93 && positionnow <= 96)){ // good
                    points +=200*(1+ combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;
                }
                else if(positionnow >= 97 && positionnow <=113){ // perfect
                    points += 300*(1 + combo*0.1);
                    points = Math.floor(points);
                    showpoints.textContent = `Points: ${points}`;

                }
                combo += 1;
                showcombo.textContent = `Combo: ${combo}`;
                if(combo > bestcombo){
                    bestcombo = combo;
                }
            }
        }
    }
}


 
function LightUpTheTile(event){
    let name = event.key; 
    if (name === 'f') { 
        fPressed = true ;
        box1.classList.add('pressed');
    } 
    if (name === 'g') { 
        gPressed = true ;
        box2.classList.add('pressed');
    } 
    if (name === 'j') { 
        hPressed = true ;
        box3.classList.add('pressed');
    } 
    if (name === 'k') { 
        gPressed = true ;
        box4.classList.add('pressed');
    } 
} 
 
function TurnOffTheTile(event) { 
    let name = event.key; 
    if (name === 'f') { 
        gPressed = false ;
        box1.classList.remove('pressed') ;
    } 
    if (name === 'g') { 
        gPressed = false ;
        box2.classList.remove('pressed') ;
    } 
    if (name === 'j') { 
        gPressed = false ;
        box3.classList.remove('pressed') ;
    } 
    if (name === 'k') { 
        gPressed = false ;
        box4.classList.remove('pressed') ;
    } 
}

function HoldlongTile(event){
    
    let keypressed = event.key;
    for(let i = 0; i < sethold.length; i++){
        if(sethold[i].hold == false){
            if((keypressed == 'f' && sethold[i].line == 1 )||(keypressed == 'g' && sethold[i].line == 2)||(keypressed == 'j' && sethold[i].line == 3)||(keypressed == 'k' && sethold[i].line == 4)){
                if(sethold[i].position < 125 && sethold[i].position > 80){
                    
                    sethold[i].hold = true;
                    sethold[i].hitin = sethold[i].position;
                    sethold[i].miss = false; //confirms that you haven't missed this note

                }
            }
        }
    }
}


function ReleaselongTile(event){
    
    let keyreleased = event.key;
    for(let i = 0; i < sethold.length; i++){
        if(sethold[i].hold){
            if((keyreleased == 'f' && sethold[i].line == 1 )||(keyreleased == 'g' && sethold[i].line == 2)||(keyreleased == 'j' && sethold[i].line == 3)||(keyreleased == 'k' && sethold[i].line == 4)){
                sethold[i].hold = false;
                sethold[i].releasedin = sethold[i].position;
                sethold[i].element.style.display = 'none';
                if(sethold[i].hitin -sethold[i].releasedin > sethold[i].end - sethold[i].start){
                    points += 5*(sethold[i].end - sethold[i].start)*(1+combo*0.1);
                }
                else{
                points += 5*(sethold[i].hitin - sethold[i].releasedin)*(1+combo*0.1);
                }
                combo +=1;
                showcombo.textContent = `Combo: ${combo}`;
                points = Math.floor(points); // accounts the points
                showpoints.textContent = `Points: ${points}`;
                if(combo > bestcombo){
                    bestcombo = combo;
                }
            }
        }
    }

}



function FinishGame(){ // this function will take the player to a 'aftergame' screen with their score and combos etc..., with the option to play again or to go to the menu
    aftergame.style.display = 'block';
    restart.style.display = 'none';
    calibrate.style.display ='none';
    quitbutton.style.display = 'none';
    pointscreen.textContent += ` ${points}`;
    comboscreen.textContent += ` ${bestcombo}`;
    let fadeopacity = 0;
    let fadein = setInterval(function(){
        if(fadeopacity < 0.8){    
            fadeopacity +=0.05;
            aftergame.style.opacity = `${fadeopacity}`;
        }
        else{
            clearInterval(fadein);
        }
    }, 100);
    for(let i = 0; i < atiles.length; i++){
        atiles[i].element.remove();
    }
    atiles = [];
    for(let i = 0; i < sethold.length; i++){
        sethold[i].element.remove();
    }
    sethold = [];
    closenotes = [];
}


function FindBrowserSpeed(){//changes the speed according to the browser
    testingspeed = [];
    testingparameter = true;
    let a  = document.createElement('div');
    a.classList.add('tiles');
    a.style.display = 'none';
    body.appendChild(a);
    let r = {element: a, position: 500};
    testingspeed.push(r);
    a.style.left = '500px'; 
    let b = 0;
    setTimeout(function(){calculatespeed(b,r,a); testingspeed = []; r = {};testingparameter = false},6000);

    if(testingparameter){
        requestAnimationFrame(movetilestest);
    }
}

////

function movetilestest(){
    if(testingspeed.length > 0){
        testingspeed[0].position -= 1;
        testingspeed[0].element.style.left = `${testingspeed[0].position}px`;
    }


    if(testingparameter){
        requestAnimationFrame(movetilestest);
    }
}

function calculatespeed(x, element, a){
    x = (500 - element.position)/6; 
    notespeed = 180/x;
    a.remove();

}

//
function activateMenu(){
    clearTimeout(finishgametime);
    clearTimeout(stopmovingtime);
    playingmode  = false;
    quitbutton.style.display = 'none';
    calibrate.style.display = 'none';
    restart.style.display = 'none'
    movetilesparameter = false;
    pointscreen.textContent = 'Points:';
    comboscreen.textContent = 'Best Combo:';
    realnotes = [];
    reallong = [];
    realpositions = [];
    combo = 0;
    points = 0;
    song = '';
    grid.style.display = 'none';
    aftergame.style.display = 'none';
    aftergame.style.opacity = '0';
    audio.pause();
    audio.currentTime = 0;
    body.className = "";
    body.classList.add('menu');
    bestcombo = 0;
    showcombo.style.display = 'none';
    showpoints.style.display = 'none';
    if(atiles.length > 0){
        for(let i = 0; i< atiles.length; i++){
            atiles[i].element.remove();
        }
        atiles = [];
    }
    if(sethold.length > 0){
        for(let i = 0; i < sethold.length; i++){
            sethold[i].element.remove();
        }
        sethold = [];
    }
    closenotes = [];
    playingmode = false;
    for(let i = 0; i < all.length; i++){
        all[i].style.display = 'block'; //removes the menu itens
    }

}

function CalibrateTileSpeed(event){
    if(calibrateclicked == false){
        playingmode = false;
        calibrateclicked = true;
        clearTimeout(finishgametime);
        clearTimeout(stopmovingtime);
        pointscreen.textContent = 'Points:';
        comboscreen.textContent = 'Best Combo:';
        audio.pause();
        audio.currentTime = 0;
        movetilesparameter = false;
        combo = 0;
        points  = 0;
        for(let i = 0; i< atiles.length; i++){
            atiles[i].element.remove();

        }
        atiles = [];
        for(let i = 0; i< sethold.length; i++){
            sethold[i].element.remove();

        }
        sethold = [];
        reallong = [];
        realnotes = [];
        realpositions = [];
        closenotes = [];
        
        FindBrowserSpeed();
        setTimeout(function(){activateGame(); calibrateclicked = false}, 6500);
    }
}

async function PlaySongPreview(event){
    try{
        if(previewaudio == false){        
            if(event.target.id == 'Song1') {
                previewaudio = true;
                startaudio = new Audio('damedane.mp3');
                await startaudio.play();
            }
            else if(event.target.id == 'Song2') {
                previewaudio = true;
                startaudio = new Audio('twinkle.mp3');
                await startaudio.play(); 
            }
            else if(event.target.id == "Song3"){
                previewaudio = true;
                startaudio = new Audio('elise.mp3');
                await startaudio.play();
            }
            else if(event.target.id == "Song4"){
                previewaudio = true;
                startaudio = new Audio('doe.mp3');
                await startaudio.play();
            }
            else if(event.target.id == 'Song5'){
                previewaudio = true;
                startaudio = new Audio('glimpse.mp3');
                await startaudio.play();
            }
            else if(event.target.id == 'Song6'){
                previewaudio = true;
                startaudio = new Audio('moon.mp3');
                await startaudio.play();
            }    
        }
    }
    catch(err){}
}

async function StopSongPreview(event){
    try{
        if(previewaudio){
        await startaudio.pause();
        startaudio.currentTime = 0;
        startaudio = null;
        previewaudio = false; 
        }
    }
    catch(err){}
}
function RestartFunction(event){
    if(restartclicked== false){
    restartclicked = true
    audio.pause();
    audio.currentTime = 0;
    movetilesparameter = false;
    playingmode = false
    clearTimeout(finishgametime);
    clearTimeout(stopmovingtime);
    pointscreen.textContent = 'Points:';
    comboscreen.textContent = 'Best Combo:';
    points = 0;
    combo = 0;
    
    for(let i = 0; i< atiles.length; i++){
        atiles[i].element.remove();
    }
    atiles = [];
    for(let i = 0; i< sethold.length; i++){
        sethold[i].element.remove();
    }

    sethold = [];
    reallong = [];
    realnotes = [];
    realpositions = [];
    closenotes = [];
    setTimeout(function(){activateGame();restartclicked = false},300); //this avoids movetiles to run multipletimes at once, which multiplies speed -> bad
    }
}