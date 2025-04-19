interface TAnilistCharacter {
  id: number;
  name: {
    first: string;
    middle: string;
    last: string;
    full: string;
    native: string;
    alternative: string[];
    alternativeSpoiler: string[];
    userPreferred: string;
  };
  image: {
    large: string;
    medium: string;
  };
  description(asHtml: Boolean): string;
  gender: string;
  dateOfBirth: FuzzyDate;
  age: string;
  bloodType: string;
  isFavourite: Boolean;
  isFavouriteBlocked: Boolean;
  siteUrl: string;
  media: {
    edges: {
      node: {
        coverImage: {
          extraLarge: string;
          large: string;
          medium: string;
          color: string;
        };
      };
      isMainStudio: Boolean;
      roleNotes: string;
      dubGroup: string;
      staffRole: string;
      favouriteOrder: Int;
    }[];
  };
  favourites: Int;
}
