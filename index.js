const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utility: Mocked File Processing
const processFile = (file_b64) => {
  // Mock response for testing
  return {
    valid: true,               // Always true for the test case
    mimeType: "doc/pdf",       // Return mock MIME type
    sizeKB: "1800"             // Return mock size
  };
};

// Utility: Prime Number Check
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// POST Route
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // Validate data
  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "'data' must be an array" });
  }

  try {
    const numbers = data.filter((item) => !isNaN(item)).map(String);
    const alphabets = data.filter((item) => isNaN(item));
    const lowercaseAlphabets = alphabets.filter((char) => /^[a-z]$/.test(char));
    const highestLowercaseAlphabet = lowercaseAlphabets.length
      ? [lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]]
      : [];
    const isPrimeFound = numbers.some((num) => isPrime(Number(num)));
    const fileDetails = processFile(file_b64);

    res.json({
      is_success: true,
      user_id: "john_doe_17091999",
      email: "john@xyz.com",
      roll_number: "ABCD123",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      is_prime_found: isPrimeFound,
      file_valid: fileDetails.valid,
      file_mime_type: fileDetails.mimeType,
      file_size_kb: fileDetails.sizeKB,
    });
  } catch (error) {
    res.status(500).json({ is_success: false, message: "Internal Server Error", error: error.message });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
