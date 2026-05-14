import type { ITunesTrackDTO, Track } from "../types";

export const mapITunesTrackToTrack = (dto: ITunesTrackDTO): Track => {
  return {
    trackId: dto.trackId,
    trackName: dto.trackName,
    artistName: dto.artistName,
    collectionName: dto.collectionName,
    artworkUrl100: dto.artworkUrl100,
    previewUrl: dto.previewUrl,
    trackTimeMillis: dto.trackTimeMillis,
    primaryGenreName: dto.primaryGenreName,
    releaseDate: dto.releaseDate,
    country: dto.country,
    currency: dto.currency,
    trackPrice: dto.trackPrice,
  };
};

export const mapITunesTracksToTracks = (dtos: ITunesTrackDTO[]): Track[] => {
  return dtos.map((dto) => mapITunesTrackToTrack(dto));
};
