const hintKeys = "sadfjklewcmpgh".split("");

/**
 * Proudly stole this right from Vimium
 */
export function hint_strings(linkCount: number): string[] {
    let hints: string[] = [""];
    let offset: number = 0;
    while (hints.length - offset < linkCount || hints.length === 1) {
        const hint = hints[offset++];
        for (let ch of hintKeys) hints.push(ch + hint);
    }
    hints = hints.slice(offset, offset + linkCount);

    return hints.sort().map((str) => str.split("").reverse().join(""));
}
