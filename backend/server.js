const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const FormData = require('form-data');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Constants
const API_KEY = '65ytl2m8te5r82y2a6u866x85del551p';
const EXTERNAL_API_URL = 'https://resell.lightningproxies.net/api/getplan';
const IPV6_PLACEHOLDER = 'ipv6'; // Fixed path parameter

// Endpoint to handle plan requests
app.post('/api/getplan', async (req, res) => {
  const { bandwidth } = req.body;

  // Input Validation
  if (bandwidth === undefined || bandwidth === null) {
    return res.status(400).json({ error: 'Bandwidth is required.' });
  }

  const bandwidthInt = parseInt(bandwidth, 10);
  if (isNaN(bandwidthInt) || bandwidthInt <= 0) {
    return res.status(400).json({ error: 'Bandwidth must be a positive integer.' });
  }

  try {
    // Prepare form data
    const form = new FormData();
    form.append('bandwidth', bandwidthInt);

    // Make POST request to external API with fixed 'ipv6' path parameter
    const response = await axios.post(
      `${EXTERNAL_API_URL}/${encodeURIComponent(IPV6_PLACEHOLDER)}`,
      form,
      {
        headers: {
          'x-api-key': API_KEY,
          ...form.getHeaders(),
        },
      }
    );

    // Send back the response from external API
    res.json(response.data);
  } catch (error) {
    console.error('Error calling external API:', error.message);
    if (error.response) {
      // If the external API responded with an error
      res.status(error.response.status).json(error.response.data);
    } else {
      // For other errors (e.g., network issues)
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
