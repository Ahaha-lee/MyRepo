import { CGCheck, CGCheckKEY, CGExamine, CGExamineKEY, CGPutin, CGPutinKEY,Out,OutKEY,OutCheck,OutCheckKEY } from "./storagelist"
import { getLocalStorage,setLocalStorage } from "../localstorage";

export function initialCGcheck() {
    const isExists = getLocalStorage(CGCheckKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGCheckKEY,CGCheck , true)
    }
}
export function initialCGPutin() {
    const isExists = getLocalStorage(CGPutinKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGPutinKEY, CGPutin, true)
    }
}

export function initialCgExamine() {
    const isExists = getLocalStorage(CGExamineKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGExamineKEY, CGExamine, true)
    }
}


export function initialOutcheck() {
    const isExists = getLocalStorage(OutCheckKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(OutCheckKEY,OutCheck , true)
    }
}

export function initialOut() {
    const isExists = getLocalStorage(OutKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(OutKEY,Out , true)
    }
}




