export default function CtaButton(props: { text: string, disabled?: boolean, sub?: boolean, onClick?: any }) {

	return (
		<button disabled={props.disabled} onClick={() => props.onClick()}
			className={`block bg-${(props.disabled ? 'gray-300' : (props.sub ? 'gray-500' : 'blue-800'))} text-${(props.disabled ? 'gray-400' : 'white')} p-2 rounded-2xl w-full font-semibold upper mt-2 cursor-pointer`}
		>
			{props.text}
		</button>
	);


}