import { Entity } from "@multi/models";

export type Action = {
  type: "CREATE_ENTITY";
  entity: Entity;
};
