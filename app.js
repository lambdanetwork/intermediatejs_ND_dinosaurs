function Being(species, weight, height, where, when, facts, diet) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.where = where;
  this.when = when;
  this.facts = facts;
  this.diet = diet;
  this.image = `images/${species.toLowerCase()}.png`;
}

// Create Dino with latest class syntax
class Dino extends Being {
  constructor(species, weight, height, where, when, fact, diet) {
    super(species, weight, height, where, when, fact, diet);
  }

  compareWithHumanHeight(human) {
    if (this.height > human.height) {
      this.facts.push("I am taller than you");
    } else {
      this.facts.push("Okay you are taller, don't bully me");
    }
  }

  compareWithHumanDiet(human) {
    if (this.diet === human.diet) {
      this.facts.push("We have similar appetite");
    } else {
      this.facts.push("Let's not eat each other");
    }
  }

  compareWithHumanWeight(human) {
    if (this.weight > human.height) {
      this.facts.push("You need to eat more");
    } else {
      this.facts.push("You need to go on diet");
    }
  }

  addMoreFacts(human) {
    this.compareWithHumanHeight(human);
    this.compareWithHumanDiet(human);
    this.compareWithHumanWeight(human);
  }

  getFact() {
    const index = Math.floor(Math.random() * 10) % this.facts.length;
    return this.facts[index];
  }
}

// Human use constructor pattern
function Human(name, weight, height, diet) {
  Being.call(this, "human", weight, height, null, null, [], diet);
  this.name = name;
}

// Bird use factory pattern
function createBird(species, weight, height, where, when, fact) {
  return Object.create(new Dino(species, weight, height, where, when, fact));
}

// ========================================== INIT =====================================
let bird;
let dinos = [];
fetch("dino.json")
  .then((response) => response.json())
  .then((json) =>
    json.Dinos.forEach((dino) => {
      if (dino.species === "Pigeon") {
        bird = createBird(
          dino.species,
          dino.weight,
          dino.height,
          dino.where,
          dino.when,
          ["All birds are considered dinosaurs."],
          dino.diet
        );
        return;
      }

      const _dino = new Dino(
        dino.species,
        dino.weight,
        dino.height,
        dino.where,
        dino.when,
        [
          dino.fact,
          `I am a/an ${dino.species}.`,
          `I stay in ${dino.where}.`,
          `I exists during ${dino.when}.`,
        ],
        dino.diet
      );
      // add to array
      dinos.push(_dino);
    })
  );

// On button click, prepare and display infographic
document.getElementById("btn").addEventListener("click", function () {
  const human = (function () {
    const name = document.getElementById("name").value;
    const heightFeet = Number(document.getElementById("feet").value);
    const heightInches = Number(document.getElementById("inches").value);
    const weight = Number(document.getElementById("weight").value);
    const diet = document.getElementById("diet").value.toLowerCase();
    // 12 inch = 1 feet
    const height = heightFeet * 12 + heightInches;
    const human = new Human(name, weight, height, diet);
    console.log(human);
    return human;
  })();

  // Remove Form
  const formElem = document.getElementById("dino-compare");
  formElem.parentElement.removeChild(formElem);

  dinos.forEach((dino, index) => {
    dino.addMoreFacts(human);

    const fact = dino.getFact();
    const gridDiv = createGrid(dino.species, dino.image, fact);
    document.getElementById("grid").appendChild(gridDiv);

    // insert human tile at center
    if (index === 3) {
      const humanDiv = createGrid(human.name, human.image);
      document.getElementById("grid").appendChild(humanDiv);
    }
  });

  // bird always at last tile
  const fact = bird.getFact();
  const gridDiv = createGrid(bird.species, bird.image, fact);
  document.getElementById("grid").appendChild(gridDiv);
});

function createGrid(species, imageUrl, fact) {
  const gridItemDiv = document.createElement("div");
  gridItemDiv.className = "grid-item";

  // add species
  const speciesH3 = document.createElement("h3");
  speciesH3.innerText = species;
  gridItemDiv.appendChild(speciesH3);

  // add image
  const image = document.createElement("img");
  image.src = imageUrl;
  gridItemDiv.appendChild(image);

  // add fact
  if (fact) {
    const factElem = document.createElement("p");
    factElem.innerText = fact;
    gridItemDiv.appendChild(factElem);
  }

  return gridItemDiv;
}
