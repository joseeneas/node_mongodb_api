# Node.js + MongoDB API

This is a simple Express.js API that connects to MongoDB and retrieves user data.

## Endpoint

**GET** `/users/:id`

- Returns user info if `age > 21`
- Returns 404 if user not found or underage
- Gracefully handles invalid ObjectId errors

The original requirements are in the file Jobs.PDF

The code has been fully documented using GitHub CoPilot. the documentation was just formatted to make it easier to read.
