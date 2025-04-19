interface TAnilistTitle {
  romaji: string;
  english: string;
  native: string;
}

interface TAnilistCharacterName {
  alternative: string[];
  full: string;
  native: string | null;
}

interface TAnilistCharacterNode {
  name: TAnilistCharacterName;
}

interface TAnilistCharacters {
  nodes: TAnilistCharacterNode[];
}

interface TAnilistStaffName {
  full: string;
  native: string | null;
  alternative: string[];
}

interface TAnilistStaffImage {
  large: string;
  medium: string;
}

interface TAnilistStaffNode {
  name: TAnilistStaffName;
  image: TAnilistStaffImage;
  submissionNotes: string | null;
  primaryOccupations: string[];
}

interface TAnilistStaff {
  nodes: TAnilistStaffNode[];
}

interface TAnilistManga {
  id: number;
  title: TAnilistTitle;
  bannerImage: string;
  description: string;
  averageScore: number;
  characters: TAnilistCharacters;
  siteUrl: string;
  staff: TAnilistStaff;
}
