'use client'

import { useState } from "react";
import { Earth } from "../components/Earth";
import { Mission } from "../components/Mission";
import { Moon } from "../components/Moon";
import { SpaceShip } from "../components/SpaceShip";
import { GameContext, type Mission as MissionData } from "./GameContext";

export function SpaceGame() {
  const [mission, setMission] = useState<MissionData>({ name: "", steps: [], kaboom: false, liftOff: false, landing: false, success: false });

  return <GameContext.Provider value={{ mission, setMission }}>
    <div className="overflow-hidden h-screen [&>*]:shrink-0">
      <SpaceShip />
      <Moon />
      <Earth />
      <Mission />
    </div>
  </GameContext.Provider>
}