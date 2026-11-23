import { createContext, type Dispatch, type SetStateAction } from "react";

export type GameContextType = {
  mission: Mission;
  setMission: Dispatch<SetStateAction<Mission>>;
};

export const GameContext = createContext<GameContextType>({
  mission: { name: "", steps: [], kaboom: false, liftOff: false, landing: false, success: false },
  setMission: () => {
    throw new Error("GameContext.Provider is missing");
  },
})

export type Mission = {
  name: string;
  steps: { step: string, success: number }[];
  kaboom: boolean;
  liftOff: boolean;
  landing: boolean;
  success: boolean;
}