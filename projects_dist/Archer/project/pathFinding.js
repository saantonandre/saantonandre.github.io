// Start location will be in the following format:
// [distanceFromTop, distanceFromLeft]
function findShortestPath(startCoordinates, grid) {
    var distanceFromTop = startCoordinates[0];
    var distanceFromLeft = startCoordinates[1];

    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    var location = {
        distanceFromTop: distanceFromTop,
        distanceFromLeft: distanceFromLeft,
        path: [],
        status: 'Start'
    };

    // Initialize the queue with the start location already inside
    var queue = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
        // Take the first location off the queue
        var currentLocation = queue.shift();

        // Explore l
        let newLocation = exploreInDirection(currentLocation, 'l', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore d
        newLocation = exploreInDirection(currentLocation, 'b', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore r
        newLocation = exploreInDirection(currentLocation, 'r', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }

        // Explore u
        newLocation = exploreInDirection(currentLocation, 't', grid);
        if (newLocation.status === 'Goal') {
            return newLocation.path;
        } else if (newLocation.status === 'Valid') {
            queue.push(newLocation);
        }
    }

    // No valid path found
    return false;

}

// This function will check a location's status
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
function locationStatus(location, grid) {
    var gridSize = grid.length;
    var dft = location.distanceFromTop;
    var dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize) {

        // location is not on the grid--return false
        return 'Invalid';
    } else if (grid[dft][dfl] === 'Goal') {
        return 'Goal';
    } else if (grid[dft][dfl] !== 'Empty') {1
        // location is either an obstacle or has been visited
        return 'Blocked';
    } else {
        return 'Valid';
    }
}


// Explores the grid from the given location in the given
// direction

//r = right
//d = down
//l = left
//u = up
function exploreInDirection(currentLocation, direction, grid) {
    var newPath = currentLocation.path.slice();
    newPath.push(direction);

    var dft = currentLocation.distanceFromTop;
    var dfl = currentLocation.distanceFromLeft;

    if (direction === 'l') {
        dft -= 1;
    } else if (direction === 'b') {
        dfl += 1;
    } else if (direction === 'r') {
        dft += 1;
    } else if (direction === 't') {
        dfl -= 1;
    }

    var newLocation = {
        distanceFromTop: dft,
        distanceFromLeft: dfl,
        path: newPath,
        status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, grid);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
        grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }

    return newLocation;
}

