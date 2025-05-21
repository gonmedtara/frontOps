import fs from 'fs';
import path from 'path';

export const createProjectDirectory = (basePath: string): void => {
  fs.mkdirSync(basePath, { recursive: true });
  fs.chmodSync(basePath, 0o755);
};

export const createProjectFile = (
  filePath: string,
  content: string,
  permissions: number = 0o644
): void => {
  fs.writeFileSync(filePath, content, 'utf-8');
  fs.chmodSync(filePath, permissions);
};

export const createProjectSections = (basePath: string, sections: string[]): void => {
  sections.forEach(section => {
    const sectionPath = path.join(basePath, section);
    fs.mkdirSync(sectionPath, { recursive: true });
    fs.chmodSync(sectionPath, 0o755);
  });
};

export const createProjectMetadata = (
  basePath: string,
  filename: string,
  metadata: {
    title: string;
    tech: string;
    theme: string;
    deploy: string;
    createdAt: string;
    description: string;
  }
): void => {
  const projectFilePath = path.join(basePath, `${filename}.md`);
  const projectContent = `---\ntitle: ${metadata.title}\ntech: ${metadata.tech}\ntheme: ${metadata.theme}\ndeploy: ${metadata.deploy}\ncreatedAt: ${metadata.createdAt}\nstatus: bootstrap-ready\ntype: project\n---\n\n${metadata.description}`;
  createProjectFile(projectFilePath, projectContent);
};

export const createTicketFiles = (
  basePath: string,
  filename: string,
  tickets: { title: string; content: string; ticket_id?: string }[]
): void => {
  tickets.forEach((ticket, index) => {
    const ticketFilename = ticket.ticket_id ? `${ticket.ticket_id}.md` : `ticket-${String(index + 1).padStart(3, '0')}.md`;

    const ticketPath = path.join(
      basePath,
      'tickets',
      ticketFilename
    );
    createProjectFile(ticketPath, ticket.content.trim());
  });
};

export const createContextFile = (
  basePath: string,
  filename: string,
  type: string,
  content: string
): void => {
  const filePath = path.join(basePath, 'context', `${type}.md`);
  const fileContent = `---\ntype: context\nslug: ${filename}\n---\n\n${content}`;
  createProjectFile(filePath, fileContent.trim());
};

export const createBlueprintFile = (
  basePath: string,
  filename: string,
  content: string
): void => {
  const filePath = path.join(basePath, 'blueprints', 'init.md');
  const fileContent = `---\ntype: blueprint\nslug: ${filename}\n---\n\n${content}`;
  createProjectFile(filePath, fileContent.trim());
}; 