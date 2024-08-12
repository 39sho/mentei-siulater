export const shuffle = <T>(array: T[]) => {
    const res = [...array];
    for (let i = res.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[j], res[i]] = [res[i], res[j]];
    }
    return res;
};