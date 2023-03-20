type VernacularName = IVernacularName;

interface IVernacularName {
  vernacularNameVernacularName: string;
}

type SpeciesInformation = ISpeciesInformation;

interface ISpeciesInformation {
  speciesInformationKingdom: string | null;
  speciesInformationPhylum: string | null;
  speciesInformationOrder: string | null;
  speciesInformationGenus: string | null;
  speciesInformationFamily: string | null;
  speciesInformationStatuses: string[];
  speciesInformationVernacularNames: VernacularName[];
}

type RemoteResult = IRemoteResult;

interface IRemoteResult {
  remoteResultOriginalQuery: string;
  remoteResultInformation: SpeciesInformation;
  remoteResultScientificName: string;
  remoteResultImages: string[];
  remoteResultWikipedia: string | null;
}

export type { RemoteResult, SpeciesInformation };
