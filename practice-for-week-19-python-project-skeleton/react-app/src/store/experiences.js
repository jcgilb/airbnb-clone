// constants
const REMOVE = "session/REMOVE";
const GET_ALL = "session/GET_ALL";
const GET_ONE = "servers/GET_ONE";
const ADD_UPDATE = "session/ADD_UPDATE";

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
export const getOneServer = (expId) => async (dispatch) => {
  const response = await fetch(`/api/experiences/${expId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getOne(data));
  }
  return response;
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
        oneExperience: { ...action.experience },
      };
    case ADD_UPDATE:
      if (!state[action.experience.id]) {
        newState = { ...state };
        newState[action.experience.id] = action.experience;
        return newState;
      }
      return {
        ...state,
        [action.experience.id]: {
          ...state[action.experience.id],
          ...action.experience,
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
