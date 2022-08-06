export const LoadingReducer = (prevState={
    isLoading:false
},action)=>{
        // console.log(action)
    let {type,payload} =action

    switch(type){
        case "change-loading":
            let newstate = {...prevState}
            newstate.isLoading = payload
            return newstate
        default:
            return prevState
    }
}