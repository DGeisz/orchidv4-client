type None = null;
type Some<T> = { Some: T };

export type Option<T> = None | Some<T>;

export function isSome<T>(option: Option<T>): option is Some<T> {
    return option !== null;
}
