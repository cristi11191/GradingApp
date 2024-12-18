/**
 * Calculates the final grade for a project based on evaluation scores.
 * Rules:
 * - If only 1 score, return it.
 * - If 2-3 scores, average them all.
 * - If more than 3 scores, remove the highest and lowest scores, then average the rest.
 *
 * @param {number[]} scores - Array of scores for a project.
 * @returns {number} - The calculated final grade rounded to 2 decimal places.
 */
const calculateFinalGrade = (scores) => {
    if (scores.length === 0) {return 0;}
    else if (scores.length === 1) {
        return scores[0];
    } else if (scores.length <= 3) {
        return +(scores.reduce((acc, score) => acc + score, 0) / scores.length).toFixed(2);
    } else {
        const total = scores.reduce((acc, score) => acc + score, 0);
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        return +((total - max - min) / (scores.length - 2)).toFixed(2);
    }
};

module.exports = { calculateFinalGrade };
