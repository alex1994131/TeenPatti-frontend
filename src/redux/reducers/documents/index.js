const initialState = {
  documentsData: [],
  roomData: null,
  playersData: [],
  myData: null,
  totalPlayer:0,
  currentPlayer:0,
  newTime:0,
}
const documents = (state = initialState, action) => {
  switch (action.type) {
    case "DOCUMNETS_DATA": {
      return { ...state, documentsData: action.payload }
    }
    case "TOTALUSER_COUNT": {
      return { ...state, totalPlayer: action.totalPlayer, currentPlayer:action.currentPlayer }
    }
    case "ROOM_DATA": {
      return { ...state, roomData: action.roomData, playersData:action.playersData, myData:action.myData, newTime:action.newTime }
    }
    default: {
      return state
    }
  }
}

export default documents