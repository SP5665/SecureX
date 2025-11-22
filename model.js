function checkThreat(text) {
    const threatWords = ["kill", "rape", "hurt", "blackmail", "expose"];
    return threatWords.some(w => text.toLowerCase().includes(w));
}