export const BASE_URL = "http://localhost:3000"
export const setHeader = (token:string)=>{
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}