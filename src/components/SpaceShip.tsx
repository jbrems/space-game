import { useContext } from "react";
import { GameContext } from "../app/GameContext";

export function SpaceShip() {
  const gameContext = useContext(GameContext);

  return <span className={`text-[100px] ${gameContext.mission.landing ? 'rotate-135' : '-rotate-45'} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-3000`}>
    {gameContext.mission.kaboom ? '💥' : '🚀'}
  </span>
}