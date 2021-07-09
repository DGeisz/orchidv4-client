import { FeatureSocketSerialization } from "../../serialization/feature_socket_serialization";
import { NoneValue } from "../../serialization/feature_serialization/feature_serialization";

export class VirtualFeatureSocket {
    constructor(_socket_serialization: FeatureSocketSerialization) {
        /*
         * TODO: Handle actual constructor when this is creating
         * a tree structure
         */
    }

    serialize(): FeatureSocketSerialization {
        return {
            feature: NoneValue,
        };
    }
}
