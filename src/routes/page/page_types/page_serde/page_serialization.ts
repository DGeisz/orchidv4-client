import { DecSocketSer } from "./lexicon/declaration/dec_serialization";

export interface PageSerialization {
    id: String;
    dec_sockets: DecSocketSer[];
}
