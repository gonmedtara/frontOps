# FrontOps

FrontOps is a platform that uses AI to automate web project creation and management. It automatically generates documentation, technical architecture, tickets, and best practices for your projects.

## 🚀 Features

- 🤖 **AI Project Creation**: Automatic documentation and architecture generation
- 📋 **Ticket Management**: AI-powered ticket creation and organization
- 🏗️ **Technical Architecture**: Detailed project architecture generation
- ✅ **Best Practices**: Automatic development recommendations
- 🔧 **DevOps Configuration**: Automatic pipeline and configuration setup

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- An OpenAI account with an API key
- Docker (optional, for deployment)

## 🛠️ Installation

### Local Installation

1. **Clone the project**
```bash
git clone https://github.com/your-username/frontops.git
cd frontops
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment variables setup**

Create a `.env` file in the project root:
```env
NUXT_OPENAI_API_KEY=your_openai_api_key_here
```

To get an OpenAI token:
1. Create an account on [OpenAI](https://platform.openai.com)
2. Go to the "API Keys" section
3. Create a new API key
4. Copy the key and paste it as the value for `NUXT_OPENAI_API_KEY`

⚠️ **Important**: Never share your OpenAI token and never commit it to Git. The `.env` file is already listed in `.gitignore` to prevent this.

### Docker Installation

1. **Build the Docker image**
```bash
docker build -t frontops .
```

2. **Create .env file for Docker**
```bash
echo "NUXT_OPENAI_API_KEY=your_openai_api_key_here" > .env
```

3. **Run the container**
```bash
docker run -d \
  --name frontops \
  -p 3000:3000 \
  --env-file .env \
  frontops
```

The application will be available at `http://localhost:3000`

## 🚀 Getting Started

### Local Development

1. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

2. **Access the application**
Open your browser and go to `http://localhost:3000`

### Docker Development

If you're using Docker, the application starts automatically after launching the container.

## 📝 Usage

1. **Create a new project**
   - Click "New Project" on the homepage
   - Fill in the form with your project details
   - The AI will automatically generate:
     - Project documentation
     - Tickets with priorities and story points
     - Technical architecture
     - Best practices
     - DevOps configuration

2. **Manage tickets**
   - Go to the "Tickets" section of your project
   - Review generated tickets
   - Track project progress

3. **View architecture**
   - Go to the "Blueprints" section
   - Explore the generated technical architecture
   - Review diagrams and documentation

## 🏗️ Project Structure

```
frontops/
├── components/     # Reusable Vue components
├── pages/         # Application pages
├── server/        # API and server logic
│   ├── api/      # API endpoints
│   └── utils/    # Server utilities
├── stores/        # Pinia stores
└── content/       # Generated content (projects, tickets, etc.)
```

## 🐳 Deployment

### Docker Deployment

1. **Build the image**
```bash
docker build -t frontops .
```

2. **Deploy to a server**
```bash
# On your server
docker run -d \
  --name frontops \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  frontops
```

### Production Environment Variables

For production deployment, make sure to configure the following environment variables:
```env
NODE_ENV=production
NUXT_OPENAI_API_KEY=your_openai_api_key_here
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
