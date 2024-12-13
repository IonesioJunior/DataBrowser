// index.js

// Function to fetch datasets from the JSON file and convert them into an array
async function fetchDatasets() {
  try {
    const response = await fetch('./datasets.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Transform the object into an array of datasets
    const datasetsArray = Object.entries(data).map(([fileName, fileData]) => ({
      name: fileName,
      description: fileData.description,
      format: fileData.format, // Keeping the description field empty
      owners: fileData.owners,
      datePosted: fileData.created // Using 'created' as 'datePosted'
    }));
    console.log(datasetsArray) 
    return datasetsArray;
  } catch (error) {
    console.error("Failed to load datasets:", error);
    return [];
  }
}

function toggleCollapsibleDiv(dataset_name, owners){
    const collapsibleDiv = document.getElementById(dataset_name);
    collapsibleDiv.classList.toggle("open");
    
    const datasitesList = owners.split(",");
    const listItems = datasitesList.map(datasite => `<li>${datasite}</li>`).join('');

    collapsibleDiv.innerHTML= `
         <h4 style="padding-bottom: 2px;">Datasites:</h4>
         <ul class='minimal-list';>
           ${listItems}
        </ul>
    `
}

function toggleCollapsibleSchemaDiv(table_name, dataset_name) {
    const collapsibleDiv = document.getElementById(table_name);
    collapsibleDiv.classList.toggle("open");
    console.log(dataset_name) 
    if (dataset_name === "Netflix Data"){
    collapsibleDiv.innerHTML = `
     <h4 style="padding-bottom: 2px;">Schema:</h4>
    <pre><code class="language-csv">
Title,Date
"Stranger Things: Season 1: Chapter One: The Vanishing of Will Byers","2023-07-15"
"The Witcher: Season 2: Episode 3: What Is Lost","2023-07-16"
"The Crown: Season 3: Episode 1: Olding","2023-07-17"
"Bridgerton: Season 1: Episode 1: Diamond of the First Water","2023-07-18"
"Squid Game: Season 1: Episode 5: A Fair World","2023-07-19"
    </code></pre>
`
    } else {
	collapsibleDiv.innerHTML = `<h4 style="padding-bottom: 2px;">Schema:</h4>
    <pre><code class="language-csv">
    No schema found.
    </code></pre>`
    }
}

// Function to display search results
function displayResults(results) {
  const container = document.getElementById('results-container');
  container.innerHTML = ''; // Clear previous results
  
  const resultString = document.createElement('p');
  resultString.innerText = "Results";
  resultString.style.fontSize = "18px";

  const sectionDivider = document.createElement("div");
  sectionDivider.classList.add('section-divider');

  container.appendChild(resultString);
  container.appendChild(sectionDivider);

  if (results.length === 0) {
    container.innerHTML = '<p>No results found.</p>';
    return;
  }
  counter = 0; 
  results.forEach(dataset => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.classList.add('hover-div');
    resultItem.style.padding = '8px'; 
    resultItem.innerHTML = `
      <div  style="display:flex; padding-bottom: 8px; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center;">
          <h3 style='padding-right: 6px;'>${dataset.name}</h3>
          <div style="background-color: #88BBD6; padding: 4px; border-radius: 10px; border: 1px solid #4285F4;">
            <p style="color: #4285F4; ">${dataset.format}</p>
          </div>
        </div>
        <div >${dataset.owners.length}</div>
      </div>
      <p style="color: #708090;">${dataset.description || "N/A"}</p>
      <div style='display: flex; justify-content: space-between; align-items: center;'>
        <div></div>
        <div>
          <button onclick="toggleCollapsibleDiv('${"table_" + counter}', '${dataset.owners}')" class='pastel-blue-button'> Datasites</button>
          <button onclick="toggleCollapsibleSchemaDiv('${"table_" + counter}', '${dataset.name}')" class='alternative-blue-button'> Schema</button>
        </div>
      </div> 
      <div class="collapsible-content" id=${"table_" + counter}>
      </div>
    `;
    counter += 1;
    container.appendChild(resultItem);
  });
}

// Event listener for the search form submission
document.querySelector('.search-form').addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent form submission
  const query = document.getElementById('search-input').value.toLowerCase();
  let datasets = [];

  try {
    datasets = await fetchDatasets(); 
  } catch (error) {
    console.error('Error fetching datasets:', error);
  }

  // Filter datasets based on the search query (name, description, or owner)
  const filteredResults = datasets.filter(dataset => {
    return (
      dataset.name.toLowerCase().includes(query) ||
      dataset.description.toLowerCase().includes(query)
    );
  });

  // Display the filtered results
  displayResults(filteredResults);
});


