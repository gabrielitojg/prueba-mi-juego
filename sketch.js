//Crear estados del juego END y PLAY
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Crear variables de objetos del programa
var corredor, runner, caer;
var carretera, invisibleCarretera, carreteraImage;

var obstaclesGroup, obstaculo1, obstaculo2, obstaculo3;

//Crea variables del puntaje
var score;

//Crea las variables para el gameover
var gameOverImg,restartImg, gameOver, restart;



function preload(){
  
  
  //Precargar imagen del corredor corriendo
  runner = loadAnimation("corre1.ng","corre2.png","corre3.png", "corre4.png");
  caer = loadAnimation("caido.png");
  
  //Precargar imagen del suelo
  carreteraImage = loadImage("Road.png");
  
  
  
  //Precargar imagenes de los obstaculos
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  
  
  //Precargar las imagenes de gameOver y Restart
   gameOverImg = loadImage("gameOver-1.png");
  restartImg = loadImage("restart-1.png");
  
  
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  //Crea el Sprite del corredor
  corredor = createSprite(50,height-70,20,50);
  corredor.addAnimation("running", runner);
  corredor.addAnimation("collided" ,caer);
  corredor.scale = 0.08;
  
  
  //radio de colicionar
  corredor.setCollider("circle",0,0,350);
  corredor.debug = false;
  
  //crea el suelo invisible
  invisibleCarretera = createSprite(width/2,height-10,width,125);
  invisibleCarretera.shapeColor = "#f4cbaa";
    
  //crea el Sprite del suelo
  carretera = createSprite(width/2,height,width,10);
  carretera.addImage("carretera",carreteraImage);
  carretera.x = width/2;
  carretera.depth= corredor.depth;
  corredor.depth = corredor.depth+1;
  
  //crea grupo de obstaculos 
  obstaclesGroup = new Group();
  
  //crea sprites de gameOver y restart
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;
  
  
  
  //variable de score
  score = 0;
  
}

function draw() {
  
  //crea el texto de la puntuación en la pantalla
  fill("midnightblue");
  stroke("white");
  textSize(20);
  text("Puntuación: "+ score, 30,50);
  
  
  
  //agrega estados del juego
  if(gameState === PLAY){
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    //mueve el suelo
    carretera.velocityX = -(6 + 3 * score/100);
    
    
        
    //hace que el suelo reestablezca su posición
    if (carretera.x < 0){
      carretera.x = carretera.width/2;
    }
    
    //salta cuando preciono la barra espaciadora
    if(touches.length > 0 || keyDown("space")&& corredor.y >= height-120) {
      corredor.velocityY = -10;
      touches = [];
    }
    
    //agrega gravedada al corredor
    corredor.velocityY = corredor.velocityY + 0.8
  
  //evita que el corredor caiga
  corredor.collide(invisibleCarretera);
    
  
    
  //aparecen los obtaculos en el suelo
  spawnObstacles();
    
    //condición para que si el corredor toca un obstaculo el juego cambie de estado
    if(obstaclesGroup.isTouching(corredor)){
      gameState = END;
      
    }
  }
   else if (gameState === END) {
     //detiene el suelo
     carretera.velocityX = 0;
     //detiene la velocidad de salto del corredor
     corredor.velocityY = 0;
     
     //Detiene el grupo de obstaculos 
     obstaclesGroup.setVelocityXEach(0);
     
     
    //cambia la animación del corredor
      corredor.changeAnimation("collided", caer);

     //Mantiene obstaculos en pantalla aunque el corredor caiga, nunca desaparecerán
    obstaclesGroup.setLifetimeEach(-1);
    
     
     //letrero de gameOver y reset visble
      gameOver.visible = true;
      restart.visible = true;
      if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)){
        reset();
        touches = [];
      }     
   }
     
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(1000,height-95,20,30 );
   obstaculo.setCollider('circle',0,0,45); 
   obstaculo.debug = false;
   obstaculo.velocityX = -(6 + 3 * score/100);
   
    //genera obstaculos al azar
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstacle.addImage(obstaculo2);
              break;
              
      case 3: obstacle.addImage(obstaculo3);
              break;
    
      default: break;
    }
   
    //asigna escala y ciclo de vida al obstaculo           
    obstaculo.scale = 0.3;
    obstaculo.lifetime = 300;
    obstaculo.depth = corredor.depth;
    corredor.depth = corredor.depth+1;
   //añade cada obstaculo al grupo
    obstaclesGroup.add(obstaculo);
 }
}



function reset(){
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  obstaclesGroup.destroyEach();
  corredor.changeAnimation("running",runner);
  score = 0;
}
