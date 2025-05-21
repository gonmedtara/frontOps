import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "projects/**/**/*.md",
      schema: z.object({
        title: z.string(),
        tech: z.string().optional(),
        theme: z.string().optional(),
        deploy: z.string().optional(),
        createdAt: z.string().optional(),
        status: z.string().optional(),
        type: z.enum(["project", "ticket", "blueprint", "context"]),
        slug: z.string().optional(),
      }),
    }),
  },
});
