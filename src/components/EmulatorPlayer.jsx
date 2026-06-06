import { useEffect, useRef } from "react";

export default function EmulatorPlayer({ game, onClose }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!game?.rom_url || !game?.emulator_core) return;

        // Clear any previous instance
        const container = document.getElementById("emulator-container");
        if (container) container.innerHTML = "";

        // Set EmulatorJS global config
        window.EJS_player           = "#emulator-container";
        window.EJS_core             = game.emulator_core;
        window.EJS_gameUrl          = game.rom_url;
        window.EJS_pathtodata       = "https://cdn.emulatorjs.org/stable/data/";
        window.EJS_startOnLoad      = true;
        window.EJS_fullscreenOnLoad = false;
        window.EJS_Buttons          = { playPause: true, restart: true, mute: true, settings: true, fullscreen: true };

        // Dynamically inject the loader script
        const script       = document.createElement("script");
        script.src         = "https://cdn.emulatorjs.org/stable/data/loader.js";
        script.async       = true;
        document.body.appendChild(script);

        return () => {
            script.remove();
            // Clean up globals
            [
                "EJS_player","EJS_core","EJS_gameUrl","EJS_pathtodata",
                "EJS_startOnLoad","EJS_fullscreenOnLoad","EJS_Buttons","EJS_emulator"
            ].forEach(k => delete window[k]);
        };
    }, [game]);

    if (!game) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white shrink-0">
                <h2 className="font-semibold text-sm">{game.title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                    ×
                </button>
            </div>

            {/* Emulator container */}
            <div className="flex-1 bg-black">
                <div
                    id="emulator-container"
                    ref={containerRef}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );
}