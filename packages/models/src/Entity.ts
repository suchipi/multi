import { Vec2 } from "./Vec2";

export type Entity = {
  components: {
    position: void | Vec2;
    color: void | string;
  };
};
