document.addEventListener("DOMContentLoaded", () => {
    const cryptoSelect = document.getElementById("crypto-select");
    const cryptoPrice = document.getElementById("crypto-price");
    const alertPriceInput = document.getElementById("alert-price");
    const alertMessage = document.getElementById("alert-message");

    // Fetch and populate the list of cryptocurrencies
    fetch('https://api.coinlore.net/api/tickers/')
        .then(response => response.json())
        .then(data => {
            const cryptocurrencies = data.data;
            cryptocurrencies.forEach(crypto => {
                const option = document.createElement("option");
                option.value = crypto.id;
                option.textContent = crypto.name; // Ensure this matches the test case
                cryptoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching cryptocurrencies:", error);
            alertMessage.textContent = "Error fetching cryptocurrencies.";
        });

    // Fetch and display the current price of the selected cryptocurrency
    cryptoSelect.addEventListener("change", (event) => {
        const cryptoId = event.target.value;
        if (cryptoId) {
            fetch(`https://api.coinlore.net/api/ticker/?id=${cryptoId}`)
                .then(response => response.json())
                .then(data => {
                    const price = data[0].price_usd;
                    cryptoPrice.textContent = `Current Price: $${parseFloat(price).toFixed(2)}`;
                    checkAlert(price);
                })
                .catch(error => {
                    console.error("Error fetching cryptocurrency price:", error);
                    cryptoPrice.textContent = "Current Price: Error";
                });
        } else {
            // When no cryptocurrency is selected, ensure the price is empty or a default message
            cryptoPrice.textContent = "Current Price: Not Selected";
            alertMessage.textContent = "";  // Clear any existing alert message
        }
    });

    // Check if the current price exceeds the alert price
    function checkAlert(price) {
        const alertPrice = parseFloat(alertPriceInput.value);
        if (!isNaN(alertPrice)) {
            if (price >= alertPrice) {
                alertMessage.textContent = `Alert! ${cryptoSelect.options[cryptoSelect.selectedIndex].text} price has reached or exceeded $${alertPrice}.`;
            } else {
                alertMessage.textContent = "";  // Clear alert if price is below alert threshold
            }
        } else {
            alertMessage.textContent = "";  // Clear alert if alert price is not set
        }
    }

    // Monitor changes to the alert price input
    alertPriceInput.addEventListener("input", () => {
        const currentPriceText = cryptoPrice.textContent.replace("Current Price: $", "").trim();
        const currentPrice = parseFloat(currentPriceText);
        if (!isNaN(currentPrice)) {
            checkAlert(currentPrice);
        }
    });
});
