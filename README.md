# Test Job

## Project Overview

This project is a monorepo that contains both frontend and backend applications. The frontend application is located in the `frontEnd` directory, and the backend application is located in the `backEnd` directory. This setup allows you to run both applications simultaneously with a single command.

## Project Structure
test-job/
├── frontEnd/
│ ├── package.json
│ └── ... (frontend files)
├── backEnd/
│ ├── package.json
│ └── ... (backend files)
└── package.json

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager) must be installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd testjob

## Env Addition
  - Add .env at root of backEnd folder.
  - Add .env.development at root of frontEnd folder.

## Emulators
 For running emulators update the key 'VITE_APP_CONNECT_WITH_EMULATORS' to true in .env.development.
 and run command
 cd frontEnd && firebase emulators:start
 
## Script to start project
 - npm i 
 - npm run install
 - npm start