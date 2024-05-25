

export default function ThumbnailBox(props: { name: string, thumb: string }) {

	return (
		<div
			className="flex flex-col w-max text-center align-center bg-gray-300 rounded-2xl border-2 border-gray-400 px-1 py-1 min-w-max"
		>
			<div className="rounded-xl mx-auto overflow-hidden bg-gray-400 flex align-center justify-center"
				style={{ width: "100px", height: "50px" }}	
			>
				{props.thumb &&
					<img src={props.thumb} width={100} height={50}/>
				}
				{!props.thumb &&
					<img
						src='/fontawesome/spinner-solid.svg'
						className='w-4 inline animate-spin'
					/>
				}
			</div>
			<p className="text-xs mt-1">{props.name}</p>
		</div>
	);


}