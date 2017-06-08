{
    init: function(elevators, floors) {
        //var elevator = elevators[0]; // Let's use the first elevator
        var floorButtonsPressed = {
            "up": [],
            "down": []
        };

        var maxFloor = 7;

        elevators.forEach(function (elevator) {
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                // let's go to all the floors (or did we forget one?)
                //elevator.goToFloor(0);
                //elevator.goToFloor(maxFloor);
            });

            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum);
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (floorNum < maxFloor && floorNum > 0 && floorButtonsPressed[direction].indexOf(floorNum) != -1 && elevator.loadFactor < 1) {
                    elevator.goToFloor(floorNum, true);
                    floorButtonsPressed[direction].splice(floorButtonsPressed[direction].indexOf(floorNum), 1);
                }

            });

            elevator.on("stopped_at_floor", function(floorNum) {
                var nextFloor = elevator.destinationQueue[0];
                if (nextFloor > floorNum) {
                    goingUp(elevator);
                } else {
                    goingDown(elevator);
                }
            })
        });

        function callElevator(floor) {
            let elevatorCalled = false;
            elevators.forEach(function (elevator) {
                if (elevator.destinationQueue.length == 0 && elevatorCalled === false) {
                    console.log('going to floor', floor);
                    elevator.goToFloor(floor);
                    elevatorCalled = true;
                }
            })
        }

        function goingUp (elevator) {
            if (elevator.currentFloor < maxFloor) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            }
        }

        function goingDown (elevator) {
            if (elevator.currentFloor > 0) {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            }
        }


        floors.forEach(function (floor) {
            floor.on("up_button_pressed", function() {
                if (floorButtonsPressed['up'].indexOf(floor.floorNum()) === -1) {
                    floorButtonsPressed['up'].push(floor.floorNum());
                }
                callElevator(floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
                if (floorButtonsPressed['down'].indexOf(floor.floorNum()) === -1) {
                    floorButtonsPressed['down'].push(floor.floorNum());
                }
                callElevator(floor.floorNum());
            });
        });

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}