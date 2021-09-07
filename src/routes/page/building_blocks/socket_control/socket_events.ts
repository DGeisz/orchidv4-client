export enum SocketEventTag {
    CursorPrevious,
    CursorNext,
    KeyEntered,
}

interface CursorPrevious {
    tag: SocketEventTag.CursorPrevious;
    caller_id: string;
}

export function createCursorPreviousEvent(id: string): CursorPrevious {
    return {
        tag: SocketEventTag.CursorPrevious,
        caller_id: id,
    };
}

interface CursorNext {
    tag: SocketEventTag.CursorNext;
    caller_id: string;
}

export function createCursorNextEvent(id: string): CursorNext {
    return {
        tag: SocketEventTag.CursorNext,
        caller_id: id,
    };
}

interface KeyEntered {
    tag: SocketEventTag.KeyEntered;
    key: string;
}

export function createKeyEnteredEvent(key: string): KeyEntered {
    return {
        tag: SocketEventTag.KeyEntered,
        key,
    };
}

export type SocketEvent = CursorPrevious | CursorNext | KeyEntered;
