var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bg;
var changeGameState,readGameState;
var bedRoom,garden,washRoom;
var input;

function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage("dogImg1.png");
bg=loadImage("bg.jpg");
bedRoom=loadImage("Bed Room.png")
garden=loadImage("Garden.png");
washRoom=loadImage("Wash Room.png")

}

function setup() {
  database=firebase.database();
  createCanvas(500,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(350,350,30,30);
  dog.addImage(sadDog);
  dog.scale=0.25;
  
  feed=createButton("Feed the dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  var input = createInput("Enter your dog's name");
  input.position(400, 100);

  readGameState=database.ref('gameState')
  readGameState.on("value",function(data){
    gameState=data.val();
  });

}

function draw() {
  background("lightgreen");
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  
 

   currentTime=hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping")
     foodObj.bedroom();
   }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom();
   }else{
     update("Hungry")
     foodObj.display();
   }

   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  
  }else{
   feed.show();
   addFood.show();
   
  }

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS 
  })
}
//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  });
}