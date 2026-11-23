import { useContext } from "react";
import { GameContext } from "../app/GameContext";

export function Earth() {
  const gameContext = useContext(GameContext);

  return <div className={`size-[5000px] rounded-full bg-blue-500 dark:bg-blue-700 absolute left-1/2 -translate-x-1/2 ${gameContext.mission.liftOff ? 'top-[100%]' : 'top-[calc(50%+45px)]'} transition-position duration-5000`} />;
}