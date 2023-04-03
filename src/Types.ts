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
  speciesInformationScientificName: string;
  speciesInformationVernacularNames: VernacularName[];
}

type RemoteResult = IRemoteResult;

interface IRemoteResult {
  remoteResultOriginalQuery: string;
  remoteResultScientificName: string;
  remoteResultInformation: SpeciesInformation;
  remoteResultImages: RemoteContent<string[]>;
  remoteResultWikipedia: RemoteContent<string>;
}

type GameAnswer = IGameAnswer;

interface IGameAnswer {
  speciesGroups: string[][];
  answerTaxonomicDiscriminators: TaxonomicDiscriminators;
}

type GameSetup = IGameSetup;

interface IGameSetup {
  species: RemoteResult[];
  nbGroups: number;
  textTip: string;
  gameTaxonomicDiscriminators: TaxonomicDiscriminators;
}

type GameResult = IGameResult;

interface IGameResult {
  gameResultSuccess: boolean;
  gameResultScore: number;
  gameResultcorrectAnswer: string[][];
}

type NewGameRequest = INewGameRequest;

interface INewGameRequest {
  speciesNumber: number;
  groupNumber: number;
  speciesGroup: number;
  gameDifficulty: number;
}

type RemoteContent<T> = IRetrieved<T> | INotAvailable<T> | INeverTried<T>;

interface IRetrieved<T> {
  tag: "Retrieved";
  contents: T;
}

interface INotAvailable<T> {
  tag: "NotAvailable";
}

interface INeverTried<T> {
  tag: "NeverTried";
}

type TaxonomicDiscriminators = ITaxonomicDiscriminators;

interface ITaxonomicDiscriminators {
  rootDiscriminator: number;
  groupDiscriminator: number;
}

export type { RemoteResult, GameAnswer, GameSetup, SpeciesInformation };
