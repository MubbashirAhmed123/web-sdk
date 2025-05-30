export const getDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/.test(ua)) return { deviceType: 'Mobile' };
    if (/ipad|tablet|kindle/.test(ua)) return { deviceType: 'Tablet' };
    return { deviceType: 'Desktop' };
};


export const detectPlatform = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return 'iOS';
    if (/android/i.test(ua)) return 'Android';
    return 'Web';
};

export function isSimulator() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const simulatorKeywords = [
        'simulator', 'emulator', 'virtual', 'android sdk built for x86', 'google_sdk',
        'build/generic', 'genymotion', 'x86', 'sdk', 'nox', 'vbox', 'test-keys'
    ];
    return simulatorKeywords.some(keyword => userAgent.includes(keyword) || platform.includes(keyword));
}

export const madeInfo = () => ({ simulator: isSimulator() });