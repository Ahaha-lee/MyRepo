// useSession.js
const useSession = () => {
    // 存储用户会话
    const handleSession = (user) => {
        localStorage.setItem("session", JSON.stringify(user));
    }

    // 获取用户会话
    const getSession = () => {
        const session = localStorage.getItem("session");
        return session ? JSON.parse(session) : null;
    }

    return { handleSession, getSession};
}

export default useSession;
