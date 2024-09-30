const comparator = (a: number[], b: number[]) => {
    if(a[0] === b[0]){
        return a[1] - b[1];
    }
    return a[0] - b[0];
}

const optimiseBookings = (bookings: number[][]): number[][] => {
    if(bookings.length === 0){
        return [];
    }

    bookings.sort(comparator);

    const optimisedBookings: number[][] = [];
    let current = bookings[0];

    for(let i = 1; i < bookings.length; i++){
        const next = bookings[i];
        if(current[1] >= next[0]){
            current[1] = Math.max(current[1], next[1]);
        } else {
            optimisedBookings.push(current);
            current = next;
        }
    }
    optimisedBookings.push(current);
    return optimisedBookings;
}

export default optimiseBookings;




// Test cases
console.log("Overlapping bookings");
console.log("Input: [[1, 3], [2, 6], [8, 10], [15, 18]]");
console.log("Expected Output: [[1, 6], [8, 10], [15, 18]]");
console.log("Output: ", optimiseBookings([[1, 3], [2, 6], [8, 10], [15, 18]]));

console.log("\n");

console.log("Non-overlapping bookings");
console.log("Input: [[1, 2], [3, 4], [5, 6], [7, 8]]");
console.log("Expected Output: [[1, 2], [3, 4], [5, 6], [7, 8]]");
console.log("Output: ", optimiseBookings([[1, 2], [3, 4], [5, 6], [7, 8]]));

console.log("\n");

console.log("Consecutive bookings");
console.log("Input: [[1, 2], [2, 3], [3, 4], [4, 5]]");
console.log("Expected Output: [[1, 5]]");
console.log("Output: ", optimiseBookings([[1, 2], [2, 3], [3, 4], [4, 5]]));

console.log("\n");

console.log("Empty list of bookings");
console.log("Input: []");
console.log("Expected Output: []");
console.log("Output: ", optimiseBookings([]));




