import SimulationForm from "../components/SimulationForm";

export default function Grid() {

  return <>
    <div style={{ padding: '50px' }}>
      <SimulationForm onSubmit={async (input) => console.log(input)} />
    </div>
  </>
}