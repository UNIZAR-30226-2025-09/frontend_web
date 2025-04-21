
/**
 * Parses LRC format lyrics into an array of timed lyrics
 * @param {string} lrc - The LRC file content
 * @returns {Array} - Array of objects with time and text properties
 */
export function parseLRC(lrc) {
    if (!lrc || typeof lrc !== 'string') {
        return [];
    }

    const lines = lrc.split('\n');
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
    const lyrics = [];

    lines.forEach(line => {
        if (!line.trim()) return;

        const timeMatches = [...line.matchAll(timeRegex)];
        if (!timeMatches.length) return;

        // Extract text content after the time tags
        const text = line.replace(timeRegex, '').trim();
        if (!text) return;

        // Process each time tag in the line
        timeMatches.forEach(match => {
            const min = parseInt(match[1], 10);
            const sec = parseInt(match[2], 10);
            const ms = parseInt(match[3], 10);

            // Convert to seconds
            const timeInSeconds = min * 60 + sec + ms / (match[3].length === 2 ? 100 : 1000);

            lyrics.push({
                time: timeInSeconds,
                text: text
            });
        });
    });

    // Sort by time
    return lyrics.sort((a, b) => a.time - b.time);
}