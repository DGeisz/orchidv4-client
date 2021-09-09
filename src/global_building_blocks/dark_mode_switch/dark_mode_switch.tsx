import React, { useEffect, useState } from "react";
import "./dms_styles.scss";
import { disable, enable } from "darkreader";

const DarkModeSwitch: React.FC = () => {
    const [is_dark, set_dark] = useState<boolean>(true);

    useEffect(() => {
        enable({
            brightness: 100,
            contrast: 90,
            sepia: 10,
        });
    }, []);

    return (
        <div
            className="slider-container"
            onClick={() =>
                set_dark((is_dark) => {
                    const new_dark = !is_dark;

                    if (new_dark) {
                        enable({
                            brightness: 100,
                            contrast: 90,
                            sepia: 10,
                        });
                    } else {
                        disable();
                    }

                    return new_dark;
                })
            }
        >
            <div className="slider-abs-container">
                <div className="emoji-container">🌜</div>
                <div className="emoji-container">🌞</div>
            </div>
            <div className={`slider ${!is_dark ? "" : "slider-right"}`} />
        </div>
    );
};

export default DarkModeSwitch;
