# Max Hoang Portfolio

A personal website built with Next.js and Notion as a CMS, featuring a blog and timeline with real-time content updates.

## Features

- **Home Page**: Dynamic content from Notion
- **Blog**: Posts with featured highlighting and cover images
- **Timeline**: Chronological view with featured post highlighting
- **Contact, Projects, Study Journal**: Dynamic pages powered by Notion
- **Real-time updates**: Content updates automatically from Notion

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Content**: Notion API
- **Rendering**: react-notion-x for rich content
- **Deployment**: Vercel

## Environment Variables

Make sure to set the following environment variable:

```
NOTION_TOKEN=your_notion_integration_token
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the `NOTION_TOKEN` environment variable in Vercel
3. Deploy!

The project includes proper Next.js configuration and Vercel settings for seamless deployment.
