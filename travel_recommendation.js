const api = "./travel_recommendation_api.json"
const regex = /\b(beach(es)?|temple(s)?|country|countries)\b/i;

const searchInputField = document.getElementById("searchInput");
const searchBtn = document.getElementById("search");
const resetBtn = document.getElementById("reset");
const resultsContainer = document.getElementById("searchResultsContainer");

const keywordMap = {
  beach: 'beaches',
  beaches: 'beaches',
  temple: 'temples',
  temples: 'temples',
  country: 'countries',
  countries: 'countries'
};

function search() {
  const query = searchInputField.value.trim();
  const matchArray = query.match(regex);

  if (!query) {
    alert("Please enter a valid search query.");
    console.error("Please enter a valid search query.");
    return;
  }

  if (!matchArray) {
    alert("There are no places available to visit.");
    console.error("There are no places available to visit.");
    return;
  }

  const match = matchArray[0].toLowerCase();
  const key = keywordMap[match];

  fetch(api)
    .then(res => res.json())
    .then(data => {
      if (!data[key]) {
        alert("No results found for " + match);
        console.error("No results found for " + match);
        return;
      }

      resultsContainer.innerHTML = "";

      data[key].forEach(element => {
        if (key === 'countries') {
          element["cities"].forEach(city => {
            createElements(city);
          });
          return;
        }
        createElements(element);
      });
    })
    .catch(err => console.error(err));
}

function createElements(type) {
  const div = document.createElement('div');
  div.classList.add('searchResults');

  const img = document.createElement('img');
  img.classList.add('searchImages');
  img.src = type.imageUrl;
  img.alt = type.name || "Travel Image";

  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: type.timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

  const span = document.createElement('span');
  span.innerHTML = `${type.name || ""} <b>${formatter.format(now)}</b>`;

  const p = document.createElement('p');
  p.textContent = type.description || "";

  div.appendChild(img);
  div.appendChild(span);
  div.appendChild(p);
  resultsContainer.appendChild(div);
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  search();
});

resetBtn.addEventListener("click", (e) => {
  resultsContainer.innerHTML = "";
});