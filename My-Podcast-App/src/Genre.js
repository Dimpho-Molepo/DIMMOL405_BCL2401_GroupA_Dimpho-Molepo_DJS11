export const genres = {
    1: "Personal Growth 🪴",
    2: "Investigative Journalism 🔎",
    3: "History 📚",
    4: "Comedy 🤣",
    5: "Entertainment 🧑‍🎤",
    6: "Business 🧑‍💼",
    7: "Fiction 📗",
    8: "News 📰",
    9: "Kids and Family 👶"
};


export function genreInfo(genreIds) {
    return genreIds.map((id) => genres[id]).join(", ");
}

console.log(Object.entries(genres))


console.log(Object.entries(genres))
