type Value<T> = T | null;

declare global {
  /** Define data with the value and status fields.
   *
   * Destructure to access it easily:
   * @example
   * const [fetchedData, fetchedStatus] = someDataWithState
   */
  type DataWithState<T> = [Value<T>, Status];
  type gql = typeof graphql;
  type Status = "idle" | "pending" | Error;
  type Coords = {
    lat: number;
    lng: number;
  };
  type MaybeHasId = {
    id?: string | null;
  };
}