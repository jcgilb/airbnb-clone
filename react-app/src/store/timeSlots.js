// constants
const REMOVE = "slots/REMOVE";
const GET_ALL = "slots/GET_ALL";
// const GET_ONE = "slots/GET_ONE";
const ADD_UPDATE = "slots/ADD_UPDATE";

const getAll = (slots) => ({
  type: GET_ALL,
  slots,
});

// const getOne = (slot) => {
//   return {
//     type: GET_ONE,
//     slot,
//   };
// };

const addOrUpdate = (slot) => {
  return {
    type: ADD_UPDATE,
    slot,
  };
};

const remove = (slotId) => ({
  type: REMOVE,
  slotId,
});

// get all listed slots
export const getAllSlots = (expId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/slots`);
  if (response.ok) {
    const slots = await response.json();
    dispatch(getAll(slots));
  }
  return response;
};

// create a time slot
export const createOneSlot = (expId, newTimeSlot) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTimeSlot),
  });
  if (response.ok) {
    const slot = await response.json();
    dispatch(addOrUpdate(slot));
    return slot;
  }
};

// update a time slot
export const updateOneSlot = (expId, slotId, payload) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/slots/${slotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const slot = await response.json();
    dispatch(addOrUpdate(slot));
  }
  return response;
};

// delete an time slot
export const deleteSlot = (expId, slotId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/slots/${slotId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(slotId));
  }
};

const initialState = {};

const timeSlotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL:
      newState = { ...state };

      action.slots.forEach((slot) => {
        newState[slot.id] = slot;
      });
      return newState;
    case ADD_UPDATE:
      if (!state[action.slot.id]) {
        newState = { ...state };
        newState[action.slot.id] = action.slot;
        return newState;
      }
      return {
        ...state,
        [action.slot.id]: {
          ...state[action.slot.id],
          ...action.slot,
        },
      };
    case REMOVE:
      newState = { ...state };
      delete newState[action.slotId];
      return newState;
    default:
      return state;
  }
};

export default timeSlotReducer;
