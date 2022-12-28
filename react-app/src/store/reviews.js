// constants
const REMOVE = "reviews/REMOVE";
const GET_ALL = "reviews/GET_ALL";
const GET_ONE = "reviews/GET_ONE";
const USER_RVWS = "reviews/USER_rvwS";
const ADD_UPDATE = "reviews/ADD_UPDATE";

const getAll = (reviews) => ({
  type: GET_ALL,
  reviews,
});

const getUserRvws = (reviews) => {
  return {
    type: USER_RVWS,
    reviews,
  };
};

const getOne = (rvw) => {
  return {
    type: GET_ONE,
    rvw,
  };
};

const addOrUpdate = (rvw) => {
  return {
    type: ADD_UPDATE,
    rvw,
  };
};

const remove = (rvwId) => ({
  type: REMOVE,
  rvwId,
});

// get all reviews by expId
export const getAllReviews = (expId) => async (dispatch) => {
  const response = await fetch(`/api/${expId}/reviews`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getAll(data));
  }
  return response;
};

// // get user reviews
// export const getUserReviews = (userId) => async (dispatch) => {
//   const response = await fetch(`/api/users/${userId}/reviews`);
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(getUserRvws(data));
//   }
//   return response;
// };

// get one review
export const getOneReview = (expId, rvwId) => async (dispatch) => {
  const response = await fetch(`/api/${expId}/reviews/${rvwId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getOne(data));
  }
  return response;
};

// create a review
export const createOneReview = (payload, expId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(addOrUpdate(review));
  }
  return response;
};

// update a review
export const updateOneReview = (expId, rvwId, payload) => async (dispatch) => {
  const response = await fetch(`/api/${expId}/reviews/${rvwId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const review = await response.json();
    dispatch(addOrUpdate(review));
  }
  return response;
};

// delete an review
export const deleteReview = (expId, rvwId) => async (dispatch) => {
  const response = await fetch(`/api/${expId}/reviews/${rvwId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(rvwId));
  }
};

const initialState = {
  reviews: {},
  oneReview: {},
};

const reviewReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL:
      newState = { ...state };
      action.reviews.forEach((rvw) => {
        newState.reviews[rvw.id] = rvw;
      });
      return newState;
    case GET_ONE:
      return {
        ...state,
        oneReview: { ...action.rvw },
      };
    case ADD_UPDATE:
      if (!state.reviews[action.rvw.id]) {
        newState = { ...state };
        newState.reviews[action.rvw.id] = action.rvw;
        return newState;
      } else {
        newState = { ...state };
        newState.reviews[action.rvw.id] = action.rvw;
        return newState;
      }
    case REMOVE:
      newState = { ...state };
      delete newState[action.rvwId];
      return newState;
    default:
      return state;
  }
};

export default reviewReducer;