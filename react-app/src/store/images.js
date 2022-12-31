// constants
const REMOVE_RVW_IMG = "images/REMOVE_RVW_IMG";
const REMOVE_EXP_IMG = "images/REMOVE_EXP_IMG";
const ADD_UPDATE = "images/ADD_UPDATE";
const UPLOAD = "images/UPLOAD";

const addOrUpdate = (image) => {
  return {
    type: ADD_UPDATE,
    image,
  };
};

const uploadRvwImg = (image) => {
  return {
    type: UPLOAD,
    image,
  };
};

const removeExpImg = (imgId) => ({
  type: REMOVE_EXP_IMG,
  imgId,
});

const removeRvwImg = (imgId) => ({
  type: REMOVE_RVW_IMG,
  imgId,
});

// create an experience image
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

// // upload a review image
// export const uploadRvwImage = (rvwId, payload) => async (dispatch) => {
//   const response = await fetch(`/api/reviews/${rvwId}/images`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   console.log(response, "response in thunk");
//   if (response.ok) {
//     const image = await response.json();
//     dispatch(uploadRvwImg(image));
//   }
//   return response;
// };

export const uploadRvwImage = (rvwId, payload) => async (dispatch) => {
  const { review_id, file, newFile } = payload;

  const form = new FormData();
  form.append("file", file);
  form.append("review_id", review_id);
  form.append("newFile", newFile);

  const res = await fetch(`/api/reviews/${rvwId}/images`, {
    method: "POST",
    body: form,
  });

  if (res.ok) {
    const image = await res.json();
    dispatch(uploadRvwImg(image));
  }
};

// delete an exp image
export const deleteExpImage = (expId, imgId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}/images/${imgId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeExpImg(imgId));
  }
};

// delete a rvw image
export const deleteRvwImage = (rvwId, imgId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${rvwId}/images/${imgId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeRvwImg(imgId));
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
        newState.expImages[action.image.id] = action.image;
        return newState;
      }
    case UPLOAD:
      if (!state[action.image.id]) {
        newState = { ...state };
        newState.rvwImages[action.image.id] = action.image;
        return newState;
      } else {
        newState = { ...state };
        newState.rvwImages[action.image.id] = action.image;
        return newState;
      }
    case REMOVE_EXP_IMG:
      newState = { ...state };
      delete newState.expImages[action.imgId];
      return newState;
    case REMOVE_RVW_IMG:
      newState = { ...state };
      delete newState.rvwImages[action.imgId];
      return newState;
    default:
      return state;
  }
};

export default imageReducer;
