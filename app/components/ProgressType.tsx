export function ProgressType(props: { label: string, current: number, total: number, done: boolean, notStarted: boolean }) {
	return (
		<div className="flex align-center gap-1.5 min-w-max font-bold">
			<img
				src={`/fontawesome/${(props.notStarted ? "circle-regular" : (props.done ? "check-solid" : "spinner-solid"))}.svg`}
				className={`w-4 inline ${(!props.notStarted && !props.done ? "animate-spin" : "")}`}
			/>
			<p>{props.label}</p>
			<p className="ml-auto">{(props.done ? "Done" : (props.notStarted ? "Waiting" : <>{props.current}/{props.total}</>))}</p>
		</div>
	)
}