import type {
  ITunesTrackDTO,
  SearchTracksParams,
  Track,
} from "../types";
import { mapITunesTracksToTracks } from "./mappers";

const ITUNES_BASE_URL = "https://itunes.apple.com/search";
const DEFAULT_ENTITY = "song";
const DEFAULT_LIMIT = 25;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isITunesTrackDTO = (value: unknown): value is ITunesTrackDTO => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.trackId === "number" &&
    typeof value.trackName === "string" &&
    typeof value.artistName === "string" &&
    typeof value.artworkUrl100 === "string"
  );
};

export class ITunesRequestAbortedError extends Error {
  constructor() {
    super("Requête iTunes annulée");
    this.name = "ITunesRequestAbortedError";
  }
}

export const fetchITunesTracks = async (
  params: SearchTracksParams,
): Promise<Track[]> => {
  const normalizedTerm = params.term.trim();

  if (!normalizedTerm) {
    return [];
  }

  const query = new URLSearchParams({
    term: normalizedTerm,
    media: "music",
    entity: params.entity ?? DEFAULT_ENTITY,
    attribute: params.attribute,
    limit: String(params.limit ?? DEFAULT_LIMIT),
  });

  const url = `${ITUNES_BASE_URL}?${query.toString()}`;

  try {
    const response = await fetch(url, { signal: params.signal });

    if (!response.ok) {
      throw new Error(`iTunes API responded with ${response.status}`);
    }

    const payload: unknown = await response.json();

    if (!isObject(payload) || !Array.isArray(payload.results)) {
      throw new Error("Invalid iTunes API response format");
    }

    const validDtos = payload.results.filter(isITunesTrackDTO);
    const tracks = mapITunesTracksToTracks(validDtos);

    // L'API iTunes ignore parfois `attribute` côté serveur (ex. "dua" renvoie
    // les chansons de Dua Lipa même en mode songTerm). On filtre côté client
    // pour garantir le comportement attendu : "Artiste" ne retient que les
    // résultats dont le nom d'artiste matche, "Titre" ceux dont le titre matche.
    const needle = normalizedTerm.toLocaleLowerCase();
    return tracks.filter((track) => {
      if (params.attribute === "artistTerm") {
        return track.artistName.toLocaleLowerCase().includes(needle);
      }
      return track.trackName.toLocaleLowerCase().includes(needle);
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ITunesRequestAbortedError();
    }
    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.message === "Aborted")
    ) {
      throw new ITunesRequestAbortedError();
    }
    if (error instanceof Error) {
      throw new Error(
        `Impossible de récupérer les morceaux iTunes : ${error.message}`,
      );
    }
    throw new Error(
      "Impossible de récupérer les morceaux iTunes (erreur inconnue)",
    );
  }
};
