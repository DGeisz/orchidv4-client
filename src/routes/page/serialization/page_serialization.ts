import { FeatureSocketSerialization } from "./feature_socket_serialization";

export interface PageSerialization {
    feature_tree: FeatureSocketSerialization;
    page_id: String;
}
