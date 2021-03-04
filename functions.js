/**
 * 
 * @param {array} array 
 * @param {function} callback - args (index)
 */
function loop(array, callback) {
    // Cycle through the ArrayList backwards b/c we are deleting
    for (let i = array.length - 1; i >= 0; i--) {
        callback(i)
      }    
}
