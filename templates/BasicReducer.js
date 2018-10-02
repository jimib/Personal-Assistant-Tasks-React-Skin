import util from 'util';

import {
	/*INJECT:IMPORT_ACTION_TYPE*/
} from '../constants/ActionsConstants';

import {
	CreateReducer
} from '../utils/ReducerUtil';

/*START:INIT_STATE*/
const INITIAL_STATE = {
	
};
/*END:INIT_STATE*/

const reducer = CreateReducer(INITIAL_STATE, {
	
	/*INJECT:REDUCER*/
});

export default reducer;