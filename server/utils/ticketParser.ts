import path from "path";

interface ParsedTicket {
  title: string;
  content: string;
  ticket_id?: string;
}

export function parseTicketsResponse(ticketsMd: string, filename: string): ParsedTicket[] {
  // console.log("Parsing tickets response..."); // Log de début
  // console.log("Raw AI response (inside parser):", ticketsMd.substring(0, 500) + (ticketsMd.length > 500 ? "..." : "")); // Log début réponse IA

  const tickets: ParsedTicket[] = [];
  let currentIndex = 0;

  // L'IA génère ---BEGIN--- --- FO --- CONTENU ---END--- ---BEGIN--- --- FO --- CONTENU ---END---
  // On cherche les blocs délimités par ---BEGIN--- et ---END---

  while (currentIndex < ticketsMd.length) {
    // Trouver le début du prochain ticket (---BEGIN---)
    const startBlockMatch = ticketsMd.indexOf('---BEGIN---', currentIndex);

    if (startBlockMatch === -1) {
      // Pas d'autre début de ticket trouvé
      break;
    }
     console.log(`Found ticket block start at index: ${startBlockMatch}`); // Log startBlockMatch

    // Trouver la fin du ticket (---END---)
    const endBlockMatch = ticketsMd.indexOf('---END---', startBlockMatch + '---BEGIN---'.length);

    if (endBlockMatch === -1) {
      // Si on ne trouve pas la fin du bloc, c'est un problème de format.
      console.warn(`Skipping block starting at index ${startBlockMatch} due to missing end marker (---END---).`);
      currentIndex = startBlockMatch + '---BEGIN---'.length;
      continue;
    }
     console.log(`Found ticket block end at index: ${endBlockMatch}`); // Log endBlockMatch

    // Extraire le contenu du bloc entre ---BEGIN--- et ---END---
    const ticketBlockContent = ticketsMd.substring(startBlockMatch + '---BEGIN---'.length, endBlockMatch).trim();
     console.log(`Extracted ticket block content (first 500 chars):`, ticketBlockContent.substring(0, 500) + (ticketBlockContent.length > 500 ? "..." : "")); // Log the full block content

    // Maintenant, parsez le frontmatter et le contenu *à l'intérieur* de ce bloc
    const frontmatterStartMatch = ticketBlockContent.indexOf('---');
    
    // Ensure the found --- is followed by a newline to be the start of frontmatter
    if (frontmatterStartMatch === -1 || ticketBlockContent[frontmatterStartMatch + 3] !== '\n') {
         console.warn(`Skipping block starting at index ${startBlockMatch} within ticket block: Could not find start of frontmatter (--- followed by newline).`);
         currentIndex = endBlockMatch + '---END---'.length; // Move to the end of the block
         continue;
    }

    // *** Modified logic to find the end of frontmatter ***
    // Find the start of the content by looking for the first Markdown heading (e.g., "##")
    const contentStartMatch = ticketBlockContent.indexOf('##', frontmatterStartMatch + 3); // Search after the initial ---

    if (contentStartMatch === -1) {
        console.warn(`Skipping block starting at index ${startBlockMatch} within ticket block: Could not find start of content (first ## marker).`);
        currentIndex = endBlockMatch + '---END---'.length; // Move to the end of the block
        continue;
    }

    const frontmatterEndIndex = contentStartMatch - 1; // The frontmatter ends right before the content starts

    console.log(`Found internal frontmatter start match at index: ${frontmatterStartMatch}`); // Log internal start index
    console.log(`Calculated internal frontmatter end index: ${frontmatterEndIndex}`); // Log calculated internal end index
    console.log(`Found content start match at index: ${contentStartMatch}`); // Log content start index

    const frontmatter = ticketBlockContent.substring(frontmatterStartMatch + 3, frontmatterEndIndex).trim(); // Extract frontmatter between --- and content start
     console.log(`Extracted frontmatter (first 100 chars) from block:`, frontmatter.substring(0, 100) + (frontmatter.length > 100 ? "..." : "")); // Log frontmatter

    const content = ticketBlockContent.substring(contentStartMatch).trim(); // Content starts from the ## marker
     console.log(`Extracted content (first 500 chars) from block:`, content.substring(0, 500) + (content.length > 500 ? "..." : "")); // Log content

    // --- Refined logic to handle potential rogue YAML in content ---
    // This logic might be less necessary now that we look for ##, but keeping a simple check for stray --- is still useful
    let actualContent = content;
    const rogueYamlEndIndex = content.indexOf('---\n'); // Look for a stray --- followed by a newline within the content

    if (rogueYamlEndIndex !== -1) {
      console.warn('Detected potential stray --- in content. Skipping content before the first stray --- line.');
      actualContent = content.substring(rogueYamlEndIndex + 4).trim(); // +4 for '---\n'
    }
    // Removed the less aggressive check as it was causing issues

    // --- End refined logic ---

    // Maintenant on a le frontmatter et le contenu. On parse le frontmatter.
    if (frontmatter.startsWith('type: ticket')) { // Vérification basique
      const metadata: any = {};
      frontmatter.split('\n').forEach(line => {
        const [key, ...values] = line.split(':');
        if (key && values.length > 0) {
          metadata[key.trim()] = values.join(':').trim();
        }
      });

      const titleValue = metadata.title || '';
      const titleMatch = titleValue.match(/\[([^\]]+)-\d+\]\s*(.*)/); // Capture the project slug part dynamically
      const ticketIdValue = metadata.ticket_id || (titleMatch ? titleMatch[1] + '-' + titleValue.match(/\d+/)?.[0] : undefined); // Reconstruct ticket ID using captured slug and number
      const ticketTitleValue = titleMatch ? titleMatch[2]?.trim() : titleValue.trim();

      if (ticketIdValue) {
         // Reconstruire le contenu final avec un frontmatter valide pour Nuxt Content
         const reconstructedFrontmatterLines: string[] = [];

         reconstructedFrontmatterLines.push('type: ticket');
         reconstructedFrontmatterLines.push(`slug: ${filename}`);
         reconstructedFrontmatterLines.push(`ticket_id: ${ticketIdValue}`);
         reconstructedFrontmatterLines.push(`title: "${ticketTitleValue || 'No Title'}"`);
         reconstructedFrontmatterLines.push(`status: ${metadata.status || 'open'}`);
         reconstructedFrontmatterLines.push(`ticket_type: ${metadata.ticket_type || 'Feature'}`);
         reconstructedFrontmatterLines.push(`priority: ${metadata.priority || 'Medium'}`);
         reconstructedFrontmatterLines.push(`story_points: ${metadata.story_points || '1'}`);
         reconstructedFrontmatterLines.push(`short_description: ${metadata.short_description || 'No Short Description'}`);
         // Ensure labels are correctly parsed as an array
         let labels: string[] = [];
         const labelsString = metadata.labels || '';
         // Check if the labels string is in the expected [label1, label2] format
         const labelsMatch = labelsString.match(/^\[(.*)\]$/);
         if (labelsMatch && labelsMatch[1]) {
             // Extract content within brackets, split by comma, trim whitespace
             labels = labelsMatch[1].split(',').map((label: string) => label.trim()).filter((label: string) => label.length > 0);
         } else if (labelsString.length > 0) {
             // If it's not in the expected format but not empty, log a warning
             console.warn('Labels string is not in [label1, label2] format:', labelsString);
         }
         reconstructedFrontmatterLines.push(`labels: ${JSON.stringify(labels)}`);

         const finalContent = `---\n${reconstructedFrontmatterLines.join('\n')}\n---\n${actualContent}`;

        tickets.push({
          title: ticketTitleValue || 'No Title',
          content: finalContent.trim(),
          ticket_id: ticketIdValue
        });
        console.log(`Successfully parsed ticket ${ticketIdValue}`);
      } else {
          console.warn(`Skipping block starting at index ${startBlockMatch} due to missing or invalid ticket_id/title in frontmatter. Metadata:`, metadata);
      }
    } else {
        console.warn(`Skipping block starting at index ${startBlockMatch} as extracted frontmatter does not start with 'type: ticket'. Extracted frontmatter (first 100 chars): ${frontmatter.substring(0, 100)}...`);
    }

    // Mettre à jour l'index pour la prochaine itération. Aller juste après le ---END--- de ce bloc.
    currentIndex = endBlockMatch + '---END---'.length;
  }
  // console.log("Finished parsing tickets response."); // Log de fin
  return tickets;
} 