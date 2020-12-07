var dog, sadDog, happyDog;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var database;
var washroom, bedroom, garden;

function preload(){
  sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden = loadImage("images/Garden.png");
  bedroom = loadImage("images/Bedroom.png");
  washroom = loadImage("images/Washroom.png");
}

function setup(){
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  readState = database.ref('GameState');
  readState.on("value", function(data){
    GameState = data.val();
  })
 
}

function draw(){

  //background(46, 139, 87);
  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed + 2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2)&& currentTime <= (lastFed + 4)){
     update("bathing");
     foodObj.washroom();
  }

  foodObj.display();

  fill(255, 255, 254);
  textSize(15);

  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + "PM", 350, 100);
  }
  else if(lastFed === 0){
    text("Last Feed : 12 AM", 350, 100);
  }
  else{
    text("Last Feed : " + lastFed + " AM ", 350, 100);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}






  