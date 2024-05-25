

export default function ThumbnailBox(props: { name: string, thumb: string }) {

	return (
		<div
			key={props.name}
			className="flex flex-col w-max text-center align-center bg-gray-300 rounded-2xl border-2 border-gray-400 px-3 py-2 min-w-max"
		>
			<img src={props.thumb} width={120}
				className="rounded-2xl mx-auto"
			/>
			<p className="text-xs mt-1">{props.name}</p>
		</div>
	);


}