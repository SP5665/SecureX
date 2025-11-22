function detectThreat(text) {
    const keywords = [
        "kill", "hurt", "threat", "rape", "attack",
        "i will find you", "i will come", "i will harm you",
        "die", "violence", "blood", "stab"
    ];

    return keywords.some(k => text.toLowerCase().includes(k));
}
