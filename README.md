# Crowdfunding

## Overview

This api is for a crowdfunding platform where user can sign in,  create campaign, donate and leave comments.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Error Handling](#error-handling)
6. [License](#license)

## Getting Started

### Prerequisites

List of the software and tools required to run the project:

- Node.js (version 20.11.1)
- npm
- MongoDB
- cloudinary
- paystack

## Installation

Step-by-step instructions on how to install the project:
1. Clone the repository:
```bash
git clone https://github.com/ritg2/ritg2-crownfund-backend-node
```

2. Install dependencies:
```bash
npm install
```


## Configuration

How to configure the project:

1. Create a .env file in the root directory and add the following environment variables:
```plaintext
PORT=5001
CONNECTION_STRING=mongodb-uri
ACCESS_TOKEN_SECRET=yoursecret
CLOUDINARY_CLOUD_NAME=cloudname
CLOUDINARY_API_KEY=api-key
CLOUDINARY_API_SECRET=api-secret
PAYSTACK_SECRET_KEY=paystack secret key
GMAIL_PASSWORD=gmail-password
```

## Running the Application

How to start your application:

Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to [http://localhost:5001](http://localhost:5001).

## Error Handling

- 400 Bad Request: Invalid request parameters
- 401 Unauthorized: Authentication failed
- 404 Not Found: Resource not found
- 500 Internal Server Error: General server error

## License

Specify the license under which your project is distributed. For example:

This project is licensed under the MIT License - see the LICENSE file for details.
