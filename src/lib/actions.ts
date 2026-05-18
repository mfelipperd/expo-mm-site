export const openChat = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-chat'));
    }
};
