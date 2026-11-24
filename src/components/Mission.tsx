import { useContext, useState } from "react";
import { GameContext } from "../app/GameContext";
import { delay, randomHexId } from "../utils";

export function Mission() {
  const gameContext = useContext(GameContext);
  const [status, setStatus] = useState('')
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("missionName");

    if (typeof name !== "string" || !name.trim()) {
      setError("Enter a mission name.");
      return;
    }

    const missionName = name.trim().toLowerCase().replace(/\s+/g, "-");
    setError('');
    setStatus('Launching...');
    gameContext.setMission(previous => ({ ...previous, name: name.trim() }));

    try {
      let traceId = randomHexId(32);
      let spanId = randomHexId(16);
      console.log("Launching mission", missionName, traceId, spanId);
      const launchResponse = await fetch("/api/launch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Traceparent": `00-${traceId}-${spanId}-01`,
          "Baggage": `mission-name=${missionName}`,
        },
        body: JSON.stringify({ missionName })
      });
      const launchData = await launchResponse.json();

      traceId = randomHexId(32);
      spanId = randomHexId(16);
      console.log("Coasting mission", missionName, traceId, spanId);
      const coastResponse = await fetch("/api/coast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Traceparent": `00-${traceId}-${spanId}-01`,
          "Baggage": `mission-name=${missionName}`,
        },
        body: JSON.stringify(launchData)
      });
      const coastData = await coastResponse.json();

      traceId = randomHexId(32);
      spanId = randomHexId(16);
      console.log("Landing mission", missionName, traceId, spanId);
      const landResponse = await fetch("/api/land", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Traceparent": `00-${traceId}-${spanId}-01`,
          "Baggage": `mission-name=${missionName}`,
        },
        body: JSON.stringify(coastData)
      });
      const landData = await landResponse.json();

      replayMission(landData.mission);
    } catch (error) {
      console.error("Could not launch mission", error);
      gameContext.setMission(previous => ({ ...previous, name: "" }));
      setStatus('');
      setError("Could not launch mission. Please try again.");
    }
  }

  function replayMission(mission: any) {
    console.log("Replaying mission", mission.name);

    setStatus('Preflight checks...');
    if (mission.steps[0].success < 0.1) gameContext.setMission(previous => ({ ...previous, kaboom: true }));

    delay(1500).then(() => {
      setStatus('Ignition...');
      if (mission.steps[1].success < 0.1) throw new Error('Kaboom')
      return delay(3000);
    }).then(() => {
      setStatus('Lift off...');
      if (mission.steps[2].success < 0.1) throw new Error('Kaboom')
      gameContext.setMission(previous => ({ ...previous, liftOff: true }));
      return delay(3000);
    }).then(() => {
      setStatus('Max Q...');
      if (mission.steps[3].success < 0.1) throw new Error('Kaboom')
      return delay(2000);
    }).then(() => {
      setStatus('Main engine cut off...');
      if (mission.steps[4].success < 0.1) throw new Error('Kaboom')
      return delay(1000);
    }).then(() => {
      setStatus('Stage separation...');
      if (mission.steps[5].success < 0.1) throw new Error('Kaboom')
      return delay(1000);
    }).then(() => {
      setStatus('Second engine ignition...');
      if (mission.steps[6].success < 0.1) throw new Error('Kaboom')
      return delay(2000);
    }).then(() => {
      setStatus('Landing burn...');
      if (mission.steps[7].success < 0.1) throw new Error('Kaboom')
      gameContext.setMission(previous => ({ ...previous, landing: true }));
      return delay(3000);
    }).then(() => {
      setStatus('Landing...');
      if (mission.steps[8].success < 0.1) throw new Error('Kaboom')
      gameContext.setMission(previous => ({ ...previous, success: true }));
      return delay(3000);
    }).then(() => {
      setStatus('Mission complete!');
    }).catch((_) => {
      gameContext.setMission(previous => ({ ...previous, kaboom: true }));
      setStatus('Mission failed!');
    })
  }

  if (!gameContext.mission.name) {
    return <form className="absolute top-[75%] left-1/2 transform -translate-x-1/2 flex gap-4 items-center" onSubmit={handleSubmit}>
      <input type="text" name="missionName" className="text-4xl p-4 leading-1.25 rounded-xl border-2 border-gray-300 text-gray-300" placeholder="Mission name" />
      <button type="submit" className="h-20 border-2 rounded-xl text-4xl p-4 leading-1.25 border-gray-300 text-gray-300 cursor-pointer">Launch</button>
      {error && <span role="alert" className="text-gray-300">{error}</span>}
    </form>
  }

  if (!status) return null;

  return <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 text-4xl p-4 leading-1.25 rounded-xl text-gray-300">
    {status}
  </div>
}