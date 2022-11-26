// constants
const REMOVE = "experiences/REMOVE";
const GET_ALL = "experiences/GET_ALL";
const GET_ONE = "experiences/GET_ONE";
const ADD_UPDATE = "experiences/ADD_UPDATE";

const getAll = (experiences) => ({
  type: GET_ALL,
  experiences,
});

const getOne = (exp) => {
  return {
    type: GET_ONE,
    exp,
  };
};

const addOrUpdate = (exp) => {
  return {
    type: ADD_UPDATE,
    exp,
  };
};

const remove = (expId) => ({
  type: REMOVE,
  expId,
});

// get all listed experiences
export const getAllExperiences = () => async (dispatch) => {
  const response = await fetch("/api/experiences");
  if (response.ok) {
    const data = await response.json();
    dispatch(getAll(data));
  }
  return response;
};

// get one experiences
export const getOneExperience = (expId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getOne(data));
  }
  return response;
};

// create an experiences
export const createOneExperience = (payload) => async (dispatch) => {
  const response = await fetch(`/api/experiences`, {
    methods: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const experience = await response.json();
    dispatch(addOrUpdate(experience));
  }
  return response;
};

// update an experiences
export const updateOneExperience = (expId, payload) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}`, {
    methods: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    const experience = await response.json();
    dispatch(addOrUpdate(experience));
  }
  return response;
};

// delete an experience
export const deleteExperience = (expId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(remove(expId));
  }
};

const initialState = { oneExperience: {} };

const experienceReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL:
      newState = { ...state };
      action.experiences.forEach((exp) => {
        newState[exp.id] = exp;
      });
      return newState;
    case GET_ONE:
      return {
        ...state,
        oneExperience: { ...action.exp },
      };
    case ADD_UPDATE:
      if (!state[action.exp.id]) {
        newState = { ...state };
        newState[action.exp.id] = action.exp;
        return newState;
      }
      return {
        ...state,
        [action.exp.id]: {
          ...state[action.exp.id],
          ...action.exp,
        },
      };
    case REMOVE:
      newState = { ...state };
      delete newState[action.expId];
      return newState;
    default:
      return state;
  }
};

export default experienceReducer;
