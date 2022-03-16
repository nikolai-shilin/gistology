try {
    validateObj({ a: 1 });
} catch (error) {
    console.error(`Invalid input: ${error}`);
}


function validateObj(obj) {
    if (!obj.b) {
        throw new Error('No b in the obj');
    }
}