var BG;
var marioRunning;
var score = 0;
var gameState = "play";

function preload(){
  BG = loadImage("bg.png"); 
  marioRunning = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  marioCollided = loadAnimation("collided.png");
  groundImage = loadImage("ground2.png");
  brickImage = loadImage("brick.png");
  obstacleImage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  //jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  scoreSound = loadSound("checkPoint.mp3");
  coin = loadSound("coin.mp3");
  gameOver2 = loadImage("gameOver-1.png");
  restart2 = loadImage("restartB.png");
  cloudImage = loadImage("cloud.png");
  
}

function setup (){
  createCanvas(windowWidth,windowHeight);
  mario = createSprite(50,295);
  mario.addAnimation("run",marioRunning);
  mario.addAnimation("die",marioCollided);
  mario.scale = 1.5;
  mario.debug = true;
  mario.setCollider("circle",-4,2,15);
  
  ground = createSprite(windowWidth/2,windowHeight-41,windowWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(windowWidth/2,windowHeight-70,windowWidth,20);
  invisibleGround.visible = false;
  
  brickGroup = new Group();
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  gameOver = createSprite(300,230 );
  gameOver.addImage("gameOver",gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,280);
  restart.addImage("restart",restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  textSize(24);
  fill(0);
  textFont("Georgia");
  
}

function draw(){
  background("skyblue");
  text("Score:"+score,380,30);
  if(gameState == "play"){
    
  
  if(keyDown("space") && mario.y>=250){
    mario.velocityY = -12;
    //jump.play();
  }
  
    //this adds gravity
    mario.velocityY = mario.velocityY+0.75;
    spawnBricks();
    spawnObstacles() ;
    spawnClouds();
    if(ground.x<0){
    ground.x = ground.width/2;
   }
    for(var i = 0;i<brickGroup.length;i++){
      if(brickGroup.get(i).isTouching(mario)){
        brickGroup.get(i).destroy();
        score++
        coin.play();
        
      }
    }
    if(score>0 && score%10 == 0){
      scoreSound.play();
    }
    if(obstacleGroup.isTouching(mario)){
      gameState = "end";
      die.play();
    }
  }
  else if(gameState == "end"){
    gameOver.visible = true
    restart.visible = true
    ground.velocityX = 0;
    mario.velocityX = 0;
    mario.velocityY = 0;
     mario.changeAnimation("die",marioCollided);
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(0);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  mario.collide(invisibleGround);
  
  drawSprites();
}
function spawnBricks(){
  if(frameCount%60 == 0){
    var brick = createSprite(windowWidth,500);
    brick.y = Math.round(random(windowHeight/2,windowHeight-400));
    brick.addImage("brick",brickImage);
    brick.velocityX = -3;
    brick.lifetime = 500;
    mario.depth = brick.depth+2;
    brickGroup.add(brick);

  }
}

function spawnObstacles(){
  if(frameCount%50 == 0){
    var obstacle = createSprite(windowWidth,windowHeight-100);
    obstacle.addAnimation("obstacle",obstacleImage);
    obstacle.velocityX = -6;
    obstacle.lifetime = 500;
    mario.depth = obstacle.depth+1;
   obstacleGroup.add(obstacle);

  }
}

function spawnClouds(){
  if(frameCount%40 == 0){
    var cloud = createSprite(windowWidth, windowHeight/2);
    cloud.addImage("cloud",cloudImage);
     cloud.y = Math.round(random(20,150));
   cloud.velocityX = -3;
   cloud.lifetime = 500;
    mario.depth = cloud.depth+2;
   cloudGroup.add(cloud);
    
   
  }
  
}

function reset(){
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  brickGroup.destroyEach();
  gameState = "play";
  mario.changeAnimation("run",marioRunning);
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
  
}

