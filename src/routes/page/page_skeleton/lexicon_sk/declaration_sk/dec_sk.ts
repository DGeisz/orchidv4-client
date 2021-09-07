import { ConstSk } from "./const_sk/const_sk";
import { DefSk } from "./def_sk/def_sk";

type EmptyDec = { tag: "empty" };

export type DecSk = EmptyDec | ConstSk | DefSk;
