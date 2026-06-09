export const authenticatedFetch = async (url, options = {}, token, handleLogout, openLoginModal) => {
    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
        handleLogout();
        openLoginModal();
        throw new Error('Unauthorized');
    }
    return res;
};
