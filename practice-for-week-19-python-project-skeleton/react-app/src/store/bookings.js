// constants
const REMOVE = "bookings/REMOVE";
const GET_ALL = "bookings/GET_ALL";
const GET_ONE = "bookings/GET_ONE";
const ADD_UPDATE = "bookings/ADD_UPDATE";

const getAll = (bookings) => ({
  type: GET_ALL,
  bookings,
});

const getOne = (booking) => {
  return {
    type: GET_ONE,
    booking,
  };
};

const addOrUpdate = (booking) => {
  return {
    type: ADD_UPDATE,
    booking,
  };
};

const remove = (bkgId) => ({
  type: REMOVE,
  bkgId,
});

// get all listed bookings
export const getAllBookings = () => async (dispatch) => {
  const response = await fetch("/api/bookings");
  if (response.ok) {
    const data = await response.json();
    dispatch(getAll(data));
  }
  return response;
};

// get one booking
export const getOneBooking = (bkgId) => async (dispatch) => {
  const response = await fetch(`/api/bookings/${bkgId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getOne(data));
  }
  return response;
};

// create a booking
export const createOneBooking = (expId, payload) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/bookings`, {
    methods: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const booking = await response.json();
    dispatch(addOrUpdate(booking));
  }
  return response;
};

// update a booking
export const updateOneBooking = (bkgId, payload) => async (dispatch) => {
  const response = await fetch(`/api/bookings/${bkgId}`, {
    methods: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const booking = await response.json();
    dispatch(addOrUpdate(booking));
  }
  return response;
};

// delete an booking
export const deleteSong = (bkgId) => async (dispatch) => {
  const response = await fetch(`/api/bookings/${bkgId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(bkgId));
  }
};

const initialState = { oneBooking: {} };

const bookingReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL:
      newState = { ...state };
      action.bookings.forEach((bkg) => {
        newState[bkg.id] = bkg;
      });
      return newState;
    case GET_ONE:
      return {
        ...state,
        oneBooking: { ...action.booking },
      };
    case ADD_UPDATE:
      if (!state[action.booking.id]) {
        newState = { ...state };
        newState[action.booking.id] = action.booking;
        return newState;
      }
      return {
        ...state,
        [action.booking.id]: {
          ...state[action.booking.id],
          ...action.booking,
        },
      };
    case REMOVE:
      newState = { ...state };
      delete newState[action.bkgId];
      return newState;
    default:
      return state;
  }
};

export default bookingReducer;
