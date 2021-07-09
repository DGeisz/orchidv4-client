import React, { useState } from "react";
import "./feature_socket_styles.scss";
import { FeatureSocketSerialization } from "../../serialization/feature_socket_serialization";
import { NoneValue } from "../../serialization/feature_serialization/feature_serialization";
import { FaPlus, FaTimes } from "react-icons/fa";
import { symbols } from "../../symbols/symbols";

interface Props {
    serialization: FeatureSocketSerialization;
}

const FeatureSocket: React.FC<Props> = (props) => {
    const [buttons_visible, show_buttons] = useState<boolean>(true);

    if (props.serialization.feature === NoneValue) {
        return (
            <div className="empty-feature-socket-container">
                {buttons_visible ? (
                    <>
                        <div className="toggle-container">
                            <div
                                className="toggle-button"
                                onClick={() => show_buttons(false)}
                            >
                                <FaTimes className="toggle-button-icon" />
                            </div>
                        </div>
                        <div className="all-buttons-container">
                            <div className="button-family-container">
                                <div className="button-family-title">
                                    Basic Features
                                </div>
                                <div className="button-family-buttons">
                                    <div className="uni-button">
                                        {symbols.universal}
                                    </div>
                                    <div className="exi-button">
                                        {symbols.existential}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="toggle-container" key="closed">
                        <div
                            className="toggle-button"
                            onClick={() => show_buttons(true)}
                        >
                            <FaPlus className="toggle-button-icon" />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return <div />;
};

export default FeatureSocket;
