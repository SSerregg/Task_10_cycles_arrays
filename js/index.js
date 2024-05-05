// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

function clearDisplay (result){
  let i = 1;
  do { i++
  const parent = document.querySelector(".fruits__list");
  const remove = document.querySelector(".fruit__item");
  parent.removeChild(remove)}
  while(i <= result);
};
/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  for (let i = 0; i < fruits.length; i++) {
    const simplify = fruits[i];
    const customLi = document.createElement("li");
    const parent = document.querySelector(".fruits__list");
    let colorClass;

    if (simplify.color == "фиолетовый"){
      colorClass = "violet"
    }
    else if (simplify.color == "зеленый"){
      colorClass = "green"
    }
    else if (simplify.color == "розово-красный"){
      colorClass = "carmazin"
    }
    else if (simplify.color == "желтый"){
      colorClass = "yellow"
    }
    else if (simplify.color == "светло-коричневый"){
      colorClass = "lightbrown"
    }
    else {colorClass = "black"}
  
    customLi.classList.add("fruit__item");
    customLi.classList.add(`fruit_${colorClass}`);
    customLi.innerHTML = `<div class=\"fruit__info\"><div>index: ${i}</div><div>kind: ${simplify.kind}</div><div>color: ${simplify.color}</div><div>weight (кг): ${simplify.weight}</div></div>`;
    parent.appendChild(customLi);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    const randomObj = getRandomInt(0, fruits.length-1);
    const objResult = fruits.splice(randomObj, 1);
    result.unshift(objResult[0]);
  }
  clearDisplay(result.length)
  fruits = result;
};

function arraysAreIdentical(arr1, arr2){
  for (var i = 0, len = arr1.length; i < len; i++){
      if (arr1[i] !== arr2[i]){
          return false;
      }
  }
  return true; 
}

shuffleButton.addEventListener('click', () => {
  let safe = [];
  for (let i = 0; i < fruits.length; i++){
  safe[i]=fruits[i]};
  shuffleFruits();
  display();
  if (arraysAreIdentical(safe,fruits)===true){alert("Перемешать не получилось")};
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let minWeightInput = document.querySelector('.minweight__input').value;
  minWeightInput = (minWeightInput === "")? 0 : minWeightInput;
  let maxWeightInput = document.querySelector('.maxweight__input').value;
  maxWeightInput = (maxWeightInput === "")? 999999 : maxWeightInput;  
  fruits = fruits.filter((item) => item.weight > minWeightInput && item.weight < maxWeightInput);
};

filterButton.addEventListener('click', () => {
  clearDisplay(fruits.length);
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const colorIn = colorInput.value;
  return a.color === colorIn ? true : false;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
   for (let i = 0; i < n-1; i++) { 
       for (let j = 0; j < n-1-i; j++) { 
           if (comparation(arr[j], arr[j+1])) { 
               let temp = arr[j+1]; 
               arr[j+1] = arr[j]; 
               arr[j] = temp; 
           } else {continue}
       }
   }
  },

  quickSort(arr, comparation) {
    if (arr.length < 2) {
      return arr;
    }
  
    let index
  for( let i=0; i< fruits.length; i++){
    if(comparation(fruits[i])){
      index = i
    } else { index = 0} 
  }
    const pivot = arr[index];
    const less = [];
    const greater = [];
  
    for (let i = 0; i < arr.length; i++) {
      if (i===index) {
        continue ;
      }
      if (arr[i] <= pivot)  {
        less.push(arr[i]);
      } else {
        greater.push(arr[i]);
      }
    }
    fruits = less;
    fruits.push(pivot);
    //return [...quickSort(less), pivot, ...quickSort(greater)];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
//sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if(sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
    sortKindLabel.textContent = sortKind;
  } else if(sortKind === 'quickSort'){
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
  }
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
});
sortActionButton.addEventListener('click', () => {
  clearDisplay(fruits.length);
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const test = [];
  test.kind = kindInput.value;
  test.color = colorInput.value;
  test.weight = Number(weightInput.value);
  if(test.kind === "" || test.color === "" || test.weight === "") {
    alert("Заполнены не все поля");
  } else {
    clearDisplay(fruits.length);
    fruits.push(test);
    display();
  }
});
