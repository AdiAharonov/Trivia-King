const saveScore = (key, item) => {
    localStorage.setItem(key, JSON.stringify(item))
}

const loadScore = (key) => {
    const score = JSON.parse(localStorage.getItem(key))
    return score;
}

export const StorageService = {
    saveScore,
    loadScore
}