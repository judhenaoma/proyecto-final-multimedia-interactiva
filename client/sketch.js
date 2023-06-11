
// Rain
let drops = [];
//Fires
let fire = [];
//Thunder
let thunderbolts = [];

let length = 50;
let zigzag = 10;
let speed = 2;
// Waves
let angle = 0;
let waveLayers = [];

//Flags
let thundersOn = false;
let rainOn = false;
let fireOn = false;
let wavesOn = false;


//Songs
let rainSong;
let fireSong;
let thunderSong;
let wavesSong;


//Function to load the audios before the setup
function preload () {
  rainSong = loadSound('sounds/light-rain-ambient.mp3');
  fireSong = loadSound('sounds/bonfire.mp3');
  thunderSong = loadSound('sounds/thunder-sound.mp3');
}	

function setup() {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      noFill();
      createCanvas(screenWidth, screenHeight);

      //Rain button
      rain_ = createButton('Rain');
      rain_.position(400, 250);
      rain_.id('rain_button');
      rain_.addClass('button_animation');
      
      //Thunder button
      thunder_ = createButton('Thunder');
      thunder_.position(580, 250);
      thunder_.id('thunder_button');
      thunder_.addClass('button_animation');

      //Fire button
      fire_ = createButton('Fire');
      fire_.position(800, 250);
      fire_.id('fire_button');
      fire_.addClass('button_animation');

      // //Waves button
      // waves_ = createButton('Waves');
      // waves_.position(850, 250);
      // waves_.id('waves_button');
      // waves_.addClass('button_animation');


      // Animations with p5.js
      //Initializate Rain
      for (let i = 0; i < 1000; i++) {
        drops.push(new Drop());
      }
      //Initializate Fire
      for (let i = 0; i < 1000; i++) {
        fire.push(new Fire());
      }

      //Initializate Waves
      waveLayers.push({amplitude: 15, frequency: 10, color: '#001FA6'});
      waveLayers.push({amplitude: 30, frequency: 21, color: '#00bfff'});
      waveLayers.push({amplitude: 20, frequency: 18, color: '#71ABFF'});
      waveLayers.push({amplitude: 25, frequency: 15, color: '#c4e4ff'});
      waveLayers.push({amplitude: 17, frequency: 25, color: '#c4e4ff'});
      waveLayers.push({amplitude: 23, frequency: 41, color: '#c4e4ff'});
      


      //Buttons for triggering the animations
      // Rain button
      const rainButton = document.querySelector('#rain_button');
      rainButton.addEventListener('click', () => {
        rainOn = !rainOn;
        if(rainOn){
          rainSong.loop();
          rainSong.play();
          rainButton.classList.add('button_clicked')
        }else{
          rainSong.stop();
          rainButton.classList.remove('button_clicked')
        }
    })

    // Thunder button
    const thunderButton = document.querySelector('#thunder_button');

    thunderButton.addEventListener('click', () => {
      thundersOn = !thundersOn;

      if(thundersOn){
        thunderSong.loop();
        thunderSong.play();
        thunderButton.classList.add('button_clicked')
      }else{
        thunderSong.stop();
        thunderButton.classList.remove('button_clicked')
      }

    })

    // Fire button
    const fireButton = document.querySelector('#fire_button');

    fireButton.addEventListener('click', () => {
      fireOn = !fireOn;
      if(fireOn){
        fireSong.loop();
        fireSong.play();
        fireSong.setVolume(1);
        fireButton.classList.add('button_clicked')
      }else{
        fireSong.stop();
        fireButton.classList.remove('button_clicked')

      }
    })

    // // Waves button
    // const wavesButton = document.querySelector('#waves_button');
    // wavesButton.addEventListener('click', () => {
    //   wavesOn = !wavesOn;
    //   if(wavesOn){
    //     wavesSong.loop();
    //     wavesSong.play();
    //     wavesSong.amp(0.2)
    //     wavesButton.classList.add('button_clicked')
    //   }else{
    //     wavesSong.stop();
    //     wavesButton.classList.remove('button_clicked')

    //   }
    // })

}


  

function draw() {
  clear();
  // Animate Rain
  if(rainOn){
    for (let i = 0; i < intensities[intensities.length - 1]; i++) {
      drops[i].fall();
      drops[i].show();
    }
  }
  
  //Animate Fire
  if(fireOn){
    for (let i = 0; i < intensities[intensities.length - 1]; i++) {
      fire[i].update();
      fire[i].show();
    }
  }

  //Amimate Thunder
  if(thundersOn){
  
  stroke(255, 255, 0);
  strokeWeight(2);
  
  if (frameCount % 30 === 0) { 
    thunderbolts.push({
      x: random(width),
      y: 0,
      direction: random([-1, 1]),
      length: random(40, 100),
      zigzag: random(10, 100),
    });
  }
  
  for (let i = thunderbolts.length - 1; i >= 0; i--) {
    let bolt = thunderbolts[i];
    line(bolt.x, bolt.y, bolt.x + bolt.length * bolt.direction, bolt.y + bolt.length);
    
    bolt.x += bolt.length * bolt.direction;
    bolt.y += speed;
    bolt.y += random(-bolt.zigzag, bolt.zigzag);
    
    if (bolt.y > height) {
      thunderbolts.splice(i, 1);
    }
  }
}

  // if(wavesOn){
  //   //Waves
  //   translate(0, 210);
  //   // loop through each layer of waves
  //   for (let i = 0; i < waveLayers.length; i++) {
  //     let layer = waveLayers[i];
  //     stroke(layer.color);
  //     strokeWeight(2);
      
  //     // loop through each x-coordinate in the canvas and draw a line
  //     for (let x = 0; x < width; x += 5) {
  //       let y = sin(angle + x / layer.frequency) * layer.amplitude;
  //       line(x, 0, x, y);
  //     }
  //   }
    
  //   angle += 0.1;

  // }
}

class Drop {
  constructor() {
    this.x = random(-width, 0);
    this.y = random(-height, 0);
    this.speed = random(5, 15);
  }

  fall() {
    this.x += this.speed;
    this.y += this.speed;
    if (this.x > width || this.y > height) {
      this.x = random(-width, 0);
      this.y = random(-height, 0);
    }
  }

  show() {
    stroke(100, 100, 255);
    strokeWeight(1);
    line(this.x, this.y, this.x + 10, this.y + 10);
  }
}


class Fire {
  constructor() {
    this.x = random(width);
    this.y = height;
    this.life = random(20, 100);
    this.lifeSpeed = random(0.1, 1);
    this.size = random(3, 10);
    this.color = color(255, 150, 0);
  }

  update() {
    this.y -= this.lifeSpeed * 2;
    this.life -= this.lifeSpeed;
    if (this.life < 0) {
      this.x = random(width);
      this.y = height;
      this.life = random(20, 100);
      this.lifeSpeed = random(0.1, 1);
    }
  }

  show() {
    noStroke();
    fill(this.color, this.life);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

