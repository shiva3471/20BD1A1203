const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get("/numbers", async (req, res) => {
  const urls = req.query.url || [];

  try {
    const requests = urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers || [];
      } catch (error) {
        console.error("Error fetching data from ${url}: ${error.message}");
        return [];
      }
    });

    const results = await Promise.all(requests);
    const mergedNumbers = results.flat().reduce((uniqueNumbers, number) => {
      if (!uniqueNumbers.includes(number)) {
        uniqueNumbers.push(number);
      }
      return uniqueNumbers;
    }, []);

    const sortedNumbers = mergedNumbers.sort((a, b) => a - b);

    res.status(200).json({ numbers: sortedNumbers });
  } catch (error) {
    console.error("Error processing requests: ${error.message}");
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log("Server is listening on port ${port}");
});