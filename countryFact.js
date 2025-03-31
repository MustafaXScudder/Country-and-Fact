// Define a class to handle fetching and displaying country information
class CountryInfo {
    // Constructor to initialize the CountryInfo object with a country name
    constructor(countryName) {
        this.countryName = countryName; // Store the provided country name
        this.apiBaseUrl = "https://restcountries.com/v3.1/name/"; // Base URL for RestCountries API
        this.factsApiUrl = "https://api.api-ninjas.com/v1/facts"; // Base URL for API Ninjas' Facts API
        this.apiKey = "zEjlPu3vULIUxM0DSAFFtA==86jzmsYFPsW9P50m"; // Placeholder for your API key from API Ninjas
    }

    // Method to fetch data about the specified country
    fetchCountryData() {
        // Perform a fetch request to the RestCountries API with the country name
        fetch(this.apiBaseUrl + this.countryName)
            .then(response => {
                // Check if the response is successful (status code 200-299)
                if (!response.ok) {
                    throw new Error("Country not found."); // Throw an error if the country is not found
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                this.countryData = data[0]; // Store the first country object from the response
                this.fetchFunFact(); // Proceed to fetch a fun fact about the country
            })
            .catch(error => {
                // Log any errors that occur during the fetch operation
                console.error(error);
                // Display an error message in the result section of the webpage
                document.getElementById("result").innerHTML = "<p>Country not found. Please try again.</p>";
            });
    }

    // Method to fetch a random fun fact about the country
    fetchFunFact() {
        // Perform a fetch request to the Facts API with the appropriate headers
        fetch(this.factsApiUrl, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apiKey // Include the API key in the request headers
            }
        })
            .then(response => {
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error("Fact not found."); // Throw an error if the fact is not found
                }
                return response.json(); // Parse the response as JSON
            })
            .then(data => {
                this.funFact = data[0].fact; // Extract the fun fact from the response
                this.displayCountryInfo(); // Proceed to display the country information
            })
            .catch(error => {
                // Log any errors that occur during the fetch operation
                console.error(error);
                this.funFact = "No fact available."; // Set a default message if no fact is available
                this.displayCountryInfo(); // Display the country information (with default fact)
            });
    }

    // Method to update the webpage with the fetched country information and fun fact
    displayCountryInfo() {
        // Check if country data is available
        if (!this.countryData) {
            return; // Exit the method if no country data is present
        }

        // Destructure the necessary properties from the country data object
        const { name, capital, region, population, flags } = this.countryData;
        // Determine the capital city (handle cases where capital is undefined)
        const capitalCity = capital ? capital[0] : "N/A";

        // Update the HTML content of the result section with the country details
        document.getElementById("result").innerHTML = `
            <h2>${name.common}</h2>
            <img src="${flags.png}" width="150" alt="Flag of ${name.common}">
            <p><strong>Capital:</strong> ${capitalCity}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Population:</strong> ${population.toLocaleString()}</p>
            <p><strong>Fun Fact:</strong> ${this.funFact}</p>
        `;
    }
}

// Event listener for the search button
document.querySelector("button").addEventListener("click", () => {
    // Retrieve and trim the user input from the country input field
    const countryName = document.getElementById("countryInput").value.trim();
    // Check if the user has entered a country name
    if (countryName) {
        // Create a new instance of the CountryInfo class with the entered country name
        const countryInfo = new CountryInfo(countryName);
        // Fetch and display the country details
        countryInfo.fetchCountryData();
    } else {
        // Display a prompt if no country name was entered
        document.getElementById("result").innerHTML = "<p>Please enter a country name.</p>";
    }
});
