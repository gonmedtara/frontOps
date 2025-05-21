export const AI_AGENTS = {
  PO: {
    role: "Product Owner",
    content: `You are an experienced Product Owner. Your role is to create clear, actionable tickets that define project requirements and user stories. Focus on creating practical tickets that clearly define what needs to be done, considering both user needs and technical feasibility.`,
    getPrompt: (context: any) => {
      const { title, tech, theme, description, filename } = context;
      return `Create detailed tickets for a web project with the following details:
        Title: ${title}
        Technology: ${tech}
        Theme: ${theme}
        Description: ${description}
        
        For each ticket, follow this exact format:
        ---BEGIN---
        ---
        type: ticket
        slug: ${filename}
        title: [${title}-XXX] Ticket Title
        status: open
        ticket_type: Feature | Bug | Enhancement
        priority: High | Medium | Low
        story_points: 1 | 2 | 3 | 5 | 8
        ticket_id: ${title}-XXX
        labels: []
        short_description: A concise summary of the ticket.
        ---

        ## User Story
        \`\`\`
        As a [type of user]
        I want to [goal]
        So that [benefit]
        \`\`\`

        ## Description
        Detailed description of the ticket with context and objectives.

        ## Acceptance Criteria
        - [ ] Criterion 1
        - [ ] Criterion 2
        - [ ] Criterion 3

        ## Technical Notes
        - Note 1
        - Note 2
        - Note 3

        ## Dependencies
        - Dependency 1
        - Dependency 2

        ---END---

        Important guidelines:
        1. Each ticket must have a unique ID in ${title}-XXX format (e.g., ${title}-001, ${title}-002).
        2. Acceptance criteria must be measurable and verifiable.
        3. Technical notes should be concise and relevant.
        4. Dependencies must be clearly identified.
        5. Labels should reflect the nature and importance of the ticket.
        6. The response MUST be formatted as a single markdown file containing multiple tickets. Each ticket block MUST be wrapped in \`---BEGIN---\` and \`---END---\` markers. The YAML frontmatter within each ticket MUST be correctly formatted between \`---\` markers.
        7. The content following the second "---" for each ticket must ONLY be the markdown body (User Story, Description, Acceptance Criteria, etc.) and must NOT contain any YAML-like key: value pairs or additional "---" markers within the content.
        
        Create multiple tickets that cover all aspects to init the project(technical and business basic tasks). Each ticket should be:
        - Specific and actionable
        - Include clear acceptance criteria
        - Consider both user and technical perspectives
        - Be self-contained and independently implementable
        - Include relevant technical considerations
        
        Use sequential IDs starting from ${title}-001 for each ticket. Ensure the \`ticket_id\` field in the YAML matches the ID in the Markdown title.`;
    }
  },
  ARCHITECT: {
    role: "system",
    content: "You are a Technical Architect responsible for designing the technical architecture of web projects.",
    getPrompt: (context: any) => `Design the technical architecture for a web project with the following details:
      Title: ${context.title}
      Technology: ${context.tech}
      Theme: ${context.theme}
      Description: ${context.description}
      Pages: ${context.pages}
      
      Provide a detailed technical architecture.`
  },
  ARCHITECT_PAGES: {
    role: "system",
    content: "You are a Technical Architect responsible for defining the pages and their structure in web projects.",
    getPrompt: (context: any) => `Define the pages structure for a web project with the following details:
      Title: ${context.title}
      Technology: ${context.tech}
      Theme: ${context.theme}
      Description: ${context.description}
      Tickets: ${context.tickets}
      
      Define the pages in a clear, structured format.`
  },
  BEST_PRACTICES: {
    role: "system",
    content: "You are a Technical Expert responsible for defining best practices and coding standards for web projects.",
    getPrompt: (context: any) => `Define best practices for a web project with the following details:
      Title: ${context.title}
      Technology: ${context.tech}
      Theme: ${context.theme}
      Description: ${context.description}
      Architecture: ${context.architecture}
      
      Provide comprehensive best practices.`
  },
  DEVOPS: {
    role: "system",
    content: "You are a DevOps Engineer responsible for setting up deployment and infrastructure configurations.",
    getPrompt: (context: any) => `Set up deployment configuration for a web project with the following details:
      Title: ${context.title}
      Technology: ${context.tech}
      Theme: ${context.theme}
      Description: ${context.description}
      Architecture: ${context.architecture}
      Best Practices: ${context.bestPractices}
      
      Provide deployment configuration.`
  },
  DESCRIPTION_ENHANCER: {
    role: "system",
    content: "You are a Product Expert responsible for enhancing project descriptions with functional details, user stories, and business value.",
    getPrompt: (context: any) => `Enhance the following web project description by adding relevant functional details and business value.
      Project details:
      - Title: ${context.title}
      - Technology: ${context.tech}
      - Theme: ${context.theme}
      - Current description: ${context.description}
      
      The enhanced description must include:
      - A clear project overview and business context
      - Main user stories and use cases
      - Key features from a user perspective
      - Expected user experience and interactions
      - Business value and objectives
      - Target audience and user personas
      
      Format: Well-structured Markdown with clear sections.
      
      Note: The response should be in French, but maintain technical terms in English when appropriate.`
  }
}; 