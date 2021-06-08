const _ = require('lodash');

const colors = {
    reset: '\033[0m',

    //text color

    black: '\033[30m',
    red: '\033[31m',
    green: '\033[32m',
    yellow: '\033[33m',
    blue: '\033[34m',
    magenta: '\033[35m',
    cyan: '\033[36m',
    white: '\033[37m',

    //background color

    blackBg: '\033[40m',
    redBg: '\033[41m',
    greenBg: '\033[42m',
    yellowBg: '\033[43m',
    blueBg: '\033[44m',
    magentaBg: '\033[45m',
    cyanBg: '\033[46m',
    whiteBg: '\033[47m'
}
const seat_details = {
    asile: {
        grade: 'A',
        text: 'A',
        color: colors.white,
        background: colors.blueBg
    },
    middle: {
        grade: 'C',
        text: 'M',
        color: colors.white,
        background: colors.redBg
        
    },
    window: {
        grade: 'B',
        text: 'W',
        color: colors.white,
        background: colors.greenBg
    }
}

const seat_rev_mapping = {
    'A': 'asile',
    'B': 'window',
    'C': 'middle'
}
class AirPlaneSeatManagement{
    constructor(seat_structure){
        const me = this;
        if(!_.isArray(seat_structure)){
            throw "Seat structure should be an array."
        }
        me.max_col_size = 0;
        me.max_row_size = 0;
        me.compartment_size = seat_structure.length;
        me.seat_structure = _.cloneDeep(seat_structure);
        me.allocation_map = me.initizializeSeatAllocationMap();
        me.seats_by_order = me.arrangeSeats();
    }

    initizializeSeatAllocationMap(){
        const me = this;
        let allocation_map = [];
        me.seat_structure.forEach((seat_matrix,index)=>{
            try {
                allocation_map[`${index}`] ={};
                let { row, column } = me.getRowAndColumnSize(seat_matrix);
                if(me.max_col_size < column){
                    me.max_col_size = column;
                }
                if(me.max_row_size < row){
                    me.max_row_size = row;
                }
                for(let i=0;i<row;i++){
                    allocation_map[`${index}`][`${i}`] = {};
                    for(let j=0;j<column;j++){
                        allocation_map[`${index}`][`${i}`][`${j}`] = {};
                    }
                }
                
            }
            catch(err){
                throw err;
            }
        });
        return _.cloneDeep(allocation_map);
    }

    getRowAndColumnSize(seat_matrix){
        if(seat_matrix.length != 2){
            throw "Array of array accepts length of two only." 
        }
        let column = seat_matrix[0];
        let row = seat_matrix[1];
        if(_.isNumber(row)&&_.isNumber(column)){
            return {row,column};
        }
        else{
            throw "Array of array accepts numbers only."
        }
    }

    getPlaneSeatArrangement(){
        const me = this;
        return me.allocation_map;
    }

    printSeatArrangement(){
        const me = this;
        let tpl = 'color:';
        me.seat_structure.forEach((seat_matrix,index)=>{
            let { row, column } = me.getRowAndColumnSize(seat_matrix);
            for (let i = 0; i < row; i++) {
                let str = '';
                for (let j = 0; j < column; j++) {
                    let { seat_type, passenger_id } = me.allocation_map[`${index}`][`${i}`][`${j}`];
                    let seat_attribute = seat_details[seat_rev_mapping[seat_type]];
                    str = str + `${seat_attribute.background}${seat_attribute.color}${seat_attribute.text}-${passenger_id}${colors.reset}\t`;
                }
                console.log(`${str}\n`);
            }
            console.log(`\n`);
        })
    }

    arrangeSeats(){
        const me = this;
        let seat_numbers = [];
        me.seat_structure.forEach((seat_matrix,index)=>{
            try {
                let { row, column } = me.getRowAndColumnSize(seat_matrix);
                for (let i = 0; i < row; i++) {
                    for (let j = 0; j < column; j++) {
                        let seat_type_detected = seat_details.middle.grade;
                        if ((index == 0 && j == 0) || (index == me.seat_structure.length - 1 && j == column - 1)) {
                            seat_type_detected = seat_details.window.grade;
                        }
                        if ((seat_type_detected != seat_details.window.grade) && (j == 0 || j == column - 1)) {
                            seat_type_detected = seat_details.asile.grade;
                        }
                        let weightage = `${i+1}`.padStart(me.max_row_size.toString().length,'0');
                        let compartment_number =  `${index}`.padStart(me.compartment_size.toString().length,'0');
                        let row_number = `${i}`.padStart(me.max_row_size.toString().length,'0');
                        let col_number = `${j}`.padStart(me.max_col_size.toString().length,'0');
                        let seat_number = `${seat_type_detected}-${weightage}-${compartment_number}-${row_number}-${col_number}`;
                        seat_numbers.push(seat_number);
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
        return _.cloneDeep(_.sortBy(seat_numbers));
    }

    assignSeatToPassengers(no_of_passengers){
        const me = this;
        let passenger_index = 0;
        let passenger_id = 0;
        for(let i =0;i<me.seats_by_order.length;i++){
            let seat_number = me.seats_by_order[i];
            let splited_seat_number = seat_number.split('-'); 
            let seat_type = splited_seat_number[0];
            let compartment = parseInt(splited_seat_number[2]).toString();
            let row = parseInt(splited_seat_number[3]);
            let column = parseInt(splited_seat_number[4]);
            if(passenger_index<no_of_passengers){
                passenger_id = passenger_index = passenger_index+1;
            }
            else{
                passenger_id = 0;
            }
            me.allocation_map[compartment][row][column] = {
                seat_type,
                passenger_id
            };
            
        }
    }
    
    getAllSeatnumbers(){
        const me = this;
        return me.seats_by_order;
    }
}

let seat_structure = [ [3,2], [4,3], [2,3], [3,4] ];
//let seat_structure = [ [3,13], [13,3] ];
//let seat_structure = [ [10,20], [20,10] ];
let no_of_passengers = 30;
let seating_manager = new AirPlaneSeatManagement(seat_structure);
seating_manager.assignSeatToPassengers(no_of_passengers);
seating_manager.printSeatArrangement();
