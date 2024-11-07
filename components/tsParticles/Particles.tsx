import Particles from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useMemo } from "react";

const ParticlesComp = () => {
	const options: ISourceOptions = useMemo(() => ({}), []);
	return <Particles options={options}></Particles>;
};

export default Particles;
