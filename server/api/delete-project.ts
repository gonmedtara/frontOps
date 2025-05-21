import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const { slug } = await readBody(event);

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: "Le slug du projet est requis",
      });
    }

    const basePath = path.resolve("./content/projects", slug);

    // Vérifier si le projet existe
    if (!fs.existsSync(basePath)) {
      throw createError({
        statusCode: 404,
        message: "Le projet n'existe pas",
      });
    }

    // Vérifier si c'est bien un dossier de projet
    const projectFile = path.join(basePath, `${slug}.md`);
    if (!fs.existsSync(projectFile)) {
      throw createError({
        statusCode: 400,
        message: "Le chemin spécifié n'est pas un projet valide",
      });
    }

    // Supprimer le projet et tous ses fichiers
    fs.rmSync(basePath, { recursive: true, force: true });

    return { 
      success: true,
      message: "Le projet a été supprimé avec succès"
    };
  } catch (error: any) {
    console.error("Erreur lors de la suppression du projet:", error);
    
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Une erreur est survenue lors de la suppression du projet",
    });
  }
});
