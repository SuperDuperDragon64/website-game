let hasPickedMush = false;
let enteredGarden = false;
let currentRoom = null; // Added a variable to keep track of the current room

document.getElementById("btn1").style.display = "none"; // Hide the "pick the mushroom" button

class Room {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._item = null;
    this._linkedRooms = {};
    this._character = null;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get character() {
    return this._character;
  }

  set description(description) {
    this._description = description;
  }

  set character(character) {
    this._character = character;
  }

  describe() {
    return `Looking around the ${this._name} you can see ${this._description}.`;
  }

  getDetails() {
    const entries = Object.entries(this._linkedRooms);
    let details = [];
    for (const [direction, room] of entries) {
      let text = `The ${room.name} is to the ${direction}`;
      details.push(text);
    }
    return details;
  }

  move(direction) {
    if (direction in this._linkedRooms) {
      return this._linkedRooms[direction];
    } else {
      alert("You can't go that way");
      return this;
    }
  }

  linkRooms(direction, roomToLink) {
    this._linkedRooms[direction] = roomToLink;
  }
}

class Character {
  constructor(name) {
    this._name = name;
    this._description = "";
    this._conversation = "";
  }

  set name(name) {
    this._name = name;
  }

  set description(description) {
    this._description = description;
  }

  set conversation(conversation) {
    this._conversation = conversation;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get conversation() {
    return this._conversation;
  }

  describe() {
    return `You have met ${this._name}, ${this._description}`;
  }

  converse() {
    return `${this._name} says ${this._conversation}`;
  }
}

class Item {
  constructor(name, description) {
    this._name = name;
    this._description = description;
  }

  set name(name) {
    this._name = name;
  }

  set description(description) {
    this._description = description;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  describe() {
    return `The ${this._name} is ${this._description}`;
  }
}

const mushroom = new Item("Mushroom");
mushroom.description = "it would probably taste nice in a soup";

const Kitchen = new Room("Smoking Kitchen");
Kitchen.description =
  "a room with white walls and a black floor, several counters have items of food on them";
const Lounge = new Room("Lounge");
Lounge.description =
  "a large room with worktops on either side and a large bench in the middle";
const GamesRoom = new Room("Greenhouse");
GamesRoom.description =
  "a pretty greenhouse with plenty of flowers in it, there are also mushrooms growing in the greenhouse with some already picked";
GamesRoom.item = mushroom;

const Hall = new Room("Hall");
Hall.description = "A grand entrance hall with large paintings on the walls.";

Kitchen.linkRooms("south", Lounge);
Kitchen.linkRooms("east", Hall);
Lounge.linkRooms("north", Kitchen);
Lounge.linkRooms("east", GamesRoom);
GamesRoom.linkRooms("west", Lounge);
GamesRoom.linkRooms("north", Hall);
Hall.linkRooms("west", Kitchen);
Hall.linkRooms("south", GamesRoom);

const Monster = new Character("Cooking Monster");
Monster.description =
  "A large scary monster in an apron, he's trying to make soup.";
Monster.conversation = "Gah! my soup is missing something...";

Kitchen.character = Monster;

function displayRoomInfo(room) {
  console.log(room.getDetails());

  let occupantMsg = "";
  if (room.character) {
    occupantMsg = `${room.character.describe()} ${room.character.converse()}`;
  } else {
    occupantMsg = "The room is empty";
  }
	if (hasPickedMush && room === Kitchen) {
		window.alert("the monster sniffs the air before stomping up to you and taking your mushroom!" + 
	" placing it in the soup he takes a sip before remembering he is alergic to mushrooms! " +
	"the monster inflates and floats out of the open window..." + "congradulations! you win!")
	}

  if (!hasPickedMush && room === GamesRoom) {
    GamesRoom.description =
      "There are a bunch of large tasty looking mushrooms in the greenhouse, do you want to pick one?";
    const btn = document.getElementById("btn1");

    btn.style.display = "block"; // Show the "pick the mushroom" button

    const pickMushroom = function () {
      hasPickedMush = true;
      console.log("Picking the mushroom");
      btn.style.display = "none"; // Hide the "pick the mushroom" button
      displayRoomInfo(currentRoom);
    };

    btn.addEventListener("click", pickMushroom);
  }

  if (hasPickedMush) {
    console.log("Hiding the mushroom");
    document.getElementById("btn1").style.display = "none"; // Hide the "pick the mushroom" button
    GamesRoom.description = "There were some mushrooms but you have picked them up now."
  }

  document.getElementById("textarea").innerHTML =
    room.describe() +
    "<p>" +
    occupantMsg +
    "</p>" +
    "<p>" +
    room.getDetails() +
    "</p>";
  document.getElementById("usertext").focus();
}

function RoomCheck() {
  if (enteredGarden === false) {
    document.getElementById("buttons").style.visibility = "hidden";
    console.log(enteredGarden);
  } else if (enteredGarden === true) {
    document.getElementById("buttons").style.visibility = "visible";
    console.log(enteredGarden);
  }
}

function startGame() {
  currentRoom = Kitchen; // Set the initial current room
  displayRoomInfo(currentRoom);

  const directions = ["north", "south", "east", "west"];

  document.addEventListener("keydown", function (event) {
    console.log(event);
    if (event.key === "Enter") {
      const command = document.getElementById("usertext").value;
      if (directions.includes(command.toLowerCase())) {
        currentRoom = currentRoom.move(command.toLowerCase());
        document.getElementById("usertext").value = "";
        displayRoomInfo(currentRoom);
      } else {
        document.getElementById("usertext").value = "";
        alert("That is not a valid direction. Please try again");
      }
    }
  });
}

function pickMushroom() {
  hasPickedMush = true;
  displayRoomInfo(currentRoom);
}

function nameOfRoom() {
  if (currentRoom === GamesRoom) {
    enteredGarden = true;
  } else {
    enteredGarden = false;
  }
}

startGame();
RoomCheck();
