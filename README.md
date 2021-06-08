# Airplane Seat Managemet.

## Rules for seating
* Always seat passengers starting from the front row to back, starting from the left to the right
* Fill aisle seats first followed by window seats followed by center seats (any order in center seats)
* Input to the program will be
  * a 2D array that represents the rows and columns eg. [ [3,4], [4,5], [2,3], [3,4] ]
  * Number of passengers waiting in queue.

## Logic explanation
* Assign seat number using the following
  * `${seat_type_detected}-${weightage}-${compartment_number}-${row_number}-${col_number}`;
    * seat_type_detected - window, middle, asile
    * weightage - to follow left-to-right arrangemet in all compartments.
    * compartment_number - compartment_number
    Togehter these number form a unique id to a particular seat.
* Sort - Sort the seat_numbers formed to get the order of seat which will get assigned.
* Assign seats to the passenger.

