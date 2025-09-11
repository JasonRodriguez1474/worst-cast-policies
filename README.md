# Worst Cast Policies

An AI-powered cybersecurity policy generator designed for **educational purposes and security training**. This tool intentionally generates flawed policies to help students develop critical evaluation and auditing skills.

⚠️ **Important**: This project uses a lower-performing LLM specifically chosen for its tendency to produce mistakes, hallucinations, and gaps that mirror real-world policy review scenarios. Generated policies should **never be used in production environments**.

## About

This project is part of ongoing research by FSP-Research and Jason Rodriguez that evaluates LLM performance in cybersecurity contexts. The application intentionally generates suboptimal policies to provide realistic training scenarios for cybersecurity professionals and students learning to:

- Audit AI-generated content
- Identify policy gaps and weaknesses
- Develop critical evaluation skills
- Practice cybersecurity policy review

### Key Features

- Generate policies for major compliance frameworks (PCI-DSS, HIPAA, NIST 800-171, CMMC Level 1)
- Customizable organizational constraints and requirements
- PDF export functionality
- Educational-focused interface with clear warnings about policy quality

## Development

This project was created with `deno run -A npm:sv create worst-cast-policies` and is deployed via **Deno Deploy**.

### Prerequisites

- [Node.js](https://nodejs.org/) and npm (for development)
- [Deno](https://deno.land/) runtime (for deployment)

### Installation

Install dependencies:

```sh
npm install
```

For Deno deployment, dependencies are installed via:

```sh
deno install npm:{dependency-name}
```

### Development Server

Start the development server:

```sh
npm run dev

# or to open in browser automatically
npm run dev -- --open
```

### Building

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

### Additional Commands

Check code quality:

```sh
npm run check      # Type checking
npm run lint       # Linting
npm run format     # Code formatting
```

## Research Context

As part of ongoing LLM evaluation research, the model used in this application may change based on research findings. Currently using Mistral 3B specifically for its documented tendency to produce errors that create valuable learning opportunities.

## Educational Use Only

**🚨 Critical Warning**: All generated policies are intentionally flawed and incomplete. They are designed for educational analysis and should never be implemented in real environments. Use this tool to:

- Practice identifying policy weaknesses
- Learn about cybersecurity frameworks
- Develop critical thinking skills
- Understand common AI-generated content issues

## Contributing

This project is part of active research. Contributions that enhance the educational value or improve the training scenarios are welcome.
