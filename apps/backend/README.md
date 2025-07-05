# AI Search Analytics Backend

This is the backend service for the AI Search Analytics platform. It provides APIs for company analysis using Brandfetch data and generates search questions using OpenAI.

## Setup

### Prerequisites

- Node.js 18+
- pnpm package manager
- Brandfetch API Key
- OpenAI API Key

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp env.example .env

# Edit .env file with your API keys
BRANDFETCH_API_KEY=your_brandfetch_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

```bash
# Start development server
pnpm dev

# The server will run on http://localhost:3001
```

### Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and timestamp.

### Company Analysis

```
POST /api/analyze-company
Content-Type: application/json

Body:
{
  "companyUrl": "https://autoscout24.de"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "company_id",
    "name": "AutoScout24",
    "domain": "autoscout24.de",
    "description": "Company description...",
    "logos": [...],
    "colors": [...],
    "fonts": [...],
    "company": {
      "industries": [...]
    }
  },
  "searchQuestions": [
    "best car buying app",
    "where to find used cars online",
    "car listings website",
    "how to sell my car online",
    "car marketplace Germany",
    "used car search",
    "car buying platform",
    "automotive marketplace",
    "car dealer website",
    "vehicle listings"
  ]
}
```

## Features

### Company Information

- Fetches comprehensive company data from Brandfetch
- Includes logos, colors, fonts, and industry classification
- Provides company description and metadata

### Search Questions Generation

- Uses OpenAI GPT-4o to generate 10-15 search questions
- Questions are designed to not mention the company directly
- Optimized for search engine analysis
- Covers informational, transactional, and navigational search intent

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error scenarios:

- Missing `companyUrl` in request body
- Invalid Brandfetch API key
- Invalid OpenAI API key
- Company not found in Brandfetch database
- OpenAI rate limit exceeded
- Network errors

## Environment Variables

| Variable             | Description             | Default               |
| -------------------- | ----------------------- | --------------------- |
| `BRANDFETCH_API_KEY` | Your Brandfetch API Key | Required              |
| `OPENAI_API_KEY`     | Your OpenAI API Key     | Required              |
| `PORT`               | Server port             | 3001                  |
| `CORS_ORIGIN`        | Allowed CORS origin     | http://localhost:3000 |

## Testing with Postman

1. Create a new POST request to `http://localhost:3001/api/analyze-company`
2. Set Content-Type header to `application/json`
3. Add request body:

```json
{
  "companyUrl": "https://autoscout24.de"
}
```

4. Send the request to test the API

## Next Steps

This is the first phase of the AI Search Analytics platform. Future phases will include:

- LLM response analysis for search questions
- Competitor analysis
- Website scraping with Puppeteer
- SEO optimization analysis
