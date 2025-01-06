/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        // Hydration hatası için gerekli ayarlar
        optimizeFonts: true,
        optimizeImages: true,
        scrollRestoration: true,
    },
    // CORS ve API ayarları
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
                ],
            },
        ];
    },
}

module.exports = nextConfig 