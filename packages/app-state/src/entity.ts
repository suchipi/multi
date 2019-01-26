export type Entity = {
  components: {
    position: void | {
      x: number;
      y: number;
    };
    color: void | string;
  };
};
