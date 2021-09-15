export function simulate_keypress(key: string) {
    const event = new KeyboardEvent("keydown", { key });

    document.dispatchEvent(event);
}

export function element_in_view(e: HTMLElement) {
    const rect = e.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function element_in_top(e: HTMLElement, fraction: number) {
    const rect = e.getBoundingClientRect();

    return (
        rect.top <=
            fraction *
                (window.innerHeight || document.documentElement.clientHeight) &&
        rect.top >= 0
    );
}

export function element_in_bottom(e: HTMLElement, fraction: number) {
    const rect = e.getBoundingClientRect();

    return (
        rect.top >=
            (1 - fraction) *
                (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)
    );
}
