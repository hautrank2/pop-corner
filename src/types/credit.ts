import { ArtistModel } from "./artist";

export type CreditModel = {
  id: number;
  name: string;
  description: string;
};

export type MovieCreditModel = {
  id: number;
  name: string;
  description?: string;
  characterName?: string;
  artist?: ArtistModel;
  artistId?: string;
};
