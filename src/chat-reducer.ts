import { api } from "./api/api";

const SET_MESSAGES = "chat-reducer/set-messages";
const ADD_MESSAGES = "chat-reducer/add-message";
const ADD_TYPING_USER = "chat-reducer/add-typing-user";

export const createConnection = (): any => (dispatch: any) => {
  api.createConnection();
  api.subscribe(
    (messages) => {
      dispatch(setMessages(messages));
    },
    (message) => {
      dispatch(addMessage(message));
    },
    (user) => {
      dispatch(addTypingUser(user));
    }
  );
};
export const destroyConnection = (): any => (dispatch: any) => {
  api.destroyConnection();
};
export const sendName =
  (name: string): any =>
  (dispatch: any) => {
    api.sendName(name);
  };
export const sendMessage =
  (message: string): any =>
  (dispatch: any) => {
    api.sendMessage(message);
  };
export const typeMessage = (): any => (dispatch: any) => {
  api.typeMessage();
};

const initialState: InitialState = {
  messages: [],
  typingUsers: [],
};

export const chatReducer = (
  state = initialState,
  action: ActionsType
): InitialState => {
  switch (action.type) {
    case SET_MESSAGES: {
      return { ...state, messages: action.payload.messages };
    }
    case ADD_MESSAGES: {
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
        typingUsers: state.typingUsers.filter(
          (u) => u.id !== action.payload.message.user.id
        ),
      };
    }
    case ADD_TYPING_USER: {
      return {
        ...state,
        typingUsers: [
          ...state.typingUsers.filter((u) => u.id !== action.payload.user.id),
          action.payload.user,
        ],
      };
    }
    default:
      return state;
  }
};

export const setMessages = (messages: Message[]) =>
  ({
    type: SET_MESSAGES,
    payload: { messages },
  } as const);
export const addMessage = (message: Message) =>
  ({
    type: ADD_MESSAGES,
    payload: { message },
  } as const);
export const addTypingUser = (user: User) =>
  ({
    type: ADD_TYPING_USER,
    payload: { user },
  } as const);

//type
type ActionsType =
  | ReturnType<typeof setMessages>
  | ReturnType<typeof addMessage>
  | ReturnType<typeof addTypingUser>;

export type InitialState = {
  messages: Message[];
  typingUsers: User[];
};

export type Message = {
  id: number;
  message: string;
  user: User;
};
export type User = {
  id: number;
  name: string;
};
