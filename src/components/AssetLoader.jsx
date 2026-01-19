import React, { useState, useEffect } from 'react';

const AssetLoader = ({ images, audio, onLoadComplete }) => {
    const [loadedCount, setLoadedCount] = useState(0);
    const totalAssets = (images?.length || 0) + (audio?.length || 0);

    useEffect(() => {
        if (totalAssets === 0) {
            onLoadComplete();
            return;
        }

        let loaded = 0;

        // Preload images
        const imagePromises = (images || []).map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loaded++;
                    setLoadedCount(loaded);
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to load image: ${src}`);
                    loaded++;
                    setLoadedCount(loaded);
                    resolve();
                };
                img.src = src;
            });
        });

        // Preload audio
        const audioPromises = (audio || []).map(src => {
            return new Promise((resolve) => {
                const audioEl = new Audio();
                audioEl.oncanplaythrough = () => {
                    loaded++;
                    setLoadedCount(loaded);
                    resolve();
                };
                audioEl.onerror = () => {
                    console.warn(`Failed to load audio: ${src}`);
                    loaded++;
                    setLoadedCount(loaded);
                    resolve();
                };
                audioEl.src = src;
            });
        });

        Promise.all([...imagePromises, ...audioPromises]).then(() => {
            onLoadComplete();
        });
    }, [images, audio, totalAssets, onLoadComplete]);

    return null; // This component doesn't render anything
};

export default AssetLoader;
