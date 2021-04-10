import { SimulationSettings } from "../models";

interface SalaryControlsProps {
  settings: SimulationSettings
  current: number
  setCurrent: (value: number) => any
  max: number
}

export default function SalaryControls({settings, max, current, setCurrent} : SalaryControlsProps) {

  return <>
    <label>Salaire brut
      <input 
        value={current}
      
      />
    </label>
  </>  
}