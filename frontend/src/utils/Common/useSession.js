

const useSession = () => {

    const handleSession = (user) => {
        localStorage.setItem("session", JSON.stringify(user));
    }

    const getSession = () => {
        
        if (!localStorage.getItem("session")) {
            return null;
        }
        return JSON.parse(localStorage.getItem("session"));
    }

    return {handleSession, getSession}
}

export default useSession;