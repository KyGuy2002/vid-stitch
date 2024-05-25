export default function CtaButton(props: { text: string, disabled?: boolean, sub?: boolean, onClick?: any }) {

	return (
		<button disabled={props.disabled} onClick={() => props.onClick()}
			className={`block ${(props.disabled ? 'bg-gray-300' : (props.sub ? 'bg-gray-500' : 'bg-blue-800'))} ${(props.disabled ? 'text-gray-400' : 'text-white')} p-2 rounded-2xl w-full font-semibold upper mt-2 cursor-pointer`}
		>
			{props.text}
		</button>
	);


}