import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Container, type ISourceOptions, MoveDirection, OutMode } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";

const ParticlesComponentForSignUp = () => {
	const [, setInit] = useState<boolean>(false);

	useEffect(() => {
		const initParticles = async () => {
			await initParticlesEngine(async (engine) => {
				await loadSlim(engine);
			});
			setInit(true);
		};

		initParticles();
	}, []);

	const particlesLoaded = (): Promise<void> => {
		return Promise.resolve();
	};

	const options: ISourceOptions = useMemo(
		() => ({
			background: {
				color: {
					value: "#000",
				},
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					onClick: {
						enable: true,
						mode: "push",
					},
					onHover: {
						enable: true,
						mode: "repulse",
					},
				},
				modes: {
					push: {
						quantity: 4,
					},
					repulse: {
						distance: 80,
						duration: 0.4,
					},
				},
			},
			particles: {
				color: {
					value: "#ffffff",
				},
				links: {
					color: "#ffffff",
					distance: 60,
					enable: true,
					opacity: 0.5,
					width: 1,
				},
				move: {
					direction: MoveDirection.none,
					enable: true,
					outModes: {
						default: OutMode.out,
					},
					random: false,
					speed: 2,
					straight: false,
				},
				number: {
					density: {
						enable: true,
					},
					value: 500,
				},
				opacity: {
					value: 0.5,
				},
				shape: {
					type: "circle",
				},
				size: {
					value: { min: 2, max: 4 },
				},
			},
			detectRetina: true,
			fullScreen: {
				enable: false,
			},
		}),
		[]
	);

	return (
		<Particles
			id="tsparticles"
			particlesLoaded={particlesLoaded}
			options={options}
			className="absolute -z-10 w-full h-[50%] min-h-[450px]"
		/>
	);
};

export default ParticlesComponentForSignUp;
