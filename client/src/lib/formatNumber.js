const formatNumber = (num) => {
    if (num < 1000) return num;

    const units = ["k", "M", "B", "T"];
    let unitIndex = -1;

    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }

    return Number.isInteger(num)
        ? num + units[unitIndex]
        : num.toFixed(1).replace(/\.0$/, "") + units[unitIndex];
};

export default formatNumber;