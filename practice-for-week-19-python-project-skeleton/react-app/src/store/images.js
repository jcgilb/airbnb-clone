// constants
const REMOVE = "images/REMOVE";
const GET_ALL = "images/GET_ALL";
const GET_ONE = "images/GET_ONE";
const ADD_UPDATE = "images/ADD_UPDATE";

const addOrUpdate = (image) => {
  return {
    type: ADD_UPDATE,
    image,
  };
};

const remove = (imgId) => ({
  type: REMOVE,
  imgId,
});

// create a image
export const ceateExpImage = (expId, payload) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const image = await response.json();
    dispatch(addOrUpdate(image));
  }
  return response;
};

// delete an image
export const deleteimage = (expId, imgId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/images/${imgId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(imgId));
  }
};

const initialState = { rvwImages: {}, expImages: {} };

const imageReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_UPDATE:
      if (!state[action.image.id]) {
        newState = { ...state };
        newState.expImages[action.image.id] = action.image;
        return newState;
      } else {
        newState = { ...state };
        newState.expImages[action.exp.id] = action.image;
        return newState;
      }
    case REMOVE:
      newState = { ...state };
      delete newState.expImages[action.imgId];
      return newState;
    default:
      return state;
  }
};

export default imageReducer;
