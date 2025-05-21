import { useRoute } from "vue-router";
import { computed } from "vue";

export function useBreadcrumb(extra?: { label: string; to?: string | null }[]) {
  const route = useRoute();

  const slug = computed(() => (route.params.slug as string) || "");
  const subSlug = computed(
    () => route.params.ticket || route.params.file || ""
  );

  const base = [
    { label: "Home", to: "/" },
    { label: "Projects", to: "/" },
    { label: slug.value, to: `/project/${slug.value}` },
  ];

  if (extra && extra.length) {
    return [...base, ...extra];
  }

  if (route.path.includes("/tickets") && subSlug.value) {
    base.push({ label: "Tickets", to: `/project/${slug.value}/tickets` });
    base.push({ label: subSlug.value.replace(".md", ""), to: null });
  } else if (route.path.includes("/tickets")) {
    base.push({ label: "Tickets", to: null });
  } else if (route.path.includes("/blueprints") && subSlug.value) {
    base.push({ label: "Blueprints", to: `/project/${slug.value}/blueprints` });
    base.push({ label: subSlug.value.replace(".md", ""), to: null });
  } else if (route.path.includes("/blueprints")) {
    base.push({ label: "Blueprints", to: null });
  } else if (route.path.includes("/context") && subSlug.value) {
    base.push({ label: "Context", to: `/project/${slug.value}/context` });
    base.push({ label: subSlug.value.replace(".md", ""), to: null });
  } else if (route.path.includes("/context")) {
    base.push({ label: "Context", to: null });
  }

  return base;
}
