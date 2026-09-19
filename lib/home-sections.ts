import type { HomeSection } from "@/types/content";

export function splitHomeSections(sections: HomeSection[] = []) {
  return sections.reduce<{ heroSections: HomeSection[]; contentSections: HomeSection[] }>(
    (groups, section) => {
      if (section.__component === "shared.home-hero") groups.heroSections.push(section);
      else groups.contentSections.push(section);
      return groups;
    },
    { heroSections: [], contentSections: [] },
  );
}
