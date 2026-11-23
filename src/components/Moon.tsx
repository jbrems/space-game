import { useContext } from "react";
import { GameContext } from "../app/GameContext";

export function Moon() {
  const gameContext = useContext(GameContext);

  return <div className={`absolute left-1/2 -translate-x-1/2 transition-position duration-3000 size-96 rounded-full bg-gray-300 dark:bg-gray-700 ${gameContext.mission.success ? 'top-1/2 -translate-y-[calc(50%+238px)]' : '-top-96'}`} />;
}