import { Machine, moveMachine } from "@/types/machine";

export async function getMoveMachines(moveMachines: moveMachine[]): Promise<Machine[]> {
  const svMachines = moveMachines.filter(
    (machine: moveMachine) => machine.version_group.name === "scarlet-violet"
  );

  const machineItems = await Promise.all(
    svMachines.map(async (machine: moveMachine) => {
      const res = await fetch(machine.machine.url);
      if (!res.ok) return null;
      const machineData = await res.json();
      return machineData;
    })
  );

  return machineItems.filter(Boolean);
}