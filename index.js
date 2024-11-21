const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utility function to process the file
const processFile = (file_b64) => {
  if (!file_b64) return { valid: false, mimeType: null, sizeKB: null };

  const fileParts = file_b64.split(",");
  const mimeType = fileParts[0].match(/data:(.*?);base64/)[1];
  const buffer = Buffer.from(fileParts[1], "base64");
  const sizeKB = (buffer.length / 1024).toFixed(2);

  return { valid: true, mimeType, sizeKB };
};

// Utility function to check if a number is prime
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// POST route
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // Validate that data is an array
  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "'data' must be an array" });
  }

  try {
    // Filter and process data
    const numbers = data.filter((item) => !isNaN(item)).map(String);
    const alphabets = data.filter((item) => isNaN(item));
    const lowercaseAlphabets = alphabets.filter((char) => /^[a-z]$/.test(char));
    const highestLowercaseAlphabet = lowercaseAlphabets.length
      ? [lowercaseAlphabets.sort().reverse()[0]]
      : [];
    const primes = numbers.some((num) => isPrime(Number(num)));
    const fileDetails = processFile(file_b64);

    // Response
    res.json({
      is_success: true,
      user_id: "john_doe_17091999",
      email: "john@xyz.com",
      roll_number: "ABCD123",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      is_prime_found: primes,
      file_valid: fileDetails.valid,
      file_mime_type: fileDetails.mimeType,
      file_size_kb: fileDetails.sizeKB,
    });
  } catch (error) {
    res.status(500).json({ is_success: false, message: "Internal Server Error", error: error.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
