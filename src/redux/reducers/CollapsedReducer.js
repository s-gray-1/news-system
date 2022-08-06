export const CollapsedReducer=(prevState={
  isCollapsed:false
},action)=>{
  const newState={...prevState}
  switch (action.type) {
    case "change-collapsed":
      newState.isCollapsed=! newState.isCollapsed
      return newState
    default:
      return prevState
  }
     
}