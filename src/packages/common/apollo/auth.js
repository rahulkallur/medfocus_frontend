import jwt_decode from "jwt-decode";

const performAuthentication = async(args) => {
  if (args) {
    let encodeToken = args;
    let decodeToken = jwt_decode(encodeToken);
    console.log("decodeToken",decodeToken)
    if (decodeToken) {
        let decodeTokenKeys = Object.keys(decodeToken);
        for(let i in decodeTokenKeys){
            localStorage.setItem(decodeTokenKeys[i],decodeToken[decodeTokenKeys[i]])
        }
        localStorage.setItem("token",args)
        return true;
    }
  }
  if (!args) {
    return false;
  }
};

const performUnauthentication = async(args) => {
  localStorage.clear()
  return true
}

export default {performAuthentication,performUnauthentication};
