export type Option<T> = null | T;

export function is_some<T>(option: Option<T>): option is T {
    return option !== null;
}
